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
