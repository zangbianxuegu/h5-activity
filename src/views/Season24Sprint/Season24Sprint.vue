<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season24-sprint flex h-screen">
      <div class="season24-sprint-main">
        <div class="moomin-logo"></div>
        <div class="copyright"></div>
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              与爱同行 温暖相拥
              <p>
                <time datetime="2024-12-31">12.31</time>-
                <time datetime="2025-01-06">1.6</time>
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
            <ul class="task-list flex">
              <li
                v-for="(item, index) in taskList"
                :key="item.id"
                class="task-list-container flex flex-col items-center"
              >
                <div
                  :class="['relative']"
                  :aria-label="`任务 ${index + 1}: ${item.title}`"
                >
                  <can-reward-bubble-animation
                    :ref="item.canRewardLottieRef"
                    :id="item.value"
                    class="reward-can-dynamic-bubble"
                  ></can-reward-bubble-animation>
                  <!-- 圆 -->
                  <div
                    :class="[
                      'task-item animate__animated animate__fadeIn',
                      `task-item${index + 1}`,
                      `${item.status}`,
                    ]"
                    @click.capture="handleReward($event, 1, item)"
                  ></div>
                  <!-- 托 -->
                  <div :class="['task-item-bg', `${item.status}`]"></div>
                </div>
                <p
                  :class="[
                    'text-wrap  w-[349px] whitespace-pre-line text-center text-[30px] leading-tight',
                    `${
                      item.status === 'can'
                        ? 'mt-[47px] text-[#ffeea9]'
                        : item.status === 'redeemed'
                        ? 'mt-[4px] text-[#bebebe]'
                        : 'mt-[47px] text-white'
                    }`,
                  ]"
                >
                  {{ item.title }}
                </p>
              </li>
            </ul>
            <!-- 累计任务 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务</h2>
            <div class="acc-task-list flex items-center">
              <div class="acc-task-title">
                累计登录
                <p class="text-[#f9ff92]">（3/5）</p>
              </div>
              <ul
                class="flex items-center"
                aria-labelledby="accTaskListHeading"
              >
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="relative"
                >
                  <div
                    class="flex items-end justify-center bg-contain"
                    :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                    @click="handleReward($event, index + 1, item)"
                  >
                    <div class="relative">
                      <can-reward-bubble-animation
                        @click.stop="handleReward($event, index + 1, item)"
                        :ref="item.canRewardLottieRef"
                        :id="`${item.value}${item.id}`"
                        class="reward-can-dynamic-bubble acc-reward-can-dynamic-bubble"
                      ></can-reward-bubble-animation>
                      <div
                        v-if="['wait', 'can', 'redeemed'].includes(item.status)"
                        :class="[
                          'acc-task-item animate__animated animate__fadeIn',
                          `acc-task-item${index + 1}`,
                          `${item.status}`,
                        ]"
                      ></div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section aria-labelledby="activity-rules-title" class="p-4">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年12月31日~2025年1月6日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，完成全部季节任务，即可领取
                  <span class="text-[#ffcb4d]">体型重塑*2</span>
                </li>
                <li>
                  活动期间，累计收集20根季节蜡烛，即可领取
                  <span class="text-[#ffcb4d]">爱心*2</span>
                </li>
                <li>
                  活动期间，完成累计登录天数，即可领取
                  <span class="text-[#ffcb4d]">传信纸船*1，绚丽彩虹*1</span>
                </li>
                <li>
                  活动期间，完成姆明季毕业，即可领取
                  <span class="text-[#ffcb4d]">新季节蜡烛*6</span>
                </li>
              </ul>
            </section>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <div class="h-[640px] overflow-auto px-4">
              <section
                class="flex h-full flex-col"
                aria-labelledby="modalRewardTitle"
              >
                <h2 id="modalRewardTitle" class="sr-only">领奖弹框</h2>
                <p class="modal-text mt-4">领取奖励说明：</p>
                <p class="modal-text mt-1">
                  <span class="text-[#ffcb4d]">新版本更新后</span
                  >，可在游戏内通过<span class="text-[#ffcb4d]">邮件</span
                  >领取<span class="text-[#ffcb4d]">新季节蜡烛*6</span
                  >，感谢您的参与！
                </p>
              </section>
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
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/season24Sprint'
import gsap from 'gsap'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  resize_potion: string
  heart: string
  message_boat: string
  rainbow: string
  season_candles: string
}
/**
 * hadRenderLottie: 是否渲染过lottie（解决因computed和watch多次更新导致多次渲染lottie）
 */
