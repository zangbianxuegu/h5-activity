<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="halloween flex h-screen">
      <div class="halloween-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="relative h-full overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              冥龙，在我们之中
              <p>
                <time datetime="2024-12-19">12.19</time>-
                <time datetime="2025-1-8">1.8</time>
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
            <div class="absolute left-[100px] top-[364px] flex justify-between">
              <TaskList
                v-for="(tasks, type) in taskLists"
                :key="type"
                :title="titles[type]"
                :tasks="tasks"
                @reward="handleReward"
              />
            </div>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <div class="absolute left-0 top-[960px] flex">
              <div
                class="absolute left-[10px] top-[0px] h-[60px] w-[300px] text-center text-[34px] leading-[60px] text-white"
              >
                完成<br />“你就是冥龙” 天数
              </div>
              <ul
                class="absolute left-[330px] top-[-82px] flex justify-between"
                aria-labelledby="accTaskListHeading"
              >
                <li
                  v-for="(item, index) in accTaskList"
                  :key="item.id"
                  class="mr-[64px] flex h-[230px] flex-col items-center justify-between"
                >
                  <div
                    :class="[
                      'acc-task-item animate__animated animate__fadeIn bg-contain',
                      `${item.status}${index + 1}`,
                    ]"
                  ></div>
                  <p
                    class="h-[30px] text-center text-[30px] leading-[36px] text-white"
                  >
                    {{ index * 2 + 1 === 9 ? 10 : index * 2 + 1 }}天
                  </p>
                </li>
              </ul>

              <div class="progress-container absolute left-[320px] top-[80px]">
                <div
                  class="progress-bar"
                  :style="`width: ${accTaskValue > 100 ? 100 : accTaskValue}%;`"
                ></div>
              </div>
            </div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
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
                <li>活动期间，完成不同任务，获得奖励。</li>
                <li>
                  以光之子身份完成以下任务：<br />
                  &nbsp;活动任务：成功指认冥龙3次，获得
                  <span class="text-[#ffcb4d]">蜡烛*2</span><br />
                  &nbsp;每周任务：每周完成一场游戏，获得
                  <span class="text-[#ffcb4d]">篝火*1</span><br />
                  &nbsp;每周任务：每周在顺序发言到自己时做1个动作，<br />
                  &nbsp;获得
                  <span class="text-[#ffcb4d]">璀璨之星*1</span><br />
                </li>
                <li>
                  以冥龙身份完成以下任务：<br />
                  &nbsp;活动任务：撞翻光之子或长老5次，获得
                  <span class="text-[#ffcb4d]">蜡烛*2</span><br />
                  &nbsp;每周任务：每周完成一场游戏，获得
                  <span class="text-[#ffcb4d]">秋千*1</span><br />
                  &nbsp;每周任务：每周在顺序发言到自己时做1个动作，<br />
                  &nbsp;获得
                  <span class="text-[#ffcb4d]">漂浮*1</span><br />
                </li>
                <li>
                  以长老身份完成以下任务：<br />
                  &nbsp;活动任务：成功查验到冥龙2次，获得
                  <span class="text-[#ffcb4d]">蜡烛*2</span><br />
                  &nbsp;每周任务：每周完成一场游戏，获得
                  <span class="text-[#ffcb4d]">畅谈长桌*1</span><br />
                  &nbsp;每周任务：每周在顺序发言到自己时做1个动作，<br />
                  &nbsp;获得
                  <span class="text-[#ffcb4d]">冥龙克星*1</span><br />
                </li>
                <li>
                  不限制身份的任务：<br />
                  &nbsp;至少完成1局“谁是冥龙”游戏，累计1天，获得
                  <span class="text-[#ffcb4d]">光能药剂*1</span><br />
                  &nbsp;至少完成1局“谁是冥龙”游戏，累计3天，获得
                  <span class="text-[#ffcb4d]">体型重塑*1</span><br />
                  &nbsp;至少完成1局“谁是冥龙”游戏，累计5天，获得
                  <span class="text-[#ffcb4d]">兜帽女巫发型</span><br />
                  &nbsp;至少完成1局“谁是冥龙”游戏，累计7天，获得
                  <span class="text-[#ffcb4d]">爱心*1</span><br />
                  &nbsp;至少完成1局“谁是冥龙”游戏，累计10天，获得
                  <span class="text-[#ffcb4d]">红底女巫斗篷</span>
                </li>
              </ul>
            </section>
          </template>
        </help-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { Event } from '@/types'
import { Session } from '@/utils/storage'
import HelpModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/neteaseWerewolfJoin'
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import TaskList from './components/TaskList.vue'
import { getResponsiveStylesFactor } from '@/utils/responsive'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  candles: string
}
/**
 * hadRenderLottie: 是否渲染过lottie（解决因computed和watch多次更新导致多次渲染lottie）
 */
