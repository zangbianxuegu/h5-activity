<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="cloud-music flex h-screen">
      <div class="cloud-music-main">
        <h2 class="logo bg-contain bg-no-repeat">
          <span class="sr-only">光·遇 X 网易云音乐</span>
        </h2>
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative h-full bg-contain bg-no-repeat">
            <div class="sr-only">
              光遇云音 心碎律动
              <p>
                <time datetime="2024-12-06">12.6</time>-
                <time datetime="2024-12-19">12.19</time>
              </p>
              <p class="sr-only">
                <span>专辑：天空王国</span>
                <span>歌手：光之子</span>
                <span>来源：未知</span>
              </p>
            </div>
            <div
              class="help cursor-pointer bg-contain bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 音乐播放器 -->
            <div class="player">
              <div class="relative h-full w-full">
                <div
                  ref="playerDisc"
                  :class="[
                    'player-disc animation-play absolute inset-0 bg-contain bg-no-repeat',
                    {
                      'animation-pause': !isPlaying,
                    },
                  ]"
                ></div>
                <button
                  type="button"
                  ref="playerBtn"
                  :class="[
                    'player-btn absolute bg-transparent bg-contain bg-center bg-no-repeat',
                    isPlaying ? 'play' : 'pause',
                  ]"
                  @click="togglePlay"
                >
                  <span v-if="isPlaying" class="sr-only">暂停</span>
                  <span v-else class="sr-only">播放</span>
                </button>
                <figure>
                  <figcaption class="sr-only">音乐</figcaption>
                  <audio
                    ref="music"
                    :controls="false"
                    :autoplay="false"
                    loop
                    src="./audio/night _lambent_light_tempaaa.mp3"
                  ></audio>
                </figure>
              </div>
            </div>
            <!-- 任务列表 -->
            <h2 id="taskListHeading" class="sr-only">任务列表</h2>
            <ul class="task-list">
              <li
                v-for="item in taskList"
                :aria-label="`任务${item.id}: ${item.title}`"
                :key="item.id"
                :class="[
                  'task-item animate__animated animate__fadeIn relative flex bg-no-repeat',
                  item.status,
                ]"
              >
                <!-- 歌词 时长 -->
                <p class="flex w-[798px] justify-between">
                  <span class="">{{ item.title }}</span>
                  <span>01:00</span>
                </p>
                <!-- 可领奖动画 -->
                <div v-if="item.status === 'can'" class="relative bg-contain">
                  <div
                    class="task-icon relative z-10 bg-center bg-no-repeat"
                    @click.capture="handleReward($event, 1, item)"
                  ></div>
                  <can-reward-bubble-animation
                    :ref="item.canRewardLottieRef"
                    :id="item.taskId"
                    class="reward-bubble absolute inset-0 z-0"
                  ></can-reward-bubble-animation>
                  <div
                    :class="[
                      'reward absolute inset-0 hidden bg-contain',
                      `reward${item.id}`,
                    ]"
                  ></div>
                </div>
                <!-- 已完成任务删除线 -->
                <div
                  v-if="item.status === 'redeemed'"
                  class="dot-line animate__animated animate__fadeIn absolute left-[42px] top-0 h-full w-[798px] bg-contain bg-center bg-no-repeat transition-all"
                ></div>
              </li>
            </ul>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <div class="absolute bottom-0 left-0 h-[290px] w-full">
              <div class="relative h-full w-full">
                <!-- title -->
                <div
                  class="absolute bottom-[57px] left-[150px] h-[48px] w-[150px] rounded-3xl text-center text-[36px] leading-[48px] text-white"
                  style="background-color: rgba(93, 132, 255, 0.45)"
                >
                  00:00
                </div>
                <!-- 列表 -->
                <ul
                  class="acc-task-list absolute left-[475px] m-auto flex w-[1420px] justify-between"
                >
                  <li
                    v-for="(item, index) in accTaskList"
                    :key="item.id"
                    :aria-label="`累计获得积分 ${index + 1}`"
                    class="acc-task-item animate__animated animate__fadeIn h-[230px]"
                  >
                    <bubble
                      :reward="item"
                      :bubble-scale="1.3"
                      :bounce-class="`${item.taskId}-${item.id}`"
                    >
                      <div
                        :class="[
                          'acc-task-icon animate__animated animate__fadeIn relative z-10 bg-contain bg-center bg-no-repeat',
                          item.status,
                          `acc-task-icon${item.id}`,
                        ]"
                        @click="handleReward($event, index + 1, item)"
                      ></div>
                    </bubble>
                    <p
                      class="mt-[10px] h-[36px] text-center text-[30px] leading-[36px] text-white"
                    >
                      0{{ index + 1 }}:00
                    </p>
                  </li>
                </ul>
                <!-- 进度条 -->
                <div
                  class="progress-container absolute bottom-[68px] left-[315px]"
                >
                  <div
                    class="progress-bar"
                    :style="`width: ${progress > 100 ? 100 : progress}%;`"
                  ></div>
                </div>
              </div>
            </div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast, closeToast } from 'vant'
