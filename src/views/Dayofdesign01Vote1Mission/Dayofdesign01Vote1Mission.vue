<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div class="h-full w-full">
        <Transition appear :name="headTransitionName" mode="out-in">
          <header class="design-header relative">
            <h1 class="title relative h-full">
              <div class="sr-only">
                取票站
                <p>
                  <time datetime="2025-2-1">2.1</time>-
                  <time datetime="2025-2-16">2.16</time>
                </p>
              </div>
              <div
                class="help cursor-pointer bg-contain"
                @click="handleHelp"
              ></div>
            </h1>
          </header>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 奖励 -->
            <h2 class="sr-only">奖励</h2>
            <div class="reward-container flex items-center justify-center">
              <bubble
                :reward="taskItem"
                :bubbleScale="2.3"
                :bounce-class="`${taskItem.taskId}`"
              >
                <div
                  :class="[
                    'reward-item animate__animated animate__fadeIn',
                    `${taskItem.status}`,
                  ]"
                  @click="handleReward(1, taskItem)"
                ></div>
              </bubble>
            </div>
            <div class="character"></div>
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
import { useActivityStore } from '@/stores/pcCelebration'
import { REWARD_MAP } from '@/constants/rewardMap'
import ModalHelp from './components/ModalHelp.vue'
import Bubble from '@/components/Bubble'
import {
  EVENT_NAME,
  type TaskItem,
  type Reward,
  createTaskItem,
  SESSION_IS_VISITED_KEY,
} from './config'
import { useTransition } from '@/composables/useTransition'

const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransition(SESSION_IS_VISITED_KEY)

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
      activityData.value.event_data[EVENT_NAME][0].award[rewardId - 1] = 1
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
  // 使用some方法遍历任务列表，对每个任务的阶段进行检查
  return tasks.some((task) => {
    // 判断任务值是否达到或超过当前阶段要求，且奖励未领取
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
.page {
  padding-left: 460px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/bg.jpg');
}
.title {
  position: absolute;
  left: 120px;
  top: 130px;
  width: 685px;
  height: 163px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/title.png');
  background-size: cover;
}
.help {
  position: absolute;
  width: 83px;
  height: 84px;
  top: 54px;
  right: -60px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/help.png');
  background-repeat: no-repeat;
}
.reward-container {
  position: absolute;
  left: 600px;
  top: 20%;
  height: 458px;
  width: 1485px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/top-reward-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.character {
  position: absolute;
  width: 557px;
  height: 605px;
  bottom: 50px;
  right: 0;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/character.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.reward-item {
  width: 208px;
  height: 208px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.wait {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/task-wait.png');
  }
  &.can {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/task-can.png');
  }
  &.redeemed {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/task-redeemed.png');
  }
}
</style>
