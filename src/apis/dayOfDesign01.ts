import type {
  Response,
  ListRecommendParams,
  ListRecommendRes,
  ListFavoriteParams,
  ListFavoriteRes,
  ListSearchParams,
  ListSearchRes,
  DesignItem,
  FavoriteData,
  DetailParams,
  OtherDesignDetails,
  SelfDesignDetails,
} from '@/types'
import { getErrorMessage, handlePostMessageToNative } from '@/utils/request'
import CryptoJS from 'crypto-js'
import {
  ERROR_TYPE,
  REVIEW_TEXT_ERROR_TYPE,
  reviewTextResponseMap,
} from '@/utils/filePicker/types'
import {
  reviewText,
  getFilePickerToken,
  uploadImgToFilePicker,
} from '@/utils/filePicker'
import Loading from '@/components/Loading'

/**
 * 作品列表 - 推荐
 * @param {ListRecommendParams} params 参数
 * @property {string} event 事件名
 * @property {string} policy_name 策略名
 * @property {string} [group] 分组（可选），第一轮投票期必填
 * @returns {Promise<ListRecommendRes>}
 */
export function getRecommendations(
  params: ListRecommendParams,
): Promise<DesignItem[]> {
  return new Promise((resolve, reject) => {
    Loading.show()
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_recommendations',
      content: params,
      handleRes: (res: ListRecommendRes) => {
        Loading.hide()
        const { code, data, msg } = res
        if (code === 200) {
          resolve(data)
        } else {
          const errorMessage = getErrorMessage('new_common_error', code, msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 作品列表 - 我的收藏
 * @param {ListFavoriteParams} params 参数
 * @property {string} event 事件名
 * @property {string} policy_name 策略名
 * @property {number} [favorite_time] 最小收藏时间（可选），请求第一页的时候不用填，秒级时间戳
 * @property {string} [group] 分组（可选），第一轮投票期必填
 * @returns {Promise<ListFavoriteRes>}
 */
export function getFavorites(
  params: ListFavoriteParams,
): Promise<FavoriteData> {
  return new Promise((resolve, reject) => {
    Loading.show()
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_favorites',
      content: params,
      handleRes: (res: ListFavoriteRes) => {
        Loading.hide()
        const { code, data, msg } = res
        if (code === 200) {
          resolve(data)
        } else {
          const errorMessage = getErrorMessage('get_favorites', code, msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 作品列表 - 搜索
 * @param {ListSearchParams} params 参数
 * @property {string} event 事件名
 * @property {string} policy_name 策略名
 * @property {string} search_term 搜索文本
 * @property {string} [id_offset] 当前页最小的作品ID（选填），请求第一页的时候不用填。
 * @property {string} [group] 分组（可选），第一轮投票期必填
 * @returns {Promise<ListSearchRes>}
 */
export function searchDesigns(params: ListSearchParams): Promise<FavoriteData> {
  return new Promise((resolve, reject) => {
    Loading.show()
    handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/search_designs',
      content: params,
      handleRes: (res: ListSearchRes) => {
        Loading.hide()
        const { code, data, msg } = res
        if (code === 200) {
          resolve(data)
        } else {
          const errorMessage = getErrorMessage('search_designs', code, msg)
          reject(new Error(errorMessage))
        }
      },
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * 获取作品详情信息
 * @param {DetailParams} params 参数
 * @property {string} policy_name 策略名
 * @property {string} [design_id] 作品 ID（可选）
 * @property {string} [favorite_time] 收藏时间（可选）
 * @returns {Promise<OtherDesignDetails | SelfDesignDetails>} 作品详情
 */
export const getDesignDetails = (
  params: DetailParams,
): Promise<OtherDesignDetails | SelfDesignDetails> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_design_details',
      content: params,
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
 * @param {string} policyName 传保存原图filePicker策略名
 * @returns {boolean} 收藏成功
 */
export const updateFavorites = (
  designId: string,
  isFavorite: boolean,
  event: string,
  policyName: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/update_favorites',
      content: {
        design_id: designId,
        favorite: isFavorite,
        event,
        policy_name: policyName,
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

/**
 * 上传filePicker的存储结果至服务器(包括form数据)
 * @function uploadWorksDataToServer
 * @param {string} FilePickerUploadResultCode 一般转发至filepicker的响应码,但如果不是200即成功,前端不应该调用此接口
 * @param {string} policyName 策略名,与获取filepicker token所传参数一致，这里只传需要审核的原图img的策略名
 * @param {string} reviewObj 需要检测的文本数据
 * @param {string} fileUrl 上传成功至filepicker所获取的文件存储地址
 * @returns {Record<string, any>} 上传成功的响应,eg:"data":{"design_id":xxx}}
 */
export const uploadFormAndFilePickerResultToServerApi = (
  FilePickerUploadResultCode: 200,
  policyName: string,
  reviewObj: Record<string, any>,
  fileUrl: string,
  shareImgUrl: string,
): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    if (FilePickerUploadResultCode !== 200) {
      reject(new Error('filePicker上传错误,不要请求此接口'))
    }
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/upload_filepicker_result',
      content: {
        result_code: FilePickerUploadResultCode,
        policy_name: policyName,
        text: reviewObj,
        file_url: fileUrl,
        share_url: shareImgUrl,
        result_string: '',
      },
      handleRes: (res) => {
        console.log('res', res)
        const {
          code,
          msg,
          data,
        }: {
          code: 200 | 400 | 500
          msg: string
          data: Record<string, any>
        } = res
        if (code === 200) {
          resolve(data)
        } else {
          if (msg.includes(REVIEW_TEXT_ERROR_TYPE.ILLEGAL)) {
            const illegalKey = msg.split(' ')[1]
            reject(
              JSON.stringify({
                errorType: ERROR_TYPE.REVIEW_TEXT_ERROR,
                invalidKey: illegalKey,
                invalidReasonType: REVIEW_TEXT_ERROR_TYPE.ILLEGAL,
                invalidReasonDefaultText: reviewTextResponseMap.get(
                  REVIEW_TEXT_ERROR_TYPE.ILLEGAL,
                ),
              }),
            )
          } else if (
            msg.includes(REVIEW_TEXT_ERROR_TYPE.ERROR_LENGTH) ||
            msg.includes(REVIEW_TEXT_ERROR_TYPE.INVALID) ||
            msg.includes(REVIEW_TEXT_ERROR_TYPE.NOMATCH)
          ) {
            const msgToArray = msg.split(' ')
            const invalidKey = msgToArray[0]
            const invalidReasonType = msgToArray[1] as REVIEW_TEXT_ERROR_TYPE
            const errorDataObject = {
              errorType: ERROR_TYPE.REVIEW_TEXT_ERROR,
              invalidKey,
              invalidReasonType,
              invalidReasonDefaultText:
                reviewTextResponseMap.get(invalidReasonType),
            }
            reject(new Error(JSON.stringify(errorDataObject)))
          } else {
            reject(
              new Error(getErrorMessage('upload_filepicker_result', code, msg)),
            )
          }
        }
      },
    })
  })
}

/**
 * @description 上传稿件至filepicker并完成投稿（需要检查文本）
 * @function uploadWorksToServer
 * @param filePickerUrl filePicker的上传地址
 * @param policyName 策略名
 * @param shareImgPolicyName 分享图策略名
 * @param reviewTextObj 检查文本的对象
 * @param imgBlob 上传的图片
 * @returns 返回后端的响应，eg:{"design_id":xxx}
 */
export const uploadWorksToServer = async (
  policyName: string,
  shareImgPolicyName: string,
  reviewTextObj: Record<string, any>,
  imgBlob: Blob,
  shareImgBlob: Blob,
): Promise<Record<string, any> | undefined> => {
  try {
    const md5Result: string = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(imgBlob)
      reader.onload = function (event) {
        const baseResult = event.target?.result as any
        const wordArray = CryptoJS.lib.WordArray.create(baseResult)
        resolve(CryptoJS.MD5(wordArray).toString())
      }
    })

    const md5ResultShareImg: string = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsArrayBuffer(shareImgBlob)
      reader.onload = function (event) {
        const baseResult = event.target?.result as any
        const wordArray = CryptoJS.lib.WordArray.create(baseResult)
        resolve(CryptoJS.MD5(wordArray).toString())
      }
    })

    // 检测作品文本信息
    const reviewTextResult = await reviewText(reviewTextObj)
    if (reviewTextResult) {
      // 获取filepicker token
      const { token: tokenImg, url: filePickerUrlImg } =
        await getFilePickerToken(policyName, md5Result)
      // 获取filepicker token
      const { token: tokenShareImg, url: filePickerUrlShareImg } =
        await getFilePickerToken(shareImgPolicyName, md5ResultShareImg)
      if (tokenImg && tokenShareImg) {
        // 上传稿件至filepicker
        const uploadImgResult = await uploadImgToFilePicker(
          tokenImg,
          imgBlob,
          filePickerUrlImg,
        )
        const uploadshareImgResult = await uploadImgToFilePicker(
          tokenShareImg,
          shareImgBlob,
          filePickerUrlShareImg,
        )
        if (uploadImgResult?.url && uploadshareImgResult?.url) {
          // 存储稿件最终数据至服务端,完成投稿
          const uploadDataToServerResult =
            await uploadFormAndFilePickerResultToServerApi(
              200,
              policyName,
              reviewTextObj,
              uploadImgResult?.url,
              uploadshareImgResult?.url,
            )
          if (uploadDataToServerResult) {
            return {
              ...uploadDataToServerResult,
              file_url: uploadImgResult?.url,
              share_url: uploadshareImgResult?.url,
            }
          }
        }
      }
    }
  } catch (e: any) {
    console.log('uploadFormAndFilePickerResultToServerApiCommon error', e)
    throw e
  }
}

/**
 * 请求审核组合图
 * @function reviewShareDesign 修改组合图审核状态
 * @param {string} designId 作品id
 * @param {string} policyName 传保存原图filePicker策略名
 */
export const reviewShareDesign = (
  designId: string,
  policyName: string,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/review_share_design',
      content: {
        design_id: designId,
        policy_name: policyName,
      },
      handleRes: (res: Response) => {
        const { code, msg } = res
        if (code === 200) {
          resolve(true)
        } else {
          reject(new Error(getErrorMessage('review_share_design', code, msg)))
        }
      },
    })
  })
}
