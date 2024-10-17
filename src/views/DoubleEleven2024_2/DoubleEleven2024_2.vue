<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="double-eleven flex h-screen">
      <div class="double-eleven-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title relative h-full overflow-hidden bg-contain bg-no-repeat"
          >
            <div class="sr-only">
              遇见惊喜
              <p>
                <time datetime="2024-10-26">11.11</time>-
                <time datetime="2024-11-15">11.17</time>
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
            <div class="task-list flex justify-between">
              <ul
                v-for="(Column, index) in taskColumns"
                :key="index"
                class="mb-2"
                aria-labelledby="taskListHeading"
              >
                <li
                  v-for="item in Column"
                  :key="item.value"
                  :class="[
                    'task-item-left mb-2 flex items-center justify-between',
                    `task-item-${index === 0 ? 'left' : 'right'}`,
                  ]"
                  :aria-label="`任务 ${index + 1}: ${item.title}`"
                >
                  <p class="ml-4 text-[42px] font-semibold text-[#2f6c5e]">
                    {{ item.title }}
                  </p>
                  <div
                    :class="[
                      'animate__animated animate__fadeIn animate__slow reward',
                      `${item.status}`,
                    ]"
                    @click="handleReward(item, 1)"
                  ></div>
                </li>
              </ul>
            </div>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <div class="absolute bottom-[140px] left-0 flex">
              <ul
                class="absolute bottom-0 left-[300px] top-0 m-auto flex w-[1590px] justify-between"
                aria-labelledby="accTaskListHeading"
              >
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="relative"
                >
                  <div
                    :class="[
                      'acc-task-item animate__animated animate__fadeIn flex items-end justify-center bg-contain',
                      `${item.status}`,
                    ]"
                    :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                    @click="handleReward(item, 1)"
                  ></div>
                  <p
                    class="auto absolute bottom-[-18px] left-0 right-0 rounded-3xl bg-white text-center text-[34px] text-[#f48100]"
                  >
                    {{ (index + 1) * 10 }}
                  </p>
                </li>
              </ul>
              <!-- <div class="acc-task-title"></div> -->
              <div :class="`progress-bar progress-bar${accTaskStep}`"></div>
            </div>
            <p class="tips"></p>
          </section>
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
                <li v-for="item in taskInfoList" :key="item.name">
                  活动期间，{{ item.name }}，即可领取
                  <span class="text-[#ffcb4d]"
                    >捣蛋挖宝次数*{{ item.count }}</span
                  >
                </li>
                <li>
                  活动期间，每日完成下列任务，可获得对应捣蛋挖宝次数：
                  <div class="grid grid-cols-4">
                    <span class="col-span-2">每日任务</span>
                    <span class="col-span-2">奖励</span>
                    <span class="col-span-2">获得1个活动代币</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span class="col-span-2">使用1次万圣节魔法</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span class="col-span-2">感受魔法大锅的洗礼</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span class="col-span-2">收集南瓜烛火</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                  </div>
                </li>
                <li>
                  活动期间，每周领取礼物螃蟹送出的魔法，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝次数*3</span>
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
import type { DesignConfig, Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/doubleEleven2024'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  ticket: string
}

interface Reward {
  id: number
  value: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
}

const rewardsText: RewardsName = {
  ticket: '捣蛋挖宝次数',
}

const curRewards: Ref<Rewards> = ref({
  name: 'ticket',
  count: 1,
})

const taskInfoList = [
  { name: '被骑扫帚的皮皮猫炸飞一次', count: 1 },
  { name: '找到戴帽子的螃蟹', count: 1 },
  { name: '成功击败怪物', count: 1 },
  { name: '逃脱滚动螃蟹的追击', count: 1 },
  { name: '使用【万圣节】代币兑换任意外观', count: 1 },
  { name: '触发扫帚制作间的陷阱', count: 1 },
  { name: '在活动场景的衣柜换装', count: 1 },
  { name: '完成一次魔法扫帚的练习', count: 2 },
  { name: '获得40个活动代币', count: 2 },
]

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
const EVENT_NAME = 'activitycenter_double_eleven_2024_2'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 创建任务的函数
const taskItem = (
  id: number,
  value: string,
  title: string,
  status = 'wait',
): Reward => ({
  id,
  value,
  title,
  status,
})

// 任务列表
const TASK_LIST = [
  taskItem(1, `${EVENT_NAME}_m1`, '赠送11次心火'),
  taskItem(2, `${EVENT_NAME}_m2`, '点赞11次纸船留言'),
  taskItem(3, `${EVENT_NAME}_m3`, '使用11次魔法商店的魔法'),
  taskItem(4, `${EVENT_NAME}_m4`, '收集11根季节蜡烛'),
  taskItem(5, `${EVENT_NAME}_m5`, '给11位好友赠送爱心'),
]

