class RectItem extends ViewItem {

    constructor(parent, attrs) {
        super(parent, attrs);

        let attr = attrs.attr || {
            // Default attributes are calc attributes
            stroke: '#28a745',
            'stroke-width': 2,
            'stroke-dasharray': '--',
            fill: 'rgba(50,240,50,0.05)'
        };
        this.putOnParent(attrs.action, attrs.bounds, attr);
        this.setPoints(attrs.bounds);
    }

    setPoints(bounds) {
        this.points = GeometryResolver.getRectPoints(bounds);
    }

    putOnParent(action, bounds, attr) {
        const undef = action == undefined;
        const push = action != false;
        this.rect = this.parent.paper.rect(bounds.x, bounds.y, bounds.width, bounds.height);
        this.rect.attr(attr);

        if(undef) {
            action = {};
        }
        if(push) {
            action[this.rect.id] = [ActionFactory.add(this._include)];
        }
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    toFront() {
        this.rect.toFront();
    }

    get rect() {return this.component;}
    set rect(value) {
        this.component = value;
        this.component.data('type', 'rect');
    }
}