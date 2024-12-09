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

export enum AndroidInstalledPackage {
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

export enum IosInstalledPackage {
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
export enum NgshareChannel {
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
export enum NgsharePlatform {
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
export enum NgshareContentType {
  IMAGE = 'TYPE_IMAGE',
  LINK = 'TYPE_LINK',
  VIDEO = 'TYPE_VIDEO',
  TEXT = 'TYPE_TEXT_ONLY',
  INVITE = 'TYPE_INVITE',
  AUDIO = 'TYPE_AUDIO',
  GIF = 'TYPE_GIF',
  ATTENTION = 'TYPE_ATTENTION',
}

/**
 * @description ngshare分享链接的参数
 * @param title 标题
 * @param text 内容
 * @param link 链接
 * @param desc 描述
 * @param u3dshareThumb 分享缩略图地址(安卓必传)
 * @param shareThumb 分享缩略图地址(iOS传入，待后续支持u3dshareThumb)
 * @param [keyof: string]: any 其他参数
 */
export interface NgshareShareLinkConfig {
  title: string
  text: string
  link: string
  desc: string
  u3dshareThumb: string
  shareThumb: string
  [keyof: string]: any
}

/**
 * @description ngshare分享链接的参数
 * @param title 标题
 * @param text 内容
 * @param image 图片地址
 * @param [keyof: string]: any 其他参数
 */
export interface NgshareShareImageConfig {
  title: string
  text: string
  image: string
  [keyof: string]: any
}

export const installedPackageList = [
  {
    androidPackage: AndroidInstalledPackage.WEI_BO,
    iosPackage: IosInstalledPackage.WEI_BO,
    name: '微博',
  },
  {
    androidPackage: AndroidInstalledPackage.WECHAT,
    iosPackage: IosInstalledPackage.WECHAT,
    name: '微信',
  },
  {
    androidPackage: AndroidInstalledPackage.QQ,
    iosPackage: IosInstalledPackage.QQ,
    name: 'QQ',
  },
  {
    androidPackage: AndroidInstalledPackage.BILIBILI,
    iosPackage: IosInstalledPackage.BILIBILI,
    name: '哔哩哔哩',
  },
  {
    androidPackage: AndroidInstalledPackage.DOU_YIN,
    iosPackage: IosInstalledPackage.DOU_YIN,
    name: '抖音',
  },
  {
    androidPackage: AndroidInstalledPackage.KUAI_SHOU,
    iosPackage: IosInstalledPackage.KUAI_SHOU,
    name: '快手',
  },
  {
    androidPackage: AndroidInstalledPackage.FACEBOOK,
    iosPackage: IosInstalledPackage.FACEBOOK,
    name: 'Facebook',
  },
  {
    androidPackage: AndroidInstalledPackage.DA_SHEN,
    iosPackage: IosInstalledPackage.DA_SHEN,
    name: '网易大神',
  },
  {
    androidPackage: AndroidInstalledPackage.XIAO_HONG_SHU,
    iosPackage: IosInstalledPackage.XIAO_HONG_SHU,
    name: '小红书',
  },
]

export interface ShareChannelMapInfo {
  platform: NgsharePlatform | ''
  androidInstalledPackage: AndroidInstalledPackage | ''
  iosInstalledPackage: IosInstalledPackage | ''
}

/**
 * @description ngshare分享渠道和平台的映射关系
 */
export const ngshareShareChannelMap = new Map<
  NgshareChannel,
  ShareChannelMapInfo
>([
  [
    NgshareChannel.WECHAT_FRIEND,
    {
      platform: NgsharePlatform.WECHAT,
      androidInstalledPackage: AndroidInstalledPackage.WECHAT,
      iosInstalledPackage: IosInstalledPackage.WECHAT,
    },
  ],
  [
    NgshareChannel.WECHAT_FRIEND_CIRCLE,
    {
      platform: NgsharePlatform.WECHAT,
      androidInstalledPackage: AndroidInstalledPackage.WECHAT,
      iosInstalledPackage: IosInstalledPackage.WECHAT,
    },
  ],
  [
    NgshareChannel.WEI_BO,
    {
      platform: NgsharePlatform.WEI_BO,
      androidInstalledPackage: AndroidInstalledPackage.WEI_BO,
      iosInstalledPackage: IosInstalledPackage.WEI_BO,
    },
  ],
  [
    NgshareChannel.QQ,
    {
      platform: NgsharePlatform.QQ,
      androidInstalledPackage: AndroidInstalledPackage.QQ,
      iosInstalledPackage: IosInstalledPackage.QQ,
    },
  ],
  [
    NgshareChannel.QQ_ZONE,
    {
      platform: NgsharePlatform.QQ,
      androidInstalledPackage: AndroidInstalledPackage.QQ,
      iosInstalledPackage: IosInstalledPackage.QQ,
    },
  ],
  [
    NgshareChannel.BILIBILI,
    {
      platform: NgsharePlatform.BILIBILI,
      androidInstalledPackage: AndroidInstalledPackage.BILIBILI,
      iosInstalledPackage: IosInstalledPackage.BILIBILI,
    },
  ],
  [
    NgshareChannel.DOU_YIN,
    {
      platform: NgsharePlatform.DOU_YIN,
      androidInstalledPackage: AndroidInstalledPackage.DOU_YIN,
      iosInstalledPackage: IosInstalledPackage.DOU_YIN,
    },
  ],
  [
    NgshareChannel.XIAO_HONG_SHU,
    {
      platform: NgsharePlatform.XIAO_HONG_SHU,
      androidInstalledPackage: AndroidInstalledPackage.XIAO_HONG_SHU,
      iosInstalledPackage: IosInstalledPackage.XIAO_HONG_SHU,
    },
  ],
  [
    NgshareChannel.FACEBOOK,
    {
      platform: '', // 文档没有给值
      androidInstalledPackage: AndroidInstalledPackage.FACEBOOK,
      iosInstalledPackage: IosInstalledPackage.FACEBOOK,
    },
  ],
  [
    NgshareChannel.DA_SHEN_FRIEND,
    {
      platform: NgsharePlatform.DA_SHEN,
      androidInstalledPackage: AndroidInstalledPackage.DA_SHEN,
      iosInstalledPackage: IosInstalledPackage.DA_SHEN,
    },
  ],
  [
    NgshareChannel.DA_SHEN_FRIEND_CIRCLE,
    {
      platform: NgsharePlatform.DA_SHEN,
      androidInstalledPackage: AndroidInstalledPackage.DA_SHEN,
      iosInstalledPackage: IosInstalledPackage.DA_SHEN,
    },
  ],
  [
    NgshareChannel.KUAI_SHOU,
    {
      platform: NgsharePlatform.KUAI_SHOU,
      androidInstalledPackage: AndroidInstalledPackage.KUAI_SHOU,
      iosInstalledPackage: IosInstalledPackage.KUAI_SHOU,
    },
  ],
  [
    NgshareChannel.YI_XIN_FRIEND,
    {
      platform: NgsharePlatform.YI_XIN,
      androidInstalledPackage: '', // 文档没有给值
      iosInstalledPackage: '', // 文档没有给值
    },
  ],
  [
    NgshareChannel.YI_XIN_FRIEND_CIRCLE,
    {
      platform: NgsharePlatform.YI_XIN,
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
