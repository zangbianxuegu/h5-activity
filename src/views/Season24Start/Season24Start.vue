<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season24-start flex h-screen">
      <div class="season24-start-main">
        <div class="moomin-logo"></div>
        <div class="copyright"></div>
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              因为被爱 所以看见
              <p>
                <time datetime="2024-10-18">10.18</time>-
                <time datetime="2024-10-31">10.31</time>
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
            <ul
              class="task-list clear-both flex bg-cover"
              aria-labelledby="taskListHeading"
            >
              <li
                v-for="(item, index) in taskList"
                :key="item.id"
                class="flex flex-col items-center"
              >
                <div
                  :class="[`${item.status}`]"
                  :aria-label="`任务 ${index + 1}: ${item.title}`"
                  @click="
                    handleReward(
                      $event,
                      item.value,
                      item.status,
                      1,
                      index,
                      item,
                    )
                  "
                >
                  <div class="relative">
                    <can-reward-bubble-animation
                      @click.stop="
                        handleReward(
                          $event,
                          item.value,
                          item.status,
                          1,
                          index,
                          item,
                        )
                      "
                      :ref="item.canRewardLottieRef"
                      :id="item.value"
                      class="reward-can-dynamic-bubble"
                    ></can-reward-bubble-animation>
                    <div
                      v-if="item.status === 'wait'"
                      :class="[
                        'task-item animate__animated animate__fadeIn animate__slow bg-contain',
                        `task-item${index + 1}`,
                        `${item.status}`,
                      ]"
                    ></div>
                    <div
                      v-if="item.status === 'can'"
                      :class="[
                        'task-item animate__animated animate__fadeIn animate__slow bg-contain',
                        `task-item${index + 1}`,
                        `${item.status}`,
                      ]"
                    ></div>
                    <div
                      v-if="item.status === 'redeemed'"
                      :class="[
                        'task-item animate__animated animate__fadeIn animate__slow bg-contain',
                        `task-item${index + 1}`,
                        `${item.status}`,
                        `${item.value}-redeemed-reward-bubble-${item.id}`,
                      ]"
                    ></div>
                  </div>
                </div>
                <p
                  :class="[
                    'mt-1 w-[300px] whitespace-pre-line text-wrap text-center text-xs',
                    `${item.status === 'can' ? 'text-[#ffeea9]' : item.status === 'redeemed' ? 'text-[#ccc]' : 'text-white'}`,
                  ]"
                >
                  {{ item.title }}
                </p>
              </li>
            </ul>
            <!-- 收集姆明季蜡烛 -->
            <h2 id="accTaskListHeading" class="sr-only">收集姆明季蜡烛</h2>
            <div
              class="absolute bottom-[270px] left-[140px] flex w-[1350px] items-center"
            >
              <div class="acc-task-title"></div>
              <div :class="`progress-bar progress-bar${accTaskStep}`"></div>
              <ul
                class="absolute bottom-0 right-0 top-0 m-auto flex w-[990px] items-center justify-between"
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
                    @click="
                      handleReward(
                        $event,
                        item.value,
                        item.status,
                        item.id,
                        4,
                        item,
                      )
                    "
                  >
                    <div class="relative">
                      <can-reward-bubble-animation
                        @click.stop="
                          handleReward(
                            $event,
                            item.value,
                            item.status,
                            item.id,
                            4,
                            item,
                          )
                        "
                        :ref="item.canRewardLottieRef"
                        :id="`${item.value}${item.id}`"
                        class="reward-can-dynamic-bubble acc-reward-can-dynamic-bubble"
                      ></can-reward-bubble-animation>
                      <div
                        v-if="item.status === 'wait'"
                        :class="[
                          'acc-task-item animate__animated animate__fadeIn',
                          `acc-task-item${index + 1}`,
                          `${item.status}`,
                        ]"
                      ></div>
                      <div
                        v-if="item.status === 'can'"
                        :class="[
                          'acc-task-item animate__animated animate__fadeIn',
                          `acc-task-item${index + 1}`,
                          `${item.status}`,
                        ]"
                      ></div>
                      <div
                        v-if="item.status === 'redeemed'"
                        :class="[
                          'acc-task-item animate__animated animate__fadeIn',
                          `acc-task-item${index + 1}`,
                          `${item.status}`,
                          `${item.value}-redeemed-reward-bubble-${item.id}`,
                        ]"
                      ></div>
                    </div>
                  </div>
                  <p
                    class="auto absolute bottom-1.5 left-0 right-0 text-center text-xs text-white"
                  >
                    {{ (index + 1) * 10 }}
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section aria-labelledby="activity-rules-title">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年10月18日~2024年10月31日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  完成姆明一家的第一个任务，即可领取
                  <span class="text-[#ffcb4d]">畅谈长桌*2</span>
                </li>
                <li>
                  完成妮妮的第一个任务，即可领取
                  <span class="text-[#ffcb4d]">璀璨之星*2</span>
                </li>
                <li>
                  兑换一件新季节外观，即可领取
                  <span class="text-[#ffcb4d]">蜡烛*2</span>
                </li>
                <li>
                  累计登录5天，即可领取
                  <span class="text-[#ffcb4d]">爱心*2</span>
                </li>
                <li>
                  收集10根姆明季蜡烛，即可领取：
                  <span class="text-[#ffcb4d]">姆明季蜡烛*1</span>
                </li>
                <li>
                  收集20根姆明季蜡烛，即可领取：
                  <span class="text-[#ffcb4d]">姆明季蜡烛*1</span>
                </li>
                <li>
                  收集30根姆明季蜡烛，即可领取：
                  <span class="text-[#ffcb4d]">体型重塑*2</span>
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
                <p class="modal-text mt-4">
                  恭喜你获得
                  <span class="modal-text-blue">
                    {{ rewardsText[curRewards.name as keyof RewardsName] }} *
                    {{ curRewards.count }} </span
                  >：
                </p>
                <div class="flex flex-1 items-center justify-center">
                  <img
                    :src="handleSrc(String(curRewards.name))"
                    alt="reward image"
                  />
                </div>
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
import type { DesignConfig, Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/season24Start'
import gsap from 'gsap'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  table: string
  glow: string
  candles: string
  heart: string
  resize_potion: string
  season_candle: string
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
  table: '畅谈长桌',
  glow: '璀璨之星',
  candles: '蜡烛',
  heart: '爱心',
  resize_potion: '体型重塑',
  season_candle: '姆明季蜡烛',
}
const curRewards: Ref<Rewards> = ref({
  name: 'table',
  count: 2,
})

