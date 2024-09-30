import { showToast } from 'vant'
import type { INSTALLED_PACKAGE, NGSHARE_SHARE_CHANNEL } from './types'
import {
  installedPackageList,
  ngshareShareChannelMap,
  NGSHARE_CONTENT_TYPE,
} from './types'

export function ngshareCheckChannelIsExist(
  installedPackage: INSTALLED_PACKAGE | undefined | '',
): Promise<{
  isExist: boolean
}> {
  const resolveRes = {
    isExist: false,
  }
  return new Promise((resolve, reject) => {
    if (!installedPackage) reject(new Error('请传入查询渠道'))
    window.UniSDKJSBridge.postMsgToNative({
      methodId: 'execute_extend_func',
      reqData: {
        methodId: 'hasPackageInstalled',
        appId: installedPackage,
        callback_mode: 'web',
      },
      callback: {
        nativeCallback: function (respJSONString: string) {
          console.log(
            'ngshareCheckChannelIsExistBeforeShare respJSONString: ',
            respJSONString,
          )
          const resObj = JSON.parse(respJSONString)
          resolveRes.isExist = resObj.result
          if (!resObj.result) {
            const packageObj = installedPackageList.find(
              (e) => e.packageId === installedPackage,
            )
            showToast(`${packageObj?.name}未安装`)
          }
          resolve(resolveRes)
        },
      },
    })
  })
}

export const ngshareByH5 = async (
  contentType: NGSHARE_CONTENT_TYPE,
  shareChannel: NGSHARE_SHARE_CHANNEL,
  configForType: Record<string, any>,
  callback?: (respJSONString: string) => void,
): Promise<void> => {
  let contentTypeConfig = {}
  if (contentType === NGSHARE_CONTENT_TYPE.LINK) {
    const { text, title, u3dshareThumb, link, desc } = configForType
    contentTypeConfig = {
      text,
      title,
      u3dshareThumb, // 分享缩略图地址(安卓必传)
      link,
      desc,
    }
  }
  const { isExist } = await ngshareCheckChannelIsExist(
    ngshareShareChannelMap.get(shareChannel)?.installedPackage,
  )
  if (isExist) {
    window.UniSDKJSBridge.postMsgToNative({
      methodId: 'execute_extend_func',
      reqData: {
        methodId: 'ngshareExtend', // 简易分享的methodId为ntShare
        channel: 'ngshare', // 客户端打包有勾选ngshareextend二级渠道，则为ngshare_extend，否则为ngshare
        source: 'webview',
        type: contentType,
        shareChannel,
        platform: ngshareShareChannelMap.get(shareChannel)?.platform,
        ...contentTypeConfig,
      },
      callback: {
        nativeCallback: function (respJSONString: string) {
          console.log('ngshareByH5 respJSONString: ', respJSONString)
          callback && callback(respJSONString)
        },
      },
    })
  }
}
