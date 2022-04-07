class BackgroundTaskManager {
    queue;
    state = 'sleep';
    loading = Promise.resolve();
    parent;

    constructor(parent) {
        this.parent = parent;
    }

    killAll() {
        if(this.tasks !=undefined) {
            while(this.tasks.length) {
                this.tasks.pop().terminate();
            }
            this.state = 'sleep';
        }
    }

    runTask(data, task) {
        try {
            if(!this.queue) {
                this.initQueue();
            }
            this.state = 'running';
            this.queue.postMessage({
                data: data,
                task: task
            });
        } catch (error) {
            throw error;
        }
    }

    initQueue() {
        this.queue = new Worker('./webworker/Queue.js');
        this.queue.onmessage = (e) => {
            const data = e.data;
            switch(data.code) {
                case 0:
                    // Erreur
                    this.parent.alert(data.data, 'error');
                    break;
                case 1:
                    // Une tâche terminée
                    const message = data.data;
                    // overwrite memory
                    console.log('New version saved to memory');
                    this.parent.memory.src = Jimp.read(Buffer.from(message, 'base64'));
                    break;
                case 2:
                    // Toutes les tâches terminées
                    this.state = 'sleep';
                    break;
            }
        }
        this.queue.onerror = (e) => {
            console.log(e);
        }
    }
}