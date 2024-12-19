/**
 * @description ngshare分享的渠道枚举
 * @param Weibo 微博
 * @param WE_CHAT 微信
 * @param QQ 腾讯QQ
 * @param Bilibili 哔哩哔哩
 * @param DouYin 抖音
 * @param Facebook Facebook
 * @param DaShen 网易大神
 */

export enum AndroidInstalledPackage {
  Weibo = 'com.sina.weibo',
  Wechat = 'com.tencent.mm',
  QQ = 'com.tencent.mobileqq',
  Bilibili = 'tv.danmaku.bili',
  DouYin = 'com.ss.android.ugc.aweme',
  Facebook = 'com.facebook.katana',
  DaShen = 'com.netease.gl',
  KuaiShou = 'com.smile.gifmaker',
  XiaoHongShu = 'com.xingin.xhs',
}

export enum IosInstalledPackage {
  Weibo = 'sinaweibo://',
  Wechat = 'weixin://',
  QQ = 'mqq://',
  Bilibili = 'bilibili://',
  DouYin = 'snssdk1128://',
  Facebook = 'fb://',
  DaShen = 'neteasegl://',
  KuaiShou = 'gifshow://',
  XiaoHongShu = 'xhsdiscover://',
}

/**
 * @description ngshare分享的渠道类型
 * @param Weibo 微博
 * @param WechatFriend 微信好友
 * @param WechatFriendCircle 微信朋友圈
 * @param QQ QQ好友
 * @param QQZone QQ空间
 * @param Bilibili 哔哩哔哩
 * @param DouYin 抖音
 * @param KuaiShou 快手
 * @param Facebook Facebook
 * @param DaShenFriend 网易大神好友
 * @param DaShenFriendCircle 网易大神圈子分享
 * @param YiXinFriend 易信好友
 * @param YiXinFriendCircle 易信朋友圈
 */
export enum NgshareChannel {
  Weibo = '100',
  WechatFriend = '101',
  WechatFriendCircle = '102',
  QQ = '105',
  QQZone = '106',
  Bilibili = '309',
  DouYin = '302',
  KuaiShou = '303',
  XiaoHongShu = '313',
  Facebook = '108',
  DaShenFriend = '125',
  DaShenFriendCircle = '124',
  YiXinFriend = '103',
  YiXinFriendCircle = '104',
}

/**
 * @description ngshare分享的平台
 * @param Wechat 微信
 * @param Weibo 微博
 * @param QQ 腾讯QQ
 * @param Bilibili 哔哩哔哩
 * @param DouYin 抖音
 * @param DaShen 网易大神
 * @param KuaiShou 快手
 * @param YiXin 易信
 */
export enum NgsharePlatform {
  Wechat = 'Weixin',
  Weibo = 'Weibo',
  QQ = 'QQ',
  Bilibili = 'bilibili',
  DouYin = 'Douyin',
  DaShen = 'Godlike',
  KuaiShou = 'Kuaishou',
  YiXin = 'Yixin',
  XiaoHongShu = 'Xiaohongshu',
}

/**
 * @description ngshare分享内容信息类型
 * @param Image 图片
 * @param Link 链接
 * @param Video 视频
 * @param Text 文本
 * @param Invite 邀请信息
 * @param Audio 音频
 * @param GIF 动图
 * @param Attention 关注
 */
