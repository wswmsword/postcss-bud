const { hasNoneRootContainingBlockComment, hasRootContainingBlockComment, createContainingBlockWidthDecls, createContainingBlockHeightDecls, hasPrevIgnoreComment } = require("./src/logic-helper");
const { convert, genVarsRule, convertWidthContainingBlock, convertHeightContainingBlock, centreRoot } = require("./src/css-generator");
const { pxTestReg } = require("./src/regex");
const { ignorePrevComment } = require("./src/constants");

const defaults = {
  /** 设计图尺寸 */
  viewport: {
    /** 设计图宽度 */
    width: 1920,
    /** 设计图高度 */
    height: 1080,
  },
  /** 根元素选择器，如果指定，则将指定选择器居中 */
  rootSelector: null,
  /** 精确到小数点后几位？ */
  unitPrecision: 3,
  comment: {
    /** 定义全局变量的注释名称，如果未指定，将判断是否设置根元素选择器，如果设置，全局变量定义在根选择器处，如果未设置，将定义在每个 css 文件开头 */
    vars: null,
    /** 定义注释名称，标记则不对当前行进行转换 */
    ignorePrev: null,
  },
};

module.exports = (options = {}) => {
  const opts = {
    ...defaults,
    ...options,
    comment: {
      ...defaults.comment,
      ...options.comment,
    }
  };

  const { viewport, rootSelector, unitPrecision, comment } = opts;

  const { vars, ignorePrev } = comment;

  const _ignorePrev = ignorePrev == null ? ignorePrevComment : ignorePrev;

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
      /** 依赖根包含块宽度的属性 */
      let widthContainingBlockDeclsMap = null;
      /** 依赖根包含块高度的属性 */
      let heightContainingBlockDeclsMap = null;


      // 是否动态视图宽度？
      const isDynamicViewport = typeof viewport === "function";
      const dynamicViewport = isDynamicViewport ? viewport(file) : viewport;
      const {
        width: viewWidth,
        height: viewHeight,
      } = dynamicViewport;

      let prependedRootVars = false;

      viewWHRadio = viewWidth / viewHeight;
      return {
        Once(css, postcss) {
          // 在每个文件定义变量
          if (rootSelector == null && vars == null) {
            const varsRule = genVarsRule(postcss.Rule, viewWidth, viewHeight, unitPrecision);
            css.prepend(varsRule);
          }
        },
        Comment(comment, postcss) {
          const text = comment.text;
          if (text === vars && text != null && prependedRootVars === false) {
            prependedRootVars = true;
            const varsRule = genVarsRule(postcss.Rule, viewWidth, viewHeight, unitPrecision);
            result.root.prepend(varsRule);
            comment.remove();
          }
        },
        Rule(rule, postcss) {
          if (rule.book) return ;
          // console.log(postcss.Root)
          hadFixed = false;
          widthContainingBlockDeclsMap = createContainingBlockWidthDecls();
          heightContainingBlockDeclsMap = createContainingBlockHeightDecls();
          

          selector = rule.selector;

          // 垂直水平居中根选择器
          if (selector === rootSelector) {
            // 设置了根选择器，没有设置变量标志
            if (vars == null) {
              const varsRule = genVarsRule(postcss.Rule, viewWidth, viewHeight, unitPrecision);
              result.root.prepend(varsRule);
            }
            // 居中
            centreRoot(rule);
          }

          /** 有标志*非根包含块*的注释吗？ */
          const notRootContainingBlock = hasNoneRootContainingBlockComment(rule);
          if (notRootContainingBlock) widthContainingBlockDeclsMap = heightContainingBlockDeclsMap = new Map();
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

          if (hasPrevIgnoreComment(decl, _ignorePrev, result)) return;

          // 涉及到包含块宽度的属性，推迟到 ruleExit 中计算
          if (widthContainingBlockDeclsMap.has(prop)) {
            const mapDecl = widthContainingBlockDeclsMap.get(prop);
            if (mapDecl == null || important || !mapDecl.important)
              widthContainingBlockDeclsMap.set(prop, decl);
            return;
          }

          // 涉及到包含块高度的属性，推迟到 ruleExit 中计算
          if (heightContainingBlockDeclsMap.has(prop)) {
            const mapDecl = heightContainingBlockDeclsMap.get(prop);
            if (mapDecl == null || important || !mapDecl.important)
              heightContainingBlockDeclsMap.set(prop, decl);
            return;
          }

          if (pxTestReg.test(val))
            convert(decl, viewWidth, unitPrecision);
        },
        RuleExit(rule, postcss) {
          widthContainingBlockDeclsMap.forEach(decl => {
            if (decl == null) return;
            convertWidthContainingBlock(decl, viewWidth, unitPrecision, hadFixed);
          });
          heightContainingBlockDeclsMap.forEach(decl => {
            if (decl == null) return;
            convertHeightContainingBlock(decl, viewHeight, unitPrecision, hadFixed);
          });
        },
        OnceExit(css) {
        },
      };
    },
  };
};

module.exports.postcss = true;