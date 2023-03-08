const { vW, vH, yE, xE } = require("./constants");
const { round } = require("./utils");
const { convertValue } = require("./logic-helper");

function centreRoot(rule) {
  const important = true;
  const book = true;
  rule.append({
    prop: "left",
    value: "50%",
    important, book,
  }, {
    prop: "top",
    value: "50%",
    important, book,
  }, {
    prop: "transform",
    value: "translate(-50%, -50%)",
    important, book,
  });
  rule.book = true;
}

/** 转换高度包含块相关的属性 */
function convertHeightContainingBlock(decl, viewportHeight, precision, fixed) {
  const prop = decl.prop;
  const val = decl.value;

  const topOrBottom = prop === "top" || prop === "bottom";

  const convertedVal = convertValue(val, {
    convert(number, unit, numberStr) {
      if (unit === "px") {
        if (fixed) {
          if (topOrBottom) {
            const rounded = round(number / viewportHeight, precision);
            return `calc(var(${yE}) + var(${vH}) * ${rounded})`;
          } else {
            const radio = round(number / viewportHeight, precision);
            return `calc(var(${vH}) * ${radio})`;
          }
        } else {
          const radio = round(number / viewportHeight, precision);
          return `calc(var(${vH}) * ${radio})`;
        }
      }
      else if (unit === "%") {
        if (fixed) {
          if (topOrBottom) {
            const rounded = round(number / 100, precision);
            return `calc(var(${yE}) + var(${vH}) * ${rounded})`;
          } else {
            const rounded = round(number / 100, precision);
            return `calc(var(${vH}) * ${rounded})`;
          }
        } else {
          return `${numberStr}${unit}`;
        }
      }
      else if (unit === "" || unit === " ") {
        if (fixed && topOrBottom && number === 0) return `var(${yE})`;
        else return `${numberStr}${unit}`;
      }
      else return `${numberStr}${unit}`;
    },
    matchPercentage: fixed,
  });
  decl.book = true;
  decl.value = convertedVal;
}

/** 转换宽度包含块相关的属性 */
function convertWidthContainingBlock(decl, viewportWidth, precision, fixed) {
  const prop = decl.prop;
  const val = decl.value;

  const leftOrRight = prop === "left" || prop === "right";

  const convertedVal = convertValue(val, {
    convert(number, unit, numberStr) {
      if (unit === "px") {
        if (fixed) {
          if (leftOrRight) {
            const rounded = round(number / viewportWidth, precision);
            return `calc(var(${xE}) + var(${vW}) * ${rounded})`;
          } else {
            const radio = round(number / viewportWidth, precision);
            return `calc(var(--vW) * ${radio})`;
          }
        } else {
          const radio = round(number / viewportWidth, precision);
          return `calc(var(--vW) * ${radio})`;
        }
      }
      else if (unit === "%") {
        if (fixed) {
          if (leftOrRight) {
            const rounded = round(number / 100, precision);
            return `calc(var(${xE}) + var(${vW}) * ${rounded})`;
          } else {
            const rounded = round(number / 100, precision);
            return `calc(var(${vW}) * ${rounded})`;
          }
        } else {
          return `${numberStr}${unit}`;
        }
      }
      else if (unit === "" || unit === " ") {
        if (fixed && leftOrRight && number === 0) return `var(${xE})`;
        else return `${numberStr}${unit}`;
      }
      else return `${numberStr}${unit}`;
    },
    matchPercentage: fixed,
  });
  decl.book = true;
  decl.value = convertedVal;
}

/** 转换属性值 */
function convert(decl, viewportWidth, precision) {
  const val = decl.value;

  const convertedVal = convertValue(val, {
    convert(number/* , unit, numberStr */) {
      const radio = round(number / viewportWidth, precision);
      return `calc(var(--vW) * ${radio})`;
    },
    matchPercentage: false,
  });
  decl.book = true;
  decl.value = convertedVal;
}

/** 生成根选择器，定义变量 */
function genVarsRule(Rule, viewportWidth, viewportHeight, unitPrecision) {
  const rootSelector = new Rule({ selector: ":root" });
  const whRadio = round(viewportWidth / viewportHeight, unitPrecision);
  const hwRadio = round(viewportHeight / viewportWidth, unitPrecision);
  rootSelector.append({
    prop: vW, // viewport width
    value: `min(calc(100vh * ${whRadio}), 100vw)`,
    book: true,
  }, {
    prop: vH, // viewport height
    value: `min(calc(100vw * ${hwRadio}), 100vh)`,
    book: true,
  }, {
    prop: yE, // column edge space
    value: "calc(50% - var(--vH) / 2)",
    book: true,
  }, {
    prop: xE, // row edge space
    value: "calc(50% - var(--vW) / 2)",
    book: true,
  });
  return rootSelector;
}

module.exports = {
  convert,
  genVarsRule,
  convertHeightContainingBlock,
  convertWidthContainingBlock,
  centreRoot,
};