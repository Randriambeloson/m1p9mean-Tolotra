class PathItem extends ViewItem {
    
    constructor(parent, attrs) {
        super(parent, attrs);

        let attr = attrs.attr || {
            // Default attributes are calc attributes
            stroke: '#28a745',
            'stroke-width': 2,
            'stroke-dasharray': '--',
            fill: 'rgba(50,240,50,0.05)'
        };
        this.putOnParent(attrs.action, attrs.polygon, attr);
        this.setPoints(attrs.polygon);
    }

    setPoints(polygon) {
        if(polygon.length) {
            if(typeof polygon == 'string') {
                let transformHelper = new TransformationFactoryBuilder();
                this.points = transformHelper.pathStringToPolygon(polygon);
            }
            else if(polygon[0].x != undefined) {
                this.points = [];
                for(let pt of polygon) {
                    this.points.push([ pt.x, pt.y ]);
                }
            }
            else {
                this.points = polygon;
            }
        }
        else {
            throw new Error('Empty point list');
        }
    }

    putOnParent(action, polygon, attr) {
        let transformHelper = new TransformationFactoryBuilder();
        const undef = action == undefined;
        const push = action !== false;

        let pathString = transformHelper.polygonToPathString(polygon);
        this.path = this.parent.paper.path(pathString);
        this.path.attr(attr);

        if(undef) {
            action = {};
        }
        if(push) {
            action[this.path.id] = [ActionFactory.add(this._include)];
        }
        if(undef && push) {
            this.parent.addAction(action);
        }
    }

    toFront() {
        this.path.toFront();
    }

    get path() {return this.component;}
    set path(value) {
        this.component = value;
        this.component.data('type', 'path');
    }
}