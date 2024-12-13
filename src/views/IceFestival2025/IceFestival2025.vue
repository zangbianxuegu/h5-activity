<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="icefestival2025 flex h-screen">
      <div class="icefestival2025-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative bg-contain bg-no-repeat">
            <div class="sr-only">
              创造！冰雪大世界！
              <p>
                <time datetime="2025-1-07">1.7</time>-
                <time datetime="2025-1-20">1.20</time>
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
            <!-- 任务列表 -->
            <h2 id="taskListHeading" class="sr-only">任务列表</h2>
            <ul class="task-list flex" aria-labelledby="taskListHeading">
              <li
                v-for="(item, index) in taskList"
                :key="item.id"
                class="task-item relative flex flex-col items-center"
              >
                <div
                  class="relative"
                  :aria-label="`任务 ${index + 1}: ${item.title}`"
                >
                  <!-- 圆 -->
                  <div
                    :class="[
                      'task-icon animate__animated animate__fadeIn relative z-10',
                      `task-icon${index + 1}`,
                      `${item.status}`,
                    ]"
                    @click.capture="handleReward($event, 1, item)"
                  ></div>
                  <can-reward-bubble-animation
                    :ref="item.canRewardLottieRef"
                    :id="item.id"
                    class="reward-can-dynamic-bubble z-0"
                  ></can-reward-bubble-animation>

                  <!-- 托 -->
                  <div :class="['task-item-bg', `${item.status}`]"></div>
                </div>
                <p
                  class="leading-tight',w-[300px] whitespace-pre-line text-wrap text-center text-[30px]"
                  :class="[
                    `${
                      item.status === 'can'
                        ? 'mt-[47px] text-[#ffeea9]'
                        : item.status === 'redeemed'
                          ? 'mt-[4px] text-[#7f98a9]'
                          : 'mt-[47px] text-white'
                    }`,
                  ]"
                >
                  {{ item.title }}
                </p>
              </li>
            </ul>
            <!-- 累计点赞 -->
            <h2 id="accTaskListHeading" class="sr-only">
              累计给他人活动空间点赞
            </h2>
            <div class="acctask-container">
              <div class="acc-task-title"></div>
              <ul class="acc-task-list" aria-labelledby="accTaskListHeading">
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="relative mb-[22px]"
                  :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                >
                  <Bubble
                    :reward="item"
                    :bubble-scale="1.3"
                    :bounce-class="`${item.taskId}-${item.id}`"
                  >
                    <div
                      :class="[
                        'acc-task-icon animate__animated animate__fadeIn relative z-10',
                        `acc-task-icon${index + 1}`,
                        `${item.status}`,
                      ]"
                      @click.capture="handleReward($event, index + 1, item)"
                    ></div>
                  </Bubble>

                  <p class="acc-task-item-title">
                    {{ item.title }}
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section
              aria-labelledby="activity-rules-title"
              class="h-[680px] overflow-y-scroll px-4"
            >
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2025年1月7日~2025年1月20日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间参与共享空间创作，为他人点赞以及获得点赞均可获得对应奖励。
                </li>
                <li>
                  在活动专属共享空间神坛
                  <span class="text-[#ffcb4d]">成功创建任意共享空间作品</span
                  >，即可赢取
                  <span class="text-[#ffcb4d]">璀璨之星*2</span>
                </li>
                <li>
                  <span class="text-[#ffcb4d]">累计1天</span>
                  给他人的活动共享空间点赞，即可赢取
                  <span class="text-[#ffcb4d]">共享空间*2</span>
                </li>
                <li>
                  <span class="text-[#ffcb4d]">累计3天</span>
                  给他人的活动共享空间点赞，即可赢取
                  <span class="text-[#ffcb4d]">元气满满*2</span>
                </li>
                <li>
                  <span class="text-[#ffcb4d]">累计5天</span>
                  给他人的活动共享空间点赞，即可赢取
                  <span class="text-[#ffcb4d]">彩虹尾迹*2</span>
                </li>
                <li>
                  自己的活动共享空间作品
                  <span class="text-[#ffcb4d]">获得任意一个点赞</span>，
                  即可赢取
                  <span class="text-[#ffcb4d]">爱心*1</span>
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
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { Event } from '@/types'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { animateBounce, animateBounceEase } from '@/utils/utils'
import {
  type TaskItem,
  type Reward,
  EVENT_NAME,
  ACC_TASK_VALUE,
  ACC_TASK_INDEX,
  SESSION_IS_VISITED_KEY,
  TaskStatus,
  createTaskList,
  createAccTaskList,
} from './config'
import { REWARD_MAP } from '@/constants/rewardMap'
import { useTransitions } from './composables/useTransition'
import { useActivityStore } from '@/stores/iceFestival2025'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import Bubble from '@/components/Bubble/Bubble.vue'
const curRewards: Ref<Reward> = ref({
  name: 'glow',
  count: 2,
})

