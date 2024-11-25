import { handlePostMessageToNative, getErrorMessage } from '@/utils/request'
import type { WerewolfRes } from '@/types'
/**
 * 获取用户狼人杀信息
 * @function getWerewolfInfo
 * @typedef {Object} GetWerewolfInfoParams
 * @property {string} user 用户标识
 * @property {string} werewolf_nid 狼人UID
 * @returns {Promise<WerewolfRes>}
 */
export function getWerewolfInfo({
  user,
  werewolfNid,
}: {
  user: string
  werewolfNid: string
}): Promise<WerewolfRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/jingling/get_werewolf_info',
      content: {
        source_token: '',
        source_id: '',
        user,
        werewolf_nid: werewolfNid,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'get_werewolf_info',
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
 * 狼人杀绑定接口
 * @function bindWerewolfInfo
 * @typedef {Object} GetWerewolfInfoParams
 * @property {string} user 用户标识
 * @property {string} werewolfNid 狼人UID
 * @returns {Promise<WerewolfRes>}
 */
export function bindWerewolfInfo({
  user,
  werewolfNid,
}: {
  user: string
  werewolfNid: string
}): Promise<WerewolfRes> {
  return new Promise((resolve, reject) => {
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/internal/jingling/bind_werewolf_info',
      content: {
        source_token: '',
        source_id: '',
        user,
        werewolf_nid: werewolfNid,
      },
      handleRes: (res) => {
        if (res.code === 200) {
          resolve(res)
        } else {
          const errorMessage = getErrorMessage(
            'bind_werewolf_info',
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
