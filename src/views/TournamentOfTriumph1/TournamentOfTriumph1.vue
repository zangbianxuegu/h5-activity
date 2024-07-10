<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="tournament flex h-screen">
      <div class="tournament-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header z-10 flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              运动日锦标赛，开幕！ 7.26-8.10
            </h1>
            <h2 class="indent-[-9999px]">参与挑战，拼搏超越！</h2>
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
                  'task-bg animate-flip flex flex-col-reverse bg-contain',
                  `bg-task${index + 1}`,
                ]"
              >
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
            活动期间参与运动日锦标赛项目即可获得对应奖励：
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
          <p class="modal-text">
            恭喜你获得
            <span class="modal-text-blue"
              >{{ rewardsText[curRewards.name as keyof RewardsName] }} *
              {{ curRewards.count }}</span
            >：
          </p>
          <div class="mt-10 flex items-center justify-center">
            <img
              width="80"
              height="80"
              class="modal-reward"
              :src="rewardImageSrc"
              alt="reward"
            />
          </div>
        </template>
      </activity-modal>
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
import { useActivityStore } from '@/stores/tournamentOfTriumph1'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  gravity: string
  trail_rainbow: string
  energy: string
  flair_flower: string
  crab_rock_trick: string
  glow: string
  resize_potion: string
  heart: string
}
const rewardsText: RewardsName = {
  gravity: '漂浮魔法',
  trail_rainbow: '彩虹尾迹',
  energy: '元气满满',
  flair_flower: '炫彩步尘',
  crab_rock_trick: '螃蟹恶作剧',
  glow: '璀璨之星魔法',
  resize_potion: '体型重塑',
  heart: '爱心',
}
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
const { factor } = useResponsiveStyles(designConfig)
console.log('factor: ', factor.value)

const EVENT = 'activitycenter_tournament_of_triumph_1'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
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

const isVisited = Session.get('isVisitedTournamentOfTriumph1')
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
  Session.set('isVisitedTournamentOfTriumph1', true)
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
function handleReward(
  task: string,
  status: string,
  rewardId: number,
  index: number,
): void {
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT,
    task,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
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
    background-image: url('@/assets/images/tournament-of-triumph-1/bg.jpg');
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
  background-image: url('@/assets/images/tournament-of-triumph-1/title.png');
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
  top: 0;
  width: 1500px;
}
.task-bg {
  width: 250px;
  height: 1022px;
}
.task-item {
  margin-left: -8px;
  margin-bottom: 58px;
  width: 267px;
  height: 340px;
}
@for $i from 1 through 6 {
  .bg-task#{$i} {
    background-image: url('@/assets/images/tournament-of-triumph-1/bg-task#{$i}.png');
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
