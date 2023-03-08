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
    var output = rootSelector + " " + ".rule { width: calc(var(--vW) * 0.1); height: calc(var(--vH) * 0.089); } .rule2 { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });

  it("should convert fixed positioned props", function() {
    var input = ".rule { position: fixed; width: 192px; height: 96px; left: 0; top: 0; }";
    var output = rootSelector + " " + ".rule { position: fixed; width: calc(var(--vW) * 0.1); height: calc(var(--vH) * 0.089); left: var(--xE); top: var(--yE); }";
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });
});

describe("fixed position", function() {
  const rootSelector = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2); }";

  it("should convert positive left or right prop", function() {
    var input = ".rule { position: fixed; left: 192px; }";
    var output = rootSelector + " " + ".rule { position: fixed; left: calc(var(--xE) + var(--vW) * 0.1); }";
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });
});

describe("comment", function() {
  const rootSelector = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2); }";

  it("should add root selector when set varsComment", function() {
    var input = "/* kelly-time */ .rule { position: fixed; left: 192px; }";
    var output = rootSelector + " .rule { position: fixed; left: calc(var(--xE) + var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "kelly-time" } })).process(input).css;
    expect(r(processed)).toBe(output);
  });

  it("should not convert when set ignorePrev comment", function() {
    var input = ".rule { left: 192px; /* test¿¿ */ border: 1px solid salmon; /* ignore-prev-bud */ }";
    var output = rootSelector + " .rule { left: calc(var(--vW) * 0.1); /* test¿¿ */ border: 1px solid salmon; }";
    var processed = postcss(bud({ comment: { } })).process(input).css;
    expect(r(processed)).toBe(output);
  });
});

describe("rootSelector", function() {
  const rootSelector = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2); }";

  it("should centre root selector when specify rootSelector", function() {
    var input = "#app { left: 192px; }";
    var output = rootSelector + " " + "#app { left: calc(var(--vW) * 0.1); left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; position: fixed !important; width: var(--vW) !important; height: var(--vH) !important; }";
    var processed = postcss(bud({ rootSelector: "#app" })).process(input).css;
    expect(r(processed)).toBe(output);
  });
});