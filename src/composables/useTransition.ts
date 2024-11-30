import { Session } from '@/utils/storage'

/**
 * @function useTransition
 * @description 处理页面过渡效果的自定义Hook
 * @param {string} sessionIsVisitedKey - 用于存储页面是否被访问过的Session键
 * @returns {Object} 包含body、head和main元素的过渡名称
 */
export function useTransition(sessionIsVisitedKey: string): {
  bodyTransitionName: Ref<string>
  headTransitionName: Ref<string>
  mainTransitionName: Ref<string>
} {
  // 从Session中获取页面是否被访问过的状态
  const isVisited = Session.get(sessionIsVisitedKey)
  // 初始化过渡名称为空字符串
  const bodyTransitionName = ref('')
  const headTransitionName = ref('')
  const mainTransitionName = ref('')
  // 如果页面未被访问过，设置淡入效果
  if (!isVisited) {
    bodyTransitionName.value = 'fade-in-body'
    headTransitionName.value = 'fade-in-head'
    mainTransitionName.value = 'fade-in-main'
  }
  // 组件挂载后，将页面访问状态设置为true
  onMounted(() => {
    Session.set(sessionIsVisitedKey, true)
  })
  // 返回过渡名称对象
  return {
    bodyTransitionName,
    headTransitionName,
    mainTransitionName,
  }
}
