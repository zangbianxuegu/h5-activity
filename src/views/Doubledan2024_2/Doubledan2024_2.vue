<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="doubledan flex h-screen">
      <div class="doubledan-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title bg-contain bg-no-repeat">
            <div class="sr-only">
              落入奇遇茶会
              <p>
                <time datetime="2024-12-24">12.24</time>-
                <time datetime="2025-1-7">1.7</time>
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
                class="task-list-item relative flex w-[252px] flex-col items-center"
              >
                <div
                  class="task-item-tag"
                  v-if="index === 3 && item.status === TaskStatus.NOSTART"
                >
                  25日解锁
                </div>
                <div
                  class="relative"
                  :aria-label="`任务 ${index + 1}: ${item.title}`"
                >
                  <!-- 圆 -->
                  <div
                    :class="[
                      'task-item animate__animated animate__fadeIn relative z-10',
                      `task-item${index + 1}`,
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
                  :class="[
                    'w-full whitespace-pre-line text-wrap text-center text-[30px] leading-tight',
                    `${
                      item.status === 'can'
                        ? 'mt-[47px] text-[#ffeea9]'
                        : item.status === 'redeemed' ||
                            item.status === 'overdue'
                          ? 'mt-[4px] text-[#bebebe]'
                          : 'mt-[47px] text-white'
                    }`,
                  ]"
                >
                  {{ item.title }}
                </p>
              </li>
            </ul>
            <!-- 收集雪花代币 -->
            <h2 id="accTaskListHeading" class="sr-only">收集雪花代币</h2>
            <div class="acc-task-container">
              <div class="acc-task-title">
                <p class="text-[40px] text-[#fff]">收集雪花代币</p>
                <span class="text-[#f9ff92]">
                  （{{ rewardTokenCoin.currentCount }}/{{
                    rewardTokenCoin.targetCount
                  }}）
                </span>
              </div>
              <ul class="ml-[364px] flex" aria-labelledby="accTaskListHeading">
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="relative mt-[26px]"
                  :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                >
                  <Bubble
                    :reward="item"
                    :bubble-scale="1.3"
                    :bounce-class="`${item.taskId}-${item.id}`"
                  >
                    <div
                      :class="[
                        'acc-task-item animate__animated animate__fadeIn relative z-10',
                        `acc-task-item${index + 1}`,
                        `${item.status}`,
                      ]"
                      @click.capture="handleReward($event, index + 1, item)"
                    ></div>
                  </Bubble>
                  <p
                    class="absolute bottom-[0px] w-full text-center text-[28px] leading-tight"
                    :class="{
                      'text-white': item.status === 'wait',
                      'text-[#ffeea9]': item.status === 'can',
                      'text-[#bebebe]': item.status === 'redeemed',
                    }"
                  >
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
            <section aria-labelledby="activity-rules-title" class="px-4">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年12月24日~2025年1月7日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，在茶桌收获烛火，即可领取
                  <span class="text-[#ffcb4d]">漂浮魔法*1</span>
                </li>
                <li>
                  活动期间，累计收集雪花代币达到指定数量，即可领取
                  <span class="text-[#ffcb4d]"
                    >传信纸船*1，彩虹尾迹*1，爱心*1</span
                  >
                </li>
                <li>
                  活动期间，完成任意一次帮助瞌睡海牛的代币任务，即可领取
                  <span class="text-[#ffcb4d]">小不点*1</span>
                </li>
                <li>
                  活动期间，完成任意一次帮助帽匠的代币任务，即可领取
                  <span class="text-[#ffcb4d]">返老还童*1</span>
                </li>
                <li>
                  12月25日，在茶桌领取宴会节奶奶的礼物，即可领取
                  <span class="text-[#ffcb4d]"
                    >爱丽丝围裙套装礼包试用魔法*1</span
                  >
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
import { Session } from '@/utils/storage'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { animateBounce, animateBounceEase } from '@/utils/utils'
import Bubble from '@/components/Bubble/Bubble.vue'
import {
  type TaskItem,
  type Reward,
  EVENT_NAME,
  ACC_TASK_INDEX,
  ACC_TASK_VALUE,
  TaskStatus,
  REWARD_TEXT,
  createTaskList,
  createAccTaskList,
} from './config'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/doubledan2024_2'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
const curRewards: Ref<Reward> = ref({
  name: 'gravity',
  count: 1,
})

