const { containingBlockWidthProps } = require("./constants");

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
}

module.exports = {
  hasNoneRootContainingBlockComment,
  hasRootContainingBlockComment,
  createContainingBlockWidthDecls,
};