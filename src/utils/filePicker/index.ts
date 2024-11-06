import axios from 'axios'
import CryptoJS from 'crypto-js'
import { getErrorMessage, handlePostMessageToNative } from '../request'
import {
  ERROR_TYPE,
  REVIEW_TEXT_ERROR_TYPE,
  reviewTextResponseMap,
} from './types'
import type { Response } from '@/types'
import type { UploadImgToFilePickerResponse } from './types'
import { getSkyFilePicker } from './constant'

/**
 * 获取file [iOS & Android]
 * @function saveImgToDeviceAlbum
 * @param {string} uploadUrl filePicker的上传地址
 * @param {string} policyName filePicker策略名
 * @param {string} md5 对待上传图片所计算的md5值
 * @param {string} ping filePicker的ping
 * @param {string} extraInfo filePicker所上传图片要附带的信息
 * @returns {string} 获取到的token
 */
export const getFilePickerToken = (
  uploadUrl: string,
  policyName: string,
  md5: string = '',
  ping: string = '',
  extraInfo: Record<string, any> = {},
): Promise<string> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_file_picker_token',
      content: {
        method: 'POST',
        url: uploadUrl,
        policy_name: policyName,
        md5,
        ping,
        extra_info: extraInfo,
      },
      handleRes: (res: Response) => {
        const { code, data, msg } = res
        if (code === 200) {
          const { token } = data
          resolve(token)
        } else {
          reject(new Error(getErrorMessage('get_file_picker_token', code, msg)))
        }
      },
    })
  })
}

/**
 * 检测文本信息是否合规
 * @function reviewText
 * @param {string} reviewObj 检查文本信息的对象
 * @returns {boolean} 上传是否成功的结果
 */
export const reviewText = (
  reviewObj: Record<string, any>,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/review_text',
      content: {
        text: reviewObj,
      },
      handleRes: (res) => {
        console.log('res', res)
        const { code, msg }: { code: 200 | 400; msg: string } = res
        if (code === 200) {
          resolve(true)
        } else {
          if (msg.includes(REVIEW_TEXT_ERROR_TYPE.ILLEGAL)) {
            const illegalKey = msg.split(' ')[1]
            const illegalReason = msg.split(
              ' ',
            )[0] as REVIEW_TEXT_ERROR_TYPE.ILLEGAL
            reject(
              new Error(
                JSON.stringify({
                  errorType: ERROR_TYPE.REVIEW_TEXT_ERROR,
                  invalidKey: illegalKey,
                  invalidReasonType: REVIEW_TEXT_ERROR_TYPE.ILLEGAL,
                  invalidReasonDefaultText:
                    reviewTextResponseMap.get(illegalReason),
                }),
              ),
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
            reject(new Error(getErrorMessage('review_text', code, msg)))
          }
        }
      },
    })
  })
}

/**
 * 上传图片至filepicker
 * @function uploadImgToFilePicker
 * @param {string} url 在线图片的url
 * @returns {boolean} 上传是否成功的结果
 */
export const uploadImgToFilePicker = async (
  filePickerToken: string,
  imgData: Blob,
): Promise<UploadImgToFilePickerResponse | undefined> => {
  try {
    const reqUrl = getSkyFilePicker()
    const response = await axios.post(reqUrl, imgData, {
      headers: {
        Authorization: filePickerToken || '',
      },
    })
    const { data, status } = response
    if (status === 200) {
      console.log('response', response)
      return {
        url: data.url,
      }
    } else {
      throw new Error('上传图片至filepicker失败')
    }
  } catch (e) {
    console.log('uploadImgToFilePicker error', e)
    throw e
  }
}

/**
 * 上传filePicker的存储结果至服务器(包括form数据)
 * @function uploadWorksDataToServer
 * @param {string} FilePickerUploadResultCode 一般转发至filepicker的响应码,但如果不是200即成功,前端不应该调用此接口
 * @param {string} policyName 策略名,与获取filepicker token所传参数一致
 * @param {string} reviewObj 需要检测的文本数据
 * @param {string} fileUrl 上传成功至filepicker所获取的文件存储地址
 * @returns {Record<string, any>} 上传成功的响应,eg:"data":{"design_id":xxx}}
 */
export const uploadFormAndFilePickerResultToServer = (
  FilePickerUploadResultCode: 200,
  policyName: string,
  reviewObj: Record<string, any>,
  fileUrl: string,
): Promise<Record<string, any>> => {
  return new Promise((resolve, reject) => {
    if (FilePickerUploadResultCode !== 200) {
      reject(new Error('filePicker上传错误,不要请求此接口'))
    }
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '',
      content: {
        result_code: FilePickerUploadResultCode,
        policy_name: policyName,
        text: reviewObj,
        file_url: fileUrl,
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
 * @function uploadFormAndFilePickerResultToServerCommon
 * @param filePickerUrl filePicker的上传地址
 * @param policyName 策略名
 * @param reviewTextObj 检查文本的对象
 * @param imgBlob 上传的图片
 * @returns 返回后端的响应，eg:{"design_id":xxx}
 */
export const uploadFormAndFilePickerResultToServerCommon = async (
  filePickerUrl: string,
  policyName: string,
  reviewTextObj: Record<string, any>,
  imgBlob: Blob,
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

    // 检测作品文本信息
    const reviewTextResult = await reviewText(reviewTextObj)
    if (reviewTextResult) {
      // 获取filepicker token
      const token = await getFilePickerToken(
        filePickerUrl,
        policyName,
        md5Result,
      )
      if (token) {
        // 上传稿件至filepicker
        const uploadResult = await uploadImgToFilePicker(token, imgBlob)
        if (uploadResult?.url) {
          const currentUoloadFileUrl = uploadResult.url
          // 存储稿件最终数据至服务端,完成投稿
          const uploadDataToServerResult =
            await uploadFormAndFilePickerResultToServer(
              200,
              policyName,
              reviewTextObj,
              currentUoloadFileUrl,
            )
          if (uploadDataToServerResult) {
            return {
              ...uploadDataToServerResult,
              file_url: currentUoloadFileUrl,
            }
          }
        }
      }
    }
  } catch (e: any) {
    console.log('uploadFormAndFilePickerResultToServerCommon error', e)
    throw e.message
  }
}
