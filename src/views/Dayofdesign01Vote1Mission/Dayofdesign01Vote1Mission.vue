<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div
        class="absolute bottom-0 left-0 right-0 top-0 m-auto flex h-full w-full flex-col items-center justify-center pl-[100px]"
      >
        <Transition appear :name="headTransitionName" mode="out-in">
          <header class="relative ml-[480px] self-start">
            <h1 class="title animate__animated animate__fadeIn relative h-full">
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
          <section
            class="animate__animated animate__fadeIn flex flex-col items-center"
          >
            <!-- 奖励 -->
            <div
              class="task-container flex items-center justify-center gap-x-[120px]"
            >
              <div
                v-for="(item, index) in taskList"
                :key="index"
                class="relative flex flex-col items-center"
              >
                <div
                  :class="[
                    'task-item animate__animated animate__fadeIn mb-[50px] mt-[40px]',
                    `${item.status}`,
                  ]"
                  @click="handleReward(1, item)"
                ></div>
                <div :class="['tray', `${item.status}`]"></div>
                <div
                  :class="[
                    'text-center text-[36px]',
                    {
                      'text-white': item.status === 'wait',
                      'text-[#ffeb9d]': item.status === 'can',
                      'text-[#dfe6f0]': item.status === 'redeemed',
                    },
                  ]"
                >
                  {{ item.title }}（{{ item.val }}/{{ item.stages[0] }}）
                </div>
              </div>
            </div>
            <!-- 累计奖励 -->
            <div class="acc-task mt-[50px] flex w-[1480px] justify-between">
              <div
                class="mt-[144px] h-[48px] w-[229px] rounded-[24px] bg-[#f1f1f1] text-center text-[36px] text-[#5a7091]"
              >
                累计投票
              </div>
              <div class="relative">
                <!-- 累计奖励 -->
                <ul class="flex w-[1150px] justify-between">
                  <li
                    v-for="(item, index) in accTaskList"
                    :key="item.id"
                    class="flex h-[230px] flex-col items-center justify-between"
                  >
                    <div
                      :class="['acc-task-item', item.status]"
                      @click="handleReward(index + 1, item)"
                    ></div>
                    <p
                      class="h-[30px] text-center text-[30px] leading-[36px] text-white"
                    >
                      {{ item.stages[0] }}次
                    </p>
                  </li>
                </ul>
                <!-- 进度条 -->
                <div
                  class="progress-container absolute right-0 top-[162px] w-[1220px]"
                >
                  <div
                    class="progress-bar"
                    :style="`width: ${accTaskValue > 100 ? 100 : accTaskValue}%;`"
                  ></div>
                </div>
              </div>
            </div>
            <!-- 按钮 -->
            <button
              type="button"
              class="btn mt-[60px] rounded-full bg-[#ffee91] font-medium text-[#836a4e]"
            >
              <RouterLink
                to="/dayofdesign01-post-submit"
                class="block h-full w-full"
              >
                前往投票
              </RouterLink>
            </button>
            <!-- 人物 -->
            <div class="character animate__animated animate__fadeIn"></div>
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
import { useActivityStore } from '@/stores/dayofdesign01Vote1Mission'
import { REWARD_MAP } from '@/constants/rewardMap'
import ModalHelp from './components/ModalHelp.vue'
import {
  EVENT_NAME,
  type TaskItem,
  type Reward,
  createTaskItemLiist,
  createBottomAccTaskList,
  SESSION_IS_VISITED_KEY,
} from './config'
import { useTransition } from '@/composables/useTransition'

const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransition(SESSION_IS_VISITED_KEY)

const TASK_LIST = createTaskItemLiist()
const ACC_TASK_LIST = createBottomAccTaskList()

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.taskId, index]),
)

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

// 更新任务列表状态
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const { award, value, stages } = eventData.value[index]
    return {
      ...item,
      val: value,
      stages,
      status: getTaskStatus(award[0], value, stages[0]),
    }
  })
})

// 更新累计任务列表状态
const accTaskList = computed(() => {
  return ACC_TASK_LIST.map((item, index) => {
    const { award, value, stages } = eventData.value[3]
    return {
      ...item,
      val: value,
      stages,
      status: getTaskStatus(award[index], value, stages[index]),
    }
  })
})