interface Reward {
  id: number
  taskId: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

const rewardsText: RewardsName = {
  candles: '蜡烛',
}

const curRewards: Ref<Rewards[]> = ref([
  {
    name: 'candles',
    count: 1,
  },
])

// const taskInfoList = [
//   { name: '被骑扫帚的皮皮猫炸飞一次', count: 1 },
//   { name: '找到戴帽子的螃蟹', count: 1 },
//   { name: '成功击败怪物', count: 1 },
//   { name: '逃脱滚动螃蟹的追击', count: 1 },
//   { name: '使用【万圣节】代币兑换任意外观', count: 1 },
//   { name: '触发扫帚制作间的陷阱', count: 1 },
//   { name: '在活动场景的衣柜换装', count: 1 },
//   { name: '完成一次魔法扫帚的练习', count: 2 },
//   { name: '获得40个活动代币', count: 2 },
// ]

// 创建任务的函数
const createTaskItem = (
  id: number,
  taskId: string,
  title: string,
  status = 'wait',
  canRewardLottieRef = ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie = ref(false),
): Reward => ({
  id,
  taskId,
  title,
  status,
  canRewardLottieRef,
  hadRenderLottie,
})

// 光之子身份
const PLAYER_TASK_LIST = [
  createTaskItem(3, 'activitycenter_werewolf_player_m3', '成功指认冥龙'),
  createTaskItem(1, 'activitycenter_werewolf_player_m1', '完成一场游戏'),
  createTaskItem(
    2,
    'activitycenter_werewolf_player_m2',
    '在顺序发言到自己时做1个动作',
  ),
]

// 冥龙身份
const KRILL_TASK_LIST = [
  createTaskItem(3, 'activitycenter_werewolf_krill_m3', '成功撞翻光之子或长老'),
  createTaskItem(1, 'activitycenter_werewolf_krill_m1', '完成一场游戏'),
  createTaskItem(
    2,
    'activitycenter_werewolf_krill_m2',
    '在顺序发言到自己时做1个动作',
  ),
]

// 长老身份
const SPIRIT_TASK_LIST = [
  createTaskItem(3, 'activitycenter_werewolf_spirit_m3', '成功查验到冥龙'),
  createTaskItem(1, 'activitycenter_werewolf_spirit_m1', '完成一场游戏'),
  createTaskItem(
    2,
    'activitycenter_werewolf_spirit_m2',
    '在顺序发言到自己时做1个动作',
  ),
]

// 胜利追求（进度条）
const ACC_TASK_LIST = [
  createTaskItem(1, 'activitycenter_werewolf_join_m1', '完成1场“你就是冥龙”'),
  createTaskItem(2, 'activitycenter_werewolf_join_m1', '完成1场“你就是冥龙”'),
  createTaskItem(3, 'activitycenter_werewolf_join_m1', '完成1场“你就是冥龙”'),
  createTaskItem(4, 'activitycenter_werewolf_join_m1', '完成1场“你就是冥龙”'),
  createTaskItem(5, 'activitycenter_werewolf_join_m1', '完成1场“你就是冥龙”'),
]

// 弹框
const modalHelp = ref<InstanceType<typeof HelpModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_netease_werewolf_join'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// activityData中存储各个事件数据的对象
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])

// 任务排序
const taskOrderMap = new Map(
  [
    ...PLAYER_TASK_LIST,
    ...KRILL_TASK_LIST,
    ...SPIRIT_TASK_LIST,
    ACC_TASK_LIST[0],
  ].map((task, index) => [task.taskId, index]),
)

// 累积任务活动索引
// 这个常量定义了累积任务在活动数据中的索引位置
// 用于在创建累积任务列表时获取正确的活动数据
const ACC_TASK_ACTIVITY_INDEX = 9

// 获取任务状态
const getTaskStatus = (award: number, value: number, stage: number): string => {
  if (award === 1) return 'redeemed'
  if (award === 0 && value >= stage) return 'can'
  return 'wait'
}

// const updateTaskList = (
//   taskList: Reward[],
//   activityIndex: number,
//   isAccTask: boolean = false,
// ): ComputedRef<Reward[]> => {
//   return computed(() => {
//     return taskList.map((item, index) => {
//       const { award, value, stages } = eventData.value[activityIndex]
//       const awardIndex = isAccTask ? index : 0
//       return {
//         ...item,
//         val: value,
//         status: getTaskStatus(award[awardIndex], value, stages[awardIndex]),
//       }
//     })
//   })
// }

// 创建任务列表
const updateTaskList = (
  taskList: Reward[],
  activityIndex: number,
): ComputedRef<Reward[]> => {
  return computed(() => {
    return taskList.map((item, index) => {
      // console.log(eventData.value[activityIndex], 'activityIndex');

      const { award, value, stages } = eventData.value[activityIndex]
      return {
        ...item,
        val: value,
        status: getTaskStatus(award[index], value, stages[index]),
      }
    })
  })
}

