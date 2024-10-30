// MA75的filePicker存储地址(测试)
export const SKY_FILE_PICKER_URL_TEST =
  'https://devfp.ps.netease.com/ma75/file/new/'
// MA75的filePicker存储地址(正式)
export const SKY_FILE_PICKER_URL_PRODUCTION =
  'https://fp.ps.netease.com/ma75/file/new/'

export const getSkyFilePicker = (): string => {
  return location.href.includes('https://sky.h5.163.com/game/')
    ? SKY_FILE_PICKER_URL_PRODUCTION
    : SKY_FILE_PICKER_URL_TEST
}
