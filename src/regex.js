module.exports = {
  /** 用于验证字符串是否为“数字px”的形式 */
  pxTestReg: /(?<=\d)px/,
  /** 用于匹配字符串形如“数字px”的字符串，不可以在 url()、单引号、双引号中
   * 
   * \d+\.\d+|\d+|\.\d+ // 匹配数字
   * 
   * url\((?:\\\(|\\\)|[^()])*\) // 匹配 url(...)
   * 
   * "(?:\\"|[^"])*" // 匹配 "..."
   * 
   * '(?:\\'|[^'])*' // 匹配 '...'
   * 
   * #\d+ // 匹配颜色
   */
  pxMatchReg: /(url\((?:\\\(|\\\)|[^()])*\)|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|((?:\d+\.\d+|\d+|\.\d+)px)/g,
  unitContentMatchReg: /(url\((?:\\\(|\\\)|[^()])*\)|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|(?:#\d+)|(-?(?:\d+\.\d+|\d+|\.\d+))(px)/g,
  fixedUnitContentReg: /(url\((?:\\\(|\\\)|[^()])*\)|"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|(?:#\d+)|(-?(?:\d+\.\d+|\d+|\.\d+))(px|%| |$)/g,
  varTestReg: /var\((?:\\\(|\\\)|[^()])*\)/,
}