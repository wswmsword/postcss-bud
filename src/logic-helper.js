const { containingBlockWidthProps, containingBlockHeightProps, rootCBComment, notRootCBComment } = require("./constants");
const { fixedUnitContentReg, unitContentMatchReg } = require("./regex");

/** 获取匹配的数字和单位，转换 */
const convertValue = (val, {
  matchPercentage,
  convert,
}) => {
  let convertedVal = '';

  let matched = null;
  let lastIndex = 0;
  const reg = matchPercentage ? fixedUnitContentReg : unitContentMatchReg;
  while(matched = reg.exec(val)) {
    const numberStr = matched[2];
    if (numberStr == null) continue;
    const beforePxContent = matched[1] || '';
    const chunk = val.slice(lastIndex, matched.index + beforePxContent.length); // 当前匹配和上一次匹配之间的字符串
    const number = Number(numberStr); // 数字
    const lengthUnit = matched[3]; // 单位
    convertedVal = convertedVal.concat(chunk, convert(number, lengthUnit, numberStr));

    lastIndex = reg.lastIndex;
  }

  const tailChunk = val.slice(lastIndex, val.length); // 最后一次匹配到结尾的字符串

  return convertedVal.concat(tailChunk);
};

/** 选择器前面有非根包含块的注释吗 */
const hasNoneRootContainingBlockComment = (rule) => {
  let prev = rule.prev();
  if (prev == null) return false;
  do {
    if (prev && prev.type === 'comment' && prev.text === notRootCBComment) {
      // remove comment
      prev.remove();
      return true;
    }
    else return false;
  } while(prev = prev.prev())
}

/** 选择器上方有根包含块的注释 */
const hasRootContainingBlockComment = (rule) => {
  let prev = rule.prev();
  if (prev == null) return false;
  do {
    if (prev && prev.type === 'comment' && prev.text === rootCBComment) {
      // remove comment
      prev.remove();
      return true;
    }
    else return false;
  } while(prev = prev.prev())
};

/** 创建 fixed 定位时依赖根元素宽度的属性 map */
const createContainingBlockWidthDecls = () => {
  const mapArray = containingBlockWidthProps.reduce((prev, cur) => {
    return prev.concat([[cur, null]]);
  }, []);
  return new Map(mapArray);
};

const createContainingBlockHeightDecls = () => {
  const mapArray = containingBlockHeightProps.reduce((prev, cur) => {
    return prev.concat([[cur, null]]);
  }, []);
  return new Map(mapArray);
}

module.exports = {
  hasNoneRootContainingBlockComment,
  hasRootContainingBlockComment,
  createContainingBlockWidthDecls,
  createContainingBlockHeightDecls,
  convertValue,
};