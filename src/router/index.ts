import { showToast } from 'vant'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { useMenuStore } from '@/stores/menu'
import { webViewStatistics } from '@/utils/request'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to) => {
  const title = to?.meta?.title
  if (title) {
    document.title = title as string
  }
})

router.afterEach((to, from) => {
  console.log('afterEach from: ', from)
  console.log('afterEach to: ', to)
  const module = to?.meta?.module
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
