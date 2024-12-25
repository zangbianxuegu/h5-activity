import type { Response, PostMsgParams } from '@/types'
import { handlePostMessageToNative } from '@/utils/request'

export function getDataForIframe({
  type,
  resource,
  content,
}: PostMsgParams): Promise<Response> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type,
      resource,
      content,
      handleRes: (res) => {
        resolve(res)
      },
    }).catch((err) => {
      reject(err)
    })
  })
}
