import axios from 'axios'
import { handlePostMessageToNative } from '../request'

/**
 * 获取file [iOS & Android]
 * @function saveImgToDeviceAlbum
 * @param {string} url 在线图片的url
 * @returns {boolean} 上传是否成功的结果
 */
export const getFilePickerToken = (
  uploadUrl: string,
  policyName: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/file_picker/get_token',
      content: {
        url: uploadUrl,
        policy_name: policyName,
      },
      handleRes: (res) => {
        console.log('res', res)

        const { code, token } = res
        if (code === 200) {
          resolve(token)
        } else {
          reject(new Error('获取filePicker token失败'))
        }
      },
    })
  })
}

const enum REVIEW_TEXT_ERROR_TYPE {
  ILLEGAL = 'illegal',
  ERROR_LENGTH = 'error_length',
  NOMATCH = 'nomatch',
  INVALID = 'invalid',
}

const reviewTextResponseMap = new Map([
  [REVIEW_TEXT_ERROR_TYPE.ILLEGAL, '非法文本'],
  [REVIEW_TEXT_ERROR_TYPE.ERROR_LENGTH, '长度不符'],
  [REVIEW_TEXT_ERROR_TYPE.NOMATCH, '字符不符'],
  [REVIEW_TEXT_ERROR_TYPE.INVALID, '无效字符'],
])

export interface ReviewTextRejectResult {
  errorType: 'invalidEvent' | 'badRequest' | 'valueError'
  errorDefaultText?: string
  invalidKey?: string
  invalidReasonType?: string
  invalidReasonDefaultText?: string
}

/**
 * @param REVIEW_TEXT_ERROR 文本检查错误
 * @param INVALID_EVENT 无效活动
 * @param BAD_REQUEST 非法请求
 * @param ALREADT_EXISTS 作品已经存在
 * @param INVALID_POLICY_NAME 参数policy_name有错
 * @param INVALID_URL 参数url有错
 * @param SERVER_ERROR 服务器出错
 */
export enum ERROR_TYPE {
  REVIEW_TEXT_ERROR = 'review text error',
  INVALID_EVENT = 'invalid event',
  BAD_REQUEST = 'bad request',
  ALREADT_EXISTS = 'already exists',
  INVALID_POLICY_NAME = 'invalid policy name',
  INVALID_URL = 'invalid url',
  SERVER_ERROR = 'internal server error',
}

const responseErrorTextMap = new Map([
  [ERROR_TYPE.INVALID_EVENT, '无效活动'],
  [ERROR_TYPE.BAD_REQUEST, '非法请求'],
  [ERROR_TYPE.ALREADT_EXISTS, '作品已经存在'],
  [ERROR_TYPE.INVALID_POLICY_NAME, '参数policy_name有错'],
  [ERROR_TYPE.INVALID_URL, '参数url有错'],
  [ERROR_TYPE.SERVER_ERROR, '服务器出错'],
])

/**
 * 检测文本信息是否合规
 * @function saveImgToDeviceAlbum
 * @param {string} url 在线图片的url
 * @returns {boolean} 上传是否成功的结果
 */
export const reviewText = (
  event: string,
  reviewObj: Record<string, any>,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/file_picker/get_token',
      content: {
        event,
        text: JSON.stringify(reviewObj),
      },
      handleRes: (res) => {
        console.log('res', res)
        const { code, msg }: { code: 200 | 400; msg: string } = res
        if (code === 200) {
          resolve(true)
        } else {
          if (
            msg.includes(ERROR_TYPE.INVALID_EVENT) ||
            msg.includes(ERROR_TYPE.BAD_REQUEST)
          ) {
            const errorType = msg.includes(ERROR_TYPE.INVALID_EVENT)
              ? ERROR_TYPE.INVALID_EVENT
              : ERROR_TYPE.BAD_REQUEST
            reject(
              new Error(
                JSON.stringify({
                  errorType,
                  errorDefaultText: responseErrorTextMap.get(errorType),
                }),
              ),
            )
          } else if (msg.includes(REVIEW_TEXT_ERROR_TYPE.ILLEGAL)) {
            const illegalKey = msg.split(' ')[1]
            reject(
              JSON.stringify({
                errorType: ERROR_TYPE.REVIEW_TEXT_ERROR,
                invalidKey: illegalKey,
                invalidReasonType: REVIEW_TEXT_ERROR_TYPE.ILLEGAL,
              }),
            )
          } else {
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
          }
        }
      },
    })
  })
}

export interface UploadImgToFilePickerResponse {
  url: string
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
): Promise<UploadImgToFilePickerResponse> => {
  const reqUrl = 'http://devfp.ps.netease.com/test/file/new/'
  const response: UploadImgToFilePickerResponse = await axios.post(
    reqUrl,
    imgData,
    {
      headers: {
        Authorization: filePickerToken,
      },
    },
  )
  console.log(response)
  return {
    url: response.url,
  }
}

/**
 * 上传form(包括已上传至filePicker而获得的file_url)
 * @function uploadWorksDataToServer
 * @param {string} FilePickerUploadResultCode 在线图片的url
 * @returns {boolean} 上传是否成功的结果
 */
export const uploadWorksDataToServer = (
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
      resource: '/account/web/upload_filepicker_result',
      content: {
        result_code: FilePickerUploadResultCode,
        policy_name: policyName,
        text: JSON.stringify(reviewObj),
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
          if (code === 500) {
            reject(new Error(JSON.stringify({})))
          } else if (code === 400) {
            if (responseErrorTextMap.has(msg as ERROR_TYPE)) {
              const errorType = msg as ERROR_TYPE
              reject(
                new Error(
                  JSON.stringify({
                    errorType,
                    errorDefaultText: responseErrorTextMap.get(errorType),
                  }),
                ),
              )
            } else if (msg.includes(REVIEW_TEXT_ERROR_TYPE.ILLEGAL)) {
              const illegalKey = msg.split(' ')[1]
              reject(
                JSON.stringify({
                  errorType: ERROR_TYPE.REVIEW_TEXT_ERROR,
                  invalidKey: illegalKey,
                  invalidReasonType: REVIEW_TEXT_ERROR_TYPE.ILLEGAL,
                }),
              )
            } else {
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
            }
          }
        }
      },
    })
  })
}
