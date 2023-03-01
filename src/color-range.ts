import Color from 'colorjs.io';
import { Range } from 'colorjs.io/types/src/interpolation';

export class ColorRange
{
    public from: Color;
    public to: Color;
    public range: Range;
    public space: string;
    public cssLinearGradient: string;

    constructor(param0: ColorLinearGradientConstructor)
    {
        this.from = param0.from;
        this.to = param0.to;

        this.space = param0.space || 'srgb';
        const rangeOptions: any = {};
        if (param0.space) rangeOptions.space = param0.space;
        if (param0.outputSpace) rangeOptions.outputSpace = param0.outputSpace || 'srgb';
        if (param0.hue) rangeOptions.hue = param0.hue;
        this.range = param0.from.range(param0.to, rangeOptions)

        if (param0.alt && param0.altMessageEl) {
            param0.altMessageEl.innerHTML = param0.altMessage || '';
        }

        this.cssLinearGradient =
            !param0.alt ?
                this.generateCssLinearGradient(!!param0.omitIn) :
            param0.alt && param0.altStrategy === 'brute-force approximation' ?
                this.generateCssLinearGradientAltBruteForceApproximation(param0.altResolution || 2, param0.altInSpace || 'srgb', !!param0.omitIn) :
                this.generateCssLinearGradient(!!param0.omitIn)
    }

    private generateCssLinearGradient(omitIn?: boolean): string
    {
        return `linear-gradient(
            to right${omitIn ? '': ' in ' + this.space},
            ${this.from},
            ${this.to}
        )`
    }

    private generateCssLinearGradientAltBruteForceApproximation(steps: number, space?: string, omitIn?: boolean): string
    {
        const stops = [];
        const formatCss = space === 'srgb' ?
            (c: Color): string => c.to('srgb').toString({format: "rgb"}) :
            (c: Color): string => c.toString({format: "rgb"});

        for (let i=0; i<steps; i++) {
            const color = this.range(i/(steps -1)) as any;
            stops.push(formatCss(color));
        }
        return `linear-gradient(to right${omitIn ? '' : space === 'srgb' ? '' : ' in ' + space},${stops.join(',')})`;
    }
}

interface ColorLinearGradientConstructor
{
    from: Color;
    to: Color;
    space?: string;
    outputSpace?: string;
    hue?: string;
    omitIn?: boolean;
    alt: boolean;
    altMessageEl?: Element | undefined | null;
    altMessage?: string;
    altInSpace?:string;
    altStrategy?: 'brute-force approximation';
    altResolution?: number;
}