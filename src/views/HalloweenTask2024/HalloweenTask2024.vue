<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="halloween flex h-screen">
      <div class="halloween-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="relative h-full overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              不给糖果就捣蛋！
              <p>
                <time datetime="2024-10-26">10.26</time>-
                <time datetime="2024-11-15">11.15</time>
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
            <h2 class="sr-only">每日任务</h2>
            <ul class="daily-task-list">
              <li
                v-for="item in dailyTaskList"
                :key="item.value"
                class="mb-[18px] flex items-center justify-between"
              >
                <p
                  :class="[
                    'mt-[21px] text-[32px]',
                    `${item.status === 'can' ? 'text-[#fff1ad]' : item.status === 'redeemed' ? 'text-[#d9d9d9]' : 'text-white'}`,
                  ]"
                >
                  {{ item.title }}
                </p>
                <div class="relative" @click="handleReward($event, 1, item)">
                  <can-reward-bubble-animation
                    @click.stop="handleReward($event, 1, item)"
                    :ref="item.canRewardLottieRef"
                    :id="item.value"
                    class="reward-can-dynamic-bubble"
                  ></can-reward-bubble-animation>
                  <div
                    v-if="item.status === 'wait'"
                    :class="[
                      'daily-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                    ]"
                  ></div>
                  <div
                    v-if="item.status === 'can'"
                    :class="[
                      'daily-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                    ]"
                  ></div>
                  <div
                    v-if="item.status === 'redeemed'"
                    :class="[
                      'daily-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                      `${item.value}-redeemed-reward-bubble-${item.id}`,
                    ]"
                  ></div>
                </div>
              </li>
            </ul>
            <h2 class="sr-only">每周任务</h2>
            <ul class="weekly-task-list">
              <li
                v-for="item in weeklyTaskList"
                :key="item.value"
                class="mb-[18px] flex items-center justify-between"
              >
                <p
                  :class="[
                    `mt-[16px] text-[32px]`,
                    `${item.status === 'can' ? 'text-[#fff1ad]' : item.status === 'redeemed' ? 'text-[#d9d9d9]' : 'text-white'}`,
                  ]"
                >
                  {{ item.title }}
                </p>
                <div class="relative" @click="handleReward($event, 1, item)">
                  <can-reward-bubble-animation
                    @click.stop="handleReward($event, 1, item)"
                    :ref="item.canRewardLottieRef"
                    :id="item.value"
                    class="reward-can-dynamic-bubble"
                  ></can-reward-bubble-animation>
                  <div
                    v-if="item.status === 'wait'"
                    :class="[
                      'weekly-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                    ]"
                  ></div>
                  <div
                    v-if="item.status === 'can'"
                    :class="[
                      'weekly-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                    ]"
                  ></div>
                  <div
                    v-if="item.status === 'redeemed'"
                    :class="[
                      'weekly-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                      `${item.value}-redeemed-reward-bubble-${item.id}`,
                    ]"
                  ></div>
                </div>
              </li>
            </ul>
            <h2 class="sr-only">捣蛋清单</h2>
            <ul class="trick-task-list">
              <li
                v-for="item in trickTaskList"
                :key="item.value"
                class="mb-[22px] flex items-center justify-between"
              >
                <p
                  :class="[
                    `trick-bg text-[32px]`,
                    `${item.status === 'can' ? 'text-[#fff1ad]' : item.status === 'redeemed' ? 'text-[#afafaf]' : 'text-white'}`,
                  ]"
                >
                  {{ item.title }}
                </p>
                <div class="relative" @click="handleReward($event, 1, item)">
                  <can-reward-bubble-animation
                    @click.stop="handleReward($event, 1, item)"
                    :ref="item.canRewardLottieRef"
                    :id="item.value"
                    class="reward-can-dynamic-bubble trick-reward-can-dynamic-bubble"
                  ></can-reward-bubble-animation>
                  <div
                    v-if="item.status === 'wait'"
                    :class="[
                      'trick-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                    ]"
                  ></div>
                  <div
                    v-if="item.status === 'can'"
                    :class="[
                      'trick-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                    ]"
                  ></div>
                  <div
                    v-if="item.status === 'redeemed'"
                    :class="[
                      'trick-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}`,
                      `${item.value}-redeemed-reward-bubble-${item.id}`,
                    ]"
                  ></div>
                </div>
              </li>
            </ul>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section
              aria-labelledby="activity-rules-title"
              class="h-[680px] overflow-y-scroll p-4"
            >
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年10月26日~2024年11月15日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，被骑扫帚的皮皮猫炸飞一次，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，找到戴帽子的螃蟹，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，成功击败怪物，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，逃脱滚动螃蟹的追击，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，使用【万圣节】代币兑换任意外观，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，触发扫帚制作间的陷阱，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，在活动场景的衣柜换装，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*1</span>
                </li>
                <li>
                  活动期间，完成一次魔法扫帚的练习，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*2</span>
                </li>
                <li>
                  活动期间，获得40个活动代币，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*2</span>
                </li>
                <li>
                  活动期间，每日完成下列任务，可获得对应捣蛋挖宝次数：
                  <div class="grid grid-cols-3">
                    <span>每日任务</span>
                    <span class="col-span-2">奖励</span>
                    <span>获得1个活动代币</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span>使用1次万圣节魔法</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span>感受魔法大锅的洗礼</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span>收集南瓜烛火</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                  </div>
                </li>
                <li>
                  活动期间，每周领取礼物螃蟹送出的魔法，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝*3</span>
                </li>
              </ul>
            </section>
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
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/halloweenTask2024'
import gsap from 'gsap'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  ticket: string
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
  ticket: '捣蛋挖宝',
}

