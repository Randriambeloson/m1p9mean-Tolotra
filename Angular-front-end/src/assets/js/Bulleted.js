class Bulleted extends ViewItem {

    constructor(parent, attrs) {
        super(parent, attrs);

        let attr = attrs.attr || {
            // Default attributes are calc attributes
            stroke: '#28a745',
            'stroke-width': 2,
            'stroke-dasharray': '-',
            fill: 'rgba(50,240,50,0.05)'
        };
        this.putOnParent(attrs.action, attrs.center, attrs.radius, attr);
        this.setPoint(attrs.center);
    }

    async getCenter() {
        return (await this.getPoints())[0];
    }

    setPoint(center) {
        this.points = [center];
    }

    putOnParent(action, center, radius, attr) {
        const undef = action == undefined;
        const push = action != false;
        this.circle = this.parent.paper.circle(center.x, center.y, radius);
        this.circle.attr(attr);

        if(undef) {
            action = {};
        }
        if(push) {
            action[this.circle.id] = [ActionFactory.add(this._include)];
        }
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    toFront() {
        this.circle.toFront();
    }

    get circle() {return this.component;}
    set circle(value) {
        this.component = value;
        this.component.data('type', 'circle');
    }
}