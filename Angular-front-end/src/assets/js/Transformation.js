const Flatten = window["@flatten-js/core"];

class Transformation {
    type;
    _tranformation_type;
    _params;
    attrs = {
        sx: 1, sy: 1,
        tx: 0, ty: 0,
        anchor: 0
    };

    constructor(params = [
        ['s', 1, 1],
        ['r', 0],
        ['t', 0, 0]
    ], type='normal') {
        if(!Array.isArray(params)) {
            throw new Error('Array of tranformation parameter expected');
        }
        
        this.params = params;
        this.type = type;
    }

    clone() {
        let clone = Object.assign(new Transformation(), this);
        clone.attrs = Object.assign(clone.attrs, this.attrs);
        return clone;
    }

    invert() {
        let params = [
            ['s', 1 / this.attrs.sx, 1 / this.attrs.sy],
            ['r', -this.attrs.anchor],
            ['t', -this.attrs.tx, -this.attrs.ty]
        ];
        let t = new Transformation(params);
        return t;
    }

    getTransformation(real=true) {
        if(real) {
            return [
                this.params[0].slice(),
                this.params[1].slice(),
                this.params[2].slice()
            ];
        }
        else {
            let vector = { x: this.attrs.tx, y: this.attrs.ty };
            let rotated_vector = GeometryResolver.rotateVector(vector, -this.attrs.anchor);
            return [
                this.params[0].slice(),
                this.params[1].slice(),
                ['t', rotated_vector.x / this.attrs.sx, rotated_vector.y / this.attrs.sy]
            ];
        }
    }

    getTransformationString() {
        return this.transcriptTransform(this.getTransformation(false));
    }

    transcriptTransform(params) {
        let pathString = '';
        for(let transform of params) {
            pathString += transform[0];
            pathString += transform.slice(1).join(',');
        }
        return pathString;
    }

    scaleTransformation(scale) {
        let params = [
            Array.from(this.params[0]),
            Array.from(this.params[1]),
            Array.from(this.params[2])
        ];
        params[0][1] *= scale;
        params[0][2] *= scale;
        params[2][1] *= scale;
        params[2][2] *= scale;

        if(params[0][3] && params[0][4]) {
            // Centre fixé de grossissement
        }
        if(params[1][2] && params[1][3]) {
            // Centre de rotation spécifié
        }
        let t = new Transformation(params);
        Object.assign(this, t);
    }

    transformPoints(pts) {
        let resultPoint = pts;
        if(this.scx !== undefined && this.scy !== undefined) {
            resultPoint = Transformation.homothetiePoints(resultPoint, this.attrs.sx, { x: this.attrs.scx, y: this.attrs.scx });
        }
        else {
            resultPoint = Transformation.homothetiePoints(resultPoint, this.attrs.sx);
        }
        
        if(this.rcx !== undefined && this.rcy !== undefined) {
            resultPoint = Transformation.rotationPoints(resultPoint, this.attrs.anchor, { x: this.attrs.rcx, y: this.attrs.rcy });
        }
        else {
            resultPoint = Transformation.rotationPoints(resultPoint, this.attrs.anchor);
        }
        
        resultPoint = Transformation.translationPoints(resultPoint, this.attrs.tx, this.attrs.ty);
        return resultPoint;
    }

    translateElement(forme, x, y) {
        let ft = forme.transformation();
        let params = ft.getTransformation();
        params[2][1] += x;
        params[2][2] += y;

        let result = new Transformation(params);
        return result;
    }

    async rotateElement(forme, anchor, center) {
        const placementPoints = await forme.getPoints();
        let points = Transformation.rotationPoints(placementPoints, anchor, center);

        let ft = forme.transformation();
        const bounds = GeometryResolver.getPolygonBounds(points);
        const scaledPoints = Transformation.homothetiePoints(
                                forme.points, ft.attrs.sx,
                                GeometryResolver.getPolygonCenter(forme.points));
        const srBounds = GeometryResolver.getPolygonBounds(
                            Transformation.rotationPoints(
                                scaledPoints, ft.attrs.anchor + anchor,
                                GeometryResolver.getPolygonCenter(scaledPoints)));

        let params = ft.getTransformation();
        params[1][1] += anchor;
        params[2][1] = bounds.x - srBounds.x;
        params[2][2] = bounds.y - srBounds.y;

        let result = new Transformation(params);
        return result;
    }

    async addScaleElement(forme, addedScale, center) {
        let ft = forme.transformation();
        let appliedScale = (ft.attrs.sx + addedScale) / ft.attrs.sx;

        return this.scaleElement(forme, appliedScale, center);
    }

