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
                  'task-bg animate-flip mr-[4px] flex flex-col-reverse bg-cover pb-[280px]',
                  `bg-task${index + 1}`,
                ]"
              >
                <div v-if="item.status === 'redeemed'" class="task-mask"></div>
                <p class="sr-only">{{ item.title }}</p>
                <div
                  v-for="(v, i) in item.content.value"
                  :key="v.val"
                  :class="[
                    'task-item animate__animated animate__fadeIn animate__slow bg-contain',
                    `task-item${index + 1}-${i + 1}`,
                    `${item.status}`,
                  ]"
                  @click="
                    handleReward([$event.target] as HTMLElement[], v, index)
                  "
                ></div>
              </li>
            </ul>
            <!-- 额外奖励列表 -->
            <ul class="acc-task-list">
              <li v-for="item in extraRewardList" :key="item.title">
                <div
                  v-for="v in item.content.value"
                  :key="v.status"
                  :class="[
                    'extra-reward-item animate__animated animate__fadeIn bg-contain indent-[-9999px]',
                    `${item.status}`,
                  ]"
                  @click="handleReward([$event.target] as HTMLElement[], v, 7)"
                >
                  <p>{{ item.title }}</p>
                </div>
              </li>
            </ul>
          </section>
        </Transition>
      </div>
      <!-- 活动规则说明 -->
      <help-modal ref="modalHelp">
        <template #content>
          <section
            aria-labelledby="activity-rules-title"
            class="h-[680px] overflow-y-scroll p-4"
          >
            <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
            <h3 class="modal-text">
              <span class="font-semibold">活动时间：</span>
              2024年12月9日~2024年1月8日
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
      </help-modal>
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
              @click="getWerewolfName"
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
            {{ werewolfNickname ? werewolfNickname : '狼人杀角色名' }}
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
import {
  getPlayerMissionData,
  claimMissionReward,
  getWerewolfInfo,
} from '@/utils/request'
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import HelpModal from '@/components/Modal'
import ActivityModal from './components/ActivityModal.vue'
import BindModal from './components/BindModal.vue'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/neteaseWerewolf'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import { useBaseStore } from '@/stores/base'

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
  isWerewolfReward: boolean // 是否是狼人杀侧奖励
}

// 定义任务项接口
// interface TaskItem {
//   val: number
//   status: string
//   is_werewolf_reward: Boolean
// }

// 定义任务列表接口
interface TaskLists {
  title: string
  content: Ref<Reward[]>
}

// 定义处理后的任务类型
interface ProcessedTask {
  title: string // 任务标题
  content: Ref<Reward[]> // 任务内容，使用Vue的Ref包装TaskItem数组
  val: number // 任务完成值
  status: string // 任务状态
}

type ConfigItem = [string, string, number]

type Config = ConfigItem[]

// 定义奖励名称接口，将奖励类型映射到中文描述
interface RewardsName {
  energy: '能量'
  resize_potion: '体型重塑'
  // kizuna_ai_dumpling: '中国绊爱饺子'
  // outfit_prop_kizuna_ai_tv: '中国绊爱大铁头礼包试用魔法'
  // outfit_horn_kizuna: '中国绊爱发饰试用魔法'
  // outfit_wing_kizuna: '中国绊爱斗篷'
  // outfit_hair_kizuna: '中国绊爱发型'
  // prestige: '升华蜡烛'
  // fireworks: '浪漫烟花'
  // tiny: '小不点'
  // resize_potion: '体型重塑'
  // candles: '蜡烛'
  // heart: '爱心'
  // outfit_hair_kizuna_pink: '绊爱发型礼包试用魔法'
  // glow: '璀璨之星'
}
// 定义奖励文本对象，用于将奖励类型映射到中文描述
const rewardsText: RewardsName = {
  energy: '能量',
  resize_potion: '体型重塑',
  // kizuna_ai_dumpling: '中国绊爱饺子',
  // outfit_prop_kizuna_ai_tv: '中国绊爱大铁头礼包试用魔法',
  // outfit_horn_kizuna: '中国绊爱发饰试用魔法',
  // outfit_wing_kizuna: '中国绊爱斗篷',
  // outfit_hair_kizuna: '中国绊爱发型',
  // prestige: '升华蜡烛',
  // fireworks: '浪漫烟花',
  // tiny: '小不点',

  // candles: '蜡烛',
  // heart: '爱心',
  // outfit_hair_kizuna_pink: '绊爱发型礼包试用魔法',
  // glow: '璀璨之星',
}

const EVENT_NAME = 'activitycenter_netease_werewolf'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalRewardList = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalBind = ref<InstanceType<typeof BindModal> | null>(null)
const modalconfirmBind = ref<InstanceType<typeof BindModal> | null>(null)
const modalReward = ref<InstanceType<typeof BindModal> | null>(null)
const modalGuide = ref<InstanceType<typeof BindModal> | null>(null)
const UID = ref<string>('')
const werewolfNickname = ref<string>('')
const isBinded = ref<boolean>(false)
const curRewards: Ref<Rewards[]> = ref([
  {
    name: 'gravity',
    count: 2,
  },
])