// 累计任务
const ACC_TASK_LIST: Reward[] = Array.from({ length: 5 }, (_, i) =>
  taskItem(i + 1, 'use_season_candles', `使用蜡烛${(i + 1) * 20}个`),
)

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ...ACC_TASK_LIST].map((task, index) => [task.value, index]),
)

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// 累积任务活动索引
// 这个常量定义了累积任务在活动数据中的索引位置
// 用于在创建累积任务列表时获取正确的活动数据
const ACC_TASK_ACTIVITY_INDEX = 5
// 创建任务列表
const createTaskList = (
  taskList: Reward[],
  isAccTask: boolean,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      const awardIndex = isAccTask ? index : 0
      const activity =
        activityData.value.event_data[EVENT_NAME][
          isAccTask ? ACC_TASK_ACTIVITY_INDEX : index
        ]
      const { award, value, stages } = activity
      return {
        ...item,
        status: getTaskStatus(award[awardIndex], value, stages[awardIndex]),
      }
    })
  })
}

// 任务列表
const taskList = createTaskList(TASK_LIST, false)
// 累积任务列表
const accTaskList = createTaskList(ACC_TASK_LIST, true)

const taskColumns = computed(() => [
  taskList.value.slice(0, 2),
  taskList.value.slice(2, 5),
])

// 累计任务进度条
const accTaskStep = computed(() => {
  let step = accTaskList.value.findIndex((item) => {
    return item.status === 'wait'
  })
  step = step === -1 ? 5 : step
  return step
})

const sessionIsVisitedKey = 'isVisitedDoubleEleven2024-2'
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
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-5项，任务列表
  const tasksValid = tasks
    .slice(0, 5)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  // 检查第5项，累计任务
  const accTask = tasks[5]
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
      const tasklist = data.event_data[EVENT_NAME].filter(
        (item: Event) => !Object.prototype.hasOwnProperty.call(item, 'ticket'),
      )
      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_double_eleven_2024_2: tasklist.sort(
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
      console.log('activityStore: ', activityStore)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param item 任务项
 * @param rewardId 第几个奖励节点 不传默认1
 * @returns {void}
 */
function handleReward(item: Reward, rewardId: number): void {
  const { value, status } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: value,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 更新页面数据
      const taskIndex = activityData.value.event_data[EVENT_NAME].findIndex(
        (item) => {
          return item.task_id === value
        },
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      // activityStore.updateActivityData(activityData.value)
      showToast(
        `领取成功，您获得了 ${rewardsText[curRewards.value.name as keyof RewardsName]}*${curRewards.value.count}`,
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
    background-image: url('@/assets/images/double-eleven-2024-2/bg.png');
  }
}
.title {
  position: absolute;
  left: -90px;
  top: 50px;
  width: 805px;
  height: 117px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  background-image: url('@/assets/images/double-eleven-2024-2/title.png');
}
.help {
  position: absolute;
  width: 71px;
  height: 71px;
  top: 250px;
  right: 318px;
  background-image: url('@/assets/images/double-eleven-2024-2/help.png');
}
.task-list {
  position: absolute;
  left: 100px;
  top: 220px;
  padding: 0;
  width: 1850px;
  height: 499px;
}
.task-item-left {
  width: 900px;
  height: 150px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url('@/assets/images/double-eleven-2024-2/reward-bg-left.png');
}
.task-item-right {
  width: 900px;
  height: 150px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/double-eleven-2024-2/reward-bg-right.png');
}
.task-item {
  margin-right: 70px;
  width: 230px;
  height: 320px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/double-eleven-2024-2/reward-bg-left.png');
}
.reward {
  margin-right: 100px;
  width: 150px;
  height: 150px;
  background-repeat: no-repeat;
  background-size: contain;
  &.wait {
    background-image: url('@/assets/images/double-eleven-2024-2/wait.png');
  }
  &.can {
    background-image: url('@/assets/images/double-eleven-2024-2/can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/double-eleven-2024-2/redeemed.png');
  }
}
// .acc-task-title {
//   width: 230px;
//   height: 70px;
//   background-image: url('@/assets/images/double-eleven-2024-2/collect-title.png');
//   background-repeat: no-repeat;
//   background-size: cover;
//   margin-right: 10px;
//   position: relative;
//   bottom: 3px;
// }
.progress-bar {
  width: 1800px;
  height: 22px;
  margin-top: 200px;
  margin-left: 100px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/double-eleven-2024-2/progress-bar2.png');
}
// @for $i from 0 through 3 {
//   .progress-bar#{$i} {
//     background-image: url('@/assets/images/double-eleven-2024-2/progress-bar#{$i}.png');
//   }
// }
.acc-task-item {
  width: 180px;
  height: 180px;
  background-repeat: no-repeat;
  background-size: contain;
  &.wait {
    background-image: url('@/assets/images/double-eleven-2024-2/love-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/double-eleven-2024-2/love-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/double-eleven-2024-2/love-redeemed.png');
  }
}
.tips {
  position: absolute;
  left: 100px;
  bottom: -420px;
  width: 1850px;
  height: 499px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/double-eleven-2024-2/text.png');
}
</style>
