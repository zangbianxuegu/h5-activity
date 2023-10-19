import type { RouteRecordRaw } from 'vue-router'
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/index',
  },
  // {
  //   path: '/index',
  //   name: 'Index',
  //   component: () => import('@/views/home/index.vue'),
  //   meta: {
  //     title: '首页',
  //   },
  // },
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('@/views/about/index.vue'),
  //   meta: {
  //     title: '关于',
  //   },
  // },
]
