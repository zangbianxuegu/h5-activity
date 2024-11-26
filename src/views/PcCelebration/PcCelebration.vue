<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="pc-celebration flex h-screen">
      <div class="pc-celebration-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title relative h-full overflow-hidden bg-contain bg-no-repeat"
          >
            <div class="sr-only">
              相遇在更广阔的天空下
              <p>
                <time datetime="2024-12-6">12.6</time>-
                <time datetime="2024-2-17">2.17</time>
              </p>
            </div>
            <div
              class="help cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 奖励 -->
            <h2 class="sr-only">奖励</h2>
            <div class="star"></div>
            <div class="reward-container clear-both flex bg-cover">
              <bubble
                :reward="taskItem"
                :bubbleScale="1.9"
                :bounce-class="`${taskItem.taskId}-${taskItem.id}`"
              >
                <div
                  :class="[
                    'reward-item animate__animated animate__fadeIn bg-contain',
                    `${taskItem.status}`,
                  ]"
                  @click="handleReward(1, taskItem)"
                ></div>
              </bubble>
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
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import { useMenuStore } from '@/stores/menu'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { useActivityStore } from '@/stores/pcCelebration'
import { REWARD_MAP } from '@/constants/rewardMap'
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import ModalHelp from './components/ModalHelp.vue'
import Bubble from '@/components/Bubble'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

interface Rewards {
  name: string
  count: number
}

/**
 * hadRenderLottie: 是否渲染过lottie（解决因computed和watch多次更新导致多次渲染lottie）
 */
interface Reward {
  id: number
  taskId: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

// 主任务列表
const TASK_ITEM = {
  id: 1,
  taskId: 'activitycenter_pc_celebration_m1',
  title: '领光标发饰',
  status: 'wait',
  canRewardLottieRef: ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie: ref(false),
}

// 弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_pc_celebration'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

const curRewards: Ref<Rewards[]> = ref([
  {
    name: 'CharSkyKid_Horn_CursorHairpin',
    count: 1,
  },
])

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// 任务列表
const taskItem = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][0]
  const { award, value, stages } = activity
  return {
    ...TASK_ITEM,
    status: getTaskStatus(award[0], value, stages[0]),
  }
})

const sessionIsVisitedKey = 'isVisitedPcCelebration'
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
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}
/**
 * @function 是否已领奖
 * @param tasks 任务列表
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  return tasks.some((task) => {
    return task.stages.some(
      (item, index) => task.value >= item && task.award[index] === 0,
    )
  })
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(eventData.value)
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

/**
 * @function 获取任务进度
 * @returns {void}
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      // 更新缓存活动数据
      activityStore.updateActivityData(res.data)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(rewardId: number, item: Reward): void {
  const { taskId, status } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      curRewards.value = res.data.rewards
      // 更新页面数据
      const taskIndex = eventData.value.findIndex(
        (item) => item.task_id === taskId,
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      showToast(
        '领取成功，您获得了' +
          curRewards.value.map(
            (item) =>
              ` ${REWARD_MAP[item.name as keyof typeof REWARD_MAP]}*${item.count}`,
          ),
      )
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
.pc-celebration {
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
    background-image: url('@/assets/images/pc-celebration/bg.jpg');
  }
}
.help {
  position: absolute;
  width: 61px;
  height: 61px;
  top: 68px;
  right: 384px;
  background-image: url('@/assets/images/pc-celebration/help.png');
  background-repeat: no-repeat;
}
.star {
  position: absolute;
  left: 970px;
  top: 400px;
  width: 316px;
  height: 214px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url('@/assets/images/pc-celebration/star.png');
  z-index: 20;
}
.reward-container {
  position: absolute;
  left: 990px;
  top: 400px;
}
.reward-item {
  width: 260px;
  height: 240px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.wait {
    background-image: url('@/assets/images/pc-celebration/task-wait.png');
  }
  &.can {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/pc-celebration/task-can.png');
  }
  &.redeemed {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/pc-celebration/task-redeemed.png');
  }
}
</style>
