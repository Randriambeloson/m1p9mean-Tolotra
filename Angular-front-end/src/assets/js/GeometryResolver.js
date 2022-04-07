class GeometryResolver {

    static getRectPoints = (rect) => {
        return [
          [rect.x, rect.y], [rect.x2, rect.y],
          [rect.x2, rect.y2], [rect.x, rect.y2]
        ];
    }

    static getRectPointsObj = (rect) => {
        return [
          { x: rect.x, y: rect.y }, { x: rect.x2, y: rect.y },
          { x: rect.x2, y: rect.y2 }, { x: rect.x, y: rect.y2 }
        ];
    }

    /**
     * Fusionne plusieurs polygones qui se coupent
     * @param {Array<Polygon>} polygons 
     * @returns {Array<Polygon>}
     */
    static mergePolygons = (polygons) => {
        let polylist = [];
        let copypolygons = polygons.slice(0, polygons.length);
        if(copypolygons.length > 1) {
          let currShape = copypolygons.splice(0, 1)[0];
          const recursiveMerge = function(currShape, copypolygons) {
              for(let i=0; i<copypolygons.length; i++) {
                  
                  // On s'assure de fermer les polygones
                  if(currShape[0][0][0] != currShape[0][currShape[0].length-1][0] || currShape[0][0][1] != currShape[0][currShape[0].length-1][1]) {
                      currShape[0].push(currShape[0][0]);
                  }
                  if(copypolygons[i][0][0] != copypolygons[i][copypolygons[i].length-1][0] || copypolygons[i][0][1] != copypolygons[i][copypolygons[i].length-1][1]) {
                      copypolygons[i].push(copypolygons[i][0]);
                  }
  
                  let mergedpoly = martinez.union(currShape, [copypolygons[i]]);
                  if(mergedpoly.length == 1) {
                  // s'il y a intersection
                  copypolygons.splice(i, 1);
                  return recursiveMerge(mergedpoly[0], copypolygons);
                  }
              }
              let resultpolygons = [[]];
              for(let i=0; i<copypolygons.length; i++) {
                  resultpolygons[0].push(copypolygons[i]);
              }
              resultpolygons[0].push(currShape[0]);
            
              return resultpolygons;
          }
          polylist = recursiveMerge([currShape], copypolygons);
        }
        else {
          polylist.push(polygons);
        }
        return polylist;
    }

    /**
     * Retourne un encadrement (un rectangle) de l'ensemble de rectangles
     * @param {rect} bounds 
     * @returns 
     */
    static getGroupBounding = (bounds) => {
        let bounding = {};
        for(let bound of bounds) {
            bounding.x = Math.min(bounding.x || bound.x, bound.x);
            bounding.y = Math.min(bounding.y || bound.y, bound.y);
            bounding.x2 = Math.max(bounding.x2 || bound.x + bound.width, bound.x + bound.width);
            bounding.y2 = Math.max(bounding.y2 || bound.y + bound.height, bound.y + bound.height);
        }

        bounding.width = bounding.x2 - bounding.x;
        bounding.height = bounding.y2 - bounding.y;
        return bounding;
    }

    static getRectangleBounds = rect => {
        if(rect.length != 4) {
            throw new Error("La forme ne peut pas être traitée comme un rectangle car il ne comporte pas 4 points");
        }
        return GeometryResolver.getPolygonBounds(rect);
    }

    /**
     * Retourne un encadrement (un rectangle) de l'ensemble de points donné
     * @param {Array<Point>} polygon 
     * @returns {rect}
     */
    static getPolygonBounds = polygon => {
        let x, y, x2, y2;
        // if(polygon.length < 3) {
        //     throw new Error("Ceci n'est pas un polygone");
        // }
        let xKey = polygon[0].x != undefined ? 'x' : 0;
        let yKey = polygon[0].y != undefined ? 'y' : 1;
        for(let pt of polygon) {
            x = Math.min(x === undefined ? pt[xKey] : x, pt[xKey]);
            y = Math.min(y === undefined ? pt[yKey] : y, pt[yKey]);
            x2 = Math.max(x2 === undefined ? pt[xKey] : x2, pt[xKey]);
            y2 = Math.max(y2 === undefined ? pt[yKey] : y2, pt[yKey]);
        }
        const rect = {
            x: x,
            y: y,
            x2: x2,
            y2: y2,
            width: x2 - x,
            height: y2 - y
        };
        return rect;
    }

    static getPolygonCenter = polygon => {
        return GeometryResolver.getBoundCenter(GeometryResolver.getPolygonBounds(polygon));
    }

    static getTranslatedPolygon = (polygon, vector) => {
        let resultedPolygon = [];
        if(polygon && polygon.length) {
            if(polygon[0].x != undefined) {
                for(let p of polygon) {
                    resultedPolygon.push({
                        x: p.x + vector.x,
                        y: p.y + vector.y
                    });
                }
            }
            else if(polygon[0][0] != undefined) {
                for(let p of polygon) {
                    resultedPolygon.push([
                        p[0] + vector.x,
                        p[1] + vector.y
                    ]);
                }
            }
        }
        
        return resultedPolygon;
    }

    /**
     * Agrandit le polygone (homothétie des points ra tsy diso ah)
     * par 'scale' par rapport un point 'pt'
     * @param {Array<Point>} polygon 
     * @param {number} scale 
     * @param {Point} pt
     * @returns 
     */
    static getScaledPolygon = (polygon, scale, pt) => {
        let resultedPolygon = [];
        if(polygon && polygon.length) {
            if(polygon[0].x != undefined) {
                for(let p of polygon) {
                    resultedPolygon.push({
                        x: pt.x + (p.x - pt.x) * scale,
                        y: pt.y + (p.y - pt.y) * scale
                    });
                }
            }
            else if(polygon[0][0] != undefined) {
                for(let p of polygon) {
                    resultedPolygon.push([
                        pt.x + (p[0] - pt.x) * scale,
                        pt.y + (p[1] - pt.y) * scale
                    ]);
                }
            }
        }
        
        return resultedPolygon;
    }

    /**
     * Agrandit le rectangle
     * par 'scale' par rapport un point 'pt'
     * @param {rect} bound 
     * @param {number} scale 
     * @param {Point} pt 
     * @returns 
     */
    static getScaledBound = (bound, scale, pt) => {
        let polygon = [
            { x: bound.x, y: bound.y },
            { x: bound.x + bound.width, y: bound.y },
            { x: bound.x + bound.width, y: bound.y + bound.height },
            { x: bound.x, y: bound.y + bound.height }
        ];
        const pts = GeometryResolver.getScaledPolygon(polygon, scale, pt);
        const resultedBound = {
            x: pts[0].x,
            y: pts[0].y,
            x2: pts[2].x,
            y2: pts[2].y,
            width: pts[1].x - pts[0].x,
            height: pts[2].y - pts[0].y
        };
        return resultedBound;
    }

    /**
     * Transformation inverse de l'agrandissement
     * @param {rect} bounds 
     * @param {number} scaleFactor 
     */
    // toScaleOne izy tany am RaphaelCanvas.js
    static unscale = (bounds, scaleFactor) => {
        for(let bound of bounds) {
            bound.cx /= scaleFactor;
            bound.cy /= scaleFactor;
            bound.x /= scaleFactor;
            bound.y /= scaleFactor;
            bound.x2 /= scaleFactor;
            bound.y2 /= scaleFactor;
            bound.width /= scaleFactor;
            bound.height /= scaleFactor;
        }
    }

    /**
     * Transformation inverse de l'agrandissement
     * @param {Polygon} bounds 
     * @param {number} scaleFactor 
     */
    // toScaleOne_polygon izy tany am RaphaelCanvas.js
    static unscale_polygon = (polygon, scaleFactor) => {
        if(polygon.length) {
            if(Array.isArray(polygon[0])) {
                for(let pt of polygon) {
                    pt[0] /= scaleFactor;
                    pt[1] /= scaleFactor;
                }
            }
            else {
                for(let pt of polygon) {
                    pt.x /= scaleFactor;
                    pt.y /= scaleFactor;
                }
            }
        }
        
    }

    /**
     * retourne le centre d'un rectangle
     * @param {rect} bound 
     * @returns {Point}
     */
    static getBoundCenter = (bound) => {
        let boundCenter = {
            x: bound.x + bound.width / 2,
            y: bound.y + bound.height / 2
        };
        return boundCenter;
    }

    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    /**
     * Test si un point donné est à l'intérieur d'un polygone
     * @param {Array<number>} point 
     * @param {Array<Point>} vs 
     * @returns {Boolean}
     */
    static inside = (point, vs) => {
        
        var x = point[0], y = point[1];
        
        var inside = false;
        let [ xKey, yKey ] = vs.length && vs[0].x != undefined ? ['x', 'y'] : [0, 1];
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][xKey], yi = vs[i][yKey];
            var xj = vs[j][xKey], yj = vs[j][yKey];
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };


    /**
     * Crée un vecteur 
     * résultant de la rotation d'un vecteur
     * par un angle donné (en degré) puis retourne le résultat
     * @param {Point} vector 
     * @param {number} anchor 
     * @returns {Point}
     */
    static rotateVector = (vector, anchor) => {
        const module = GeometryResolver.zmodule(vector);
        if(module == 0) {
            return vector;
        }
        let v_anchor = GeometryResolver.vectorAnchor(vector);

        let rotated_vector = {
            x: module * Math.cos(GeometryResolver.toRad(v_anchor + anchor)),
            y: module * Math.sin(GeometryResolver.toRad(v_anchor + anchor))
        };
        return rotated_vector;
    }

    /**
     * Calcul l'angle que fait le vecteur par rapport à l'abscisse
     * @param {Point} vector 
     * @returns number
     */
    static vectorAnchor = (vector) => {
        const module = GeometryResolver.zmodule(vector);
        let cos = vector.x / module;
        let sin = vector.y / module;
        return GeometryResolver.toAnchor(sin, cos);
    }

    /**
     * Retourne le module d'un nombre complexe
     * @param {Point} z 
     * @returns number
     */
    static zmodule = (z) => {
        return Math.sqrt(z.x * z.x + z.y * z.y);
    }


    // Trigonométrie

    static getPointAnchor = (position, refpoint) => {
        let hdistance = position.x - refpoint.x;
        let vdistance = refpoint.y - position.y;
        let distance = Math.sqrt(hdistance*hdistance + vdistance*vdistance);
        let cos = hdistance / distance;
        let anchor = Math.sign(vdistance) * GeometryResolver.cos2Anchor(cos);
        return anchor;
    }

    // returns a positive anchor
    static cos2Anchor = (cos) => {
        return GeometryResolver.toDeg(Math.acos(cos));
    }

    static toAnchor = (sin, cos) => {
        if(cos == 0 && sin == 0) {
            throw new Error("Sinus & cosinus can't be both zero");
        }
        else if(cos == 0){
            return Math.sign(sin) * 90;
        }
        else if(sin == 0) {
            return Math.sign(cos) > 0 ? 0 : 180;
        }
        return GeometryResolver.tan2Anchor(sin / cos) + (Math.sign(cos) > 0 ? 0 : 180);
    }

    // returns a positive anchor
    static tan2Anchor = (tan) => {
        return GeometryResolver.toDeg(Math.atan(tan));
    }

    static toRad = (deg) => {
        return deg * Math.PI / 180;
    }

    static toDeg = (rad) => {
        return rad * 180 / Math.PI;
    }
}