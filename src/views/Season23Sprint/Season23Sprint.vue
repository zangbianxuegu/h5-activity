<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season23-sprint flex h-screen">
      <div class="season23-sprint-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            弦音协奏 携手谢幕
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <div
              class="mask-layer-1 animate__animated animate__fadeInDown bg-contain bg-center bg-no-repeat"
            ></div>
            <div
              class="mask-layer-2 animate__animated animate__fadeInUp bg-contain bg-center bg-no-repeat"
            ></div>
            <div
              class="mask-layer-3 animate__animated animate__fadeInDown bg-contain bg-center bg-no-repeat"
            ></div>
            <div
              class="mask-layer-4 animate__animated animate__fadeInUp bg-contain bg-center bg-no-repeat"
            ></div>
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
            <div class="reward-token-candle-container bg-contain bg-center">
              <div class="token-count flex items-center justify-center">
                <span>
                  ({{ rewardTokenCandle.currentCount }}/{{
                    rewardTokenCandle.targetCount
                  }})
                </span>
              </div>
            </div>
            <div class="reward-token-login-container bg-contain bg-center">
              <div class="token-count flex items-center justify-center">
                <span>
                  ({{ rewardTokenLogin.currentCount }}/{{
                    rewardTokenLogin.targetCount
                  }})
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
              >2024年9月24日~2024年10月7日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，完成全部季节任务，即可领取<span
                class="text-[#ffcb4d]"
                >体型重塑*2</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，累计收集季节蜡烛，即可领取<span
                class="text-[#ffcb4d]"
                >璀璨之星魔法*1，元气满满*1，蜡烛*1</span
              >；
            </p>
            <p class="modal-text">
              3、活动期间，完成累计登录天数，即可领取<span
                class="text-[#ffcb4d]"
                >传信纸船*1，绚丽彩虹*1，爱心*1</span
              >；
            </p>
            <p class="modal-text">
              4、活动期间，完成二重奏季毕业，即可领取<span
                class="text-[#ffcb4d]"
                >下个赛季季节蜡烛*6</span
              >；
            </p>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <div
              v-if="rewardModalType === 'defaultType'"
              class="flex h-full flex-col"
            >
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
            <div v-else>
              <p class="modal-text">领取奖励说明：</p>
              <p class="modal-text mt-1">
                2024年10月18日<span class="text-[#ffcb4d]">新版本更新后</span
                >，可在游戏内通过<span class="text-[#ffcb4d]">邮件</span
                >领取<span class="text-[#ffcb4d]">季节蜡烛*6</span
                >，感谢您的参与！
              </p>
            </div>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { DesignConfig, Event, EventName } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/season23Sprint'

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

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  resize_potion: string
  glow: string
  energy: string
  candles: string
  message_boat: string
  rainbow: string
  heart: string
  season_candles: string
}

// delayType任务4是发延迟奖品，奖品弹窗形式有所区别
const rewardModalType = ref<'defaultType' | 'delayType'>('defaultType')

const rewardsText: RewardsName = {
  resize_potion: '体型重塑',
  glow: '璀璨之星',
  energy: '元气满满',
  candles: '蜡烛',
  message_boat: '传信纸船',
  rainbow: '绚丽彩虹',
  heart: '爱心',
  season_candles: '下个赛季季节蜡烛',
}

interface Task {
  name: string
  title: string
  rewards: Reward[]
}

interface Reward {
  name: string
  count: number
  rewardId?: string
  status: 'wait' | 'redeemed' | 'can' | string
}

const EVENT_NAME = 'activitycenter_season23_sprint' as EventName
// 活动数据
const activityData = computed(() => activityStore.activityData)
const curRewards: Ref<Rewards> = ref({
  name: 'resize_potion',
  count: 0,
})

const rewardTokenCandle = ref({
  currentCount: 0,
  targetCount: 30,
})

const rewardTokenLogin = ref({
  currentCount: 0,
  targetCount: 7,
})

