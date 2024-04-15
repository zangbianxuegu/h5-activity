import {
  type TokenParams,
  type PostMsgParams,
  type Response,
  type EventData,
} from '@/types'
import throttle from 'lodash.throttle'

// Web 与 客户端通信
function handlePostMessageToNative({
  type,
  resource,
  content,
  handleRes,
}: PostMsgParams): void {
  function waitForUniSDKJSBridge(callback: () => void): void {
    if (window.UniSDKJSBridge) {
      console.log('UniSDKJSBridge 直接可用')
      callback()
    } else {
      let pollCount = 0 // 轮询次数计数
      const startTime = new Date() // 记录轮询开始时间
      console.log(
        '开始轮询检查 UniSDKJSBridge 是否挂载：',
        startTime.toLocaleTimeString(),
      )
      const intervalId = setInterval(() => {
        pollCount++
        console.log('pollCount: ', pollCount)
        if (window.UniSDKJSBridge) {
          const endTime = new Date() // 记录成功时间
          // 打印挂载成功的时间和轮询次数
          console.log(
            `UniSDKJSBridge 成功挂载于: ${endTime.toLocaleTimeString()}，经过 ${pollCount} 次轮询`,
          )
          clearInterval(intervalId)
          callback()
        }
        if (pollCount >= 3) {
          clearInterval(intervalId)
        }
      }, 100)
    }
  }
  // 轮询等待 UniSDKJSBridge 挂载成功
  waitForUniSDKJSBridge(() => {
    window.UniSDKJSBridge.postMsgToNative({
      methodId: 'ngwebview_notify_native',
      reqData: {
        notification_name: 'NT_NOTIFICATION_EXTEND',
        data:
          type === 'userinfo' || type === 'update_red_dot'
            ? { type }
            : {
                type,
                resource,
                content: JSON.stringify(content),
              },
      },
      callback: {
        nativeCallback: function (respJSONString: string) {
          handleResponse(resource, respJSONString, handleRes)
        },
      },
    })
  })
}

// 处理客户端响应
function handleResponse(
  resource: string | undefined,
  respJSONString: string,
  handleRes: (data: any) => void,
): void {
  console.log('客户端返回 Response JSON String: ', respJSONString)
  const reg = /"web_response":"({.*?})"/
  const match = respJSONString.match(reg)
  let res: Response | null = null

  if (match) {
    const resStr = match[1].replace(/\\/g, '')
    res = JSON.parse(resStr)
  }

  console.log('接口：', resource, res)
  handleRes(res)
}

// 获取用户信息，仅与客户端通信 Web <-> APP
// window.UniSDKNativeCallback, -209576407, { "methodId": "NGWebViewCallbackToWeb", "web_response": "{"cmd":"kefu_get_token","uid":"aebgkelrab6bhqzn@ad.netease.win.163.com","game_uid":"65750a6d - 1717 - 4c45 - be90 - 7a7be8035cbf","os":"android","game_server":6,"login_from":0,"map":"CandleSpace","return_buff":"false"}", "callback_id": "-209576407"}
export function getUserInfo(): Promise<any> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'userinfo',
      handleRes: (res) => {
        if (res) {
          resolve(res)
        } else {
          reject(new Error('获取用户信息出错'))
        }
      },
    })
  })
}

// 通知客户端更新红点
export function updateRedDot(): Promise<any> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'update_red_dot',
      handleRes: (res) => {
        if (res) {
          resolve(res)
        } else {
          reject(new Error('通知客户端更新红点出错'))
        }
      },
    })
  })
}

// 获取 token
// 一般接口，响应结构如 { code: 200, msg: 'ok', data: {} }
export function getJinglingToken(tokenParams: TokenParams): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/jingling/get_jingling_token',
      content: {
        token_params: JSON.stringify(tokenParams),
      },
      handleRes: (res: Response) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgToken(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    })
  })
}

function handleErrMsgToken(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      'missing required parameter': '请求参数不完整',
      'invalid parameter value or gms error return':
        '请求参数的值错误或gms的返回有错误',
    },
    500: {
      'request gms failed': '请求gms出错',
      'internal server error': '服务器内部发生错误',
    },
    502: {
      'jingling did not return token': '精灵没有返回token',
    },
  }

  const defaultErrorMessage = '获取精灵token失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

// 使用 Map 或对象来存储针对每个活动的节流函数
const throttledFetchMap: {
  [K in keyof EventData]?: ReturnType<typeof throttle>
} = {}