interface Reward {
  id: number
  value: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

const rewardsText: RewardsName = {
  resize_potion: '体型重塑',
  heart: '爱心',
  message_boat: '传信纸船',
  rainbow: '绚丽彩虹',
  season_candles: '新季节蜡烛',
}
const curRewards: Ref<Rewards> = ref({
  name: 'resize_potion',
  count: 2,
})

// 主任务列表
const TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_season24_sprint_m1',
    title: '完成全部\n季节任务',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'collecting_season_candles',
    title: '累计收集20\n根季节蜡烛',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'activitycenter_season24_sprint_m4',
    title: '姆明季毕业',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]
// 累计任务列表
const ACC_TASK_LIST = [
  {
    id: 1,
    value: 'login_days',
    title: '累计登录3天',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'login_days',
    title: '累计登录5天',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()
// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_season24_sprint'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.value, index]),
)

// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT_NAME][index]
    return {
      ...item,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
          ? 'can'
          : 'wait',
    }
  })
})

// 累计任务列表
const accTaskList = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][3]
  return ACC_TASK_LIST.map((item, index) => {
    return {
      ...item,
      status:
        activity.award[index] === 1
          ? 'redeemed'
          : activity.award[index] === 0 &&
            activity.value >= activity.stages[index]
          ? 'can'
          : 'wait',
    }
  })
})

