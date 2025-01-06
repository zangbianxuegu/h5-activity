import {
  postMsgToNative,
  handlePostMessageToNative,
  handlePostMessageToNativeCache,
} from './jsBridgeAPI'
import { getPlayerMissionData, claimMissionReward } from './request'
import { useMenuStore } from '@/stores/menu'

const { changeMenuVisible } = useMenuStore()

/** 父页面向子页面返回数据 */
function postMessage2c(event: MessageEvent, message: any): void {
  const key = event.data.key.replace('c2s', 's2c')
  event.source?.postMessage(
    { key, res: message },
    {
      targetOrigin: event.origin,
    },
  )

  console.log(`jsBridgeDeliver post message key：${key} res:`)
  console.log(message)
}

/**
 * 子页面向父页面post的数据格式为:
 * {
      key：string, 调用的接口
      content: any, 传入的参数
      [optional: string]: any, 可选参数，如handlePostMessageToNativeCache有wait参数
    },
 *
 * @param event
 * @returns
 */
function listener(event: MessageEvent): void {
  if (event.origin !== 'https://h5maker-backend-ma75.nie.netease.com') {
    return
  }

  const key = event.data.key
  const content = event.data.content

  console.log(`jsBridgeDeliver get message key：${key} content:`)
  console.log(content)

  switch (key) {
    case 'menuHide':
      changeMenuVisible(false)
      break
    case 'menuShow':
      changeMenuVisible(true)
      break
    case 'c2sPostMsgToNative':
      postMsgToNative(content) // TODO:
      break
    case 'c2sHandlePostMessageToNative':
      handlePostMessageToNative(content)
        .then((res) => {
          postMessage2c(event, res)
        })
        .catch(() => {})
      break
    case 'c2sHandlePostMessageToNativeCache':
      handlePostMessageToNativeCache(content, event.data.wait || 3500)
        .then((res) => {
          postMessage2c(event, res)
        })
        .catch(() => {})
      break
    case 'c2sGetPlayerMissionData':
      getPlayerMissionData(content)
        .then((res) => {
          postMessage2c(event, res)
        })
        .catch(() => {})
      break
    case 'c2sClaimMissionReward':
      claimMissionReward(content)
        .then((res) => {
          postMessage2c(event, res)
        })
        .catch(() => {})
      break
    case 'c2sLog':
      console.log(content)
  }
}

export function startListener(): void {
  window.addEventListener('message', listener)
  console.log('jsBridgeDeliver listen start')
}

export function stopListener(): void {
  window.removeEventListener('message', listener)
  console.log('jsBridgeDeliver listen stop')
}
