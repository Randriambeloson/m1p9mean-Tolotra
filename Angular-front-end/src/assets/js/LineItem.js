class LineItem extends ViewItem {
    bulleted = [];

    constructor(parent, attrs) {
        super(parent, attrs);

        let attr = attrs.attr || {
            // Default attributes are calc attributes
            stroke: '#28a745',
            'stroke-width': 2,
            'stroke-dasharray': '.',
            fill: 'rgba(50,240,50,0.05)'
        };
        this.putOnParent(attrs.action, attrs.points, attrs.radius, attr);
        this.setPoints(attrs.points);
    }

    replaceTranslatePoints(vect1, vect2) {
        if(this.bulleted) {
            this.bulleted[0].replaceTranslate(vect1.x, vect1.y);
            this.bulleted[1].replaceTranslate(vect2.x, vect2.y);

            Promise.all([this.bulleted[0].getCenter(), this.bulleted[1].getCenter()])
            .then(tc => {
                const [c1, c2] = tc;
                this.line.attr({
                    path: `M${c1.x},${c1.y}L${c2.x},${c2.y}`
                });
            });
        }
    }

    translatePoints(vect1, vect2) {
        if(this.bulleted) {
            this.bulleted[0].translate(vect1.x, vect1.y);
            this.bulleted[1].translate(vect2.x, vect2.y);

            Promise.all([this.bulleted[0].getCenter(), this.bulleted[1].getCenter()])
            .then(tc => {
                const [c1, c2] = tc;
                this.line.attr({
                    path: `M${c1.x},${c1.y}L${c2.x},${c2.y}`
                });
            });
        }
    }

    remove() {
        while(this.bulleted.length) {
            this.bulleted.pop().remove();
        }
        this.line.remove();
    }

    setPoints(points) {
        this.points = points;
    }

    putOnParent(action, points, radius, attr) {
        const undef = action == undefined;
        const push = action !== false;

        this.bulleted = [
            new Bulleted(this.parent, {
                include: false,
                action: false,
                center: { x: points[0][0], y: points[0][1] },
                radius: radius
            }),
            new Bulleted(this.parent, {
                include: false,
                action: false,
                center: { x: points[1][0], y: points[1][1] },
                radius: radius
            })
        ];
        let pathString = `M${points[0].join(',')}L${points[1].join(',')}`;
        this.line = this.parent.paper.path(pathString);
        this.line.attr(attr);

        if(undef) {
            action = {};
        }
        if(push) {
            action[this.line.id] = [ActionFactory.add(this._include)];
        }
        if(undef && push) {
            this.parent.addAction(action);
        }
    }
    
    toFront() {
        this.line.toFront();
    }

    get line() {return this.component;}
    set line(value) {
        this.component = value;
        this.component.data('type', 'line');
    }
}