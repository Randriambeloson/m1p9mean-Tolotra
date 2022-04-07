importScripts('../../jimp.min.js', '../Protocol.js');

/**
 * e.data = {
 *  src: { base64: string },
 *  chunk: { base64: string, rotationanchor: number, bounds: Rect}
 * }
 */
onmessage = function(e) {
    const data = e.data;
    Promise.all([
        Jimp.read(Buffer.from(data.src.base64, 'base64')),
        Jimp.read(Buffer.from(data.chunk.base64), 'base64')
    ])
    .then((src, chunk) => {
        chunk.rotate(data.chunk.rotationanchor);
        chunk.resize(data.chunk.bounds.width, data.chunk.bounds.height);
        src.composite(chunk, data.chunk.bounds.x, data.chunk.bounds.y);
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