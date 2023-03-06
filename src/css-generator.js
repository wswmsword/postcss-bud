const { vW, vH, yE, xE } = require("./constants");
const { round } = require("./utils");

function replacePx() {

}

/** 生成根选择器，定义变量 */
function genRootSelector(Rule, viewportWidth, viewportHeight, unitPrecision) {
  const rootSelector = new Rule({ selector: ":root" });
  const whRadio = round(viewportWidth / viewportHeight, unitPrecision);
  const hwRadio = round(viewportHeight / viewportWidth, unitPrecision);
  rootSelector.append({
    prop: vW, // viewport width
    value: `min(calc(100vh * ${whRadio}), 100vw)`,
    book: true,
  });
  rootSelector.append({
    prop: vH, // viewport height
    value: `min(calc(100vw * ${hwRadio}), 100vh)`,
    book: true,
  });
  rootSelector.append({
    prop: yE, // column edge space
    value: "calc(50% - var(--vH) / 2)",
    book: true,
  });
  rootSelector.append({
    prop: xE, // row edge space
    value: "calc(50% - var(--vW) / 2)",
    book: true,
  });
  return rootSelector;
}

module.exports = {
  replacePx,
  genRootSelector,
};