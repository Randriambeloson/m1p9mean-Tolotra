class ActionFactory {

    static undo(canvas, action) {
        let paper = canvas.paper;
        for(const id in action) {
            for(let i=action[id].length - 1; i>=0; i--) {
                let act = action[id][i];
                let element = paper.getById(id);
                switch(act.actionName) {
                    case 'add':
                        element.root().delete(false);
                        break;
                    case 'delete':
                        element.root().restore(act.args[0]);
                        break;
                    case 'paste':
                        act.args[2].splice(
                            act.args[0], 0, act.args[1].pop()
                        );
                        element.data('include it', false);
                        this.iChild = act.args[0];
                        break;
                    case 'cut':
                        for(let i=0; i<act.args[0].length; i++) {
                            const image = act.args[0][i];
                            if(image === element.root()) {
                                act.args[0].splice(i, 1);
                                break;
                            }
                        }
                        break;
                    case 'translate':
                        element.root().backward();
                        break;
                    case 'rotate':
                        element.root().backward();
                        break;
                    case 'scale':
                        element.root().backward();
                        break;
                    case 'custom':
                        act.args[0]();
                        break;
                    default:
                        // Nothing to do
                        break;
                }
            }
        }
    }

    static redo(canvas, action) {
        const paper = canvas.paper;
        for(const id in action) {
            for(let act of action[id]) {
                let element = paper.getById(id);
                switch(act.actionName) {
                    case 'add':
                        element.root().restore(act.args[0]);
                        break;
                    case 'delete':
                        element.root().delete(false);
                        break;
                    case 'paste':
                        act.args[1].push(element.root());
                        act.args[2].splice(
                            act.args[0], 1
                        );
                        element.data('include it', true);
                        break;
                    case 'cut':
                        act.args[0].push(element.root());
                        break;
                    case 'translate':
                        element.root().forward();
                        break;
                    case 'rotate':
                        element.root().forward();
                        break;
                    case 'scale':
                        element.root().forward();
                        break;
                    case 'custom':
                        act.args[1]();
                        break;
                    default:
                        console.log('Nothing to do ' + act.actionName);
                        break;
                }
            }
        }
    }

    static add(included) {
        return {
            actionName: 'add',
            args: [included]
        };
    }

    static delete(included) {
        return {
            actionName: 'delete',
            args: [included]
        };
    }

    static paste(tabIndex, immutableImages, childrenImage, boundaryShape) {
        return {
            actionName: 'paste',
            args: [tabIndex, immutableImages, childrenImage, boundaryShape]
        };
    }

    static cut(childrenImage) {
        return {
            actionName: 'cut',
            args: [childrenImage]
        };
    }

    static translation(x, y) {
        return {
            actionName: 'translate',
            args: [x, y]
        };
    }

    static rotation(anchor) {
        return {
            actionName: 'rotate',
            args: [anchor]
        };
    }

    static scale(pt, scaleFactor) {
        return {
            actionName: 'scale',
            args: [pt, scaleFactor]
        };
    }

    static custom(undo, redo) {
        return {
            actionName: 'custom',
            args: [undo, redo]
        };
    }
}

