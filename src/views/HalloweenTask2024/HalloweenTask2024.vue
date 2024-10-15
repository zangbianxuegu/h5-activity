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
            <!-- 任务列表组件 -->
            <!-- 遍历 taskLists 对象，为每种类型的任务创建一个 TaskList 组件 -->
            <TaskList
              v-for="(tasks, type) in taskLists"
              :key="type"
              :title="titles[type]"
              :tasks="tasks"
              :listClass="`${type}-task-list`"
              :itemClass="`task-item ${type}-task-item`"
              @reward="handleReward"
            />
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
                <li v-for="item in taskInfoList" :key="item.name">
                  活动期间，{{ item.name }}，即可领取
                  <span class="text-[#ffcb4d]"
                    >捣蛋挖宝次数*{{ item.count }}</span
                  >
                </li>
                <li>
                  活动期间，每日完成下列任务，可获得对应捣蛋挖宝次数：
                  <div class="grid grid-cols-4">
                    <span class="col-span-2">每日任务</span>
                    <span class="col-span-2">奖励</span>
                    <span class="col-span-2">获得1个活动代币</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span class="col-span-2">使用1次万圣节魔法</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span class="col-span-2">感受魔法大锅的洗礼</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                    <span class="col-span-2">收集南瓜烛火</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >捣蛋挖宝次数*1</span
                    >
                  </div>
                </li>
                <li>
                  活动期间，每周领取礼物螃蟹送出的魔法，即可领取
                  <span class="text-[#ffcb4d]">捣蛋挖宝次数*3</span>
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
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import TaskList from './components/TaskList.vue'

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
  ticket: '捣蛋挖宝次数',
}

const curRewards: Ref<Rewards> = ref({
  name: 'ticket',
  count: 1,
})

const taskInfoList = [
  { name: '被骑扫帚的皮皮猫炸飞一次', count: 1 },
  { name: '找到戴帽子的螃蟹', count: 1 },
  { name: '成功击败怪物', count: 1 },
  { name: '逃脱滚动螃蟹的追击', count: 1 },
  { name: '使用【万圣节】代币兑换任意外观', count: 1 },
  { name: '触发扫帚制作间的陷阱', count: 1 },
  { name: '在活动场景的衣柜换装', count: 1 },
  { name: '完成一次魔法扫帚的练习', count: 2 },
  { name: '获得40个活动代币', count: 2 },
]

// 创建任务的函数
const taskItem = (
  id: number,
  value: string,
  title: string,
  status = 'wait',
  canRewardLottieRef = ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie = ref(false),
): Reward => ({
  id,
  value,
  title,
  status,
  canRewardLottieRef,
  hadRenderLottie,
})

// 每日列表
const DAILY_TASK_LIST = [
  taskItem(1, 'activitycenter_Halloweentask_2024_m10', '收集一个活动代币'),
  taskItem(2, 'use_consumables', '使用一次万圣节魔法'),
  taskItem(3, 'activitycenter_Halloweentask_2024_m12', '感受魔法大锅的洗礼'),
  taskItem(4, 'activitycenter_Halloweentask_2024_m13', '点燃南瓜收集烛火'),
]

// 每周任务
const WEEKLY_TASK_LIST = [
  taskItem(
    1,
    'activitycenter_Halloweentask_2024_m14',
    '领取礼物螃蟹送出的魔法',
  ),
]

// 捣蛋清单
const TRICK_TASK_LIST = [
  taskItem(1, 'activitycenter_Halloweentask_2024_m1', '被骑扫帚的皮皮猫炸飞'),
  taskItem(2, 'activitycenter_Halloweentask_2024_m2', '找到戴帽子的螃蟹'),
  taskItem(3, 'activitycenter_Halloweentask_2024_m3', '成功打败怪物'),
  taskItem(4, 'activitycenter_Halloweentask_2024_m4', '逃脱滚动螃蟹的追击'),
  taskItem(5, 'activitycenter_Halloweentask_2024_m5', '使用代币进行兑换物品'),
  taskItem(6, 'activitycenter_Halloweentask_2024_m6', '触发扫帚制作间的陷阱'),
  taskItem(7, 'activitycenter_Halloweentask_2024_m7', '在活动场景的衣柜换装'),
  taskItem(8, 'activitycenter_Halloweentask_2024_m8', '完成一次魔法扫帚的练习'),
  taskItem(9, 'collecting_event_candles', '获得40个活动代币'),
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

// 获取任务状态
const getTaskStatus = (activity: Event): string => {
  const { award, value, stages } = activity
  if (award?.[0] === 1) return 'redeemed'
  if (award?.[0] === 0 && value >= stages?.[0]) return 'can'
  return 'wait'
}

// 创建任务列表
const createTaskList = (
  taskList: Reward[],
  startIndex: number = 0,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      const activity =
        activityData.value.event_data[EVENT_NAME][index + startIndex]
      return {
        ...item,
        status: getTaskStatus(activity),
      }
    })
  })
}