import gsap from 'gsap'
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import type { Event } from '@/types'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { animateBounce, animateBounceEase } from '@/utils/utils'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/cloudMusic2024'
import ModalHelp from './components/ModalHelp.vue'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import Bubble from '@/components/Bubble'
import {
  type TaskItem,
  type Reward,
  EVENT_NAME,
  ACC_TASK_VALUE,
  ACC_TASK_INDEX,
  TaskStatus,
  REWARD_TEXT,
  createTaskList,
  createAccTaskList,
} from './config'
import { useTransitions } from './composables/useTransition'
import { useMusicPlayer } from './composables/useMusicPlayer'
gsap.registerPlugin(MotionPathPlugin)

const TASK_LIST = createTaskList()
const ACC_TASK_LIST = createAccTaskList()

// refs
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
const playerBtn = ref<HTMLButtonElement | null>(null)
const playerDisc = ref<HTMLDivElement | null>(null)
const music = ref<HTMLAudioElement | null>(null)

// 页面适配
getResponsiveStylesFactor()
const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransitions()
const { isPlaying, togglePlay } = useMusicPlayer(music)

// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])
// 进度：20,40……
const progress = computed(() => {
  return eventData.value[ACC_TASK_INDEX].value * 20
})

let toastTimeout: NodeJS.Timeout | null = null

// 当前奖励
const curReward = ref<Reward>({
  name: '分享音符',
  count: 1,
})

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.taskId, index]),
)

// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT_NAME][index]
    return {
      ...item,
      status:
        activity.award[0] === 1
          ? TaskStatus.REDEEMED
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
            ? TaskStatus.CAN
            : TaskStatus.WAIT,
    }
  })
})
// 累计任务列表
const accTaskList = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][ACC_TASK_INDEX]
  return ACC_TASK_LIST.map((item, index) => {
    return {
      ...item,
      status:
        activity.award[index] === 1
          ? TaskStatus.REDEEMED
          : activity.award[index] === 0 &&
              activity.value >= activity.stages[index]
            ? TaskStatus.CAN
            : TaskStatus.WAIT,
    }
  })
})

onMounted(() => {
  getActivityData()
  preloadImage([
    '@/assets/images/cloud-music-2024/btn-play.png',
    '@/assets/images/cloud-music-2024/btn-pause.png',
  ])
})

onBeforeUnmount(() => {
  if (toastTimeout !== null) {
    clearTimeout(toastTimeout)
  }
})

// 侦听任务数据变化，动态更新可领奖动画
watchEffect(() => {
  taskList.value.forEach(handleTaskLottie)
})

/**
 * @function handleTaskLottie
 * @description 任务动画处理
 * @param {TaskItem} task
 * @returns {void}
 */
function handleTaskLottie(task: TaskItem): void {
  if (task.status === TaskStatus.CAN) {
    void nextTick(() => {
      if (task.hadRenderLottie && !task.hadRenderLottie.value) {
        initCanRewardLottie(task)
      }
    })
  } else {
    task.canRewardLottieRef?.value?.[0]?.destroyAnimation()
  }
}

/**
 * @function initCanRewardLottie
 * @description 初始化可领奖动画
 * @param {TaskItem} task
 * @returns {void}
 */
