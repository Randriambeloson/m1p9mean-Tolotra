importScripts('../../jimp.min.js', '../../GeometryResolver.js', '../Protocol.js');

/**
 * e.data = {
 *  src: { base64: string },
 *  polygon: Array<Array<Number>>,
 *  scaleFactor: Number,
 *  background: string
 * }
 */
onmessage = function(e) {
    const data = e.data;
    Jimp.read(Buffer.from(data.src.base64, 'base64'))
    .then(src => {
        const area = GeometryResolver.getPolygonBounds(data.polygon);
        GeometryResolver.unscale_polygon(data.polygon, data.scaleFactor);
        let maskColor = Jimp.cssColorToHex(data.background);
        for(let x=0; x<area.width / data.scaleFactor; x++) {
            for(let y=0; y<area.height / data.scaleFactor; y++) {
                const rx = area.x / data.scaleFactor + x;
                const ry = area.y / data.scaleFactor + y;
                if( GeometryResolver.inside([ rx, ry ], data.polygon) ) {
                    src.setPixelColor(maskColor, rx, ry);
                }
            }
        }

        src.getBase64('image/png', (err, base64) => {
            if(!err) {
                postMessage(Protocol.success(base64));
            }
            else {
                postMessage(Protocol.error(err));
            }
        });
    });
}