    async scaleElement(forme, appliedScale, center) {
        const placementPoints = await forme.getPoints();
        let ft = forme.transformation();

        if(center == undefined || center.x == undefined || center.y == undefined) {
            center = GeometryResolver.getPolygonCenter(placementPoints);
        }
        let points = Transformation.homothetiePoints(placementPoints, appliedScale, center);

        const bounds = GeometryResolver.getPolygonBounds(points);
        const initCenter = GeometryResolver.getPolygonCenter(forme.points);
        const scaledPoints = Transformation.homothetiePoints(
                                forme.points,
                                ft.attrs.sx * appliedScale,
                                initCenter);
        const srBounds = GeometryResolver.getPolygonBounds(
                            Transformation.rotationPoints(
                                scaledPoints, ft.attrs.anchor,
                                GeometryResolver.getPolygonCenter(scaledPoints)));

        let params = ft.getTransformation();
        params[0][1] *= appliedScale;
        params[0][2] *= appliedScale;
        params[2][1] = bounds.x - srBounds.x;
        params[2][2] = bounds.y - srBounds.y;

        let result = new Transformation(params);
        return result;
    }

    get params() {
        return this._params;
    }
    set params(value) {
        if(!Array.isArray(value)) {
            throw new Error('Array expected !');
        }
        for(let t of value) {
            if(t[0] == 't') {
                this.attrs.tx = t[1];
                this.attrs.ty = t[2];
            }
            else if(t[0] == 'r') {
                this.attrs.anchor = t[1];
                if(t[2] !== undefined && t[3] !== undefined) {
                    this.attrs.rcx = t[2];
                    this.attrs.rcy = t[3];
                }
            }
            else if(t[0] == 's') {
                this.attrs.sx = t[1];
                this.attrs.sy = t[2];
                if(t[3] !== undefined && t[4] !== undefined) {
                    this.attrs.scx = t[3];
                    this.attrs.scy = t[4];
                }
            }
            else {
                throw new Error(`Unknown transformation ${t[0]}`);
            }
        }
        this._params = value;
    }

    
    static homothetie(pt, center, scale) {
        if(pt.x == undefined || pt.y == undefined) {
            pt = Flatten.point(pt[0], pt[1]);
        }
        else if(pt.translate == undefined) {
            pt = Flatten.point(pt.x, pt.y);
        }
        
        let homothetyCenter = Flatten.point(center.x, center.y);
        let t_incline = {
            x: (pt.x - homothetyCenter.x) * (scale - 1),
            y: (pt.y - homothetyCenter.y) * (scale - 1)
        };
        return pt.translate(t_incline.x, t_incline.y);
    }
    
    static rotation(pt, center, anchor) {
        if(pt.x == undefined || pt.y == undefined) {
            pt = Flatten.point(pt[0], pt[1]);
        }
        else if(pt.translate == undefined) {
            pt = Flatten.point(pt.x, pt.y);
        }
        return pt.rotate(GeometryResolver.toRad(anchor), Flatten.point(center.x, center.y));
    }
    
    static translation(pt, x, y) {
        if(pt.x == undefined || pt.y == undefined) {
            pt = Flatten.point(pt[0], pt[1]);
        }
        else if(pt.translate == undefined) {
            pt = Flatten.point(pt.x, pt.y);
        }
        return pt.translate(x, y);
    }

    
    static homothetiePoints(pts, scale, center) {
        if(center == undefined || center.x == undefined || center.y == undefined) {
            center = GeometryResolver.getPolygonCenter(pts);
        }
        let finalPoints = pts.slice();
        
        for(let i=0; i<finalPoints.length; i++) {
            finalPoints[i] = Transformation.homothetie(finalPoints[i], center, scale);
        }
        return finalPoints;
    }
    
    static rotationPoints(pts, anchor, center) {
        if(center == undefined || center.x == undefined || center.y == undefined) {
            center = GeometryResolver.getPolygonCenter(pts);
        }
        let finalPoints = pts.slice();
        
        for(let i=0; i<finalPoints.length; i++) {
            finalPoints[i] = Transformation.rotation(finalPoints[i], center, anchor);
        }
        return finalPoints;
    }
    
    static translationPoints(pts, x, y) {
        let finalPoints = pts.slice();
        
        for(let i=0; i<finalPoints.length; i++) {
            finalPoints[i] = Transformation.translation(finalPoints[i], x, y);
        }
        return finalPoints;
    }

    static translateRect(rect, x, y) {
        let tRect = Object.assign({}, rect);
        tRect.x += x;
        tRect.x2 += x;
        tRect.y += y;
        tRect.y2 += y;
        return tRect;
    }

    static merge(t1, t2) {
        if(Transformation.canMerge(t1, t2)) {
            if(t1[0] == 't') {
                return ['t', t1[1] + t2[1], t1[2] + t2[2]];
            }
            else if(t1[0] == 'r') {
                return ['r', t1[1] + t2[1], t1[2], t1[3]];
            }
            else if(t1[0] == 's') {
                return ['s', t1[1], t1[2], t1[3], t1[4]];
            }
        }
    }

    static canMerge(t1, t2) {
        if(t1[0] == t2[0]) {
            if(t1[0] == 't') {
                return true;
            }
            else if(t1[0] == 'r') {
                return t1[2] == t2[2] && t1[3] == t2[3];
            }
            else if(t1[0] == 's') {
                return false;
                // return t1[3] == t2[3] && t1[4] == t2[4];
            }
        }
        return false;
    }
}