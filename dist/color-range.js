"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorRange = void 0;
class ColorRange {
    constructor(param0) {
        this.from = param0.from;
        this.to = param0.to;
        this.space = param0.space || 'srgb';
        const rangeOptions = {};
        if (param0.space)
            rangeOptions.space = param0.space;
        if (param0.outputSpace)
            rangeOptions.outputSpace = param0.outputSpace || 'srgb';
        if (param0.hue)
            rangeOptions.hue = param0.hue;
        this.range = param0.from.range(param0.to, rangeOptions);
        if (param0.alt && param0.altMessageEl) {
            param0.altMessageEl.innerHTML = param0.altMessage || '';
        }
        this.cssLinearGradient =
            !param0.alt ?
                this.generateCssLinearGradient(!!param0.omitIn) :
                param0.alt && param0.altStrategy === 'brute-force approximation' ?
                    this.generateCssLinearGradientAltBruteForceApproximation(param0.altResolution || 2, param0.altInSpace || 'srgb', !!param0.omitIn) :
                    this.generateCssLinearGradient(!!param0.omitIn);
    }
    generateCssLinearGradient(omitIn) {
        return `linear-gradient(
            to right${omitIn ? '' : ' in ' + this.space},
            ${this.from},
            ${this.to}
        )`;
    }
    generateCssLinearGradientAltBruteForceApproximation(steps, space, omitIn) {
        const stops = [];
        const formatCss = space === 'srgb' ?
            (c) => c.to('srgb').toString({ format: "rgb" }) :
            (c) => c.toString({ format: "rgb" });
        for (let i = 0; i < steps; i++) {
            const color = this.range(i / (steps - 1));
            stops.push(formatCss(color));
        }
        return `linear-gradient(to right${omitIn ? '' : space === 'srgb' ? '' : ' in ' + space},${stops.join(',')})`;
    }
}
exports.ColorRange = ColorRange;
