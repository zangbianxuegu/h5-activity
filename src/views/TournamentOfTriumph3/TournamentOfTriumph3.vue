<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="tournament flex h-screen">
      <div class="tournament-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              心火相传辉煌落幕 8.11 全天开启！
            </h1>
            <h2 class="indent-[-9999px]">运动精神让心火更明亮</h2>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <div
              :class="[
                'task-item animate__animated animate__fadeIn bg-contain indent-[-9999px]',
                `${taskItem.status}`,
              ]"
              @click="handleReward(taskItem.value, taskItem.status)"
            >
              {{ taskItem.title }}
            </div>
          </section>
        </Transition>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span>2024年8月11日全天
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            8月11日当天参与<span class="text-[#ffcb4d]">闭幕式</span
            >即可获得<span class="text-[#ffcb4d]">蜡烛*2</span>；
          </p>
        </template>
      </activity-modal>
      <!-- 奖励弹框 -->
      <activity-modal ref="modalReward">
        <template #content>
          <p class="modal-text">
            恭喜你获得
            <span class="modal-text-blue"
              >{{ rewardsText[curRewards.name as keyof RewardsName] }} *
              {{ curRewards.count }}</span
            >：
          </p>
          <div class="mt-10 flex items-center justify-center">
            <img
              width="80"
              height="80"
              class="modal-reward"
              :src="rewardImageSrc"
              alt="reward"
            />
          </div>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { DesignConfig, Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/tournamentOfTriumph3'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  candles: string
}
const rewardsText: RewardsName = {
  candles: '蜡烛',
}
const curRewards: Ref<Rewards> = ref({
  name: '蜡烛',
  count: 2,
})

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

const EVENT = 'activitycenter_tournament_of_triumph_3'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const isRewardImageLoaded = ref(false)
const rewardImageSrc = ref(handleSrc(String(curRewards.value.name)))
// 闭幕式任务
const taskItem = computed(() => {
  const task = activityData.value.event_data[EVENT][0]
  return {
    title: '参加1次闭幕式',
    value: 'activitycenter_tournament_of_triumph_3_reward',
    status:
      task.award[0] === 1
        ? 'redeemed'
        : task.award[0] === 0 && task.value >= task.stages[0]
          ? 'can'
          : 'wait',
  }
})

const isVisited = Session.get('isVisitedTournamentOfTriumph3')
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
  Session.set('isVisitedTournamentOfTriumph3', true)
})

/**
 * @function 显示帮助
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 处理 img src
 * @param name 奖励名
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href
  return imgSrc
}

/**
 * @function 预加载图片
 * @param src 图片路径
 */
function preLoadImage(src: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve()
    }
  })
}

/**
 * @function 是否已领奖
 * @param tasks 任务列表
 */
function hasClaimedReward(tasks: Event[]): boolean {
  // 检查第2项
  const taskValid =
    (tasks[0].value === 0 && tasks[0].award[0] === 0) ||
    (tasks[0].value >= 1 && tasks[0].award[0] === 1)
  return taskValid
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const isClaimedReward = hasClaimedReward(activityData.value.event_data[EVENT])
  menuStore.updateMenuDataByIsClaimedReward(EVENT, isClaimedReward)
}

/**
 * @function 获取任务进度
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT })
    .then((res) => {
      activityStore.updateActivityData(res.data)
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param status 状态
 */
function handleReward(task: string, status: string): void {
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT,
    task,
    rewardId: 1,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 让图片先加载再展示
      isRewardImageLoaded.value = false
      rewardImageSrc.value = handleSrc(String(curRewards.value.name))
      await preLoadImage(rewardImageSrc.value)
      isRewardImageLoaded.value = true
      modalReward.value?.openModal()

      // 更新页面数据
      activityData.value.event_data[EVENT][0].award[0] = 1
      // 更新红点
      setRedDot()
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
.tournament {
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
    background-image: url('@/assets/images/tournament-of-triumph-3/bg.jpg');
  }
}
.header {
  position: relative;
  left: 318px;
  top: 172px;
  width: 1401px;
}
.title {
  width: 1401px;
  height: 183px;
  background-image: url('@/assets/images/tournament-of-triumph-3/title.png');
}
.help {
  position: absolute;
  right: -20px;
  top: 34px;
  width: 93px;
  height: 93px;
  background-image: url('@/assets/images/tournament-of-triumph-3/help.png');
}
.task-item {
  position: absolute;
  right: 368px;
  top: 380px;
  width: 334px;
  height: 360px;

  &.wait {
    background-image: url('@/assets/images/tournament-of-triumph-3/task-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/tournament-of-triumph-3/task-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/tournament-of-triumph-3/task-redeemed.png');
  }
}
</style>
