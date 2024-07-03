import { showToast } from 'vant'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { useMenuStore } from '@/stores/menu'
import { useBaseStore } from '@/stores/base'
import { webViewStatistics } from '@/apis/base'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  const title = to?.meta?.title
  const baseStore = useBaseStore()
  if (title) {
    document.title = title as string
  }
  // 如果 App 接口还未成功
  if (
    to.meta?.module === 'activitycenter_week_friendship_2024' &&
    baseStore.baseInfo.currentFriendshipWeek === 0
  ) {
    const unwatch = watch(
      () => baseStore.baseInfo.currentFriendshipWeek,
      (newVal) => {
        if (newVal) {
          unwatch() // 确保只执行一次
          next()
        }
      },
    )
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  console.log('afterEach from: ', from)
  console.log('afterEach to: ', to)
  const baseStore = useBaseStore()
  const currentFriendshipWeek = baseStore.baseInfo.currentFriendshipWeek
  let module = to?.meta?.module
  if (module === 'activitycenter_week_friendship_2024') {
    module = `activitycenter_week${currentFriendshipWeek}_friendship_2024`
  }
  const menuStore = useMenuStore()
  // 更新菜单数据 isActive
  if (module && typeof module === 'string') {
    menuStore.updatedMenuDataByRoute(module)
  }
  // 日志数据上报
  try {
    if (typeof module === 'string') {
      if (
        ![
          'activity_center_notice',
          'activity_return_buff',
          'activity_return_buff_reunion',
          'activity_return_buff_setout',
          'activity_return_buff_together',
        ].includes(module)
      ) {
        webViewStatistics({ module })
          .then(() => {
            // console.log('日志数据上报成功. module: ' + module)
          })
          .catch((error) => {
            showToast(error.message)
          })
      }
    }
  } catch (error) {
    console.log('webViewStatistics error: ', error)
  }
})

export default router
