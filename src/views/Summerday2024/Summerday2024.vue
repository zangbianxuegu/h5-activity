<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="summerday-2024 flex h-screen">
      <div class="summerday-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            清凉夏末 魔法相赠
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
                  v-for="(item, index) in taskList"
                  :key="item.name"
                  :class="[
                    'task-item bg-contain bg-center bg-no-repeat indent-[-9999px]',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.name, item.status, index)"
                >
                  {{ item.title }}
                </li>
              </ul>
            </div>
          </div>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年8月29日~2024年9月12日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，体验一次捉迷藏玩法，即可领取<span
                class="text-[#ffcb4d]"
                >烧烤架魔法*2</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，使用一次沙滩球魔法，即可领取<span
                class="text-[#ffcb4d]"
                >沙滩球魔法*2</span
              >；
            </p>
            <p class="modal-text">
              3、活动期间，兑换一件夏之日物品，即可领取<span
                class="text-[#ffcb4d]"
                >新礼包泳圈试用魔法*2</span
              >；
            </p>
            <p class="modal-text">
              4、活动期间，累计登录5天，即可领取<span class="text-[#ffcb4d]"
                >体型重塑*2</span
              >；
            </p>
            <div class="modal-text">
              5、活动期间，收集夏之日代币，即可领取
              <div class="grid grid-cols-3">
                <span>收集数目</span>
                <span class="col-span-2">对应奖励</span>
                <span>20个</span>
                <span class="col-span-2 text-[#ffcb4d]">璀璨之星*1</span>
                <span>30个</span>
                <span class="col-span-2 text-[#ffcb4d]">冲浪板试用魔法*1</span>
                <span>50个</span>
                <span class="col-span-2 text-[#ffcb4d]">爱心*2</span>
              </div>
            </div>
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
                  :class="[currentTask.taskIndex === 0 ? 'w-220px' : 'w-150px']"
                  :src="handleSrc(String(curRewards.name))"
                  alt="reward"
                />
              </div>
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
import { useActivityStore } from '@/stores/summerday2024'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  outfit_prop_marshmallow: string
  beachball: string
  outfit_prop_mantafloat: string
  resize_potion: string
  glow: string
  outfit_prop_surfboard: string
  heart: string
}

const rewardsText: RewardsName = {
  outfit_prop_marshmallow: '烧烤架魔法',
  beachball: '沙滩球魔法',
  outfit_prop_mantafloat: '新礼包泳圈试用魔法',
  resize_potion: '体型重塑',
  glow: '璀璨之星',
  outfit_prop_surfboard: '冲浪板试用魔法',
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

const EVENT_NAME = 'activitycenter_summerday_2024' as EventName
// 活动数据
const activityData = computed(() => activityStore.activityData)
const curRewards: Ref<Rewards> = ref({
  name: 'outfit_prop_marshmallow',
  count: 0,
})
const TASK_LIST = [
  {
    name: 'activitycenter_summerday_2024_m1',
    title: '体验一次捉迷藏玩法',
    status: 'wait',
  },
  {
    name: 'use_consumables',
    title: '使用一次沙滩球魔法',
    status: 'wait',
  },
  {
    name: 'activitycenter_summerday_2024_m2',
    title: '兑换一件夏之日物品',
    status: 'wait',
  },
  {
    name: 'login_days',
    title: '累计登录5天',
    status: 'wait',
  },
  {
    name: 'collecting_season_candles_1',
    title: '收集夏之日代币20个',
    status: 'wait',
  },
  {
    name: 'collecting_season_candles_2',
    title: '收集夏之日代币30个',
    status: 'wait',
  },
  {
    name: 'collecting_season_candles_3',
    title: '收集夏之日代币50个',
    status: 'wait',
  },
]
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    let task
    if (item.name.includes('collecting_season_candles')) {
      const activity =
        activityData.value.event_data.activitycenter_summerday_2024.find(
          (e) => e.task_id === 'collecting_season_candles',
        ) as Event
      task = {
        ...item,
      }
      let taskIndex = 0
      if (item.name === 'collecting_season_candles_1') {
        taskIndex = 0
      } else if (item.name === 'collecting_season_candles_2') {
        taskIndex = 1
      } else if (item.name === 'collecting_season_candles_3') {
        taskIndex = 2
      }
      task.status =
        activity.award[taskIndex] === 1
          ? 'redeemed'
          : activity.award[taskIndex] === 0 &&
              activity.value >= activity.stages[taskIndex]
            ? 'can'
            : 'wait'
    } else {
      const activity =
        activityData.value.event_data.activitycenter_summerday_2024[index]
      task = {
        ...item,
        status:
          activity.award[0] === 1
            ? 'redeemed'
            : activity.award[0] === 0 && activity.value >= activity.stages[0]
              ? 'can'
              : 'wait',
      }
    }
    return task
  })
})

