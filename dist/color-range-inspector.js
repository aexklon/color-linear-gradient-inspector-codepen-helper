"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorRangeInspector = void 0;
class ColorRangeInspector {
    constructor(param0) {
        this.moving = false;
        this.stripEl = param0.stripEl;
        this.inspectorEl = param0.inspectorEl;
        this.components = param0.components;
        this.range = param0.range;
        this.stripEl.style.backgroundImage = param0.stripBackgroundImage;
        this.updateIndicatorPosition(this.stripEl.getBoundingClientRect().x +
            (this.stripEl.getBoundingClientRect().width / 2));
        this.stripEl.addEventListener('mousedown', (e) => this.pickup(e, this.stripEl));
        this.stripEl.addEventListener('mousemove', (e) => this.move(e, this.stripEl));
        this.stripEl.addEventListener('mouseup', (e) => this.release(e, this.stripEl));
        this.stripEl.addEventListener('touchstart', (e) => this.pickup(e, this.stripEl));
        this.stripEl.addEventListener('touchmove', (e) => this.move(e, this.stripEl));
        this.stripEl.addEventListener('touchend', (e) => this.release(e, this.stripEl));
    }
    updateValues(percent) {
        const color = this.range(percent);
        this.components.forEach((component, i) => {
            component.el.innerHTML = component.format(color, i);
        });
    }
    pickup(event, stripEl) {
        event.preventDefault();
        event.stopPropagation();
        this.moving = true;
        stripEl.classList.add('moving');
        this.updateIndicatorPosition(event.hasOwnProperty('x') ?
            event.x :
            event.touches[0].clientX);
    }
    move(event, _stripEl) {
        if (this.moving) {
            event.preventDefault();
            event.stopPropagation();
            this.updateIndicatorPosition(event.hasOwnProperty('x') ?
                event.x :
                event.touches[0].clientX);
        }
    }
    release(_event, stripEl) {
        this.moving = false;
        stripEl.classList.remove('moving');
    }
    updateIndicatorPosition(evX) {
        const container = this.stripEl.getBoundingClientRect();
        const constrainStart = 0;
        const constrainEnd = container.width;
        const nextPosition = evX - container.x;
        const constrainedStart = nextPosition < constrainStart;
        const constrainedEnd = nextPosition > constrainEnd;
        if (!(constrainedStart || constrainedEnd)) {
            this.inspectorEl.style.left = (nextPosition - 1) + 'px';
            this.updateValues((nextPosition) / container.width);
        }
        else if (constrainedStart) {
            this.inspectorEl.style.left = (constrainStart - 1) + 'px';
            this.updateValues(constrainStart / container.width);
        }
        else if (constrainedEnd) {
            this.inspectorEl.style.left = (constrainEnd - 1) + 'px';
            this.updateValues(constrainEnd / container.width);
        }
    }
}
exports.ColorRangeInspector = ColorRangeInspector;
