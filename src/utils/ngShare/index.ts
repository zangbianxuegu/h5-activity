import { showToast } from 'vant'
import type {
  ANDROID_INSTALLED_PACKAGE,
  IOS_INSTALLED_PACKAGE,
  NGSHARE_SHARE_CHANNEL,
  NgshareCheckChannelIsExistToNativeConfig,
} from './types'
import {
  installedPackageList,
  ngshareShareChannelMap,
  NGSHARE_CONTENT_TYPE,
} from './types'
import { useEnvironment } from '@/composables/useEnvironment'

const { isAndroid, isIos } = useEnvironment()

export function ngshareCheckChannelIsExist(
  installedPackage:
    | ANDROID_INSTALLED_PACKAGE
    | IOS_INSTALLED_PACKAGE
    | undefined
    | '',
): Promise<{
  isExist: boolean
}> {
  const resolveRes = {
    isExist: false,
  }
  let isSuccessNativeCallback = false
  return new Promise((resolve, reject) => {
    if (!installedPackage) reject(new Error('请传入查询渠道'))
    const config: NgshareCheckChannelIsExistToNativeConfig = {
      methodId: 'execute_extend_func',
      reqData: {
        methodId: isAndroid ? 'hasPackageInstalled' : 'hasAppInstalled',
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
            const packageObj = installedPackageList.find((e) =>
              isAndroid
                ? e.androidPackage === installedPackage
                : e.iosPackage === installedPackage,
            )
            showToast(`您未安装${packageObj?.name}，请安装后重试！`)
          }
          isSuccessNativeCallback = true
          resolve(resolveRes)
        },
      },
    }
    if (isAndroid) {
      config.reqData.appId = installedPackage as string
    } else if (isIos) {
      config.reqData.urlScheme = installedPackage as string
    }

    window.UniSDKJSBridge.postMsgToNative(config)
    setTimeout(() => {
      if (!isSuccessNativeCallback) {
        reject(new Error('检查渠道失败'))
      }
    }, 2000)
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
      link,
      desc,
      u3dshareThumb, // 分享缩略图地址(安卓必传)
      shareThumb: u3dshareThumb, // 分享缩略图地址(iOS传入，待后续支持u3dshareThumb)
    }
  } else if (contentType === NGSHARE_CONTENT_TYPE.IMAGE) {
    const { text, title, image } = configForType
    contentTypeConfig = {
      text,
      title,
      image,
    }
  }
  const ngshareChannel = ngshareShareChannelMap.get(shareChannel)
  const { isExist } = await ngshareCheckChannelIsExist(
    isAndroid
      ? ngshareChannel?.androidInstalledPackage
      : ngshareChannel?.iosInstalledPackage,
  )
  if (isExist) {
    window.UniSDKJSBridge.postMsgToNative({
      methodId: 'execute_extend_func',
      reqData: {
        methodId: 'ngshareExtend', // 简易分享的methodId为ntShare
        channel: 'ngshare_extend', // 客户端打包有勾选ngshareextend二级渠道，则为ngshare_extend，否则为ngshare
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
