<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="kizuna-2024 flex h-screen">
      <div class="kizuna-2024-main">
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
              class="absolute left-[5px] top-[190px] p-[20px]"
              @reward="handleReward"
            />
            <!-- 隐藏任务列表 -->
            <div
              v-if="accTaskValue >= 100"
              class="animate__animated animate__fadeIn animate__slow absolute right-[22px] top-[120px]"
            >
              <h2 id="hideTaskListHeading" class="sr-only">隐藏任务列表</h2>
              <TaskList
                :taskList="hideTaskList"
                name="hideTaskList"
                @reward="handleReward"
              />
              <div class="mt-[4px] flex items-center justify-center">
                <div class="tip-icon mr-[6px]"></div>
                <p class="text-[32px] text-white">
                  旅人们记得使用拾光相机拍摄哦
                </p>
              </div>
              <div class="role ml-[26px] mt-[14px]"></div>
            </div>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <div
              class="absolute bottom-[10px] right-0 flex flex-col rounded-2xl p-4"
            >
              <div
                class="acc-task-title absolute bottom-[314px] right-[80px] h-[60px] text-[36px] leading-[60px] text-[#ffffff]"
              ></div>
              <p class="sr-only">全服任务！品尝中国绊爱饺子</p>
              <ul
                class="absolute bottom-[40px] right-[40px] flex justify-between"
                aria-labelledby="accTaskListHeading"
              >
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="mr-[14px] flex h-[250px] flex-col items-center justify-between"
                >
                  <div
                    class="relative"
                    :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                    @click="
                      handleReward(
                        [$event.target] as HTMLElement[],
                        item,
                        index + 1,
                      )
                    "
                  >
                    <can-reward-bubble-animation
                      @click.stop="
                        handleReward(
                          [$event.target] as HTMLElement[],
                          item,
                          1 + 1,
                        )
                      "
                      :ref="item.canRewardLottieRef"
                      :id="item.taskId"
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
                2024年11月23日~2024年12月5日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，玩家装扮成1次中国绊爱，即可领取
                  <span class="text-[#ffcb4d]"
                    >中国绊爱饺子魔法*1和中国绊爱大铁头礼包试用魔法*1</span
                  >
                </li>
                <li>
                  活动期间，搭建1个晃悠悠共享空间，即可领取
                  <span class="text-[#ffcb4d]"
                    >中国绊爱饺子魔法*1和中国绊爱发饰试用魔法*1</span
                  >
                </li>
                <li>
                  活动期间，与大铁头进行1次互动，即可领取
                  <span class="text-[#ffcb4d]"
                    >中国绊爱饺子魔法*1和中国绊爱斗篷魔法*1</span
                  >
                </li>
                <li>
                  活动期间，寻找头戴晃悠悠的光之子，即可领取
                  <span class="text-[#ffcb4d]"
                    >中国绊爱饺子魔法*1和中国绊爱发型魔法*1</span
                  >
                </li>
                <li>
                  活动期间，连续3天与中国绊爱打招呼，即可领取
                  <span class="text-[#ffcb4d]"
                    >中国绊爱饺子魔法*1和升华蜡烛*1</span
                  >
                </li>
                <li>
                  活动期间，统计全服玩家品尝中国绊爱饺子的进度，达到指定数量后可解锁全服奖励：<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;a.全服品尝200W个中国绊爱饺子，即可领取<span
                    class="text-[#ffcb4d]"
                    >浪漫烟花魔法*2</span
                  ><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;b.全服品尝400W个中国绊爱饺子，即可领取<span
                    class="text-[#ffcb4d]"
                    >小不点*2</span
                  ><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;c.全服品尝600W个中国绊爱饺子，即可领取<span
                    class="text-[#ffcb4d]"
                    >体型重塑*2</span
                  ><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;d.全服品尝800W个中国绊爱饺子，即可领取<span
                    class="text-[#ffcb4d]"
                    >蜡烛*2</span
                  ><br />
                  &nbsp;&nbsp;&nbsp;&nbsp;e.全服品尝1000W个中国绊爱饺子，即可领取<span
                    class="text-[#ffcb4d]"
                    >爱心*2</span
                  ><br />
                </li>
                <li>
                  活动期间，达成品尝1000w中国绊爱饺子进度后，玩家可以通过完成隐藏任务获取额外奖励：<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;a.使用拾光季照相机与绊爱与中国绊爱合影，即可领取
                  <span class="text-[#ffcb4d]"
                    >绊爱发型礼包试用魔法*1和璀璨之星魔法*1</span
                  ><br />
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
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/kizunaChina2024'
import gsap from 'gsap'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import TaskList from './components/TaskList.vue'

