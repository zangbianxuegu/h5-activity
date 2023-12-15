import type { RouteRecordRaw } from 'vue-router'
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/page1',
  },
  {
    path: '/page1',
    name: 'Page1',
    component: () => import('@/components/Page1'),
    meta: {
      title: '页面1',
    },
  },
  {
    path: '/page2',
    name: 'Page2',
    redirect: '/page2/sub-page1',
    component: () => import('@/components/Page2'),
    meta: {
      title: '页面2',
    },
    children: [
      {
        path: 'sub-page1',
        name: 'SubPage1',
        component: () => import('@/components/SubPage1'),
        meta: {
          title: '二级页面1',
        },
      },
      {
        path: 'sub-page2',
        name: 'SubPage2',
        component: () => import('@/components/SubPage2'),
        meta: {
          title: '二级页面2',
        },
      },
    ],
  },
  {
    path: '/bulletin',
    name: 'Bulletin',
    component: () => import('@/components/Bulletin'),
    meta: {
      title: '小光快报',
    },
  },
]
