<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="nationalday1-2024 flex h-screen">
      <div class="nationalday1-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            悠长假日 拾光小憩
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <div class="task-list-container">
              <ul
                class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
              >
                <li
                  v-for="(task, taskIndex) in taskList"
                  :key="task.name"
                  :class="[`task-item${taskIndex + 1}`]"
                >
                  <ul>
                    <li
                      v-for="(reawrd, rewardIndex) in task.rewards"
                      :key="reawrd.name"
                      @click="
                        handleReward(task.name, taskIndex, reawrd, rewardIndex)
                      "
                      :class="[
                        'reward-item bg-contain bg-center bg-no-repeat indent-[-9999px]',
                        `reward${rewardIndex + 1}`,
                        `${reawrd.status}`,
                      ]"
                    >
                      {{ reawrd.name }}
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="reward-token-container bg-contain bg-center">
              <div class="token-count flex items-center justify-center">
                <span class="token-count-text">
                  (<van-rolling-text
                    ref="currentCountRollingTextRef"
                    :start-num="0"
                    :target-num="rewardToken.currentCount"
                    :duration="1"
                    :height="rollingTextHeight"
                    :auto-start="false"
                  />/<van-rolling-text
                    ref="targetCountRollingTextRef"
                    :start-num="0"
                    :target-num="rewardToken.targetCount"
                    :duration="1"
                    :height="rollingTextHeight"
                    :auto-start="false"
                  />)
                </span>
              </div>
            </div>
          </div>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年10月1日~2024年10月7日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，收集50根蜡烛，即可领取<span class="text-[#ffcb4d]"
                >红色单边双羽发饰</span
              >奖励，并在<span class="text-[#ffcb4d]">红色气球</span>、<span
                class="text-[#ffcb4d]"
                >红色领结</span
              >、<span class="text-[#ffcb4d]">小红花发饰</span>、<span
                class="text-[#ffcb4d]"
                >爱心*3</span
              >中任选一个奖励物品；
            </p>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <div class="flex h-full flex-col">
              <p class="modal-text">
                恭喜你获得
                <span class="modal-text-blue"
                  >{{ rewardsText[curRewards.name as keyof RewardsName] }} *
                  {{ curRewards.count }}</span
                >：
              </p>
              <div class="flex flex-1 items-center justify-center">
                <img
                  class="reward-img"
                  :src="handleSrc(String(curRewards.name))"
                  alt="reward"
                />
              </div>
            </div>
          </template>
        </activity-modal>
        <!-- 兑换弹框 -->
        <activity-modal ref="modalConfirmGetReward" class="reward-box">
          <template #content>
            <div class="confirm-get-reward-modal-content flex h-full flex-col">
              <div>
                <p>
                  确定要选择【{{
                    rewardsText[currentTask.reward.name as keyof RewardsName]
                  }}】吗？
                </p>
                <p>选择后，将无法再领取自选范围内的其他奖励</p>
              </div>
              <div class="flex flex-1 items-center justify-center">
                <img
                  v-if="currentTask.reward.name"
                  class="reward-img"
                  :src="handleSrc(String(currentTask.reward.name))"
                  alt="reward"
                />
              </div>
            </div>
          </template>
          <template #footer>
            <div class="relative z-10 -mt-10 flex justify-around">
              <button
                class="btn btn-cancel rounded-md text-white"
                type="button"
                @click="closeConfirmGetRewardModal"
              >
                我再想想
              </button>
              <button
                class="btn btn-confirm rounded-md text-white"
                type="button"
                @click="onClickConfirmGetRewardBtn"
              >
                确认
              </button>
            </div>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { type RollingTextInstance, showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { DesignConfig, Event, EventName } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/nationalday12024'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  CharSkyKid_Horn_AP12SideFeather_Red: string
  CharSkyKid_Prop_BalloonRed: string
  CharSkyKid_Neck_AP07BowTie_02: string
  CharSkyKid_Horn_FlowerPoppy_02: string
  heart: string
}

const rewardsText: RewardsName = {
  CharSkyKid_Horn_AP12SideFeather_Red: '红色单边双羽发饰',
  CharSkyKid_Prop_BalloonRed: '红色气球',
  CharSkyKid_Neck_AP07BowTie_02: '红色领结',
  CharSkyKid_Horn_FlowerPoppy_02: '小红花发饰',
  heart: '爱心',
}

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

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const menuStore = useMenuStore()
const activityStore = useActivityStore()

const EVENT_NAME = 'activitycenter_nationalday1_2024' as EventName
// 活动数据
const activityData = computed(() => activityStore.activityData)
const curRewards: Ref<Rewards> = ref<Rewards>({
  name: 'CharSkyKid_Horn_AP12SideFeather_Red',
  count: 0,
})

