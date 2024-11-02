import type { WorkListParams, WorkListRes, Response } from '@/types'
import { getErrorMessage, handlePostMessageToNative } from '@/utils/request'

import type {
  BaseDesignDetails,
  SelfDesignDetails,
} from '@/types/activity/dayofdesign01'

/**
 * 作品列表
 * @param {WorkListParams} params 参数
 * @property {SearchType} type 类型
 * @property {number} page 页数
 * @property {number} per_page 每页数量
 * @returns {Promise<WorkListRes>}
 */
export function getWorkList(params: WorkListParams): Promise<WorkListRes> {
  console.log('params: ', params)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'ok',
        data: {
          list: [
            {
              id: 'ID123456781',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
            {
              id: 'ID123456782',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
            {
              id: 'ID123456783',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: true,
            },
            {
              id: 'ID123456784',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
            {
              id: 'ID123456783',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: true,
            },
            {
              id: 'ID123456784',
              image_url: 'http://iph.href.lu/800x600',
              author: 'John',
              title: '作品标题作品标题',
              description: '作品描述',
              collected: false,
            },
          ],
          total_pages: 50,
          page: 2,
        },
      })
    }, 200)
  })
}

/**
 * 获取作品详情信息
 * @function getDesignDetails
 * @param {string} policyName 在线图片的url
 * @returns {boolean} 上传是否成功的结果
 */
export const getDesignDetails = (
  policyName: string,
  designId?: string,
): Promise<BaseDesignDetails | SelfDesignDetails> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_design_details',
      content: designId
        ? {
            policy_name: policyName,
            design_id: designId,
          }
        : {
            policy_name: policyName,
          },
      handleRes: (res: Response) => {
        const { code, msg, data } = res
        if (code === 200) {
          resolve(data)
        } else {
          reject(new Error(getErrorMessage('get_design_details', code, msg)))
        }
      },
    })
  })
}

/**
 * 删除作品详情信息
 * @function deleteDesignDetails
 * @param {string} policyName 在线图片的url
 * @returns {boolean} 上传是否成功的结果
 */
export const deleteDesignDetails = (
  policyName: string,
  designId: string = '',
  fileUrl: string = '',
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/delete_player_design',
      content: {
        policy_name: policyName,
        file_url: fileUrl,
        design_id: designId,
      },
      handleRes: (res: Response) => {
        const { code, msg } = res
        if (code === 204) {
          resolve(true)
        } else {
          reject(new Error(getErrorMessage('delete_player_design', code, msg)))
        }
      },
    })
  })
}

/**
 * 收餐作品
 * @function updateFavorites
 * @param {string} designId 作品id
 * @param {string} isFavorite 是否收藏
 * @param {string} event 事件名
 * @returns {boolean} 收藏成功
 */
export const updateFavorites = (
  designId: string,
  isFavorite: boolean,
  event: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/update_favorites',
      content: {
        design_id: designId,
        favorite: isFavorite,
        event,
      },
      handleRes: (res: Response) => {
        const { code, msg } = res
        if (code === 200) {
          resolve(true)
        } else {
          reject(new Error(getErrorMessage('update_favorites', code, msg)))
        }
      },
    })
  })
}
