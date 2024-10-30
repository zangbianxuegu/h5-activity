<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="double-eleven flex h-screen">
      <div class="double-eleven-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title relative h-full overflow-hidden bg-contain bg-no-repeat"
          >
            <div class="sr-only">
              与光重逢是你我的约定
              <p>
                <time datetime="2024-11-23">11.23</time>-
                <time datetime="2024-12-8">12.8</time>
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
            <TaskList
              :taskList="allTaskList"
              name="allTaskList"
              @reward="handleReward"
            />
            <!-- 隐藏任务列表 -->
            <div v-if="accTaskValue >= 100">
              <h2 id="hideTaskListHeading" class="sr-only">隐藏任务列表</h2>
              <TaskList
                :taskList="hideTaskList"
                name="hideTaskList"
                @reward="handleReward"
              />
              <p
                class="absolute right-[150px] top-[350px] text-[32px] text-white"
              >
                旅人们记得使用拾光相机拍摄哦
              </p>
            </div>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <div
              class="absolute bottom-[50px] right-[50px] flex flex-col rounded-2xl p-4 backdrop-blur"
              style="background-color: rgba(0, 0, 0, 0.25)"
            >
              <div class="h-[60px] text-[36px] leading-[60px] text-[#ffffff]">
                全服任务！品尝中国绊爱饺子
              </div>
              <ul
                class="flex justify-between"
                aria-labelledby="accTaskListHeading"
              >
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="flex h-[250px] flex-col items-center justify-between"
                >
                  <div
                    class="relative"
                    :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                    @click="handleReward($event, item, index + 1)"
                  >
                    <can-reward-bubble-animation
                      @click.stop="handleReward($event, item, 1 + 1)"
                      :ref="item.canRewardLottieRef"
                      :id="item.value"
                      class="acc-reward-can-dynamic-bubble"
                    ></can-reward-bubble-animation>
                    <div
                      v-if="['wait', 'can', 'redeemed'].includes(item.status)"
                      :class="[
                        'acc-task-item animate__animated animate__fadeIn bg-contain',
                        `${item.status}${index + 1}`,
                      ]"
                    ></div>
                  </div>
                  <p
                    class="h-[30px] text-center text-[36px] leading-[36px] text-[#decc5b]"
                  >
                    {{ (index + 1) * 200 }}万
                  </p>
                </li>
              </ul>
              <div class="progress-container">
                <div
                  class="progress-bar"
                  :style="`width: ${accTaskValue > 100 ? 100 : accTaskValue}%;`"
                ></div>
              </div>
            </div>
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
                2024年11月23日~2024年12月8日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li v-for="item in taskRuleInfo" :key="item.description">
                  {{ item.description }}，即可领取<span class="text-[#ffcb4d]"
                    >惊喜礼包*{{ item.rewardCount }}</span
                  >
                </li>
                (打开惊喜礼包后可在<span class="text-[#ffcb4d]"
                  >爱心、蜡烛、姆明季蜡烛、体型重塑、彩虹尾迹、留影蜡烛、共享空间、畅谈长桌、秋千</span
                >中随机抽取一个)<br />
                另外，活动期间<span class="text-[#ffcb4d]"
                  >每累计使用20根蜡烛，可领取1个爱心，最多领取5次</span
                >
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
import { useActivityStore } from '@/stores/kizunaChina2024'
import gsap from 'gsap'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import TaskList from './components/TaskList.vue'

// 定义奖励接口
interface Rewards {
  name: string // 奖励名称
  count: number // 奖励数量
}

// 定义奖励名称接口，将奖励类型映射到中文描述
interface RewardsName {
  heart: '爱心'
  candles: '蜡烛'
  season_candle: '季节蜡烛'
  recording_candle: '留影蜡烛'
  sharedspace_candle: '共享空间'
  table: '畅谈长桌'
  swing: '秋千'
  resize_potion: '体型重塑'
  trail_rainbow: '彩虹尾迹'
  tiny: '小不点'
  fireworks: '浪漫烟花'
}

// 定义单个奖励项接口
interface Reward {
  id: number // 奖励ID
  value: string // 奖励字段名
  title: string // 奖励标题
  status: 'wait' | 'redeemed' | 'can' | string // 奖励状态
  val: number // 奖励值
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>> // 可领取动画引用
  hadRenderLottie?: Ref<boolean> // 是否已渲染动画
}

// 定义任务项接口
interface TaskItem {
  val: number
  status: string
}

// 定义任务列表接口
interface TaskLists {
  title: string
  content: Ref<TaskItem[]>
}

// 定义处理后的任务类型
interface ProcessedTask {
  title: string // 任务标题
  content: Ref<TaskItem[]> // 任务内容，使用Vue的Ref包装TaskItem数组
  val: number // 任务完成值
  status: string // 任务状态
}

