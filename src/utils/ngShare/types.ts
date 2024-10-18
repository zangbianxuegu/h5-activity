/**
 * @description ngshare分享的渠道枚举
 * @param WEI_BO 微博
 * @param WE_CHAT 微信
 * @param QQ 腾讯QQ
 * @param BILIBILI 哔哩哔哩
 * @param DOU_YIN 抖音
 * @param FACEBOOK Facebook
 * @param DA_SHEN 网易大神
 */
export enum ANDROID_INSTALLED_PACKAGE {
  WEI_BO = 'com.sina.weibo',
  WECHAT = 'com.tencent.mm',
  QQ = 'com.tencent.mobileqq',
  BILIBILI = 'tv.danmaku.bili',
  DOU_YIN = 'com.ss.android.ugc.aweme',
  FACEBOOK = 'com.facebook.katana',
  DA_SHEN = 'com.netease.gl',
  KUAI_SHOU = 'com.smile.gifmaker',
  XIAO_HONG_SHU = 'com.xingin.xhs',
}

export enum IOS_INSTALLED_PACKAGE {
  WEI_BO = 'sinaweibo://',
  WECHAT = 'weixin://',
  QQ = 'mqq://',
  BILIBILI = 'bilibili://',
  DOU_YIN = 'snssdk1128://',
  FACEBOOK = 'fb://',
  DA_SHEN = 'neteasegl://',
  KUAI_SHOU = 'gifshow://',
  XIAO_HONG_SHU = 'xhsdiscover://',
}

/**
 * @description ngshare分享的渠道类型
 * @param WEI_BO 微博
 * @param WECHAT_FRIEND 微信好友
 * @param WECHAT_FRIEND_CIRCLE 微信朋友圈
 * @param QQ QQ好友
 * @param QQ_ZONE QQ空间
 * @param BILIBILI 哔哩哔哩
 * @param DOU_YIN 抖音
 * @param KUAI_SHOU 快手
 * @param FACEBOOK Facebook
 * @param DA_SHEN_FRIEND 网易大神好友
 * @param DA_SHEN_FRIEND_CIRCLE 网易大神圈子分享
 * @param YI_XIN_FRIEND 易信好友
 * @param YI_XIN_FRIEND_CIRCLE 易信朋友圈
 */
export enum NGSHARE_SHARE_CHANNEL {
  WEI_BO = '100',
  WECHAT_FRIEND = '101',
  WECHAT_FRIEND_CIRCLE = '102',
  QQ = '105',
  QQ_ZONE = '106',
  BILIBILI = '309',
  DOU_YIN = '302',
  KUAI_SHOU = '303',
  XIAO_HONG_SHU = '313',
  FACEBOOK = '108',
  DA_SHEN_FRIEND = '125',
  DA_SHEN_FRIEND_CIRCLE = '124',
  YI_XIN_FRIEND = '103',
  YI_XIN_FRIEND_CIRCLE = '104',
}

/**
 * @description ngshare分享的平台
 * @param WECHAT 微信
 * @param WEI_BO 微博
 * @param QQ 腾讯QQ
 * @param BILIBILI 哔哩哔哩
 * @param DOU_YIN 抖音
 * @param DA_SHEN 网易大神
 * @param KUAI_SHOU 快手
 * @param YI_XIN 易信
 */
export enum NGSHARE_PLATFORM {
  WECHAT = 'Weixin',
  WEI_BO = 'Weibo',
  QQ = 'QQ',
  BILIBILI = 'bilibili',
  DOU_YIN = 'Douyin',
  DA_SHEN = 'Godlike',
  KUAI_SHOU = 'Kuaishou',
  YI_XIN = 'Yixin',
  XIAO_HONG_SHU = 'Xiaohongshu',
}

/**
 * @description ngshare分享内容信息类型
 * @param IMAGE 图片
 * @param LINK 链接
 * @param VIDEO 视频
 * @param TEXT 文本
 * @param INVITE 邀请信息
 * @param AUDIO 音频
 * @param GIF 动图
 * @param ATTENTION 关注
 */
export enum NGSHARE_CONTENT_TYPE {
  IMAGE = 'TYPE_IMAGE',
  LINK = 'TYPE_LINK',
  VIDEO = 'TYPE_VIDEO',
  TEXT = 'TYPE_TEXT_ONLY',
  INVITE = 'TYPE_INVITE',
  AUDIO = 'TYPE_AUDIO',
  GIF = 'TYPE_GIF',
  ATTENTION = 'TYPE_ATTENTION',
}

