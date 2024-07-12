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
          <div>
            <div>
              <h2
                class="join-title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
              >
                参与开启虹光
              </h2>
              <div class="rainbow bg-contain bg-center bg-no-repeat"></div>
              <div class="personage bg-contain bg-center bg-no-repeat"></div>
            </div>

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
                      v-for="(_, starIndex) in (item.starCount as number) -
                      (item.starCountCan as number)"
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
import type { DesignConfig, Event, EventName } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/rainbow12024'

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

const EVENT_NAME = 'activitycenter_rainbow1_2024' as EventName
// 活动数据
const activityData = computed(() => activityStore.activityData)
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
    name: 'activitycenter_rainbow_2024_m13_1',
    title: '累计参与开启虹光三天',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m13_2',
    title: '累计参与开启虹光五天',
    status: 'wait',
  },
  {
    name: 'activitycenter_rainbow_2024_m13_3',
    title: '累计参与开启虹光八天',
    status: 'wait',
  },
]
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    let task
    if (index < 5) {
      const activity =
        activityData.value.event_data.activitycenter_rainbow1_2024[index]
      task = {
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
    } else {
      const activity =
        activityData.value.event_data.activitycenter_rainbow1_2024[5]
      task = {
        ...item,
      }
      let m13TaskIndex = 0
      if (item.name === 'activitycenter_rainbow_2024_m13_1') {
        m13TaskIndex = 0
      } else if (item.name === 'activitycenter_rainbow_2024_m13_2') {
        m13TaskIndex = 1
      } else if (item.name === 'activitycenter_rainbow_2024_m13_3') {
        m13TaskIndex = 2
      }
      task.status =
        activity.award[m13TaskIndex] === 1
          ? 'redeemed'
          : activity.award[m13TaskIndex] === 0 &&
            activity.value >= activity.stages[m13TaskIndex]
          ? 'can'
          : 'wait'
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

const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))
// 设置红点
function setRedDot(): void {
  const taskList = activityData.value.event_data.activitycenter_rainbow1_2024
  const hasUnclaimedReward = taskList.some((task, index) => {
    let res
    if (index !== 5) {
      res = task.value >= task.stages[0] && task.award[0] === 0
    } else {
      if (currentTask.taskName) {
        // 点击领取奖品更新红点
        const taskName = currentTask.taskName
        if (taskName === 'activitycenter_rainbow_2024_m13_1') {
          res = task.value >= task.stages[0] && task.award[0] === 0
        } else if (taskName === 'activitycenter_rainbow_2024_m13_2') {
          res = task.value >= task.stages[1] && task.award[1] === 0
        } else if (taskName === 'activitycenter_rainbow_2024_m13_3') {
          res = task.value >= task.stages[2] && task.award[2] === 0
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
          activitycenter_rainbow1_2024: data.event_data[EVENT_NAME].sort(
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
      activitycenter_rainbow1_2024:
        activityData.value.event_data.activitycenter_rainbow1_2024.map(
          (item, index) => {
            const res = { ...item }
            const taskName = currentTask.taskName
            if (index !== 5) {
              res.award = item.task_id === taskName ? [1] : item.award
            } else {
              if (taskName === 'activitycenter_rainbow_2024_m13_1') {
                res.award[0] = 1
              } else if (taskName === 'activitycenter_rainbow_2024_m13_2') {
                res.award[1] = 1
              } else if (taskName === 'activitycenter_rainbow_2024_m13_3') {
                res.award[2] = 1
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
  // 领奖
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  let rewardId = 1
  if (taskIndex >= 5) {
    const taskName = task
    if (taskName === 'activitycenter_rainbow_2024_m13_1') {
      rewardId = 1
    } else if (taskName === 'activitycenter_rainbow_2024_m13_2') {
      rewardId = 2
    } else if (taskName === 'activitycenter_rainbow_2024_m13_3') {
      rewardId = 3
    }
    task = 'activitycenter_rainbow_2024_m13'
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

@for $i from 1 through 8 {
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
  }
}
.task-item1 {
  top: 151px;
  left: 96px;
}
.task-item2 {
  top: 325px;
  left: 448px;
}
.task-item3 {
  top: 417px;
  left: 847px;
}
.task-item4 {
  top: 325px;
  left: 1231px;
}
.task-item5 {
  width: 442px;
  height: 286px;
  top: 172px;
  left: 1553px;
}

.task-item6,
.task-item7,
.task-item8 {
  width: 146px;
  height: 175px;
}
.task-item6 {
  top: 921px;
  left: 126px;
}
.task-item7 {
  top: 921px;
  left: 305px;
}
.task-item8 {
  top: 921px;
  left: 484px;
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