// 定义任务规则数组
const taskRuleInfo = [
  { description: '装扮成1次中国绊爱', rewardCount: 1 },
  { description: '搭建1个晃悠悠共享空间', rewardCount: 1 },
  { description: '与大铁头进行1次互动', rewardCount: 2 },
  { description: '寻找头戴晃悠悠的光之子', rewardCount: 2 },
  { description: '连续3天与中国绊爱打招呼', rewardCount: 3 },
]

// 定义奖励文本对象，用于将奖励类型映射到中文描述
const rewardsText: RewardsName = {
  heart: '爱心',
  candles: '蜡烛',
  season_candle: '季节蜡烛',
  recording_candle: '留影蜡烛',
  sharedspace_candle: '共享空间',
  table: '畅谈长桌',
  swing: '秋千',
  resize_potion: '体型重塑',
  trail_rainbow: '彩虹尾迹',
  tiny: '小不点',
  fireworks: '浪漫烟花',
}

// 当前奖励
const curRewards: Ref<Rewards> = ref({
  name: 'heart',
  count: 1,
})

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
const EVENT_NAME = 'activitycenter_kizuna_china_2024'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 创建任务的函数
const taskItem = (
  id: number,
  value: string,
  title: string,
  status = 'wait',
  val = 0,
  canRewardLottieRef = ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie = ref(false),
): Reward => ({
  id,
  value,
  title,
  status,
  val,
  canRewardLottieRef,
  hadRenderLottie,
})

// 任务列表
const TASK_LIST = [
  taskItem(1, 'activitycenter_kizuna_china_2024_m1', '装扮成1次中国绊爱'),
  taskItem(2, 'activitycenter_kizuna_china_2024_m2', '搭建1个晃悠悠共享空间'),
  taskItem(3, 'activitycenter_kizuna_china_2024_m3', '与大铁头进行1次互动'),
  taskItem(4, 'activitycenter_kizuna_china_2024_m4', '寻找头戴晃悠悠的光之子'),
  taskItem(5, 'activitycenter_kizuna_china_2024_m5', '连续3天与中国绊爱打招呼'),
]

// 创建任务列表的函数
const createTaskLists = (key: string, name: string, length = 2): Reward[] =>
  Array.from({ length }, (_, i) => taskItem(i + 1, key, name))

// 定义任务配置
const TASK_MAP = [
  ['activitycenter_kizuna_china_2024_m1', '装扮成1次中国绊爱'],
  ['activitycenter_kizuna_china_2024_m2', '搭建1个晃悠悠共享空间'],
  ['activitycenter_kizuna_china_2024_m3', '与大铁头进行1次互动'],
  ['activitycenter_kizuna_china_2024_m4', '寻找头戴晃悠悠的光之子'],
  ['activitycenter_kizuna_china_2024_m5', '连续3天与中国绊爱打招呼'],
  ['activitycenter_kizuna_china_2024_m7', '与我们一起合影吧！'],
]

// 创建所有任务列表
const [TASK_LIST1, TASK_LIST2, TASK_LIST3, TASK_LIST4, TASK_LIST5, TASK_LIST7] =
  TASK_MAP.map(([key, name]) => createTaskLists(key, name))

// 累计任务
const ACC_TASK_LIST: Reward[] = Array.from({ length: 5 }, (_, i) =>
  taskItem(
    i + 1,
    'activitycenter_kizuna_china_2024_m6',
    `品尝${(i + 1) * 200}W个中国绊爱饺子`,
  ),
)

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0], TASK_LIST7[0]].map((task, index) => [
    task.value,
    index,
  ]),
)

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// 累积任务活动索引
// 这个常量定义了累积任务在活动数据中的索引位置
// 用于在创建累积任务列表时获取正确的活动数据
const ACC_TASK_ACTIVITY_INDEX = 5
// 创建任务列表
const createTaskList = (
  taskList: Reward[],
  activityIndex: number,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      const { award, value, stages } = eventData.value[activityIndex]
      return {
        ...item,
        val: value,
        status: getTaskStatus(award[index], value, stages[index]),
      }
    })
  })
}

// 创建各个任务列表，根据活动数据动态更新任务状态
const taskList1 = createTaskList(TASK_LIST1, 0) // 装扮成1次中国绊爱任务
const taskList2 = createTaskList(TASK_LIST2, 1) // 搭建1个晃悠悠共享空间任务
const taskList3 = createTaskList(TASK_LIST3, 2) // 与大铁头进行1次互动任务
const taskList4 = createTaskList(TASK_LIST4, 3) // 寻找头戴晃悠悠的光之子任务
const taskList5 = createTaskList(TASK_LIST5, 4) // 连续3天与中国绊爱打招呼任务
const taskList7 = createTaskList(TASK_LIST7, 6) // 与我们一起合影吧任务

