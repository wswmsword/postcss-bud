var postcss = require("postcss");
var bud = require("..");
var { r } = require("./utils");

describe("bud", function() {
  it("should gen root selector", function() {
    var input = "";
    var output = `:root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2) }`;
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });
});