// 光之子身份
const playerTaskList = updateTaskList(PLAYER_TASK_LIST, 0)
// 冥龙身份
const krillTaskList = updateTaskList(KRILL_TASK_LIST, 3)
// 长老身份
const spiritTaskList = updateTaskList(SPIRIT_TASK_LIST, 6)
// 累积任务列表
const accTaskList = updateTaskList(ACC_TASK_LIST, 9)
// 累计任务完成值
const accTaskValue = ref(eventData.value[ACC_TASK_ACTIVITY_INDEX].value)

console.log(playerTaskList.value, 'playerTaskList')

// 任务列表
const taskLists = computed(() => ({
  player: playerTaskList.value,
  krill: krillTaskList.value,
  spirit: spiritTaskList.value,
}))

const titles: Record<string, string> = {
  player: '光之子身份',
  krill: '冥龙身份',
  spirit: '长老身份',
}

const sessionIsVisitedKey = 'isVisitedNeteaseWerewolfJoin'
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
 * @returns {void}
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_netease_werewolf_join: data.event_data[
            EVENT_NAME
          ].sort((a: Event, b: Event) => {
            const orderA =
              taskOrderMap.get(a.task_id) ?? PLAYER_TASK_LIST.length
            const orderB =
              taskOrderMap.get(b.task_id) ?? PLAYER_TASK_LIST.length
            return orderA - orderB
          }),
        },
      }
      console.log('newActivityData', JSON.stringify(newActivityData))
      // newActivityData = {"own_unlocks":[],"event_data":{"activitycenter_netease_werewolf_join":[
      //   {"value":3,"task_id":"activitycenter_werewolf_player_m3","stages":[3],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[1]},
      //   {"value":0,"task_id":"activitycenter_werewolf_player_m1","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":0,"task_id":"activitycenter_werewolf_player_m2","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_krill_m3","stages":[5],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":0,"task_id":"activitycenter_werewolf_krill_m1","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":0,"task_id":"activitycenter_werewolf_krill_m2","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":0,"task_id":"activitycenter_werewolf_spirit_m3","stages":[2],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":0,"task_id":"activitycenter_werewolf_spirit_m1","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":0,"task_id":"activitycenter_werewolf_spirit_m2","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":3,"task_id":"activitycenter_werewolf_join_m1","stages":[1,3,5,7,10],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0,0,0,0,0]}]},"current_time":1732092773}
      // accTaskValue.value = newActivityData.event_data[EVENT_NAME][ACC_TASK_ACTIVITY_INDEX].value * 10
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
      console.log('activityStore: ', activityStore)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
      // let newActivityData = {"own_unlocks":[],"event_data":{"activitycenter_netease_werewolf_join":[
      //   {"value":5,"task_id":"activitycenter_werewolf_player_m3","stages":[3],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[1]},
      //   {"value":5,"task_id":"activitycenter_werewolf_player_m1","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_player_m2","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_krill_m3","stages":[5],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_krill_m1","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_krill_m2","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_spirit_m3","stages":[2],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_spirit_m1","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_spirit_m2","stages":[1],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0]},
      //   {"value":5,"task_id":"activitycenter_werewolf_join_m1","stages":[1,3,5,7,10],"score":"","is_werewolf_reward":false,"awarded_types":[],"award":[0,0,0,0,0]}]},"current_time":1732092773}
      // accTaskValue.value = newActivityData.event_data[EVENT_NAME][ACC_TASK_ACTIVITY_INDEX].value * 10
      // // 更新缓存活动数据
      // activityStore.updateActivityData(newActivityData)
      // console.log('activityStore: ', activityStore)
      // setRedDot()
    })
}

/**
 * @function 领奖
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(rewardId: number, item: Reward): void {
  const { taskId, status } = item
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = rewards
      // 更新页面数据
      const taskIndex = eventData.value.findIndex(
        (item) => item.task_id === taskId,
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      showToast(
        '领取成功，您获得了' +
          curRewards.value.map(
            (item) =>
              ` ${rewardsText[item.name as keyof RewardsName]}*${item.count}`,
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
    background-image: url('@/assets/images/netease-werewolf-join/bg.jpg');
  }
}
.help {
  position: absolute;
  width: 50px;
  height: 50px;
  top: 52px;
  left: 990px;
  background-image: url('@/assets/images/netease-werewolf-join/help.png');
}
.progress-container {
  width: 1360px;
  height: 20px;
  background-color: #484c50;
  border-radius: 8px;
  // margin-top: 182px;
  // margin-left: 330px;
  .progress-bar {
    height: 20px;
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
    background-image: url('@/assets/images/double-eleven-2024-2/star.png');
    background-repeat: no-repeat;
    background-size: contain;
    transition: right 0.4s ease;
  }
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
</style>