function initCanRewardLottie(task: TaskItem): void {
  task.canRewardLottieRef?.value[0].initLottie()
  if (task.hadRenderLottie) {
    task.hadRenderLottie.value = true
  }
}

/**
 * @function handleTokenFly
 * @description 积分飞入进度条动画
 * @param {TaskItem} item 任务项
 * @returns {Promise<void>}
 */
async function handleTokenFly(item: TaskItem): Promise<void> {
  // 积分
  const tokenId = item.id
  const token = document.querySelector(`.reward${tokenId}`) as HTMLElement
  token.classList.remove('hidden')
  const tokenRect = token.getBoundingClientRect()

  // 进度奖励
  const num = progress.value / 20
  const targetEle = document.querySelector(
    `.acc-task-icon${num + 1}`,
  ) as HTMLElement
  const targetEleRect = targetEle.getBoundingClientRect()

  // 使用Promise来等待动画完成
  await new Promise<void>((resolve) => {
    gsap.to(token, {
      duration: 0.7,
      ease: 'power1.out',
      opacity: 1,
      startAt: { x: 0, y: 0, opacity: 1, scale: 1 },
      motionPath: {
        path: [
          // x, y 为目标位置距离运动元素的偏移量
          {
            x: -(
              tokenRect.left -
              targetEleRect.left -
              targetEleRect.width / 2 +
              tokenRect.width / 2
            ),
            y: -(
              tokenRect.top -
              targetEleRect.top -
              targetEleRect.height / 2 +
              tokenRect.height / 2
            ),
            scale: 0.5,
          },
        ],
        autoRotate: false,
      },
      onComplete: () => {
        gsap.set(token, { opacity: 0 })
        resolve() // 动画完成后调用resolve
      },
    })
  })
}

/**
 * @function checkHasUnclaimedReward
 * @description 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  const tasksValid = tasks
    .slice(0, ACC_TASK_INDEX)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  const accTask = tasks[ACC_TASK_INDEX]
  const accTasksValid = accTask.stages.some(
    (stage, index) => accTask.value >= stage && accTask.award[index] === 0,
  )
  return tasksValid || accTasksValid
}

/**
 * @function setRedDot
 * @description 设置红点
 * @returns {void}
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(eventData.value)
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

/**
 * @function getActivityData
 * @description 获取任务进度
 * @returns {void}
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
              const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
              const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
              return orderA - orderB
            },
          ),
        },
      }
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function handleReward
 * @description 领奖
 * @param event 事件对象
 * @param rewardId 第几个奖励节点
 * @param item 任务项
 * @returns {void}
 */
function handleReward(
  $event: MouseEvent,
  rewardId: number,
  item: TaskItem,
): void {
  const { taskId, status } = item
  if (status === TaskStatus.REDEEMED) {
    return
  }
  if (status === TaskStatus.WAIT) {
    showToast('还未完成任务')
    const target = $event.target
    if (target && target instanceof HTMLElement) {
      animateBounce(target)
    }
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      curReward.value = res.data.rewards[0]
      // 进度的领奖动画用 bubble 组件实现
      if (taskId !== ACC_TASK_VALUE) {
        // 领奖动画
        await bubbleBurst($event, item)
        // 飞入进度条动画
        await handleTokenFly(item)
      }
      // 更新页面数据
      const taskIndex = eventData.value.findIndex((item) => {
        return item.task_id === taskId
      })
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      // 更新进度任务
      if (taskId !== ACC_TASK_VALUE) {
        activityData.value.event_data[EVENT_NAME][ACC_TASK_INDEX].value++
      } else {
        closeToast(true)
        toastTimeout = setTimeout(() => {
          showToast(
            `领取成功，您获得了 ${REWARD_TEXT[curReward.value.name as keyof typeof REWARD_TEXT]}*${curReward.value.count}`,
          )
        }, 100)
      }
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function bubbleBurst
 * @description 可领奖动画
 * @param {MouseEvent} event - 鼠标事件
 * @param {Reward} reward - 奖励对象
 * @returns {Promise<void>}
 */
const bubbleBurst = async (
  event: MouseEvent,
  reward: TaskItem,
): Promise<void> => {
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value[0].playAnimationClickBubble()
  }
  const target = event.target
  if (target && target instanceof HTMLElement) {
    await animateBounceEase(target)
  }
}

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}

