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
      module: 'activity_return_buff',
    },
    children: [
      {
        path: 'reunion',
        name: 'Reunion',
        component: () => import('@/views/ReturnBuff/Reunion'),
        meta: {
          title: '重逢',
          module: 'activity_return_buff_reunion',
        },
      },
      {
        path: 'setout',
        name: 'Setout',
        component: () => import('@/views/ReturnBuff/Setout'),
        meta: {
          title: '启程',
          module: 'activity_return_buff_setout',
        },
      },
      {
        path: 'together',
        name: 'Together',
        component: () => import('@/views/ReturnBuff/Together'),
        meta: {
          title: '同行',
          module: 'activity_return_buff_together',
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
    path: '/bulletin',
    name: 'Bulletin',
    component: () => import('@/views/Bulletin'),
    meta: {
      title: '小光快报',
      module: 'activity_center_notice',
    },
  },
]
