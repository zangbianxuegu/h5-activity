import type { Response } from '@/types'
import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'

// 获取回流任务数据
export function getReturnBuffData({
  page,
}: {
  page: number
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/jingling/get_return_buff_data',
      content: {
        page,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'get_return_buff_data',
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

// 回流任务领奖
export function claimReturnBuffReward({
  type,
}: {
  type: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/activity_center/claim_return_buff_reward',
      content: {
        type,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'claim_return_buff_reward',
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
