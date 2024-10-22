/**
 * @function 将数字转为二进制数组
 * @param num 是否有未领奖状态数字
 * @example 3 -> [1, 1]，2 -> [0, 1]
 */
export function numberToBinaryArray(num: number): number[] {
  const binaryString = num.toString(2)
  const binaryArray = binaryString
    .split('')
    .map((bit) => parseInt(bit, 10))
    .reverse()
  return binaryArray
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * @function capitalizeFirstLetter
 * @description 将字符串的首字母大写
 * @param str 输入字符串
 * @returns 输出字符串
 */
export function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @function checkCanUseSpineAnimation
 * @description 判断是否可以使用 Spine 动画
 * @returns {boolean}
 */
// fix: BUG #60826 【闪退】【线上】华为渠道服，活动中心闪退 https://ma75.pm.netease.com/v6/issues/60826
export function checkCanUseSpineAnimation(): boolean {
  const ua = navigator.userAgent
  const pattern = /PBEM00|PBET00|PBDM00|PAFM00|PCAM00/i
  return !pattern.test(ua)
}

export const animateCSS = (
  elementOrSelector: any,
  animation: string,
  prefix = 'animate__',
  animationSpeed = 'animate__slow',
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const animationName = animation.includes('animate__')
      ? `${animation}`
      : `${prefix}${animation}`
    let node: HTMLElement | null = null
    if (elementOrSelector instanceof HTMLElement) {
      node = elementOrSelector
    } else if (typeof elementOrSelector === 'string') {
      node = document.querySelector(elementOrSelector)
    } else {
      reject(new Error('请传入正确的元素或选择器'))
    }
    const animateAddClass = [`${prefix}animated`, animationName, animationSpeed]
    if (node) {
      node.classList.add(...animateAddClass)

      function handleAnimationEnd(event: {
        stopPropagation: () => void
      }): void {
        event.stopPropagation()
        node && node.classList.remove(...animateAddClass)
        resolve()
      }

      node.addEventListener('animationend', handleAnimationEnd, { once: true })
    } else {
      reject(new Error('Element not found'))
    }
  })
}

/**
 * @description 将设计稿像素大小转换为实际适配大小
 * @param {string} px 设计稿像素值
 * @returns {string} 转换的像素值
 */
const calculatePxToViewport = (px: number): string => {
  const DESIGN_WIDTH = 2560
  const clientWidth = document.documentElement.clientWidth
  return Math.round((px / DESIGN_WIDTH) * clientWidth) + 'px'
}

/**
 * @description 样式对象转换：将设计稿像素大小转换为实际适配大小
 * @param {Record<string, number>} styleObj 样式对象
 * @returns {Record<string, number>} 转换后的样式对象
 */
export const generateDynamicStyles = (
  styleObj: Record<string, number>,
): Record<string, string> => {
  const dynamicStyles: Record<string, string> = {}
  for (const [key, value] of Object.entries(styleObj)) {
    dynamicStyles[key] = calculatePxToViewport(value)
  }
  return dynamicStyles
}
