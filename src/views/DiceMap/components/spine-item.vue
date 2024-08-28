<template>
  <div class="spine-item-box" v-bind="$attrs">
    <van-loading
      v-if="loading"
      type="spinner"
      color="#1989fa"
      vertical
      size=".5333rem"
      class="spine-laoding"
    ></van-loading>
    <div
      :id="id"
      :class="'spine-item ' + props.itemClass"
      :style="props.itemStyle"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { watchEffect, ref, type StyleValue } from 'vue'
import { SpinePlayer } from '@esotericsoftware/spine-player'

interface PropsInterface {
  jsonUrl: string // json文件
  atlasUrl: string // atlas文件
  animation?: string // 动画名称
  loop?: boolean // 动画是否循环播放
  itemClass?: any // 动画class
  itemStyle?: StyleValue | undefined // 动画style
  viewport?: any // 视口
  success?: (...params: any[]) => void // 加载成功
  error?: (...params: any[]) => void // 加载失败
  animStatusChange?: (
    status: 'start' | 'interrupt' | 'end' | 'dispose' | 'complete' | 'event',
    entry: any,
    event?: any,
  ) => void
}

const props = withDefaults(defineProps<PropsInterface>(), {
  jsonUrl: '',
  atlasUrl: '',
  animation: '',
  loop: true,
  itemClass: '',
  itemStyle: '',
  viewport: {},
  success: () => null,
  error: () => null,
  animStatusChange: () => null,
})

// 组件内动画ref
const spineItem = ref<any>(null)
// 动画加载状态
const loading = ref(false)
// 生成随机id
const id = `spine${Math.random().toString(36).substring(2)}`
// 是否已完成加载
const isLoaded = ref(false)
// 加载次数
const loadCount = ref(0)
// 动画稍后加载
let loadLater: any = null

// 上一个动画加载状态
const animInfo = ref({
  name: '',
  hasPlay: false,
})

// 动画加载
const spineLoad = (): void => {
  // 已加载，不再重复加载
  if (isLoaded.value) {
    return
  }

  loadCount.value++
  loading.value = true
  // 动画渲染
  spineItem.value = new SpinePlayer(id, {
    jsonUrl: props.jsonUrl,
    atlasUrl: props.atlasUrl,
    showLoading: false, // loading动画
    showControls: false, // 隐藏控制板
    // backgroundColor: '#463c3c1a', // 背景色
    alpha: true, // 半透明
    // skeleton: '', // 骨架
    animation: props.animation, // 动画,
    preserveDrawingBuffer: false,
    // skin: 'default', // 皮肤
    // debug: {
    //   bones: true,
    //   regions: true,
    //   meshes: true,
    //   bounds: true,
    //   paths: true,
    //   clipping: true,
    //   points: true,
    //   hulls: true
    // }, // 调试
    viewport: props.animation ? props.viewport : {},
    success: function (player: any) {
      loading.value = false
      isLoaded.value = true
      props.success(player)
    },
    error: function (player: any, reason: any) {
      console.log(reason)
      props.error(player, reason)
      loading.value = false
      isLoaded.value = false
    },
  })
}

// 初始化动画
const initSpine = (): void => {
  if ((window as any).spine && JSON.stringify((window as any).spine) !== '{}') {
    spineLoad()
  } else {
    setTimeout(() => {
      spineLoad()
    }, 500)
  }
}

// 动画变化
watchEffect(() => {
  // 判断是否同一个动画，减少spineItem变动引发的重复渲染
  const isRepeat =
    animInfo.value.name === props.animation && animInfo.value.hasPlay
  // 判断外层动画属性变化后，修改动画----必须在动画加载完成后才能修改
  if (spineItem.value && props.animation && isLoaded.value && !isRepeat) {
    animInfo.value.name = props.animation
    animInfo.value.hasPlay = true
    if (spineItem.value.skeleton.data.animations) {
      const idx = spineItem.value.skeleton.data.animations.findIndex(
        (item: any) => item.name === props.animation,
      )
      if (idx > -1) {
        spineItem.value?.animationState.clearTracks()
        if (props.animStatusChange) {
          const listenFn = (
            status:
              | 'start'
              | 'interrupt'
              | 'end'
              | 'dispose'
              | 'complete'
              | 'event',
            entry: any,
            event?: any,
          ): void => {
            props.animStatusChange &&
              props.animStatusChange(status, entry, event)
          }
          spineItem.value?.animationState.clearListeners()
          const events = [
            'start',
            'interrupt',
            'end',
            'dispose',
            'complete',
            'event',
          ]
          events.forEach((eTtem: any) => {
            const listener: Record<string, any> = {}
            listener[eTtem] = (entry: any, event: any) => {
              listenFn(eTtem, entry, event)
            }
            spineItem.value?.animationState.addListener(listener)
          })
        }
        spineItem.value?.animationState.setAnimation(
          0,
          props.animation,
          props.loop,
        )
      } else {
        console.warn(`检测不到动画名：${props.animation}`)
      }
    }
  }
})

watchEffect(() => {
  if (!isLoaded.value && !loading.value) {
    loadLater = window.requestAnimationFrame(() => {
      initSpine()
    })
  }
  if (loadCount.value > 10) {
    window.cancelAnimationFrame(loadLater)
    loadLater = null
  }
})

/**
 * @desc 角色局部换装
 * @param {string} slotName 插槽名
 * @param {string} targetAttaName 局部替换名
 * @param {string} skinName 皮肤名
 * @return
 */
const partChange = (
  slotName: string,
  targetAttaName: string,
  skinName?: string,
): void => {
  const item = spineItem.value
  // 加载完成才能换装
  if (item && isLoaded.value) {
    // 查找局部皮肤
    const skeletonData = item?.skeleton?.data
    const targetSkin = skeletonData.findSkin(skinName || 'default')
    // 获取插槽
    const _slotName = slotName // 插槽名
    const _targetAttaName = targetAttaName // 局部替换名
    const slot = item?.skeleton.findSlot(_slotName) // 插槽
    // 替换元素
    const targetSkinSlotIndex = slot.data.index
    const atta = targetSkin.getAttachment(targetSkinSlotIndex, _targetAttaName)
    slot.setAttachment(atta)
  }
}

// 属性、方法暴露至ref,供父组件调用
defineExpose({ spineItem, partChange, isLoaded })
</script>

<style lang="scss" scoped>
.spine-item-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .spine-laoding {
    position: absolute;
    align-self: center;
  }
  .spine-item {
    width: 100%;
    height: 100%;
  }
}
</style>
