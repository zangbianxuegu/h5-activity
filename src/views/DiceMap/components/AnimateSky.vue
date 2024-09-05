<template>
  <div>
    <div v-if="loading" class="text-red-500">loading...</div>
    <div
      v-show="!loading"
      ref="spineContainer"
      class="spine h-full w-full"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  SpinePlayer,
  type SpinePlayerConfig,
} from '@esotericsoftware/spine-player'

interface Props {
  jsonPath: string
  atlasPath: string
  premultipliedAlpha: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['complete'])
const spineContainer = ref<HTMLElement | null>(null)
let player: SpinePlayer | null = null
const loading = ref(true)

onMounted(() => {
  if (!spineContainer.value) return

  // 动画配置
  const config: SpinePlayerConfig = {
    jsonUrl: props.jsonPath,
    atlasUrl: props.atlasPath,
    alpha: true,
    premultipliedAlpha: props.premultipliedAlpha,
    backgroundColor: '#00000000',
    preserveDrawingBuffer: false,
    showControls: false,
    // animation: 'left_idle',
    viewport: {
      // debugRender: true,
      padTop: 0,
      padLeft: 0,
      padBottom: 0,
      padRight: 0,
      x: -225,
      y: -200,
      width: 450,
      height: 400,
    },
    // 加载完成回调函数
    success: (player) => {
      loading.value = false
      // 初始加载完成之后清空动画
      // player.animationState?.setEmptyAnimation(0, 0)
      // 监听动画完成事件
      player.animationState?.addListener({
        complete: function (entry) {
          console.log('complete: ', entry)
          emit('complete', entry)
        },
      })
    },
    // 加载错误回调函数
    error: function (reason) {
      console.error('spine animation load error', reason)
    },
  }

  // 创建 player
  player = new SpinePlayer(spineContainer.value, config)

  // 清理函数，当组件卸载时销毁 player
  return () => {
    player?.dispose()
  }
})

/**
 * @function playAnimation
 * @description 播放动画
 * @param animationName 动画名称
 */
function playAnimation(animationName: string, loop: boolean): void {
  if (player) {
    player.animationState?.clearTracks()
    // 必须
    // player.setViewport(animationName)
    // player.animationState?.addAnimation(0, animationName, loop)
    player.setAnimation(animationName, loop)
    // 必须
    player.play()
  }
}

/**
 * @function setEmptyAnimation
 * @description 设置空动画
 */
function setEmptyAnimation(): void {
  if (player) {
    player.animationState?.setEmptyAnimation(0, 0)
    player.skeleton?.setToSetupPose()
  }
}

defineExpose({
  playAnimation,
  setEmptyAnimation,
})
</script>