const TASK_LIST: Task[] = [
  {
    name: 'activitycenter_season23_sprint_m1',
    title: '完成全部季节任务',
    rewards: [
      {
        name: 'resize_potion',
        count: 2,
        status: 'wait',
      },
    ],
  },
  {
    name: 'collecting_season_candles',
    title: '累计收集10, 20, 30根季节蜡烛',
    rewards: [
      {
        name: 'glow',
        count: 1,
        status: 'wait',
      },
      {
        name: 'energy',
        count: 1,
        status: 'wait',
      },
      {
        name: 'collecting_season_candles_3',
        count: 1,
        status: 'wait',
      },
    ],
  },
  {
    name: 'login_days',
    title: '累计登录3，5，7天',
    rewards: [
      {
        name: 'message_boat',
        count: 1,
        status: 'wait',
      },
      {
        name: 'rainbow',
        count: 1,
        status: 'wait',
      },
      {
        name: 'heart',
        count: 1,
        status: 'wait',
      },
    ],
  },
  {
    name: 'activitycenter_season23_sprint_m4',
    title: '二重奏季毕业',
    rewards: [
      {
        name: 'season_candles',
        count: 6,
        status: 'wait',
      },
    ],
  },
]
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((task) => {
    const activity =
      activityData.value.event_data.activitycenter_season23_sprint.find(
        (_task) => _task.task_id === task.name,
      ) as Event
    if (task.name === 'collecting_season_candles') {
      rewardTokenCandle.value.currentCount = activity.value
    } else if (task.name === 'login_days') {
      rewardTokenLogin.value.currentCount = activity.value
    }
    const _task = {
      ...task,
      rewards: task.rewards.map((reward, rewardIndex) => {
        const resObject = { ...reward }
        resObject.status =
          activity.award[rewardIndex] === 1
            ? 'redeemed'
            : activity.award[rewardIndex] === 0 &&
                activity.value >= activity.stages[rewardIndex]
              ? 'can'
              : 'wait'
        return resObject
      }),
    }
    return _task
  })
})

const sessionIsVisitedKey = 'isVisitedSeason23Sprint'
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
  const taskList = activityData.value.event_data.activitycenter_season23_sprint
  const hasUnclaimedReward = taskList.some((task) => {
    let res

    // 点击领取奖品更新红点
    if (currentTask.taskName) {
      res =
        task.value >= task.stages[currentTask.rewardIndex] &&
        task.award[currentTask.rewardIndex] === 0
    } else {
      // 初始化时更新红点
      const arard0Index = task.award.findIndex((award) => award === 0)
      if (arard0Index === -1) {
        return false
      } else {
        const stages0Value = task.stages[arard0Index]
        if (task.value >= stages0Value) {
          return true
        }
      }
    }

    return res
  })

  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data: any = res.data

      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_season23_sprint: data.event_data[EVENT_NAME].sort(
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
  // 后端接口请求限制间隔 3s
  // 优化用户体验，不再延时请求接口，直接前端更新数据展示
  const newActivityData = {
    ...activityData.value,
    event_data: {
      activitycenter_season23_sprint:
        activityData.value.event_data.activitycenter_season23_sprint.map(
          (task) => {
            const res = { ...task }
            const taskName = currentTask.taskName
            if (task.task_id === taskName) {
              if (
                task.task_id === 'activitycenter_season23_sprint_m1' ||
                task.task_id === 'activitycenter_season23_sprint_m4'
              ) {
                res.award = [1]
              } else {
                res.award[currentTask.rewardIndex] = 1
              }
            }
            return res
          },
        ),
    },
  }
  activityStore.updateActivityData(newActivityData)
}