export const installedPackageList = [
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.WEI_BO,
    iosPackage: IOS_INSTALLED_PACKAGE.WEI_BO,
    name: '微博',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.WECHAT,
    iosPackage: IOS_INSTALLED_PACKAGE.WECHAT,
    name: '微信',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.QQ,
    iosPackage: IOS_INSTALLED_PACKAGE.QQ,
    name: 'QQ',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.BILIBILI,
    iosPackage: IOS_INSTALLED_PACKAGE.BILIBILI,
    name: '哔哩哔哩',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.DOU_YIN,
    iosPackage: IOS_INSTALLED_PACKAGE.DOU_YIN,
    name: '抖音',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.KUAI_SHOU,
    iosPackage: IOS_INSTALLED_PACKAGE.KUAI_SHOU,
    name: '快手',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.FACEBOOK,
    iosPackage: IOS_INSTALLED_PACKAGE.FACEBOOK,
    name: 'Facebook',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.DA_SHEN,
    iosPackage: IOS_INSTALLED_PACKAGE.DA_SHEN,
    name: '网易大神',
  },
  {
    androidPackage: ANDROID_INSTALLED_PACKAGE.XIAO_HONG_SHU,
    iosPackage: IOS_INSTALLED_PACKAGE.XIAO_HONG_SHU,
    name: '小红书',
  },
]

export interface ShareChannelMapInfo {
  platform: NGSHARE_PLATFORM | ''
  androidInstalledPackage: ANDROID_INSTALLED_PACKAGE | ''
  iosInstalledPackage: IOS_INSTALLED_PACKAGE | ''
}

/**
 * @description ngshare分享渠道和平台的映射关系
 */
export const ngshareShareChannelMap = new Map<
  NGSHARE_SHARE_CHANNEL,
  ShareChannelMapInfo
>([
  [
    NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND,
    {
      platform: NGSHARE_PLATFORM.WECHAT,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.WECHAT,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.WECHAT,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE,
    {
      platform: NGSHARE_PLATFORM.WECHAT,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.WECHAT,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.WECHAT,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.WEI_BO,
    {
      platform: NGSHARE_PLATFORM.WEI_BO,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.WEI_BO,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.WEI_BO,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.QQ,
    {
      platform: NGSHARE_PLATFORM.QQ,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.QQ,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.QQ,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.QQ_ZONE,
    {
      platform: NGSHARE_PLATFORM.QQ,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.QQ,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.QQ,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.BILIBILI,
    {
      platform: NGSHARE_PLATFORM.BILIBILI,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.BILIBILI,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.BILIBILI,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.DOU_YIN,
    {
      platform: NGSHARE_PLATFORM.DOU_YIN,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.DOU_YIN,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.DOU_YIN,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.XIAO_HONG_SHU,
    {
      platform: NGSHARE_PLATFORM.XIAO_HONG_SHU,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.XIAO_HONG_SHU,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.XIAO_HONG_SHU,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.FACEBOOK,
    {
      platform: '', // 文档没有给值
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.FACEBOOK,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.FACEBOOK,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND,
    {
      platform: NGSHARE_PLATFORM.DA_SHEN,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.DA_SHEN,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.DA_SHEN,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND_CIRCLE,
    {
      platform: NGSHARE_PLATFORM.DA_SHEN,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.DA_SHEN,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.DA_SHEN,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.KUAI_SHOU,
    {
      platform: NGSHARE_PLATFORM.KUAI_SHOU,
      androidInstalledPackage: ANDROID_INSTALLED_PACKAGE.KUAI_SHOU,
      iosInstalledPackage: IOS_INSTALLED_PACKAGE.KUAI_SHOU,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.YI_XIN_FRIEND,
    {
      platform: NGSHARE_PLATFORM.YI_XIN,
      androidInstalledPackage: '', // 文档没有给值
      iosInstalledPackage: '', // 文档没有给值
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.YI_XIN_FRIEND_CIRCLE,
    {
      platform: NGSHARE_PLATFORM.YI_XIN,
      androidInstalledPackage: '', // 文档没有给值
      iosInstalledPackage: '', // 文档没有给值
    },
  ],
])

/**
 * @description ngshare检测渠道是否存在的配置
 * @param methodId android使用hasPackageInstalled，ios使用hasAppInstalled
 * @param appId android传这个参数
 * @param urlScheme ios传这个参数
 */
export interface NgshareCheckChannelIsExistToNativeConfig {
  methodId: string
  reqData: {
    methodId: string
    callback_mode: string
    appId?: string
    urlScheme?: string
  }
  callback: {
    nativeCallback: (respJSONString: string) => void
  }
}
