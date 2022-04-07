class ImageMemory {
    src;
    
    constructor(src) {
        this.src = src;
    }

    release() {
        delete this.src;
    }
}