<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="invitation-code flex h-screen">
      <div class="invitation-code-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="relative h-full overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              共沐温暖，不期而遇
              <p>
                <time datetime="2024-12-6">12.6</time>-
                <time datetime="2025-2-17">2.17</time>
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
            <!-- 邀请人数 -->
            <h2 class="sr-only">邀请人数</h2>
            <div class="absolute left-[1140px] top-[300px] flex">
              <div class="sr-only">邀请人数</div>
              <ul
                class="absolute left-0 top-[-80px] flex w-[500px] justify-between"
              >
                <li
                  v-for="(item, index) in topAccTaskList"
                  :key="item.id"
                  class="flex h-[180px] flex-col items-center justify-between"
                >
                  <bubble
                    :reward="item"
                    :bubbleScale="1.9"
                    :bounce-class="`${item.taskId}-${item.id}`"
                  >
                    <div
                      :class="[
                        'top-acc-task-item animate__animated animate__fadeIn bg-contain',
                        `${item.status}${index + 1}`,
                      ]"
                      @click="handleReward(index + 1, item)"
                    ></div>
                  </bubble>
                  <p
                    class="h-[30px] text-center text-[30px] leading-[36px] text-white"
                  >
                    {{ item.stages[index] }}人
                  </p>
                </li>
              </ul>
              <div
                class="progress-container absolute left-0 top-[40px] w-[500px]"
              >
                <div
                  class="progress-bar"
                  :style="`width: ${topAccTaskValue > 100 ? 100 : topAccTaskValue}%;`"
                ></div>
              </div>
            </div>
            <div
              class="absolute left-[1700px] top-[170px] w-[200px] text-center font-['SourceHanSansCN'] text-[120px] text-[#fffad6]"
            >
              {{ topAccTaskList[0].val > 99 ? 99 : topAccTaskList[0].val }}
            </div>
            <!-- 被邀请玩家累计收集光之翼数量 -->
            <h2 class="sr-only">被邀请玩家累计收集光之翼数量</h2>
            <div class="absolute left-[1140px] top-[580px] flex">
              <div class="sr-only">被邀请玩家累计收集光之翼数量</div>
              <ul
                class="absolute left-0 top-[-80px] flex w-[760px] justify-between"
              >
                <li
                  v-for="(item, index) in middleAccTaskList"
                  :key="item.id"
                  class="flex h-[180px] flex-col items-center justify-between"
                >
                  <bubble
                    :reward="item"
                    :bubbleScale="1.9"
                    :bounce-class="`${item.taskId}-${item.id}`"
                  >
                    <div
                      :class="[
                        'middle-acc-task-item animate__animated animate__fadeIn bg-contain',
                        `${item.status}${index + 1}`,
                      ]"
                      @click="handleReward(index + 1, item)"
                    ></div>
                  </bubble>
                  <p
                    class="h-[30px] text-center text-[30px] leading-[36px] text-white"
                  >
                    {{ item.stages[index] }}
                  </p>
                </li>
              </ul>

              <div
                class="progress-container absolute left-0 top-[40px] w-[750px]"
              >
                <div
                  class="progress-bar"
                  :style="`width: ${middleAccTaskValue > 100 ? 100 : middleAccTaskValue}%;`"
                ></div>
              </div>
            </div>
            <!-- 被邀请玩家累计献祭次数 -->
            <h2 class="sr-only">被邀请玩家累计献祭次数</h2>
            <div class="absolute left-[1140px] top-[860px] flex">
              <div class="sr-only">被邀请玩家累计献祭次数</div>
              <ul
                class="absolute left-0 top-[-80px] flex w-[760px] justify-between"
              >
                <li
                  v-for="(item, index) in bottomAccTaskList"
                  :key="item.id"
                  class="flex h-[180px] flex-col items-center justify-between"
                >
                  <bubble
                    :reward="item"
                    :bubbleScale="1.9"
                    :bounce-class="`${item.taskId}-${item.id}`"
                  >
                    <div
                      :class="[
                        'bottom-acc-task-item animate__animated animate__fadeIn bg-contain',
                        item.status,
                      ]"
                      @click="handleReward(index + 1, item)"
                    ></div>
                  </bubble>
                  <p
                    class="h-[30px] text-center text-[30px] leading-[36px] text-white"
                  >
                    {{ item.stages[index] }}次
                  </p>
                </li>
              </ul>

              <div
                class="progress-container absolute left-0 top-[40px] w-[750px]"
              >
                <div
                  class="progress-bar"
                  :style="`width: ${bottomAccTaskValue > 100 ? 100 : bottomAccTaskValue}%;`"
                ></div>
              </div>
            </div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
        <!-- 活动tab标签页 -->
        <ActivityTab
          :currentTab="currentTab"
          :tabs="tabs"
          :inviteInfo="inviteInfo"
          @switchTab="switchTab"
        >
          <component
            :is="tabs[currentTab].component"
            :currentTab="currentTab"
            :tabs="tabs"
            :inviteInfo="inviteInfo"
            :m1Status="m1Status"
            @reward="handleRewardM1"
          ></component>
        </ActivityTab>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import { getInviteInfo } from '@/apis/invitationCode'
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/invitationCode'
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import Bubble from '@/components/Bubble'
import { REWARD_MAP } from '@/constants/rewardMap'
import ModalHelp from './components/ModalHelp.vue'
import ActivityTab from './components/ActivityTab.vue'
import MyCode from './components/MyCode.vue'
import BindRewards from './components/BindRewards.vue'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

