module.exports = {
  /** position fixed 时依赖屏幕宽度的属性，https://jameshfisher.com/2019/12/29/what-are-css-percentages/ */
  containingBlockWidthProps: [
    "left", "right",
    "margin", "margin-bottom", "margin-left", "margin-right", "margin-top",
    "max-width", "min-width",
    "padding", "padding-bottom", "padding-left", "padding-right", "padding-top",
    "shape-margin",
    "text-indent",
    "width"
  ],
  /** fixed 定位时依赖屏幕高度的属性 */
  containingBlockHeightProps: [
    "height", "max-height", "min-height",
    "top", "bottom",
  ],
  vW: "--vW",
  vH: "--vH",
  xE: "--xE",
  yE: "--yE",
  notRootCBComment: "not-root-containing-block",
  rootCBComment: "root-containing-block",
}