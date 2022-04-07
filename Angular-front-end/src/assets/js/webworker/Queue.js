importScripts('../Tasks.js', '../Task.js', './Protocol.js');

let tasks = [];
let state = 'sleep';

async function runTasks() {
    if(state === 'sleep') {
        state = 'running';
        let task = tasks.pop();
        while(tasks.length) {
            try {
                task.observeTask().run();
                const message = await task.end();
                postMessage(Protocol.success(message));
                task = tasks.pop();
                task.message.src.base64 = message;
            } catch (error) {
                postMessage(Protocol.error(error));
            }
        }
        // traitement terminé
        postMessage(Protocol.done());
    }
}

onmessage = function(e) {
    const {data, task} = e.data;
    let worker = Task.worker(task);
    if(worker) {
        const task = new Task(worker, data);
        tasks.unshift(task);
        runTasks();
    }
    else {
        throw new Error('Unknown task requested');
    }
}