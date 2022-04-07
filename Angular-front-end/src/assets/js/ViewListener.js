class ViewListener {
    _view;

    functionRef = {};
    key_pressed = [];
    translate_key = ['l','k','j','i'];
    drag_index = 0;

    constructor(view) {
        this.view = view;
    }

    click = () => {
        return event => {
            if(this.view.dragMode == 'polygon select') {
                this.view.addPolygonSelectionPoint(event.layerX, event.layerY);
            }
        }
    }

    mousemove = () => {
        return event => {
            if(this.view.dragMode == 'eraser') {
                if(this.view.eraser == null || this.view.eraser.node == null) {
                    this.view.stage.attr({
                        cursor: 'none'
                    });
                    
                    this.view.createEraserElement(event.layerX, event.layerY, this.view.eraserSize);
                }
                else {
                    this.view.eraser.attr({
                        x: event.layerX,
                        y: event.layerY
                    });
                }
            }
        }
    }

    mouseout = () => {
        return event => {
            if(this.view.dragMode == 'eraser') {
                let box = this.view.stage.getBBox();
                if(event.layerX >= box.x && event.layerX <= box.x2 && event.layerY >= box.y && event.layerY <= box.y2) {
                    // this.view.stage.attr({
                    //     cursor: 'none'
                    // });
                }
                else {
                    this.view.stage.attr({
                        cursor: 'default'
                    });
                    this.view.eraser.remove();
                }
            }
        }
    }

    hoverin = () => {
        return async event => {
            if(this.view.dragMode == 'rotate') {
                this.view.stage.attr({
                    cursor: 'grab'
                });
                let center = await this.view.getBoxCenter();
                // spinIcon = this.view.paper.path('M1.5,6V15H9M5.265,22.5A13.5,13.5,0,1,0,8.46,8.46L1.5,15');
                this.view.spinIcon = this.view.paper.path('M11.2,32.235A15.8,15.8,0,0,1,2.25,19.5H0A17.991,17.991,0,0,0,17.925,36c.345,0,.66-.03.99-.045L13.2,30.225ZM18.075,0c-.345,0-.66.03-.99.06L22.8,5.775l2-1.995A15.752,15.752,0,0,1,33.75,16.5H36A17.991,17.991,0,0,0,18.075,0ZM24,21h3V12a3,3,0,0,0-3-3H15v3h9ZM12,24V6H9V9H6v3H9V24a3,3,0,0,0,3,3H24v3h3V27h3V24Z');
                let icon_width = 36;
                let icon_height = 36;
                this.view.spinIcon.attr({
                    stroke: '#007bff',
                    fill: '#007bff',
                    'stroke-width': 1,
                    transform: `t${center.x - icon_width / 2},${center.y - icon_height / 2}`
                });
            }
            else if(this.view.dragMode == 'move') {
                this.view.stage.attr({
                    cursor: 'move'
                });
            }
        }
    }

    hoverout = () => {
        return () => {
            this.view.stage.attr({
                cursor: 'default'
            });
            if(this.view.dragMode == 'rotate') {
                this.view.spinIcon.remove();
            }
            else if(this.view.dragMode == 'move') {
                
            }
        }
    }

    drag = () => {
        return async (dx, dy, x, y, event) => {
            if(this.view.dragMode == 'select') {
                let dragStartPos = {
                    x: event.layerX - dx,
                    y: event.layerY - dy
                }
                let xs = Math.min(dragStartPos.x, dragStartPos.x + dx);
                let ys = Math.min(dragStartPos.y, dragStartPos.y + dy);
                this.view.selection.attr({
                    x: xs,
                    y: ys,
                    width: Math.abs(dx),
                    height: Math.abs(dy)
                });
            }
            else if(this.view.dragMode == 'rotate') {
                this.view.stage.attr({
                    cursor: 'grabbing'
                });
                let position = {
                    x: event.layerX,
                    y: event.layerY
                };
                let anchor = GeometryResolver.getPointAnchor(position, await this.view.getBoxCenter());
                let flipAnchor = this.view.dragStartAnchor - anchor;
                this.view.setRotate(flipAnchor);
                this.view.anchorLabel.attr({
                    text: Math.round(this.view.dragCurrentAnchor + this.view.dragVariationAnchor) + '°'
                })
            }
            else if(this.view.dragMode == 'move') {
                this.view.translate({
                    x: dx,
                    y: dy
                }, {
                    x: (x - this.view.dragStartPos.x) / this.view.scaleView,
                    y: (y - this.view.dragStartPos.y) / this.view.scaleView
                });
                this.view.translateLabel.attr({
                    text: 'x: ' + Math.round(this.view.dragCurrentTranslate.x) + ', y: ' + Math.round(this.view.dragCurrentTranslate.y)
                });
                this.view.dragStartPos.x = x;
                this.view.dragStartPos.y = y;
            }
            else if(this.view.dragMode == 'eraser') {
                let eraserBox = this.view.eraser.getBBox();
                // this.view.removeAreaData(eraserBox);

                let box = Object.assign({}, eraserBox);
                let rPoints = GeometryResolver.getRectPoints(box);
                rPoints = [
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[0], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[1], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[2], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[3], 'array')
                ];
                
                // this.view.immutablePolygon.push(rPoints);
                this.view.eraserPolygons.push(rPoints);
                
                const rectItem = new RectItem(this.view, {
                    action: false,
                    bounds: eraserBox,
                    attr: this.view.eraserAttr
                });
                this.view.eraserShapes.push(rectItem);
                // this.view.immutableShapes.push(rectItem);
                this.view.toFront();
            }
        }
    }

    dragStart = () => {
        return async (x, y, event) => {
            if(this.view.dragMode == 'select') {
                this.view.selection = this.view.paper.rect(event.layerX,event.layerY,0,0);
                this.view.selection.attr({
                    stroke: '#000',
                    'stroke-dasharray': '--',
                    fill: 'rgba(0,0,0,0.05)'
                });

                if(!this.view.eventData.shiftkey) {
                    this.view.removeAllSelection();
                }
            }
            else if(this.view.dragMode == 'rotate') {
                this.view.stage.attr({
                    cursor: 'grabbing'
                });
                let position = {
                    x: event.layerX,
                    y: event.layerY
                };
                this.view.dragStartAnchor = GeometryResolver.getPointAnchor(position, await this.view.getBoxCenter());

                if(this.view.anchorLabel)    this.view.anchorLabel.remove();
                this.view.anchorLabel = this.view.paper.text(30, 20, Math.round(this.view.dragCurrentAnchor) + '°');
                this.view.setRotate(0);
                this.view.anchorLabel.attr({
                    'font-size': 20,
                    fill: '#007bff'
                });
            }
            else if(this.view.dragMode == 'move') {
                if(this.view.translateLabel)    this.view.translateLabel.remove();

                this.view.translate({x:0, y:0});
                this.view.translateLabel = this.view.paper.text(70, 20, 'x: ' + Math.round(this.view.dragCurrentTranslate.x) + ', y: ' + Math.round(this.view.dragCurrentTranslate.y));
                this.view.translateLabel.attr({
                    'font-size': 20,
                    fill: '#007bff'
                });
                this.view.dragStartPos.x = x;
                this.view.dragStartPos.y = y;
            }
            else if(this.view.dragMode == 'eraser') {
                this.drag_index = this.view.immutableShapes.length;
                let eraserBox = this.view.eraser.getBBox();
                // this.view.removeAreaData(eraserBox);

                let box = Object.assign({}, eraserBox);
                let rPoints = GeometryResolver.getRectPoints(box);
                rPoints = [
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[0], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[1], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[2], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[3], 'array')
                ];
                
                // this.view.immutablePolygon.push(rPoints);
                this.view.eraserPolygons.push(rPoints);

                const rectItem = new RectItem(this.view, {
                    include: false,
                    action: false,
                    bounds: eraserBox,
                    attr: this.view.eraserAttr
                });
                this.view.eraserShapes.push(rectItem);
                // this.view.immutableShapes.push(rectItem);
                this.view.toFront();
            }
        }
    }

    dragEnd = () => {
        return async event => {
            if(this.view.dragMode == 'select') {
                this.view.removeSelection();
                let box = this.view.selection.getBBox();
                
                let rPoints = GeometryResolver.getRectPoints(box);
                rPoints = [
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[0], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[1], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[2], 'array'),
                    await this.view.getPointCoordinatesOnRoot_keepScale(rPoints[3], 'array')
                ];

                this.view.rectangle_selections.push({
                    x: rPoints[0][0],
                    y: rPoints[0][1],
                    x2: rPoints[2][0],
                    y2: rPoints[2][1],
                    width: rPoints[2][0] - rPoints[0][0],
                    height: rPoints[2][1] - rPoints[0][1]
                });

                this.view.selection.remove();
                this.view.polygonselection.push(rPoints);
                this.view.polygonselection = GeometryResolver.mergePolygons(this.view.polygonselection)[0];
                
                this.view.shapes = await this.view.toShapes(this.view.polygonselection, false, false);
                this.view.updateSelection();

                this.view.zoom(0);
            }
            else if(this.view.dragMode == 'rotate') {
                this.view.stage.attr({
                    cursor: 'grab'
                });
                this.view.translate({x: 0, y:0});
                this.view.dragCurrentAnchor += this.view.dragVariationAnchor;
                this.view.dragVariationAnchor = 0;
                setTimeout(() => {
                    this.view.anchorLabel.animate(
                        Raphael.animation({
                            opacity: 0
                        }, 400)
                    );
                }, 600);
                setTimeout(() => {
                    this.view.anchorLabel.remove();
                }, 1000);
            }
            else if(this.view.dragMode == 'move') {
                setTimeout(() => {
                    this.view.translateLabel.animate(
                        Raphael.animation({
                            opacity: 0
                        }, 400)
                    );
                }, 600);
                setTimeout(() => {
                    this.view.translateLabel.remove();
                }, 1000);
            }
            else if(this.view.dragMode == 'eraser') {
                // this.view.immutablePolygon = GeometryResolver.mergePolygons(this.view.immutablePolygon)[0];
                
                // try {
                //     GeometryResolver.mergePolygons([[
                //         [
                //             [160.02522805017108, 204.99999999999997]
                //             [170.02522805017108, 205.00000000000003]
                //             [170.02522805017105, 214.99999999999997]
                //             [160.02522805017108, 215]
                //         ],
                //         [
                //             [160.02522805017105, 206]
                //             [170.02522805017105, 206]
                //             [170.0252280501711, 216.00000000000003]
                //             [160.02522805017105, 216]
                //         ]
                //     ]])[0];
                // } catch (error) {
                //     console.log(error);
                // }
                console.log(this.view.eraserPolygons[0].length);
                while(this.view.eraserShapes.length) {
                    this.view.eraserShapes.pop().remove();
                }
                try {
                    this.view.eraserPolygons = GeometryResolver.mergePolygons(this.view.eraserPolygons)[0];
                } catch (error) {
                    while(this.view.eraserPolygons.length) {
                        this.view.eraserPolygons.splice(0);
                    }
                    console.error(error);
                    this.view.alert(error.message, 'error');
                    return;
                }
                
                
                let action = {};
                let trace_shapes = await this.view.toShapes(this.view.eraserPolygons, action, true, this.view.eraserAttr);
                for(const shape of trace_shapes) {
                    // this.view.addBlankTask(await shape.getPoints());
                    await this.view.bufferOnMemory(shape.component);
                    this.view.immutableShapes.push(shape);
                };
                this.view.eraserPolygons.splice(0);
                
                this.view.toFront();
                this.view.addAction(action);
                // Réajuste le grossissement
                this.view.zoom(0);
            }
        }
    }

    wheel = () => {
        return event => {
            event.preventDefault();
            this.view.zoom(event.deltaY * this.view.defaultDeltaYFactorElement);
        }
    }

    undo_redo_event = () => {
        return event => {
            if(this.view.eventData.ctrlkey) {
                switch(event.key) {
                    case 'z':
                        this.view.undo();
                        break;
                    case 'y':
                        this.view.redo();
                        break;
                    default:
                        break;
                }
            }
        }
    }

    keyUpEvent = (key, ignoreIfExist = false) => {
        let func = event => {
            if(this.view.eventData.altkey) {
                if(this.view.iChild != undefined) {
                    const image = this.view.childrenImage[this.view.iChild];
                    const boundaryShape = this.view.childrenImage[this.view.iChild].boundaryShape;
                    let addAction = () => {
                        let action = {};
                        if(image.transformations.length) {
                            action[image.id] = [ActionFactory.translation()];
                        }
                        if(boundaryShape.transformations.length) {
                            action[boundaryShape.id] = [ActionFactory.translation()];
                        }
                        if(Object.keys(action).length) {
                            this.view.addAction(action);
                        }
                    }
                    if(/^[jkli]$/.test(event.key)) {
                        this.key_pressed.splice(this.key_pressed.indexOf(event.key), 1);
                        if(this.key_pressed.length == 0) {
                            addAction();
                        }
                    }
                }
            }
        }

        if(key) {
            if(!ignoreIfExist || !this.functionRef[key]) {
                this.remember(key, func);
            }
        }
        return func;
    }

    keyEvent = (key, ignoreIfExist = false) => {
        let func = event => {
            if(this.view.state == 'clip') {
                if(this.view.eventData.shiftkey) {
                    if(event.key == 'ArrowRight') {
                        if(this.view.iChild != undefined) {
                            this.view.iChild = (this.view.iChild + 1) % this.view.childrenImage.length;
                        }
                        else {
                            this.view.iChild = 0;
                        }
                        this.view.updateSelectedChild();
                    }
                    else if(event.key == 'ArrowLeft') {
                        if(this.view.iChild != undefined) {
                            this.view.iChild = (this.view.childrenImage.length + this.view.iChild - 1) % this.view.childrenImage.length;
                        }
                        else {
                            this.view.iChild = 0;
                        }
                        this.view.updateSelectedChild();
                    }
                    else if(/^f$/i.test(event.key) && this.view.dragMode == 'polygon select') {
                        this.view.closePolygonSelection();
                    }
                    else if(this.view.dragMode == 'ruler') {
                        if(/^r$/i.test(event.key)) {
                            this.view.redresser();
                        }
                        else if(/^t$/i.test(event.key)) {
                            this.view.redresserElement();
                        }
                    }
                }
                else if(this.view.eventData.altkey) {
                    if(this.view.iChild != undefined) {
                        switch(event.key) {
                            case 'ArrowRight', 'l':
                                if(this.key_pressed.indexOf(event.key) != -1) {
                                    this.key_pressed.push(event.key);
                                    this.view.rotateChild(this.view.iChild, 0);
                                }
                                this.view.translateChild(this.view.iChild, {x: 1, y: 0}, false);
                                break;
                            case 'ArrowLeft', 'j':
                                if(this.key_pressed.indexOf(event.key) != -1) {
                                    this.key_pressed.push(event.key);
                                    this.view.rotateChild(this.view.iChild, 0);
                                }
                                this.view.translateChild(this.view.iChild, {x: -1, y: 0}, false);
                                break;
                            case 'ArrowUp', 'i':
                                if(this.key_pressed.indexOf(event.key) != -1) {
                                    this.key_pressed.push(event.key);
                                    this.view.rotateChild(this.view.iChild, 0);
                                }
                                this.view.translateChild(this.view.iChild, {x: 0, y: -1}, false);
                                break;
                            case 'ArrowDown', 'k':
                                if(this.key_pressed.indexOf(event.key) != -1) {
                                    this.key_pressed.push(event.key);
                                    this.view.rotateChild(this.view.iChild, 0);
                                }
                                this.view.translateChild(this.view.iChild, {x: 0, y: 1}, false);
                                break;
                            case 'u':
                                this.view.rotateChild(this.view.iChild, -this.view.defaultRotationAnchor);
                                break;
                            case 'o':
                                this.view.rotateChild(this.view.iChild, this.view.defaultRotationAnchor);
                                break;
                            case 'p':
                                this.view.scaleChild(this.view.iChild, this.view.defaultScaleFactorElement);
                                break;
                            case 'm':
                                this.view.scaleChild(this.view.iChild, -this.view.defaultScaleFactorElement);
                                break;
                            default:
                                break;
                        }
                    }
                }
                else if(this.view.eventData.ctrlkey) {
                    switch(event.key) {
                        case 'c':
                            console.log('copy');
                            if(this.view.rectangle_selections.length || this.view.polygonselection.length) {
                                this.view.copy().then(() => {
                                    this.view.alert('Copied to clipboard !');
                                });
                            }
                            break;
                        case 'v':
                            this.view.pasteClipboardImage();
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        if(key) {
            if(!ignoreIfExist || !this.functionRef[key]) {
                this.remember(key, func);
            }
            else {
                func = undefined;
            }
        }
        return func;
    }

    resize = (event) => {
        this.view.rescale();
    }

    remember(key, ref) {
        if(this.functionRef[key]) {
            throw new Error('A handler to this event already exist');
        }
        this.functionRef[key] = ref;
    }

    forget(key) {
        let ref = this.functionRef[key];
        delete this.functionRef[key];
        return ref;
    }

    get view() {
        return this._view;
    }
    set view(value) {
        this._view = value;
    }
}