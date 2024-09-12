<template>
  <div ref="lottieContainer" class="lottie-container"></div>
</template>

<script lang="ts" setup>
import type { AnimationItem, RendererType } from 'lottie-web'
import Lottie from 'lottie-web'

interface Props {
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

let lottieAnimationItem: AnimationItem = null as unknown as AnimationItem

const renderLottie = (): void => {
  if (!lottieContainer.value) return
  const lottieConfig: LottieConfig = {
    container: lottieContainer.value,
    ...props,
  }
  // if (props.path) {
  //   lottieConfig.path = props.path
  // } else if (props.animationData) {
  //   lottieConfig.animationData = props.animationData
  // }
  lottieAnimationItem = Lottie.loadAnimation(
    Object.assign({}, defaultConfig, lottieConfig),
  )
  console.log('config', Object.assign({}, defaultConfig, lottieConfig))
}
onMounted(() => {
  renderLottie()
})
const pause = (): void => {
  console.log('pause')

  lottieAnimationItem.pause()
}
const getLottieAnimationItem = (): AnimationItem => {
  return lottieAnimationItem
}
defineExpose({
  getLottieAnimationItem,
  pause,
})
</script>