// 领奖
function handleReward(
  taskName: string,
  taskIndex: number,
  reward: Reward,
  rewardIndex: number,
): void {
  const status = reward.status
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
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
    rewardId: Number(rewardIndex + 1),
  }
  claimMissionReward(claimMissionRewardData)
    .then((res) => {
      currentTask.taskName = taskName
      currentTask.taskIndex = taskIndex
      currentTask.reward = reward
      currentTask.rewardIndex = rewardIndex
      const rewards = res.data.rewards

      if (taskName === 'activitycenter_season23_sprint_m4') {
        rewardModalType.value = 'delayType'
      } else {
        rewardModalType.value = 'defaultType'
        curRewards.value = {
          name: Object.keys(rewards)[0],
          count: Number(Object.values(rewards)[0]),
        }
      }

      modalReward.value?.openModal()
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
.season23-sprint {
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
    background-image: url('@/assets/images/season23-sprint/bg.jpg');
    overflow: hidden;
  }
}
.title {
  position: absolute;
  top: 112px;
  left: 63px;
  width: 1688px;
  height: 187px;
  background-image: url('@/assets/images/season23-sprint/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: 119px;
  left: 1549px;
  // border: 1px solid red;
}

.task-list {
  width: 2025px;
  height: 465px;
  position: absolute;
  top: 333px;
  left: 15px;
  background-image: url('@/assets/images/season23-sprint/bg-reward-list.png');
}

.reward-item {
  width: 300px;
  height: 300px;
  position: absolute;
}

@for $taskIndex from 1 through 4 {
  .task-item#{$taskIndex} {
    $rewardLength: 1;
    @if ($taskIndex == 1 or $taskIndex == 4) {
      $rewardLength: 1;
    } @else if($taskIndex == 2 or $taskIndex == 3) {
      $rewardLength: 3;
    }
    @for $rewardIndex from 1 through $rewardLength {
      .reward#{$rewardIndex} {
        &.wait {
          background-image: url('@/assets/images/season23-sprint/task#{$taskIndex}-reward#{$rewardIndex}-wait.png');
        }
        &.can {
          background-image: url('@/assets/images/season23-sprint/task#{$taskIndex}-reward#{$rewardIndex}-can.png');
        }
        &.redeemed {
          background-image: url('@/assets/images/season23-sprint/task#{$taskIndex}-reward#{$rewardIndex}-redeemed.png');
        }
      }
    }
  }
}
.task-item1 {
  .reward1 {
    top: 100px;
    left: 8px;
  }
}
.task-item2 {
  .reward1 {
    top: 229px;
    left: 313px;
  }
  .reward2 {
    top: 319px;
    left: 538px;
  }
  .reward3 {
    top: 202px;
    left: 743px;
  }
}
.task-item3 {
  .reward1 {
    top: 113px;
    left: 977px;
  }
  .reward2 {
    top: 50px;
    left: 1190px;
  }
  .reward3 {
    top: 110px;
    left: 1403px;
  }
}
.task-item4 {
  .reward1 {
    top: 202px;
    left: 1696px;
  }
}
.reward-token-candle-container {
  position: absolute;
  top: 939px;
  left: 355px;
  width: 691px;
  height: 124px;
  background-image: url('@/assets/images/season23-sprint/bg-reward-token-candle.png');
  .token-count {
    width: 100%;
    position: absolute;
    bottom: 4px;
    overflow: hidden;
    span {
      font-family: SourceHanSansCN-Regular;
      font-size: 46px;
      color: #fff281;
    }
  }
}
.reward-token-login-container {
  position: absolute;
  top: 712px;
  left: 1044px;
  width: 619px;
  height: 124px;
  background-image: url('@/assets/images/season23-sprint/bg-reward-token-login.png');
  .token-count {
    width: 100%;
    position: absolute;
    bottom: 4px;
    overflow: hidden;
    span {
      font-family: SourceHanSansCN-Regular;
      font-size: 46px;
      color: #fff281;
    }
  }
}

.mask-layer-1 {
  width: 364px;
  height: 867px;
  position: absolute;
  top: 273px;
  left: 0;
  background-image: url('@/assets/images/season23-sprint/mask-layer-1.png');
}
.mask-layer-2 {
  width: 660px;
  height: 825px;
  position: absolute;
  top: 314px;
  left: 364px;
  background-image: url('@/assets/images/season23-sprint/mask-layer-2.png');
}
.mask-layer-3 {
  width: 656px;
  height: 859px;
  position: absolute;
  top: 283px;
  left: 1024px;
  background-image: url('@/assets/images/season23-sprint/mask-layer-3.png');
}
.mask-layer-4 {
  width: 360px;
  height: 842px;
  position: absolute;
  top: 313px;
  left: 1680px;
  background-image: url('@/assets/images/season23-sprint/mask-layer-4.png');
}

.reward-img {
  width: 160px;
}
</style>
