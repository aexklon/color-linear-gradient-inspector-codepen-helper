"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorRange = void 0;
class ColorRange {
    constructor(param0) {
        this.from = param0.from;
        this.to = param0.to;
        this.space = param0.space || 'srgb';
        this.range = param0.from.range(param0.to, {
            space: this.space,
            outputSpace: param0.outputSpace || 'srgb',
        });
        if (param0.altMessageEl) {
            param0.altMessageEl.innerHTML = param0.altMessage || '';
        }
        this.cssLinearGradient =
            !param0.alt ?
                this.generateCssLinearGradient() :
                param0.altStrategy === 'brute-force approximation' ?
                    this.generateCssLinearGradientAltBruteForceApproximation(param0.altResolution || 2) :
                    param0.altStrategy === 'brute-force approximation srgb' ?
                        this.generateCssLinearGradientAltBruteForceApproximation(param0.altResolution || 2, 'srgb') :
                        this.generateCssLinearGradient();
    }
    generateCssLinearGradient() {
        return `linear-gradient(
            to right in ${this.space},
            ${this.from},
            ${this.to}
        )`;
    }
    generateCssLinearGradientAltBruteForceApproximation(steps, space) {
        const stops = [];
        const formatCss = space === 'srgb' ?
            (c) => c.to('srgb').toString({ format: "rgb" }) :
            (c) => c.toString({ format: "rgb" });
        for (let i = 0; i < steps; i++) {
            const color = this.range(i / (steps - 1));
            stops.push(formatCss(color));
        }
        return `linear-gradient(to right in ${this.space},${stops.join(',')})`;
    }
}
exports.ColorRange = ColorRange;
