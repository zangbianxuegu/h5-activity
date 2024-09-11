import type { Response, MoveInfo } from '@/types'
import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'

/**
 * 获取走格子数据
 * @param {string} user 用户名
 * @returns {Promise<Response>}
 */
export function getDiceMapData(user: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/activity_dice/get_data',
      content: {
        user,
      },
      handleRes: (res: Response) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'get_dice_map_data',
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
 * 获取随机骰子数值
 * @param {string} user 用户名
 * @returns {Promise<Response>}
 */
export function getRandomDiceNum(user: string): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/activity_dice/throw_random_dice',
      content: {
        user,
      },
      handleRes: (res: Response) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'throw_random_dice',
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
 * 走格子移动
 * @param {MoveInfo} params 参数
 * @property {string} user 用户名
 * @property {number} cur_pos 当前位置
 * @property {string} dice_type 骰子类型 custom_dice | random_dice
 * @property {number} dice_value 骰子数值
 * @property {Record<string, number>} choices 在分界点的选择，如 {1: 2, 3: 4} 玩家在 1 上选择的下个点是 2，玩家在 3 上选择的下个点是 4
 * @returns {Promise<Response>}
 */
export function diceMove(params: MoveInfo): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/activity_dice/move',
      content: params,
      handleRes: (res: Response) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage('move', res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}
