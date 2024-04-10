import { showToast } from 'vant'
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { webViewStatistics } from '@/utils/request'
import { useMenuStore } from '@/stores/menu'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  console.log('页面路由 to: ', to)
  const title = to?.meta?.title
  const module = to?.meta?.module
  if (title) {
    document.title = title as string
  }
  // 更新菜单数据 isActive
  if (module && typeof module === 'string') {
    const menuStore = useMenuStore()
    menuStore.updatedMenuDataByRoute(module)
  }
  // 日志数据上报
  try {
    if (typeof module === 'string') {
      if (module !== 'activity_center_notice') {
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
  } finally {
    next()
  }
})

export default router
