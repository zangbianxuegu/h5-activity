import type { DesignConfig } from '@/types'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

// 设计稿宽
const DESIGN_WIDTH = 2560
// 设计稿高
const DESIGN_HEIGHT = 1200
// 设计稿主体宽
const DESIGN_MAIN_WIDTH = 2100
// 设计稿主体高
const DESIGN_MAIN_HEIGHT = 1200

/**
 * 获取配置
 * @param {Config} config 主体内容宽和高
 * @returns {DesignConfig} 获取缩放因数的配置
 */
function getConfig(mainWidth: number, mainHeight: number): DesignConfig {
  const designMainWidth = mainWidth || DESIGN_MAIN_WIDTH
  const designMainHeight = mainHeight || DESIGN_MAIN_HEIGHT
  const designMainContentWidth = mainWidth || DESIGN_MAIN_WIDTH
  const designMainContentHeight = mainHeight || DESIGN_MAIN_HEIGHT
  const designMainContentRatio =
    designMainContentWidth / designMainContentHeight
  return {
    designWidth: DESIGN_WIDTH,
    designHeight: DESIGN_HEIGHT,
    designMainWidth,
    designMainHeight,
    designMainContentWidth,
    designMainContentHeight,
    designMainContentRatio,
  }
}

/**
 * 获取响应式样式的缩放因子
 * @param {number} [designMainWidth] 主体内容宽
 * @param {number} [designMainHeight] 主体内容高
 * @returns {Object} 包含缩放因子的对象
 * @property {Ref<number>} factor - 响应式缩放因子的引用
 */
export function getResponsiveStylesFactor(
  designMainWidth?: number,
  designMainHeight?: number,
): { factor: Ref<number> } {
  let mainWidth = designMainWidth
  let mainHeight = designMainHeight
  if (!designMainWidth && !designMainHeight) {
    mainWidth = 2100
    mainHeight = 1200
  }
  const designConfig = getConfig(mainWidth as number, mainHeight as number)
  // 调用 useResponsiveStyles 函数，传入设计配置，获取缩放系数
  return useResponsiveStyles(designConfig)
}
