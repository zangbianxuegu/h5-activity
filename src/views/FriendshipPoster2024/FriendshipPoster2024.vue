<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="friendship flex h-screen">
      <div class="friendship-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              有友共享 7.17-8.27
            </h1>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <img
              class="img img-diary animate__animated animate__fadeIn"
              src="@/assets/images/friendship-poster-2024/diary.png"
              alt="向友葵的成长日记"
            />
            <img
              class="img img-candle animate__animated animate__fadeIn"
              src="@/assets/images/friendship-poster-2024/candle.png"
              alt="大蜡烛"
            />
            <img
              class="img img-heart-fire animate__animated animate__fadeIn"
              src="@/assets/images/friendship-poster-2024/heart-fire.png"
              alt="双倍心火"
            />
            <img
              class="img img-heart animate__animated animate__fadeIn"
              src="@/assets/images/friendship-poster-2024/heart.png"
              alt="送心双倍"
            />
            <img
              class="img img-daily animate__animated animate__fadeIn"
              src="@/assets/images/friendship-poster-2024/daily.png"
              alt="每日任务额外奖励"
            />
          </section>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
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

const isVisited = Session.get('isVisitedFriendshipPoster2024')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

onMounted(() => {
  try {
    console.log('mounted')
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedFriendshipPoster2024', true)
})
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
.friendship {
  position: relative;
  width: 2100px;

  &-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(var(--scale-factor));
    width: 2040px;
    height: 1140px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('@/assets/images/friendship-poster-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 268px;
  top: 781px;
  width: 523px;
}
.title {
  width: 523px;
  height: 241px;
  background-image: url('@/assets/images/friendship-poster-2024/title.png');
}
.img {
  position: absolute;
}
.img-diary {
  left: 122px;
  top: 207px;
  width: 664px;
  height: 618px;
}
.img-candle {
  left: 863px;
  top: 169px;
  width: 483px;
  height: 467px;
}
.img-heart {
  left: 1394px;
  top: 183px;
  width: 501px;
  height: 320px;
}
.img-heart-fire {
  left: 863px;
  top: 667px;
  width: 499px;
  height: 349px;
}
.img-daily {
  left: 1386px;
  top: 542px;
  width: 483px;
  height: 355px;
}
</style>