// 主任务列表
const TASK_LIST = createTaskList()
// 累计任务列表
const ACC_TASK_LIST = createAccTaskList()

// 收集代币进度
const rewardTokenCoin = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][ACC_TASK_INDEX]
  const targetCount = 50
  return {
    currentCount: Math.min(activity.value, targetCount),
    targetCount,
  }
})

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

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
    let status = getTaskStatus(activity, 0)
    // 特定任务ID的特殊状态处理
    if (item.taskId === 'activitycenter_doubledan_2024_m5') {
      if (dateStatus.value === 'nostart') {
        status = TaskStatus.NOSTART
      } else if (dateStatus.value === 'overdue' && status === TaskStatus.WAIT) {
        status = TaskStatus.OVERDUE
      }
    }
    return {
      ...item,
      status,
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

// 当前日期状态
type DateStatus = 'nostart' | 'ongoing' | 'overdue'
function checkTodayAgainstDateRange(data: string, curDate: number): DateStatus {
  const [start, end] = data.split('-').map((date) => date.split('.'))
  // 解析给定的日期范围
  const startMonth = parseInt(start[0], 10)
  const startDay = parseInt(start[1], 10)
  const endMonth = parseInt(end[0], 10)
  const endDay = parseInt(end[1], 10)

  // 获取服务器时间
  const today = new Date(curDate)
  const currentMonth = today.getMonth() + 1 // 月份从0开始计数，需要加1
  const currentDay = today.getDate()
  // 判断当前日期是否在范围内
  if (
    currentMonth < startMonth ||
    (currentMonth === startMonth && currentDay < startDay)
  ) {
    return 'nostart' // 未到时间
  }
  if (
    currentMonth > endMonth ||
    (currentMonth === endMonth && currentDay > endDay)
  ) {
    return 'overdue' // 已过期
  }
  return 'ongoing' // 正在进行
}
const dateStatus = ref<DateStatus>('nostart')

const sessionIsVisitedKey = 'isVisitedDoubleDan2024_2'
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

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
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
  // 检查1-4项，任务列表
  const tasksValid = tasks
    .slice(0, ACC_TASK_INDEX)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  // 检查第5项，累计任务
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
      dateStatus.value = checkTodayAgainstDateRange(
        '12.25-12.25',
        Number(data.current_time) * 1000,
      )
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param rewardId 第几个奖励节点
 * @returns {void}
 */
function handleReward(
  event: MouseEvent,
  rewardId: number,
  item: TaskItem,
): void {
  const { status, taskId } = item
  if (status === TaskStatus.NOSTART) {
    showToast('任务还未解锁')
    const target = event.target
    if (target && target instanceof HTMLElement) {
      animateBounce(target)
    }
    return
  }
  if (status === TaskStatus.OVERDUE) {
    showToast('任务已过期')
    return
  }
  if (status === TaskStatus.REDEEMED) {
    return
  }
  if (status === TaskStatus.WAIT) {
    showToast('任务还未完成')
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
      activityStore.updateActivityData(activityData.value)
      showToast(
        `领取成功，您获得了 ${
          REWARD_TEXT[curRewards.value.name as keyof typeof REWARD_TEXT]
        }*${curRewards.value.count}`,
      )
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖气泡动画
 * @param {MouseEvent} event 鼠标事件
 * @param {TaskItem} reward 领奖项
 * @returns {Promise<void>}
 */
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

/**
 * @function 初始化可领奖动画
 * @param {TaskItem} reward 任务项
 * @returns {void}
 */
const initCanRewardLottie = (reward: TaskItem): void => {
  reward.canRewardLottieRef?.value[0].initLottie()
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    reward.hadRenderLottie.value = true
  }
}

const handleInitTask = (task: TaskItem): void => {
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
  taskList.value.forEach(handleInitTask)
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
.doubledan {
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
    background-image: url('@/assets/images/doubledan-2024-2/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 114px;
  top: 112px;
  width: 1000px;
  height: 189px;
  background-image: url('@/assets/images/doubledan-2024-2/title.png');
}
.help {
  position: absolute;
  width: 73px;
  height: 73px;
  bottom: 4px;
  right: 0px;
  background-image: url('@/assets/images/doubledan-2024-2/help.png');
  background-repeat: no-repeat;
}
.task-list {
  position: absolute;
  left: 110px;
  top: 300px;
  padding-top: 76px;
  padding-left: 60px;
  padding-right: 78px;
  justify-content: space-between;
  width: 1338px;
  height: 435px;
  background-image: url('@/assets/images/doubledan-2024-2/task-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.task-item {
  width: 195px;
  height: 190px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
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

  &.wait,
  &.nostart {
    background-image: url('@/assets/images/season24-sprint/task-wait-bg.png');
  }
  &.can {
    background-image: url('@/assets/images/season24-sprint/task-can-bg.png');
  }
  &.redeemed,
  &.overdue {
    display: none;
  }
}
.task-item-tag {
  position: absolute;
  top: -26px;
  z-index: 11;
  width: 165px;
  height: 42px;
  font-size: 30px;
  text-align: center;
  line-height: 42px;
  color: #fff;
  border-radius: 20px;
  background: #778ee0;
  pointer-events: none;
}

@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait,
    &.nostart {
      background-image: url('@/assets/images/doubledan-2024-2/task-wait-circle.png'),
        url('@/assets/images/doubledan-2024-2/task#{$i}-icon.png');
    }
    &.redeemed {
      width: 252px;
      height: 232px;
      background-image: url('@/assets/images/doubledan-2024-2/task#{$i}-redeemed.png');
    }
    &.can {
      background-image: url('@/assets/images/doubledan-2024-2/task#{$i}-icon.png');
    }
  }
}
.task-item1.wait {
  background-size:
    contain,
    74px 99px;
}
.task-item2.wait {
  background-size:
    contain,
    85px 94px;
}
.task-item3.wait {
  background-size:
    contain,
    86px 90px;
}
.task-item4.wait,
.task-item4.nostart {
  background-size:
    contain,
    57px 107px;
}
.task-item1.can {
  background-size: 74px 99px;
}
.task-item2.can {
  background-size: 85px 94px;
}
.task-item3.can {
  background-size: 86px 90px;
}
.task-item4.can {
  background-size: 57px 107px;
}
.task-item4.overdue {
  width: 252px;
  height: 232px;
  background-image: url('@/assets/images/doubledan-2024-2/task4-overdue.png');
}
.acc-task-container {
  position: absolute;
  left: 90px;
  bottom: 126px;
  width: 1174px;
  height: 263px;
  background-image: url('@/assets/images/doubledan-2024-2/acc-task-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.acc-task-title {
  position: absolute;
  left: 90px;
  bottom: 50px;
  font-size: 32px;
  text-align: center;
}

.acc-task-item {
  width: 256px;
  height: 211px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
@for $i from 1 through 3 {
  .acc-task-item#{$i} {
    &.can {
      background-image: url('@/assets/images/doubledan-2024-2/acc-task#{$i}-can.png');
    }
    &.wait {
      background-image: url('@/assets/images/doubledan-2024-2/acc-task#{$i}-wait.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/doubledan-2024-2/acc-task#{$i}-redeemed.png');
    }
  }
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
