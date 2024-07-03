import type { Response } from '@/types'
import { handlePostMessageToNative } from '@/utils/request'

// 重置任务进度（包括每日签到数据）
export function resetTaskValue({
  task,
  event,
  clearDailyValue,
}: {
  task: string
  event: string
  clearDailyValue: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/debug/reset_task_value',
      content: {
        event,
        task,
        clear_daily_value: clearDailyValue,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgRestTask(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

function handleErrMsgRestTask(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    401: {
      'no event defs': '没有活动配置',
      'no task defs': '没有任务配置',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }

  const defaultErrorMessage = '重置任务进度失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

// 重置领奖数据
export function resetSpriteReward({
  task,
  event,
}: {
  task: string
  event: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/debug/reset_sprite_reward',
      content: {
        event,
        task,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgResetReward(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

function handleErrMsgResetReward(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    401: {
      'no task defs': '没有任务配置（无效的任务）',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }
  const defaultErrorMessage = '重置领奖数据失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

// 重置红点
// ! 响应与其他接口不同
export function gmsResetWebRedDot({ event }: { event: string }): Promise<any> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/gms_reset_web_red_dot',
      content: {
        event,
      },
      // { "result": "ok" }
      // { "result": "fail" }
      handleRes: (res) => {
        if (res.result === 'ok') {
          resolve(res)
        } else {
          reject(new Error('重置红点失败'))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}
