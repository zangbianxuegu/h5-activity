import type { PostMsgParams, Response, ServeResponse, EventName } from '@/types'
import throttle from 'lodash.throttle'
import { Session } from '@/utils/storage'
import { setErrorCustom } from './error'

function postMsgToNative(msg: {
  methodId: string
  reqData: any
  [key: string]: any
}): void {
  window.UniSDKJSBridge.postMsgToNative(msg)
}

// Web 与 客户端通信
export function handlePostMessageToNative({
  type,
  resource,
  content,
  handleRes,
}: PostMsgParams): Promise<void> {
  return new Promise((resolve, reject) => {
    function waitForUniSDKJSBridge(callback: () => void): void {
      if (window.UniSDKJSBridge) {
        console.log('UniSDKJSBridge 直接可用')
        callback()
        postMsgToNative({
          methodId: 'navigation_bar_func',
          reqData: {
            action: 'show',
          },
        })
        resolve()
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
            postMsgToNative({
              methodId: 'navigation_bar_func',
              reqData: {
                action: 'show',
              },
            })
            resolve()
          }
          if (pollCount >= 3) {
            clearInterval(intervalId)
            reject(setErrorCustom('nativeError', 'UniSDKJSBridge mount fail!'))
          }
        }, 100)
      }
    }

    function logRequestInfo(response: ServeResponse): void {
      console.log(
        '请求类型:',
        type,
        '请求地址：',
        resource,
        '请求参数：',
        content,
        '服务返回信息：',
        response,
      )
    }

    // 轮询等待 UniSDKJSBridge 挂载成功
    waitForUniSDKJSBridge(() => {
      postMsgToNative({
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
            void handleResponse(respJSONString, handleRes).then((res) => {
              logRequestInfo(res)
            })
          },
        },
      })
    })
  })
}

// 处理客户端响应
function handleResponse(
  respJSONString: string,
  handleRes: (data: any) => void,
): Promise<ServeResponse> {
  return new Promise((resolve) => {
    const reg = /"web_response":"({.*?})"/
    const match = respJSONString.match(reg)
    let res: ServeResponse = null

    if (match) {
      const resStr = match[1].replace(/\\/g, '')
      res = JSON.parse(resStr)
    }
    handleRes(res)
    resolve(res)
  })
}

// 使用 Map 或对象来存储针对每个活动的节流函数
const throttledFetchMap: {
  [K in EventName]?: ReturnType<typeof throttle>
} = {}

// 原始的获取玩家任务数据的函数，没有应用节流
function fetchPlayerMissionData(
  { event, token }: { event?: EventName; token?: string },
  resolve: (value: Response | PromiseLike<Response>) => void,
  reject: (reason?: any) => void,
): Promise<void> {
  return new Promise((_resolve, _reject): void => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/jingling/get_player_mission_data',
      content: {
        source_token: '',
        source_id: '',
        event,
        token,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
          _resolve()
          if (!event) {
            // 存储数据
            Session.set('allEvents', res)
          }
        } else {
          const errorMessage = handleErrMsgPlayerMission(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      _reject(err)
    })
  })
}

// 获取玩家任务进度数据
// 对外暴露的函数，根据 event 参数的存在与否决定是否使用节流
// 服务端同一活动接口限制时间间隔 3s。实际测试，因为网络传输、Redis 存储，服务端记录的时间并不是前端请求发起时间，可能会存在前端请求间隔 1707163045531 -> 1707163048696，大于 3s，服务端 2024-02-06 14:12:42.104 -> 2024-02-06 14:12:45.037，小于 3s
// 所以设置为 3500
export function getPlayerMissionData({
  event,
  token,
}: {
  event?: EventName
  token?: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    const now = Date.now()
    if (event) {
      // TODO
      // 拆分 activity 的全局状态管理。
      // 兼容之前的活动，等待 stores/activity.ts 中保存的活动全部下架之后，只需要保留 if 中的逻辑
      if (
        [
          'activitycenter_anniversary_store_2024',
          'activitycenter_main_friendship_2024',
          'activitycenter_store_friendship_2024',
          'activitycenter_sign_friendship_2024',
          'activitycenter_week1_friendship_2024',
          'activitycenter_week2_friendship_2024',
          'activitycenter_week3_friendship_2024',
          'activitycenter_week4_friendship_2024',
          'activitycenter_week5_friendship_2024',
          'activitycenter_week6_friendship_2024',
        ].includes(event)
      ) {
        let cachedData
        if (
          [
            'activitycenter_week1_friendship_2024',
            'activitycenter_week2_friendship_2024',
            'activitycenter_week3_friendship_2024',
            'activitycenter_week4_friendship_2024',
            'activitycenter_week5_friendship_2024',
            'activitycenter_week6_friendship_2024',
          ].includes(event)
        ) {
          cachedData = Session.get(
            'activitycenter_week_friendship_2024',
          )?.activityData
        } else {
          cachedData = Session.get(event)?.activityData
        }
        const lastFetchTime =
          parseInt(Session.get(`lastFetchTime-${event}`)) || 0
        if (cachedData && now - lastFetchTime < 3500) {
          const res = {
            code: 200,
            data: cachedData,
            msg: 'ok',
          }
          resolve(res)
          return
        }
      } else {
        const cachedData = Session.get('activity')?.eventData[event]
        const lastFetchTime =
          parseInt(Session.get(`lastFetchTime-${event}`)) || 0
        const isFetched = Session.get(`isFetched-${event}`)
        // 有缓存数据。但是不能依靠这个判断是否应该使用缓存数据，因为 Pinia 中设置了初始值
        // 当前活动是否缓存过
        // 距离上一次请求小于 3500
        if (cachedData && isFetched && now - lastFetchTime < 3500) {
          const res = {
            code: 200,
            data: {
              event_data: {
                [event]: cachedData,
              },
            },
            msg: 'ok',
          }
          resolve(res)
          return
        }
      }
      let throttledFetch = throttledFetchMap[event]
      if (!throttledFetch) {
        throttledFetch = throttle(fetchPlayerMissionData, 3500, {
          trailing: false,
        })
        throttledFetchMap[event] = throttledFetch
      }
      // 存储请求时间
      Session.set(`lastFetchTime-${event}`, now.toString())
      // 存储是否请求过
      Session.set(`isFetched-${event}`, true)
      throttledFetch({ event, token }, resolve, reject).catch((err: any) => {
        reject(err)
      })
    } else {
      const cachedAllEvents = Session.get('allEvents')
      const lastFetchTime = parseInt(Session.get('lastFetchTimeAllEvents')) || 0
      if (cachedAllEvents && now - lastFetchTime < 3500) {
        resolve(cachedAllEvents)
        return
      }
      // 存储请求时间
      Session.set('lastFetchTimeAllEvents', now.toString())
      fetchPlayerMissionData({ event }, resolve, reject).catch((err) => {
        reject(err)
      })
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
      'repeat request': '请求过于频繁，请稍后再试',
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
    }).catch((err) => {
      console.log(err)
      reject(err)
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
  expect,
}: {
  task: string
  event: string
  rewardId: number
  expect?: string
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
        expect,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgMissionReward(res.code, res.msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

function handleErrMsgMissionReward(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    400: {
      invalid: '状态异常，请刷新后重试',
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
    }).catch((err) => {
      console.log(err)
      reject(err)
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
