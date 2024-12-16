import type { PostMsgParams, ServeResponse } from '@/types'
import dayjs from 'dayjs'
import { Session } from '@/utils/storage'

function logRequestInfo(
  type: string,
  resource: string | undefined,
  content: Record<string, any> | undefined,
  extend?: Record<string, any>,
): void {
  console.log('时间:', dayjs().format('YYYY-MM-DD HH:mm:ss'))
  console.log(
    `JSBridgeAPI 请求类型: ${type}\n请求地址: ${resource}\n请求参数:`,
    content,
  )
  for (const key in extend) {
    console.log(`${key}`, extend[key])
  }
}

const getPostIdentifier = (
  type: string,
  resource: string | undefined,
  content: Record<string, any> | undefined,
): string => {
  return (type || '') + (resource || '') + JSON.stringify(content)
}

/**
 * 等待JSBridge可用
 * @param callback
 */
function waitUniSDKJSBridgeReady(): Promise<void> {
  return new Promise((resolve) => {
    let pollCount = 0 // 轮询次数计数
    const startTime = new Date() // 记录轮询开始时间
    console.log(
      `JSBridgeAPI waitUniSDKJSBridgeReady 开始时间：${startTime.toLocaleTimeString()}`,
    )

    const intervalId = setInterval(() => {
      pollCount++
      console.log('pollCount: ', pollCount)
      if (window.UniSDKJSBridge) {
        const endTime = new Date() // 记录成功时间
        console.log(
          `JSBridgeAPI JSBridge成功挂载于: ${endTime.toLocaleTimeString()}，经过 ${pollCount} 次轮询`,
        )
        clearInterval(intervalId)
        resolve()
      }
    }, 100)
  })
}

/**
 * 解析服务端返回的JsonString
 * @param respJSONString
 * @returns
 */
function parseResponse(respJSONString: string): ServeResponse {
  const reg = /"web_response":"({.*?})"/
  const match = respJSONString.match(reg)
  let res: ServeResponse = null

  if (match) {
    const resStr = match[1].replace(/\\/g, '')
    res = JSON.parse(resStr)
  }
  return res
}

/**
 * JSBridge调用函数
 * 最直接的JSBridge调用接口，封装了UniSDKJSBridge的检查，若UniSDKJSBridge可用，直接postMsgToNative，否则等待UniSDKJSBridge可用
 * @param msg
 */
export function postMsgToNative(msg: any): void {
  console.log('JSBridgeAPI postMsgToNative', msg)
  if (window.UniSDKJSBridge) {
    window.UniSDKJSBridge.postMsgToNative(msg)
  } else {
    waitUniSDKJSBridgeReady()
      .then(() => {
        window.UniSDKJSBridge.postMsgToNative(msg)
      })
      .catch(() => {
        console.log('JSBridgeAPI postMsgToNative fail', msg)
      })
  }
}

/**
 * 协议发送函数
 * web与game通信的接口，返回一个Promise对象；若请求成功，则会缓存此次请求的结果；取消回调，使用.then/.catch获取服务端返回
 */
export function handlePostMessageToNative({
  type,
  resource,
  content,
}: PostMsgParams): Promise<ServeResponse> {
  return new Promise((resolve, reject) => {
    logRequestInfo(type, resource, content)

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
          const res = parseResponse(respJSONString)
          logRequestInfo(type, resource, content, { 服务返回信息: res })
          if (res && res.code === 200) {
            resolve(res)
            // 缓存服务端返回
            const identifier = getPostIdentifier(type, resource, content)
            Session.set(`serveResponseCache-${identifier}`, res)
          } else {
            reject(res)
            logRequestInfo(type, resource, content, { 请求失败: res?.msg })
          }
        },
      },
    })
  })
}

/**
 * 有缓存能力的协议发送函数
 * 使用getPostIdentifier生成协议请求的标识符，如果该标识在wait时间内（默认3500ms）有过请求，则返回缓存数据，否则正常请求
 */
export function handlePostMessageToNativeCache(
  { type, resource, content }: PostMsgParams,
  wait: number = 3500,
): Promise<ServeResponse> {
  return new Promise((resolve, reject) => {
    const identifier = getPostIdentifier(type, resource, content)
    const lastFetchTime = Session.get(`lastFetchTime-${identifier}`) || 0
    const nowTime = Date.now()
    const serveResponseCache = Session.get(`serveResponseCache-${identifier}`)
    if (serveResponseCache && nowTime - lastFetchTime < wait) {
      console.log('JSBridgeAPI 两次请求间隔过短，使用缓存')
      logRequestInfo(type, resource, content, {
        请求间隔: wait,
        距离上次请求: nowTime - lastFetchTime,
        使用缓存: serveResponseCache,
      })
      resolve(serveResponseCache)
    } else {
      Session.set(`lastFetchTime-${identifier}`, nowTime)
      handlePostMessageToNative({ type, resource, content })
        .then((res) => {
          resolve(res)
        })
        .catch((res) => {
          reject(res)
        })
    }
  })
}
