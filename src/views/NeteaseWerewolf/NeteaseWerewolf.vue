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
                v-for="(item, index) in taskList"
                :key="item.id"
                :class="[
                  'task-bg animate-flip flex flex-col-reverse bg-cover',
                  `bg-task${index + 1}`,
                ]"
              >
                <div v-if="item.status === 'redeemed'" class="task-mask"></div>
                <div
                  :class="[
                    'task-item animate__animated animate__fadeIn animate__slow bg-contain indent-[-9999px]',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.value, item.status, 1, index)"
                >
                  <p class="task-text">{{ item.title }}</p>
                </div>
              </li>
            </ul>
            <!-- 累计任务列表 -->
            <ul class="acc-task-list">
              <li
                v-for="(item, index) in accTaskList"
                :key="item.id"
                :class="[
                  'acc-task-item animate__animated animate__fadeIn bg-contain indent-[-9999px]',
                  `acc-task-item${index + 1}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.value, item.status, item.id, 6)"
              >
                <p>{{ item.title }}</p>
              </li>
            </ul>
            <!-- 累计收集代币进度 -->
            <div class="acc-progress bg-contain text-center">
              <p class="acc-progress-count">({{ collectedCount }}/10)</p>
            </div>
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
      <activity-modal ref="modalReward">
        <template #content>
          <div class="reward-text absolute left-[100px] top-[200px]"></div>
          <div class="reward mr-[10px]" @click="switchModal"></div>
          <div class="reward"></div>
        </template>
      </activity-modal>
      <Bind-modal ref="modalBind">
        <template #content>
          <div class="mt-[150px] flex items-center">
            <input
              class="h-[100px] grow rounded-[10px]"
              style="border: 1px solid #6fa2dd"
              type="text"
            />
            <button
              class="ml-[-10px] h-[100px] w-[210px] rounded-[10px] bg-[#3f83d2] text-[38px] text-white"
            >
              查询
            </button>
          </div>
          <div class="flex justify-between">
            <div>请输入角色昵称:</div>
            <a>如何查看UID?</a>
          </div>
          <div class="text-center">狼人杀角色名</div>
          <div class="text-[30px] text-[#e85340]">
            注意:奖品将直接发送至绑定的《狼人杀》UID内
          </div>
          <div class="flex justify-between">
            <button>重新输入</button>
            <button>确认</button>
          </div>
        </template>
      </Bind-modal>
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
import { useActivityStore } from '@/stores/tournamentOfTriumph1'
import { getResponsiveStylesFactor } from '@/utils/responsive'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()

interface Rewards {
  name: string
  count: number
}
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
const curRewards: Ref<Rewards> = ref({
  name: 'gravity',
  count: 2,
})

const TASK_LIST = [
  {
    id: 1,
    title: '参与1次收集云朵',
    value: 'activitycenter_tournament_of_triumph_1_dawn',
    status: 'wait',
  },
  {
    id: 2,
    title: '参与1次云野飞行竞速',
    value: 'activitycenter_tournament_of_triumph_1_prairie',
    status: 'wait',
  },
  {
    id: 3,
    title: '参与1次雨林越野赛跑',
    value: 'activitycenter_tournament_of_triumph_1_rain',
    status: 'wait',
  },
  {
    id: 4,
    title: '参与1次霞谷雪地滑行',
    value: 'activitycenter_tournament_of_triumph_1_sunset',
    status: 'wait',
  },
  {
    id: 5,
    title: '参与1次墓土螃蟹赛跑',
    value: 'activitycenter_tournament_of_triumph_1_dusk',
    status: 'wait',
  },
  {
    id: 6,
    title: '参与1次禁阁星光收集',
    value: 'activitycenter_tournament_of_triumph_1_night',
    status: 'wait',
  },
]
const ACC_TASK_LIST = [
  {
    id: 1,
    title: '收集3个奖牌代币',
    value: 'collecting_event_candles',
    status: 'wait',
  },
  {
    id: 2,
    title: '收集6个奖牌代币',
    value: 'collecting_event_candles',
    status: 'wait',
  },
  {
    id: 3,
    title: '收集10个奖牌代币',
    value: 'collecting_event_candles',
    status: 'wait',
  },
]

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.value, index]),
)

const EVENT = 'activitycenter_tournament_of_triumph_1'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalBind = ref<InstanceType<typeof BindModal> | null>(null)
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const collectedCount = computed(
  () => activityData.value.event_data[EVENT][6].value,
)
const isRewardImageLoaded = ref(false)
const rewardImageSrc = ref(handleSrc(String(curRewards.value.name)))
// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT][index]
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
  const activity = activityData.value.event_data[EVENT][6]
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

function switchModal(): void {
  modalReward.value?.closeModal()
  modalBind.value?.openModal()
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
  // 检查第7项，累计任务
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
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT]: data.event_data[EVENT].sort((a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? 7
            const orderB = taskOrderMap.get(b.task_id) ?? 7
            return orderA - orderB
          }),
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
 * @param task 任务id
 * @param status 状态
 * @param rewardId 第几个奖励节点
 * @param index 任务索引
 */
async function handleReward(
  task: string,
  status: string,
  rewardId: number,
  index: number,
): Promise<void> {
  console.log(task)
  console.log(status)
  // 让图片先加载再展示
  isRewardImageLoaded.value = false
  rewardImageSrc.value = handleSrc(String(curRewards.value.name))
  await preLoadImage(rewardImageSrc.value)
  isRewardImageLoaded.value = true
  modalReward.value?.openModal()

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
  height: 340px;
}
.reward-text {
  width: 407px;
  height: 340px;
  background-image: url('@/assets/images/netease-werewolf/text.png');
  background-repeat: no-repeat;
  background-size: contain;
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
  right: 29px;
  top: 623px;
}
.acc-task-item2 {
  right: 123px;
  top: 423px;
}
.acc-task-item3 {
  right: 295px;
  top: 300px;
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
.acc-progress {
  position: absolute;
  right: 0;
  bottom: 150px;
  padding-top: 55px;
  width: 497px;
  height: 105px;
  background-image: url('@/assets/images/tournament-of-triumph-1/acc-token-bg.png');

  &-count {
    height: 50px;
    line-height: 50px;
    font-size: 34px;
    color: #fff281;
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
