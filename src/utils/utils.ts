/**
 * @function 将数字转为二进制数组
 * @param num 是否有未领奖状态数字
 */
export function numberToBinaryArray(num: number): number[] {
  const binaryString = num.toString(2)
  const binaryArray = binaryString
    .split('')
    .map((bit) => parseInt(bit, 10))
    .reverse()
  return binaryArray
}
