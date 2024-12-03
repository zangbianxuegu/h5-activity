<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="werewolf-join flex h-screen">
      <div class="werewolf-join-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="relative h-full overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              冥龙，在我们之中
              <p>
                <time datetime="2024-12-19">12.19</time>-
                <time datetime="2025-1-8">1.8</time>
              </p>
              <p>活动期间，参与“冥龙之夜”玩法，完成任务获得奖励</p>
            </div>
            <div
              class="help cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 任务列表组件 -->
            <!-- 遍历 taskLists 对象，为每种类型的任务创建一个 TaskList 组件 -->
            <div class="absolute left-[100px] top-[356px] flex justify-between">
              <TaskList
                v-for="(tasks, type) in taskLists"
                :key="type"
                :type="type"
                :title="titles[type]"
                :tasks="tasks"
                @reward="handleReward"
              />
            </div>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <div class="absolute left-0 top-[960px] flex">
              <div
                class="absolute left-[10px] top-[0px] h-[60px] w-[300px] text-center text-[34px] leading-[60px] text-white"
              >
                完成<br />“冥龙之夜” 天数
              </div>
              <ul
                class="absolute left-[330px] top-[-132px] flex w-[1400px] justify-between"
                aria-labelledby="accTaskListHeading"
              >
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="flex h-[280px] flex-col items-center justify-between"
                >
                  <bubble
                    :reward="item"
                    :bubbleScale="1.3"
                    :bounce-class="`${item.taskId}-${item.id}`"
                  >
                    <div
                      :class="[
                        'acc-task-item animate__animated animate__fadeIn bg-contain',
                        `${item.status}${index + 1}`,
                      ]"
                      @click="handleReward(index + 1, item)"
                    ></div>
                  </bubble>
                  <p
                    class="h-[30px] text-center text-[30px] leading-[36px] text-white"
                  >
                    {{ index * 2 + 1 === 9 ? 10 : index * 2 + 1 }}天
                  </p>
                </li>
              </ul>

              <div class="progress-container absolute left-[320px] top-[80px]">
                <div
                  class="progress-bar"
                  :style="`width: ${accTaskValue > 100 ? 100 : accTaskValue}%;`"
                ></div>
              </div>
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
import { useActivityStore } from '@/stores/neteaseWerewolfJoin'
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import TaskList from './components/TaskList.vue'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import Bubble from '@/components/Bubble'
import { REWARD_MAP } from '@/constants/rewardMap'
import ModalHelp from './components/ModalHelp.vue'

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
  val: number
  stages: number[]
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

const curRewards: Ref<Rewards[]> = ref([
  {
    name: 'candles',
    count: 1,
  },
])

// 创建任务的函数
const createTaskItem = (
  id: number,
  taskId: string,
  title: string,
  status = 'wait',
  val = 0,
  stages = [1],
  canRewardLottieRef = ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie = ref(false),
): Reward => ({
  id,
  taskId,
  title,
  status,
  val,
  stages,
  canRewardLottieRef,
  hadRenderLottie,
})

// 光之子
const PLAYER_TASK_LIST = [
  createTaskItem(3, 'activitycenter_werewolf_player_m3', '成功指认冥龙'),
  createTaskItem(1, 'activitycenter_werewolf_player_m1', '完成一场游戏'),
  createTaskItem(
    2,
    'activitycenter_werewolf_player_m2',
    '在顺序发言到自己时做1个动作',
  ),
]

// 冥龙之子
const KRILL_TASK_LIST = [
  createTaskItem(3, 'activitycenter_werewolf_krill_m3', '成功撞翻光之子或先知'),
  createTaskItem(1, 'activitycenter_werewolf_krill_m1', '完成一场游戏'),
  createTaskItem(
    2,
    'activitycenter_werewolf_krill_m2',
    '在顺序发言到自己时做1个动作',
  ),
]

// 先知
const SPIRIT_TASK_LIST = [
  createTaskItem(3, 'activitycenter_werewolf_spirit_m3', '成功查验到冥龙'),
  createTaskItem(1, 'activitycenter_werewolf_spirit_m1', '完成一场游戏'),
  createTaskItem(
    2,
    'activitycenter_werewolf_spirit_m2',
    '在顺序发言到自己时做1个动作',
  ),
]

// 胜利追求（进度条）
const ACC_TASK_LIST = [
  createTaskItem(1, 'activitycenter_werewolf_join_m1', '完成1场“冥龙之夜”'),
  createTaskItem(2, 'activitycenter_werewolf_join_m1', '完成1场“冥龙之夜”'),
  createTaskItem(3, 'activitycenter_werewolf_join_m1', '完成1场“冥龙之夜”'),
  createTaskItem(4, 'activitycenter_werewolf_join_m1', '完成1场“冥龙之夜”'),
  createTaskItem(5, 'activitycenter_werewolf_join_m1', '完成1场“冥龙之夜”'),
]

