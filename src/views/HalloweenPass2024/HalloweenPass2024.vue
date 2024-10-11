<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="halloween flex h-screen">
      <div class="halloween-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <section>
            <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
              <div class="sr-only">
                魔法坩埚 惊喜无限
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
          </section>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="">
            <button type="button" class="btn bg-transparent bg-cover">
              <span class="sr-only">抽取礼物</span>
            </button>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section class="px-4" aria-labelledby="activity-rules-title">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text mt-4">
                <span class="font-semibold">活动时间：</span>
                2024年10月26日~2024年11月15日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <p>活动期间，玩家可以使用捣蛋挖宝次数进行挖宝：</p>
              <ul class="modal-text list-inside list-decimal">
                <li>每次挖宝均可获得10捣蛋币的奖励</li>
                <li>
                  挖出宝藏可获得额外捣蛋币奖励，对应奖励如
                  <div class="grid grid-cols-3">
                    <span>宝藏：</span>
                    <span class="col-span-2">奖励</span>
                    <span>糖果</span>
                    <span class="col-span-2 text-[#ffcb4d]">20</span>
                    <span>皮皮猫</span>
                    <span class="col-span-2 text-[#ffcb4d]">80</span>
                    <span>螃蟹</span>
                    <span class="col-span-2 text-[#ffcb4d]">30</span>
                    <span>冥龙</span>
                    <span class="col-span-2 text-[#ffcb4d]">100</span>
                    <span>南瓜螃蟹</span>
                    <span class="col-span-2 text-[#ffcb4d]">50</span>
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
import { showToast } from 'vant'
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { getPlayerMissionData } from '@/utils/request'
import { useActivityStore } from '@/stores/halloweenTreasure2024'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
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

// 活动数据
const EVENT_NAME = 'activitycenter_Halloweentreasure_2024'
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
console.log('activityData: ', activityData)

const sessionIsVisitedKey = 'isVisitedHalloweentreasure2024'
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
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function getActivityData
 * @description 获取任务进度
 * @returns {void}
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT_NAME]: data.event_data[EVENT_NAME],
        },
      }
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
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
    background-image: url('@/assets/images/halloween-pass-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 52px;
  top: 48px;
  width: 647px;
  height: 414px;
  background-image: url('@/assets/images/halloween-pass-2024/title.png');
}
.help {
  position: absolute;
  width: 109px;
  height: 109px;
  left: 538px;
  top: 300px;
  background-image: url('@/assets/images/halloween-pass-2024/help.png');
}
.btn {
  position: absolute;
  left: 50%;
  bottom: 65px;
  transform: translate3d(-50%, -50%, 0);
  width: 423px;
  height: 142px;
  background-image: url('@/assets/images/halloween-pass-2024/btn.png');
}
</style>