interface Rewards {
  name: string
  count: number
}

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
    name: 'heart',
    count: 1,
  },
])

const currentTab = ref(0)
const tabs = reactive([
  {
    name: 'MyCode',
    component: markRaw(MyCode),
  },
  {
    name: 'BindRewards',
    component: markRaw(BindRewards),
  },
])

const switchTab = (index: number): void => {
  currentTab.value = index
}

const inviteInfo = reactive({
  canBind: true,
  myCode: '',
  bindCode: '',
})

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

// 邀请人数
const BIND_LIST = [
  createTaskItem(1, 'activitycenter_invitation_code_m1', '绑定奖励'),
]

// 邀请人数
const TOP_ACC_TASK_LIST = [
  createTaskItem(1, 'activitycenter_invitation_code_m2', '邀请人数'),
  createTaskItem(2, 'activitycenter_invitation_code_m2', '邀请人数'),
  createTaskItem(3, 'activitycenter_invitation_code_m2', '邀请人数'),
]

// 被邀请玩家累计收集光之翼数量
const MIDDLE_ACC_TASK_LIST = [
  createTaskItem(
    1,
    'activitycenter_invitation_code_m3',
    '被邀请玩家累计收集光之翼数量',
  ),
  createTaskItem(
    2,
    'activitycenter_invitation_code_m3',
    '被邀请玩家累计收集光之翼数量',
  ),
  createTaskItem(
    3,
    'activitycenter_invitation_code_m3',
    '被邀请玩家累计收集光之翼数量',
  ),
  createTaskItem(
    4,
    'activitycenter_invitation_code_m3',
    '被邀请玩家累计收集光之翼数量',
  ),
  createTaskItem(
    5,
    'activitycenter_invitation_code_m3',
    '被邀请玩家累计收集光之翼数量',
  ),
]

// 被邀请玩家累计献祭次数
const BOTTOM_ACC_TASK_LIST = [
  createTaskItem(
    1,
    'activitycenter_invitation_code_m4',
    '被邀请玩家累计献祭次数',
  ),
  createTaskItem(
    2,
    'activitycenter_invitation_code_m4',
    '被邀请玩家累计献祭次数',
  ),
  createTaskItem(
    3,
    'activitycenter_invitation_code_m4',
    '被邀请玩家累计献祭次数',
  ),
  createTaskItem(
    4,
    'activitycenter_invitation_code_m4',
    '被邀请玩家累计献祭次数',
  ),
  createTaskItem(
    5,
    'activitycenter_invitation_code_m4',
    '被邀请玩家累计献祭次数',
  ),
]

// 规则弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_invitation_code'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

// 任务排序
const taskOrderMap = new Map(
  [
    BIND_LIST[0],
    TOP_ACC_TASK_LIST[0],
    MIDDLE_ACC_TASK_LIST[0],
    BOTTOM_ACC_TASK_LIST[0],
  ].map((task, index) => [task.taskId, index]),
)

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// m1绑定奖励领取状态
const m1Status = computed(() => {
  const { award, value, stages } = eventData.value[0]
  return getTaskStatus(award[0], value, stages[0])
})

// 更新任务列表状态
const updateTaskList = (
  taskList: Reward[],
  activityIndex: number,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      const { award, value, stages } = eventData.value[activityIndex]
      const awardIndex = index
      return {
        ...item,
        val: value,
        stages,
        status: getTaskStatus(award[awardIndex], value, stages[awardIndex]),
      }
    })
  })
}

// 绑定任务
const bindList = updateTaskList(BIND_LIST, 0)
console.log(bindList, 'bindList')

// 累积任务列表
const topAccTaskList = updateTaskList(TOP_ACC_TASK_LIST, 1)
// 累积任务列表
const middleAccTaskList = updateTaskList(MIDDLE_ACC_TASK_LIST, 2)
// 累积任务列表
const bottomAccTaskList = updateTaskList(BOTTOM_ACC_TASK_LIST, 3)

const sessionIsVisitedKey = 'isVisitedInvitationCode'
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
    getUserInviteInfo()
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
 * @function 获取邀请码相关信息
 * @returns {void}
 */