/**
 * @function preloadImage
 * @description 预加载图片
 * @returns {void}
 */
function preloadImage(imgArr: string[]): void {
  imgArr.forEach((src) => {
    const img = new Image()
    img.src = src
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
.cloud-music {
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
    background-image: url('@/assets/images/cloud-music-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 900px;
  top: 18px;
  width: 939px;
  height: 253px;
  background-image: url('@/assets/images/cloud-music-2024/title.png');
}
.help {
  position: absolute;
  width: 67px;
  height: 67px;
  right: -55px;
  top: 98px;
  background-image: url('@/assets/images/cloud-music-2024/help.png');
}
.logo {
  position: absolute;
  left: 27px;
  top: 24px;
  width: 551px;
  height: 78px;
  background-image: url('@/assets/images/cloud-music-2024/logo.png');
}

.player {
  position: absolute;
  left: 150px;
  top: 190px;
  width: 580px;
  height: 580px;

  &-disc {
    background-image: url('@/assets/images/cloud-music-2024/disc.png');
  }

  &-btn {
    left: 202px;
    top: 202px;
    width: 176px;
    height: 176px;
    cursor: pointer;

    &.play {
      background-size: 85px 90px;
      background-image: url('@/assets/images/cloud-music-2024/btn-play.png');
    }

    &.pause {
      background-size: 86px 87px;
      background-image: url('@/assets/images/cloud-music-2024/btn-pause.png');
    }
  }
}
.task-list {
  position: absolute;
  left: 893px;
  top: 245px;
}
.task-item {
  padding-left: 42px;
  height: 120px;
  line-height: 120px;
  font-size: 36px;

  &.wait {
    color: #90b5ff;
    background-size: 28px 31px;
    background-position: left center;
    background-image: url('@/assets/images/cloud-music-2024/star-blue.png');
  }

  &.can {
    color: #fff;
    background-size: 50px 54px;
    background-position: -10px center;
    background-image: url('@/assets/images/cloud-music-2024/star-white.png');
  }

  &.redeemed {
    color: #576c96;
    background-size: 28px 31px;
    background-position: left center;
    background-image: url('@/assets/images/cloud-music-2024/star-gray.png');
  }
}
.task-icon {
  width: 169px;
  height: 120px;
  background-size: 42px 41px;
  background-image: url('@/assets/images/cloud-music-2024/task-icon-can.png');
}
.dot-line {
  background-size: 798px 3px;
  background-image: url('@/assets/images/cloud-music-2024/dot-line.png');
}
.progress-container {
  width: 1464px;
  height: 20px;
  background-color: rgba(211, 214, 255, 0.29);
  border-radius: 10px;
}
.progress-bar {
  height: 20px;
  background: linear-gradient(to right, #ffc75b, #ffe583);
  border-radius: 10px;
  transition: width 0.4s ease;
  position: relative;

  &::after {
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
  position: relative;
}
.acc-task-icon {
  width: 256px;
  height: 230px;
  background-position: center;
}
@for $i from 1 through 5 {
  .acc-task-icon#{$i} {
    &.wait {
      background-image: url('@/assets/images/cloud-music-2024/acc-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/cloud-music-2024/acc-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/cloud-music-2024/acc-task#{$i}-redeemed.png');
    }
  }
}
.acc-task-icon1 {
  &.can {
    background-size: 110px 110px;
  }
}
.acc-task-icon2 {
  &.can {
    background-size: 71px 72px;
  }
}
.acc-task-icon3 {
  &.can {
    background-size: 61px 91px;
  }
}
.acc-task-icon4 {
  &.can {
    background-size: 54px 81px;
  }
}
.acc-task-icon5 {
  &.can {
    background-size: 59px 86px;
  }
}
.reward-bubble {
  position: absolute;
  & > :first-child {
    position: absolute;
    transform: scale(1.4) !important;
  }
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animation-play {
  animation: spin 20s linear infinite;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
.animation-pause {
  animation-play-state: paused;
}
.reward {
  margin-top: -1px;
  width: 169px;
  height: 122px;
  background-image: url('@/assets/images/cloud-music-2024/task-icon.png');
}
</style>
