import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'
import type { AcceptInviteRes, InviteInfoRes } from '@/types'
/**
 * 获取邀请码信息
 * @function getInviteInfo
 * @typedef {Object} GetInfoParams
 * @returns {Promise<InviteInfoRes>}
 */
export function getInviteInfo(): Promise<InviteInfoRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_invite_info',
      content: {
        source_token: '',
        source_id: '',
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'get_invite_info',
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
 * 绑定邀请码接口
 * @function acceptInvite
 * @property {string} code 绑定的邀请码
 * @returns {Promise<AcceptInviteRes>}
 */
export function acceptInvite({
  code,
}: {
  code: string
}): Promise<AcceptInviteRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/accept_invite',
      content: {
        source_token: '',
        source_id: '',
        code,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'accept_invite',
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
