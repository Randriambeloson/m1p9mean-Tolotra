class TransformationFactoryBuilder {
    Point;

    constructor() {
        this.Point = Flatten.point;
    }

    /**
     * Traduit le path en polygone
     * @param {Path} element 
     * @returns Array<Point>
     */
    pathToPolygonArray = (element) => {
        let polygon = [];
        for(let instruction of element.attrs.path) {
            if(instruction[0] == 'M' || instruction[0] == 'L') {
                polygon.push([
                    instruction[1],
                    instruction[2]
                ]);
            }
        }
        return polygon;
    }

    /**
     * Traduit le path en polygone
     * @param {Path} element 
     * @returns Array<Point>
     */
     pathToPolygon = (element) => {
        let polygon = [];
        for(let instruction of element.attrs.path) {
            if(instruction[0] == 'M' || instruction[0] == 'L') {
                polygon.push({
                    x: instruction[1],
                    y: instruction[2]
                });
            }
        }
        return polygon;
    }

    /**
    * Traduit le pathstring en polygone
    * @param {string} element 
    * @returns Array<Point>
    */
    pathStringToPolygon = (pathString) => {
        let polygon = [];
        for(let instruction of pathString.split(/[MLZ]/)) {
            if(instruction != '') {
                const [ x, y ] = instruction.split(',');
                polygon.push({
                    x: parseInt(x),
                    y: parseInt(y)
                });
            }
        }
        return polygon;
    }


    /**
     * 
     * @param {Polygon|Array<Array<number>>} polygon 
     * @returns string
     */
    polygonToPathString = (polygon) => {
        if(typeof polygon == 'string') {
            return polygon;
        }
        let pathString = '';
            
        if(polygon.length) {
            if(polygon[0].x != undefined) {
                // Point
                pathString += `M${polygon[0].x},${polygon[0].y}`;
                for(let i=1; i<polygon.length; i++) {
                    pathString += `L${polygon[i].x},${polygon[i].y}`;
                }
            }
            else if(polygon[0][0] != undefined) {
                // Array
                pathString += `M${polygon[0][0]},${polygon[0][1]}`;
                for(let i=1; i<polygon.length; i++) {
                    pathString += `L${polygon[i][0]},${polygon[i][1]}`;
                }
            }
            pathString += 'Z';
        }

        return pathString;
    }

    /**
     * Test si la transformation remplie les conditions
     * @param {*} transform 
     * @param {*} conditions 
     * @returns Boolean
     */
    conditionTest = (transform, conditions) => {
        let conditionFulfilled = true;
        for(let condition of conditions) {
            conditionFulfilled = conditionFulfilled && transform[condition.index] == condition.value;
        }
        return conditionFulfilled;
    }

    /**
     * Retire les transformations de la liste qui remplissent les conditions
     * @param {*} transforms 
     * @param {*} conditions 
     */
    removeTransformation = (transforms, conditions) => {
        let i = 0;
        for(let transform of transforms) {
            if(this.conditionTest(transform, conditions)) {
                transforms.splice(i, 1);
                i--;
            }
            i++;
        }
    }

    transformPoint = (point, t_list) => {
        point = this.Point(point.x, point.y);
        for(let t of t_list) {
            if(t[0] == 't') {
                point = point.translate(t[1], t[2]);
            }
            else if(t[0] == 'r') {
                if(t[2] != undefined) {
                    point = point.rotate(t[1], this.Point(t[2], t[3]));
                }
                else {
                    point = point.rotate(t[1]);
                }
            }
            else if(t[0] == 's') {
                if(t[2] != undefined) {
                    let homothetyCenter = this.Point(t[2], t[3]);
                    let t_incline = {
                        x: (point.x - homothetyCenter.x) * (t[1] - 1),
                        y: (point.y - homothetyCenter.y) * (t[1] - 1)
                    };
                    point = point.translate(t_incline.x, t_incline.y);
                }
            }
        }
        return point;
    }

    invertTransformation = (transformation) => {
        switch(transformation[0]) {
            case 't':
                return this.translationParameter(-transformation[1], -transformation[2]);
            case 'r':
                return this.rotationParameter(-transformation[1], transformation[2], transformation[3]);
            case 's':
                return this.scaleParameter(-transformation[1], -transformation[2], transformation[3], transformation[4])
        }
    }

    getInitTranslation = (relativeTranslation, anchor, scaleX, scaleY) => {
        return GeometryResolver.rotateVector({
            x: relativeTranslation.x / scaleX,
            y: relativeTranslation.y / scaleY
        }, -anchor);
    }

    getRelativeTranslation = (initTranslation, anchor, scaleX, scaleY) => {
        return GeometryResolver.rotateVector({
            x: initTranslation.x * scaleX,
            y: initTranslation.y * scaleY
        }, anchor);
    }

    getInitRotationPoint = (relativeRotationPoint, t_list) => {
        return this.transformPoint(relativeRotationPoint, t_list);
    }

    getInitScalePoint = (relativeScalePoint, t_list) => {
        return this.transformPoint(relativeScalePoint, t_list);
    }

    getRelativeRotationPoint = (initRotationPoint, anchor, scaleX, scaleY, tx, ty) => {
        return {
            x: initRotationPoint.x + tx,
            y: initRotationPoint.y + ty
        }
    }

    scaleParameterFor = (element, scaleX, scaleY, center) => {
        let csx = element.data('scaleX') || 1;
        let csy = element.data('scaleY') || 1;
        let tx = element.data('translateX') || 0;
        let ty = element.data('translateY') || 0;
            
        let sfx = (csx + scaleX) / csx;
        let sfy = (csy + scaleY) / csy;

        if(center != undefined) {
            return this.scaleParameter(sfx, sfy, center.x-tx, center.y-ty);
        }
        else {
            let bcenter = GeometryResolver.getBoundCenter(element.getBBox());
            return this.scaleParameter(sfx, sfy, bcenter.x, bcenter.y);
        }
    }

    translateParameterFor = (element, vector) => {
        let calX = element.data('scaleX') || 1;
        let calY = element.data('scaleY') || 1;

        let anchor = element.data('anchor') || 0;
        let translateVector = this.getInitTranslation(vector, anchor, calX, calY);
        return this.translationParameter(translateVector.x, translateVector.y);
    }

    rotationParameterFor = (element, anchor, center) => {
        let t = {
            x: element.data('translateX') || 0,
            y: element.data('translateY') || 0
        }
        let tx = center.x - t.x;
        let ty = center.y - t.y;

        return this.rotationParameter(anchor, tx, ty);
    }

    scaleParameter = (scaleX, scaleY, x, y) => {
        if(x != undefined && y !=  undefined) {
            return [ 's', scaleX, scaleY, x, y ];
        }
        return [ 's', scaleX, scaleY ];
    }

    translationParameter = (dx, dy) => {
        return [ 't', dx, dy ];
    }

    rotationParameter = (anchor, x, y) => {
        if(x != undefined && y !=  undefined) {
            return [ 'r', anchor, x, y ];
        }
        return [ 'r', anchor ];
    }

    
    transcriptTransform = transforms => {
        let pathString = '';
        for(let transform of transforms) {
            pathString += transform[0];
            pathString += transform.slice(1).join(',');
        }

        return pathString;
    }

    setTransform = (image, transforms) => {
        image.attr({
            transform: this.transcriptTransform(transforms)
        });
    }

}