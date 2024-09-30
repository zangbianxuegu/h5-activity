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
export enum INSTALLED_PACKAGE {
  WEI_BO = 'com.sina.weibo',
  WECHAT = 'com.tencent.mm',
  QQ = 'com.tencent.mobileqq',
  BILIBILI = 'tv.danmaku.bili',
  DOU_YIN = 'com.ss.android.ugc.aweme',
  FACEBOOK = 'com.facebook.katana',
  DA_SHEN = 'com.netease.gl',
  KUAI_SHOU = 'com.smile.gifmaker',
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
  { packageId: INSTALLED_PACKAGE.WEI_BO, name: '微博' },
  { packageId: INSTALLED_PACKAGE.WECHAT, name: '微信' },
  { packageId: INSTALLED_PACKAGE.QQ, name: 'QQ' },
  { packageId: INSTALLED_PACKAGE.BILIBILI, name: '哔哩哔哩' },
  { packageId: INSTALLED_PACKAGE.DOU_YIN, name: '抖音' },
  { packageId: INSTALLED_PACKAGE.FACEBOOK, name: 'Facebook' },
  { packageId: INSTALLED_PACKAGE.DA_SHEN, name: '网易大神' },
]

export interface ShareChannelMapInfo {
  platform: NGSHARE_PLATFORM | ''
  installedPackage: INSTALLED_PACKAGE | ''
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
      installedPackage: INSTALLED_PACKAGE.WECHAT,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE,
    {
      platform: NGSHARE_PLATFORM.WECHAT,
      installedPackage: INSTALLED_PACKAGE.WECHAT,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.WEI_BO,
    {
      platform: NGSHARE_PLATFORM.WEI_BO,
      installedPackage: INSTALLED_PACKAGE.WEI_BO,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.QQ,
    {
      platform: NGSHARE_PLATFORM.QQ,
      installedPackage: INSTALLED_PACKAGE.QQ,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.BILIBILI,
    {
      platform: NGSHARE_PLATFORM.BILIBILI,
      installedPackage: INSTALLED_PACKAGE.BILIBILI,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.DOU_YIN,
    {
      platform: NGSHARE_PLATFORM.DOU_YIN,
      installedPackage: INSTALLED_PACKAGE.DOU_YIN,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.FACEBOOK,
    {
      platform: '', // 文档没有给值
      installedPackage: INSTALLED_PACKAGE.FACEBOOK,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND,
    {
      platform: NGSHARE_PLATFORM.DA_SHEN,
      installedPackage: INSTALLED_PACKAGE.DA_SHEN,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND_CIRCLE,
    {
      platform: NGSHARE_PLATFORM.DA_SHEN,
      installedPackage: INSTALLED_PACKAGE.DA_SHEN,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.KUAI_SHOU,
    {
      platform: NGSHARE_PLATFORM.KUAI_SHOU,
      installedPackage: INSTALLED_PACKAGE.KUAI_SHOU,
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.YI_XIN_FRIEND,
    {
      platform: NGSHARE_PLATFORM.YI_XIN,
      installedPackage: '', // 文档没有给值
    },
  ],
  [
    NGSHARE_SHARE_CHANNEL.YI_XIN_FRIEND_CIRCLE,
    {
      platform: NGSHARE_PLATFORM.YI_XIN,
      installedPackage: '', // 文档没有给值
    },
  ],
])
