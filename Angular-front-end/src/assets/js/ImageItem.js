class ImageItem extends ViewItem {
    _boundaryShape;
    _componentsSet;
    _surround = true;
    loadImage = Promise.resolve();

    constructor(parent, params) {
        super(parent, params);

        this.componentsSet = this.parent.paper.set();
        if(params.border != undefined) {
            this._surround = params.border;
        }
        
        this.loading = new Promise(res => {
            this.putOnParent(params.action, params.src, params.bounds, params.area);
            this.setPoints(res);
        });
    }

    async setPoints(res) {
        await this.loadImage;
        this.points = GeometryResolver.getRectPoints(this.boundary);
        res();
    }

    putOnParent(action, src, bounds, area) {
        this.loadImage = new Promise(async (res, rej) => {

            const undef = action == undefined;
            const push = action !== false;
            const polygon = area != undefined;

            if(polygon) {
                let base64 = ImageItem.toBase64(src);
                let alphaImage = await ImageItem.setImageAlphaChannel(base64, bounds, area);
                let alphaBase64 = await alphaImage.getBase64Async('image/png');
                this.image = this.parent.paper.image(alphaBase64, bounds.x, bounds.y, bounds.width, bounds.height);
            }
            else {
                if(typeof src == 'string') {
                    this.image = this.parent.paper.image(src, bounds.x, bounds.y, bounds.width, bounds.height);
                }
                else {
                    this.image = src;
                }    
            }
            
            if(push) {
                if(undef) {
                    action = {};
                }
                action[this.image.id] = [ActionFactory.add(this._include)];
                if(this._surround) {
                    if(polygon) {
                        this.boundaryShape = new PathItem(this.parent, {
                            include: false,
                            action: false, 
                            polygon: area
                        });
                    }
                    else {
                        this.boundaryShape = new RectItem(this.parent, {
                            include: false,
                            action: false,
                            bounds: this.boundary
                        });
                    }
                }
                
                if(undef) {
                    this.parent.addAction(action);
                }
            }
            
            res();
        });
    }

    toFront() {
        try {
            this.componentsSet.toFront();
        } catch (error) {
            this.componentsSet.forEach(item => {
                console.log(item);
            });
            console.error(error);
        }
        
    }

    clone(action) {
        const undef = action == undefined;
        if(undef) {
            action = {};
        }
        let cloneSrc = this.image.clone();
        // cloneSrc.attr(this.getBBox());
        let clone = new ImageItem(this.parent, {
            action: action,
            src: cloneSrc,
            bounds: this.getBBox()
        });
        clone.transformationIndex = clone.transformations.length;
        clone.transformations.push(this.transformation().clone());
        clone.update();

        if(undef) {
            this.parent.addAction(action);
        }

        return clone;
    }

    delete(action) {
        const undef = action == undefined;
        const push = action !== false;
        if(push) {
            if(undef) {
                action = {};
            }

            if(!action[this.image.id]) {
                action[this.image.id] = [];
            }
            action[this.image.id].push(ActionFactory.delete(this.component.data('include it')));
        }

        this.componentsSet.data('include it', false).hide();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    restore(included) {
        this.componentsSet.show();
        this.component.data('include it', included);
        if(this.parent.iChild === undefined) {
            this.parent.iChild = 0;
        }
    }

    paste = (index, immutableImages, imagesList, scaleFactor, action) => {
        const undef = action == undefined;
        if(undef) {
            action = {};
        }

        immutableImages.push(this);
        let outputBounds = Object.assign({}, this.boundary);
        
        GeometryResolver.unscale([outputBounds], scaleFactor);
        // const {x,y} = this.parent.translateToCenter();
        
        // outputBounds = Transformation.translateRect(outputBounds, -x/scaleFactor, -y/scaleFactor);
        // console.log(outputBounds);
        this.image
            .data('output bounds', outputBounds)
            .data('x', this.boundary.x / scaleFactor)
            .data('y', this.boundary.y / scaleFactor)
            .data('include it', true);
        this.parent.addUIListener(this.image);
        this.parent.addScrollWheelListener(this.image);

        this.boundaryShape.component.hide();
        imagesList.splice(index, 1);
        this.parent.fixChildIndex();

        if(!action[this.image.id]) {
            action[this.image.id] = [];
        }
        if(!action[this.boundaryShape.component.id]) {
            action[this.boundaryShape.component.id] = [];
        }
        action[this.image.id] = [ActionFactory.paste(index, immutableImages, imagesList, this.boundaryShape.component)];
        action[this.boundaryShape.component.id] = [ActionFactory.delete()];

        if(undef) {
            this.parent.addAction(action);
        }
    }

    scaleTransformation(scale) {
        this.componentsSet.forEach((component) => {
            super.scaleTransformation.apply(component.root(), [scale]);
        });
    }

    async replaceTranslateElement(vector) {
        let set = [this, this.boundaryShape];

        for(let item of set) {
            await item.replaceTranslate(vector.x, vector.y);
        };
        this.updateBoundary();
    }

    async translateElement(vector, action) {
        const undef = action == undefined;
        const push = action !== false;
        if(undef) {
            action = {};
        }
        let set = [this];
        if(this._surround) {
            set.push(this.boundaryShape);
        }
        // this.componentsSet.forEach(element => {
        for(let item of set) {
            const element = item.component;
            // element.translateElement(this.parent, vector.x, vector.y);
            await item.translate(vector.x, vector.y);
            if(push) {
                if(!action[element.id]) {
                    action[element.id] = [];
                }
                action[element.id].push(ActionFactory.translation(vector.x, vector.y));
            }
        };
        this.updateBoundary();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    async scaleElement(scale, action) {
        const undef = action == undefined;
        const push = action !== false;
        if(undef) {
            action = {};
        }
        let set = [this, this.boundaryShape];

        // this.componentsSet.forEach(element => {
        for(let item of set) {
            const element = item.component;
            // const center = GeometryResolver.getBoundCenter(element.getBBox());
            // element.scaleElement(this.parent, scale, scale, center.x, center.y);
            let center = undefined;
            await item.addScale(scale);
            if(push) {
                if(!action[element.id]) {
                    action[element.id] = [];
                }
                action[element.id].push(ActionFactory.scale(center, scale));
            }
        };
        
        this.updateBoundary();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    async scaleElementOnPoint(scale, x, y, action) {
        const undef = action == undefined;
        const push = action !== false;
        if(undef) {
            action = {};
        }
        let set = [this, this.boundaryShape];

        // this.componentsSet.forEach(element => {
        for(let item of set) {
            const element = item.component;
            // const center = GeometryResolver.getBoundCenter(element.getBBox());
            // element.scaleElement(this.parent, scale, scale, center.x, center.y);
            let center = undefined;
            await item.addScale(scale, x, y);
            if(push) {
                if(!action[element.id]) {
                    action[element.id] = [];
                }
                action[element.id].push(ActionFactory.scale(center, scale));
            }
        };
        
        this.updateBoundary();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    async replaceRotateElement(anchor) {
        let set = [this, this.boundaryShape];

        // this.componentsSet.forEach(element => {
        for(let item of set) {
            await item.replaceRotate(anchor);
        };
    }

    async rotateElement(anchor, action) {
        const undef = action == undefined;
        const push = action !== false;
        if(undef) {
            action = {};
        }
        let set = [this, this.boundaryShape];

        // this.componentsSet.forEach(element => {
        for(let item of set) {
            const element = item.component;
            // element.rotateElement(this.parent, anchor);
            await item.rotate(anchor);
            if(push) {
                if(!action[element.id]) {
                    action[element.id] = [];
                }
                action[element.id].push(ActionFactory.rotation(anchor));
            }
        };
        this.updateBoundary();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    async rotateElementOnPoint(anchor, x, y, action) {
        const undef = action == undefined;
        const push = action !== false;
        if(undef) {
            action = {};
        }
        let set = [this, this.boundaryShape];

        // this.componentsSet.forEach(element => {
        for(let item of set) {
            const element = item.component;
            // element.rotateElement(this.parent, anchor);
            await item.rotate(anchor, x, y);
            if(push) {
                if(!action[element.id]) {
                    action[element.id] = [];
                }
                action[element.id].push(ActionFactory.rotation(anchor));
            }
        };
        this.updateBoundary();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    updateBoundary() {
        this.getBBoxOnParent().then(bounds => {
            this.boundary = bounds;
        });
        // this.boundary = this.image.getBBox();
    }

    forward() {
        super.forward.apply(this);
        this.updateBoundary();
    }

    backward() {
        super.backward.apply(this);
        this.updateBoundary();
    }

    async setDragListener() {
        await this.loading;
        this.boundaryShape.component.click(() => {
            this.parent.iChild = this.parent.getBmpIndex(this.image);
            this.parent.updateSelectedChild();
        });

        let position = {
            x: 0,
            y: 0,
            tx: 0,
            ty: 0
        };
        this.boundaryShape.component.drag(
            this.boundaryShape.observer.drag(position),
            this.boundaryShape.observer.dragStart(position),
            this.boundaryShape.observer.dragEnd(position)
        );
        this.boundaryShape.component.hover(
            this.boundaryShape.observer.hoverin(),
            this.boundaryShape.observer.hoverout()
        );
    }

    static async setImageAlphaChannel(base64, bounds, area) {
        let img = await Jimp.read(Buffer.from(base64, 'base64'));
        let scaleFactor = img.bitmap.width / bounds.width;
        let toOriginArea = GeometryResolver.getTranslatedPolygon(area, { x: -bounds.x, y: -bounds.y });
        let toScaledArea = GeometryResolver.getScaledPolygon(toOriginArea, scaleFactor, { x: 0, y: 0 });

        let alpha = Jimp.rgbaToInt(255,255,255,0);
        for(let x=0; x<img.bitmap.width; x++) {
            for(let y=0; y<img.bitmap.height; y++) {
                if( ! GeometryResolver.inside([ x, y ], toScaledArea) ) {
                    img.setPixelColor(alpha, x, y);
                }
            }                
        }
        return img;
    }

    static toBase64(src) {
        let base64 = '';
        if(typeof src != 'string') {
            src = src.node.href.baseVal;
        }
        [, base64] = src.split(',');
        return base64;
    }

    get componentsSet() {return this._componentsSet;}
    set componentsSet(value) {this._componentsSet = value;}
    get boundaryShape() {return this._boundaryShape;}
    set boundaryShape(value) {
        this._boundaryShape = value;

        this.componentsSet.clear();
        if(this.image) {
            this.componentsSet.push(this.image);
        }
        this.componentsSet.push(this.boundaryShape.component);
    }

    get image() {return this.component;}
    set image(value) {
        this.component = value;
        this.component.data('type', 'image');
        this.boundary = this.image.getBBox();

        this.componentsSet.clear();
        this.componentsSet.push(this.image);
        if(this.boundaryShape) {
            this.componentsSet.push(this.boundaryShape.component);
        }
    }
}