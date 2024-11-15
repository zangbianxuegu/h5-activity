<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="werewolf flex h-screen">
      <div :class="['werewolf-main', isPassedTAllask ? 'pass' : 'unpass']">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header z-10 flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              追随钟声 即刻启程 12.19-1.8
            </h1>
            <h2 class="indent-[-9999px]">追随钟声 即刻启程</h2>
            <div
              :class="[
                'help bg-contain bg-center bg-no-repeat',
                isPassedTAllask ? 'pass' : 'unpass',
              ]"
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
                  'animate-flip relative mr-[4px] flex flex-col bg-cover',
                  `bg-task${index + 1}${item.status !== 'can' ? '-gray' : ''}`,
                  `${item.isWerewolfReward ? 'pt-[330px]' : 'pt-[210px]'}`,
                ]"
              >
                <p class="sr-only">{{ item.title }}</p>
                <div>
                  <div
                    class="relative"
                    v-for="(v, i) in item.content.value"
                    :key="v.taskId"
                  >
                    <bubble
                      :reward="v"
                      :ref="
                        (el) => {
                          if (el) bubbleRefs[i] = el
                        }
                      "
                    >
                      <div
                        :class="[
                          'task-item animate__animated animate__fadeIn animate__slow',
                          `task-item${index + 1}-${i + 1}`,
                          `${item.status}`,
                        ]"
                        @click="
                          handleReward($event.target as HTMLElement, v, index)
                        "
                      ></div>
                    </bubble>
                  </div>
                </div>
              </li>
            </ul>
            <!-- 文案和人物 -->
            <div
              :class="['character', isPassedStorm ? 'pass' : 'unpass']"
            ></div>
            <p class="sr-only">领取头狼面具 光遇指引团再出发！</p>
            <!-- 额外奖励列表 -->
            <div v-if="isPassedStorm" class="extra-reward-list">
              <bubble
                :reward="taskList8[0]"
                :ref="
                  (el) => {
                    if (el) bubbleRefs[0] = el
                  }
                "
              >
                <div
                  :class="[
                    'extra-reward-item animate__animated animate__fadeIn animate__slow bg-contain',
                    `${taskList8[0].status}`,
                  ]"
                  @click="
                    handleReward($event.target as HTMLElement, taskList8[0], 7)
                  "
                ></div>
              </bubble>
            </div>
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
              2024年12月19日~2025年1月8日
            </h3>
            <h3 class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </h3>
            <ul class="modal-text list-inside list-decimal">
              <li>
                所有通关过暴风眼的玩家，活动期间可在界面领取奖励
                <span class="text-[#ffcb4d]">头狼面具</span
                >，戴上它去帮助更多人吧
              </li>

              <li v-for="item in ruleInfo" :key="item.location">
                活动期间，通关{{ item.location }}，获得
                <span class="text-[#ffcb4d]">{{ item.reward }}</span>
              </li>
            </ul>
          </section>
        </template>
      </help-modal>
      <!-- 头狼奖励弹框 -->
      <activity-modal ref="modalRewardList">
        <template #content>
          <div class="sr-only">
            在暴风眼的考验中传递勇气和温暖的你，已拥有指引其他光之子飞行的能力，请收下这份特别的奖励，去帮助更多的光之子
          </div>
          <div class="relative mt-[60px]">
            <bubble
              :reward="taskListModal[0]"
              :ref="
                (el) => {
                  if (el) bubbleRefs[0] = el
                }
              "
            >
              <div
                :class="[
                  'reward animate__animated animate__fadeIn animate__slow',
                  `${taskListModal[0].status}`,
                ]"
                @click="
                  toClaimMissionReward(
                    [$event.target] as HTMLElement[],
                    taskListModal[0],
                    7,
                  )
                "
              ></div>
            </bubble>
          </div>
        </template>
      </activity-modal>
      <!-- 绑定弹窗 -->
      <bind-modal ref="modalBind" title="请绑定狼人杀角色编号领取奖励">
        <template #content>
          <div class="mt-[130px] flex items-center">
            <input
              class="h-[96px] w-[630px] grow rounded-[16px] pl-[40px]"
              style="border: 1px solid #6fa2dd"
              type="text"
              v-model="UID"
              placeholder="请输入《狼人杀》角色编号"
            />
            <button
              class="ml-[-20px] h-[96px] w-[220px] rounded-[16px] bg-[#83b7e4] text-[38px] tracking-[4px] text-white"
              @click="getWerewolfName"
            >
              查询
            </button>
          </div>
          <div
            class="float-right mt-[16px] text-[32px] text-[#83b7e4]"
            style="border-bottom: 1px solid #83b7e4"
            @click="handleShowGuide"
          >
            如何查看角色编号?
          </div>
          <div class="ml-[40px] mt-[60px] text-[40px] text-[#929292]">
            <div>请确认角色昵称：</div>
          </div>
          <div
            class="mt-[32px] text-center text-[38px] tracking-[2px] text-[#83b7e4]"
          >
            {{ werewolfNickname ? werewolfNickname : '狼人杀角色名' }}
          </div>
          <div class="mt-[44px] text-center text-[32px] text-[#e85340]">
            注意：奖品将直接发送至绑定的《狼人杀》角色编号内
          </div>
          <div class="mt-[32px] flex justify-between px-[70px] text-[40px]">
            <button class="btn bg-[#74d2ee]" @click="resetUID">重新输入</button>
            <button
              class="btn bg-[#ffcb4d]"
              @click="handleShowConfirmBindModal"
            >
              确定
            </button>
          </div>
        </template>
      </bind-modal>
      <!-- 确认绑定弹窗 -->
      <bind-modal ref="modalConfirmBind" title="提示">
        <template #content>
          <div class="mt-[80px] text-[35px] text-[#696969]">
            注意：确认绑定此账号后，点击领取《狼人杀》奖品，奖品将直接发放至该账号，确认绑定后将无法撤销另行绑定其他账号
          </div>
          <div class="mt-[350px] flex justify-between px-[70px] text-[40px]">
            <button class="btn bg-[#74d2ee]" @click="handleBack">返回</button>
            <button class="btn bg-[#ffcb4d]" @click="handleBind">
              确认绑定
            </button>
          </div>
        </template>
      </bind-modal>
      <!-- 奖励弹窗 -->
      <bind-modal ref="modalReward" title="提示">
        <template #content>
          <div class="text-[#696969]">
            <div class="mt-[120px] text-[35px] tracking-[1px]">
              恭喜你获得<span class="font-bold text-[#7ba9de]">{{
                rewardsText[curRewards[0].name as keyof RewardsName]
              }}</span
              >：
            </div>
            <div class="mt-[50px] flex justify-center">
              <div
                class="h-[134px] w-[134px] bg-[url('@/assets/images/netease-werewolf/extra-reward-icon.png')] bg-contain bg-no-repeat"
              ></div>
            </div>
            <div class="mt-[70px] text-center text-[35px]">
              <span>{{
                rewardsText[curRewards[0].name as keyof RewardsName]
              }}</span
              >*<span>{{ curRewards[0].count }}</span>
            </div>
            <div
              class="border-b-color-[#b5b5b5] mt-[80px] border-b-[2px] border-solid pb-[34px] text-center text-[32px]"
            >
              你已绑定 角色编号：{{ bindedUID }} &nbsp;&nbsp;&nbsp;角色昵称：{{
                bindedNickname
              }}
            </div>
            <div class="mt-[26px] text-center text-[32px]">
              已通过邮箱发送至绑定账号
            </div>
          </div>
        </template>
      </bind-modal>
      <!-- 引导弹窗 -->
      <bind-modal
        ref="modalGuide"
        title="如何查看角色编号？"
        @close="closeModalGuide"
      >
        <template #content>
          <div class="mt-[100px] text-[39px] text-[#929292]">
            <div class="mb-[22px]">1.打开游戏界面</div>
            <div class="mb-[38px]">
              2.点击左上角头像进入个人资料界面，点击角色编号复制
            </div>
          </div>
          <div class="flex justify-center">
            <div
              class="h-[380px] w-[892px] bg-[url('@/assets/images/netease-werewolf/guide.png')] bg-contain bg-no-repeat"
            ></div>
          </div>
        </template>
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
  bindWerewolfInfo,
} from '@/utils/request'
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import HelpModal from '@/components/Modal'
import ActivityModal from './components/ActivityModal.vue'
import BindModal from './components/BindModal.vue'
import Bubble from './components/Bubble.vue'
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
  canRewardLottieRef: Ref<InstanceType<typeof CanRewardBubbleAnimation>> // 可领取动画引用
  hadRenderLottie?: Ref<boolean> // 是否已渲染动画
  isWerewolfReward: boolean // 是否是狼人杀侧奖励
}

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
  isWerewolfReward: boolean
}

