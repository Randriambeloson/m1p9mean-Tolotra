importScripts('../GeometryResolver.js');

onmessage = async function(e) {
    try {
        const {polygon, scaleFactor} = e.data;
        let points = [];
        let area = GeometryResolver.getPolygonBounds(polygon);
        for(let x=0; x<area.width / scaleFactor; x++) {
            for(let y=0; y<area.height / scaleFactor; y++) {
                const rx = area.x / scaleFactor + x;
                const ry = area.y / scaleFactor + y;
                if( GeometryResolver.inside([ rx, ry ], polygon) ) {
                    points.push([ rx, ry ]);
                }
            }                
        }
        postMessage({
            code: 1,
            data: points
        });
    } catch (error) {
        postMessage({
            code: 0,
            error: error
        });
    }
}