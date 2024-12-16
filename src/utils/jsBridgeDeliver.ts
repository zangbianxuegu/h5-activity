import {
  postMsgToNative,
  handlePostMessageToNative,
  handlePostMessageToNativeCache,
} from './jsBridgeAPI'
import { getPlayerMissionData, claimMissionReward } from './request'

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

function listener(event: MessageEvent): void {
  if (event.origin !== 'https://h5maker-backend-ma75.nie.netease.com') {
    return
  }

  const key = event.data.key
  const content = event.data.content

  console.log(`jsBridgeDeliver get message key：${key} content:`)
  console.log(content)

  switch (key) {
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