type ConfigItem = [string, string, number]

type Config = ConfigItem[]

// 定义奖励名称接口，将奖励类型映射到中文描述
interface RewardsName {
  message_boat: '传信纸船'
  resize_potion: '体型重塑'
  activitycenter_netease_werewolf_m2: '礼物小心心'
  activitycenter_netease_werewolf_m3: '联动表情：关心'
  repellant_krill: '冥龙克星'
  trail_rainbow: '彩虹尾迹'
  activitycenter_netease_werewolf_m5: '联动场景：云野(21天)'
  rainbow: '绚丽彩虹'
  heart: '爱心'
  activitycenter_netease_werewolf_m7: '联动光崽麦克风'
  CharSkyKid_Mask_Werewolf: '头狼面具'
}
// 定义奖励文本对象，用于将奖励类型映射到中文描述
const rewardsText: RewardsName = {
  message_boat: '传信纸船',
  resize_potion: '体型重塑',
  activitycenter_netease_werewolf_m2: '礼物小心心',
  activitycenter_netease_werewolf_m3: '联动表情：关心',
  repellant_krill: '冥龙克星',
  trail_rainbow: '彩虹尾迹',
  activitycenter_netease_werewolf_m5: '联动场景：云野(21天)',
  rainbow: '绚丽彩虹',
  heart: '爱心',
  activitycenter_netease_werewolf_m7: '联动光崽麦克风',
  CharSkyKid_Mask_Werewolf: '头狼面具',
}

