import { EventDayOfDesign01 } from '@/types/activity/dayofdesign01'

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

export const getShareH5PageUrl = (): string => {
  const href = window.location.href
  // 正式环境
  if (href.includes('https://sky.h5.163.com/game/index.html')) {
    return 'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/h5/dayofdesign01.html?'
  }
  // game_dev
  return 'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/h5_dev/dayofdesign01.html?'
}

export interface EventMapConfig {
  statisticsModules: {
    download: string
    share: string
  }
  shareInfo: {
    getTitle: () => string
    getText: (designName: string) => string
    getDesc: (designName: string) => string
  }
}

export const eventMap = new Map<EventDayOfDesign01, EventMapConfig>([
  [
    EventDayOfDesign01.Exhibit,
    {
      statisticsModules: {
        download: 'day_of_design_download',
        share: 'day_of_design_share',
      },
      shareInfo: {
        getTitle: () => '《光·遇》绘梦节',
        getText: (designName: string) =>
          `我推荐这个作品《${designName}》，快来支持你喜欢的作品，助力实装吧！`,
        getDesc: (designName: string) =>
          `我推荐这个作品《${designName}》，快来支持你喜欢的作品，助力实装吧！`,
      },
    },
  ],
])
