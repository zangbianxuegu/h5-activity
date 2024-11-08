<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="tournament flex h-screen">
      <div class="tournament-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header z-10 flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              追随钟声 即刻启程 12.19-1.8
            </h1>
            <h2 class="indent-[-9999px]">追随钟声 即刻启程</h2>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 任务列表 -->
            <ul class="task-list flex">
              <li
                v-for="(item, index) in allTaskList"
                :key="item.title"
                :class="[
                  'task-bg animate-flip flex flex-col-reverse bg-cover',
                  `bg-task${index + 1}`,
                ]"
              >
                <div v-if="item.status === 'redeemed'" class="task-mask"></div>
                <div
                  v-for="(v, i) in item.content.value"
                  :key="v.val"
                  :class="[
                    'task-item animate__animated animate__fadeIn animate__slow bg-contain indent-[-9999px]',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(v, i, index)"
                >
                  <p class="sr-only">{{ item.title }}</p>
                </div>
              </li>
            </ul>
            <!-- 额外奖励列表 -->
            <ul class="acc-task-list">
              <li
                v-for="(item, index) in extraRewardList"
                :key="item.title"
                :class="[
                  'acc-task-item animate__animated animate__fadeIn bg-contain indent-[-9999px]',
                  `acc-task-item${index + 1}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item, 1, 6)"
              >
                <p>{{ item.title }}</p>
              </li>
            </ul>
          </section>
        </Transition>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年7月26日~2024年8月10日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            活动期间参与运动会锦标赛项目即可获得对应奖励：
          </p>
          <p class="modal-text">
            参与1次<span class="text-[#ffcb4d]">收集云朵</span>项目即可获得<span
              class="text-[#ffcb4d]"
              >漂浮魔法*2</span
            >；
          </p>
          <p class="modal-text">
            参与1次<span class="text-[#ffcb4d]">飞行竞速</span>项目即可获得<span
              class="text-[#ffcb4d]"
              >彩虹尾迹*2</span
            >；
          </p>
          <p class="modal-text">
            参与1次<span class="text-[#ffcb4d]">越野赛跑</span>项目即可获得<span
              class="text-[#ffcb4d]"
              >元气满满魔法*2</span
            >；
          </p>
          <p class="modal-text">
            参与1次<span class="text-[#ffcb4d]">雪地滑行</span>项目即可获得<span
              class="text-[#ffcb4d]"
              >炫彩步尘*2</span
            >；
          </p>
          <p class="modal-text">
            参与1次<span class="text-[#ffcb4d]">螃蟹赛跑</span>项目即可获得<span
              class="text-[#ffcb4d]"
              >螃蟹恶作剧*2</span
            >；
          </p>
          <p class="modal-text">
            参与1次<span class="text-[#ffcb4d]">星光收集</span>项目即可获得<span
              class="text-[#ffcb4d]"
              >璀璨之星魔法*2</span
            >；
          </p>
          <p class="modal-text">
            锦标赛项目会每日轮换，各位光之子记得前来参加哦~
          </p>
        </template>
      </activity-modal>
      <!-- 奖励弹框 -->
      <activity-modal ref="modalRewardList">
        <template #content>
          <div class="reward-text absolute left-[100px] top-[200px]"></div>
          <div class="reward mr-[10px]" @click="handleShowModalBind"></div>
          <div class="reward"></div>
        </template>
      </activity-modal>
      <bind-modal ref="modalBind" title="请绑定狼人杀UID领取奖励">
        <template #content>
          <div class="mt-[180px] flex items-center">
            <input
              class="h-[100px] w-[630px] rounded-[16px] pl-[40px]"
              style="border: 1px solid #6fa2dd"
              type="text"
              v-model="UID"
              placeholder="请输入《狼人杀》角色UID"
            />
            <button
              class="ml-[-10px] h-[100px] w-[210px] rounded-[10px] bg-[#3f83d2] text-[38px] text-white"
            >
              查询
            </button>
          </div>
          <div class="mt-[20px] flex justify-between text-[34px]">
            <div>请确认角色昵称：</div>
            <a
              class="text-[#3f83d2]"
              style="border-bottom: 1px solid #3f83d2"
              @click="handleShowGuide"
              >如何查看UID ?</a
            >
          </div>
          <div class="mt-[32px] text-center text-[42px] font-semibold">
            狼人杀角色名
          </div>
          <div class="mt-[48px] text-[30px] text-[#e85340]">
            注意:奖品将直接发送至绑定的《狼人杀》UID内
          </div>
          <div class="mt-[44px] flex justify-between px-[10px] text-[40px]">
            <button
              class="btn text-[#696969] shadow-[0_0_40px_0_rgba(154,214,247,1)]"
              @click="resetUID"
            >
              重新输入
            </button>
            <button
              class="btn text-[#ff8000] shadow-[0_0_40px_0_rgba(255,128,0,0.5)]"
              @click="handleShowconfirmBindModal"
            >
              确认
            </button>
          </div>
        </template>
      </bind-modal>
      <bind-modal ref="modalconfirmBind" title="提示">
        <template #content>
          <div class="mt-[80px] text-[35px] text-[#696969]">
            注意：确认绑定此账号后，点击领取《狼人杀》奖品，奖品将直接发放至该账号，确认绑定后将无法撤销另行绑定其他账号
          </div>
          <div class="mt-[350px] flex justify-between px-[10px] text-[40px]">
            <button
              class="btn text-[#696969] shadow-[0_0_40px_0_rgba(154,214,247,1)]"
              @click="handleBack"
            >
              返回
            </button>
            <button
              class="btn text-[#ff8000] shadow-[0_0_40px_0_rgba(255,128,0,0.5)]"
              @click="handleBind"
            >
              确认绑定
            </button>
          </div>
        </template>
      </bind-modal>
      <bind-modal ref="modalReward" title="提示">
        <template #content>
          <div class="text-[#696969]">
            <div class="mt-[120px] text-[35px] tracking-[1px]">
              恭喜您获得<span class="font-bold text-[#7ba9de]">奖励名称</span>：
            </div>
            <div class="mt-[30px] flex justify-center">
              <div
                class="h-[134px] w-[168px] bg-[url('@/assets/images/common/reward/reward-birthdaycake_medium.png')] bg-contain bg-no-repeat"
              ></div>
            </div>
            <div class="mt-[70px] text-center text-[35px]">奖励名称*1</div>
            <div
              class="border-b-color-[#b5b5b5] mt-[100px] border-b-[2px] border-solid pb-[34px] text-center text-[32px]"
            >
              你已绑定 UID：XXXXXXXXX 角色昵称：XXXX
            </div>
            <div class="mt-[26px] text-center text-[32px]">
              已通过邮箱发送至绑定账号
            </div>
          </div>
        </template>
      </bind-modal>
      <bind-modal ref="modalGuide" title="提示" :backgroundImage="guide">
        <template #content> </template>
      </bind-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData } from '@/utils/request'
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from './Modal.vue'
import BindModal from './BindModal.vue'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/neteaseWerewolf'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

interface Rewards {
  name: string
  count: number
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

type ConfigItem = [string, string, number]

type Config = ConfigItem[]

// interface RewardsName {
//   gravity: string
//   trail_rainbow: string
//   energy: string
//   flair_flower: string
//   crab_rock_trick: string
//   glow: string
//   resize_potion: string
//   heart: string
// }
// const rewardsText: RewardsName = {
//   gravity: '漂浮魔法',
//   trail_rainbow: '彩虹尾迹',
//   energy: '元气满满',
//   flair_flower: '炫彩步尘',
//   crab_rock_trick: '螃蟹恶作剧',
//   glow: '璀璨之星魔法',
//   resize_potion: '体型重塑',
//   heart: '爱心',
// }

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

const curRewards: Ref<Rewards> = ref({
  name: 'gravity',
  count: 2,
})

const TASK_LIST = [
  // {
  //   id: 1,
  //   title: '通过1次晨岛神殿',
  //   value: 'activitycenter_netease_werewolf_m1',
  //   status: 'wait',
  // },
  // {
  //   id: 2,
  //   title: '通过1次云野神殿',
  //   value: 'activitycenter_netease_werewolf_m2',
  //   status: 'wait',
  // },
  // {
  //   id: 3,
  //   title: '通过1次雨林神殿',
  //   value: 'activitycenter_netease_werewolf_m3',
  //   status: 'wait',
  // },
  // {
  //   id: 4,
  //   title: '通过1次霞谷神殿',
  //   value: 'activitycenter_netease_werewolf_m4',
  //   status: 'wait',
  // },
  // {
  //   id: 5,
  //   title: '通过1次暮土神殿',
  //   value: 'activitycenter_netease_werewolf_m5',
  //   status: 'wait',
  // },
  // {
  //   id: 6,
  //   title: '通过1次禁阁神殿',
  //   value: 'activitycenter_netease_werewolf_m6',
  //   status: 'wait',
  // },
  // {
  //   id: 7,
  //   title: '通过1次暴风眼',
  //   value: 'activitycenter_netease_werewolf_m7',
  //   status: 'wait',
  // },
  createTaskItem(1, 'activitycenter_netease_werewolf_m1', '通过1次晨岛神殿'),
  createTaskItem(2, 'activitycenter_netease_werewolf_m2', '通过1次云野神殿'),
  createTaskItem(3, 'activitycenter_netease_werewolf_m3', '通过1次雨林神殿'),
  createTaskItem(4, 'activitycenter_netease_werewolf_m4', '通过1次霞谷神殿'),
  createTaskItem(5, 'activitycenter_netease_werewolf_m5', '通过1次暮土神殿'),
  createTaskItem(6, 'activitycenter_netease_werewolf_m6', '通过1次禁阁神殿'),
  createTaskItem(7, 'activitycenter_netease_werewolf_m7', '通过1次暴风眼'),
]
const EXTRA_REWARD_LIST = [
  createTaskItem(1, 'activitycenter_netease_werewolf_extra', '通过1次暴风眼'),
  createTaskItem(2, 'activitycenter_netease_werewolf_extra', '通过1次暴风眼'),
]

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, EXTRA_REWARD_LIST[0]].map((task, index) => [
    task.taskId,
    index,
  ]),
)

// 创建任务列表的函数
const createTaskLists = (key: string, name: string, length: number): Reward[] =>
  Array.from({ length }, (_, i) => createTaskItem(i + 1, key, name))

// 定义任务配置
const TASK_MAP: Config = [
  ['activitycenter_netease_werewolf_m1', '通过1次晨岛神殿', 2],
  ['activitycenter_netease_werewolf_m2', '通过1次云野神殿', 1],
  ['activitycenter_netease_werewolf_m3', '通过1次雨林神殿', 1],
  ['activitycenter_netease_werewolf_m4', '通过1次霞谷神殿', 2],
  ['activitycenter_netease_werewolf_m5', '通过1次暮土神殿', 1],
  ['activitycenter_netease_werewolf_m6', '通过1次禁阁神殿', 2],
  ['activitycenter_netease_werewolf_m7', '通过1次暴风眼', 1],
  ['activitycenter_netease_werewolf_extra', '通过1次暴风眼', 2],
]

// 创建所有任务列表
const [
  TASK_LIST1,
  TASK_LIST2,
  TASK_LIST3,
  TASK_LIST4,
  TASK_LIST5,
  TASK_LIST7,
  TASK_LIST8,
] = TASK_MAP.map(([key, name, length]) => createTaskLists(key, name, length))

const EVENT = 'activitycenter_netease_werewolf'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalRewardList = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalBind = ref<InstanceType<typeof BindModal> | null>(null)
const modalconfirmBind = ref<InstanceType<typeof BindModal> | null>(null)
const modalReward = ref<InstanceType<typeof BindModal> | null>(null)
const modalGuide = ref<InstanceType<typeof BindModal> | null>(null)
const UID = ref<string>('')
const guide = new URL(
  '@/assets/images/netease-werewolf/guide.png',
  import.meta.url,
).href
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const isRewardImageLoaded = ref(false)
const rewardImageSrc = ref(handleSrc(String(curRewards.value.name)))

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT])

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

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
const taskList1 = createTaskList(TASK_LIST1, 0)
const taskList2 = createTaskList(TASK_LIST2, 1)
const taskList3 = createTaskList(TASK_LIST3, 2)
const taskList4 = createTaskList(TASK_LIST4, 3)
const taskList5 = createTaskList(TASK_LIST5, 4)
const taskList6 = createTaskList(TASK_LIST7, 5)
const taskList7 = createTaskList(TASK_LIST7, 6)
const taskList8 = createTaskList(TASK_LIST8, 7)

// 定义任务数组，包括主要任务和隐藏任务
const TASKS = [
  { title: '通过1次晨岛神殿', content: taskList1 },
  { title: '通过1次云野神殿', content: taskList2 },
  { title: '通过1次雨林神殿', content: taskList3 },
  { title: '通过1次霞谷神殿', content: taskList4 },
  { title: '通过1次暮土神殿', content: taskList5 },
  { title: '通过1次禁阁神殿', content: taskList6 },
  { title: '通过1次暴风眼', content: taskList7 },
  { title: '通过1次暴风眼', content: taskList8 },
]

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

// 所有任务列表
const allTaskList = processTaskList(TASKS.slice(0, 7))

// 额外任务列表
const extraRewardList = processTaskList([TASKS[7]])

// // 任务列表
// const taskList = computed(() => {
//   return TASK_LIST.map((item, index) => {
//     const activity = activityData.value.event_data[EVENT][index]
//     return {
//       ...item,
//       status:
//         activity.award[0] === 1
//           ? 'redeemed'
//           : activity.award[0] === 0 && activity.value >= activity.stages[0]
//             ? 'can'
//             : 'wait',
//     }
//   })
// })
// // 额外奖励列表
// const extraRewardList = computed(() => {
//   const activity = activityData.value.event_data[EVENT][6]
//   return EXTRA_REWARD_LIST.map((item, index) => {
//     return {
//       ...item,
//       status:
//         activity.award[index] === 1
//           ? 'redeemed'
//           : activity.award[index] === 0 &&
//               activity.value >= activity.stages[index]
//             ? 'can'
//             : 'wait',
//     }
//   })
// })

const isVisited = Session.get('isVisitedNeteaseWerewolf')
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
  Session.set('isVisitedNeteaseWerewolf', true)
})

/**
 * @function 显示帮助
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 处理 img src
 * @param name 奖励名
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href
  return imgSrc
}

function handleShowModalBind(): void {
  modalRewardList.value?.closeModal()
  modalBind.value?.openModal()
}

function resetUID(): void {
  UID.value = ''
}

function handleBack(): void {
  modalconfirmBind.value?.closeModal()
  modalBind.value?.openModal()
}

function handleShowGuide(): void {
  modalBind.value?.closeModal()
  modalGuide.value?.openModal()
}

function handleShowconfirmBindModal(): void {
  if (!UID.value) return
  modalBind.value?.closeModal()
  modalconfirmBind.value?.openModal()
}

function handleBind(): void {
  modalconfirmBind.value?.closeModal()
  modalReward.value?.openModal()
}

/**
 * @function 预加载图片
 * @param src 图片路径
 */
function preLoadImage(src: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve()
    }
  })
}

/**
 * @function 是否已领奖
 * @param tasks 任务列表
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-6项，任务列表
  const tasksValid = tasks
    .slice(0, 6)
    .some((task) => task.value >= 1 && task.award[0] === 0)
  // 检查第7项，额外奖励
  const task6 = tasks[6]
  const accTasksValid = task6.stages.some(
    (stage, index) => task6.value >= stage && task6.award[index] === 0,
  )
  return tasksValid || accTasksValid
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(
    activityData.value.event_data[EVENT],
  )
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT, hasUnclaimedReward)
}

/**
 * @function 获取任务进度
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT })
    .then((res) => {
      const data = res.data
      let newActivityData = {
        ...data,
        event_data: {
          [EVENT]: data.event_data[EVENT].sort((a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? 7
            const orderB = taskOrderMap.get(b.task_id) ?? 7
            return orderA - orderB
          }),
        },
      }
      console.log(newActivityData, 'newActivityData')
      newActivityData = {
        own_unlocks: [],
        event_data: {
          activitycenter_netease_werewolf: [
            {
              value: 1,
              task_id: 'activitycenter_netease_werewolf_m1',
              stages: [1],
              score: '',
              is_werewolf_reward: false,
              awarded_types: [],
              award: [1],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_m2',
              stages: [1],
              score: '',
              is_werewolf_reward: true,
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_m3',
              stages: [1],
              score: '',
              is_werewolf_reward: true,
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_m4',
              stages: [1],
              score: '',
              is_werewolf_reward: false,
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_m5',
              stages: [1],
              score: '',
              is_werewolf_reward: true,
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_m6',
              stages: [1],
              score: '',
              is_werewolf_reward: false,
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_m7',
              stages: [1],
              score: '',
              is_werewolf_reward: true,
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_netease_werewolf_extra',
              stages: [1],
              score: '',
              is_werewolf_reward: false,
              awarded_types: [],
              award: [0],
            },
          ],
        },
        current_time: 1731060739,
      }
      activityStore.updateActivityData(newActivityData)
      // 更新红点
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
 */
async function handleReward(
  task: TaskItem,
  rewardId: number,
  index: number,
): Promise<void> {
  console.log(task)
  // 让图片先加载再展示
  isRewardImageLoaded.value = false
  rewardImageSrc.value = handleSrc(String(curRewards.value.name))
  await preLoadImage(rewardImageSrc.value)
  isRewardImageLoaded.value = true
  modalRewardList.value?.openModal()

  // 更新页面数据
  activityData.value.event_data[EVENT][index].award[rewardId - 1] = 1
  // 更新红点
  setRedDot()
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
.tournament {
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
    background-image: url('@/assets/images/netease-werewolf/bg.jpg');
  }
}
.header {
  position: relative;
  left: 45px;
  top: 69px;
  width: 1319px;
}
.title {
  width: 1319px;
  height: 214px;
  background-image: url('@/assets/images/netease-werewolf/title.png');
}
.help {
  position: absolute;
  right: 50px;
  top: 23px;
  width: 87px;
  height: 87px;
  background-image: url('@/assets/images/tournament-of-triumph-1/help.png');
}
.task-list {
  position: absolute;
  left: 38px;
  top: 320px;
  width: 1500px;
}
.task-bg {
  position: relative;
  width: 250px;
  height: 1022px;
}
.task-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}
.task-item {
  margin-left: -8px;
  margin-bottom: 58px;
  width: 267px;
  height: 227px;
  background-size: cover;
}
.reward-text {
  width: 407px;
  height: 340px;
  background-image: url('@/assets/images/netease-werewolf/text.png');
  background-repeat: no-repeat;
  background-size: contain;
}
input::placeholder {
  font-size: 40px;
}
.btn {
  @apply h-[104px] w-[250px] cursor-pointer rounded-[42px] bg-white py-[20px];
}
.reward {
  width: 267px;
  height: 340px;
  background-image: url('@/assets/images/tournament-of-triumph-1/task1-wait.png');
  background-repeat: no-repeat;
  background-size: contain;
}
@for $i from 1 through 6 {
  .bg-task#{$i} {
    width: 250px;
    height: 722px;
    background-image: url('@/assets/images/netease-werewolf/bg-task#{$i}.png');
  }
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/tournament-of-triumph-1/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/tournament-of-triumph-1/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/tournament-of-triumph-1/task#{$i}-redeemed.png');
    }
  }
}
.acc-task-item {
  position: absolute;
  width: 146px;
  height: 175px;
}
.acc-task-item1 {
  right: 259px;
  top: 623px;
}
.acc-task-item2 {
  right: 43px;
  top: 563px;
}
@for $i from 1 through 3 {
  .acc-task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/tournament-of-triumph-1/acc-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/tournament-of-triumph-1/acc-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/tournament-of-triumph-1/acc-task#{$i}-redeemed.png');
    }
  }
}
.animate-flip {
  animation: flip 0.3s ease-out;
}
@keyframes flip {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(90deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}
</style>