// 弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_netease_werewolf_join'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

// 任务排序
const taskOrderMap = new Map(
  [
    ...PLAYER_TASK_LIST,
    ...KRILL_TASK_LIST,
    ...SPIRIT_TASK_LIST,
    ACC_TASK_LIST[0],
  ].map((task, index) => [task.taskId, index]),
)

// 累积任务活动索引
// 这个常量定义了累积任务在活动数据中的索引位置
// 用于在创建累积任务列表时获取正确的活动数据
const ACC_TASK_ACTIVITY_INDEX = 9

// 适配累积值不等分的进度条 计算累积任务值
function calculateAccTaskValue(accTaskVal: number): number {
  // 如果累积任务值大于等于100，直接返回100
  if (accTaskVal >= 100) return 100
  switch (true) {
    case accTaskVal <= 4:
      return accTaskVal
    case accTaskVal <= 10:
      return accTaskVal - 1
    case accTaskVal <= 40:
      return accTaskVal
    case accTaskVal <= 60:
      return accTaskVal + 2
    case accTaskVal < 80:
      return accTaskVal + 4
    case accTaskVal < 100:
      return accTaskVal + 3
    default:
      return 0 // 其他情况（理论上不会发生），返回0
  }
}

// 进度：1,3,5,7,10
const accTaskValue = computed(() => {
  return calculateAccTaskValue(
    eventData.value[ACC_TASK_ACTIVITY_INDEX].value * 10,
  )
})

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// 更新任务列表状态
const updateTaskList = (
  taskList: Reward[],
  activityIndex: number,
  isAccTask: boolean = false,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      const eventDataIndex = isAccTask ? activityIndex : activityIndex + index
      const { award, value, stages } = eventData.value[eventDataIndex]
      const awardIndex = isAccTask ? index : 0
      return {
        ...item,
        val: value,
        stages,
        status: getTaskStatus(award[awardIndex], value, stages[awardIndex]),
      }
    })
  })
}

// 光之子
const playerTaskList = updateTaskList(PLAYER_TASK_LIST, 0)
// 冥龙之子
const krillTaskList = updateTaskList(KRILL_TASK_LIST, 3)
// 先知
const spiritTaskList = updateTaskList(SPIRIT_TASK_LIST, 6)
// 累积任务列表
const accTaskList = updateTaskList(ACC_TASK_LIST, ACC_TASK_ACTIVITY_INDEX, true)

// 任务列表
const taskLists = computed(() => ({
  player: playerTaskList.value,
  krill: krillTaskList.value,
  spirit: spiritTaskList.value,
}))

const titles: Record<string, string> = {
  player: '光之子',
  krill: '冥龙之子',
  spirit: '先知',
}

const sessionIsVisitedKey = 'isVisitedNeteaseWerewolfJoin'
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
          activitycenter_netease_werewolf_join: data.event_data[
            EVENT_NAME
          ].sort((a: Event, b: Event) => {
            const orderA =
              taskOrderMap.get(a.task_id) ?? PLAYER_TASK_LIST.length
            const orderB =
              taskOrderMap.get(b.task_id) ?? PLAYER_TASK_LIST.length
            return orderA - orderB
          }),
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
.werewolf-join {
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
    background-image: url('@/assets/images/netease-werewolf-join/bg.jpg');
  }
}
.help {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 52px;
  left: 990px;
  background-image: url('@/assets/images/netease-werewolf-join/help.png');
}
.progress-container {
  width: 1360px;
  height: 20px;
  background-color: #484c50;
  border-radius: 8px;
  .progress-bar {
    height: 20px;
    background-color: #ffd972;
    border-radius: 8px;
    transition: width 0.4s ease;
    position: relative;
  }
  .progress-bar::after {
    content: '';
    position: absolute;
    right: -30px;
    top: -22px;
    height: 65px;
    width: 60px;
    background-image: url('@/assets/images/double-eleven-2024-2/star.png');
    background-repeat: no-repeat;
    background-size: contain;
    transition: right 0.4s ease;
  }
}
.acc-task-item {
  width: 256px;
  height: 230px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @for $i from 1 through 5 {
    &.wait#{$i} {
      background-image: url('@/assets/images/netease-werewolf-join/acc-task#{$i}-wait.png');
    }
    &.can#{$i} {
      background-image: url('@/assets/images/netease-werewolf-join/acc-task#{$i}-can.png');
    }
    &.redeemed#{$i} {
      transition: background-image 1s ease;
      background-image: url('@/assets/images/netease-werewolf-join/acc-task#{$i}-redeemed.png');
    }
  }
}
</style>
