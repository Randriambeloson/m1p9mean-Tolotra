onmessage = async function(e) {
    try {
        const outcanvas = e.data;
        await outcanvas.bufferize();
        postMessage(true);
    } catch (error) {
        postMessage(error);
    }
}