// 定义规则信息数组，包含各个关卡的奖励信息
const ruleInfo = [
  { location: '晨岛神殿', reward: '体型重塑*3，传信纸船*3' },
  { location: '云野神殿', reward: '狼人杀奖励：礼物小心心' },
  { location: '雨林神殿', reward: '狼人杀奖励：联动表情关心' },
  { location: '霞谷神殿', reward: '彩虹尾迹*3，冥龙克星*3' },
  { location: '暮土神殿', reward: '狼人杀奖励：联动场景云野(21天)' },
  { location: '禁阁神殿', reward: '爱心*3，绚丽彩虹*3' },
  { location: '暴风眼', reward: '狼人杀奖励：联动光崽麦克风' },
]

const EVENT_NAME = 'activitycenter_netease_werewolf'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalRewardList = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalBind = ref<InstanceType<typeof BindModal> | null>(null)
const modalConfirmBind = ref<InstanceType<typeof BindModal> | null>(null)
const modalReward = ref<InstanceType<typeof BindModal> | null>(null)
const modalGuide = ref<InstanceType<typeof BindModal> | null>(null)
const bubbleRefs = ref<any[]>([])
const UID = ref<string>('')
const werewolfNickname = ref<string>('')
const curRewards: Ref<Rewards[]> = ref([{ name: 'message_boat', count: 3 }])
const extraReward = reactive({
  id: 1,
  taskId: 'activitycenter_netease_werewolf_extra',
  title: '通过1次暴风眼',
  status: 'can',
  val: 1,
  canRewardLottieRef: ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie: ref(false),
  isWerewolfReward: false,
})
let clickTask = {}
let clickIndex = 0
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const baseStore = useBaseStore()
const gameUid = baseStore.baseInfo.gameUid

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

// 创建任务的函数
const createTaskItem = (
  id: number,
  taskId: string,
  title: string,
  status = 'wait',
  val = 0,
  canRewardLottieRef = ref(),
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

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// 是否通过暴风眼
const isPassedStorm = computed(() => {
  const { award, value, stages } = eventData.value[7]
  return getTaskStatus(award[0], value, stages[0]) !== 'wait'
})

// 是否通过所有任务
const isPassedTAllask = computed(() => {
  return eventData.value.every((task) => {
    const { award, value, stages } = task
    return getTaskStatus(award[0], value, stages[0]) !== 'wait'
  })
})

// 定义任务配置
const TASK_MAP: Config = [
  ['activitycenter_netease_werewolf_m1', '通过1次晨岛神殿', 2],
  ['activitycenter_netease_werewolf_m2', '通过1次云野神殿', 1],
  ['activitycenter_netease_werewolf_m3', '通过1次雨林神殿', 1],
  ['activitycenter_netease_werewolf_m4', '通过1次霞谷神殿', 2],
  ['activitycenter_netease_werewolf_m5', '通过1次暮土神殿', 1],
  ['activitycenter_netease_werewolf_m6', '通过1次禁阁神殿', 2],
  ['activitycenter_netease_werewolf_m7', '通过1次暴风眼', 1],
  ['activitycenter_netease_werewolf_extra', '通过1次暴风眼', 1],
  ['activitycenter_netease_werewolf_extra', '通过1次暴风眼', 1],
]

// 创建任务列表的函数
const createTaskLists = (key: string, name: string, length: number): Reward[] =>
  Array.from({ length }, (_, i) => createTaskItem(i + 1, key, name))

// 更新任务列表状态
const updateTaskList = (
  taskList: Reward[],
  activityIndex: number,
  isAccTask: boolean = false,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      if (activityIndex === 8) activityIndex = 7
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
const [
  taskList1,
  taskList2,
  taskList3,
  taskList4,
  taskList5,
  taskList6,
  taskList7,
  taskList8,
  taskListModal,
] = TASK_MAP.map(([key, name, length], index) =>
  updateTaskList(createTaskLists(key, name, length), index),
)

// 定义任务数组，包括主要任务和隐藏任务
const TASKS = [
  { title: '通过1次晨岛神殿', content: taskList1 },
  { title: '通过1次云野神殿', content: taskList2 },
  { title: '通过1次雨林神殿', content: taskList3 },
  { title: '通过1次霞谷神殿', content: taskList4 },
  { title: '通过1次暮土神殿', content: taskList5 },
  { title: '通过1次禁阁神殿', content: taskList6 },
  { title: '通过1次暴风眼', content: taskList7 },
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
        isWerewolfReward: content[0]?.isWerewolfReward ?? false,
        status: content[0]?.status ?? 'wait',
      }
    }),
  )
}