// 主任务列表
const TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_season24_start_m1',
    title: '帮助迪琪带领妮\n妮去见姆明一家',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'activitycenter_season24_start_m2',
    title: '探索妮妮\n的内心世界',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'activitycenter_season24_start_m3',
    title: '兑换一件\n新季节外观',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 4,
    value: 'login_days',
    title: '累计登录5天',
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
    value: 'collecting_season_candles',
    title: '收集姆明季蜡烛10个',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'collecting_season_candles',
    title: '收集姆明季蜡烛20个',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'collecting_season_candles',
    title: '收集姆明季蜡烛30个',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]

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
useResponsiveStyles(designConfig)

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_season24_start'
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
  const activity = activityData.value.event_data[EVENT_NAME][4]
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

// 累计任务进度条
const accTaskStep = computed(() => {
  let step = accTaskList.value.findIndex((item) => {
    return item.status === 'wait'
  })
  step = step === -1 ? 3 : step
  return step
})

const sessionIsVisitedKey = 'isVisitedSeason24Start'
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
 * @function 处理 img src
 * @param name 奖励名
 * @returns {string} 图片路径
 */
function handleSrc(name: string): string {
  name = name === 'season_candle' ? 'muming_candle' : name
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

/**
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-4项，任务列表
  const tasksValid = tasks
    .slice(0, 4)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  // 检查第5项，累计任务
  const accTask = tasks[4]
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
          activitycenter_season24_start: data.event_data[EVENT_NAME].sort(
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
      console.log('activityStore: ', activityStore)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param status 状态
 * @param rewardId 第几个奖励节点
 * @param index 任务索引
 * @returns {void}
 */
function handleReward(
  event: MouseEvent,
  task: string,
  status: string,
  rewardId: number,
  index: number,
  item: Reward,
): void {
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
    task,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      // modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      await bubbleBurst(event, item)
      // 更新页面数据
      activityData.value.event_data[EVENT_NAME][index].award[rewardId - 1] = 1
      activityStore.updateActivityData(activityData.value)
      showToast(
        `领取成功，您获得了 ${rewardsText[curRewards.value.name as keyof RewardsName]}*${curRewards.value.count}`,
      )
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
      opacity: 0.3,
    }) // 垂直压挤
    .to(target, {
      scaleY: 1.1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0.7,
    }) // 垂直拉伸
    .to(target, {
      scaleY: 1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 1,
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
.season24-start {
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
    background-image: url('@/assets/images/season24-start/bg.png');
    .moomin-logo {
      position: absolute;
      left: 30px;
      top: 30px;
      width: 348px;
      height: 55px;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url('@/assets/images/season24-start/moomin-logo.png');
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
      background-image: url('@/assets/images/season24-start/copyright.png');
    }
  }
}
.title {
  position: absolute;
  left: 140px;
  top: 130px;
  width: 1305px;
  height: 217px;
  background-image: url('@/assets/images/season24-start/title.png');
}
.help {
  position: absolute;
  width: 47px;
  height: 47px;
  top: 62px;
  right: 40px;
  background-image: url('@/assets/images/season24-start/help.png');
  background-repeat: no-repeat;
}
.task-list {
  position: absolute;
  left: 110px;
  top: 300px;
  padding: 64px 39px 105px 90px;
  width: 1350px;
  height: 499px;
  background-image: url('@/assets/images/season24-start/main-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}
.task-item {
  float: left;
  margin-right: 0px;
  width: 300px;
  height: 234px;
}
@for $i from 1 through 4 {
  .task-item#{$i} {
    background-repeat: no-repeat;
    &.wait {
      background-image: url('@/assets/images/season24-start/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/season24-start/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/season24-start/task#{$i}-redeemed.png');
    }
  }
}
.acc-task-title {
  width: 230px;
  height: 70px;
  background-image: url('@/assets/images/season24-start/collect-title.png');
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 10px;
  position: relative;
  bottom: 3px;
}
.progress-bar {
  width: 1048px;
  height: 22px;
  background-repeat: no-repeat;
  background-size: contain;
  margin-right: 10px;
}
@for $i from 0 through 3 {
  .progress-bar#{$i} {
    background-image: url('@/assets/images/season24-start/progress-bar#{$i}.png');
  }
}
.acc-task-item {
  width: 250px;
  height: 250px;
  margin-top: 20px;
}
@for $i from 1 through 3 {
  .acc-task-item#{$i} {
    background-repeat: no-repeat;
    background-size: contain;
    &.wait {
      background-image: url('@/assets/images/season24-start/acc-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/season24-start/acc-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/season24-start/acc-task#{$i}-redeemed.png');
    }
  }
}
$reward-bubble-wait-width: 207px;
$reward-bubble-wait-height: 207px;
.reward-can-dynamic-bubble {
  width: $reward-bubble-wait-width + 50px;
  height: $reward-bubble-wait-height;
  position: absolute;
  top: 0px;
  left: 18px;
  // overflow: hidden;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}
.acc-reward-can-dynamic-bubble {
  width: 200px;
  height: 150px;
  top: 60px;
  left: 26px;
}
</style>
