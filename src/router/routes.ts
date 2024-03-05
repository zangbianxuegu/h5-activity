import type { RouteRecordRaw } from 'vue-router'
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/holiday',
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
    path: '/sign-mayday-2024',
    name: 'SignMayday2024',
    component: () => import('@/views/SignMayday2024'),
    meta: {
      title: '田月桑时春风雀跃',
      module: 'activity_sign_mayday_2024',
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