export enum NgshareContentType {
  Image = 'TYPE_IMAGE',
  Link = 'TYPE_LINK',
  Video = 'TYPE_VIDEO',
  Text = 'TYPE_TEXT_ONLY',
  Invite = 'TYPE_INVITE',
  Audio = 'TYPE_AUDIO',
  GIF = 'TYPE_GIF',
  Attention = 'TYPE_ATTENTION',
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
    androidPackage: AndroidInstalledPackage.Weibo,
    iosPackage: IosInstalledPackage.Weibo,
    name: '微博',
  },
  {
    androidPackage: AndroidInstalledPackage.Wechat,
    iosPackage: IosInstalledPackage.Wechat,
    name: '微信',
  },
  {
    androidPackage: AndroidInstalledPackage.QQ,
    iosPackage: IosInstalledPackage.QQ,
    name: 'QQ',
  },
  {
    androidPackage: AndroidInstalledPackage.Bilibili,
    iosPackage: IosInstalledPackage.Bilibili,
    name: '哔哩哔哩',
  },
  {
    androidPackage: AndroidInstalledPackage.DouYin,
    iosPackage: IosInstalledPackage.DouYin,
    name: '抖音',
  },
  {
    androidPackage: AndroidInstalledPackage.KuaiShou,
    iosPackage: IosInstalledPackage.KuaiShou,
    name: '快手',
  },
  {
    androidPackage: AndroidInstalledPackage.Facebook,
    iosPackage: IosInstalledPackage.Facebook,
    name: 'Facebook',
  },
  {
    androidPackage: AndroidInstalledPackage.DaShen,
    iosPackage: IosInstalledPackage.DaShen,
    name: '网易大神',
  },
  {
    androidPackage: AndroidInstalledPackage.XiaoHongShu,
    iosPackage: IosInstalledPackage.XiaoHongShu,
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
    NgshareChannel.WechatFriend,
    {
      platform: NgsharePlatform.Wechat,
      androidInstalledPackage: AndroidInstalledPackage.Wechat,
      iosInstalledPackage: IosInstalledPackage.Wechat,
    },
  ],
  [
    NgshareChannel.WechatFriendCircle,
    {
      platform: NgsharePlatform.Wechat,
      androidInstalledPackage: AndroidInstalledPackage.Wechat,
      iosInstalledPackage: IosInstalledPackage.Wechat,
    },
  ],
  [
    NgshareChannel.Weibo,
    {
      platform: NgsharePlatform.Weibo,
      androidInstalledPackage: AndroidInstalledPackage.Weibo,
      iosInstalledPackage: IosInstalledPackage.Weibo,
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
    NgshareChannel.QQZone,
    {
      platform: NgsharePlatform.QQ,
      androidInstalledPackage: AndroidInstalledPackage.QQ,
      iosInstalledPackage: IosInstalledPackage.QQ,
    },
  ],
  [
    NgshareChannel.Bilibili,
    {
      platform: NgsharePlatform.Bilibili,
      androidInstalledPackage: AndroidInstalledPackage.Bilibili,
      iosInstalledPackage: IosInstalledPackage.Bilibili,
    },
  ],
  [
    NgshareChannel.DouYin,
    {
      platform: NgsharePlatform.DouYin,
      androidInstalledPackage: AndroidInstalledPackage.DouYin,
      iosInstalledPackage: IosInstalledPackage.DouYin,
    },
  ],
  [
    NgshareChannel.XiaoHongShu,
    {
      platform: NgsharePlatform.XiaoHongShu,
      androidInstalledPackage: AndroidInstalledPackage.XiaoHongShu,
      iosInstalledPackage: IosInstalledPackage.XiaoHongShu,
    },
  ],
  [
    NgshareChannel.Facebook,
    {
      platform: '', // 文档没有给值
      androidInstalledPackage: AndroidInstalledPackage.Facebook,
      iosInstalledPackage: IosInstalledPackage.Facebook,
    },
  ],
  [
    NgshareChannel.DaShenFriend,
    {
      platform: NgsharePlatform.DaShen,
      androidInstalledPackage: AndroidInstalledPackage.DaShen,
      iosInstalledPackage: IosInstalledPackage.DaShen,
    },
  ],
  [
    NgshareChannel.DaShenFriendCircle,
    {
      platform: NgsharePlatform.DaShen,
      androidInstalledPackage: AndroidInstalledPackage.DaShen,
      iosInstalledPackage: IosInstalledPackage.DaShen,
    },
  ],
  [
    NgshareChannel.KuaiShou,
    {
      platform: NgsharePlatform.KuaiShou,
      androidInstalledPackage: AndroidInstalledPackage.KuaiShou,
      iosInstalledPackage: IosInstalledPackage.KuaiShou,
    },
  ],
  [
    NgshareChannel.YiXinFriend,
    {
      platform: NgsharePlatform.YiXin,
      androidInstalledPackage: '', // 文档没有给值
      iosInstalledPackage: '', // 文档没有给值
    },
  ],
  [
    NgshareChannel.YiXinFriendCircle,
    {
      platform: NgsharePlatform.YiXin,
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

// 渠道分享平台的排序（不可改，要改需要跟后台配置同步）
export const sharePlatformCodeOrder = [
  'wechat',
  'douyin',
  'bilibili',
  'weibo',
  'dashen',
  'xiaohongshu',
]
