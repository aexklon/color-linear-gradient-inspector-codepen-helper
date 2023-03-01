import Color from "colorjs.io";
import { ColorRange } from "../src/color-range";

describe("test add function", () => {
  const colorRange = new ColorRange({
    from: new Color('color(srgb-linear 1 1 1)'),
    to: new Color('color(srgb-linear 0 0 1)'),
    space: "srgb-linear",
    outputSpace: "srgb-linear",
    alt: false, // !CSS.supports('background', 'color(srgb-linear 1 1 0)'),
  });

  const colorRangeBruteForce = new ColorRange({
    from: new Color('color(srgb-linear 1 1 1)'),
    to: new Color('color(srgb-linear 0 0 1)'),
    space: "srgb-linear",
    outputSpace: "srgb-linear",
    alt: true, // !CSS.supports('background', 'color(srgb-linear 1 1 0)'),
    altStrategy: 'brute-force approximation',
    altResolution: 3,
    altMessageEl: null, // document.getElementById('message'),
    altMessage: 'This browser does not support CSS Color Module Level 4 color function. What you are seeing above is a brute-force approximation'
  });

  const colorRangeBruteForceSRGB = new ColorRange({
    from: new Color('color(srgb-linear 1 1 1)'),
    to: new Color('color(srgb-linear 0 0 1)'),
    space: "srgb-linear",
    outputSpace: "srgb-linear",
    alt: true, // !CSS.supports('background', 'color(srgb-linear 1 1 0)'),
    altStrategy: 'brute-force approximation srgb',
    altResolution: 3,
    altMessageEl: null, // document.getElementById('message'),
    altMessage: 'This browser does not support CSS Color Module Level 4 color function. What you are seeing above is a brute-force approximation'
  });


  it("should build range beginning with from", () => {
    expect((colorRange.range(0) as any).toString({format: "rgb"})).toBe('color(srgb-linear 1 1 1)');
  });

  it("should build range ending with to", () => {
    expect((colorRange.range(1) as any).toString({format: "rgb"})).toBe('color(srgb-linear 0 0 1)');
  });

  it("should output css", () => {
    expect(colorRange.cssLinearGradient).toBe('linear-gradient(\n            to right in srgb-linear,\n            color(srgb-linear 1 1 1),\n            color(srgb-linear 0 0 1)\n        )');
  });

  it("should output css brute-force approximation", () => {
    expect(colorRangeBruteForce.cssLinearGradient).toBe('linear-gradient(to right in srgb-linear,color(srgb-linear 1 1 1),color(srgb-linear 0.5 0.5 1),color(srgb-linear 0 0 1))');
  });

  it("should output css brute-force approximation srgb", () => {
    expect(colorRangeBruteForceSRGB.cssLinearGradient).toBe('linear-gradient(to right in srgb-linear,rgb(100% 100% 100%),rgb(73.536% 73.536% 100%),rgb(0% 0% 100%))');
  });

});