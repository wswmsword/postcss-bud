var postcss = require("postcss");
var bud = require("..");
var { r } = require("./utils");

const rootSelector = ":root { --vW: min(calc(100vh * 1.778), 100vw); --vH: min(calc(100vw * 0.563), 100vh); --yE: calc(50% - var(--vH) / 2); --xE: calc(50% - var(--vW) / 2); }";

describe("bud", function() {
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

  it("should convert positive left or right prop", function() {
    var input = ".rule { position: fixed; left: 192px; }";
    var output = rootSelector + " " + ".rule { position: fixed; left: calc(var(--xE) + var(--vW) * 0.1); }";
    var processed = postcss(bud()).process(input).css;
    expect(r(processed)).toBe(output);
  });
});

describe("comment", function() {

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

  it("should centre root selector when specify rootSelector", function() {
    var input = "#app { left: 192px; }";
    var output = rootSelector + " " + "#app { left: calc(var(--vW) * 0.1); left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; position: fixed !important; width: var(--vW) !important; height: var(--vH) !important; }";
    var processed = postcss(bud({ rootSelector: "#app" })).process(input).css;
    expect(r(processed)).toBe(output);
  });

  it("should not centre when specify nothing", function() {
    var input = "#app { left: 192px; }";
    var output = rootSelector + " " + "#app { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ rootSelector: null })).process(input).css;
    expect(r(processed)).toBe(output);
  });

  it("should not centre when missing rootSelector", function() {
    var input = "#app { left: 192px; }";
    var output = "#app { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ rootSelector: "#root" })).process(input).css;
    expect(r(processed)).toBe(output);
  });
});

describe("include", function() {
  it("should be overwritten when include", function() {
    var input = ".rule { left: 192px; }";
    var output = rootSelector + " " + ".rule { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ include: /src/, })).process(input, {
      from: "/src/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not be overwritten when missing include", function() {
    var input = ".rule { left: 192px; }";
    var output = ".rule { left: 192px; }";
    var processed = postcss(bud({ include: /src/, })).process(input, {
      from: "/crs/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should be overwritten when include array", function() {
    var input = ".rule { left: 192px; }";
    var output = rootSelector + " " + ".rule { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ include: [/src/], })).process(input, {
      from: "/src/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not be overwritten when missing include array", function() {
    var input = ".rule { left: 192px; }";
    var output = ".rule { left: 192px; }";
    var processed = postcss(bud({ include: [/src/], })).process(input, {
      from: "/crs/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });
});

describe("exclude", function() {
  it("should not be overwritten when exclude", function() {
    var input = ".rule { left: 192px; }";
    var output = ".rule { left: 192px; }";
    var processed = postcss(bud({ exclude: /src/, })).process(input, {
      from: "/src/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should be overwritten when missing exclude", function() {
    var input = ".rule { left: 192px; }";
    var output = rootSelector + " " + ".rule { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ exclude: /src/, })).process(input, {
      from: "/crs/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not be overwritten when exclude array", function() {
    var input = ".rule { left: 192px; }";
    var output = ".rule { left: 192px; }";
    var processed = postcss(bud({ exclude: [/src/], })).process(input, {
      from: "/src/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not be overwritten when missing exclude array", function() {
    var input = ".rule { left: 192px; }";
    var output = rootSelector + " " + ".rule { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ exclude: [/src/], })).process(input, {
      from: "/crs/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });
});

describe("include and exclude", function() {
  it("should not convert when include and exclude nothing", function() {
    var input = ".rule { left: 192px; }";
    var output = ".rule { left: 192px; }";
    var processed = postcss(bud({ exclude: [], include: [], })).process(input, {
      from: "/src/main.css",
    }).css;
    expect(r(processed)).toBe(output);
  });
});

describe("root vars selector", function() {
  
  it("should generate root vars in head of file without specify rootSelector or vars-comment", function() {
    var input = "#app { left: 192px; }";
    var output = rootSelector + ' ' + "#app { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({})).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should generate root-vars in head of file when specify rootSelector", function() {
    var input = "#app { left: 192px; }";
    var output = rootSelector + ' ' + "#app { left: calc(var(--vW) * 0.1); left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; position: fixed !important; width: var(--vW) !important; height: var(--vH) !important; }";
    var processed = postcss(bud({ rootSelector: "#app" })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not generate when specify missing rootSelector", function() {
    var input = "#app { left: 192px; }";
    var output = "#app { left: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ rootSelector: "#root" })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should generate root-vars in head of file when set vars-comment", function() {
    var input = "#app { left: 192px; } /* haha */ .rule { width: 192px; }";
    var output = rootSelector + ' ' + "#app { left: calc(var(--vW) * 0.1); } .rule { width: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "haha" } })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should generate only root-vars in head of file when apply multi vars-comment", function() {
    var input = "/* haha */ #app { left: 192px; } /* haha */ .rule { width: 192px; }";
    var output = rootSelector + ' ' + "#app { left: calc(var(--vW) * 0.1); } /* haha */ .rule { width: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "haha" } })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not generate when set missing vars-comment", function() {
    var input = "#app { left: 192px; } /* haha */ .rule { width: 192px; }";
    var output = "#app { left: calc(var(--vW) * 0.1); } /* haha */ .rule { width: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "555" } })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should generate root-vars in head of file when specify rootSelector and vars-comment", function() {
    var input = "#app { left: 192px; } /* haha */ .rule { width: 192px; }";
    var output = rootSelector + ' ' + "#app { left: calc(var(--vW) * 0.1); left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; position: fixed !important; width: var(--vW) !important; height: var(--vH) !important; } .rule { width: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "haha" }, rootSelector: "#app" })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should generate root-vars in head of file when specify rootSelector and vars-comment but missing rootSelector", function() {
    var input = "#app { left: 192px; } /* haha */ .rule { width: 192px; }";
    var output = rootSelector + ' ' + "#app { left: calc(var(--vW) * 0.1); } .rule { width: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "haha" }, rootSelector: "#root" })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });

  it("should not generate root-vars when specify rootSelector and vars-comment but missing vars-comment", function() {
    var input = "#app { left: 192px; } /* 555 */ .rule { width: 192px; }";
    var output = "#app { left: calc(var(--vW) * 0.1); left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; position: fixed !important; width: var(--vW) !important; height: var(--vH) !important; } /* 555 */ .rule { width: calc(var(--vW) * 0.1); }";
    var processed = postcss(bud({ comment: { vars: "haha" }, rootSelector: "#app" })).process(input, {
      from: "okk",
    }).css;
    expect(r(processed)).toBe(output);
  });
});