class ViewItem {
    _parent;
    _component;
    _boundary;
    _observer;
    _include = false;
    transformResolver;
    transformations = [new Transformation()];
    transformationIndex = 0;
    relativeTransform = [];
    points;
    loading = Promise.resolve();

    constructor(parent, attr) {
        this.parent = parent;
        this.observer = new ViewItemListener(this);
        this.transformResolver = new TransformationFactoryBuilder();
        this._include = attr.include == true;
    }

    remove() {
        this.component?.remove();
    }

    anchor() {
        return this.component.data('anchor') || 0;
    }

    scaleX() {
        return this.component.data('scaleX') || 1;
    }
    scaleY() {
        return this.component.data('scaleY') || 1;
    }

    transformation() {
        return this.transformations[this.transformationIndex];
    }

    getBoxCenter() {
        let box = this.component.getBBox();
        return GeometryResolver.getBoundCenter(box);
    }

    scaleTransformation(scale) {
        for(const transformation of this.transformations) {
            transformation.scaleTransformation(scale);
        }
        this.update()
    }

    async replaceTranslate(x, y) {
        this.transformations.splice(this.transformationIndex, 1);
        this.transformationIndex --;
        await this.translate(x, y);
    }

    async translate(x, y) {
        await this.loading;
        this.clearFromActualTransformation();
        let transformation = this.transformation().translateElement(this, x, y);
        this.transformations.push(transformation);
        this.transformationIndex ++;
        this.update();
    }

    async replaceRotate(anchor, x, y) {
        this.transformations.splice(this.transformationIndex, 1);
        this.transformationIndex --;
        await this.rotate(anchor, x, y);
    }

    async rotate(anchor, x, y) {
        await this.loading;
        this.clearFromActualTransformation();
        let print = this._surround === false;
        let transformation = await this.transformation().rotateElement(this, anchor, { x: x, y: y }, print);
        this.transformations.push(transformation);
        this.transformationIndex ++;
        this.update();
    }

    async addScale(scale, x, y) {
        await this.loading;
        this.clearFromActualTransformation();
        let transformation = await this.transformation().addScaleElement(this, scale, { x: x, y: y });
        this.transformations.push(transformation);
        this.transformationIndex ++;
        this.update();
    }

    async scale(scale, x, y) {
        await this.loading;
        this.clearFromActualTransformation();
        let transformation = await this.transformation().scaleElement(this, scale, { x: x, y: y });
        this.transformations.push(transformation);
        this.transformationIndex ++;
        this.update();
    }

    transform() {
        return this.component.transform();
    }

    cloneTransformations() {
        let clones = [];
        for(let t of this.transformations) {
            clones.push(t.clone());
        }
        return clones;
    }

    invertRelativeTransform() {
        let invertVersion = [];
        for(let i=this.relativeTransform.length - 1; i>=0; i--) {
            invertVersion.push(this.transformResolver.invertTransformation(this.relativeTransform[i]));
        }

        return invertVersion;
    }

    async getPoints() {
        await this.loading;
        return this.transformation().transformPoints(this.points);
    }

    async getBoxCenter() {
        return GeometryResolver.getPolygonCenter(await this.getPoints());
    }

    async getBBox() {
        return GeometryResolver.getPolygonBounds(await this.getPoints());
    }

    async getBBoxOnParent() {
        let points = await this.getPoints();
        let ppoints = [];
        for(let pt of points) {
            ppoints.push(await this._parent.getPointCoordinatesOnRoot_keepScale(pt, 'array'));
        }
        return GeometryResolver.getPolygonBounds(ppoints);
    }

    update() {
        this.component.attr({
            transform: this.transformation().getTransformationString()
        });
    }

    toFront() {
        this.component.toFront();
    }

    forward() {
        if(this.transformationIndex < this.transformations.length - 1)
            this.transformationIndex ++;
        this.update();
    }

    backward() {
        if(this.transformationIndex > 0)
            this.transformationIndex --;
        this.update();
    }

    clearFromActualTransformation() {
        this.transformations.splice(this.transformationIndex + 1);
    }

    clearTransformationFromStart() {
        this.transformationIndex = 0;
        this.clearFromActualTransformation();
        this.update();
    }

    delete(action) {
        const undef = action == undefined;
        const push = action !== false;
        if(push) {
            if(undef) {
                action = {};
            }

            if(!action[this.component.id]) {
                action[this.component.id] = [];
            }
            action[this.component.id].push(ActionFactory.delete(this.component.data('include it')));
        }
        
        this.component.data('include it', false).hide();
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    restore(included) {
        this.component.show().data('include it', included);
    }

    get boundary() {return this._boundary;}
    set boundary(value) {this._boundary = value;}
    get component() {return this._component;}
    set component(value) {
        if(value) {
            this._component = value;
            this._component.data('Parent', this);
        }
    }
    get observer() {return this._observer;}
    set observer(value) {this._observer = value;}

    get parent() {return this._parent;}
    set parent(value) {
        if(!value) {
            throw new Error('Un composant graphique doit toujours appartenir à une vue parente');
        }
        this._parent = value;
    }
}