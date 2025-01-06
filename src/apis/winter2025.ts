import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'
import type { RiddleRes } from '@/types'

/**
 * 获取花灯雅集谜题
 * @function getWinterRiddle
 * @property {string} user 用户标识
 * @returns {Promise<RiddleRes>}
 */
export function getWinterRiddle({
  user,
}: {
  user: string
}): Promise<RiddleRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_riddle',
      content: {
        user,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        }
      },
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 花灯雅集解谜
 * @function guessWinterRiddle
 * @property {string} user 用户标识
 * @property {string} answer 谜底
 * @returns {Promise<Response>}
 */
export function guessWinterRiddle({
  user,
  answer,
}: {
  user: string
  answer: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/guess_riddle',
      content: {
        user,
        answer,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'guess_riddle',
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
