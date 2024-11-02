/**
 * @param REVIEW_TEXT_ERROR 文本检查错误
 */
export enum ERROR_TYPE {
  REVIEW_TEXT_ERROR = 'review text error',
}

/**
 * @description 检测信息合法响应结果
 * @param ILLEGAL 非法文本
 * @param ERROR_LENGTH 长度不符
 * @param NOMATCH 字符不符
 * @param INVALID 无效字符
 */
export const enum REVIEW_TEXT_ERROR_TYPE {
  ILLEGAL = 'illegal',
  ERROR_LENGTH = 'error_length',
  NOMATCH = 'nomatch',
  INVALID = 'invalid',
}

export const reviewTextResponseMap = new Map([
  [REVIEW_TEXT_ERROR_TYPE.ILLEGAL, '非法文本'],
  [REVIEW_TEXT_ERROR_TYPE.ERROR_LENGTH, '长度不符'],
  [REVIEW_TEXT_ERROR_TYPE.NOMATCH, '字符不符'],
  [REVIEW_TEXT_ERROR_TYPE.INVALID, '无效字符'],
])

export interface ReviewTextRejectResult {
  errorType: ERROR_TYPE
  errorDefaultText?: string
  invalidKey?: string
  invalidReasonType?: string
  invalidReasonDefaultText?: string
}

export interface UploadImgToFilePickerResponse {
  url: string
}
