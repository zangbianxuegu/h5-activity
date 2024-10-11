import type { TreasureHuntParams, TreasureHuntRes } from '@/types'
import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'

/**
 * 万圣节寻宝
 * @param {TreasureHuntParams} params 参数
 * @property {string} event 活动名
 * @property {string} task 任务名
 * @property {number} grid_id 格子id，0-71
 * @returns {Promise<TreasureHuntRes>}
 */
export function treasureHunt(
  params: TreasureHuntParams,
): Promise<TreasureHuntRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/treasure_hunt',
      content: params,
      handleRes: (res: TreasureHuntRes) => {
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