const guide = new URL(
  '@/assets/images/netease-werewolf/guide.png',
  import.meta.url,
).href
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

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
  isWerewolfReward = false,
): Reward => ({
  id,
  taskId,
  title,
  status,
  val,
  canRewardLottieRef,
  hadRenderLottie,
  isWerewolfReward,
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
  TASK_LIST6,
  TASK_LIST7,
  TASK_LIST8,
] = TASK_MAP.map(([key, name, length]) => createTaskLists(key, name, length))

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
      const iswerewolfreward = eventData.value[activityIndex].is_werewolf_reward
      const awardIndex = isAccTask ? index : 0
      return {
        ...item,
        val: value,
        isWerewolfReward: iswerewolfreward as boolean,
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
const taskList6 = createTaskList(TASK_LIST6, 5)
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
        status: content[0]?.status ?? 'wait',
      }
    }),
  )
}

// 所有任务列表
const allTaskList = processTaskList(TASKS.slice(0, 7))

// 额外任务列表
const extraRewardList = processTaskList([TASKS[7]])

// // 任务列表
// const allTaskList = computed(() => {
//   return TASK_LIST.map((item, index) => {
//     const activity = activityData.value.event_data[EVENT_NAME][index]
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
//   const activity = activityData.value.event_data[EVENT_NAME][7]
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
 * @function 是否已领奖
 * @param tasks 任务列表
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
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(eventData.value)
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

/**
 * @function 获取任务进度
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
              const orderA = taskOrderMap.get(a.task_id) ?? 7
              const orderB = taskOrderMap.get(b.task_id) ?? 7
              return orderA - orderB
            },
          ),
        },
      }
      activityStore.updateActivityData(newActivityData)
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

const getWerewolfName = (): void => {
  const baseStore = useBaseStore()
  const gameUid = baseStore.baseInfo.gameUid
  getWerewolfInfo({
    user: gameUid,
    werewolfNid: UID.value.trim(),
  })
    .then((res) => {
      werewolfNickname.value = res.werewolf_nickname as string
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param rewardId 第几个奖励节点
 * @param index 任务索引
 */
async function handleReward(
  domList: HTMLElement[],
  task: Reward,
  index: number,
): Promise<void> {
  const { status, taskId } = task
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
  if (index === 7) {
    modalRewardList.value?.openModal()
  } else {
    // 狼人杀侧奖励：绑定狼人杀uid，获得任务完成信息后，告知狼人杀，狼人杀那边进行发放
    // 光遇侧奖励：直接点击领取；
    if (task.isWerewolfReward && !isBinded.value) {
      modalBind.value?.openModal()
      return
    }
    claimMissionReward({
      event: EVENT_NAME,
      task: taskId,
      rewardId: 1,
    })
      .then(async (res) => {
        curRewards.value = res.data.rewards
        await handleBubbleBurst(domList, task)
        // 更新页面数据
        activityData.value.event_data[EVENT_NAME][index].award[0] = 1
        let text = '领取成功，您获得了'
        curRewards.value.forEach((item) => {
          text += ` ${rewardsText[item.name as keyof RewardsName]}*${item.count}`
        })
        showToast(text)
        // 更新红点
        setRedDot()
      })
      .catch((error) => {
        showToast(error.message)
      })
  }
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
.help {
  position: absolute;
  left: 1040px;
  top: -4px;
  width: 74px;
  height: 74px;
  background-image: url('@/assets/images/tournament-of-triumph-1/help.png');
}
.task-list {
  position: absolute;
  left: 68px;
  top: 260px;
  width: 1500px;
}
.task-bg {
  position: relative;
  width: 220px;
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
  width: 190px;
  height: 120px;
  background-size: cover;
  background-position: center;
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
@for $i from 1 through 7 {
  .bg-task#{$i} {
    width: 190px;
    height: 750px;
    background-image: url('@/assets/images/netease-werewolf/bg-task#{$i}.png');
  }
  @for $j from 1 through 2 {
    .task-item#{$i}-#{$j} {
      &.wait {
        background-image: url('@/assets/images/netease-werewolf/task#{$i}-#{$j}-wait.png');
      }
      &.can {
        background-image: url('@/assets/images/netease-werewolf/task#{$i}-#{$j}-can.png');
      }
      &.redeemed {
        background-image: url('@/assets/images/netease-werewolf/task#{$i}-#{$j}-redeemed.png');
      }
    }
  }
  .task-item2-1,
  .task-item3-1,
  .task-item5-1,
  .task-item7-1 {
    &.wait {
      background-image: url('@/assets/images/netease-werewolf/task-wolf-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/netease-werewolf/task-wolf-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/netease-werewolf/task-wolf-redeemed.png');
    }
  }
}
.extra-reward-item {
  position: absolute;
  width: 256px;
  height: 230px;
  right: 190px;
  top: 380px;
  &.wait {
    background-image: url('@/assets/images/netease-werewolf/extra-reward-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/netease-werewolf/extra-reward-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/netease-werewolf/extra-reward-redeemed.png');
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