// 所有任务列表
const allTaskList = processTaskList(TASKS.slice(0, 7))

const isVisited = Session.get('isVisitedNeteaseWerewolf')
const isBinded = ref(false)
const bindedUID = ref('')
const bindedNickname = ref('')

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

onBeforeUpdate(() => {
  bubbleRefs.value = []
})

/**
 * @function 显示帮助
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 重置UID和狼人昵称
 */
function resetUID(): void {
  UID.value = ''
  werewolfNickname.value = ''
}

/**
 * @function 处理返回操作
 * 关闭确认绑定模态框，打开绑定模态框
 */
function handleBack(): void {
  modalConfirmBind.value?.closeModal()
  modalBind.value?.openModal()
}

/**
 * @function 显示指南
 * 关闭绑定模态框，打开指南模态框
 */
function handleShowGuide(): void {
  modalBind.value?.closeModal()
  modalGuide.value?.openModal()
}

/**
 * @function 关闭指南模态框
 * 打开绑定模态框
 */
function closeModalGuide(): void {
  modalBind.value?.openModal()
}

/**
 * @function 获取狼人昵称
 * 通过UID获取狼人信息
 */
function getWerewolfName(): void {
  werewolfNickname.value = ''
  getWerewolfInfo({
    user: gameUid,
    werewolfNid: UID.value.trim(),
  })
    .then((res) => {
      werewolfNickname.value = res.werewolf_nickname as string
    })
    .catch((error) => {
      showToast(error.message)
      console.warn(error.message)
    })
}

/**
 * @function 显示确认绑定模态框
 * 关闭绑定模态框，打开确认绑定模态框
 */
function handleShowConfirmBindModal(): void {
  if (!UID.value) return
  modalBind.value?.closeModal()
  modalConfirmBind.value?.openModal()
}

/**
 * @function 处理绑定操作
 * 发送绑定狼人信息请求，成功后更新本地存储和状态
 */
