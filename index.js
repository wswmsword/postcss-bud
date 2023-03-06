const { hasNoneRootContainingBlockComment, hasRootContainingBlockComment, createContainingBlockWidthDecls } = require("./src/logic-helper");
const { replacePx, genRootSelector } = require("./src/css-generator");
const { pxTestReg } = require("./src/regex");

const defaults = {
  /** 设计图尺寸 */
  viewport: {
    /** 设计图宽度 */
    width: 1920,
    /** 设计图高度 */
    height: 1080,
  },
  /** 根元素选择器 */
  rootSelector: "#app",
  /** 精确到小数点后几位？ */
  unitPrecision: 3,
};

module.exports = (options = {}) => {
  const opts = {
    ...defaults,
    ...options,
  };

  const { viewport, rootSelector, unitPrecision } = opts;

  return {
    postcssPlugin: "postcss-bud",
    prepare(result) {
      const file = result.root && result.root.source && result.root.source.input.file;

      /** 当前选择器 */
      let selector = null;
      /** 视图的横宽比 */
      let viewWHRadio = null;
      /** 当前元素是否 fixed 定位？ */
      let hadFixed = null;
      /** 依赖根包含块的属性 */
      let containingBlockDeclsMap = null;


      // 是否动态视图宽度？
      const isDynamicViewport = typeof viewport === "function";
      const dynamicViewport = isDynamicViewport ? viewport(file) : viewport;
      const {
        width: viewWidth,
        height: viewHeight,
      } = dynamicViewport;

      viewWHRadio = viewWidth / viewHeight;
      return {
        Once(css, postcss) {
          /** 根选择器 */
          const rootRule = genRootSelector(postcss.Rule, viewWidth, viewHeight, unitPrecision);
          css.append(rootRule);
        },
        Rule(rule, postcss) {
          hadFixed = false;
          containingBlockDeclsMap = createContainingBlockWidthDecls();

          selector = rule.selector;

          // 垂直水平居中根选择器
          if (selector === rootSelector) {

          }

          /** 有标志*非根包含块*的注释吗？ */
          const notRootContainingBlock = hasNoneRootContainingBlockComment(rule);
          if (notRootContainingBlock) containingBlockDeclsMap = new Map();
          /** 有标志*根包含块*的注释吗？ */
          const hadRootContainingBlock = hasRootContainingBlockComment(rule);
          if (hadRootContainingBlock) hadFixed = true;
        },
        Declaration(decl, postcss) {
          if (decl.book) return;

          const prop = decl.prop;
          const val = decl.value;
          const important = decl.important;

          if (prop === "position" && val === "fixed") return hadFixed = true;

          // 涉及到包含块宽度的属性，推迟到 ruleExit 中计算
          if (containingBlockDeclsMap.has(prop)) {
            const mapDecl = containingBlockDeclsMap.get(prop);
            if (mapDecl == null || important || !mapDecl.important)
              containingBlockDeclsMap.set(prop, decl);
            return;
          }

          if (pxTestReg.test(val)) {
            replacePx();
          }
        },
        RuleExit(rule, postcss) {

        },
        OnceExit(css) {
        },
      };
    },
  };
};

module.exports.postcss = true;