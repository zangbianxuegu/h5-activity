import type { PostMsgParams, Response, ServeResponse, EventName } from '@/types'
import { ERROR_MESSAGES } from '@/constants'
import throttle from 'lodash.throttle'
import { Session } from '@/utils/storage'
import dayjs from 'dayjs'
import { closeToast, showLoadingToast } from 'vant'
import { useEnvironment } from '@/composables/useEnvironment'

export function postMsgToNative(msg: {
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
  return new Promise((resolve) => {
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
          '开始轮询检查 UniSDKJSBridge 是否挂载',
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
          if (pollCount > 100) {
            clearInterval(intervalId)
          }
        }, 100)
      }
    }

    function logRequestInfo(response: ServeResponse): void {
      console.log(
        `请求类型: ${type}\n请求地址: ${resource}\n请求参数:`,
        content,
        '\n服务返回信息:',
        response,
        '\n响应时间:',
        dayjs().format('YYYY-MM-DD HH:mm:ss'),
      )
    }

    // 轮询等待 UniSDKJSBridge 挂载成功
    waitForUniSDKJSBridge(() => {
      const data =
        type === 'userinfo' || type === 'update_red_dot'
          ? { type }
          : type === 'open_wechat_miniprogram' || type === 'set_audio_state'
            ? { type, content }
            : {
                type,
                resource,
                content: JSON.stringify(content),
              }
      postMsgToNative({
        methodId: 'ngwebview_notify_native',
        reqData: {
          notification_name: 'NT_NOTIFICATION_EXTEND',
          data,
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
  {
    event,
    token,
    appChannel,
  }: { event?: EventName; token?: string; appChannel?: string },
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
        app_channel: appChannel,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
          _resolve()
          if (event) {
            // 存储是否请求过
            Session.set(`isFetched-${event}`, true)
          } else {
            // 存储数据
            Session.set('allEvents', res)
          }
        } else {
          const errorMessage = getErrorMessage(
            'get_player_mission_data',
            res.code,
            res.msg,
          )
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      console.log(err)
      _reject(err)
    })
  })
}

/**
 * 获取玩家任务进度数据
 * @function getPlayerMissionData
 * @description
 * 对外暴露的函数，根据 event 参数的存在与否决定是否使用节流。
 * 服务端同一活动接口限制时间间隔 3s。实际测试，因为网络传输、Redis 存储，服务端记录的时间并不是前端请求发起时间，可能会存在前端请求间隔 1707163045531 -> 1707163048696，大于 3s，服务端 2024-02-06 14:12:42.104 -> 2024-02-06 14:12:45.037，小于 3s
 * 为了尽量避免此问题，时间间隔设置为 3500 ms。
 * @typedef {Object} GetPlayerMissionDataParams
 * @property {EventName} event 活动名称
 * @property {string} token 获取 token 的类型。使用这个参数获取 token 数量。比如有友节主页。
 * @returns {Promise<Response>} 返回一个 Promise，解析为 Response 对象
 * @example
 * getPlayerMissionData({ event: '', token: '' })
 *   .then(res => {
 *     console.log(res);
 *   })
 *   .catch(error => {
 *     console.error(error);
 *   });
 */
export function getPlayerMissionData({
  event,
  token,
  appChannel,
}: {
  event?: EventName
  token?: string
  appChannel?: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    const now = Date.now()
    if (event) {
      // 主要作用是刷新也会保持状态
      const cachedData = Session.get(event)?.activityData
      const lastFetchTime = parseInt(Session.get(`lastFetchTime-${event}`)) || 0
      if (cachedData && now - lastFetchTime < 3500) {
        const res = {
          code: 200,
          data: cachedData,
          msg: 'ok',
        }
        resolve(res)
        return
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
      fetchPlayerMissionData({ event, appChannel }, resolve, reject).catch(
        (err) => {
          reject(err)
        },
      )
    }
  })
}

/**
 * 更新任务进度
 * @function setPlayerTask
 * @typedef {Object} SetPlayerTaskParams
 * @property {string} task 任务id
 * @property {number} [value] 任务值/进度
 * @returns {Promise<Response>}
 */
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
          const errorMessage = getErrorMessage(
            'set_player_task',
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
 * 领奖
 * @function claimMissionReward
 * @typedef {Object} ClaimMissionRewardParams
 * @property {string} task 任务id
 * @property {string} event 活动名称
 * @property {number} rewardId 第几个奖励节点
 * @property {string} [expect] 有友节每日礼物（可选）
 * @returns {Promise<Response>}
 */
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
          const errorMessage = getErrorMessage(
            'claim_jingling_mission_reward',
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
 * 设置新活动状态
 * @function setWebRedDot
 * @param param {string} 活动名称
 * @returns {Promise<Response>}
 */
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
          console.log('res.msg', res.msg)
        }
      },
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 获取接口错误对应的文案
 * @function getErrorMessage
 * @param {string} api 接口名称
 * @param {number} code 接口状态码
 * @param {string} msg 接口 msg
 * @returns {string} 前端显示文案
 */
export function getErrorMessage(
  api: string,
  code: number,
  msg: string,
): string {
  return ERROR_MESSAGES?.[api]?.[code]?.[msg] || '服务器异常，请稍后重试'
}

/**
 * 保存前端图片至系统相册 [iOS & Android]
 * @function saveImgToDeviceAlbum
 * @param {string} url 在线图片的url
 * @param {string} timeoutErrorCount 移动端保存图片超时时间（PC不设置）
 * @returns {boolean} 保存是否成功的结果
 */
const { isPC } = useEnvironment()
export const saveImgToDeviceAlbum = (
  url: string,
  timeoutErrorCount: number = 7000,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    showLoadingToast({
      message: '下载中...',
      forbidClick: true,
      duration: 0,
    })
    const imageFormatRegex =
      /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|tif|heif|heic)$/i
    // 优化PC保存filepicker的url
    if (!imageFormatRegex.test(url)) {
      url += '.jpg'
    }
    const img = new Image()
    img.src = url
    img.onload = function () {
      postMsgToNative({
        methodId: 'saveWebImage',
        reqData: {
          imageURL: url,
        },
        callback: {
          nativeCallback: function (respJSONString: string) {
            const callbackRes = JSON.parse(respJSONString)
            const result = callbackRes.result
            closeToast()
            if (result === 'success') {
              resolve(true)
            } else if (result === 'failed') {
              reject(new Error('下载图片失败'))
            }
          },
        },
      })
    }
    img.onerror = function () {
      closeToast()
      reject(new Error('下载图片失败'))
    }
    if (!isPC) {
      // 超时处理
      setTimeout(() => {
        reject(new Error('下载图片失败'))
      }, timeoutErrorCount)
    }
  })
}