function handleBind(): void {
  bindWerewolfInfo({
    user: gameUid,
    werewolfNid: UID.value.trim(),
  })
    .then((res) => {
      // 更新本地存储
      const werewolfNid = res.werewolf_nid
      const werewolfNickname = res.werewolf_nickname
      if (werewolfNid && werewolfNickname) {
        // 更新状态
        bindedUID.value = werewolfNid
        bindedNickname.value = werewolfNickname
        isBinded.value = true
      } else {
        bindedUID.value = ''
        bindedNickname.value = ''
        isBinded.value = false
      }
      // 领取任务奖励
      toClaimMissionReward([], clickTask as Reward, clickIndex)
    })
    .catch((error) => {
      showToast(error.message)
    })
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
      const werewolfNickname = res.werewolf_nickname
      const werewolfNid = res.werewolf_nid
      if (werewolfNid && werewolfNickname) {
        bindedUID.value = werewolfNid
        bindedNickname.value = werewolfNickname
        isBinded.value = true
      } else {
        bindedUID.value = ''
        bindedNickname.value = ''
        isBinded.value = false
      }
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT_NAME]: data.event_data[EVENT_NAME].sort(
            (a: Event, b: Event) => {
              const orderA = taskOrderMap.get(a.task_id) ?? 8
              const orderB = taskOrderMap.get(b.task_id) ?? 8
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

/**
 * @function 领奖
 * @param clickdom 点击的dom元素
 * @param task 任务id
 * @param index 任务索引
 */
async function handleReward(
  clickdom: HTMLElement,
  task: Reward,
  index: number,
): Promise<void> {
  const grandparentElement = (clickdom.parentElement as HTMLElement)
    .parentElement as HTMLElement
  // 使用 children 属性获取所有直接子元素
  const allChildren = grandparentElement.children
  // 将 HTMLCollection 转换为数组以便使用数组方法
  const childrenArray = Array.from(allChildren) as HTMLElement[]
  const domList = [] as HTMLElement[]
  childrenArray.forEach((item) => {
    domList.push(item.lastElementChild as HTMLElement)
  })
  clickTask = task
  clickIndex = index
  const { status } = task
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    domList.forEach((dom) => {
      bubbleRefs.value?.[0].clickBubbleReward(dom)
    })
    return
  }
  if (index === 7) {
    modalRewardList.value?.openModal()
  } else {
    // 狼人杀侧奖励：绑定狼人杀uid，获得任务完成信息后，告知狼人杀，狼人杀那边进行发放
    // 光遇侧奖励：直接点击领取；
    if (task.isWerewolfReward && !isBinded.value) {
      resetUID()
      modalBind.value?.openModal()
      return
    }
    toClaimMissionReward(domList, task, index)
  }
}

/**
 * @function 领取任务奖励
 * @param {HTMLElement[]} domList - DOM元素列表
 * @param {Reward} task - 任务对象
 * @param {number} index - 任务索引
 * @returns {void}
 */
const toClaimMissionReward = (
  domList: HTMLElement[],
  task: Reward,
  index: number,
): void => {
  const { taskId, isWerewolfReward } = task
  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId: 1,
  })
    .then(async (res) => {
      curRewards.value = res.data.rewards
      if (!isWerewolfReward) {
        await bubbleRefs.value?.[0].handleBubbleBurst(domList, task)
      }
      // 更新页面数据
      activityData.value.event_data[EVENT_NAME][index].award[0] = 1
      let text = '领取成功，您获得了'
      curRewards.value.forEach((item) => {
        text += ` ${rewardsText[item.name as keyof RewardsName]}*${item.count}`
      })
      // 如果是额外奖励（索引为7），更新状态
      if (index === 7) {
        extraReward.status = 'redeemed'
      }
      // 根据奖励类型显示不同的模态框或提示
      if (isWerewolfReward) {
        modalConfirmBind.value?.closeModal()
        modalReward.value?.openModal()
      } else {
        showToast(text)
      }
      // 更新红点状态
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
.werewolf {
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
    &.pass {
      background-image: url('@/assets/images/netease-werewolf/bg-pass.jpg');
    }
    &.unpass {
      background-image: url('@/assets/images/netease-werewolf/bg-unpass.jpg');
    }
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
  &.pass {
    background-image: url('@/assets/images/netease-werewolf/help-pass.png');
  }
  &.unpass {
    background-image: url('@/assets/images/netease-werewolf/help-unpass.png');
  }
}
.task-list {
  position: absolute;
  left: 68px;
  top: 260px;
  width: 1500px;
}
.character {
  position: absolute;
  right: 40px;
  top: 136px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  &.pass {
    width: 548px;
    height: 860px;
    background-image: url('@/assets/images/netease-werewolf/character-pass.png');
  }
  &.unpass {
    width: 536px;
    height: 884px;
    background-image: url('@/assets/images/netease-werewolf/character-unpass.png');
  }
}
.task-item {
  width: 190px;
  height: 120px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1);
}
input::placeholder {
  font-size: 40px;
}
.btn {
  @apply h-[94px] w-[330px] cursor-pointer rounded-[14px] py-[20px] text-white;
}
.reward {
  width: 320px;
  height: 210px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.can {
    background-image: url('@/assets/images/netease-werewolf/modal-reward-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/netease-werewolf/modal-reward-redeemed.png');
  }
}
@for $i from 1 through 7 {
  .bg-task#{$i} {
    width: 190px;
    height: 750px;
    background-image: url('@/assets/images/netease-werewolf/bg-task#{$i}.png');
  }
  .bg-task#{$i}-gray {
    width: 190px;
    height: 750px;
    background-image: url('@/assets/images/netease-werewolf/bg-task#{$i}-gray.png');
    transition: background-image 1s ease;
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
        transition: background-image 0.6s ease;
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
.extra-reward-list {
  position: absolute;
  right: 230px;
  top: 420px;
  width: 200px;
  height: 140px;
}
.extra-reward-item {
  width: 200px;
  height: 140px;
  margin-left: 30px;
  transform: scale(1.6);
  background-repeat: no-repeat;
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