const sessionIsVisitedKey = 'isVisitedSeason24Sprint'
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
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-3项，任务列表
  const tasksValid = tasks
    .slice(0, 3)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  // 检查第4项，累计任务
  const accTask = tasks[3]
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
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT_NAME]: data.event_data[EVENT_NAME].sort(
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
      console.log('activityStore: ', newActivityData)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param event 鼠标事件
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(event: MouseEvent, rewardId: number, item: Reward): void {
  const { status, value } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    clickBubbleRewardWait(event)
    return
  }

  claimMissionReward({
    event: EVENT_NAME,
    task: value,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards

      await bubbleBurst(event, item)
      // 更新页面数据
      const taskIndex = activityData.value.event_data[EVENT_NAME].findIndex(
        (item) => {
          return item.task_id === value
        },
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[
        rewardId - 1
      ] = 1
      if (value === 'activitycenter_season24_sprint_m4') {
        modalReward.value?.openModal()
      } else {
        curRewards.value = {
          name: rewards[0].name,
          count: rewards[0].count,
        }
        showToast(
          `领取成功，您获得了 ${
            rewardsText[curRewards.value.name as keyof RewardsName]
          }*${curRewards.value.count}`,
        )
      }
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 奖品wait状态点击果冻效果
const clickBubbleRewardWait = (event: MouseEvent): void => {
  const dom = event.target
  gsap
    .timeline()
    .to(dom, { scaleY: 0.8, duration: 0.2, ease: 'power1.in' }) // 垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 垂直拉伸
    .to(dom, { scaleY: 0.9, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1, duration: 0.2, ease: 'power1.out' }) // 恢复原样
}

const initCanRewardLottie = (reward: Reward): void => {
  reward.canRewardLottieRef?.value[0].initLottie()
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    reward.hadRenderLottie.value = true
  }
}

const allTasks = computed(() => [...taskList.value, ...accTaskList.value])
const handleTask = (task: Reward): void => {
  if (task.status === 'can') {
    void nextTick(() => {
      if (task.hadRenderLottie && !task.hadRenderLottie.value) {
        initCanRewardLottie(task)
      }
    })
  } else {
    task.canRewardLottieRef?.value?.[0]?.destroyAnimation()
  }
}
watchEffect(() => {
  allTasks.value.forEach(handleTask)
})

const bubbleBurst = async (
  event: MouseEvent,
  reward: Reward,
): Promise<void> => {
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value[0].playAnimationClickBubble()
  }
  // 果冻效果
  clickBubbleRewardWait(event)
  const target = event.target
  // 溅射效果
  await gsap
    .timeline()
    .to(target, {
      scaleY: 0.8,
      duration: 0.2,
      ease: 'power1.in',
      opacity: 0.9,
    }) // 垂直压挤
    .to(target, {
      scaleY: 1.1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0.5,
    }) // 垂直拉伸
    .to(target, {
      scaleY: 1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0,
    }) // 再次垂直压挤
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

.season24-sprint {
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
    background-image: url('@/assets/images/season24-sprint/bg.jpg');

    .moomin-logo {
      position: absolute;
      left: 30px;
      top: 27px;
      width: 348px;
      height: 55px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url('@/assets/images/season24-sprint/moomin-logo.png');
    }

    .copyright {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 541px;
      height: 165px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url('@/assets/images/season24-sprint/copyright.png');
    }
  }
}

.title {
  position: absolute;
  right: 120px;
  top: 132px;
  width: 600px;
  height: 364px;
  background-image: url('@/assets/images/season24-sprint/title.png');
}

.help {
  position: absolute;
  width: 45px;
  height: 45px;
  bottom: 2px;
  right: 250px;
  background-image: url('@/assets/images/season24-sprint/help.png');
  background-repeat: no-repeat;
}

.task-list {
  position: absolute;
  left: 135px;
  top: 300px;
}
.task-list-container {
  margin-right: 27px;
  padding-top: 54px;
  width: 349px;
  height: 397px;
  background-image: url('@/assets/images/season24-sprint/task-bg.png');
  background-repeat: no-repeat;
  background-size: contain;
}

.task-item {
  width: 195px;
  height: 190px;
}
.task-item-bg {
  position: absolute;
  left: -32px;
  bottom: -42px;
  width: 252px;
  height: 164px;
  background-size: 252px 164px;
  background-position: center;
  pointer-events: none;

  &.wait {
    background-image: url('@/assets/images/season24-sprint/task-wait-bg.png');
  }
  &.can {
    background-image: url('@/assets/images/season24-sprint/task-can-bg.png');
  }
  &.redeemed {
    display: none;
  }
}

@for $i from 1 through 3 {
  .task-item#{$i} {
    background-repeat: no-repeat;
    background-size: contain;
    &.wait {
      background-image: url('@/assets/images/season24-sprint/task-wait-circle.png'),
        url('@/assets/images/season24-sprint/task#{$i}-icon.png');
    }
    &.redeemed {
      width: 230px;
      height: 230px;
      background-image: url('@/assets/images/season24-sprint/task#{$i}-redeemed.png');
    }
    &.can {
      background-image: url('@/assets/images/season24-sprint/task#{$i}-icon.png');
    }
  }
}
.task-item1.wait {
  background-size:
    contain,
    87px 120px;
  background-position:
    center,
    54px 44px;
}
.task-item2.wait {
  background-size:
    contain,
    76px 111px;
  background-position:
    center,
    center 52px;
}
.task-item3.wait {
  background-size:
    contain,
    53px 133px;
  background-position:
    center,
    center 32px;
}
.task-item1.can {
  background-size: 87px 120px;
  background-position: center 44px;
  // background-image: url('@/assets/images/season24-sprint/task-wait-circle.png'),
  //   url('@/assets/images/season24-sprint/task1-can.png');
  // background-size:
  //   contain,
  //   87px 120px;
  // background-position:
  //   center,
  //   center 44px;
}
.task-item2.can {
  background-size: 76px 111px;
  background-position: center 52px;
}
.task-item3.can {
  background-size: 53px 133px;
  background-position: center 32px;
}

.acc-task-list {
  position: absolute;
  left: 132px;
  bottom: 152px;
  width: 816px;
  height: 208px;
  background-image: url('@/assets/images/season24-sprint/acc-task-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.acc-task-title {
  margin-left: 92px;
  margin-right: 46px;
  font-size: 36px;
  line-height: 1.2;
  color: #ffffff;
}
.acc-task-item {
  width: 256px;
  height: 230px;
}
@for $i from 1 through 2 {
  .acc-task-item#{$i} {
    background-repeat: no-repeat;
    background-size: contain;
    &.can {
      background-image: url('@/assets/images/season24-sprint/acc-task#{$i}-can.png');
    }
    &.wait {
      background-image: url('@/assets/images/season24-sprint/acc-task#{$i}-wait.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/season24-sprint/acc-task#{$i}-redeemed.png');
    }
  }
}
.acc-task-item1.can {
  background-size: 90px 82px;
  background-position: center 82px;

  //background-image: url('@/assets/images/season24-sprint/acc-task1-wait.png');
}
.acc-task-item2.can {
  background-size: 80px 97px;
  background-position: 92px 67px;
}

.reward-can-dynamic-bubble {
  width: 230px;
  height: 235px;
  position: absolute;
  top: -14px;
  left: -19px;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}

.acc-reward-can-dynamic-bubble {
  width: 210px;
  height: 130px;
  top: 60px;
  left: 26px;
}
</style>