interface Task {
  name: string
  title: string
  rewards: Reward[]
}

interface Reward {
  name: string
  count: number
  rewardId?: string
  isExpect?: boolean
  status: 'wait' | 'redeemed' | 'can' | 'ban' | string
  isConfirmGetReward?: boolean
}

const rewardToken = {
  currentCount: 0,
  targetCount: 50,
}

const TASK_LIST = [
  {
    name: 'collecting_candles',
    title: '活动期间内收集50根白蜡烛-必选奖品',
    rewards: [
      {
        name: 'CharSkyKid_Horn_AP12SideFeather_Red',
        count: 1,
        status: 'wait',
      },
    ],
  },
  {
    name: 'activitycenter_nationalday1_2024_m1',
    title: '活动期间内收集50根白蜡烛-可选奖品',
    rewards: [
      {
        name: 'CharSkyKid_Prop_BalloonRed',
        rewardId: 'activitycenter_nationalday1_2024_1',
        isExpect: true,
        count: 1,
        status: 'wait',
        isConfirmGetReward: false,
      },
      {
        name: 'CharSkyKid_Neck_AP07BowTie_02',
        rewardId: 'activitycenter_nationalday1_2024_2',
        isExpect: true,
        count: 1,
        status: 'wait',
        isConfirmGetReward: false,
      },
      {
        name: 'CharSkyKid_Horn_FlowerPoppy_02',
        rewardId: 'activitycenter_nationalday1_2024_3',
        isExpect: true,
        count: 1,
        status: 'wait',
        isConfirmGetReward: false,
      },
      {
        name: 'heart',
        rewardId: 'activitycenter_nationalday1_2024_4',
        isExpect: true,
        count: 3,
        status: 'wait',
        isConfirmGetReward: false,
      },
    ],
  },
]
// 任务列表数据
const taskList = computed((): Task[] => {
  return TASK_LIST.map((task, taskIndex) => {
    const activity =
      activityData.value.event_data.activitycenter_nationalday1_2024[taskIndex]
    taskIndex === 0 && (rewardToken.currentCount = activity.value)
    const _task = {
      ...task,
      rewards: task.rewards.map((reward, rewardIndex) => {
        const resObject = { ...reward }
        if (task.name === 'collecting_candles') {
          resObject.status =
            activity.award[rewardIndex] === 1
              ? 'redeemed'
              : activity.award[rewardIndex] === 0 &&
                  activity.value >= activity.stages[rewardIndex]
                ? 'can'
                : 'wait'
        } else if (task.name === 'activitycenter_nationalday1_2024_m1') {
          if (activity.value >= activity.stages[0]) {
            if (activity.awarded_types.length === 0) {
              resObject.status = 'can'
            } else {
              resObject.status = activity.awarded_types.includes(
                Number(rewardIndex + 1),
              )
                ? 'redeemed'
                : 'ban'
            }
          } else {
            resObject.status = 'wait'
          }
        }
        return resObject
      }),
    }
    return _task
  })
})

const sessionIsVisitedKey = 'isVisitedNationalday12024'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

