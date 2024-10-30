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
  BAD_REQUEST = 'bad request',
  ALREADT_EXISTS = 'already exists',
  INVALID_POLICY_NAME = 'invalid policy name',
  INVALID_URL = 'invalid url',
  SERVER_ERROR = 'internal server error',
}

export const responseErrorTextMap = new Map([
  [ERROR_TYPE.BAD_REQUEST, '非法请求'],
  [ERROR_TYPE.ALREADT_EXISTS, '作品已经存在'],
  [ERROR_TYPE.INVALID_POLICY_NAME, '参数policy_name有错'],
  [ERROR_TYPE.INVALID_URL, '参数url有错'],
  [ERROR_TYPE.SERVER_ERROR, '服务器出错'],
])

export interface UploadImgToFilePickerResponse {
  url: string
}
