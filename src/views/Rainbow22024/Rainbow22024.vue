<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="rainbow2-2024 flex h-screen">
      <div class="rainbow2-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            多彩汇云间
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div class="task-list-container z-30">
            <ul
              class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
            >
              <li
                v-for="(item, index) in taskList"
                :key="item.name"
                :class="[
                  'task-item z-20 bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `task-item${index + 1}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.name, item.status, index)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </Transition>
        <div v-if="isShowRainbow">
          <div
            v-for="task in taskList"
            :key="task.rainbow.name"
            v-show="task.rainbow.isShow"
            :class="[
              `rainbow-${task.rainbow.name}`,
              { 'rainbow-animation': task.rainbow.isShow },
            ]"
            class="rainbow opacity-1 z-10 bg-contain bg-center bg-no-repeat"
          ></div>
        </div>
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
              1、活动期间，开启一次粉红虹光，即可领取<span
                class="text-[#ffcb4d]"
                >粉红尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，开启一次红色虹光，即可领取<span
                class="text-[#ffcb4d]"
                >红色尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              3、活动期间，开启一次橙色虹光，即可领取<span
                class="text-[#ffcb4d]"
                >橙色尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              4、活动期间，开启一次黄色虹光，即可领取<span
                class="text-[#ffcb4d]"
                >黄色尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              5、活动期间，开启一次绿色虹光，即可领取<span
                class="text-[#ffcb4d]"
                >绿色尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              6、活动期间，开启一次青色虹光，即可领取<span
                class="text-[#ffcb4d]"
                >青色尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              7、活动期间，开启一次淡蓝虹光，即可领取<span
                class="text-[#ffcb4d]"
                >淡蓝尾迹*1</span
              >；
            </p>
            <p class="modal-text">
              8、活动期间，开启一次紫色虹光，即可领取<span
                class="text-[#ffcb4d]"
                >紫色尾迹*1</span
              >；
            </p>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward" @close="handleModalRewardClose">
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
import type { Event, DesignConfig, EventName } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/rainbow22024'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  trail_pink: string
  trail_red: string
  trail_orange: string
  trail_yellow: string
  trail_green: string
  trail_cyan: string
  trail_blue: string
  trail_purple: string
}