const rollingTextHeight = ref(0)
const currentCountRollingTextRef = ref<RollingTextInstance>()
const targetCountRollingTextRef = ref<RollingTextInstance>()
const setRollingTextHeight = (): void => {
  const text = document.querySelector('.van-rolling-text') as HTMLDivElement
  const computedStyle = window.getComputedStyle(text)
  const fontSize = computedStyle.getPropertyValue('font-size')
  rollingTextHeight.value =
    Math.ceil(parseFloat(fontSize.replace('px', ''))) + 5
  currentCountRollingTextRef.value?.start()
  targetCountRollingTextRef.value?.start()
}

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
  setRollingTextHeight()
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))
// 设置红点
function setRedDot(): void {
  const taskList =
    activityData.value.event_data.activitycenter_nationalday1_2024
  const hasUnclaimedReward = taskList.some(
    (task) => task.value >= task.stages[0] && task.award[0] === 0,
  )
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data: any = res.data

      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_nationalday1_2024: data.event_data[EVENT_NAME].sort(
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

const currentTask = reactive<{
  taskName: string
  taskIndex: number
  reward: Reward
  rewardIndex: number
}>({
  taskName: '',
  taskIndex: 0,
  reward: {} as unknown as Reward,
  rewardIndex: 0,
})
function updateActivityDataRewardStatusNoRequest(): void {
  const newActivityData = {
    ...activityData.value,
    event_data: {
      activitycenter_nationalday1_2024:
        activityData.value.event_data.activitycenter_nationalday1_2024.map(
          (item) => {
            if (
              currentTask.taskName === 'activitycenter_nationalday1_2024_m1'
            ) {
              return {
                ...item,
                awarded_types: [currentTask.rewardIndex + 1],
                award: [1],
              }
            }
            return {
              ...item,
              award: item.task_id === currentTask.taskName ? [1] : item.award,
            }
          },
        ),
    },
  }
  activityStore.updateActivityData(newActivityData)
}

const modalConfirmGetReward = ref()
function openConfirmGetRewardModal(): void {
  modalConfirmGetReward.value?.openModal()
}
function closeConfirmGetRewardModal(): void {
  modalConfirmGetReward.value?.closeModal()
}
function onClickConfirmGetRewardBtn(): void {
  currentTask.reward.isConfirmGetReward = true
  handleReward(
    currentTask.taskName,
    currentTask.taskIndex,
    currentTask.reward,
    currentTask.rewardIndex,
  )
  closeConfirmGetRewardModal()
}

// 领奖
function handleReward(
  taskName: string,
  taskIndex: number,
  reward: Reward,
  rewardIndex: number,
): void {
  const status = reward.status
  if (status === 'redeemed' || status === 'ban') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }

  currentTask.taskName = taskName
  currentTask.taskIndex = taskIndex
  currentTask.reward = reward
  currentTask.rewardIndex = rewardIndex
  if (
    taskName === 'activitycenter_nationalday1_2024_m1' &&
    !reward.isConfirmGetReward
  ) {
    openConfirmGetRewardModal()
    return
  }

  const claimMissionRewardData: {
    event: string
    task: string
    rewardId: number
    expect?: string
  } = {
    event: EVENT_NAME,
    task: taskName,
    rewardId: 1,
  }
  reward.isExpect && (claimMissionRewardData.expect = reward.rewardId)
  claimMissionReward(claimMissionRewardData)
    .then((res) => {
      const rewards = res.data.rewards
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      updateActivityDataRewardStatusNoRequest()
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
.nationalday1-2024 {
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
    background-image: url('@/assets/images/nationalday1-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  top: 208px;
  left: 126px;
  width: 1229px;
  height: 173px;
  background-image: url('@/assets/images/nationalday1-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: 114px;
  left: 1166px;
  // border: 1px solid red;
}

.task-list {
  width: 1560px;
  height: 481px;
  position: absolute;
  top: 440px;
  left: 104px;
  background-image: url('@/assets/images/nationalday1-2024/bg-task.png');
}

.reward-item {
  width: 230px;
  height: 320px;
  position: absolute;
}

@for $taskIndex from 1 through 2 {
  .task-item#{$taskIndex} {
    $rewardLength: 1;
    @if ($taskIndex == 1) {
      $rewardLength: 1;
    } @else if($taskIndex == 2) {
      $rewardLength: 4;
    }
    @for $rewardIndex from 1 through $rewardLength {
      .reward#{$rewardIndex} {
        &.wait {
          background-image: url('@/assets/images/nationalday1-2024/task#{$taskIndex}-reward#{$rewardIndex}-wait.png');
        }
        &.can {
          background-image: url('@/assets/images/nationalday1-2024/task#{$taskIndex}-reward#{$rewardIndex}-can.png');
        }
        &.redeemed {
          background-image: url('@/assets/images/nationalday1-2024/task#{$taskIndex}-reward#{$rewardIndex}-redeemed.png');
        }
        &.ban {
          background-image: url('@/assets/images/nationalday1-2024/task#{$taskIndex}-reward#{$rewardIndex}-ban.png');
        }
      }
    }
  }
}
.task-item1 {
  .reward-item {
    top: 109px;
  }
  .reward1 {
    left: 80px;
  }
}
.task-item2 {
  .reward-item {
    top: 109px;
  }
  .reward1 {
    left: 470px;
  }
  .reward2 {
    left: 727px;
  }
  .reward3 {
    left: 987px;
  }
  .reward4 {
    left: 1246px;
  }
}
.reward-token-container {
  position: absolute;
  top: 236px;
  left: 1572px;
  width: 424px;
  height: 109px;
  background-image: url('@/assets/images/nationalday1-2024/bg-reward-token.png');
}
.token-count {
  width: 100%;
  position: absolute;
  bottom: 4px;
  overflow: hidden;

  &-text {
    color: #fff281;
    font-family: SourceHanSansCN-Regular;
    font-size: 34px;
  }
}
:deep(.van-rolling-text) {
  font-family: SourceHanSansCN-Regular;
  font-size: 34px;
  color: #fff281;
}
.confirm-get-reward-modal-content {
  font-size: 36px;
  color: #696969;
  padding: 0 20px 0;
}
.reward-img {
  width: 160px;
  height: fit-content;
}
.btn {
  width: 340px;
  height: 94px;
  font-size: 40px;
  &-cancel {
    background: #74d2ee;
  }
  &-confirm {
    background: #ffcb4d;
  }
}
</style>
