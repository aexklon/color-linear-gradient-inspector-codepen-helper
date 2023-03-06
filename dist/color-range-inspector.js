"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorRangeInspector = void 0;
class ColorRangeInspector {
    constructor(param0) {
        this.stripEl = param0.stripEl;
        this.inspectorEl = param0.inspectorEl;
        this.components = param0.components;
        this.range = param0.range;
        this.stripEl.style.backgroundImage = param0.stripBackgroundImage;
        this.updateIndicatorPosition(this.stripEl.getBoundingClientRect().x +
            (this.stripEl.getBoundingClientRect().width / 2));
    }
    updateValues(percent) {
        const color = this.range(percent);
        this.components.forEach((component, i) => {
            component.el.innerHTML = component.format(color, i);
        });
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