// 主任务列表
const TASK_LIST = createTaskList()
// 累计任务列表
const ACC_TASK_LIST = createAccTaskList()

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()
const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransitions(SESSION_IS_VISITED_KEY)

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.taskId, index]),
)

// 获取任务状态
const getTaskStatus = (activity: Event, index: number): TaskStatus => {
  const { award, value, stages } = activity
  if (award?.[index] === 1) return TaskStatus.REDEEMED
  if (award?.[index] === 0 && value >= stages?.[index]) return TaskStatus.CAN
  return TaskStatus.WAIT
}

// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT_NAME][index]
    return {
      ...item,
      status: getTaskStatus(activity, 0),
    }
  })
})

// 累计任务列表
const accTaskList = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][ACC_TASK_INDEX]
  return ACC_TASK_LIST.map((item, index) => {
    return {
      ...item,
      status: getTaskStatus(activity, index),
    }
  })
})

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
})

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-2 项，任务列表
  const tasksValid = tasks
    .slice(0, ACC_TASK_INDEX)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  // 检查第3项，累计任务
  const accTask = tasks[ACC_TASK_INDEX]
  const accTasksValid = accTask.stages.some(
    (stage, index) => accTask.value >= stage && accTask.award[index] === 0,
  )
  return tasksValid || accTasksValid
}

/**
 * @function 设置红点
 * @returns {void}
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(
    activityData.value.event_data[EVENT_NAME],
  )
  console.log('hasUnclaimedReward: ', hasUnclaimedReward)
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

/**
 * @function 获取任务进度
 * @returns {void}
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT_NAME]: data.event_data[EVENT_NAME].sort(
            (a: Event, b: Event) => {
              const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
              const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
              return orderA - orderB
            },
          ),
        },
      }
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function handleReward
 * @description 领奖
 * @param event 事件对象
 * @param rewardId 第几个奖励节点
 * @param item 任务项
 * @returns {void}
 */
function handleReward(
  event: MouseEvent,
  rewardId: number,
  item: TaskItem,
): void {
  const { status, taskId } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    const target = event.target
    if (target && target instanceof HTMLElement) {
      animateBounce(target)
    }
    return
  }

  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      curRewards.value = res.data.rewards[0]
      if (taskId !== ACC_TASK_VALUE) {
        // 领奖动画
        await bubbleBurst(event, item)
      }
      // 更新页面数据
      const taskIndex = activityData.value.event_data[EVENT_NAME].findIndex(
        (item) => {
          return item.task_id === taskId
        },
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      showToast(
        `领取成功，您获得了 ${
          REWARD_MAP[curRewards.value.name as keyof typeof REWARD_MAP]
        }*${curRewards.value.count}`,
      )
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

const initCanRewardLottie = (reward: TaskItem): void => {
  reward.canRewardLottieRef?.value[0].initLottie()
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    reward.hadRenderLottie.value = true
  }
}

const handleTask = (task: TaskItem): void => {
  if (task.status === TaskStatus.CAN) {
    void nextTick(() => {
      if (task.hadRenderLottie && !task.hadRenderLottie.value) {
        initCanRewardLottie(task)
      }
    })
  } else {
    task.canRewardLottieRef?.value?.[0]?.destroyAnimation()
  }
}

