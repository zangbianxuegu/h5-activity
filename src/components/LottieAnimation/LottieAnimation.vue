<template>
  <div ref="lottieContainer" class="lottie-container" v-if="visible"></div>
</template>

<script lang="ts" setup>
import type { AnimationItem, RendererType } from 'lottie-web'
import Lottie from 'lottie-web'

interface Props {
  initAutoRender?: boolean
  path?: string
  animationData?: any
  loop?: number | boolean
  autoplay?: boolean
}
const props = defineProps<Props>()
const lottieContainer = ref<HTMLElement | null>(null)
interface LottieConfig {
  container: HTMLElement
  path?: string
  animationData?: any
  autoplay?: boolean
  loop?: number | boolean
  renderer?: RendererType
}

const defaultConfig: LottieConfig = {
  container: lottieContainer.value as HTMLElement,
  loop: true,
  autoplay: true,
  renderer: 'svg',
}

const lottieAnimationItem = ref<AnimationItem>()

/**
 * 渲染lottie动画
 */
const renderLottie = (): void => {
  if (!lottieContainer.value) return
  const lottieConfig: LottieConfig = {
    container: lottieContainer.value,
    ...props,
  }

  lottieAnimationItem.value = Lottie.loadAnimation(
    Object.assign({}, defaultConfig, lottieConfig),
  )
}

/**
 * 初始化lottie动画
 */
const initLottie = (): void => {
  renderLottie()
}

const pause = (): void => {
  lottieAnimationItem.value?.pause()
}

/**
 * 销毁lottie动画并卸载组件
 */
const visible = ref(true)
const destroyAndUnmount = (): void => {
  visible.value = false
}

/**
 * 获取动画实例，供父组件调用lottie实例相关方法
 */
const getLottieAnimationItem = (): AnimationItem => {
  return lottieAnimationItem?.value as AnimationItem
}

/**
 * 切换lottie动画，外部同步切换动画属性即可，切换动画是异步执行
 */
const switchLottieAnimation = async (): Promise<void> => {
  lottieAnimationItem.value?.stop()
  lottieAnimationItem.value?.destroy()
  await nextTick(() => {
    renderLottie()
  })
}

onMounted(() => {
  if (props.initAutoRender) {
    renderLottie()
  }
})

onBeforeUnmount(() => {
  if (lottieAnimationItem.value) {
    lottieAnimationItem.value.stop()
    lottieAnimationItem.value.destroy()
  }
})

defineExpose({
  getLottieAnimationItem,
  pause,
  switchLottieAnimation,
  initLottie,
  destroyAndUnmount,
})
</script>