const rewardsText: RewardsName = {
  trail_pink: '粉红尾迹',
  trail_red: '红色尾迹',
  trail_orange: '橙色尾迹',
  trail_yellow: '黄色尾迹',
  trail_green: '绿色尾迹',
  trail_cyan: '青色尾迹',
  trail_blue: '淡蓝尾迹',
  trail_purple: '紫色尾迹',
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

const EVENT_NAME = 'activitycenter_rainbow2_2024' as EventName

// 活动数据
const activityData = computed(() => activityStore.activityData)
const curRewards: Ref<Rewards> = ref({
  name: 'trail_pink',
  count: 0,
})
const TASK_LIST = [
  {
    name: 'activitycenter_rainbow_2024_m1',
    title: '开启粉红虹光',
    status: 'wait',
    rainbow: {
      name: 'pink',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m2',
    title: '开启红色虹光',
    status: 'wait',
    rainbow: {
      name: 'red',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m3',
    title: '开启橙色虹光',
    status: 'wait',
    rainbow: {
      name: 'orange',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m4',
    title: '开启黄色虹光',
    status: 'wait',
    rainbow: {
      name: 'yellow',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m5',
    title: '开启绿色虹光',
    status: 'wait',
    rainbow: {
      name: 'green',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m6',
    title: '开启青色虹光',
    status: 'wait',
    rainbow: {
      name: 'cyan',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m7',
    title: '开启淡蓝虹光',
    status: 'wait',
    rainbow: {
      name: 'blue',
      isShow: false,
    },
  },
  {
    name: 'activitycenter_rainbow_2024_m8',
    title: '开启紫色虹光',
    status: 'wait',
    rainbow: {
      name: 'purple',
      isShow: false,
    },
  },
]

const isShowRainbow = ref(false)
setTimeout(() => {
  isShowRainbow.value = true
}, 600)

const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity =
      activityData.value.event_data.activitycenter_rainbow2_2024[index]
    const task = {
      ...item,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
            ? 'can'
            : 'wait',
    }
    task.rainbow.isShow = task.status === 'redeemed'
    return task
  })
})

const sessionIsVisitedKey = 'isVisitedRainbow22024'
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

// 设置红点
function setRedDot(): void {
  const taskList = activityData.value.event_data.activitycenter_rainbow2_2024
  const hasUnclaimedReward = taskList.some(
    (task) => task.value >= task.stages[0] && task.award[0] === 0,
  )
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}
// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data: any = res.data
      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_rainbow2_2024: data.event_data[EVENT_NAME].sort(
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

function updateActivityDataRewardStatusNoRequest(): void {
  const newActivityData = {
    ...activityData.value,
    event_data: {
      activitycenter_rainbow2_2024:
        activityData.value.event_data.activitycenter_rainbow2_2024.map(
          (item) => {
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

const currentTask = reactive({
  taskName: '',
  taskIndex: 0,
})

function handleModalRewardClose(): void {
  updateActivityDataRewardStatusNoRequest()
  setRedDot()
}

// 领奖
function handleReward(task: string, status: string, taskIndex: number): void {
  // 领奖
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
    })
    .catch((error) => {
      showToast(error.message)
    })
}
</script>

<style lang="scss" scoped>
.rainbow-animation {
  animation: opacity-enter ease-in-out 1.3s;
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
  transition: opacity 0.3s ease-out 0.2s;
}
.fade-in-main-enter-from {
  opacity: 0.2;
}
.rainbow2-2024 {
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
    background-image: url('@/assets/images/rainbow2-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 48px;
  top: 596px;
  width: 650px;
  height: 256px;
  background-image: url('@/assets/images/rainbow2-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 49px;
  height: 49px;
  top: 12px;
  left: 589px;
}
.task-item {
  width: 282px;
  height: 234px;
  position: absolute;
}

$reward-img-vertical-gap: 13px;
$reward-img-horizontal-gap: 32px;
@for $i from 1 through 8 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/rainbow2-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/rainbow2-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/rainbow2-2024/task#{$i}-redeemed.png');
    }

    @if $i == 1 {
      top: 823 - $reward-img-vertical-gap;
      left: 574 - $reward-img-horizontal-gap;
    }
    @if $i == 2 {
      top: 855 - $reward-img-vertical-gap;
      left: 1081 - $reward-img-horizontal-gap;
    }
    @if $i == 3 {
      top: 648 - $reward-img-vertical-gap;
      left: 1658 - $reward-img-horizontal-gap;
    }
    @if $i == 4 {
      top: 265 - $reward-img-vertical-gap;
      left: 1639 - $reward-img-horizontal-gap;
    }
    @if $i == 5 {
      top: 43px - $reward-img-vertical-gap;
      left: 1340 - $reward-img-horizontal-gap;
    }
    @if $i == 6 {
      top: 13 - $reward-img-vertical-gap;
      left: 933 - $reward-img-horizontal-gap;
    }
    @if $i == 7 {
      top: 93 - $reward-img-vertical-gap;
      left: 508 - $reward-img-horizontal-gap;
    }
    @if $i == 8 {
      top: 354 - $reward-img-vertical-gap;
      left: 212 - $reward-img-horizontal-gap;
    }
  }
}
.rainbow-pink {
  position: absolute;
  top: 600px;
  left: 332px;
  width: 802px;
  height: 539px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-pink.png');
  z-index: 16;
}
.rainbow-red {
  position: absolute;
  top: 692px;
  left: 1108px;
  width: 259px;
  height: 448px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-red.png');
}
.rainbow-orange {
  position: absolute;
  top: 608px;
  left: 1170px;
  width: 869px;
  height: 519px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-orange.png');
}
.rainbow-yellow {
  position: absolute;
  top: 316px;
  left: 1190px;
  width: 847px;
  height: 364px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-yellow.png');
}
.rainbow-green {
  position: absolute;
  top: 88px;
  left: 1154px;
  width: 416px;
  height: 531px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-green.png');
}
.rainbow-cyan {
  position: absolute;
  top: 16px;
  left: 966px;
  width: 180px;
  height: 587px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-cyan.png');
}
.rainbow-blue {
  position: absolute;
  top: 132px;
  left: 458px;
  width: 618px;
  height: 492px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-blue.png');
}
.rainbow-purple {
  position: absolute;
  top: 413px;
  left: 12px;
  width: 1041px;
  height: 268px;
  background-image: url('@/assets/images/rainbow2-2024/rainbow-purple.png');
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
