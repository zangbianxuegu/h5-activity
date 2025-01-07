import type { MenuItem } from '@/types'

/**
 * MENU_ITEMS: 菜单初始值
 * ! 多层结构会进行修改
 * ! 回流菜单定义会修改 has_unclaimed_reward
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    label: '剪刀石头布！',
    value: 'activity_childrens_day_2024',
    routeName: 'ChildrensDay2024',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '巢落大地 筑梦共时',
    value: 'activity_season22_start',
    routeName: 'Season22Start',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '田月桑时 春风雀跃',
    value: 'activity_sign_mayday_2024',
    routeName: 'SignMayday2024',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '大耳狗茶话会',
    value: 'activity_sanrio_2024',
    routeName: 'Sanrio2024',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '予光千缕 碧浪万顷',
    value: 'activity_nature_2024',
    routeName: 'Nature2024',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '假日打卡',
    value: 'activity_sign_in_1',
    routeName: 'Holiday',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '签到活动',
    value: 'signin',
    routeName: 'Signin',
    isNew: false,
    hasUnclaimedReward: false,
    children: [
      {
        label: '冬季签到',
        value: 'activity_sign_in_2',
        routeName: 'Winter',
        isNew: false,
        hasUnclaimedReward: false,
      },
      {
        label: '暑假签到',
        value: 'activity_sign_in_3',
        routeName: 'Summer',
        isNew: false,
        hasUnclaimedReward: false,
      },
    ],
  },
  {
    label: '击鼓行舟 粽香十里',
    value: 'activity_dragonboat_2024',
    routeName: 'DragonBoat2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '天空王国 回归指南',
    value: 'return_buff',
    routeName: 'ReturnBuff',
    isNew: false,
    hasUnclaimedReward: false,
    children: [
      {
        label: '重逢',
        value: 'return_buff_reunion',
        routeName: 'Reunion',
        isNew: false,
        hasUnclaimedReward: false,
      },
      {
        label: '启程',
        value: 'return_buff_setout',
        routeName: 'Setout',
        isNew: false,
        hasUnclaimedReward: false,
      },
      {
        label: '同行',
        value: 'return_buff_together',
        routeName: 'Together',
        isNew: false,
        hasUnclaimedReward: false,
      },
    ],
  },
  {
    label: '欢聚周年 畅享派对',
    value: 'activitycenter_poster_anniversary_2024',
    routeName: 'PosterAnniversary2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '成为派对 新星吧！',
    value: 'activity_anniversary_warmup_2024',
    routeName: 'AnniversaryWarmup2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '闲适安居 筑巢小憩',
    value: 'activity_season22_sprint',
    routeName: 'Season22Sprint',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '巡光嘉年华',
    value: 'activitycenter_anniversary_visit_2024',
    routeName: 'AnniversaryVisit2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '成为星星 收藏家',
    value: 'activitycenter_anniversary_server_2024',
    routeName: 'AnniversaryServer2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '嘉年华商店',
    value: 'activitycenter_anniversary_store_2024',
    routeName: 'AnniversaryStore2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '向友葵的 成长日记',
    value: 'activitycenter_main_friendship_2024',
    routeName: 'FriendshipMain2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每周惊喜',
    value: 'activitycenter_week1_friendship_2024', // 第1周
    routeName: 'FriendshipWeek2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每周惊喜',
    value: 'activitycenter_week2_friendship_2024', // 第2周
    routeName: 'FriendshipWeek2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每周惊喜',
    value: 'activitycenter_week3_friendship_2024', // 第3周
    routeName: 'FriendshipWeek2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每周惊喜',
    value: 'activitycenter_week4_friendship_2024', // 第4周
    routeName: 'FriendshipWeek2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每周惊喜',
    value: 'activitycenter_week5_friendship_2024', // 第5周
    routeName: 'FriendshipWeek2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每周惊喜',
    value: 'activitycenter_week6_friendship_2024', // 第6周
    routeName: 'FriendshipWeek2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '每日礼物',
    value: 'activitycenter_sign_friendship_2024',
    routeName: 'FriendshipSign2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '养分补给',
    value: 'activitycenter_store_friendship_2024',
    routeName: 'FriendshipStore2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '有友共享',
    value: 'activitycenter_poster_friendship_2024',
    routeName: 'FriendshipPoster2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '运动会锦标 赛，开幕！',
    value: 'activitycenter_tournament_of_triumph_1',
    routeName: 'TournamentOfTriumph1',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '奖牌收藏 挑战赛',
    value: 'activitycenter_tournament_of_triumph_2',
    routeName: 'TournamentOfTriumph2',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '心火相传 辉煌落幕',
    value: 'activitycenter_tournament_of_triumph_3',
    routeName: 'TournamentOfTriumph3',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '多彩汇云间',
    value: 'activitycenter_rainbow2_2024',
    routeName: 'Rainbow22024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '绮丽绘梦时',
    value: 'activitycenter_rainbow1_2024',
    routeName: 'Rainbow12024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '求签乞巧 鹊桥相会',
    value: 'activitycenter_qixi_2024',
    routeName: 'Qixi2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '谐音和鸣 谱写新章',
    value: 'activitycenter_season23_start',
    routeName: 'Season23Start',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '二重奏季 期待相遇',
    value: 'activitycenter_season23_reserve',
    routeName: 'Season23Reserve',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '悠长假日 拾光小憩',
    value: 'activitycenter_nationalday1_2024',
    routeName: 'Nationalday12024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '弦音协奏 携手谢幕',
    value: 'activitycenter_season23_sprint',
    routeName: 'Season23Sprint',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '清凉夏末 魔法相赠',
    value: 'activitycenter_summerday_2024',
    routeName: 'Summerday2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '姆明季 期待相遇',
    value: 'activitycenter_season24_reserve',
    routeName: 'Season24Reserve',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '因光而遇 因遇而喜',
    value: 'activitycenter_dice_map',
    routeName: 'DiceMap',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '光遇见喜',
    value: 'activitycenter_dice_mission',
    routeName: 'DiceMission',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '喜遇商店',
    value: 'activitycenter_dice_store',
    routeName: 'DiceStore',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '因为被爱 所以看见',
    value: 'activitycenter_season24_start',
    routeName: 'Season24Start',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '不给糖果 就捣蛋！',
    value: 'activitycenter_Halloweentask_2024',
    routeName: 'HalloweenTask2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '惊吓？惊喜！ 出奇寻宝',
    value: 'activitycenter_Halloweentreasure_2024',
    routeName: 'Halloweentreasure2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '魔法坩埚 惊喜无限',
    value: 'activitycenter_Halloweenpass_2024',
    routeName: 'Halloweenpass2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '魔法畅享',
    value: 'activitycenter_double_eleven_2024_1',
    routeName: 'DoubleEleven2024_1',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '遇见惊喜',
    value: 'activitycenter_double_eleven_2024_2',
    routeName: 'DoubleEleven2024_2',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '中国绊爱 与光重逢',
    value: 'activitycenter_kizuna_china_2024',
    routeName: 'KizunaChina2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '追随钟声 即刻启程',
    value: 'activitycenter_netease_werewolf',
    routeName: 'NeteaseWerewolf',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '冥龙，在 我们之中',
    value: 'activitycenter_netease_werewolf_join',
    routeName: 'NeteaseWerewolfJoin',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '绘梦节',
    value: 'activitycenter_dayofdesign01_post_main',
    routeName: 'DayOfDesign01PostMain',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '我要投稿',
    value: 'activitycenter_dayofdesign01_post_submit',
    routeName: 'DayOfDesign01PostSubmit',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '活动会场',
    value: 'activitycenter_dayofdesign01_post_exhibit',
    routeName: 'DayOfDesign01PostExhibit',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '中场休息',
    value: 'activitycenter_dayofdesign01_postfinish_rest',
    routeName: 'Dayofdesign01PostfinishRest',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '小光快报',
    value: 'activity_center_notice',
    routeName: 'Bulletin',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '落入奇遇 茶会',
    value: 'activitycenter_doubledan_2024_2',
    routeName: 'Doubledan2024_2',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '与爱同行 温暖相拥',
    value: 'activitycenter_season24_sprint',
    routeName: 'Season24Sprint',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '温暖冬日 翻开惊喜',
    value: 'activitycenter_doubledan_2024_1',
    routeName: 'Doubledan2024_1',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '创造！冰雪 大世界！',
    value: 'activitycenter_icefestival2025',
    routeName: 'Icefestival2025',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '曲意畅想 谱写乐章',
    value: 'activitycenter_music_2024',
    routeName: 'Music2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '彩染季 期待相遇',
    value: 'activitycenter_season_25_reserve',
    routeName: 'Season25Reserve',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '光遇云音 心随律动',
    value: 'activitycenter_cloud_music_2024',
    routeName: 'CloudMusic2024',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '姆明谷的 身份大揭秘',
    value: 'activitycenter_moomin_test_god',
    routeName: 'MoominTestGod',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '共沐温暖 不期而遇',
    value: 'activitycenter_invitation_code',
    routeName: 'InvitationCode',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '在更广阔天空相遇',
    value: 'activitycenter_pc_celebration',
    routeName: 'PcCelebration',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '灵蛇献瑞 喜迎春来',
    value: 'activitycenter_winter_main_2025',
    routeName: 'WinterMain2025',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '寻颜觅彩焕新裳',
    value: 'activitycenter_season25_start',
    routeName: 'Season25Start',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: 'iframe 外部链接-情人节活动',
    value: 'activitycenter_daysoflove_2025',
    routeName: 'Daysoflove2025',
    isNew: false,
    hasUnclaimedReward: false,
  },
]
