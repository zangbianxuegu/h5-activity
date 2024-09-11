<template>
  <lottie-animation
    ref="animationRef"
    class="bubble-container"
    :loop="false"
    :autoplay="false"
    path="https://lottie.host/c404786e-2d84-4239-a092-5fa55366d5a7/DRPRrsgJH4.json"
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

// 动画第一阶段：等待领奖
const playAnimationWaitReward = (): void => {
  if (!animationRef.value) return
  animationItem.value?.playSegments([10, 20], true)
}
// 动画第二阶段：点击泡泡爆破
const playAnimationClickBubble = (): void => {
  if (!animationRef.value) return
  animationItem.value?.setSpeed(3)
  animationItem.value?.playSegments([20, 30], true)

  // animationItem.value?.goToAndPlay(1, false)
}
// 动画消失
const hideAnimation = (): void => {
  if (!animationRef.value) return
  animationRef.value.getLottieAnimationItem().pause()
}

defineExpose({
  playAnimationWaitReward,
  playAnimationClickBubble,
  hideAnimation,
})
onMounted(() => {
  playAnimationWaitReward()
})
onBeforeMount(() => {
  animationItem.value?.destroy()
})
</script>
<style lang="scss" scoped>
.bubble-container {
  width: 300px;
  height: 300px;
}
</style>
