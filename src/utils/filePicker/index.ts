import axios from 'axios'
import { getErrorMessage, handlePostMessageToNative } from '../request'
import type { Response } from '@/types'
import { type UploadImgToFilePickerResponse } from './types'

/**
 * 获取file [iOS & Android]
 * @function saveImgToDeviceAlbum
 * @param {string} policyName filePicker策略名
 * @param {string} md5 对待上传图片所计算的md5值
 * @param {string} ping filePicker的ping
 * @param {string} extraInfo filePicker所上传图片要附带的信息
 * @returns {string} 获取到的token
 */
export const getFilePickerToken = (
  policyName: string,
  md5: string = '',
  ping: string = '',
  extraInfo: Record<string, any> = {},
): Promise<{
  token: string
  url: string
}> => {
  return new Promise((resolve, reject) => {
    void handlePostMessageToNative({
      type: 'protocol',
      resource: '/account/web/get_file_picker_token',
      content: {
        method: 'POST',
        policy_name: policyName,
        md5,
        ping,
        extra_info: extraInfo,
      },
      handleRes: (res: Response) => {
        const { code, data, msg } = res
        if (code === 200) {
          const { token, url } = data
          resolve({
            token,
            url,
          })
        } else if (code === 429) {
          const t = data?.cd
          const errorText = `您的操作过于频繁，投稿间隔需要大于${t}小时`
          reject(new Error(errorText))
        } else {
          reject(new Error(getErrorMessage('get_file_picker_token', code, msg)))
        }
      },
    })
  })
}

/**
 * 上传图片至filepicker
 * @function uploadImgToFilePicker
 * @param {string} filePickerToken 服务端获取到的token
 * @param {string} imgData 图片blob数据
 * @param {string} url filepicker地址
 * @returns {boolean} 上传是否成功的结果
 */
export const uploadImgToFilePicker = async (
  filePickerToken: string,
  imgData: Blob,
  url: string,
): Promise<UploadImgToFilePickerResponse | undefined> => {
  try {
    if (!url) throw new Error('未获取到filePicker的上传地址')
    const response = await axios.post(url, imgData, {
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
