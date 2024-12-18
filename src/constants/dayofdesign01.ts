/**
 * @description filePicker默认的policy_name
 */
export const FILE_PICKER_POLICY_NAME = 'dayofdesign01_post_huimeng'
export const FILE_PICKER_POLICY_NAME_SHARE_IMG = 'dayofdesign01_post_passed'
export const FILE_PICKER_SHARE_IMG_POLICY_NAME = 'dayofdesign01_share'

export const groupNameAndCodeMap = new Map([
  ['X', '星'],
  ['G', '光'],
  ['Y', '遇'],
  ['M', '梦'],
])

export const SHARE_INFO = {
  title: '《光·遇》绘梦节标题',
  text: '《光·遇》绘梦节文本',
  desc: '《光·遇》绘梦节描述', // 微博用到这个
}

export const getShareH5PageUrl = (): string => {
  const href = window.location.href
  // 正式环境
  if (href.includes('https://sky.h5.163.com/game/index.html')) {
    return 'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/h5/dayofdesign01.html?'
  }
  // game_dev
  return 'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/h5_dev/dayofdesign01.html?'
}