watchEffect(() => {
  taskList.value.forEach(handleTask)
})

const bubbleBurst = async (
  event: MouseEvent,
  reward: TaskItem,
): Promise<void> => {
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value[0].playAnimationClickBubble()
  }
  const target = event.target
  if (target && target instanceof HTMLElement) {
    await animateBounceEase(target)
  }
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
.icefestival2025 {
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
    background-image: url('@/assets/images/icefestival2025/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 200px;
  top: 50px;
  width: 808px;
  height: 259px;
  background-image: url('@/assets/images/icefestival2025/title.png');
}
.help {
  position: absolute;
  width: 76px;
  height: 76px;
  top: -4px;
  right: 10px;
  background-image: url('@/assets/images/icefestival2025/help.png');
  background-repeat: no-repeat;
}
.task-list {
  position: absolute;
  left: 354px;
  top: 408px;
}
.task-item {
  margin-top: 100px;
  margin-right: 50px;
  padding-top: 50px;
  width: 357px;
  height: 461px;
  background-image: url('@/assets/images/icefestival2025/task-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
}
.task-item + .task-item {
  margin-top: 0px;
}
.task-item-bg {
  position: absolute;
  left: -31px;
  bottom: -42px;
  z-index: 0;
  width: 252px;
  height: 164px;
  background-size: 252px 164px;
  background-position: center;
  pointer-events: none;

  &.wait {
    background-image: url('@/assets/images/icefestival2025/task-wait-bg.png');
  }
  &.can {
    background-image: url('@/assets/images/icefestival2025/task-can-bg.png');
  }
  &.redeemed {
    display: none;
  }
}
.task-icon {
  width: 195px;
  height: 190px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
@for $i from 1 through 2 {
  .task-icon#{$i} {
    &.wait {
      background-size:
        contain,
        240px 240px;
      background-image: url('@/assets/images/icefestival2025/task-wait-circle.png'),
        url('@/assets/images/icefestival2025/task#{$i}-icon.png');
    }
    &.redeemed {
      width: 240px;
      height: 240px;
      background-image: url('@/assets/images/icefestival2025/task#{$i}-redeemed.png');
    }
    &.can {
      background-size: 240px 240px;
      background-image: url('@/assets/images/icefestival2025/task#{$i}-icon.png');
    }
  }
}
.acctask-container {
  position: absolute;
  right: 48px;
  top: 164px;
}
.acc-task-title {
  width: 572px;
  height: 137px;
  background-image: url('@/assets/images/icefestival2025/acc-task-title.png');
  background-repeat: no-repeat;
  background-size: cover;
}
.acc-task-list {
  position: absolute;
  top: 94px;
  left: 140px;
}
.acc-task-icon {
  width: 253px;
  height: 199px;
  background-repeat: no-repeat;
  background-position: center;
}
@for $i from 1 through 3 {
  .acc-task-icon#{$i} {
    &.wait {
      background-size: contain;
      background-image: url('@/assets/images/icefestival2025/acc-task#{$i}-wait.png');
    }
    &.can {
      background-size: 256px 230px;
      background-image: url('@/assets/images/icefestival2025/acc-task#{$i}-icon.png');
    }
    &.redeemed {
      background-size: 138px 129px;
      background-image: url('@/assets/images/icefestival2025/acc-task#{$i}-redeemed.png');
    }
  }
}
.acc-task-item-title {
  position: absolute;
  left: 97px;
  bottom: 0px;
  width: 59px;
  height: 27px;
  font-size: 22px;
  line-height: 27px;
  text-align: center;
  color: #fff;
  background-image: url('@/assets/images/icefestival2025/acc-task-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
}
.reward-can-dynamic-bubble {
  width: 230px;
  height: 235px;
  position: absolute;
  top: -14px;
  left: -19px;
  pointer-events: none;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}
</style>
