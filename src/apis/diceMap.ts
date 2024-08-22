import type { Response } from '@/types'
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