const sessionIsVisitedKey = 'isVisitedSummerday2024'
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
  const taskList = activityData.value.event_data.activitycenter_summerday_2024
  const hasUnclaimedReward = taskList.some((task, index) => {
    let res
    if (task.task_id !== 'collecting_season_candles') {
      res = task.value >= task.stages[0] && task.award[0] === 0
    } else {
      if (currentTask.taskName) {
        const taskName = currentTask.taskName
        // 点击领取奖品更新红点
        if (taskName.includes('collecting_season_candles')) {
          if (taskName === 'collecting_season_candles_1') {
            res = task.value >= task.stages[0] && task.award[0] === 0
          } else if (taskName === 'collecting_season_candles_2') {
            res = task.value >= task.stages[1] && task.award[1] === 0
          } else if (taskName === 'collecting_season_candles_3') {
            res = task.value >= task.stages[2] && task.award[2] === 0
          }
        }
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
          activitycenter_summerday_2024: data.event_data[EVENT_NAME].sort(
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

const currentTask = reactive({
  taskName: '',
  taskIndex: 0,
})
function updateActivityDataRewardStatusNoRequest(): void {
  const newActivityData = {
    ...activityData.value,
    event_data: {
      activitycenter_summerday_2024:
        activityData.value.event_data.activitycenter_summerday_2024.map(
          (item) => {
            const res = { ...item }
            const taskName = currentTask.taskName
            if (item.task_id !== 'collecting_season_candles') {
              res.award = item.task_id === taskName ? [1] : item.award
            } else {
              if (taskName.includes('collecting_season_candles')) {
                if (taskName === 'collecting_season_candles_1') {
                  res.award[0] = 1
                } else if (taskName === 'collecting_season_candles_2') {
                  res.award[1] = 1
                } else if (taskName === 'collecting_season_candles_3') {
                  res.award[2] = 1
                }
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
function handleReward(task: string, status: string, taskIndex: number): void {
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }

  let rewardId = 1
  const taskName = task
  if (taskName.includes('collecting_season_candles')) {
    if (taskName === 'collecting_season_candles_1') {
      rewardId = 1
    } else if (taskName === 'collecting_season_candles_2') {
      rewardId = 2
    } else if (taskName === 'collecting_season_candles_3') {
      rewardId = 3
    }
    task = 'collecting_season_candles'
  }

  claimMissionReward({
    event: EVENT_NAME,
    task,
    rewardId,
  })
    .then((res) => {
      currentTask.taskName = task
      currentTask.taskIndex = taskIndex
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
@keyframes opacity-enter {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

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
.summerday-2024 {
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
    background-image: url('@/assets/images/summerday-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  top: 132px;
  left: 436px;
  width: 1173px;
  height: 263px;
  background-image: url('@/assets/images/summerday-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: 30px;
  left: 1071px;
  // border: 1px solid red;
}

.task-item {
  width: 334px;
  height: 360px;
  position: absolute;
}

@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/summerday-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/summerday-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/summerday-2024/task#{$i}-redeemed.png');
    }
  }
}
.task-item1 {
  top: 383px;
  left: 107px;
}
.task-item2 {
  top: 516px;
  left: 454px;
}
.task-item3 {
  top: 438px;
  left: 833px;
}
.task-item4 {
  top: 624px;
  left: 1138px;
}
.w-220px {
  width: 220px;
}
.w-150px {
  width: 150px;
}
</style>