/**
 * @function 获取任务状态
 * @param award - 奖励状态，1表示已领取，0表示未领取
 * @param value - 当前任务完成值
 * @param stage - 任务目标值
 * @returns {string} 任务状态
 */
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed' // 如果奖励状态为1，表示已领取
  if (award === 0 && value >= stage) return 'can' // 如果奖励状态为0且当前值大于等于目标值，表示可以领取
  return 'wait' // 其他情况表示还在等待完成任务
}

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
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT_NAME]: data.event_data[EVENT_NAME].sort(
            (a: Event, b: Event) => {
              const orderA = taskOrderMap.get(a.task_id) as number
              const orderB = taskOrderMap.get(b.task_id) as number
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
      const rewards = res.data.rewards
      curRewards.value = rewards
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

/**
 * @function 适配累积值不等分的进度条，计算累积任务值
 * @param accTaskVal 累积任务值
 * @returns {number} 返回计算后的任务值
 * @description 根据累积任务值计算进度条的值
 */
function calculateAccTaskValue(accTaskVal: number): number {
  // 如果累积任务值大于等于50，直接返回100
  if (accTaskVal >= 50) return 100
  const ACC_TASK_VALUES: Readonly<Record<number, number>> = {
    0: 0,
    10: 12,
    20: 32,
    30: 53,
    40: 74,
    50: 100,
  }
  return ACC_TASK_VALUES[accTaskVal]
}

// 底部 进度：10,20,30,40,50
const accTaskValue = computed(() => {
  return calculateAccTaskValue(eventData.value[3].value)
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
.page {
  padding-left: 460px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/bg.jpg');
}
.title {
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
  right: -56px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/help.png');
  background-repeat: no-repeat;
}
.task-container {
  height: 458px;
  width: 1485px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/top-reward-bg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.task-container::after {
  content: '投票次数获取后仅当日有效';
  font-size: 34px;
  padding-top: 50px;
  padding-left: 30px;
  color: #5a7091;
  position: absolute;
  width: 476px;
  height: 134px;
  top: -130px;
  right: 0;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/bubble-bg.png');
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
.task-item {
  width: 208px;
  height: 208px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 10;
  &.wait {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/task-wait.png');
  }
  &.can {
    transition: background-image 1s ease;
    animation: pulse 2s ease-in-out infinite;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/task-can.png');
  }
  &.redeemed {
    width: 208px;
    height: 217px;
    transition: background-image 1s ease;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/task-redeemed.png');
  }
}
.tray {
  position: absolute;
  width: 257px;
  height: 134px;
  top: 156px;
  left: 0;
  right: 0;
  margin: auto;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.wait {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/tray-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/tray-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/tray-redeemed.png');
  }
}
.acc-task-item {
  width: 142px;
  height: 142px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.wait {
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/acc-task-wait.png');
  }
  &.can {
    animation: pulse 2s ease-in-out infinite;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/acc-task-can.png');
  }
  &.redeemed {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/acc-task-redeemed.png');
  }
}
.progress-container {
  height: 20px;
  background-color: #7abaaa;
  border-radius: 8px;
}
.progress-bar {
  height: 20px;
  background-color: #ffd871;
  border-radius: 8px;
  transition: width 0.4s ease;
  position: relative;
}
.progress-bar::after {
  content: '';
  position: absolute;
  right: -20px;
  top: -14px;
  height: 46px;
  width: 40px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote-mission/star.png');
  background-repeat: no-repeat;
  background-size: cover;
  transition: right 0.4s ease;
}
.btn {
  font-size: 36px;
  color: #836a4e;
  width: 430px;
  height: 87px;
  line-height: 87px;
  text-align: center;
  box-shadow: 0 6px 6px 0 rgba(81, 81, 81, 0.2);
}
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.01);
  }
  20% {
    transform: scale(1.02);
  }
  30% {
    transform: scale(1.03);
  }
  40% {
    transform: scale(1.04);
  }
  50% {
    transform: scale(1.05);
  }
  60% {
    transform: scale(1.04);
  }
  70% {
    transform: scale(1.03);
  }
  80% {
    transform: scale(1.02);
  }
  90% {
    transform: scale(1.01);
  }
  100% {
    transform: scale(1);
  }
}
</style>
