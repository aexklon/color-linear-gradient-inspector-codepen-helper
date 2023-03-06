import Color from 'colorjs.io';
import { Range } from 'colorjs.io/types/src/interpolation';

export class ColorRangeInspector
{
    private stripEl: any;
    private inspectorEl: any;
    private range: Range;
    private components: ColorComponentInspector[];

    constructor(param0: ColorRangeInspectorConstructor)
    {
        this.stripEl = param0.stripEl;
        this.inspectorEl = param0.inspectorEl;
        this.components = param0.components;
        this.range = param0.range;

        this.stripEl.style.backgroundImage = param0.stripBackgroundImage;

        this.updateIndicatorPosition(
            this.stripEl.getBoundingClientRect().x +
            (this.stripEl.getBoundingClientRect().width / 2)
        );
    }

    private updateValues(percent: number): void
    {
        const color = this.range(percent) as any;

        this.components.forEach((component, i: number): void => {
            (component.el as any).innerHTML = component.format(color, i);
        })
    }

    private updateIndicatorPosition(evX: number) {
        const container = this.stripEl.getBoundingClientRect();

        const constrainStart = 0;
        const constrainEnd = container.width;

        const nextPosition = evX - container.x;
        const constrainedStart = nextPosition < constrainStart;
        const constrainedEnd = nextPosition > constrainEnd;

        if (!(constrainedStart || constrainedEnd)) {
            this.inspectorEl.style.left = (nextPosition -1) + 'px';
            this.updateValues((nextPosition) / container.width);
        } else if (constrainedStart) {
            this.inspectorEl.style.left = (constrainStart -1) + 'px';
            this.updateValues(constrainStart / container.width);
        } else if (constrainedEnd) {
            this.inspectorEl.style.left = (constrainEnd -1) + 'px';
            this.updateValues(constrainEnd / container.width);
        }
    }
}

interface ColorRangeInspectorConstructor
{
    stripEl: Element;
    inspectorEl: Element;
    range: Range;
    stripBackgroundImage: string;
    components: ColorComponentInspector[];
}

interface ColorComponentInspector {
    el: Element;
    multiplier?: number;
    format: (c: Color, i: number) => string
}