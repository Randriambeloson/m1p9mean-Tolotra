class BulletedListener {
    _item;
    bulletedIndex;

    constructor(item) {
        this.item = item;
    }

    dragStart = () => {
        return (x, y, event) => {
            const circle = event.target || event.relatedTarget;
            if(circle.raphaelid == this.item.bulleted[0].circle.id) {
                this.bulletedIndex = 0;
            }
            else if(circle.raphaelid == this.item.bulleted[1].circle.id) {
                this.bulletedIndex = 1;
            }
        };
    }

    dragEnd = () => {
        delete this.bulletedIndex;
    }

    verticalDrag = () => {
        return (dx, dy, x, y, event) => {
            if(0 == this.bulletedIndex) {
                this.item.parent.rulerGripLeftPos = event.layerY;
            }
            else if(1 == this.bulletedIndex) {
                this.item.parent.rulerGripRightPos = event.layerY;
            }
        };
    }

    horizontalDrag = () => {
        return (dx, dy, x, y, event) => {
            const circle = event.target || event.relatedTarget;
            if(0 == this.bulletedIndex) {
                this.item.parent.rulerGripTopPos = event.layerX;
            }
            else if(1 == this.bulletedIndex) {
                this.item.parent.rulerGripBottomPos = event.layerX;
            }
        };
    }
    
    get item() {
        return this._item;
    }
    set item(value) {
        this._item = value;
    }
}