// 定义奖励名称接口，将奖励类型映射到中文描述
interface RewardsName {
  kizuna_ai_dumpling: '中国绊爱饺子魔法'
  outfit_prop_kizuna_ai_tv: '中国绊爱大铁头礼包试用魔法'
  outfit_horn_kizuna: '中国绊爱发饰试用魔法'
  outfit_wing_kizuna: '中国绊爱斗篷魔法'
  outfit_hair_kizuna: '中国绊爱发型魔法'
  prestige: '升华蜡烛'
  fireworks: '浪漫烟花魔法'
  tiny: '小不点'
  resize_potion: '体型重塑'
  candles: '蜡烛'
  heart: '爱心'
  outfit_hair_kizuna_pink: '绊爱发型礼包试用魔法'
  glow: '璀璨之星魔法'
}

// 定义单个奖励项接口
interface Reward {
  id: number // 奖励ID
  taskId: string // 任务字段名
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

interface Rewards {
  name: string
  count: number
}

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

// 定义奖励文本对象，用于将奖励类型映射到中文描述
const rewardsText: RewardsName = {
  kizuna_ai_dumpling: '中国绊爱饺子魔法',
  outfit_prop_kizuna_ai_tv: '中国绊爱大铁头礼包试用魔法',
  outfit_horn_kizuna: '中国绊爱发饰试用魔法',
  outfit_wing_kizuna: '中国绊爱斗篷魔法',
  outfit_hair_kizuna: '中国绊爱发型魔法',
  prestige: '升华蜡烛',
  fireworks: '浪漫烟花魔法',
  tiny: '小不点',
  resize_potion: '体型重塑',
  candles: '蜡烛',
  heart: '爱心',
  outfit_hair_kizuna_pink: '绊爱发型礼包试用魔法',
  glow: '璀璨之星魔法',
}

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_kizuna_china_2024'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

const curRewards: Ref<Rewards[]> = ref([
  {
    name: 'kizuna_ai_dumpling',
    count: 1,
  },
])

// 创建任务的函数
const createTaskItem = (
  id: number,
  taskId: string,
  title: string,
  status = 'wait',
  val = 0,
  canRewardLottieRef = ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie = ref(false),
): Reward => ({
  id,
  taskId,
  title,
  status,
  val,
  canRewardLottieRef,
  hadRenderLottie,
})

// 任务列表
const TASK_LIST = [
  createTaskItem(1, 'activitycenter_kizuna_china_2024_m1', '装扮成1次中国绊爱'),
  createTaskItem(
    2,
    'activitycenter_kizuna_china_2024_m2',
    '搭建1个晃悠悠共享空间',
  ),
  createTaskItem(
    3,
    'activitycenter_kizuna_china_2024_m3',
    '与大铁头进行1次互动',
  ),
  createTaskItem(
    4,
    'activitycenter_kizuna_china_2024_m4',
    '寻找头戴晃悠悠的光之子',
  ),
  createTaskItem(
    5,
    'activitycenter_kizuna_china_2024_m5',
    '连续3天与中国绊爱打招呼',
  ),
]

// 创建任务列表的函数
const createTaskLists = (key: string, name: string, length = 2): Reward[] =>
  Array.from({ length }, (_, i) => createTaskItem(i + 1, key, name))

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
  createTaskItem(
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
    task.taskId,
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
  isAccTask: boolean = false,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      const { award, value, stages } = eventData.value[activityIndex]
      const awardIndex = isAccTask ? index : 0
      return {
        ...item,
        val: value,
        status: getTaskStatus(award[awardIndex], value, stages[awardIndex]),
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
const accTaskList = createTaskList(ACC_TASK_LIST, 5, true)

// 累计任务完成值
const accTaskValue = ref(0)

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
      const accTaskVal =
        newActivityData.event_data[EVENT_NAME][ACC_TASK_ACTIVITY_INDEX].value /
        100000
      accTaskValue.value = calculateAccTaskValue(accTaskVal)
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * 适配异形滚动条 计算累积任务值
 * @param accTaskVal 累积任务原始值
 * @returns 计算后的累积任务值占比
 */
function calculateAccTaskValue(accTaskVal: number): number {
  // 如果累积任务值大于等于100，直接返回100
  if (accTaskVal >= 100) return 100
  switch (true) {
    case accTaskVal <= 4:
      return accTaskVal
    case accTaskVal <= 10:
      return accTaskVal - 4
    case accTaskVal <= 40:
      return accTaskVal - 9
    case accTaskVal <= 80:
      return accTaskVal - 7
    case accTaskVal < 100:
      return accTaskVal - 6
    default:
      return 0 // 其他情况（理论上不会发生），返回0
  }
}

/**
 * @function 领奖
 * @param domList DOM元素列表
 * @param item 奖励项
 * @param rewardId 第几个奖励节点 不传默认1
 * @returns {void}
 */
function handleReward(
  domList: HTMLElement[],
  item: Reward,
  rewardId: number,
): void {
  const { taskId, status } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    domList.forEach((dom) => {
      clickBubbleReward(dom)
    })
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      curRewards.value = res.data.rewards
      await handleBubbleBurst(domList, item)
      // 更新页面数据
      const taskIndex = eventData.value.findIndex((item) => {
        return item.task_id === taskId
      })
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      showToast(
        '领取成功，您获得了' +
          curRewards.value.map(
            (item) =>
              ` ${rewardsText[item.name as keyof typeof rewardsText]}*${item.count}`,
          ),
      )
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 处理气泡爆炸动画
 * @param {HTMLElement[]} domList - 需要处理动画的DOM元素列表
 * @param {Reward} item - 奖励对象
 * @returns {Promise<void>}
 * @description 并行处理所有元素的气泡爆炸动画
 */
async function handleBubbleBurst(
  domList: HTMLElement[],
  item: Reward,
): Promise<void> {
  // 使用 Promise.all 并行处理所有元素的动画
  await Promise.all(domList.map((dom) => bubbleBurst(dom, item)))
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
 * @param {HTMLElement} dom - dom元素
 * @returns {void}
 */
const clickBubbleReward = (dom: HTMLElement): void => {
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
 * @param {HTMLElement} dom - dom元素
 * @param {Reward} reward - 奖励对象
 * @returns {Promise<void>}
 */
const bubbleBurst = async (dom: HTMLElement, reward: Reward): Promise<void> => {
  // 如果存在可领取奖励的Lottie动画引用，播放点击气泡动画
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value[0].playAnimationClickBubble()
  }
  // 溅射效果
  await gsap
    .timeline()
    .to(dom, {
      scaleY: 0.8,
      duration: 0.2,
      ease: 'power1.in',
      opacity: 0.9,
    }) // 垂直压挤
    .to(dom, {
      scaleY: 1.1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0.5,
    }) // 垂直拉伸
    .to(dom, {
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
.kizuna-2024 {
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
  top: 0px;
  width: 946px;
  height: 471px;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/kizuna-china-2024/title.png');
}
.help {
  position: absolute;
  width: 89px;
  height: 97px;
  left: 844px;
  top: 3px;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/kizuna-china-2024/help.png');
}
.tip-icon {
  width: 29px;
  height: 46px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/kizuna-china-2024/tip-icon.png');
}
.role {
  width: 467px;
  height: 536px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/kizuna-china-2024/role.png');
}
.progress-container {
  position: absolute;
  bottom: 100px;
  right: 90px;
  width: 1160px;
  height: 16px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  .progress-bar {
    height: 16px;
    background-color: #ffd066;
    border-radius: 8px;
    transition: width 0.4s ease;
    position: relative;
  }
  .progress-bar::after {
    content: '';
    position: absolute;
    right: -30px;
    top: -22px;
    height: 63px;
    width: 78px;
    background-image: url('@/assets/images/kizuna-china-2024/dumpling.png');
    background-repeat: no-repeat;
    background-size: contain;
    transition: right 0.4s ease;
  }
}
.acc-task-title {
  width: 1193px;
  height: 47px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/images/kizuna-china-2024/acc-task-title.png');
}
.acc-task-item {
  width: 230px;
  height: 160px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
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
  top: 20px;
  left: 27px;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.75) !important;
  }
}
</style>
