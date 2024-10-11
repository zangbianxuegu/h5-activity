<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="halloween flex h-screen">
      <div class="halloween-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="relative h-full overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              不给糖果就捣蛋！
              <p>
                <time datetime="2024-10-26">10.26</time>-
                <time datetime="2024-11-15">11.15</time>
              </p>
            </div>
            <div
              class="help cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="daily-task-list">
            <h2 class="sr-only">每日任务</h2>
            <ul>
              <li class="text-white">任务</li>
            </ul>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section aria-labelledby="activity-rules-title">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年8月29日~2024年9月11日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，体验一次捉迷藏玩法，即可领取
                  <span class="text-[#ffcb4d]">篝火点心礼包试用魔法*2</span>
                </li>
                <li>
                  活动期间，使用一次沙滩球魔法，即可领取
                  <span class="text-[#ffcb4d]">沙滩弹球*2</span>
                </li>
                <li>
                  活动期间，兑换一件夏之日物品，即可领取
                  <span class="text-[#ffcb4d]">遥鲲泳圈试用魔法*2</span>
                </li>
                <li>
                  活动期间，累计登录5天，即可领取
                  <span class="text-[#ffcb4d]">体型重塑*2</span>
                </li>
                <li>
                  活动期间，收集夏之日代币，即可领取：
                  <div class="grid grid-cols-3">
                    <span>收集数目</span>
                    <span class="col-span-2">对应奖励</span>
                    <span>20个</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >璀璨之星魔法*1</span
                    >
                    <span>30个</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >夏日冲浪礼包试用魔法*1</span
                    >
                    <span>50个</span>
                    <span class="col-span-2 text-[#ffcb4d]">爱心*2</span>
                  </div>
                </li>
              </ul>
            </section>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
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
useResponsiveStyles(designConfig)

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
// const EVENT_NAME = 'activitycenter_halloweentask_2024'

const sessionIsVisitedKey = 'isVisitedHalloweentask2024'
const isVisited = Session.get(sessionIsVisitedKey)
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
    // getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

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
.halloween {
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
    background-image: url('@/assets/images/halloween-task-2024/bg.png');
  }
}
.help {
  position: absolute;
  width: 71px;
  height: 71px;
  top: 250px;
  right: 318px;
  background-image: url('@/assets/images/halloween-task-2024/help.png');
}
.daily-task-list {
  position: absolute;
  left: 410px;
  top: 420px;
  width: 1350px;
  height: 499px;
}
</style>
