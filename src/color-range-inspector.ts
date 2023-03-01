import { Range } from 'colorjs.io/types/src/interpolation';

export class ColorRangeInspector
{
    private stripEl: any;
    private indicatorEl: any;
    private indicatorUiEl: any;
    private range: Range;
    private components: ColorComponentInspector[];

    constructor(param0: ColorRangeInspectorContructor)
    {
        this.stripEl = param0.stripEl;
        this.indicatorEl = param0.indicatorEl;
        this.indicatorUiEl = param0.indicatorUiEl;
        this.components = param0.components;
        this.range = param0.range;

        if((this.stripEl as HTMLElement)?.style) {
            (this.stripEl as any).style = 'background: red;';
        }

        this.updateIndicatorPosition(
            this.stripEl.getBoundingClientRect().x +
            (this.stripEl.getBoundingClientRect().width / 2)
        );

        this.indicatorEl.addEventListener('drag', (event: DragEvent): void => {
            event.preventDefault();
            event.stopPropagation();
            this.updateIndicatorPosition(event.x);
        })
    }

    private updateValues(percent: number): void
    {
        const color = this.range(percent) as any;

        color.coords.forEach((c: number, i: number): void => {
            this.components[i].el.innerHTML = this.components[i].format(c);
        })
    }

    private updateIndicatorPosition(evX: number) {
        const container = this.stripEl.getBoundingClientRect();

        const constrainStart = 0;
        const constrainEnd = container.width;

        const nextPosition = evX - container.x;
        const constrainedStart = nextPosition < constrainStart;
        const contrainedEnd = nextPosition > constrainEnd;

        if (!(constrainedStart || contrainedEnd)) {
            this.indicatorUiEl.style.left = (nextPosition -1) + 'px';
            this.indicatorEl.style.left = (nextPosition -1) + 'px';
            this.updateValues((nextPosition) / container.width);
        } else if (constrainedStart) {
            this.indicatorUiEl.style.left = (constrainStart -1) + 'px';
            this.indicatorEl.style.left = (constrainStart -1) + 'px';
            this.updateValues(constrainStart / container.width);
        } else if (contrainedEnd) {
            this.indicatorUiEl.style.left = (constrainEnd) + 'px';
            this.indicatorEl.style.left = (constrainEnd) + 'px';
            this.updateValues(constrainEnd / container.width);
        }
    }
}

interface ColorRangeInspectorContructor
{
    stripEl: Element;
    indicatorEl: Element;
    indicatorUiEl: Element;
    range: Range;
    components: ColorComponentInspector[];
}

interface ColorComponentInspector {
    el: Element;
    multiplier?: number;
    format: (c: number) => string
}