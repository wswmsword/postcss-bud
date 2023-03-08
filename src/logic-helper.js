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

/** 当前行是否有注释？ */
const hasPrevComment = (node, comment, result) => {
  let bud = false;
  let next = node.next();
  do {
    if (next && next.type === 'comment' && next.text === comment) {
      if (/\n/.test(next.raws.before)) {
        result.warn('Unexpected comment /* ' + comment + ' */ must be after declaration at same line.', { node: next });
      } else {
        // remove comment
        next.remove();
        bud = true;
      }
      break;
    }
    if (next == null || next.type !== "comment") break;
  } while(next = next.next())
  return bud;
};

/** 前面是否有匹配注释？ */
const hasNextComment = (node, comment) => {
  let bud = false;
  let prev = node.prev();
  if (prev == null) return false;
  do {
    if (prev && prev.type === 'comment' && prev.text === comment) {
      // remove comment
      prev.remove();
      bud = true;
      break;
    }
    if (prev == null ||  prev.type !== "comment") break;
  } while(prev = prev.prev())
  return bud;
};

/** 本行有忽略注释吗？ */
const hasPrevIgnoreComment = (decl, comment, result) => {
  return hasPrevComment(decl, comment, result);
};

/** 选择器前面有非根包含块的注释吗 */
const hasNoneRootContainingBlockComment = (rule) => {
  return hasNextComment(rule, notRootCBComment);
};

/** 选择器上方有根包含块的注释 */
const hasRootContainingBlockComment = (rule) => {
  return hasNextComment(rule, rootCBComment);
};

/** 创建 fixed 定位时依赖根元素宽度的属性 map */
const createContainingBlockWidthDecls = () => {
  const mapArray = containingBlockWidthProps.reduce((prev, cur) => {
    return prev.concat([[cur, null]]);
  }, []);
  return new Map(mapArray);
};

/** 创建 fixed 定位时依赖根元素高度的属性 map */
const createContainingBlockHeightDecls = () => {
  const mapArray = containingBlockHeightProps.reduce((prev, cur) => {
    return prev.concat([[cur, null]]);
  }, []);
  return new Map(mapArray);
};

/** 检查是否是正则类型或包含正则的数组 */
const createRegArrayChecker = (TYPE_REG, TYPE_ARY) => (options, optionName) => {
  const obj2Str = val => Object.prototype.toString.call(val);
  const option = options[optionName];
  if (!option) return null;
  if (obj2Str(option) === '[object RegExp]') return TYPE_REG;
  if (obj2Str(option) === '[object Array]') {
    let bad = false;
    for (let i = 0; i < option.length; ++ i) {
      if (obj2Str(option[i]) !== '[object RegExp]') {
        bad = true;
        break;
      }
    }
    if (!bad) return TYPE_ARY;
  }
  throw new Error('options.' + optionName + ' should be RegExp or Array of RegExp.');
};

/** 如果不包含，则返回 true，不转换 */
const createIncludeFunc = (TYPE_REG, TYPE_ARY) => (include, file, regOrAry) => {
  if (include && file) {
    if (regOrAry === TYPE_REG) {
      if (!include.test(file)) return true;
    }
    if (regOrAry === TYPE_ARY) {
      let book = false;
      for (let i = 0; i < include.length; ++ i) {
        if(include[i].test(file)) {
          book = true;
          break;
        }
      }
      if (!book) return true;
    }
  }
};

/** 如果排除，则返回 true，不转换 */
const createExcludeFunc = (TYPE_REG, TYPE_ARY) => (exclude, file, regOrAry) => {
  if (exclude && file) {
    if (regOrAry === TYPE_REG) {
      if (exclude.test(file)) return true;
    }
    if (regOrAry === TYPE_ARY) {
      for (let i = 0; i < exclude.length; ++ i)
        if (exclude[i].test(file)) return true;
    }
  }
};

module.exports = {
  hasNoneRootContainingBlockComment,
  hasRootContainingBlockComment,
  createContainingBlockWidthDecls,
  createContainingBlockHeightDecls,
  convertValue,
  hasPrevIgnoreComment,
  createRegArrayChecker,
  createIncludeFunc,
  createExcludeFunc,
};