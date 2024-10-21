<template>
  <div class="double-eleven">
    <div class="double-eleven-main">
      <Transition appear :name="headTransitionName" mode="out-in">
        <h1
          class="title relative h-full overflow-hidden bg-contain bg-no-repeat"
        >
          <div class="sr-only">
            魔法畅享
            <p>
              <time datetime="2024-10-26">11.11</time>-
              <time datetime="2024-11-15">11.17</time>
            </p>
          </div>
          <div class="help cursor-pointer bg-contain" @click="handleHelp"></div>
        </h1>
      </Transition>
      <!-- 活动规则弹框 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <section
            aria-labelledby="activity-rules-title"
            class="h-[680px] overflow-y-scroll p-4"
          >
            <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
            <h3 class="modal-text">
              <span class="font-semibold">活动时间：</span>
              2024年11月11日~2024年11月17日
            </h3>
            <h3 class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </h3>
            <ul class="modal-text list-inside list-decimal">
              <li>
                活动期间，在魔法商店兑换魔法将100%获得“再来一瓶”且消耗变为蜡烛（买一送一）；
              </li>
              <li>
                活动期间，先祖将每天为旅人们带来不同主题的好礼相送：<br />
                <span>11月11日：【能量不断电】可免费领取</span
                ><span class="text-[#ffcb4d]">光能药剂、元气满满</span><br />
                <span>11月12日：【畅聊不受限】可免费领取</span
                ><span class="text-[#ffcb4d]">篝火、秋千、畅谈长桌</span><br />
                <span>11月13日：【美丽新体验】可免费领取</span
                ><span class="text-[#ffcb4d]">浪漫烟花、璀璨之星、彩虹</span
                ><br />
                <span>11月14日：【能量不断电】可免费领取</span
                ><span class="text-[#ffcb4d]">光能药剂、元气满满</span><br />
                <span>11月15日：【畅聊不受限】可免费领取</span
                ><span class="text-[#ffcb4d]">篝火、秋千、畅谈长桌</span><br />
                <span>11月16日：【美丽新体验】可免费领取</span
                ><span class="text-[#ffcb4d]">浪漫烟花、璀璨之星、彩虹</span
                ><br />
                <span>11月17日：【体型随心变】可免费领取</span
                ><span class="text-[#ffcb4d]"
                  >体型重塑、小不点、大只佬、返老还童、长大成人</span
                ><br />
                <span>旅人们每日可在魔法商店免费领取以上魔法，每个魔法</span
                ><span class="text-[#ffcb4d]">每天可领取2次，每次2个</span>
              </li>
            </ul>
          </section>
        </template>
      </activity-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DesignConfig } from '@/types'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'

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
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

const sessionIsVisitedKey = 'isVisitedDoubleEleven2024-2'
const isVisited = Session.get(sessionIsVisitedKey)
const headTransitionName = ref('')
if (!isVisited) {
  headTransitionName.value = 'fade-in-head'
}

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
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
.double-eleven {
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
    background-image: url('@/assets/images/double-eleven-2024-1/bg.jpg');
  }
}
.help {
  position: absolute;
  width: 55px;
  height: 55px;
  right: 250px;
  top: 28px;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/double-eleven-2024-1/help.png');
}
</style>
