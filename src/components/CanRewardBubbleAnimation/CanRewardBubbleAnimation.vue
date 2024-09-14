<template>
  <lottie-animation
    ref="animationRef"
    class="bubble-container"
    :loop="lottieConfig.loop"
    :autoplay="lottieConfig.autoplay"
    :path="jsonPath"
  ></lottie-animation>
</template>

<script lang="ts" setup>
import LottieAnimation from '@/components/LottieAnimation/LottieAnimation.vue'
import type { AnimationItem } from 'lottie-web'

const animationRef = ref<InstanceType<typeof LottieAnimation>>()

const animationItem = computed<AnimationItem | null>(() => {
  if (!animationRef.value) return null
  return animationRef.value.getLottieAnimationItem()
})

const bubbleStatus: Ref<'loop' | 'click'> = ref('loop')
const jsonPath = computed<string>(() => {
  return bubbleStatus.value === 'loop'
    ? './lottie/bubble/bubble_glow_loop/bubble_glow_loop.json'
    : './lottie/bubble/bubble_glow_get/bubble_glow_get.json'
})

const switchLottieAnimation = async (): Promise<void> => {
  bubbleStatus.value = 'click'
  await animationRef.value?.switchLottieAnimation()
}

const lottieConfig = reactive({
  loop: true,
  autoplay: true,
})

// 动画第一阶段：等待领奖
const playAnimationWaitReward = (): void => {
  if (!animationRef.value) return
  animationItem.value?.play()
}
// 动画第二阶段：点击泡泡爆破
const playAnimationClickBubble = (): void => {
  if (!animationRef.value) return
  lottieConfig.loop = false
  void switchLottieAnimation()
}

// 动画消失
const hideAnimation = (): void => {
  if (!animationRef.value) return
  animationRef.value.getLottieAnimationItem().pause()
}

const initLottie = (): void => {
  if (!animationRef.value) return
  animationRef.value?.initLottie()
}

onBeforeMount(() => {
  animationRef.value?.destroyAndUnmount()
})

defineExpose({
  playAnimationWaitReward,
  playAnimationClickBubble,
  hideAnimation,
  switchLottieAnimation,
  initLottie,
})
</script>
<style lang="scss" scoped>
.bubble-container {
  width: 100%;
  height: 100%;
}
</style>
