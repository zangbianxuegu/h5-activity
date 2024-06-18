import type { Response } from '@/types'
import { handlePostMessageToNative } from '@/utils/request'

/**
 * @param token_count 礼花剩余数
 * @param remaining_amount 礼品剩余数
 */
export interface PurchaseSpriteTokenRes {
  code: number
  msg: string
  data: {
    token_name: string
    token_count: number
    start_time: number
    end_time: number
    current_time: number
    remaining_amount: number
    id: number
  }
}

// 兑换奖励
export function purchaseSpriteToken({
  id,
  remainingAmount,
  storeCurrencyCount,
  storeEvent,
}: {
  id: number
  remainingAmount: number
  storeCurrencyCount: number
  storeEvent: string
}): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/purchase_sprite_token',
      content: {
        id,
        remaining_amount: remainingAmount,
        store_currency_count: storeCurrencyCount,
        store_event: storeEvent,
      },
      handleRes: (res: PurchaseSpriteTokenRes) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = handleErrMsgPurchaseSpriteToken(
            res.code,
            res.msg,
          )
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

function handleErrMsgPurchaseSpriteToken(code: number, msg: string): string {
  const errorMessages: Record<number, Record<string, string>> = {
    401: {
      'invalid user': '非法账号',
      'invalid event': '商店事件未定义',
      'inactive event': '商店事件未开启',
    },
    402: {
      'invalid id or event': '商品id错误',
      'invalid store currency type': '商品货币配置异常',
    },
    404: {
      'frequent request': '频繁请求',
    },
    405: {
      'concurrent request': '冲突请求',
    },
    500: {
      default: '服务器内部发生错误',
    },
  }
  const defaultErrorMessage = '兑换奖励失败'
  return (
    errorMessages[code]?.[msg] ||
    errorMessages[code]?.default ||
    defaultErrorMessage
  )
}
