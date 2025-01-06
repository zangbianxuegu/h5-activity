import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home'),
    // redirect: '/season22-start',
  },
  {
    path: '/season22-start',
    name: 'Season22Start',
    component: () => import('@/views/Season22Start'),
    meta: {
      title: '巢落大地筑梦共时',
      module: 'activity_season22_start',
    },
  },
  {
    path: '/holiday',
    name: 'Holiday',
    component: () => import('@/views/Holiday'),
    meta: {
      title: '假日打卡',
      module: 'activity_sign_in_1',
    },
  },
  {
    path: '/signin',
    name: 'Signin',
    redirect: '/signin/winter',
    component: () => import('@/views/Signin'),
    meta: {
      title: '签到活动',
      module: 'signin',
    },
    children: [
      {
        path: 'winter',
        name: 'Winter',
        component: () => import('@/views/Signin/Winter'),
        meta: {
          title: '冬季签到',
          module: 'activity_sign_in_2',
        },
      },
      {
        path: 'summer',
        name: 'Summer',
        component: () => import('@/views/Signin/Summer'),
        meta: {
          title: '暑假签到',
          module: 'activity_sign_in_3',
        },
      },
    ],
  },
  {
    path: '/return-buff',
    name: 'ReturnBuff',
    redirect: '/return-buff/reunion',
    component: () => import('@/views/ReturnBuff'),
    meta: {
      title: '天空王国回归指南',
      module: 'return_buff',
    },
    children: [
      {
        path: 'reunion',
        name: 'Reunion',
        component: () => import('@/views/ReturnBuff/Reunion'),
        meta: {
          title: '重逢',
          module: 'return_buff_reunion',
        },
      },
      {
        path: 'setout',
        name: 'Setout',
        component: () => import('@/views/ReturnBuff/Setout'),
        meta: {
          title: '启程',
          module: 'return_buff_setout',
        },
      },
      {
        path: 'together',
        name: 'Together',
        component: () => import('@/views/ReturnBuff/Together'),
        meta: {
          title: '同行',
          module: 'return_buff_together',
        },
      },
    ],
  },
  {
    path: '/sign-mayday-2024',
    name: 'SignMayday2024',
    component: () => import('@/views/SignMayday2024'),
    meta: {
      title: '田月桑时春风雀跃',
      module: 'activity_sign_mayday_2024',
    },
  },
  {
    path: '/sanrio-2024',
    name: 'Sanrio2024',
    component: () => import('@/views/Sanrio2024'),
    meta: {
      title: '大耳狗茶话会',
      module: 'activity_sanrio_2024',
    },
  },
  {
    path: '/nature-2024',
    name: 'Nature2024',
    component: () => import('@/views/Nature2024'),
    meta: {
      title: '予光千缕碧浪万顷',
      module: 'activity_nature_2024',
    },
  },
  {
    path: '/childrens-day-2024',
    name: 'ChildrensDay2024',
    component: () => import('@/views/ChildrensDay2024'),
    meta: {
      title: '剪刀石头布！',
      module: 'activity_childrens_day_2024',
    },
  },
  {
    path: '/dragonboat-2024',
    name: 'DragonBoat2024',
    component: () => import('@/views/DragonBoat2024'),
    meta: {
      title: '击鼓行舟 粽香十里',
      module: 'activity_dragonboat_2024',
    },
  },
  {
    path: '/poster-anniversary-2024',
    name: 'PosterAnniversary2024',
    component: () => import('@/views/PosterAnniversary2024'),
    meta: {
      title: '欢聚周年 畅享派对',
      module: 'activitycenter_poster_anniversary_2024',
    },
  },
  {
    path: '/anniversary-warmup-2024',
    name: 'AnniversaryWarmup2024',
    component: () => import('@/views/AnniversaryWarmup2024'),
    meta: {
      title: '成为派对新星吧',
      module: 'activity_anniversary_warmup_2024',
    },
  },
  {
    path: '/bulletin',
    name: 'Bulletin',
    component: () => import('@/views/Bulletin'),
    meta: {
      title: '小光快报',
      module: 'activity_center_notice',
    },
  },
  {
    path: '/season22-sprint',
    name: 'Season22Sprint',
    component: () => import('@/views/Season22Sprint'),
    meta: {
      title: '闲适安居 筑巢小憩',
      module: 'activity_season22_sprint',
    },
  },
  {
    path: '/anniversary-visit-2024',
    name: 'AnniversaryVisit2024',
    component: () => import('@/views/AnniversaryVisit2024'),
    meta: {
      title: '巡光嘉年华',
      module: 'activitycenter_anniversary_visit_2024',
    },
  },
  {
    path: '/anniversary-server-2024',
    name: 'AnniversaryServer2024',
    component: () => import('@/views/AnniversaryServer2024'),
    meta: {
      title: '成为星星收藏家',
      module: 'activitycenter_anniversary_server_2024',
    },
  },
  {
    path: '/anniversary-store-2024',
    name: 'AnniversaryStore2024',
    component: () => import('@/views/AnniversaryStore2024'),
    meta: {
      title: '嘉年华商店',
      module: 'activitycenter_anniversary_store_2024',
    },
  },
  {
    path: '/friendship-main-2024',
    name: 'FriendshipMain2024',
    component: () => import('@/views/FriendshipMain2024'),
    meta: {
      title: '向友葵的成长日记',
      module: 'activitycenter_main_friendship_2024',
    },
  },
  {
    path: '/friendship-week-2024',
    name: 'FriendshipWeek2024',
    component: () => import('@/views/FriendshipWeek2024'),
    meta: {
      title: '每周惊喜',
      module: 'activitycenter_week_friendship_2024', // 此处 module 需要动态修改
    },
  },
  {
    path: '/friendship-sign-2024',
    name: 'FriendshipSign2024',
    component: () => import('@/views/FriendshipSign2024'),
    meta: {
      title: '每日礼物',
      module: 'activitycenter_sign_friendship_2024',
    },
  },
  {
    path: '/friendship-store-2024',
    name: 'FriendshipStore2024',
    component: () => import('@/views/FriendshipStore2024'),
    meta: {
      title: '养分补给',
      module: 'activitycenter_store_friendship_2024',
    },
  },
  {
    path: '/friendship-poster-2024',
    name: 'FriendshipPoster2024',
    component: () => import('@/views/FriendshipPoster2024'),
    meta: {
      title: '有友共享',
      module: 'activitycenter_poster_friendship_2024',
    },
  },
  {
    path: '/tournament-of-triumph-1',
    name: 'TournamentOfTriumph1',
    component: () => import('@/views/TournamentOfTriumph1'),
    meta: {
      title: '运动会锦标赛，开幕！',
      module: 'activitycenter_tournament_of_triumph_1',
    },
  },
  {
    path: '/tournament-of-triumph-2',
    name: 'TournamentOfTriumph2',
    component: () => import('@/views/TournamentOfTriumph2'),
    meta: {
      title: '奖牌收藏挑战赛',
      module: 'activitycenter_tournament_of_triumph_2',
    },
  },
  {
    path: '/tournament-of-triumph-3',
    name: 'TournamentOfTriumph3',
    component: () => import('@/views/TournamentOfTriumph3'),
    meta: {
      title: '心火相传辉煌落幕',
      module: 'activitycenter_tournament_of_triumph_3',
    },
  },
  {
    path: '/rainbow2-2024',
    name: 'Rainbow22024',
    component: () => import('@/views/Rainbow22024'),
    meta: {
      title: '多彩汇云间',
      module: 'activitycenter_rainbow2_2024',
    },
  },
  {
    path: '/rainbow1-2024',
    name: 'Rainbow12024',
    component: () => import('@/views/Rainbow12024'),
    meta: {
      title: '绮丽绘梦时',
      module: 'activitycenter_rainbow1_2024',
    },
  },
  {
    path: '/qixi-2024',
    name: 'Qixi2024',
    component: () => import('@/views/Qixi2024'),
    meta: {
      title: '求签乞巧 鹊桥相会',
      module: 'activitycenter_qixi_2024',
    },
  },
  {
    path: '/season23-start',
    name: 'Season23Start',
    component: () => import('@/views/Season23Start'),
    meta: {
      title: '谐音和鸣 谱写新章',
      module: 'activitycenter_season23_start',
    },
  },
  {
    path: '/season23-reserve',
    name: 'Season23Reserve',
    component: () => import('@/views/Season23Reserve'),
    meta: {
      title: '二重奏季 期待相遇',
      module: 'activitycenter_season23_reserve',
    },
  },
  {
    path: '/nationalday1-2024',
    name: 'Nationalday12024',
    component: () => import('@/views/Nationalday12024'),
    meta: {
      title: '悠长假日 拾光小憩',
      module: 'activitycenter_nationalday1_2024',
    },
  },
  {
    path: '/season23-sprint',
    name: 'Season23Sprint',
    component: () => import('@/views/Season23Sprint'),
    meta: {
      title: '弦音协奏 携手谢幕',
      module: 'activitycenter_season23_sprint',
    },
  },
  {
    path: '/summerday-2024',
    name: 'Summerday2024',
    component: () => import('@/views/Summerday2024'),
    meta: {
      title: '清凉夏末 魔法相赠',
      module: 'activitycenter_summerday_2024',
    },
  },
  {
    path: '/season24-reserve',
    name: 'Season24Reserve',
    component: () => import('@/views/Season24Reserve'),
    meta: {
      title: '姆明季期待相遇',
      module: 'activitycenter_season24_reserve',
    },
  },
  {
    path: '/dice-map',
    name: 'DiceMap',
    component: () => import('@/views/DiceMap'),
    meta: {
      title: '因光而遇 因遇而喜',
      module: 'activitycenter_dice_map',
    },
  },
  {
    path: '/dice-mission',
    name: 'DiceMission',
    component: () => import('@/views/DiceMission'),
    meta: {
      title: '光遇见喜',
      module: 'activitycenter_dice_mission',
    },
  },
  {
    path: '/dice-store',
    name: 'DiceStore',
    component: () => import('@/views/DiceStore'),
    meta: {
      title: '喜遇商店',
      module: 'activitycenter_dice_store',
    },
  },
  {
    path: '/season24-start',
    name: 'Season24Start',
    component: () => import('@/views/Season24Start'),
    meta: {
      title: '因为被爱 所以看见',
      module: 'activitycenter_season24_start',
    },
  },
  {
    path: '/halloweentask-2024',
    name: 'HalloweenTask2024',
    component: () => import('@/views/HalloweenTask2024'),
    meta: {
      title: '不给糖果就捣蛋！',
      module: 'activitycenter_Halloweentask_2024',
    },
  },
  {
    path: '/halloweentreasure-2024',
    name: 'Halloweentreasure2024',
    component: () => import('@/views/HalloweenTreasure2024'),
    meta: {
      title: '惊吓？惊喜！出奇寻宝',
      module: 'activitycenter_Halloweentreasure_2024',
    },
  },
  {
    path: '/halloweenpass-2024',
    name: 'Halloweenpass2024',
    component: () => import('@/views/HalloweenPass2024'),
    meta: {
      title: '魔法坩埚 惊喜无限',
      module: 'activitycenter_Halloweenpass_2024',
    },
  },
  {
    path: '/doubleeleven-2024-1',
    name: 'DoubleEleven2024_1',
    component: () => import('@/views/DoubleEleven2024_1'),
    meta: {
      title: '魔法畅享',
      module: 'activitycenter_double_eleven_2024_1',
    },
  },
  {
    path: '/doubleeleven-2024-2',
    name: 'DoubleEleven2024_2',
    component: () => import('@/views/DoubleEleven2024_2'),
    meta: {
      title: '遇见惊喜',
      module: 'activitycenter_double_eleven_2024_2',
    },
  },
  {
    path: '/kizunachina-2024',
    name: 'KizunaChina2024',
    component: () => import('@/views/KizunaChina2024'),
    meta: {
      title: '中国绊爱 与光重逢',
      module: 'activitycenter_kizuna_china_2024',
    },
  },
  {
    path: '/music-2024',
    name: 'Music2024',
    component: () => import('@/views/Music2024'),
    meta: {
      title: '曲意畅想 谱写乐章',
      module: 'activitycenter_music_2024',
    },
  },
  {
    path: '/season24-sprint',
    name: 'Season24Sprint',
    component: () => import('@/views/Season24Sprint'),
    meta: {
      title: '与爱同行 温暖相拥',
      module: 'activitycenter_season24_sprint',
    },
  },
  {
    path: '/doubledan-2024-1',
    name: 'Doubledan2024_1',
    component: () => import('@/views/Doubledan2024_1'),
    meta: {
      title: '温暖冬日 翻开惊喜',
      module: 'activitycenter_doubledan_2024_1',
    },
  },
  {
    path: '/icefestival2025',
    name: 'Icefestival2025',
    component: () => import('@/views/Icefestival2025'),
    meta: {
      title: '创造！冰雪大世界！',
      module: 'activitycenter_icefestival2025',
    },
  },
  {
    path: '/doubledan-2024-2',
    name: 'Doubledan2024_2',
    component: () => import('@/views/Doubledan2024_2'),
    meta: {
      title: '落入奇遇茶会',
      module: 'activitycenter_doubledan_2024_2',
    },
  },
  {
    path: '/season25-reserve',
    name: 'Season25Reserve',
    component: () => import('@/views/Season25Reserve'),
    meta: {
      title: '彩染季 期待相遇',
      module: 'activitycenter_season_25_reserve',
    },
  },
  {
    path: '/cloud-music-2024',
    name: 'CloudMusic2024',
    component: () => import('@/views/CloudMusic2024'),
    meta: {
      title: '光遇云音 心随律动',
      module: 'activitycenter_cloud_music_2024',
    },
  },
  {
    path: '/netease-werewolf',
    name: 'NeteaseWerewolf',
    component: () => import('@/views/NeteaseWerewolf'),
    meta: {
      title: '追随钟声 即刻启程',
      module: 'activitycenter_netease_werewolf',
    },
  },
  {
    path: '/netease-werewolf-join',
    name: 'NeteaseWerewolfJoin',
    component: () => import('@/views/NeteaseWerewolfJoin'),
    meta: {
      title: '冥龙，在我们之中',
      module: 'activitycenter_netease_werewolf_join',
    },
  },
  {
    path: '/invitation-code',
    name: 'InvitationCode',
    component: () => import('@/views/InvitationCode'),
    meta: {
      title: '共沐温暖 不期而遇',
      module: 'activitycenter_invitation_code',
    },
  },
  {
    path: '/pc-celebration',
    name: 'PcCelebration',
    component: () => import('@/views/PcCelebration'),
    meta: {
      title: '在更广阔天空相遇',
      module: 'activitycenter_pc_celebration',
    },
  },
  {
    path: '/moomin-test-god',
    name: 'MoominTestGod',
    component: () => import('@/views/MoominTestGod'),
    meta: {
      title: '姆明谷的身份大揭秘',
      module: 'activitycenter_moomin_test_god',
    },
  },
  {
    path: '/winter-2025-3',
    name: 'Winter2025_3',
    component: () => import('@/views/Winter2025_3'),
    meta: {
      title: '相遇寄福',
      module: 'activitycenter_winter_2025_3',
    },
  },
  {
    path: '/winter-2025-4',
    name: 'Winter2025_4',
    component: () => import('@/views/Winter2025_4'),
    meta: {
      title: '花灯雅集',
      module: 'activitycenter_winter_2025_4',
    },
  },
  {
    path: '/dayofdesign01-post-main',
    name: 'DayOfDesign01PostMain',
    component: () => import('@/views/DayOfDesign01PostMain'),
    meta: {
      title: '绘梦节',
      module: 'activitycenter_dayofdesign01_post_main',
    },
  },
  {
    path: '/dayofdesign01-post-submit',
    name: 'DayOfDesign01PostSubmit',
    component: () => import('@/views/DayOfDesign01PostSubmit'),
    meta: {
      title: '我要投稿',
      module: 'activitycenter_dayofdesign01_post_submit',
    },
  },
  {
    path: '/dayofdesign01-post-exhibit',
    name: 'DayOfDesign01PostExhibit',
    component: () => import('@/views/DayOfDesign01PostExhibit'),
    meta: {
      title: '活动会场',
      module: 'activitycenter_dayofdesign01_post_exhibit',
    },
  },
  {
    path: '/external-season25-start',
    name: 'Season25Start',
    component: () => import('@/views/IframeView'),
    meta: {
      title: '寻颜觅彩焕新裳',
      module: 'activitycenter_season25_start',
      externalUid: 'bBkIoR',
    },
  },
  {
    path: '/external-daysoflove-2025',
    name: 'Daysoflove2025',
    component: () => import('@/views/IframeView'),
    meta: {
      title: '情人节活动',
      module: 'activitycenter_daysoflove_2025',
      externalUid: 'Gtbv2O',
    },
  },
]
