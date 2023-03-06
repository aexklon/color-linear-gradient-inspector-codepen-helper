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

        this.stripEl.addEventListener('mousedown', this.pickup);
        this.stripEl.addEventListener('mousemove', this.move);
        this.stripEl.addEventListener('mouseup', this.release);
        
        this.stripEl.addEventListener('touchstart', this.pickup);
        this.stripEl.addEventListener('touchmove', this.move);
        this.stripEl.addEventListener('touchend', this.release);
    }

    private updateValues(percent: number): void
    {
        const color = this.range(percent) as any;

        this.components.forEach((component, i: number): void => {
            (component.el as any).innerHTML = component.format(color, i);
        })
    }

    private pickup(event: Event): void
    {
        event.preventDefault();
        event.stopPropagation();
        this.moving = true;
        this.stripEl.classList.add('moving');
        this.updateIndicatorPosition(
            event.hasOwnProperty('x') ?
                (event as MouseEvent).x :
                (event as TouchEvent).touches[0].clientX
        );
    }

    private move(event: MouseEvent|TouchEvent): void
    {
        if (this.moving) {
            event.preventDefault();
            event.stopPropagation();
            this.updateIndicatorPosition(
                event.hasOwnProperty('x') ?
                    (event as MouseEvent).x :
                    (event as TouchEvent).touches[0].clientX
            );
        }
    }

    private release(): void
    {
        this.moving = false;
        this.stripEl.classList.remove('moving');
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