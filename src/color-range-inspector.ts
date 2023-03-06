import Color from 'colorjs.io';
import { Range } from 'colorjs.io/types/src/interpolation';

export class ColorRangeInspector
{
    private stripEl: any;
    private inspectorEl: any;
    private range: Range;
    private components: ColorComponentInspector[];

    private moving: boolean = false;

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

        this.stripEl.addEventListener('mousedown', (e: any): any => this.pickup(e, this.stripEl));
        this.stripEl.addEventListener('mousemove', (e: any): any => this.move(e, this.stripEl));
        this.stripEl.addEventListener('mouseup', (e: any): any => this.release(e, this.stripEl));
        
        this.stripEl.addEventListener('touchstart', (e: any): any => this.pickup(e, this.stripEl));
        this.stripEl.addEventListener('touchmove', (e: any): any => this.move(e, this.stripEl));
        this.stripEl.addEventListener('touchend', (e: any): any => this.release(e, this.stripEl));
    }

    private updateValues(percent: number): void
    {
        const color = this.range(percent) as any;

        this.components.forEach((component, i: number): void => {
            (component.el as any).innerHTML = component.format(color, i);
        })
    }

    private pickup(event: Event, stripEl: Element): void
    {
        event.preventDefault();
        event.stopPropagation();
        this.moving = true;
        stripEl.classList.add('moving');
        this.updateIndicatorPosition(
            (event as MouseEvent)?.x ||
            (event as TouchEvent).touches[0].clientX
        );
    }

    private move(event: MouseEvent|TouchEvent, _stripEl: unknown): void
    {
        if (this.moving) {
            event.preventDefault();
            event.stopPropagation();
            this.updateIndicatorPosition(
                (event as MouseEvent)?.x ||
                (event as TouchEvent).touches[0].clientX
            );
        }
    }

    private release(_event: MouseEvent|TouchEvent, stripEl: Element): void
    {
        this.moving = false;
        stripEl.classList.remove('moving');
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