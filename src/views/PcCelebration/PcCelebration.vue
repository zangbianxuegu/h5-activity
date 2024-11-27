<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="pc-celebration flex h-screen">
      <div class="pc-celebration-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative h-full">
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
            <!-- 光标发饰 -->
            <h2 class="sr-only">光标发饰</h2>
            <div class="star"></div>
            <div class="reward-container">
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
import { useMenuStore } from '@/stores/menu'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { useActivityStore } from '@/stores/pcCelebration'
import { REWARD_MAP } from '@/constants/rewardMap'
import ModalHelp from './components/ModalHelp.vue'
import Bubble from '@/components/Bubble'
import {
  EVENT_NAME,
  type TaskItem,
  type Reward,
  createTaskItem,
} from './config'
import { useTransitions } from './composables/useTransition'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()
const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransitions()

const TASK_ITEM = createTaskItem()

// 弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

const curRewards: Ref<Reward[]> = ref([
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

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
})

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
function handleReward(rewardId: number, item: TaskItem): void {
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
  right: 424px;
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
  pointer-events: none;
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
