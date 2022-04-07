class Task {
    worker;
    abortCondition;
    end = Promise.resolve();
    message;

    constructor(worker, message) {
        this.worker = worker;
        this.message = message;
        // this.observeTask();
    }

    terminate() {
        if(this.worker) {
            this.worker.terminate();
        }
    }

    run() {
        if(this.worker) {
            this.worker.postMessage(this.message);
        }
    }

    observeTask() {
        if(this.worker) {
            this.end = new Promise((resolve, reject) => {
                this.worker.onmessage = (ev)=> {
                    if(ev.data.code == 1) {
                        resolve(ev.data.data);
                    }
                    else {
                        reject(ev.data.error);
                    }
                };
                this.worker.onerror = (err) => {
                    console.log('Exception non gérée au niveau d\'un worker');
                    reject(err);
                };
            });
        }
        return this;
    }

    static worker(task) {
        switch(task) {
            case TASK.POLYGON_POINTS_CENSUS:
                return new Worker('./webworker/blank_pixel_worker.js');
            case TASK.IMAGE_BUFFER:
                return new Worker('./webworker/sons/ImagePaste.js');
            case TASK.BLANK_BUFFER:
                return new Worker('./webworker/sons/BlankPaste.js');
            default:
                return;
        }
    }
}