function getUserInviteInfo(): void {
  getInviteInfo()
    .then((res) => {
      inviteInfo.canBind = res.can_bind
      inviteInfo.myCode = res.my_code
      inviteInfo.bindCode = res.bind_code
      if (inviteInfo.canBind) {
        if (m1Status.value === 'redeemed') {
          currentTab.value = 0
        } else {
          currentTab.value = 1
        }
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
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
          activitycenter_invitation_code: data.event_data[EVENT_NAME].sort(
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
 * @function 领取第一个任务奖励
 * @returns {void}
 */
const handleRewardM1 = (): void => {
  handleReward(1, bindList.value[0])
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

// 顶部 适配累积值不等分的进度条 计算累积任务值
function topCalculateAccTaskValue(accTaskVal: number): number {
  // 如果累积任务值大于等于100，直接返回100
  if (accTaskVal >= 3) return 100
  const ACC_TASK_VALUES: Readonly<Record<number, number>> = {
    0: 0,
    1: 14,
    2: 50,
    3: 100,
  }
  return ACC_TASK_VALUES[accTaskVal]
}

// 顶部 进度：1,2,3
const topAccTaskValue = computed(() => {
  return topCalculateAccTaskValue(eventData.value[1].value)
})

// 中间 适配累积值不等分的进度条 计算累积任务值
function middleCalculateAccTaskValue(accTaskVal: number): number {
  // 如果累积任务值大于等于100，直接返回100
  if (accTaskVal >= 300) return 100
  switch (true) {
    case accTaskVal < 30:
      return accTaskVal * 0.3
    case accTaskVal === 30:
      return 9
    case accTaskVal < 60:
      return (accTaskVal - 30) * 0.7 + 9
    case accTaskVal === 60:
      return 30
    case accTaskVal < 100:
      return (accTaskVal - 60) * 0.5 + 30
    case accTaskVal === 100:
      return 50
    case accTaskVal <= 150:
      return (accTaskVal - 100) * 0.44 + 50
    case accTaskVal === 150:
      return 72
    case accTaskVal < 300:
      return (accTaskVal - 150) * 0.18 + 72
    default:
      return 0 // 其他情况（理论上不会发生），返回0
  }
}

// 中间 进度：30,60,100,150,300
const middleAccTaskValue = computed(() => {
  return middleCalculateAccTaskValue(eventData.value[2].value)
})

// 底部 适配累积值不等分的进度条 计算累积任务值
function bottomCalculateAccTaskValue(accTaskVal: number): number {
  // 如果累积任务值大于等于100，直接返回100
  if (accTaskVal >= 5) return 100
  const ACC_TASK_VALUES: Readonly<Record<number, number>> = {
    0: 0,
    1: 9,
    2: 30,
    3: 50,
    4: 71,
    5: 100,
  }
  return ACC_TASK_VALUES[accTaskVal]
}

// 底部 进度：1,2,3,4,5
const bottomAccTaskValue = computed(() => {
  return bottomCalculateAccTaskValue(eventData.value[3].value)
})

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
.invitation-code {
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
    background-image: url('@/assets/images/invitation-code/bg.jpg');
  }
}
.help {
  position: absolute;
  width: 73px;
  height: 73px;
  top: 38px;
  left: 884px;
  background-image: url('@/assets/images/invitation-code/help.png');
}
.progress-container {
  height: 20px;
  background-color: rgba($color: #fff, $alpha: 0.3);
  border-radius: 8px;
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
    right: -30px;
    top: -22px;
    height: 65px;
    width: 60px;
    background-image: url('@/assets/images/invitation-code/star.png');
    background-repeat: no-repeat;
    background-size: contain;
    transition: right 0.4s ease;
  }
}
.top-acc-task-item {
  width: 138px;
  height: 113px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @for $i from 1 through 3 {
    &.wait#{$i} {
      background-image: url('@/assets/images/invitation-code/top-acc-task#{$i}-wait.png');
    }
    &.can#{$i} {
      background-image: url('@/assets/images/invitation-code/top-acc-task#{$i}-can.png');
    }
    &.redeemed#{$i} {
      transition: background-image 1s ease;
      background-image: url('@/assets/images/invitation-code/top-acc-task#{$i}-redeemed.png');
    }
  }
}
.middle-acc-task-item {
  width: 138px;
  height: 113px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  @for $i from 1 through 5 {
    &.wait#{$i} {
      background-image: url('@/assets/images/invitation-code/acc-task#{$i}-wait.png');
    }
    &.can#{$i} {
      background-image: url('@/assets/images/invitation-code/acc-task#{$i}-can.png');
    }
    &.redeemed#{$i} {
      transition: background-image 1s ease;
      background-image: url('@/assets/images/invitation-code/acc-task#{$i}-redeemed.png');
    }
  }
}
.bottom-acc-task-item {
  width: 138px;
  height: 113px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.wait {
    background-image: url('@/assets/images/invitation-code/acc-task-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/invitation-code/acc-task-can.png');
  }
  &.redeemed {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/invitation-code/acc-task-redeemed.png');
  }
}
</style>
