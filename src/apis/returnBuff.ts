import type { Response } from '@/types'
import { handlePostMessageToNative } from '@/utils/request'

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
          const errorMessage = handleErrMsgReturnBuffData(res.code, res.msg)
          console.log('errorMessage: ', errorMessage)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

function handleErrMsgReturnBuffData(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      'invalid user': '非法userid',
      'invalid task': '没有活动配置',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }
  const defaultErrorMessage = '获取回流任务数据失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
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
          const errorMessage = handleErrMsgReturnBuffReward(res.code, res.msg)
          console.log('errorMessage: ', errorMessage)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

function handleErrMsgReturnBuffReward(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      invalid: '未完成',
      'wrong type': '参数错误',
    },
    403: {
      'already received the reward': '已领取过奖励',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }
  const defaultErrorMessage = '获取回流任务数据失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}
