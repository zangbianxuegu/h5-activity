import type { Response } from '@/types'
import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'

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
          const errorMessage = getErrorMessage(
            'purchase_sprite_token',
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
