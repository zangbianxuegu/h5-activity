<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="qixi-2024 flex h-screen">
      <div class="qixi-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            求签乞巧 鹊桥相会
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
                    'task-item z-10 bg-contain bg-center bg-no-repeat indent-[-9999px]',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.name, item.status, index)"
                >
                  {{ item.title }}
                  <div
                    class="task2-time z-11 bg-contain bg-center bg-no-repeat"
                    v-if="index === 1"
                  ></div>
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
              >2024年8月8日~2024年8月14日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，去秘密花园抽签，即可领取<span class="text-[#ffcb4d]"
                >爱心*1</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，七夕当天去秘密花园见证，即可领取<span
                class="text-[#ffcb4d]"
                >爱心*1</span
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
import type { DesignConfig, Event, EventName } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/qixi2024'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  heart: string
}

const rewardsText: RewardsName = {
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

const EVENT_NAME = 'activitycenter_qixi_2024' as EventName
// 活动数据
const activityData = computed(() => activityStore.activityData)
const curRewards: Ref<Rewards> = ref({
  name: 'heart',
  count: 0,
})
const TASK_LIST = [
  {
    name: 'global_qixi_m1',
    title: '参与1次祈愿树求签',
    status: 'wait',
  },
  {
    name: 'global_qixi_m2',
    title: '七夕当日见证鹊桥相会',
    status: 'wait',
  },
]
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity =
      activityData.value.event_data.activitycenter_qixi_2024[index]
    const task = {
      ...item,
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

const sessionIsVisitedKey = 'isVisitedQixi2024'
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
  const taskList = activityData.value.event_data.activitycenter_qixi_2024
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
          activitycenter_qixi_2024: data.event_data[EVENT_NAME].sort(
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
  // 后端接口请求限制间隔 3s
  // 优化用户体验，不再延时请求接口，直接前端更新数据展示
  const newActivityData = {
    ...activityData.value,
    event_data: {
      activitycenter_qixi_2024:
        activityData.value.event_data.activitycenter_qixi_2024.map((item) => {
          return {
            ...item,
            award: item.task_id === currentTask.taskName ? [1] : item.award,
          }
        }),
    },
  }
  activityStore.updateActivityData(newActivityData)
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
.qixi-2024 {
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
    background-image: url('@/assets/images/qixi-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 804px;
  top: 822px;
  width: 1074px;
  height: 242px;
  background-image: url('@/assets/images/qixi-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  top: 7px;
  left: 1022px;
  // border: 1px solid red;
}

.task-item {
  width: 397px;
  height: 397px;
  position: absolute;
}

@for $i from 1 through 2 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/qixi-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/qixi-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/qixi-2024/task#{$i}-redeemed.png');
    }
  }
}
.task-item1 {
  top: 125px;
  left: 1009px;
}
.task-item2 {
  top: 262px;
  left: 1399px;
}

.task2-time {
  width: 125px;
  height: 43px;
  position: absolute;
  top: 32px;
  right: 60px;
  background-image: url('@/assets/images/qixi-2024/task2-time.png');
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
