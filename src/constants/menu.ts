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
    label: '巢落大地筑梦共时',
    value: 'activity_season22_start',
    routeName: 'Season22Start',
    isNew: false,
    hasUnclaimedReward: false,
    children: [],
  },
  {
    label: '田月桑时春风雀跃',
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
    label: '予光千缕碧浪万顷',
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
    label: '每日签到',
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
    label: '运动日锦标 赛，开幕！',
    value: 'activitycenter_tournament_of_triumph_1',
    routeName: 'TournamentOfTriumph1',
    isNew: false,
    hasUnclaimedReward: false,
  },
  {
    label: '奖牌收集 挑战赛',
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
    label: '小光快报',
    value: 'activity_center_notice',
    routeName: 'Bulletin',
    isNew: false,
    hasUnclaimedReward: false,
  },
]