// 处理任务列表的函数
const processTaskList = (tasks: TaskLists[]): ComputedRef<ProcessedTask[]> => {
  return computed(() =>
    tasks.map((task) => {
      const content = task.content.value
      return {
        ...task,
        // 获取任务的值，如果不存在则默认为0
        val: content[0]?.val ?? 0,
        // 检查任务是否全部完成，如果是则状态为'redeemed'，否则为空字符串
        status: content.every((reward) => reward.status === 'redeemed')
          ? 'redeemed'
          : '',
      }
    }),
  )
}

// 定义任务数组，包括主要任务和隐藏任务
const TASKS = [
  { title: '装扮成1次中国绊爱', content: taskList1 },
  { title: '搭建1个晃悠悠共享空间', content: taskList2 },
  { title: '与大铁头进行1次互动', content: taskList3 },
  { title: '寻找头戴晃悠悠的光之子', content: taskList4 },
  { title: '连续3天与中国绊爱打招呼', content: taskList5 },
  { title: '与我们一起合影吧！', content: taskList7 },
]

// 所有任务列表
const allTaskList = processTaskList(TASKS.slice(0, 5))

// 隐藏任务列表
const hideTaskList = processTaskList([TASKS[5]])

// 累积任务列表
const accTaskList = createTaskList(ACC_TASK_LIST, 5)

// 累计任务完成值
const accTaskValue = ref(eventData.value[ACC_TASK_ACTIVITY_INDEX].value / 10)

const sessionIsVisitedKey = 'isVisitedKizunaChina-2024'
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
  // 使用some方法遍历任务列表，对每个任务的阶段进行检查
  return tasks.some((task) => {
    // 判断任务值是否达到或超过当前阶段要求，且奖励未领取
    return task.stages.some(
      (item, index) => task.value >= item && task.award[index] === 0,
    )
  })
}

/**
 * @function 设置红点
 * @returns {void}
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(eventData.value)
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
          activitycenter_kizuna_china_2024: data.event_data[EVENT_NAME].sort(
            (a: Event, b: Event) => {
              const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
              const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
              return orderA - orderB
            },
          ),
        },
      }
      accTaskValue.value =
        newActivityData.event_data[EVENT_NAME][ACC_TASK_ACTIVITY_INDEX].value
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param event 鼠标事件
 * @param item 任务项
 * @param rewardId 第几个奖励节点 不传默认1
 * @returns {void}
 */
function handleReward(event: MouseEvent, item: Reward, rewardId: number): void {
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
      const taskIndex = eventData.value.findIndex((item) => {
        return item.task_id === value
      })
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
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
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
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

/**
 * @constant allTasks
 * @description 计算属性，合并所有任务列表
 * @returns {ComputedRef<Array>} 包含所有任务的数组
 */
const allTasks = computed(() => [
  ...taskList1.value,
  ...taskList2.value,
  ...taskList3.value,
  ...taskList4.value,
  ...taskList5.value,
  ...taskList7.value,
  ...accTaskList.value,
])

/**
 * @function 处理任务
 * @param {Reward} task - 任务对象
 * @returns {void}
 */
const handleTask = (task: Reward): void => {
  if (task.status === 'can') {
    // 使用 nextTick 确保在 DOM 更新后执行
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

// 监视所有任务的变化，并对每个任务执行处理
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
.double-eleven {
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
    background-image: url('@/assets/images/kizuna-china-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 50px;
  top: 50px;
  width: 946px;
  height: 471px;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/kizuna-china-2024/title.png');
}
.help {
  position: absolute;
  width: 69px;
  height: 69px;
  left: 0;
  top: 144px;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/kizuna-china-2024/help.png');
}
.progress-container {
  position: absolute;
  bottom: 100px;
  right: 100px;
  width: 1010px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  .progress-bar {
    height: 16px;
    background-color: #ffd972;
    border-radius: 8px;
    transition: width 0.4s ease;
    position: relative;
  }
  .progress-bar::after {
    content: '';
    position: absolute;
    right: -30px;
    top: -22px;
    height: 65px;
    width: 60px;
    background-image: url('@/assets/images/kizuna-china-2024/star.png');
    background-repeat: no-repeat;
    background-size: contain;
    transition: right 0.4s ease;
  }
}
.acc-task-item {
  width: 180px;
  height: 180px;
  margin: 0 20px;
  background-repeat: no-repeat;
  background-size: cover;
  @for $i from 1 through 5 {
    &.wait#{$i} {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task#{$i}-wait.png');
    }
    &.can#{$i} {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task#{$i}-can.png');
    }
    &.redeemed#{$i} {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task#{$i}-redeemed.png');
    }
  }
}
.acc-reward-can-dynamic-bubble {
  width: 180px;
  height: 130px;
  position: absolute;
  top: 40px;
  left: 30px;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}
</style>
