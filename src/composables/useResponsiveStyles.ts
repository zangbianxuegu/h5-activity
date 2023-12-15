import { ref, onMounted, onUnmounted } from 'vue'
import throttle from 'lodash.throttle'
import { type DesignConfig } from '@/types'

export default function useResponsiveStyles(config: DesignConfig): {
  factor: Ref<number>
} {
  const {
    designWidth,
    designHeight,
    designMainWidth,
    designMainHeight,
    designMainContentWidth,
    designMainContentHeight,
    designMainContentRatio,
  } = config

  // 缩放系数
  const factor = ref(1)

  // 处理缩放系数
  const handleResize = throttle(() => {
    // 重置缩放系数
    factor.value = 1
    // 屏幕宽
    const clientWidth =
      window.innerWidth || document.documentElement.clientWidth
    // 屏幕高
    const clientHeight =
      window.innerHeight || document.documentElement.clientHeight

    // 理想的屏幕主体内容宽度。包含了两边空白，而非只是内容部分
    // 例如：iPhone X，公告页面，(2100-60) / 2560 = X / 812，X = ((2100 - 60) / 2560) * 812 = 647.0625
    const clientIdealMainWidth = (designMainWidth / designWidth) * clientWidth
    // 理想的屏幕主体内容高度
    // 例如：iPhone X，公告页面，(1200-60) / 1200 = Y / 375，Y = ((1200 - 60) / 1200) * 375 = 356.25
    const clientIdealMainHeight =
      (designMainHeight / designHeight) * clientHeight
    // 理想的屏幕主体内容宽高比
    // 例如：iPhone X，公告页面，647.0625 / 356.25 = 1.8163
    const clientIdealMainRatio = clientIdealMainWidth / clientIdealMainHeight

    // 实际的屏幕主体内容宽度
    // 例如 iPhone X: 2560 / 1620 = 812 / X，X = 513.84375
    // const clientActualMainWidth =
    //   (designMainContentWidth / designWidth) * clientWidth
    // 实际的屏幕主体内容高度
    // 例如 iPhone X：2560 / 1006 = 812 / Y，Y = 328.60625
    const clientActualMainHeight =
      (designMainContentHeight / designWidth) * clientWidth
    // 实际的屏幕主体内容宽高比，例如 iPhone X：513.84375 / 328.60625
    // const clientActualMainRatio =
    //   clientActualMainWidth / clientActualMainHeight

    // 理想的屏幕主体内容宽高比 和 设计稿主体内容宽高比 比较
    if (clientIdealMainRatio > designMainContentRatio) {
      console.log(
        'clientIdealMainRatio, designMainContentRatio: ',
        clientIdealMainRatio,
        designMainContentRatio,
      )
      // 大于。理想的（可利用的）宽高比大于设计部分的宽高比
      // 应该高度充满，所以用高度计算缩放系数
      // 缩放系数：理想的主体的高度（例如 356.25）/ 实际的主体的高度（例如 328.60625）
      // 这个缩放系数就是在适配时宽度上应该放大的值
      factor.value = clientIdealMainHeight / clientActualMainHeight
    } else if (clientIdealMainRatio < designMainContentRatio) {
      console.log(
        'clientIdealMainRatio, designMainContentRatio: ',
        clientIdealMainRatio,
        designMainContentRatio,
      )
      // 小于。理想的（可利用的）宽高比小于设计部分的宽高比
      // 高度不会充满，所以应该宽度充满
      // 缩放系数：设计稿主体宽度 / 设计稿主体内容宽度
      // 相当于是，我们并没有留设计比例的边距，而是充满主体宽度
      // 这个缩放系数就是在适配时宽度上应该放大的值
      factor.value = designMainWidth / designMainContentWidth
    }
  }, 200)

  // fix: 需要在初始化时就调用，而非在挂载时，页面已经渲染
  handleResize()

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    // handleResize() // 初始化尺寸和样式
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    factor,
  }
}
