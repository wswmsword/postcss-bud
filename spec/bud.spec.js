var postcss = require("postcss");
var bud = require("..");
var { r } = require("./utils");

describe("bud", function() {
  const rootSelector = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2); }";
  it("should gen root selector", function() {
    var input = "";
    var output = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2) }";
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });

  it("shoud convert props", function() {
    var input = ".rule { width: 192px; height: 96px; } .rule2 { left: 192px; }";
    var output =  ".rule { width: calc(var(--vW) * 0.1); height: calc(var(--vH) * 0.089); } .rule2 { left: calc(var(--vW) * 0.1); } " + rootSelector;
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });

  it("should convert fixed positioned props", function() {
    var input = ".rule { position: fixed; width: 192px; height: 96px; left: 0; top: 0; }";
    var output = ".rule { position: fixed; width: calc(var(--vW) * 0.1); height: calc(var(--vH) * 0.089); left: var(--xE); top: var(--yE); } " + rootSelector;
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });
});

describe("fixed position", function() {
  const rootSelector = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2); }";

  it("should convert positive left or right prop", function() {
    var input = ".rule { position: fixed; left: 192px; }";
    var output = ".rule { position: fixed; left: calc(var(--xE) + var(--vW) * 0.1); } " + rootSelector;
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });
});