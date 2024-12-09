/**
 * @description MA75的filePicker存储地址(测试)
 */
export const SKY_FILE_PICKER_URL_TEST =
  'https://devfp.ps.netease.com/ma75/file/new/'

/**
 * @description MA75的filePicker存储地址(正式)
 */
export const SKY_FILE_PICKER_URL_PRODUCTION =
  'https://fp.ps.netease.com/ma75/file/new/'

/**
 * @description 获取filePicker的地址（根据部署环境）
 */
export const getSkyFilePicker = (): string => {
  return location.href.includes('https://sky.h5.163.com/game/')
    ? SKY_FILE_PICKER_URL_PRODUCTION
    : SKY_FILE_PICKER_URL_TEST
}

/**
 * @description filePicker默认的policy_name
 */
export const DEFAULT_FILE_PICKER_POLICY_NAME = 'image_normal'
