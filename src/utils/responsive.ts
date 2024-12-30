import type { DesignConfig } from '@/types'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

// 设计稿宽
const DESIGN_WIDTH = 2560
// 设计稿高
const DESIGN_HEIGHT = 1200
// 设计稿主体宽，减去边距：因为我们要保留主体部分的边距。
// 会影响最终计算出来的缩放系数，影响元素转换的实际大小，所以只能在这里减去，而不能在元素上写边距。
const DESIGN_MAIN_WIDTH = 2100
// 设计稿主体高，同宽。
const DESIGN_MAIN_HEIGHT = 1200
// 设计稿主体内容宽
const DESIGN_MAIN_CONTENT_WIDTH = DESIGN_MAIN_WIDTH
// 设计稿主体内容高
const DESIGN_MAIN_CONTENT_HEIGHT = DESIGN_MAIN_HEIGHT
// 设计稿主体内容宽高比
const DESIGN_MAIN_CONTENT_RATIO =
  DESIGN_MAIN_CONTENT_WIDTH / DESIGN_MAIN_CONTENT_HEIGHT
// 配置参数
const designConfig: DesignConfig = {
  designWidth: DESIGN_WIDTH,
  designHeight: DESIGN_HEIGHT,
  designMainWidth: DESIGN_MAIN_WIDTH,
  designMainHeight: DESIGN_MAIN_HEIGHT,
  designMainContentWidth: DESIGN_MAIN_CONTENT_WIDTH,
  designMainContentHeight: DESIGN_MAIN_CONTENT_HEIGHT,
  designMainContentRatio: DESIGN_MAIN_CONTENT_RATIO,
}

/**
 * 获取响应式样式的缩放因子
 * @returns {Object} 包含缩放因子的对象
 * @property {Ref<number>} factor - 响应式缩放因子的引用
 */
export function getResponsiveStylesFactor(): { factor: Ref<number> } {
  // 调用 useResponsiveStyles 函数，传入设计配置，获取缩放系数
  return useResponsiveStyles(designConfig)
}
