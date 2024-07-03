import type { TokenParams, Response } from '@/types'
import { handlePostMessageToNative } from '@/utils/request'

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
    }).catch((err) => {
      console.log(err)
      reject(err)
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
    }).catch((err) => {
      console.log(err)
      reject(err)
    })
  })
}

// 获取精灵 token
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
    }).catch((err) => {
      console.log(err)
      reject(err)
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
    }).catch((err) => {
      console.log(err)
      reject(err)
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