const curRewards: Ref<Rewards> = ref({
  name: 'table',
  count: 2,
})

// 每日列表
const DAILY_TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_Halloweentask_2024_m10',
    title: '收集一个活动代币',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'use_consumables',
    title: '使用一次万圣节魔法',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'activitycenter_Halloweentask_2024_m12',
    title: '感受魔法大锅的洗礼',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 4,
    value: 'activitycenter_Halloweentask_2024_m13',
    title: '点燃南瓜收集烛火',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]

// 每周任务
const WEEKLY_TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_Halloweentask_2024_m14',
    title: '领取礼物螃蟹送出的魔法',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]

// 捣蛋清单
const TRICK_TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_Halloweentask_2024_m1',
    title: '被骑扫帚的皮皮猫炸飞',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'activitycenter_Halloweentask_2024_m2',
    title: '找到戴帽子的螃蟹',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'activitycenter_Halloweentask_2024_m3',
    title: '成功打败怪物',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 4,
    value: 'activitycenter_Halloweentask_2024_m4',
    title: '逃脱滚动螃蟹的追击',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 5,
    value: 'activitycenter_Halloweentask_2024_m5',
    title: '使用代币进行兑换物品',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 6,
    value: 'activitycenter_Halloweentask_2024_m6',
    title: '触发扫帚制作间的陷阱',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 7,
    value: 'activitycenter_Halloweentask_2024_m7',
    title: '在活动场景的衣柜换装',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 8,
    value: 'activitycenter_Halloweentask_2024_m8',
    title: '完成一次魔法扫帚的练习',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 9,
    value: 'collecting_event_candles',
    title: '获得40个活动代币',
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

// 活动数据
const EVENT_NAME = 'activitycenter_Halloweentask_2024'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 任务排序
const taskOrderMap = new Map(
  [...DAILY_TASK_LIST, ...WEEKLY_TASK_LIST, ...TRICK_TASK_LIST].map(
    (task, index) => [task.value, index],
  ),
)

// 每日任务列表
const dailyTaskList = computed(() => {
  return DAILY_TASK_LIST.map((item, index) => {
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

// 每周任务
const weeklyTaskList = computed(() => {
  return WEEKLY_TASK_LIST.map((item) => {
    const activity = activityData.value.event_data[EVENT_NAME][4]
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

// 捣蛋清单
const trickTaskList = computed(() => {
  return TRICK_TASK_LIST.map((item, index) => {
    const tasklistIndex = index + 5
    const activity = activityData.value.event_data[EVENT_NAME][tasklistIndex]
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

const sessionIsVisitedKey = 'isVisitedHalloweentask2024'
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
      const tasklist = data.event_data[EVENT_NAME].filter(
        (item: Event) => !Object.prototype.hasOwnProperty.call(item, 'ticket'),
      )
      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_Halloweentask_2024: tasklist.sort(
            (a: Event, b: Event) => {
              const orderA =
                taskOrderMap.get(a.task_id) ?? DAILY_TASK_LIST.length
              const orderB =
                taskOrderMap.get(b.task_id) ?? DAILY_TASK_LIST.length
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
function handleReward(event: MouseEvent, rewardId: number, item: Reward): void {
  const { value, status } = item
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
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      await bubbleBurst(event, item)
      // 更新页面数据
      const taskIndex = activityData.value.event_data[EVENT_NAME].findIndex(
        (item) => {
          return item.task_id === value
        },
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      // activityStore.updateActivityData(activityData.value)
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

const initCanRewardLottie = (reward: Reward): void => {
  reward.canRewardLottieRef?.value[0].initLottie()
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    reward.hadRenderLottie.value = true
  }
}

const allTasks = computed(() => [
  ...dailyTaskList.value,
  ...weeklyTaskList.value,
  ...trickTaskList.value,
])
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

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
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
.halloween {
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
    background-image: url('@/assets/images/halloween-task-2024/bg.png');
  }
}
.help {
  position: absolute;
  width: 71px;
  height: 71px;
  top: 250px;
  right: 318px;
  background-image: url('@/assets/images/halloween-task-2024/help.png');
}
.wait {
  background-image: url('@/assets/images/halloween-task-2024/wait.png');
}
.can {
  background-image: url('@/assets/images/halloween-task-2024/can.png');
}
.redeemed {
  background-image: url('@/assets/images/halloween-task-2024/redeemed.png');
}
.daily-task-list {
  position: absolute;
  left: 400px;
  top: 408px;
  width: 388px;
  height: 500px;
  .daily-task-item {
    width: 90px;
    height: 73px;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.weekly-task-list {
  position: absolute;
  left: 350px;
  bottom: 204px;
  .weekly-task-item {
    width: 90px;
    height: 73px;
    background-repeat: no-repeat;
    background-size: cover;
  }
}
.trick-task-list {
  position: absolute;
  left: 920px;
  top: 444px;
  height: 520px;
  overflow-x: hidden;
  overflow-y: scroll;
  .trick-bg {
    padding-left: 160px;
    width: 785px;
    height: 85px;
    line-height: 85px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('@/assets/images/halloween-task-2024/row.png');
  }
  .trick-task-item {
    width: 120px;
    height: 92px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-left: -180px;
  }
}
.reward-can-dynamic-bubble {
  width: 90px;
  height: 90px;
  position: absolute;
  top: 0;
  right: 0;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}
.trick-reward-can-dynamic-bubble {
  width: 108px;
  height: 82px;
  top: 18px;
  right: 70px;
}
</style>
