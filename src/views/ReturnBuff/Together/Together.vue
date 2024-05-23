<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="reunion flex h-full w-full">
      <Transition appear :name="headTransitionName" mode="out-in">
        <div class="header flex">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            天空王国回归指南
          </h1>
          <div
            class="sub-title overflow-hidden bg-contain bg-center bg-no-repeat"
          >
            <p class="indent-[-9999px]">体验每日精彩旅程，获取重逢礼遇</p>
          </div>
        </div>
      </Transition>
      <Transition appear :name="mainTransitionName" mode="out-in">
        <div class="main">
          <div class="main-box bg-contain bg-center bg-no-repeat"></div>
          <button
            type="button"
            class="btn bg-contain bg-center bg-no-repeat indent-[-9999px]"
            @click="handleToSpriteQA"
          >
            查看精灵攻略
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { getUserInfo, getJinglingToken } from '@/utils/request'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

// 设计稿宽
const DESIGN_WIDTH = 2560
// 设计稿高
const DESIGN_HEIGHT = 1200
// 设计稿主体宽，减去边距：因为我们要保留主体部分的边距。
// 会影响最终计算出来的缩放系数，影响元素转换的实际大小，所以只能在这里减去，而不能在元素上写边距。
const DESIGN_MAYDAY_WIDTH = 2100 - 60
// 设计稿主体高，同宽。
const DESIGN_MAYDAY_HEIGHT = 1200 - 60
// 设计稿主体内容宽
const DESIGN_MAYDAY_CONTENT_WIDTH = DESIGN_MAYDAY_WIDTH
// 设计稿主体内容高
const DESIGN_MAYDAY_CONTENT_HEIGHT = DESIGN_MAYDAY_HEIGHT
// 设计稿主体内容宽高比
const DESIGN_MAYDAY_CONTENT_RATIO =
  DESIGN_MAYDAY_CONTENT_WIDTH / DESIGN_MAYDAY_CONTENT_HEIGHT

// 配置参数
const designConfig: DesignConfig = {
  designWidth: DESIGN_WIDTH,
  designHeight: DESIGN_HEIGHT,
  designMainWidth: DESIGN_MAYDAY_WIDTH,
  designMainHeight: DESIGN_MAYDAY_HEIGHT,
  designMainContentWidth: DESIGN_MAYDAY_CONTENT_WIDTH,
  designMainContentHeight: DESIGN_MAYDAY_CONTENT_HEIGHT,
  designMainContentRatio: DESIGN_MAYDAY_CONTENT_RATIO,
}

// 缩放系数
const { factor } = useResponsiveStyles(designConfig)
console.log('factor: ', factor.value)

const prodUrl = 'https://sky.h5.163.com/game/'
const isProd = ref(window.location.href.includes(prodUrl))
const jinglingUrl = isProd.value
  ? 'https://gmsdk.gameyw.netease.com/sprite/index'
  : 'https://dev.gmsdk.gameyw.netease.com/sprite/index'

const isVisited = Session.get('isVisitedTogether')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

onMounted(() => {
  Session.set('isVisitedTogether', true)
  getBaseInfo()
})

let tokenParams: {
  game_uid: string
  uid: string
  map: string
  return_buff: string
  os: string
  refer: string
} = {
  game_uid: '',
  uid: '',
  map: '',
  return_buff: '',
  os: '',
  // 回流玩家攻略专题
  refer: encodeURIComponent('/sprite/index?q=回流玩家攻略专题'),
}

// 获取基本信息
function getBaseInfo(): void {
  getUserInfo()
    .then((res) => {
      tokenParams = {
        ...tokenParams,
        game_uid: res.game_uid,
        uid: res.uid,
        map: res.map,
        return_buff: res.return_buff,
        os: res.os,
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 查看精灵攻略
function handleToSpriteQA(): void {
  getJinglingToken(tokenParams)
    .then((res) => {
      const val = res.data.token
      window.location.href = `${jinglingUrl}?token=${val}&q=${encodeURIComponent(
        '回流玩家攻略专题',
      )}`
    })
    .catch((error) => {
      showToast(error.message)
    })
}
</script>

<style lang="scss" scoped>
.fade-in-body-enter-active {
  transition: opacity 1s ease-out;
}
.fade-in-body-enter-from {
  opacity: 0.2;
}
.fade-in-head-enter-active {
  transition: opacity 1s ease-out 0.2s;
}
.fade-in-head-enter-from {
  opacity: 0.2;
}
.fade-in-main-enter-active {
  transition: opacity 1s ease-out 0.5s;
}
.fade-in-main-enter-from {
  opacity: 0.2;
}
.reunion {
  position: relative;
}
.title {
  position: absolute;
  left: 298px;
  top: 85px;
  width: 1020px;
  height: 194px;
  background-image: url('@/assets/images/return-buff/reunion/title.png');
}
.sub-title {
  position: absolute;
  left: 645px;
  top: 286px;
  width: 727px;
  height: 50px;
  background-image: url('@/assets/images/return-buff/reunion/sub-title.png');
}
.main-box {
  position: absolute;
  left: 130px;
  top: 412px;
  width: 1384px;
  height: 487px;
  background-image: url('@/assets/images/return-buff/together/main-box.png');
}
.btn {
  position: absolute;
  left: 50%;
  bottom: 60px;
  margin-left: -212px;
  width: 424px;
  height: 132px;
  background-image: url('@/assets/images/return-buff/together/btn.png');
}
</style>
