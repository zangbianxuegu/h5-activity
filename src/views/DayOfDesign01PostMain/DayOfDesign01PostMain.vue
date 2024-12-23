<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page flex h-screen">
      <div class="page-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <header class="design-header relative">
            <h1 class="title overflow-hidden bg-contain bg-no-repeat">
              <p class="sr-only">执笔畅想 绘梦成真</p>
            </h1>
            <h2 class="sub-title bg-contain bg-no-repeat">
              <p class="sr-only">
                征集期
                <time datetime="2025-01-01">1.1</time>-
                <time datetime="2025-01-31">1.31</time>
              </p>
              <p class="sr-only">本期主题-国风演绎</p>
              <div
                class="help cursor-pointer bg-contain"
                @click="handleHelp"
              ></div>
            </h2>
            <button
              class="my-work absolute right-0 top-[60px]"
              @click="gotoRules"
            >
              活动详情>>
            </button>
          </header>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="animate__animated animate__fadeIn">
            <div class="absolute bottom-[74px] right-[252px] flex">
              <button type="button" class="btn mr-[50px] rounded-full bg-white">
                <RouterLink
                  to="/dayofdesign01-post-exhibit"
                  class="block h-full w-full"
                >
                  前往活动
                </RouterLink>
              </button>
              <button
                type="button"
                class="btn rounded-full bg-[#fffab6] text-[#836a4e]"
              >
                <RouterLink
                  to="/dayofdesign01-post-submit"
                  class="block h-full w-full"
                >
                  参与投稿
                </RouterLink>
              </button>
            </div>
            <div class="brush bg-contain">
              <span class="sr-only">奖励：画笔</span>
            </div>
          </section>
        </Transition>

        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ModalHelp from '../DayOfDesign01PostExhibit/components/ModalHelp.vue'

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
useResponsiveStyles(designConfig)
// 弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

const sessionIsVisitedKey = 'isVisitedDayOfDesign01PostMain'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

onMounted(async () => {
  Session.set(sessionIsVisitedKey, true)
})

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}

/**
 * @function gotoRules
 * @description 前往活动规则页面
 * @returns {void}
 */
function gotoRules(): void {
  window.location.href =
    'https://test.nie.163.com/test_html/sky/2024/hmj//#index'
}
</script>

<style lang="scss" scoped>
$font-color: #5a7191;
$font-family-bold: 'Source Han Sans CN Medium';

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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
}
.page {
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
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-main/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 180px;
  top: 3px;
  width: 1060px;
  height: 241px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/title.png');
}
.sub-title {
  position: absolute;
  left: 220px;
  top: 170px;
  width: 720px;
  height: 108px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-main/sub-title.png');
}
.help {
  position: absolute;
  right: -67px;
  top: 32px;
  width: 47px;
  height: 49px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/help.png');
}
.my-work {
  text-align: center;
  border-top-left-radius: 38px;
  border-bottom-left-radius: 38px;
  width: 240px;
  height: 76px;
  line-height: 76px;
  font-size: 34px;
  color: $font-color;
  background-color: #eaf5f2;
  box-shadow: 0 6px 6px rgba(108, 108, 108, 0.12);

  &::before {
    position: absolute;
    content: '';
    left: 5px;
    top: 5px;
    border: 2px solid #fff;
    border-top-left-radius: 33px;
    border-bottom-left-radius: 33px;
    border-right: 0;
    width: 235px;
    height: 66px;
  }
}
.btn {
  font-weight: $font-family-bold;
  font-size: 40px;
  color: $font-color;
  width: 330px;
  height: 96px;
  line-height: 96px;
  text-align: center;
  box-shadow: 0 6px 6px 0 rgba(81, 81, 81, 0.2);
}
.brush {
  position: absolute;
  right: 134px;
  bottom: 155px;
  width: 150px;
  height: 147px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-main/brush.png');
}
</style>