// 每日任务列表
const dailyTaskList = createTaskList(DAILY_TASK_LIST)
// 每周任务
const weeklyTaskList = createTaskList(WEEKLY_TASK_LIST, 4)
// 捣蛋清单
const trickTaskList = createTaskList(TRICK_TASK_LIST, 5)

// 任务列表
const taskLists = computed(() => ({
  daily: dailyTaskList.value,
  weekly: weeklyTaskList.value,
  trick: trickTaskList.value,
}))

const titles: Record<string, string> = {
  daily: '每日任务',
  weekly: '每周任务',
  trick: '捣蛋清单',
}

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
  // 检查1-14项，任务列表
  return tasks.some(
    (task) => task.value >= task.stages[0] && task.award[0] === 0,
  )
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
 * @param event 鼠标事件
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(event: MouseEvent, rewardId: number, item: Reward): void {
  const { value, status } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    clickBubbleReward(event)
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

/**
 * @function 初始化可领取奖励的Lottie动画
 * @param {Reward} reward - 奖励对象
 * @returns {void}
 */
const initCanRewardLottie = (reward: Reward): void => {
  // 初始化Lottie动画
  reward.canRewardLottieRef?.value[0].initLottie()
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    // 标记Lottie动画已经渲染
    reward.hadRenderLottie.value = true
  }
}

// 所有任务列表 将每日任务、每周任务和捣蛋清单任务合并成一个数组
const allTasks = computed(() => [
  ...dailyTaskList.value,
  ...weeklyTaskList.value,
  ...trickTaskList.value,
])

/**
 * @function 处理任务状态
 * @param {Reward} task - 任务对象
 * @returns {void}
 */
const handleTask = (task: Reward): void => {
  if (task.status === 'can') {
    // 使用 nextTick 确保 DOM 更新后再执行
    void nextTick(() => {
      // 检查是否需要初始化 Lottie 动画
      if (task.hadRenderLottie && !task.hadRenderLottie.value) {
        initCanRewardLottie(task)
      }
    })
  } else {
    // 如果任务状态不是 'can'，销毁相关的 Lottie 动画
    task.canRewardLottieRef?.value?.[0]?.destroyAnimation()
  }
}

// 监视所有任务的变化，并为每个任务执行处理
watchEffect(() => {
  allTasks.value.forEach(handleTask)
})

/**
 * @function 点击气泡弹弹弹的果冻效果
 * @param {MouseEvent} event - 鼠标事件
 * @returns {void}
 */
const clickBubbleReward = (event: MouseEvent): void => {
  const dom = event.target
  gsap
    .timeline()
    .to(dom, { scaleY: 0.8, duration: 0.2, ease: 'power1.in' }) // 垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 垂直拉伸
    .to(dom, { scaleY: 0.9, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 再次垂直拉伸
    .to(dom, { scaleY: 1, duration: 0.2, ease: 'power1.out' }) // 恢复原样
}

/**
 * @function 气泡爆炸动画
 * @param {MouseEvent} event - 鼠标事件
 * @param {Reward} reward - 奖励对象
 * @returns {Promise<void>}
 */
const bubbleBurst = async (
  event: MouseEvent,
  reward: Reward,
): Promise<void> => {
  // 如果存在可领取奖励的Lottie动画引用，播放点击气泡动画
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value[0].playAnimationClickBubble()
  }
  // 果冻效果
  clickBubbleReward(event)
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
    }) // 再次垂直压挤并淡出
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
</style>
