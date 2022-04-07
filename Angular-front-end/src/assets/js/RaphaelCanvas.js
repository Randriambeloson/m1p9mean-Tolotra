class RaphaelCanvas {
    // listener
    observer;
    // task manager
    taskManager;
    // module geometrie
    transformationLookup;
    // Jimp array
    clipboard = [];

    polygonal_selections = [];
    polygonal_shapes = [];
    rectangle_selections = [];
    polygonselection = [];
    shapes = [];
    immutablePolygon = [];
    immutableShapes = [];
    immutableImages = [];

    eraserShapes = [];
    eraserPolygons = [];

    ruler;
    _rulerAnchor = 0;
    rulerGrip = {
        vertical: undefined,
        horizontal: undefined
    };
    rulerGripPos = {
        left: 0, right: 0,
        top: 0, bottom: 0
    };

    rulerGripAnchor = 0;
    bulletedRadius = 6;

    timeline;
    history = [];
    memory;

    // Jimp instance
    image;
    scaleFactor = 1;
    selection;
    paper;
    stage;
    moveListener;
    mainImageId;
    childrenImage = [];
    iChild;

    width;
    height;
    imgw;
    imgh;
    scaleView = 1;

    dragStartPos = {
        x: 0,
        y: 0
    }
    dragStartAnchor = 0;
    dragCurrentAnchor = 0;
    dragVariationAnchor = 0;
    dragCurrentTranslate = {
        x: 0,
        y: 0
    }
    currentScale = 1;

    eraserSize = 10;
    defaultRotationAnchor = 45;
    defaultScaleFactorElement = 0.2;
    defaultDeltaYFactorElement = -0.005;

    _state;
    background = '#FFFFFF';
    cropMargin;
    eventData = {
        shiftkey: false,
        ctrlkey: false,
        altkey: false
    }

    eraserAttr = {
        stroke: this.background,
        fill: this.background
    }
    marginAttr = {
        stroke: 'rgba(0,0,0,0.5)',
        'stroke-dasharray': '.',
        'stroke-width': 1,
        fill: this.background
    }
    selectedAttr = {
        stroke: '#007bff',
        'stroke-width': 2,
        'stroke-dasharray': '--',
        fill: 'rgba(0, 123, 255, 0.05)'
    }
    unselectedAttr = {
        stroke: '#28a745',
        'stroke-width': 2,
        'stroke-dasharray': '--',
        fill: 'rgba(50,240,50,0.05)'
    }

    dragMode = 'select';

    // Graphics elements
    spinIcon;
    anchorLabel;
    translateLabel;
    eraser = null;

    marges = {
        top: null,
        bottom: null,
        left: null,
        right: null
    }

    set rulerAnchor(anchor) {
        this.setRuler(anchor);
        this._rulerAnchor = anchor;
    }

    get rulerAnchor() {
        return this._rulerAnchor;
    }

    set state(value) {
        this._state = value;
        if(this.paper) {
            setTimeout(() => {
                this.rescale();
            });
        }
    }

    get state() {
        return this._state;
    }

    set rulerGripLeftPos(value) {
        value = parseInt(value);
        if(!isNaN(value)) {
            const dy = value - this.rulerGripLeftPos;
            if(this.eventData.shiftkey) {
                this.rulerGrip.horizontal.translatePoints({
                    x: 0, y: dy
                }, {
                    x: 0, y: dy
                });
                this.rulerGripPos.right = this.rulerGripPos.right + dy;
            }
            else {
                this.rulerGrip.horizontal.translatePoints({
                    x: 0, y: dy
                }, {
                    x: 0, y: 0
                });
            }
            this.rulerGripPos.left = value;
        }
    }
    get rulerGripLeftPos() {
        return this.rulerGripPos.left;
    }

    set rulerGripRightPos(value) {
        value = parseInt(value);
        if(!isNaN(value)) {
            const dy = value - this.rulerGripRightPos;
            if(this.eventData.shiftkey) {
                this.rulerGrip.horizontal.translatePoints({
                    x: 0, y: dy
                }, {
                    x: 0, y: dy
                });
                this.rulerGripPos.left = this.rulerGripPos.left + dy;
            }
            else {
                this.rulerGrip.horizontal.translatePoints({
                    x: 0, y: 0
                }, {
                    x: 0, y: dy
                });
            }
            this.rulerGripPos.right = value;
        }
    }
    get rulerGripRightPos() {
        return this.rulerGripPos.right;
    }

    set rulerGripTopPos(value) {
        value = parseInt(value);
        if(!isNaN(value)) {
            const dx = value - this.rulerGripTopPos;
            if(this.eventData.shiftkey) {
                this.rulerGrip.vertical.translatePoints({
                    x: dx, y: 0
                }, {
                    x: dx, y: 0
                });
                this.rulerGripPos.bottom = this.rulerGripPos.bottom + dx;
            }
            else {
                this.rulerGrip.vertical.translatePoints({
                    x: dx, y: 0
                }, {
                    x: 0, y: 0
                });
            }
            this.rulerGripPos.top = value;  
    
        }
    }
    get rulerGripTopPos() {
        return this.rulerGripPos.top;
    }

    set rulerGripBottomPos(value) {
        value = parseInt(value);
        if(!isNaN(value)) {
            const dx = value - this.rulerGripBottomPos;
            if(this.eventData.shiftkey) {
                this.rulerGrip.vertical.translatePoints({
                    x: dx, y: 0
                }, {
                    x: dx, y: 0
                });
                this.rulerGripPos.top = this.rulerGripPos.top + dx;
            }
            else {
                this.rulerGrip.vertical.translatePoints({
                    x: 0, y: 0
                }, {
                    x: dx, y: 0
                });
            }
            this.rulerGripPos.bottom = value;
        }
    }
    get rulerGripBottomPos() {
        return this.rulerGripPos.bottom;
    }

    static position = {
        T: 'top',
        B: 'bottom',
        L: 'left',
        R: 'right',
        C: 'center',
        TL: 'top-left',
        TR: 'top-right',
        BL: 'bottom-left',
        BR: 'bottom-right',
    }

    constructor(width, height, eventData, cropMargin) {
        this.width = width || RaphaelCanvas.screenWidth - 240;
        this.height = height || RaphaelCanvas.screenHeight - 240;
        this.eventData = eventData;
        this.setCropMargin();

        this.memory = new ImageMemory();
        this.taskManager = new BackgroundTaskManager(this);
        this.observer = new ViewListener(this);
        this.transformationLookup = new TransformationFactoryBuilder();
    }

    addBlankTask = (polygon) => {
        this.memory.src.getBase64('image/png', (err, base64) => {
            base64 = ImageItem.toBase64(base64);
            this.addTask(
                {
                 src: { base64: base64 },
                 polygon: polygon,
                 scaleFactor: this.scaleFactor,
                 background: this.background
                },
                TASK.BLANK_BUFFER
            );
        });
    }

    addTask = (data, type) => {
        this.taskManager.runTask(data, type)
    }

    cropFrom = (src, rect) => {
        let rx = rect.x / this.scaleFactor,
            ry = rect.y / this.scaleFactor,
            rw = rect.width / this.scaleFactor,
            rh = rect.height / this.scaleFactor;

        rect.x = rect.x + (rect.width < 0 ? rect.width : 0);
        rect.y = rect.y + (rect.height < 0 ? rect.height : 0);
        rect.width = Math.abs(rect.width);
        rect.height = Math.abs(rect.height);
        
        rx = rx + (rw < 0 ? rw : 0);
        ry = ry + (rh < 0 ? rh : 0);
        rw = Math.abs(rw);
        rh = Math.abs(rh);
        try {
            return src.clone().crop(rx, ry, rw, rh);
        } catch (error) {
            console.log(src);
            throw error;
        }
        
    }

    crop = (rect) => {
        return this.cropFrom(this.image, rect);
    }

    overwrite = async (htmlId, image, imgw, imgh) => {
        this.paper.clear();
        this.paper.remove();
        this.taskManager.killAll();

        this.polygonal_selections = [];
        this.polygonal_shapes = [];
        this.rectangle_selections = [];
        this.polygonselection = [];
        this.shapes = [];
        this.immutablePolygon = [];
        this.immutableShapes = [];
        this.immutableImages = [];

        this.iChild = undefined;
        this.timeline = undefined;
        this.history = [];
        this.releaseMemory();
        await this.initImage(htmlId, image, imgw, imgh);
    }

    initImage = async (htmlId, image, imgw, imgh) => {
        this.image = image;
        let res = await image.getBase64Async('image/png');
        this.init(htmlId, res, imgw, imgh);
    }
  
    init = (htmlId, imageOrUri, imgw, imgh) => {
        this.setScaleImage(imgw, imgh);

        this.paper = Raphael(htmlId, this.width, this.height);
        const backgroundImage = new ImageItem(this, {
            action: false,
            src: imageOrUri,
            bounds: {
                x: 0,
                y: 0,
                width: imgw * this.scaleFactor,
                height: imgh * this.scaleFactor
            },
            border: false
        });
        
        let image = backgroundImage.image;
        this.mainImageId = image.id;
        this.stage = this.paper.rect(0,0,this.width, this.height);

        this.stage.attr({
            fill: 'rgba(0,0,0,0)'
        });

        this.tryAddMargin();
        this.initGripRulerPos();
        this.addUIListener(this.stage);
        this.addScrollWheelListener(this.stage);
        document.addEventListener('keydown', this.observer.undo_redo_event());
        this.setChildrenImageOutline();
        window.addEventListener('resize', this.observer.resize);

        // align image to center
        backgroundImage.translateElement(this.translateToCenter(), false);
    }

    translateToCenter = () => {
        return {
            x: this.width/2 - this.imgw*this.scaleFactor/2,
            y: this.height/2 - this.imgh*this.scaleFactor/2,
        };
    }

    rescale = async (width, height) => {
        if(width == undefined || height == undefined) {
            const clientRect = this.parentElement().getBoundingClientRect();
            width = clientRect.width || RaphaelCanvas.screenWidth - 240;;
            height = clientRect.height || RaphaelCanvas.screenHeight - 240;;
        }

        const prevScale = this.scaleFactor;
        const prevWidth = this.width;
        const prevHeight = this.height;
        this.width = width;
        this.height = height;
        this.setScaleImage(this.imgw, this.imgh);

        let apply;
        if(prevScale != this.scaleFactor) {
            // const appliedScale = this.scaleFactor / prevScale;
            // apply = (element) => {
            //     element.scaleTransformation(appliedScale);
            // };

            // apply(this.rootComponent());
            // for(let shape of this.shapes) {
            //     apply(shape);
            // }
            // for(let shape of this.immutableShapes) {
            //     apply(shape);
            // }
            // for(let shape of this.polygonal_shapes) {
            //     apply(shape);
            // }
            // for(let imageItem of this.immutableImages) {
            //     apply(imageItem);
            // }
            // for(let child of this.childrenImage) {
            //     apply(child);
            //     apply(child.boundaryShape);
            // }
            // if(this.cropMargin) {
            //     for(let side in this.marges) {
            //         apply(this.marges[side]);
            //     }
            // }
        }
        else {
            let imageCenter = await this.rootComponent().getBoxCenter();
            let viewCenter = {
                x: this.width/2,
                y: this.height/2
            };
            let vector = {
                x: viewCenter.x - imageCenter.x,
                y: viewCenter.y - imageCenter.y,
            };
            apply = (element) => {
                element.translate(vector.x, vector.y);
            };

            apply(this.rootComponent());
            for(let shape of this.shapes) {
                apply(shape);
            }
            for(let shape of this.immutableShapes) {
                apply(shape);
            }
            for(let shape of this.polygonal_shapes) {
                apply(shape);
            }
            for(let imageItem of this.immutableImages) {
                apply(imageItem);
            }
            for(let child of this.childrenImage) {
                apply(child);
                apply(child.boundaryShape);
            }
            if(this.cropMargin) {
                for(let side in this.marges) {
                    apply(this.marges[side]);
                }
            }

        }
        this.paper.setSize(width, height);
        this.paper.setViewBox(0, 0, width, height, false);
        this.stage.attr({
            x: 0, y: 0,
            width: width, height: height
        });
        
        this.tickRulers({width: this.width, height: this.height}, {width: prevWidth, height: prevHeight});
    }

    rootComponent = () => {
        return this.paper.getById(this.mainImageId).root();
    }

    parentElement = () => {
        return this.paper.canvas.parentElement;
    }

    align = async () => {
        let transformationInverse = await this.reestablish();
        let center = { x: transformationInverse.attrs.scx, y: transformationInverse.attrs.scy };
        this.zoom(1 - this.scaleView, center);
        this.setRotate(transformationInverse.attrs.anchor, center);
        this.translate({ x: transformationInverse.attrs.tx, y: transformationInverse.attrs.ty });

        this.dragCurrentTranslate.x = 0;
        this.dragCurrentTranslate.y = 0;
        this.dragCurrentAnchor = 0;
        this.scaleView = 1;
    }

    addUIListener = (element) => {
        element.click(this.observer.click());
        element.drag(this.observer.drag(), this.observer.dragStart(), this.observer.dragEnd());
        element.hover(this.observer.hoverin(), this.observer.hoverout());
        element.mousemove(this.observer.mousemove());
        element.mouseout(this.observer.mouseout());
    }

    addScrollWheelListener = (element) => {
        element.node.addEventListener('wheel', this.observer.wheel());
    }

    toShapes = async (polygons, action, include, attr) => {
        if(!attr) {
            attr = {
                stroke: '#007bff',
                'stroke-width': 2,
                'stroke-dasharray': '--',
                fill: 'rgba(0,0,100,0.05)'
            }
        }
        let shapes = [];
        const undef = action == undefined;
        
        // const stageBox = this.stage.getBBox();
        const stageBox = GeometryResolver.getPolygonBounds(this.rootComponent().points);
        const stageCenter = {
            x: stageBox.x + stageBox.width / 2,
            y: stageBox.y + stageBox.height / 2,
        };
        // const stageCenter = await this.rootComponent().getBoxCenter();
        for(let polygon of polygons) {
            let shape_selection = new PathItem(this, {
                include: include,
                action: action,
                polygon: polygon,
                attr: attr
            });
            shapes.push(shape_selection);
            this.addUIListener(shape_selection.path);
            this.addScrollWheelListener(shape_selection.path);

            shape_selection.clearTransformationFromStart();
            await shape_selection.scale(this.rootComponent().transformation().attrs.sx, stageCenter.x, stageCenter.y);
            await shape_selection.rotate(this.rootComponent().transformation().attrs.anchor, stageCenter.x, stageCenter.y);
            await shape_selection.translate(
                this.rootComponent().transformation().attrs.tx,
                this.rootComponent().transformation().attrs.ty);
                
            if(!undef) {
                shape_selection.path.data('include it', true);
            }
        }
        return shapes;
    }
      
    removeSelection = () => {
      for(let shape of this.shapes) {
        shape.component.hide();
      }
    }

    updateSelection = () => {
      for(let shape of this.shapes) {
        shape.component.show();
      }
    }

    removeAllSelection = () => {
      this.removeSelection();
      this.rectangle_selections.splice(0, this.rectangle_selections.length);
      this.polygonselection.splice(0, this.polygonselection.length);
    }

    addPolygonSelectionPoint = (x, y) => {
        let selection = this.getPolygonSelection();
        if(selection) {
            this.addPathPoint(x, y);
        }
        else {
            if(!this.eventData.shiftkey) {
                this.removePolygonalSelection();
            }
            this.addPolygonSelection(x, y);
        }
        this.paintPolygonalSelection();
    }

    addPathPoint = (x, y) => {
        this.polygonal_selections[this.polygonal_selections.length - 1] += `L${x},${y}`;
    }

    addPolygonSelection = (x, y) => {
        this.polygonal_selections.push(`M${x},${y}`);
    }

    getPolygonSelection = () => {
        if(this.polygonal_selections.length && !this.polygonal_selections[this.polygonal_selections.length - 1].endsWith('Z')) {
            return this.polygonal_selections[this.polygonal_selections.length - 1];
        }
    }

    closePolygonSelection = async () => {
        let selection = this.getPolygonSelection();
        if(selection) {
            let points = selection.split('L');
            if(points.length < 3) {
                throw new Error('Le polygône doit avoir au moins 3 points');
            }
            const [, xStartPoint, yStartPoint] = points[0].split(/[M,]/);
            this.polygonal_selections[this.polygonal_selections.length - 1] += `L${xStartPoint},${yStartPoint}`;
        }
        this.paintPolygonalSelection(true);
        // Mark as closed shape
        this.polygonal_selections[this.polygonal_selections.length - 1] += 'Z';

        // add to shapes
        let polygonPoints = this.transformationLookup.pathStringToPolygon(this.polygonal_selections[this.polygonal_selections.length - 1]);

        let polygonPointsOnRoot = [];
        for(let points of polygonPoints) {
            polygonPointsOnRoot.push(await this.getPointCoordinatesOnRoot_keepScale(points, 'array'));
        }
        this.polygonal_selections[this.polygonal_selections.length - 1] = this.transformationLookup.polygonToPathString(polygonPointsOnRoot);

        this.polygonal_shapes.pop().remove();
        this.polygonselection.push(polygonPointsOnRoot);
        this.polygonselection = GeometryResolver.mergePolygons(this.polygonselection)[0];
        
        this.shapes = await this.toShapes(this.polygonselection, false, false);
        this.updateSelection();
        this.zoom(0);
    }

    paintPolygonalSelection = (close) => {
        let selection = this.getPolygonSelection();
        if(selection) {
            if(this.polygonal_shapes.length && this.polygonal_shapes.length == this.polygonal_selections.length) {
                this.polygonal_shapes.pop().remove();
            }
            let tempPath = new PathItem(this, {
                include: false,
                action: false,
                polygon: selection + (close ? 'Z' : ''),
                attr: this.selectedAttr
            });
            this.addUIListener(tempPath.path);
            this.addScrollWheelListener(tempPath.path);
            this.polygonal_shapes.push(tempPath);
        }
    }

    removePendingPolygonSelection = () => {
        if(this.getPolygonSelection()) {
            this.polygonal_selections.pop();
        }
    }

    removePolygonalSelection = () => {
        while(this.polygonal_selections.length) {
            this.polygonal_selections.pop();
        }
    }

    changeDragMode = (mode) => {
        this.dragMode = mode;
        this.removePendingPolygonSelection();
        this.removeRulers();
        switch(mode) {
            case 'ruler':
                this.setRulers();
                break;
            default:
                break;
        }
    }
    
    setCropMargin = (margin) => {
        this.cropMargin = margin;
        this.tryAddMargin();
    }

    tryAddMargin = () => {
        if(this.cropMargin && this.paper) {
            if(this.marges) {
                let set = this.paper.set();
                for(let key in this.marges) {
                    if(this.marges[key]) {
                        set.push(this.marges[key]);
                    }
                }
                set.remove();
            }

            this.marges = {
                top: new RectItem(this, {
                    include: true,
                    action: false,
                    bounds: {
                        x: 0,
                        x2: this.imgw * this.scaleFactor,
                        y: 0,
                        y2: this.cropMargin.top * this.scaleFactor,
                        width: this.imgw * this.scaleFactor,
                        height: this.cropMargin.top * this.scaleFactor
                    },
                    attr: this.marginAttr
                }),
                bottom: new RectItem(this, {
                    include: true,
                    action: false,
                    bounds: {
                        x: 0,
                        x2: this.imgw * this.scaleFactor,
                        y: (this.imgh - this.cropMargin.top) * this.scaleFactor,
                        y2: this.imgh * this.scaleFactor,
                        width: this.imgw * this.scaleFactor,
                        height: this.cropMargin.top * this.scaleFactor
                    },
                    attr: this.marginAttr
                }),
                left: new RectItem(this, {
                    include: true,
                    action: false,
                    bounds: {
                        x: 0,
                        x2: this.cropMargin.side * this.scaleFactor,
                        y: 0,
                        y2: this.imgh * this.scaleFactor,
                        width: this.cropMargin.side * this.scaleFactor,
                        height: this.imgh * this.scaleFactor
                    },
                    attr: this.marginAttr
                }),
                right: new RectItem(this, {
                    include: true,
                    action: false,
                    bounds: {
                        x: (this.imgw - this.cropMargin.side) * this.scaleFactor,
                        x2: this.imgw * this.scaleFactor,
                        y: 0,
                        y2: this.imgh * this.scaleFactor,
                        width: this.cropMargin.side * this.scaleFactor,
                        height: this.imgh * this.scaleFactor
                    },
                    attr: this.marginAttr
                })
            };
            const {x,y} = this.translateToCenter();
            for(let side in this.marges) {
                this.marges[side].translate(x,y);
            }
        }
    }

    setRulers = () => {
        this.setRuler();
        this.setGripRuler();
        this.rescale();
    }

    setRuler = (anchor = 0) => {
        let box = this.stage.getBBox();
        let hStep = box.width/2 * Math.tan(GeometryResolver.toRad(anchor));
        let from = [box.x,box.y + box.height / 2 + hStep];
        let to = [box.x + box.width, box.y + box.height/2 - hStep];
        if(Math.abs(anchor) == 90) {
            from = [box.x + box.width/2, box.y];
            to = [box.x + box.width/2, box.y + box.height];
        }
        this.removeRuler();
        this.ruler = new PathItem(this, {
            include: false,
            action: false,
            polygon: `M${from.join(',')}L${to.join(',')}`,
            attr: this.selectedAttr
        });
    }

    removeRulers = () => {
        this.removeRuler();
        this.removeGripRuler();
    }

    removeRuler = () => {
        if(this.ruler) {
            this.ruler.remove();
            delete this.ruler;
        }
    }

    tickRulers = (viewSize, prevViewSize) => {
        this.tickRuler(viewSize, prevViewSize);
        this.tickGripRuler(viewSize, prevViewSize);
    }

    tickRuler = (viewSize, prevViewSize) => {

    }

    tickGripRuler = (viewSize, prevViewSize) => {
        if(this.rulerGrip.vertical && this.rulerGrip.horizontal) {
            const viewBox = this.stage.getBBox();
            const topPos = (this.rulerGripPos.top - viewBox.x) / prevViewSize.width;
            const bottomPos = (this.rulerGripPos.bottom - viewBox.x) / prevViewSize.width;
            const leftPos = (this.rulerGripPos.left - viewBox.y) / prevViewSize.height;
            const rightPos = (this.rulerGripPos.right - viewBox.y) / prevViewSize.height;

            const topCoord = topPos * viewSize.width + viewBox.x;
            const bottomCoord = bottomPos * viewSize.width + viewBox.x;
            const leftCoord = leftPos * viewSize.height + viewBox.y;
            const rightCoord = rightPos * viewSize.height + viewBox.y;

            const heightDiff = viewSize.height - prevViewSize.height;
            const widthDiff = viewSize.width - prevViewSize.width;

            this.rulerGrip.vertical.translatePoints({x: 0, y: 0}, { x: 0, y: heightDiff });
            this.rulerGripTopPos = topCoord;
            this.rulerGripBottomPos = bottomCoord;
            this.rulerGrip.horizontal.translatePoints({x: 0, y: 0}, {x: widthDiff, y: 0});
            this.rulerGripLeftPos = leftCoord;
            this.rulerGripRightPos = rightCoord;
        }
    }

    setGripRuler = () => {
        this.removeGripRuler();
        let viewBox = this.stage.getBBox();
        this.rulerGrip.vertical = new LineItem(this, {
            radius: this.bulletedRadius,
            points: [
                [this.rulerGripPos.top, viewBox.y + (this.bulletedRadius + 2)],
                [this.rulerGripPos.bottom, viewBox.y2 - (this.bulletedRadius + 2)]
            ]
        });
        let listener = new BulletedListener(this.rulerGrip.vertical);
        this.rulerGrip.vertical.bulleted[0].circle.drag(listener.horizontalDrag(), listener.dragStart(), listener.dragEnd());
        this.rulerGrip.vertical.bulleted[1].circle.drag(listener.horizontalDrag(), listener.dragStart(), listener.dragEnd());

        this.rulerGrip.horizontal = new LineItem(this, {
            radius: this.bulletedRadius,
            points: [
                [viewBox.x + (this.bulletedRadius + 2), this.rulerGripPos.left],
                [viewBox.x2 - (this.bulletedRadius + 2), this.rulerGripPos.right]
            ]
        });
        listener = new BulletedListener(this.rulerGrip.horizontal);
        this.rulerGrip.horizontal.bulleted[0].circle.drag(listener.verticalDrag(), listener.dragStart(), listener.dragEnd());
        this.rulerGrip.horizontal.bulleted[1].circle.drag(listener.verticalDrag(), listener.dragStart(), listener.dragEnd());
    }

    initGripRulerPos = () => {
        const viewBox = this.stage.getBBox();
        if(viewBox.width > 0 && viewBox.height > 0) {
            this.rulerGripPos = {
                top: viewBox.x + Math.min(100, (viewBox.x2 - viewBox.x) / 4),
                left: viewBox.y + Math.min(100, (viewBox.y2 - viewBox.y) / 4),
                right: viewBox.y + Math.min(100, (viewBox.y2 - viewBox.y) / 4),
                bottom: viewBox.x + Math.min(100, (viewBox.x2 - viewBox.x) / 4)
            }
        }
    }

    removeGripRuler = () => {
        for(let direction in this.rulerGrip) {
            if(this.rulerGrip[direction]) {
                this.rulerGrip[direction].remove();
                delete this.rulerGrip[direction];
            }
        }
    }

    redresser = async () => {
        if(this.ruler && this._rulerAnchor != 0) {
            await this.setRotate(0);
            await this.setRotate(this.rulerAnchor);
            this.rulerAnchor = 0;
        }
    }

    redresserElement = () => {
        if(this.iChild !== undefined) {
            this.rotateChild(this.iChild, this.rulerGripAnchor);
        }
        else {
            alert('Sélectionnez un élément à redresser');
        }
    }

    setEraserSize = (size) => {
        if(size != this.eraserSize) {
            this.eraserSize = size;
            if(this.eraser) {
                const x = this.eraser.attrs?.x || 0;
                const y = this.eraser.attrs?.y || 0;
                this.eraser.remove();
                this.createEraserElement(x, y, this.eraserSize);
            }
        }
    }

    setAngleRotation = (angle) => {
        this.defaultRotationAnchor = angle;
    }

    createEraserElement = (x, y, size) => {
        this.eraser = this.paper.rect(x, y, size, size);
        this.eraser.attr({
            fill: '#fff',
            stroke: '#000',
            transform: `t${-size / 2},${-size / 2}`,
            cursor: 'none'
        });
        this.addUIListener(this.eraser);
        this.addScrollWheelListener(this.eraser);
    }

    toFront = () => {
        for(let shape of this.shapes) {
            shape.toFront();
        }
        for(let child of this.childrenImage) {
            child.toFront();
        }
        for(let traceGomme of this.eraserShapes) {
            traceGomme.toFront();
        }
        if(this.cropMargin) {
            this.marges.left.toFront();
            this.marges.right.toFront();
            this.marges.top.toFront();
            this.marges.bottom.toFront();
        }
        this.eraser?.toFront();
    }

    setScaleImage = (imgw, imgh) => {
        this.imgw = imgw;
        this.imgh = imgh;
        this.scaleFactor = this.computeScaleFactorToFit(this, {
            width: this.imgw,
            height: this.imgh
        });
    }

    computeScaleFactorToFit = (area, content) => {
        let areaAspectRatio = area.width / area.height;
        let contentAspectRatio = content.width / content.height;
        if(areaAspectRatio > contentAspectRatio) {
          return area.height / content.height;
        }
        else {
          return area.width / content.width;
        }
    }

    getPolygonAreas = () => {
        let polygons = [];
        for(let selection of this.polygonal_selections) {
            let points = this.transformationLookup.pathStringToPolygon(selection);
            polygons.push(points);
        }
        return polygons;
    }

    getAreas = () => {
        let rectangles = [];
        for(let selection of this.rectangle_selections) {
          rectangles.push(Object.assign({}, selection));
        }
        return rectangles;
    }

    getBmpIndex = (bmp) => {
        for(let i=0; i<this.childrenImage.length; i++) {
            if(this.childrenImage[i].image.id == bmp.id) {
                return i;
            }
        }
    }

    addPolygonBmp = async (src, area, scaleFactor, action) => {
        let bounds = GeometryResolver.getPolygonBounds(area);
        let imgItem = new ImageItem(this, {
            action: action,
            src: src,
            bounds: bounds,
            area: area
        });
        await imgItem.setDragListener();
        this.childrenImage.push(imgItem);

        return imgItem;
    }

    addBmp = async (src, bounds, scaleFactor, action) => {
        let imgItem = new ImageItem(this, {
            action: action,
            src: src,
            bounds: bounds
        });
        await imgItem.setDragListener();
        this.childrenImage.push(imgItem);
        this.addScrollWheelListener(imgItem._boundaryShape.component);

        return imgItem;
    }

    addBmpCenter = async (src, bounds) => {
        let action = {};
        let imgItem = new ImageItem(this, {
            action: action,
            src: src,
            bounds: bounds
        });
        await imgItem.setDragListener();
        this.childrenImage.push(imgItem);

        action[imgItem.image.id] = [ActionFactory.add(bounds)];
        this.addAction(action);
    }

    addBmps = async (srcs, bounds, scaleFactor) => {
        let action = {};
        for(let i=0; i<srcs.length; i++) {
            await this.addBmp(srcs[i], bounds[i], scaleFactor, action);
        }
        this.setChildrenImageOutline();
        this.addAction(action);
        this.toFront();
    }

    addBmpsToPosition = async (srcs, bounds, scaleArg, position = RaphaelCanvas.position.C) => {
        // GeometryResolver.unscale(bounds, scaleArg);
        let grpBounds = GeometryResolver.getGroupBounding(bounds);
        let outputView = {
            width: this.imgw * this.scaleFactor,
            height: this.imgh * this.scaleFactor
        };

        // on tient compte de la marge
        let margesBox;
        if(this.marges) {
            margesBox = {
                top: await this.marges.top.getBBox(),
                bottom: await this.marges.bottom.getBBox(),
                left: await this.marges.left.getBBox(),
                right: await this.marges.right.getBBox(),
            };
            outputView.width -= margesBox.left.width + margesBox.right.width;
            outputView.height -= margesBox.top.height + margesBox.bottom.height;
        }
        const scaleFactor = this.computeScaleFactorToFit(outputView, grpBounds);

        let boundCenter = GeometryResolver.getBoundCenter(grpBounds);
        let scaledGrpBounds = GeometryResolver.getScaledBound(grpBounds, scaleFactor, boundCenter);

        let grpPos;
        switch(position) {
            case RaphaelCanvas.position.C:
                grpPos = {
                    x: (this.imgw * this.scaleFactor / 2) - (scaledGrpBounds.width / 2),
                    y: (this.imgh * this.scaleFactor / 2) - (scaledGrpBounds.height / 2)
                };
                break;
            case RaphaelCanvas.position.T:
                grpPos = {
                    x: (this.imgw * this.scaleFactor / 2) - (scaledGrpBounds.width / 2),
                    y: 0
                };
                if(margesBox) {
                    grpPos.y += margesBox.top.height;
                }
                break;
            case RaphaelCanvas.position.B:
                grpPos = {
                    x: (this.imgw * this.scaleFactor / 2) - (scaledGrpBounds.width / 2),
                    y: this.imgh * this.scaleFactor - scaledGrpBounds.height
                };
                if(margesBox) {
                    grpPos.y -= margesBox.bottom.height;
                }
                break;
            case RaphaelCanvas.position.L:
                grpPos = {
                    x: 0,
                    y: (this.imgh * this.scaleFactor / 2) - (scaledGrpBounds.height / 2)
                };
                if(margesBox) {
                    grpPos.x += margesBox.left.width;
                }
                break;
            case RaphaelCanvas.position.R:
                grpPos = {
                    x: this.imgw * this.scaleFactor - scaledGrpBounds.width,
                    y: (this.imgh * this.scaleFactor / 2) - (scaledGrpBounds.height / 2)
                };
                if(margesBox) {
                    grpPos.x -= margesBox.right.width;
                }
                break;
            case RaphaelCanvas.position.TL:
                grpPos = {
                    x: 0,
                    y: 0
                };
                if(margesBox) {
                    grpPos.x += margesBox.left.width;
                    grpPos.y += margesBox.top.height;
                }
                break;
            case RaphaelCanvas.position.TR:
                grpPos = {
                    x: this.imgw * this.scaleFactor - scaledGrpBounds.width,
                    y: 0
                };
                if(margesBox) {
                    grpPos.x -= margesBox.right.width;
                    grpPos.y += margesBox.top.height;
                }
                break;
            case RaphaelCanvas.position.BL:
                grpPos = {
                    x: 0,
                    y: this.imgh * this.scaleFactor - scaledGrpBounds.height
                };
                if(margesBox) {
                    grpPos.x += margesBox.left.width;
                    grpPos.y -= margesBox.bottom.height;
                }
                break;
            case RaphaelCanvas.position.BR:
                grpPos = {
                    x: this.imgw * this.scaleFactor - scaledGrpBounds.width,
                    y: this.imgh * this.scaleFactor - scaledGrpBounds.height
                };
                if(margesBox) {
                    grpPos.x -= margesBox.right.width;
                    grpPos.y -= margesBox.bottom.height;
                }
                break;
        }

        let translatedAndScaledGrpBounds = {
            x: grpPos.x,
            y: grpPos.y,
            width: scaledGrpBounds.width,
            height: scaledGrpBounds.height
        };

        const translationValue = {
            x: (translatedAndScaledGrpBounds.x - scaledGrpBounds.x),
            y: (translatedAndScaledGrpBounds.y - scaledGrpBounds.y)
        };

        // let translatedGrpBounds = {
        //     x: (this.imgw * this.scaleFactor / 2) - (grpBounds.width / 2),
        //     y: (this.imgh * this.scaleFactor / 2) - (grpBounds.height / 2),
        //     width: grpBounds.width,
        //     height: grpBounds.height
        // };

        // const translationValue = {
        //     x: (translatedGrpBounds.x - grpBounds.x),
        //     y: (translatedGrpBounds.y - grpBounds.y)
        // };
        let action = {};
        for(let i=0; i<srcs.length; i++) {
            const imageItem = await this.addBmp(srcs[i], bounds[i], scaleArg, action);

            imageItem.scaleElement(scaleFactor - 1, action);
            
            imageItem.translateElement(translationValue, action);
            imageItem.translateElement(this.translateToCenter(), action);
            // console.log('paste cropped image');
            // await this.pasteImage(imageItem, undefined, action);
        }
        this.setChildrenImageOutline();
        this.addAction(action);
        this.toFront();
    }

    getViewRect = () => {
        const stageBox = this.stage.getBBox();
        let viewCenter = this.getViewCenter();
        const viewWidth = stageBox.width / this.scaleView;
        const viewHeight = stageBox.height / this.scaleView;
        const viewRect = {
            x: viewCenter.x - viewWidth / 2,
            y: viewCenter.y - viewHeight / 2,
            width: viewWidth,
            height: viewHeight
        };

        return viewRect;
    }

    getViewCenter = () => {
        let viewcenter = this.getBoxCenter();
        viewcenter.x -= this.dragCurrentTranslate.x;
        viewcenter.y -= this.dragCurrentTranslate.y;
        return viewcenter;
    }

    getBoxCenter = () => {
        let stageBox = this.stage.getBBox();
        return GeometryResolver.getBoundCenter(stageBox);
    }

    getViewRectOnStage = () => {
        const stageBox = this.stage.getBBox();
        const stageCenter = this.getBoxCenter();
        const viewWidth = stageBox.width / this.scaleView;
        const viewHeight = stageBox.height / this.scaleView;
        const viewRect = {
            x: stageCenter.x - viewWidth / 2,
            y: stageCenter.y - viewHeight / 2,
            x2: (stageCenter.x - viewWidth / 2) + viewWidth,
            y2: (stageCenter.y - viewHeight / 2) + viewHeight,
            width: viewWidth,
            height: viewHeight
        };

        return viewRect;
    }

    getPointCoordinatesOnStage = (viewCoordinates) => {
        let xKey, yKey;
        if(viewCoordinates.x !== undefined && viewCoordinates.y !== undefined) {
            xKey = 'x', yKey = 'y';
        }
        else if(viewCoordinates[0] !== undefined && viewCoordinates[1] !== undefined) {
            xKey = 0, yKey = 1;
        }
        else {
            throw new Error('A point argument or an array of two number is expected');
        }
        
        const viewBox = this.getViewRectOnStage();
        const stageCoordinates = {
            x: viewBox.x + viewCoordinates[xKey] / this.scaleView,
            y: viewBox.y + viewCoordinates[yKey] / this.scaleView
        };

        return stageCoordinates;
    }

    getPointCoordinatesOnRoot = async (viewCoordinates, type = 'assoc') => {
        let stageCoordinates = this.getPointCoordinatesOnStage(viewCoordinates);
        const rootPoints = await this.rootComponent().getPoints();
        let vector = {
            x: stageCoordinates.x - rootPoints[0].x,
            y: stageCoordinates.y - rootPoints[0].y
        };

        vector = GeometryResolver.rotateVector(vector, - this.rootComponent().transformation().attrs.anchor);
        
        if(type == 'array') {
            vector = [vector.x, vector.y];
        }
        return vector;
    }

    getPointCoordinatesOnRoot_keepScale = async (viewCoordinates, type = 'assoc') => {
        let xKey, yKey;
        if(viewCoordinates.x !== undefined && viewCoordinates.y !== undefined) {
            xKey = 'x', yKey = 'y';
        }
        else if(viewCoordinates[0] !== undefined && viewCoordinates[1] !== undefined) {
            xKey = 0, yKey = 1;
        }
        else {
            throw new Error('A point argument or an array of two number is expected');
        }

        const rootPoints = await this.rootComponent().getPoints();
        let vector = {
            x: viewCoordinates[xKey] - rootPoints[0].x,
            y: viewCoordinates[yKey] - rootPoints[0].y
        };

        vector = GeometryResolver.rotateVector(vector, - this.rootComponent().transformation().attrs.anchor);
        vector.x /= this.scaleView;
        vector.y /= this.scaleView;
        if(type == 'array') {
            vector = [vector.x, vector.y];
        }
        return vector;
    }

    removeZoomTransformation = (transforms, element) => {
        const scaleConditions = [{ index: 0, value: 's' }];
        let scaleList = element.data('scaleList') || [];
        
        if(scaleList.length) {
            let it = 0;
            for(let i=0; i<scaleList.length; i++) {
                const scaleI = scaleList[i];
                for(; it<transforms.length; it++) {
                    const transform = transforms[it];
                    if(this.transformationLookup.conditionTest(transform, scaleConditions)) {
                        // it's a scale transformation
                        let match = transform.length == scaleI.length;
                        if(match) {
                            for(let iarg=0; iarg<transform.length; iarg++) {
                                match = match && (transform[iarg] == scaleI[iarg]);
                            }
                        }
                        
                        if( ! match ) {
                            // remove zoom transformation
                            transforms.splice(it, 1);
                            it--;
                        }
                        else {
                            it++;
                            break;
                        }
                    }
                }
            }
            // On supprime les grossisements restant,
            // car on est sûr qu'ils sont issue d'un zoomage
            for(; it<transforms.length; it++) {
                const transform = transforms[it];
                if(this.transformationLookup.conditionTest(transform, scaleConditions)) {
                    transforms.splice(it, 1);
                    it--;
                }
            }
        }
        else {
            // Aucun grossissement, donc on supprime toute transformation de type 'scale'
            this.transformationLookup.removeTransformation(transforms, scaleConditions);
        }
    }

    zoom = (scale, boxCenter) => {
        let addedScale = this.scaleView < 1 || this.scaleView + scale < 1 ? scale / 5 : scale;
        addedScale = Math.max(1 - this.scaleView, addedScale);
        addedScale = Math.min(5 - this.scaleView, addedScale);
        const appliedScale = (this.scaleView + addedScale) / this.scaleView;
        this.scaleView += addedScale;
        boxCenter = boxCenter || this.getBoxCenter();
        let image = this.rootComponent();

        const apply = (arg) => {
            arg.scale(appliedScale, boxCenter.x, boxCenter.y);
        }
        apply(image);

        for(let shape of this.shapes) {
            apply(shape);
        }
        for(let shape of this.immutableShapes) {
            apply(shape);
        }
        for(let shape of this.polygonal_shapes) {
            apply(shape);
        }
        for(let imageItem of this.immutableImages) {
            apply(imageItem);
        }
        for(let child of this.childrenImage) {
            try {
                apply(child);
                apply(child.boundaryShape);
            } catch (error) {
                console.log(child);
                throw error;
            }
        }
        if(this.cropMargin) {
            for(let side in this.marges) {
                apply(this.marges[side]);
            }
        }
    }

    translate = (vector, viewStep) => {
        let image = this.rootComponent();
        if(viewStep) {
            this.dragCurrentTranslate.x += viewStep.x;
            this.dragCurrentTranslate.y += viewStep.y;
        }
        
        const apply = (element, isBackground = false) => {
            if(vector.x == 0 && vector.y == 0) {
                element.translate(vector.x, vector.y);
            }
            else {
                element.replaceTranslate(vector.x, vector.y);
            }
            
        };
        apply(image, true);

        for(let shape of this.shapes) {
            apply(shape);
        }
        for(let shape of this.immutableShapes) {
            apply(shape);
        }
        for(let shape of this.polygonal_shapes) {
            apply(shape);
        }
        for(let imageItem of this.immutableImages) {
            apply(imageItem);
        }
        for(let child of this.childrenImage) {
            apply(child);
            apply(child.boundaryShape);
        }
        if(this.cropMargin) {
            for(let side in this.marges) {
                apply(this.marges[side]);
            }
        }
    }

    // Rotation par rapport au center foana aloha
    setRotate = async (anchor, center) => {
        let image = this.rootComponent();
        center = center || this.getBoxCenter();
        this.dragVariationAnchor = anchor;

        const apply = async (element, isBackground = false) => {
            isBackground = isBackground == true;
            let simpletranforms = this.simplifyTransform(element.component.transform());

            let [, tanchor, tx, ty ] = this.transformationLookup.rotationParameterFor(element.component, anchor, center);   
            
            if(simpletranforms.length) {
                let lastTransform = simpletranforms[simpletranforms.length - 1];
                if(lastTransform[0] == 'r' && lastTransform[2] == tx && lastTransform[3] == ty) {
                    tanchor -= lastTransform[1];
                }
            }

            if(anchor == 0) {
                await element.rotate(tanchor, center.x, center.y);
            }
            else {
                await element.replaceRotate(tanchor, center.x, center.y);
            }
        };
        await apply(image, true);

        for(let shape of this.shapes) {
            await apply(shape);
        }
        for(let shape of this.immutableShapes) {
            await apply(shape);
        }
        for(let shape of this.polygonal_shapes) {
            await apply(shape);
        }
        for(let imageItem of this.immutableImages) {
            await apply(imageItem);
        }
        for(let child of this.childrenImage) {
            await apply(child);
            await apply(child.boundaryShape);
        }
        if(this.cropMargin) {
            for(let side in this.marges) {
                await apply(this.marges[side]);
            }
        }
    }

    rotateChild = (index, anchor, action) => {
        if(action === false) {
            this.childrenImage[index].replaceRotateElement(anchor);
        }
        else {
            this.childrenImage[index].rotateElement(anchor, action);
        }
    }

    translateChild = (index, vector, action) => {
        if(vector.x == 0 && vector.y == 0) {
            this.childrenImage[index].translateElement(vector, action);
        }
        else {
            this.childrenImage[index].replaceTranslateElement(vector);
        }
    }

    scaleChild = (index, addedScale, action) => {
        this.childrenImage[index].scaleElement(addedScale, action);
    }

    removeChildSelection = () => {
        this.unselectAnyChild();
        this.iChild = undefined;
    }

    unselectAnyChild = () => {
        for(let child of this.childrenImage) {
            if(child.boundaryShape) {
                child.boundaryShape.component.attr(this.unselectedAttr);
            }
        }
    }

    updateSelectedChild = () => {
        this.unselectAnyChild();
        if(this.iChild != undefined) {
            this.childrenImage[this.iChild].boundaryShape.component.attr(this.selectedAttr);
        }
    }

    getChildIndex = (component) => {
        try {
            for(let i=0; i<this.childrenImage.length; i++) {
                if(this.childrenImage[i].boundaryShape.component && this.childrenImage[i].boundaryShape.component == component) {
                    return i;
                }
            }
            throw new Error('Elément introuvable');
        } catch (error) {
            throw error;
        }
    }

    hideChildren = () => {
        for(let child of this.childrenImage) {
            child.image.hide();
        }
    }

    showChildren = () => {
        for(let child of this.childrenImage) {
            child.image.show();
        }
    }

    setChildrenImageOutline = () => {
        for(let child of this.childrenImage) {
            child.boundaryShape.component.show();
        }
        document.addEventListener('keydown', this.observer.keyEvent('keyEvent', true));
        document.addEventListener('keyup', this.observer.keyUpEvent('keyUpEvent', true));
    }

    unsetChildrenImageOutline = () => {
        for(let child of this.childrenImage) {
            if(child.boundaryShape) {
                child.boundaryShape.component.hide();
            }
        }
        this.removeChildSelection();
        document.removeEventListener('keydown', this.observer.forget('keyEvent'));
        document.removeEventListener('keyup', this.observer.forget('keyUpEvent'));
    }

    delete = () => {
        if(this.iChild != undefined) {
            this.childrenImage[this.iChild].delete();

            this.childrenImage.splice(this.iChild, 1);
            this.iChild = undefined;
            this.updateSelectedChild();
        }
    }

    duplicate = async () => {
        if(this.iChild != undefined) {
            let action = {};
            let clone = this.childrenImage[this.iChild].clone(action);
            this.iChild = this.childrenImage.length;
            await clone.setDragListener();
            this.childrenImage.push(clone);
            this.updateSelectedChild();

            this.addAction(action);
            this.toFront();
        }
    }

    detach = async () => {
        let areas = this.getAreas();

        let action = {};
        for(let area of areas) {
            const src = await this.crop(area).getBase64Async('image/png');
            await this.cleanAndCalc(src, area, action);
        }
        this.setChildrenImageOutline();
        this.addAction(action);
    }

    cleanAndCalc = async (src, area, action) => {
            try {
                const undef = action == undefined;
                if(undef) {
                    action = {};
                }

                let image = await this.addBmp(src, area, this.scaleFactor, action);
                action[image.component.id].push(ActionFactory.cut(this.childrenImage));
                let rectItem = new RectItem(this, {
                    include: true,
                    action: action,
                    bounds: area,
                    attr: this.eraserAttr
                });
                rectItem.rect.data('include it', true);
                this.immutableShapes.push(rectItem);

                this.toFront();
                this.addUIListener(rectItem.rect);
                this.addScrollWheelListener(rectItem.rect);
                if(undef) {
                    this.addAction(action);
                }

                return {
                    image: image,
                    rect: rectItem
                };
            } catch (error) {
                throw error;
            }
    }

    cleanAndCalcPolygon = async (src, area, action) => {
        try {
            const undef = action == undefined;
            if(undef) {
                action = {};
            }

            let image = await this.addPolygonBmp(src, area, this.scaleFactor, action);
            action[image.component.id].push(ActionFactory.cut(this.childrenImage));
            const pathString = this.transformationLookup.polygonToPathString(area);
            let pathItem = new PathItem(this, {
                include: true,
                action: action,
                polygon: pathString,
                attr: this.eraserAttr
            });
            pathItem.path.data('include it', true);
            this.immutableShapes.push(pathItem);

            this.toFront();
            this.addUIListener(pathItem.path);
            this.addScrollWheelListener(pathItem.path);
            if(undef) {
                this.addAction(action);
            }

            return {
                image: image,
                path: pathItem
            };
        } catch (error) {
            throw error;
        }
    }

    removePolygonAreaData = (polygon, src) => {
        return new Promise((res, rej) => {
            try {
                src = src || this.image;
                const area = GeometryResolver.getPolygonBounds(polygon);
                GeometryResolver.unscale_polygon(polygon, this.scaleFactor);
                let maskColor = Jimp.cssColorToHex(this.background);
                for(let x=0; x<area.width / this.scaleFactor; x++) {
                    for(let y=0; y<area.height / this.scaleFactor; y++) {
                        const rx = area.x / this.scaleFactor + x;
                        const ry = area.y / this.scaleFactor + y;
                        if( GeometryResolver.inside([ rx, ry ], polygon) ) {
                            src.setPixelColor(maskColor, rx, ry);
                        }
                    }
                }
                res();
            } catch (error) {
                rej(error);
            }
        });
    };
    
    kernelRemovePolygonAreaData = (polygon, src) => {
        return new Promise((res, rej) => {
            const gpu = new GPU();
            try {
                const time = new Date().getTime();
                src = src || this.image;
                const area = GeometryResolver.getPolygonBounds(polygon);
                GeometryResolver.unscale_polygon(polygon, this.scaleFactor);
                let maskColor = Jimp.cssColorToHex(this.background);
                gpu.addFunction(function fn(point, vs, length) {
                    let x = point[0];
                    let y = point[1];
                    
                    let inside = false;
                    // for (var i = 0, j = length - 1; i < length; j = i++) {
                    //     var xi = vs[i][0], yi = vs[i][1];
                    //     var xj = vs[j][0], yj = vs[j][1];
                        
                    //     var intersect = ((yi > y) != (yj > y))
                    //         && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    //     if (intersect) inside = !inside;
                    // }
                    return inside ? 1 : 0;
                });

                let removeAreaData = gpu.createKernel(function(data, polygon, maskarea, pointCount) {
                    let y = Math.floor(this.thread.x / (maskarea[0] * 4)),
                        x = Math.floor((this.thread.x - y * maskarea[0]*4) / 4);
                    if(fn([x,y], polygon, pointCount) == 1) {
                        return 255;
                    }
                    else {
                        return data[this.thread.x];
                    }
                }).setOutput([src.bitmap.data.length]);

                src.bitmap.data = removeAreaData(
                    src.bitmap.data, polygon, [
                    src.bitmap.width, src.bitmap.height,
                    area.width / this.scaleFactor, area.height / this.scaleFactor,
                    area.x / this.scaleFactor, area.y / this.scaleFactor
                ], polygon.length
                );
                console.log('GPU computing time', new Date().getTime() - time + ' ms');
                res();
            } catch (error) {
                rej(error);
            }
        });
    };

    removeAreaData = async (area, src) => {
        return new Promise((res, rej) => {
            src = src || this.image;
            new Jimp(
                area.width / this.scaleFactor,
                area.height / this.scaleFactor, 
                this.background,
                (err, mask) => {
                    if(!err) {
                        src.composite(mask,
                            area.x / this.scaleFactor,
                            area.y / this.scaleFactor);
                        res();
                    }
                    else {
                        rej(err);
                    }
                });
        });
    }

    simplifyImageTransform = image => {
        let simpletranforms = this.simplifyTransform(image.transform());
        this.setTransform(image, simpletranforms);
        return simpletranforms;
    }

    simplifyTransform = transforms => {
        let combinedTransforms = [];
        for(let transform of transforms) {
            if(combinedTransforms.length) {
                let lastTranform = combinedTransforms[combinedTransforms.length - 1];
                if(lastTranform[0] == transform[0]) {
                    if(lastTranform[0] == 't') {
                        lastTranform[1] += transform[1];
                        lastTranform[2] += transform[2];
                        continue;
                    }
                    else if(lastTranform[0] == 'r') {
                        if(lastTranform[2] == transform[2] && lastTranform[3] == transform[3]) {
                            // Même centre de rotation
                            lastTranform[1] += transform[1];
                            continue;
                        }
                    }
                    else if(lastTranform[0] == 's') {
                        if(lastTranform[3] == transform[3] && lastTranform[4] == transform[4]) {
                            // Même point de grossisssement
                            lastTranform[1] *= transform[1];
                            lastTranform[2] *= transform[2];
                            continue;
                        }
                    }
                }
            }
            combinedTransforms.push(transform);
        }
        return combinedTransforms;
    }

    transcriptTransform = transforms => {
        let pathString = '';
        for(let transform of transforms) {
            pathString += transform[0];
            pathString += transform.slice(1).join(',');
        }

        return pathString;
    }

    setTransform = (image, transforms) => {
        image.attr({
            transform: this.transcriptTransform(transforms)
        });
    }

    getElementRotation = element => {
        let transforms = element.transform();
        let anchor = 0;
        for(let transform of transforms) {
            if(transform[0] == 'r') {
                anchor += transform[1];
            }
        }

        return anchor;
    }

    paste = async () => {
        if(this.iChild != undefined) {
            let item = this.childrenImage[this.iChild];
            this.pasteImage(item, this.iChild);
        }
    }

    pasteImage = async (item, index, action) => {
        if(index === undefined) {
            index = this.getChildIndex(item.boundaryShape.component);
        }
        item.paste(index, this.immutableImages, this.childrenImage, this.scaleFactor, action);
        this.toFront();

        // use web workers here
        let bufferData = await this.getImageBuffer();
        if(bufferData.fromMemory) {
            await this.bufferizeElementOn(bufferData.image, item.image, this);
        }
        else {
            this.memory.src = bufferData.image;
        }
    }

    pasteClipboardImage = async () => {
        let resource;
        if(navigator.clipboard) {
            const text = await navigator.clipboard.readText();
            try {
                resource = JSON.parse(text);
            } catch (error) {
                // Usual clipboard content
                return;
            }
        }
        else {
            resource = this.clipboard;
            if(!resource || !resource.length) {
                // Empty local clipboard
                return;
            }
        }

        let srcs = [], bounds = [];
        for(let i=0; i<resource.length; i++) {
            srcs.push(resource[i].src);
            bounds.push(resource[i].bounds);
        }
        await this.addBmps(srcs, bounds, 1);
    }

    releaseMemory = () => {
        if(this.memory != undefined && this.memory != null) {
            this.memory.release();
        }
    }

    recomputeMemory = async () => {
        this.releaseMemory();
        this.memory.src = (await this.getImageBuffer()).image;
    }

    bufferOnMemory = async (element) => {
        let image = (await this.getImageBuffer()).image;
        await this.bufferizeElementOn(image, element, this);
        if(this.memory.src !== image) {
            this.memory.src = image;
        }
    }

    getImageBuffer = async () => {
        if(this.memory.src) {
            return {
                image: this.memory.src,
                fromMemory: true
            };
        }
        else {
            let src = this.image.clone();
            let elements = this.getPastedElement();
            await this.bufferizeElementsOn(src, elements);
            return {
                image: src,
                fromMemory: false
            };
        }
    }

    executeSelection = async (src, execution) => {
        if(!src) {
            src = (await this.getImageBuffer()).image;
        }

        let areas = this.getAreas();
        let polygonAreas = this.getPolygonAreas();
        let action = {};

        // save this src for coming operation
        this.memory.src = await execution(src, areas, polygonAreas, action);
    }

    clearClipboard = () => {
        delete this.clipboard;
        this.clipboard = [];
    }

    copy = async (src) => {
        let clipboard = [];
        let execution = async (src, areas, polygonAreas, action) => {
            this.clearClipboard();
            for(const area of areas) {
                const cropsrc = await this.cropFrom(src, area).getBase64Async('image/png');
                clipboard.push({ src: cropsrc, bounds: area });
            }
            for(const polygonArea of polygonAreas) {
                const areaBounding = GeometryResolver.getPolygonBounds(polygonArea);
                const cropsrc = await this.cropFrom(src, areaBounding).getBase64Async('image/png');
                const base64 = ImageItem.toBase64(cropsrc);
                let alphaImage = await (await ImageItem.setImageAlphaChannel(base64, areaBounding, polygonArea)).getBase64Async('image/png');
                clipboard.push({ src: alphaImage, bounds: areaBounding, area: polygonArea });
            }

            if(navigator.clipboard) {
                await navigator.clipboard.writeText(JSON.stringify(clipboard));
            }
            else {
                this.clipboard = clipboard;
            }

            this.setChildrenImageOutline();
            this.removeAllSelection();
            this.removePolygonalSelection();
            this.toFront();

            return src;
        };

        await this.executeSelection(src, execution);
    }

    cut = async (src) => {
        let execution = async (src, areas, polygonAreas, action) => {
            
            // const stageBox = this.stage.getBBox();
            const stageBox = GeometryResolver.getPolygonBounds(this.rootComponent().points);
            const stageCenter = {
                x: stageBox.x + stageBox.width / 2,
                y: stageBox.y + stageBox.height / 2,
            }

            for(const area of areas) {
                const cropsrc = await this.cropFrom(src, area).getBase64Async('image/png');
                let items = await this.cleanAndCalc(cropsrc, area, action);
                
                for(const key in items) {
                    const item = items[key];
                    if(item instanceof ImageItem) {
                        await item.scaleElementOnPoint(this.rootComponent().transformation().attrs.sx - 1, stageCenter.x, stageCenter.y, false);
                        await item.rotateElementOnPoint(this.rootComponent().transformation().attrs.anchor, stageCenter.x, stageCenter.y, false);
                        await item.translateElement({
                            x: this.rootComponent().transformation().attrs.tx,
                            y: this.rootComponent().transformation().attrs.ty}, false);
                    }
                    else {
                        await item.scale(this.rootComponent().transformation().attrs.sx, stageCenter.x, stageCenter.y);
                        await item.rotate(this.rootComponent().transformation().attrs.anchor, stageCenter.x, stageCenter.y);
                        await item.translate(
                            this.rootComponent().transformation().attrs.tx,
                            this.rootComponent().transformation().attrs.ty);
                    }

                    // Move it to worker
                    if(item.component.data('include it')) {
                        await this.bufferizeElementOn(src, item.component, this);
                    }
                }
            }
    
            for(const polygonArea of polygonAreas) {
                const areaBounding = GeometryResolver.getPolygonBounds(polygonArea);
                const cropsrc = await this.cropFrom(src, areaBounding).getBase64Async('image/png');
                let items = await this.cleanAndCalcPolygon(cropsrc, polygonArea, action);
                for(const key in items) {
                    const item = items[key];
                    if(item instanceof ImageItem) {
                        await item.scaleElementOnPoint(this.rootComponent().transformation().attrs.sx - 1, stageCenter.x, stageCenter.y, false);
                        await item.rotateElementOnPoint(this.rootComponent().transformation().attrs.anchor, stageCenter.x, stageCenter.y, false);
                        await item.translateElement({
                            x: this.rootComponent().transformation().attrs.tx,
                            y: this.rootComponent().transformation().attrs.ty}, false);
                    }
                    else {
                        await item.scale(this.rootComponent().transformation().attrs.sx, stageCenter.x, stageCenter.y);
                        await item.rotate(this.rootComponent().transformation().attrs.anchor, stageCenter.x, stageCenter.y);
                        await item.translate(
                            this.rootComponent().transformation().attrs.tx,
                            this.rootComponent().transformation().attrs.ty);
                    }

                    if(item.component.data('include it')) {
                        await this.bufferizeElementOn(src, item.component, this);
                    }
                }
            }
            
            this.setChildrenImageOutline();
            this.addAction(action);
            this.removeAllSelection();
            this.removePolygonalSelection();
            this.toFront();
            return src;
        };
        
        await this.executeSelection(src, execution);
    }

    reestablish = async () => {
        let rectPoints = await this.rootComponent().getPoints();
        const center = GeometryResolver.getBoundCenter(
            GeometryResolver.getPolygonBounds(rectPoints)
        );
        const unscaledPoints = Transformation.homothetiePoints(
            rectPoints, 
            1 / this.rootComponent().transformation().attrs.sx,
            center);

        const straightenedPoints = Transformation.rotationPoints(
            unscaledPoints,
            - this.rootComponent().transformation().attrs.anchor,
            center);

        const straightenedBounds = GeometryResolver.getPolygonBounds(straightenedPoints);
        const alignVector = { x: -straightenedBounds.x, y: -straightenedBounds.y };

        return new Transformation([
            ['s', 1 / this.rootComponent().transformation().attrs.sx, 1 / this.rootComponent().transformation().attrs.sy, center.x, center.y],
            ['r', - this.rootComponent().transformation().attrs.anchor, center.x, center.y],
            ['t', alignVector.x, alignVector.y]
        ]);
    }

    toRootView = () => {
        return async (item) => {
            let transformation = this.reestablish();
            if(item instanceof ImageItem) {
                await item.scaleElementOnPoint( 1 - (1 / transformation.attrs.sx), transformation.attrs.scx, transformation.attrs.scy, false);
                await item.rotateElementOnPoint(transformation.attrs.anchor, transformation.attrs.rcx, transformation.attrs.rcy, false);
                await item.translateElement({
                    x: transformation.attrs.tx,
                    y: transformation.attrs.ty}, false);
            }
            else {
                await item.scale(transformation.attrs.sx, transformation.attrs.scx, transformation.attrs.scy, false);
                await item.rotate(transformation.attrs.anchor, transformation.attrs.rcx, transformation.attrs.rcy, false);
                await item.translate({
                    x: transformation.attrs.tx,
                    y: transformation.attrs.ty}, false);
            }
        };
    }

    getPastedElement = () => {
        return this.getElementsToPaste();
    }

    pathToPolygon = (element) => {
        let polygon = [];
        for(let instruction of element.attrs.path) {
            if(instruction[0] == 'M' || instruction[0] == 'L') {
                polygon.push({
                    x: instruction[1],
                    y: instruction[2]
                });
            }
        }
        return polygon;
    }

    pathToArrayPolygon = (element) => {
        let polygon = [];
        for(let instruction of element.attrs.path) {
            if(instruction[0] == 'M' || instruction[0] == 'L') {
                polygon.push([
                    instruction[1],
                    instruction[2]
                ]);
            }
        }
        return polygon;
    }

    getAllImmutableElements = () => {
        let elements = [];
        for(let action of this.history) {
            for(const id in action) {
                let groupAction = action[id];
                for(let smAction of groupAction) {
                    if(smAction.actionName == 'add') {
                        elements.push(
                            this.paper.getById(id)
                        );
                    }
                    else if(smAction.actionName == 'paste') {
                        // On déplace l'élément à la fin de la liste
                        for(let i=0; i<elements.length; i++) {
                            if(elements[i].id == id) {
                                elements.push(
                                    elements.splice(i, 1)[0]
                                );
                            }
                        }
                    }
                }
            }
        }

        return elements;
    }

    getElementsToPaste = () => {
        let all = this.getAllImmutableElements();
        let result = [];
        for(let element of all) {
            if(element && element.data('include it')) {
                result.push(element);
            }
        }
        if(this.cropMargin) {
            result.push(this.marges.top.component);
            result.push(this.marges.bottom.component);
            result.push(this.marges.left.component);
            result.push(this.marges.right.component);
        }

        return result;
    }

    toBase64 = async () => {
        // let elements = this.getPastedElement();
        // let image = this.image.clone();
        // await this.bufferizeElementsOn(image, elements);
        let image = (await this.getImageBuffer()).image;

        return image.getBase64Async('image/png');
    }

    bufferizeElementOn = async (src, element, lib) => {
        const type = element.data('type');
        if(type == 'image') {
            const anchor = lib.getElementRotation(element);
            await lib.bufferizeOn(src, element, -anchor, element.data('output bounds'));
        }
        // Gommage
        else if(type == 'rect') {
            const box = await element.root().getBBoxOnParent();
            await lib.removeAreaData(box, src);
        }
        else if(type == 'path') {
            // let clone = element.clone().attr({
            //     transform: invert.getTransformationString()
            // }).hide();
            // const polygon = lib.pathToPolygon(clone);
            const polygon = lib.pathToArrayPolygon(element);
            await lib.removePolygonAreaData(polygon, src);
            // await lib.kernelRemovePolygonAreaData(polygon, src);
        }
    }

    kernelBufferizeElementsOn = async (src, elements) => {
        const time = new Date().getTime();
        const gpu = new GPU();
        const kernel = gpu.createKernel(function(elements, src, process, lib) {
            let element = elements[this.thread.x];
            process(src, element, lib);
        }).setOutput([elements.length]);

        kernel(elements, src, this.bufferizeElementOn, this);
        console.log(kernel.toString());
        console.log('GPU computing time', new Date().getTime() - time + ' ms');
    }

    bufferizeElementsOn = async (src, elements) => {
        const time = new Date().getTime();
        // const invert = await this.reestablish();
        for(let element of elements) {
            await this.bufferizeElementOn(src, element, this);
        }
        console.log('CPU computing time', new Date().getTime() - time + ' ms');
    }

    bufferizeOn = async (src, image, rotationanchor, bounds) => {
        let base64 = image.node.href.baseVal;
        const splitted = base64.split(',');
        const [, string] = splitted;
        const img = await Jimp.read(Buffer.from(string, 'base64'));

        img.rotate(rotationanchor);
        img.resize(bounds.width, bounds.height);
        src.composite(img, bounds.x, bounds.y);
    }

    refreshMainImage = async () => {
        const canvas = this.rootComponent();
        let mainImage = this.paper.getById(this.mainImageId);
        mainImage.remove();
        
        const src = await this.image.getBase64Async('image/png');
        let newMainImage = this.paper.image(src, 0, 0, this.imgw * this.scaleFactor, this.imgh * this.scaleFactor);
        newMainImage.toBack();
        this.mainImageId = newMainImage.id;
    }

    addAction = action => {
        if(this.timeline != undefined && this.history.length > this.timeline + 1) {
            this.history.splice(this.timeline + 1);
        }
        for(let image of this.childrenImage) {
            image.clearFromActualTransformation();
        }
        this.history.push(action);
        this.timeline = this.history.length - 1;
    }

    fixChildIndex = () => {
        if(this.iChild != undefined && this.iChild >= this.childrenImage.length) {
            if(this.iChild != 0) {
                this.iChild --;
            }
            else {
                this.iChild = undefined;
            }
        }
    }

    undo = () => {
        if(this.timeline > -1) {
            ActionFactory.undo(this, this.history[this.timeline]);
            this.timeline --;
            this.recomputeMemory();
        }
        // this.updateToTimeline();
    }

    redo = () => {
        if(this.timeline < this.history.length - 1) {
            this.timeline ++;
            ActionFactory.redo(this, this.history[this.timeline]);
            this.recomputeMemory();
        }
        // this.updateToTimeline();
    }

    updateToTimeline = () => {
        if(this.timeline != undefined && this.history.length > this.timeline + 1) {
            this.history.splice(this.timeline + 1);
        }
    }

    alert = (message, type='success') => {
        let messageBoxAttr = {
            fill: 'rgb(248, 248, 248)',
            stroke: 'rgb(218, 218, 218)'
        }

        switch(type) {
            case 'success':
                messageBoxAttr.stroke = '#28a745';
                break;
            case 'error':
                messageBoxAttr.stroke = '#ff007b';
                break;
            case 'signal':
                messageBoxAttr.stroke = '#007bff';
                break;
            default:
                break;
        }
        const center = GeometryResolver.getBoundCenter(this.stage.getBBox());
        let text = this.paper.text(center.x, center.y, message);
        text.attr({
            color: '#777',
            'font-size': 16,
            'font-weight': 'medium',
        });
        let alignedBox = text.getBBox();

        let padding = { x: 15, y: 10 };
        let box = this.paper.rect(alignedBox.x - padding.x, alignedBox.y - padding.y, alignedBox.width + padding.x*2, alignedBox.height + padding.y*2);
        box.attr(messageBoxAttr);
        text.toFront();

        setTimeout(() => {
            let fadeEffect = function(element) {
                let animation = Raphael.animation({
                    opacity: 0
                }, 350, 'ease', function() {
                    element.remove();
                });

                element.animate(animation);
            };
            fadeEffect(text);
            fadeEffect(box);
        }, 2000);
    }

    static waitFor(ms) {
        return new Promise(res => {
            if(typeof ms == 'number') {
                setTimeout(res, ms);
            }
            else {
                res();
            }
        });
    }

    static initMethods() {
        Raphael.el.root = function () {
            return this.data('Parent');
        }

        Raphael.el.getViewBoundingRect = function () {
            return this.node.getBoundingClientRect();
        }
        
        Raphael.el.getViewBoundingCenter = function () {
            const DOMrect = this.getBoundingClientRect();
            return {
                x: DOMrect.left + DOMrect.width / 2,
                y: DOMrect.top + DOMrect.height / 2
            }
        }
    }
}

RaphaelCanvas.initMethods();