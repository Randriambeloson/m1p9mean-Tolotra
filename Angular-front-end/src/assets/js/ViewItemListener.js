class ViewItemListener {
    _item;

    dragMode = 'move';

    constructor(item) {
        this.item = item;
    }

    hoverin = () => {
        return async event => {
            let center = await this.item.getBoxCenter();
            let icon_width = 26;
            let icon_height = 26;
            let middleIconAttr = {
                stroke: '#007bff',
                fill: '#007bff',
                'stroke-width': 1,
                transform: `t${center.x - icon_width / 2},${center.y - icon_height / 2}`
            };
            if(this.item.parent.dragMode == 'rotate_element') {
                this.item.component.attr({
                    cursor: 'grab'
                });
                // middleIcon = this.view.paper.path('M1.5,6V15H9M5.265,22.5A13.5,13.5,0,1,0,8.46,8.46L1.5,15');
                this.item.middleIcon = this.item.parent.paper.path('M11.2,32.235A15.8,15.8,0,0,1,2.25,19.5H0A17.991,17.991,0,0,0,17.925,36c.345,0,.66-.03.99-.045L13.2,30.225ZM18.075,0c-.345,0-.66.03-.99.06L22.8,5.775l2-1.995A15.752,15.752,0,0,1,33.75,16.5H36A17.991,17.991,0,0,0,18.075,0ZM24,21h3V12a3,3,0,0,0-3-3H15v3h9ZM12,24V6H9V9H6v3H9V24a3,3,0,0,0,3,3H24v3h3V27h3V24Z');
                this.item.middleIcon.attr(middleIconAttr);
            }
            else if(this.item.parent.dragMode == 'move_element') {
                this.item.component.attr({
                    cursor: 'move'
                });
                this.item.middleIcon = this.item.parent.paper.path('M15.75,0,9,6.75h4.5V13.5H6.75V9L0,15.75,6.75,22.5V18H13.5v6.75H9l6.75,6.75,6.75-6.75H18V18h6.75v4.5l6.75-6.75L24.75,9v4.5H18V6.75h4.5Z');
                this.item.middleIcon.attr(middleIconAttr);
            }
            else if(this.item.parent.dragMode == 'resize_element') {
                this.item.component.attr({
                    cursor: 'nesw-resize'
                });
                this.item.middleIcon = this.item.parent.paper.path('M15.75,0,9,6.75h4.5V13.5H6.75V9L0,15.75,6.75,22.5V18H13.5v6.75H9l6.75,6.75,6.75-6.75H18V18h6.75v4.5l6.75-6.75L24.75,9v4.5H18V6.75h4.5Z');
                this.item.middleIcon.attr(middleIconAttr);
                this.item.middleIcon.rotate(45);
            }
        }
    }

    hoverout = () => {
        return () => {
            this.item.component.attr({
                cursor: 'default'
            });
            this.item.middleIcon?.remove();
        }
    }

    drag = (position) => {
        return (dx, dy, x, y, event) => {
            this.item.parent.translateChild(this.item.parent.iChild, {x: dx, y: dy}, false);
            position.x = x;
            position.y = y;
            position.tx = dx;
            position.ty = dy;
        }
    }

    dragStart = (position) => {
        return (x, y, event) => {
            this.item.component.attr({
                cursor: 'move'
            });
            position.x = x;
            position.y = y;
            this.item.parent.iChild = this.item.parent.getChildIndex(this.item.component);
            this.item.parent.translateChild(this.item.parent.iChild, {x: 0, y: 0}, false);
        }
    }

    dragEnd = (position) => {
        return (event) => {
            this.item.component.attr({
                cursor: 'default'
            });

            let action = {};
            action[this.item.component.id] = [ActionFactory.translation()];
            action[this.item.parent.childrenImage[this.item.parent.iChild].image.id] = [ActionFactory.translation()];
            this.item.parent.addAction(action);
        }
    }

    get item() {
        return this._item;
    }
    set item(value) {
        this._item = value;
    }
}