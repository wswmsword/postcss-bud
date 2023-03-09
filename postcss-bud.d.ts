import { Plugin } from 'postcss'

declare namespace bud {

  interface Options {

    /** 设计图尺寸 */
    viewport?: viewport | viewportFunc

    /** 根元素选择器，如果指定，则将指定选择器居中 */
    rootSelector?: string

    /** 精确到小数点后几位？ */
    unitPrecision?: number

    /** 定义注释名称 */
    comment?: comment

    /** 排除文件或文件夹，哪些文件需要转换？ */
    exclude?: RegExp | RegExp[]

    /** 包括文件或文件夹，哪些文件不需要转换？ */
    include?: RegExp | RegExp[]
  }

  interface viewport {
    /** 设计图宽度 */
    width: number
    /** 设计图高度 */
    height: number
  }

  type viewportFunc = (file: string) => viewport

  interface comment {
    /** 定义全局变量的注释名称，如果未指定，将判断是否设置根元素选择器，如果设置，全局变量定义在根选择器处，如果未设置，将定义在每个 css 文件开头 */
    vars?: string
    /** 定义注释名称，标记则不对当前行进行转换 */
    ignorePrev?: string
  }
}

declare function bud(options?: bud.Options): Plugin

export = bud