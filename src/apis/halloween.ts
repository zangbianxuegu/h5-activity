import type {
  HalloweenTreasureHuntParams,
  HalloweenTreasureHuntRes,
  HalloweenPassLotteryParams,
  HalloweenPassLotteryRes,
} from '@/types'
import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'

/**
 * 万圣节寻宝
 * @param {HalloweenTreasureHuntParams} params 参数
 * @property {string} event 活动名
 * @property {string} task 任务名
 * @property {number} grid_id 格子id，0-71
 * @returns {Promise<HalloweenTreasureHuntRes>}
 */
export function halloweenTreasureHunt(
  params: HalloweenTreasureHuntParams,
): Promise<HalloweenTreasureHuntRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/treasure_hunt',
      content: params,
      handleRes: (res: HalloweenTreasureHuntRes) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'treasure_hunt',
            res.code,
            res.msg,
          )
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 万圣节抽奖
 * @param {HalloweenPassLotteryParams} params 参数
 * @property {string} event 活动名
 * @property {string} token_count 玩家代币数
 * @returns {Promise<HalloweenPassRes>}
 */
export function halloweenLottery(
  params: HalloweenPassLotteryParams,
): Promise<HalloweenPassLotteryRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/lottery',
      content: params,
      handleRes: (res: HalloweenPassLotteryRes) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage('lottery', res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}