// 原始的获取玩家任务数据的函数，没有应用节流
function fetchPlayerMissionData(
  { event }: { event?: keyof EventData },
  resolve: (value: Response | PromiseLike<Response>) => void,
  reject: (reason?: any) => void,
): void {
  handlePostMessageToNative({
    type: 'protocol',
    resource: '/internal/jingling/get_player_mission_data',
    content: {
      source_token: '',
      source_id: '',
      event,
    },
    handleRes: (res) => {
      if (res.code === 200) {
        resolve(res)
      } else {
        const errorMessage = handleErrMsgPlayerMission(res.code, res.msg)
        reject(new Error(errorMessage))
      }
    },
  })
}

// 获取玩家任务进度数据
// 对外暴露的函数，根据 event 参数的存在与否决定是否使用节流
// 服务端同一活动接口限制时间间隔 3s。实际测试，因为网络传输、Redis 存储，服务端记录的时间并不是前端请求发起时间，可能会存在前端请求间隔 1707163045531 -> 1707163048696，大于 3s，服务端 2024-02-06 14:12:42.104 -> 2024-02-06 14:12:45.037，小于 3s
// 所以设置为 3500
export function getPlayerMissionData({
  event,
}: {
  event?: keyof EventData
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    if (event) {
      let throttledFetch = throttledFetchMap[event]
      if (!throttledFetch) {
        throttledFetch = throttle(fetchPlayerMissionData, 3500, {
          trailing: false,
        })
        throttledFetchMap[event] = throttledFetch
      }
      throttledFetch({ event }, resolve, reject)
    } else {
      fetchPlayerMissionData({ event }, resolve, reject)
    }
  })
}

function handleErrMsgPlayerMission(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      'invalid event': '没有活动配置（无效的活动）',
      'invalid task': '没有任务配置（无效的任务）',
      'invalid user': '非法userid',
      'not recently online': '玩家近期不在线',
    },
    401: {
      'inactive event': '活动未开启',
      'repeat request': '请求频繁',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }

  const defaultErrorMessage = '获取玩家任务进度失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

// 更新任务进度
export function setPlayerTask({
  task,
  value = 1,
}: {
  task: string
  value?: number
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/jingling/set_player_task',
      content: {
        source_token: '',
        source_id: '',
        task,
        value,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgPlayerTask(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    })
  })
}

function handleErrMsgPlayerTask(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      'invalid task': '没有活动配置',
      'invalid user': '非法userid',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }

  const defaultErrorMessage = '更新任务进度失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

// 领奖
export function claimMissionReward({
  task,
  event,
  rewardId,
}: {
  task: string
  event: string
  rewardId: number
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/jingling/claim_jingling_mission_reward',
      content: {
        source_token: '',
        source_id: '',
        task,
        event,
        reward_id: rewardId,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgMissionReward(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    })
  })
}

function handleErrMsgMissionReward(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      invalid: '无效的活动',
      'repeat request': '请求频繁',
      'not recently online': '玩家近期不在线',
      'wrong event or task': '错误的活动或任务（无效活动）',
      'wrong reward_id': '错误的奖励id',
      'concurrent request': '并发的请求',
    },
    401: {
      inactive: '活动未开启',
    },
    403: {
      'already received the reward': '已领取奖励',
      'out of stock': '奖品库存不足',
      'already has unlock': '已拥有该物品',
      'reward has already selected': '已选择奖励',
      'already selected another': '已选择其他奖励',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }

  const defaultErrorMessage = '领奖失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

// 设置新活动状态
export function setWebRedDot({ event }: { event: string }): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/set_web_red_dot',
      content: {
        event,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgRedDot(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    })
  })
}

function handleErrMsgRedDot(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      'invalid event': '没有活动配置（无效的活动）',
    },
    401: {
      'inactive event': '活动未开启',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }

  const defaultErrorMessage = '设置新活动状态失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}

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
    })
  })
}

// 日志数据上报
export function webViewStatistics({
  module,
}: {
  module: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/jingling/web_view_statistics',
      content: {
        module,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgViewStatistics(res.code, res.msg)
          console.log('errorMessage: ', errorMessage)
          reject(new Error(errorMessage))
        }
      },
    })
  })
}

function handleErrMsgViewStatistics(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    401: {
      'inactive event': '活动未开启',
    },
    404: {
      'invalid module': '没有活动配置（无效的活动）',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }
  const defaultErrorMessage = '日志数据上报失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}
