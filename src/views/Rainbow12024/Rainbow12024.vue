<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="rainbow1-2024 flex h-screen">
      <div class="rainbow1-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            绮丽绘梦时
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <h1
            class="join-title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            参与开启虹光
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <div class="rainbow bg-contain bg-center bg-no-repeat"></div>
            <div class="personage bg-contain bg-center bg-no-repeat"></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div class="task-main">
            <div class="task-list-container">
              <div
                class="tag-clock overflow-hidden bg-contain bg-center bg-no-repeat"
              ></div>
              <ul
                class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
              >
                <li
                  v-for="(item, index) in taskList"
                  :key="item.name"
                  :class="[
                    'task-item z-10 bg-contain bg-center bg-no-repeat indent-[-9999px]',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.name, item.status, index)"
                >
                  {{ item.title }}
                  <div
                    class="task3-time z-11 bg-contain bg-center bg-no-repeat"
                    v-if="[2].includes(index)"
                  ></div>
                  <div class="task-star-container" v-if="[3].includes(index)">
                    <div
                      v-for="(_, starIndex) in item.starCountCan"
                      :key="starIndex"
                      class="task-star task-star-can overflow-hidden bg-contain bg-center bg-no-repeat"
                    ></div>
                    <div
                      v-for="(_, starIndex) in item.starCount -
                      item.starCountCan"
                      :key="starIndex"
                      class="task-star task-star-wait overflow-hidden bg-contain bg-center bg-no-repeat"
                    ></div>
                  </div>
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
              >2024年8月14日~2024年8月27日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，在八人门中央神坛与好友牵手，即可领取<span
                class="text-[#ffcb4d]"
                >绚丽彩虹*2</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，收集五个彩虹节代币，即可领取<span
                class="text-[#ffcb4d]"
                >璀璨之星*2</span
              >；
            </p>
            <p class="modal-text">
              3、8.21 00:00:00 - 8.27 23:59:59
              ，和好友一起开启空中彩虹环，即可领取<span class="text-[#ffcb4d]"
                >元气满满*2</span
              >；
            </p>
            <p class="modal-text">
              4、活动期间，累计三天完成彩虹赛跑，即可领取<span
                class="text-[#ffcb4d]"
                >蜡烛*2</span
              >；
            </p>
            <p class="modal-text">
              5、活动期间，完成以上全部任务，即可领取<span
                class="text-[#ffcb4d]"
                >爱心*2</span
              >；
            </p>
            <p class="modal-text">
              6、活动期间，累计参与开启虹光三天，即可领取<span
                class="text-[#ffcb4d]"
                >彩虹尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              7、活动期间，累计参与开启虹光五天，即可领取<span
                class="text-[#ffcb4d]"
                >彩虹尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              8、活动期间，累计参与开启虹光八天，即可领取<span
                class="text-[#ffcb4d]"
                >彩虹尾迹*2</span
              >；
            </p>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <p class="modal-text">
              恭喜你获得
              <span class="modal-text-blue"
                >{{ rewardsText[curRewards.name as keyof RewardsName] }} *
                {{ curRewards.count }}</span
              >：
            </p>
            <div class="mt-10 flex items-center justify-center">
              <img
                class="modal-reward"
                :src="handleSrc(String(curRewards.name))"
                alt="reward"
              />
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
import type { Event, DesignConfig, EventDataKeys } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  rainbow: string
  glow: string
  energy: string
  candles: string
  heart: string
  trail_rainbow: string
}

const rewardsText: RewardsName = {
  rainbow: '绚丽彩虹',
  glow: '璀璨之星',
  energy: '元气满满',
  candles: '蜡烛',
  heart: '爱心',
  trail_rainbow: '彩虹尾迹',
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

const EVENT_NAME: EventDataKeys =
  activityStore.activeEventName.activitycenter_rainbow1_2024

// 活动数据
const activityData = computed(
  () => activityStore.eventData[EVENT_NAME] as Event[],
)
const curRewards: Ref<Rewards> = ref({
  name: 'rainbow',
  count: 0,
})
const TASK_LIST = [
  {
    name: 'activitycenter_rainbow_2024_m9',
    title: '在中央神坛与好友牵手',
    status: 'wait',
  },
  {
    name: 'collecting_event_candles',
    title: '收集五个彩虹节代币',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m10',
    title: '和好友一起参与开启空中彩虹环',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m11',
    title: '累计三天完成彩虹竞速',
    status: 'wait',
    starCount: 0,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_rainbow_2024_m12',
    title: '完成以上全部任务',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m13',
    title: '累计参与开启虹光三天',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m14',
    title: '累计参与开启虹光五天',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m15',
    title: '累计参与开启虹光八天',
    status: 'wait',
  },
]
const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value[index]
    const task = {
      ...item,
      starCount: activity.stages[0],
      starCountCan:
        activity.value > activity.stages[0]
          ? activity.stages[0]
          : activity.value,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
          ? 'can'
          : 'wait',
    }
    return task
  })
})

