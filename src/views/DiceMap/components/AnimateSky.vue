<template>
  <div ref="spineContainer" class="spine transition-opacity"></div>
</template>

<script setup lang="ts">
import {
  SpinePlayer,
  type SpinePlayerConfig,
} from '@esotericsoftware/spine-player'

interface Props {
  jsonPath: string
  atlasPath: string
  animations: string[]
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
    animations: props.animations,
    alpha: true,
    premultipliedAlpha: props.premultipliedAlpha,
    backgroundColor: '#00000000',
    preserveDrawingBuffer: false,
    showControls: false,
    viewport: {
      // debugRender: true,
      padLeft: '0%',
      padRight: '0%',
      padTop: '0%',
      padBottom: '0%',
    },
    // 加载完成回调函数
    success: (player) => {
      loading.value = false
      // 初始加载完成之后清空动画
      player.animationState?.setEmptyAnimation(0, 0)
      // 监听动画完成事件
      player.animationState?.addListener({
        complete: function (entry) {
          console.log('角色动画完成 complete: ', entry)
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

defineExpose({
  playAnimation,
})
</script>
