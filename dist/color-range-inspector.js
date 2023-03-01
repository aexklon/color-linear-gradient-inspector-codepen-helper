"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorRangeInspector = void 0;
class ColorRangeInspector {
    constructor(param0) {
        this.stripEl = param0.stripEl;
        this.indicatorEl = param0.indicatorEl;
        this.indicatorUiEl = param0.indicatorUiEl;
        this.components = param0.components;
        this.range = param0.range;
        this.stripEl.style.backgroundImage = param0.stripBackgroundImage;
        this.updateIndicatorPosition(this.stripEl.getBoundingClientRect().x +
            (this.stripEl.getBoundingClientRect().width / 2));
        this.indicatorEl.addEventListener('drag', (event) => {
            event.preventDefault();
            event.stopPropagation();
            this.updateIndicatorPosition(event.x);
        });
    }
    updateValues(percent) {
        const color = this.range(percent);
        color.coords.forEach((c, i) => {
            this.components[i].el.innerHTML = this.components[i].format(c);
        });
    }
    updateIndicatorPosition(evX) {
        const container = this.stripEl.getBoundingClientRect();
        const constrainStart = 0;
        const constrainEnd = container.width;
        const nextPosition = evX - container.x;
        const constrainedStart = nextPosition < constrainStart;
        const contrainedEnd = nextPosition > constrainEnd;
        if (!(constrainedStart || contrainedEnd)) {
            this.indicatorUiEl.style.left = (nextPosition - 1) + 'px';
            this.indicatorEl.style.left = (nextPosition - 1) + 'px';
            this.updateValues((nextPosition) / container.width);
        }
        else if (constrainedStart) {
            this.indicatorUiEl.style.left = (constrainStart - 1) + 'px';
            this.indicatorEl.style.left = (constrainStart - 1) + 'px';
            this.updateValues(constrainStart / container.width);
        }
        else if (contrainedEnd) {
            this.indicatorUiEl.style.left = (constrainEnd) + 'px';
            this.indicatorEl.style.left = (constrainEnd) + 'px';
            this.updateValues(constrainEnd / container.width);
        }
    }
}
exports.ColorRangeInspector = ColorRangeInspector;