const sessionIsVisitedKey = 'isVisitedRainbow12024'
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

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      // 获取数据并按照 TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activitycenter_anniversary_visit_2024.sort(
          (a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
            const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
            return orderA - orderB
          },
        )
      // 是否已领奖：所有任务已领奖
      const isClaimedReward = !activityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      // 更新菜单数据 isClaimedReward
      menuStore.updateMenuDataByIsClaimedReward(
        EVENT_NAME as string,
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData(EVENT_NAME, activityData)
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
  // 后端接口请求限制间隔 3s
  // 优化用户体验，不再延时请求接口，直接前端更新数据展示
  const newActivityData = activityData.value.map((item) => {
    return {
      ...item,
      award: item.task_id === currentTask.taskName ? [1] : item.award,
    }
  })
  activityStore.updateEventData(EVENT_NAME, newActivityData)
  const isClaimedReward = !newActivityData.some(
    (item) => item.award[0] === 0 && item.value >= item.stages[0],
  )
  menuStore.updateMenuDataByIsClaimedReward(EVENT_NAME, isClaimedReward)
}

// 领奖
function handleReward(task: string, status: string, taskIndex: number): void {
  // 领奖
  if (status === 'redeemed') {
    showToast('已领奖')
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task,
    rewardId: 1,
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
    })
    .catch((error) => {
      showToast(error.message)
    })
}
</script>

<style lang="scss" scoped>
.rainbow-animation {
  animation: opacity-enter ease-in-out 1s;
}
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
.rainbow1-2024 {
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
    background-image: url('@/assets/images/rainbow1-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 915px;
  top: 47px;
  width: 623px;
  height: 227px;
  background-image: url('@/assets/images/rainbow1-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  top: 14px;
  left: 567px;
  // border: 1px solid red;
}

.rainbow {
  width: 1031px;
  height: 454px;
  position: absolute;
  top: 686px;
  left: 0;
  background-image: url('@/assets/images/rainbow1-2024/rainbow.png');
}
.personage {
  width: 443px;
  height: 654px;
  position: absolute;
  top: 412px;
  left: 1559px;
  background-image: url('@/assets/images/rainbow1-2024/personage.png');
}

.join-title {
  position: absolute;
  left: 133px;
  top: 829px;
  width: 475px;
  height: 81px;
  background-image: url('@/assets/images/rainbow1-2024/join-title.png');
}
.task-item {
  width: 350px;
  height: 350px;
  position: absolute;
}

$reward-img-vertical-gap: 0px;
$reward-img-horizontal-gap: 0px;
@for $i from 1 through 10 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/rainbow1-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/rainbow1-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/rainbow1-2024/task#{$i}-redeemed.png');
    }

    @if $i == 1 {
      top: 151 - $reward-img-vertical-gap;
      left: 96 - $reward-img-horizontal-gap;
    }
    @if $i == 2 {
      top: 325 - $reward-img-vertical-gap;
      left: 448 - $reward-img-horizontal-gap;
    }
    @if $i == 3 {
      top: 417 - $reward-img-vertical-gap;
      left: 847 - $reward-img-horizontal-gap;
    }
    @if $i == 4 {
      top: 325 - $reward-img-vertical-gap;
      left: 1231 - $reward-img-horizontal-gap;
    }
    @if $i == 5 {
      width: 442px;
      height: 286px;
      top: 172 - $reward-img-vertical-gap;
      left: 1553 - $reward-img-horizontal-gap;
    }

    @if $i == 6 or $i == 7 or $i == 8 {
      width: 146px;
      height: 175px;
    }
    @if $i == 6 {
      top: 921 - $reward-img-vertical-gap;
      left: 126 - $reward-img-horizontal-gap;
    }
    @if $i == 7 {
      top: 921 - $reward-img-vertical-gap;
      left: 305 - $reward-img-horizontal-gap;
    }
    @if $i == 8 {
      top: 921 - $reward-img-vertical-gap;
      left: 484 - $reward-img-horizontal-gap;
    }
  }
}

.task3-time {
  width: 125px;
  height: 43px;
  position: absolute;
  top: 32px;
  right: 60px;
  background-image: url('@/assets/images/rainbow1-2024/task3-time.png');
}

.task-star-container {
  position: absolute;
  bottom: -10px;
  left: 170px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  .task-star {
    width: 37px;
    height: 37px;
    &-can {
      background-image: url('@/assets/images/rainbow1-2024/task-star-can.png');
    }
    &-wait {
      background-image: url('@/assets/images/rainbow1-2024/task-star-wait.png');
    }
  }
}

.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
.modal-reward {
  width: 150px;
}
</style>
