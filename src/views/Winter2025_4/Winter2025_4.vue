<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div
        :class="[
          'page-main h-full w-full',
          { 'keyboard-show': isKeyboardShow },
        ]"
      >
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative bg-contain bg-no-repeat">
            <div class="sr-only">
              花灯雅集
              <p>
                <time datetime="2025-2-11">2.11</time>
                <time datetime="2025-2-17">2.17</time>
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
            <div class="back cursor-pointer bg-contain" @click="router.back()">
              <div class="sr-only">back</div>
            </div>
            <!-- 代币总数 -->
            <div class="coin flex items-center">
              <div class="coin-icon"></div>
              <div class="flex-1 text-center">{{ tokenCount }}</div>
            </div>
            <div class="tree relative">
              <!-- 累计猜对灯谜 -->
              <h2 class="sr-only">累计猜对灯谜</h2>
              <div :class="{ hide: isRiddleLampShow }">
                <div
                  class="absolute bottom-[-30px] left-[270px] z-10 flex flex-col items-center"
                >
                  <div class="flex items-center">
                    <div class="acc-task1-title"></div>
                    <p class="text-[34px] text-[#fff]">
                      （<span class="text-[#ffeb9c]">{{
                        rewardTokenRiddle.currentCount
                      }}</span
                      >/{{ rewardTokenRiddle.targetCount }}）
                    </p>
                  </div>
                  <ul class="relative top-[-30px] flex">
                    <li
                      v-for="(item, index) in riddleAccTaskList"
                      :key="item.id"
                    >
                      <bubble
                        :reward="item"
                        :bubbleScale="1.9"
                        :bounce-class="`${item.taskId}-${item.id}`"
                      >
                        <div
                          :class="[
                            'acc-task-icon animate__animated animate__fadeIn z-10',
                            `riddle-acc-task-icon${item.id}`,
                            item.status,
                          ]"
                          @click="handleReward(index + 1, item)"
                        ></div>
                      </bubble>
                      <p class="sr-only">{{ item.title }}</p>
                    </li>
                  </ul>
                </div>
                <div
                  class="lamp1 lamp-rabbit absolute left-[320px] top-[220px] h-[735px] w-[391px]"
                ></div>
              </div>

              <SpinePlayer
                ref="rabbitLamp"
                :class="[isRiddleLampShow ? 'fade' : 'hide']"
                class="pointer-events-none absolute left-[272px] top-[250px] h-[912px] w-[486px]"
                animation="lamp_01"
                :json-path="jsonPath"
                :atlas-path="atlasPath"
              />

              <!-- 累计点赞纸船 -->
              <h2 class="sr-only">累计点赞纸船</h2>
              <div :class="{ hide: isBoatLampShow }">
                <div
                  class="absolute bottom-[158px] left-[784px] z-10 flex flex-col items-center"
                >
                  <div class="flex items-center">
                    <div class="acc-task3-title"></div>
                    <p class="text-[34px] text-[#fff]">
                      （<span class="text-[#ffeb9c]">{{
                        rewardTokenBoat.currentCount
                      }}</span
                      >/{{ rewardTokenBoat.targetCount }}）
                    </p>
                  </div>
                  <ul class="relative top-[-20px] flex">
                    <li v-for="(item, index) in boatAccTaskList" :key="item.id">
                      <bubble
                        :reward="item"
                        :bubbleScale="1.9"
                        :bounce-class="`${item.taskId}-${item.id}`"
                      >
                        <div
                          :class="[
                            'acc-task-icon animate__animated animate__fadeIn z-10',
                            `boat-acc-task-icon${item.id}`,
                            item.status,
                          ]"
                          @click="handleReward(index + 1, item)"
                        ></div>
                      </bubble>
                      <p class="sr-only">{{ item.title }}</p>
                    </li>
                  </ul>
                </div>
                <div
                  class="lamp2 lamp-flower absolute left-[784px] top-[188px] h-[578px] w-[422px]"
                ></div>
              </div>
              <SpinePlayer
                ref="flowerLamp"
                :class="[isBoatLampShow ? 'fade' : 'hide']"
                class="pointer-events-none absolute left-[718px] top-[160px] h-[727px] w-[561px]"
                :json-path="jsonPath"
                :atlas-path="atlasPath"
                animation="lamp_02"
              />

              <!-- 收集季节蜡烛 -->
              <h2 class="sr-only">收集季节蜡烛</h2>
              <div :class="{ hide: isCandleLampShow }">
                <div
                  class="absolute right-[-100px] top-[530px] z-10 flex flex-col items-center"
                >
                  <div class="flex items-center">
                    <div class="acc-task2-title"></div>
                    <p class="text-[34px] text-[#fff]">
                      （<span class="text-[#ffeb9c]">{{
                        rewardTokenCandle.currentCount
                      }}</span
                      >/{{ rewardTokenCandle.targetCount }}）
                    </p>
                  </div>
                  <ul class="relative top-[-20px] flex">
                    <li
                      v-for="(item, index) in candleAccTaskList"
                      :key="item.id"
                    >
                      <bubble
                        :reward="item"
                        :bubbleScale="1.9"
                        :bounce-class="`${item.taskId}-${item.id}`"
                      >
                        <div
                          :class="[
                            'acc-task-icon animate__animated animate__fadeIn z-10',
                            `candle-acc-task-icon${item.id}`,
                            item.status,
                          ]"
                          @click="handleReward(index + 1, item)"
                        ></div>
                      </bubble>
                      <p class="sr-only">{{ item.title }}</p>
                    </li>
                  </ul>
                </div>
                <div
                  class="lamp3 lamp-moon absolute left-[1300px] top-[36px] h-[489px] w-[313px]"
                ></div>
              </div>
              <SpinePlayer
                :class="[isCandleLampShow ? 'fade' : 'hide']"
                ref="moonLamp"
                class="pointer-events-none absolute left-[1193px] top-[0px] h-[723px] w-[475px]"
                :json-path="jsonPath"
                :atlas-path="atlasPath"
                animation="lamp_03"
              />
            </div>
            <div
              class="riddle-container animate__animated animate__fadeIn flex flex-col items-center"
            >
              <div class="riddle-title" aria-label="今日灯谜"></div>
              <div
                class="animate__animated animate__fadeIn mb-[10px] mt-[30px] h-[290px] text-[34px] text-[#cc7b3a]"
              >
                <span class="riddle">{{ todayRiddle[0] }}</span>
                <span class="riddle">{{ todayRiddle[1] }}</span>
                <span class="riddle num">{{ todayRiddle[2] }}</span>
              </div>
              <div class="riddle-reward mb-[20px] flex items-end">
                <span>奖励：</span>
                <div
                  class="riddle-icon mr-[10px]"
                  :class="[
                    {
                      'riddle-icon-finished': isFinished,
                    },
                  ]"
                ></div>
                <div class="mr-[10px]">x10</div>
                <p class="right-icon"></p>
              </div>
              <input
                v-model.trim="answer"
                maxlength="10"
                placeholder="点击输入谜底"
                class="riddle-input"
              />
              <button
                type="button"
                :class="[
                  'btn',
                  {
                    'btn-finished disabled': isFinished,
                  },
                ]"
                @click="guessRiddle"
              >
                <span v-if="isFinished"> 今日已完成 </span>
                <span v-else> 确定 </span>
              </button>
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
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import { getWinterRiddle, guessWinterRiddle } from '@/apis/winter2025'
import type { Event } from '@/types'
import { useBaseStore } from '@/stores/base'
import { useMenuStore } from '@/stores/menu'
import { useTokenStore } from '@/stores/winter2025'
import { useActivityStore } from '@/stores/winter2025_4'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import Bubble from '@/components/Bubble'
import { REWARD_MAP } from '@/constants/rewardMap'
import ModalHelp from './components/ModalHelp.vue'
import { useTransition } from '@/composables/useTransition'
import {
  EVENT_NAME,
  type Reward,
  type TaskItem,
  TaskStatus,
  TASK_VALUE,
  createCandlesAccTaskList,
  createRiddlesAccTaskList,
  createBoatAccTaskList,
  createTask,
  SESSION_IS_VISITED_KEY,
} from './config'
import gsap from 'gsap'
import throttle from 'lodash.throttle'
import SpinePlayer from '@/components/SpinePlayer'
getResponsiveStylesFactor()

const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransition(SESSION_IS_VISITED_KEY)

const curReward: Ref<Reward> = ref({
  name: 'energy_potion',
  count: 1,
})
const jsonPath = './spine/winter2025-4/2024_lamp.json'
const atlasPath = './spine/winter2025-4/2024_lamp.atlas'
const rabbitLamp = ref<InstanceType<typeof SpinePlayer> | null>(null)
const flowerLamp = ref<InstanceType<typeof SpinePlayer> | null>(null)
const moonLamp = ref<InstanceType<typeof SpinePlayer> | null>(null)

// 今日谜题
const RIDDLE = createTask()
// 收集季节蜡烛
const CANDLES_ACC_TASK_LIST = createCandlesAccTaskList()
// 累计猜对灯谜
const RIDDLES_ACC_TASK_LIST = createRiddlesAccTaskList()
// 累计点赞纸船
const BOAT_ACC_TASK_LIST = createBoatAccTaskList()

// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const tokenStore = useTokenStore()
const activityData = computed(() => activityStore.activityData)
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])
const tokenCount = computed(() =>
  Number(tokenStore.tokeInfo?.lantern_token || 0),
)
const baseStore = useBaseStore()
const gameUid = computed(() => baseStore.baseInfo.gameUid)
const router = useRouter()

// 任务排序
const taskOrderMap = new Map(
  [
    RIDDLE,
    RIDDLES_ACC_TASK_LIST[0],
    BOAT_ACC_TASK_LIST[0],
    CANDLES_ACC_TASK_LIST[0],
  ].map((task, index) => [task.taskId, index]),
)

// 获取任务状态
const getTaskStatus = (activity: Event, index: number): TaskStatus => {
  const { award, value, stages } = activity
  if (award?.[index] === 1) return TaskStatus.REDEEMED
  if (award?.[index] === 0 && value >= stages?.[index]) return TaskStatus.CAN
  return TaskStatus.WAIT
}

/**
 * @function 更新任务列表
 * @param taskList 任务列表
 * @param activityIndex 活动索引
 * @returns {ComputedRef<TaskItem[]>} 返回计算属性，包含更新后的任务列表
 */
const updateTaskList = (
  taskList: TaskItem[],
  activityIndex: number,
): ComputedRef<TaskItem[]> => {
  return computed(() => {
    const activity = eventData.value[activityIndex]
    return taskList.map((item, index) => {
      return {
        ...item,
        status: getTaskStatus(activity, index),
      }
    })
  })
}
const updateRewardToken = (
  activityIndex: number,
  targetCount: number,
): ComputedRef => {
  return computed(() => {
    const activity = eventData.value[activityIndex]
    return {
      currentCount: Math.min(activity.value, targetCount),
      targetCount,
    }
  })
}
// 累计猜对灯谜
const riddleAccTaskList = updateTaskList(RIDDLES_ACC_TASK_LIST, 1)
// 累计点赞纸船
const boatAccTaskList = updateTaskList(BOAT_ACC_TASK_LIST, 2)
// 收集季节蜡烛
const candleAccTaskList = updateTaskList(CANDLES_ACC_TASK_LIST, 3)

const rewardTokenRiddle = updateRewardToken(1, 5)
const rewardTokenBoat = updateRewardToken(2, 5)
const rewardTokenCandle = updateRewardToken(3, 20)

/**
 * @function 是否隐藏任务列表
 * @param taskList 任务列表
 * @param activityIndex 任务索引
 * @returns {ComputedRef<boolean>}
 */
const hideTask = (index: number): ComputedRef<boolean> => {
  return computed(() => {
    const accTask = eventData.value[index]
    const accTasksValid = accTask.stages.every(
      (stage, index) => accTask.value >= stage && accTask.award[index] === 1,
    )
    return accTasksValid
  })
}
const isRiddleLampShow = hideTask(1)
const isBoatLampShow = hideTask(2)
const isCandleLampShow = hideTask(3)

onMounted(() => {
  try {
    window.addEventListener('resize', handleResize)
    getActivityData()
    getActivityRiddle()
    tokenStore.initData()
  } catch (error) {
    console.error(error)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

/**
 * @function 是否已领奖
 * @param tasks 累计任务列表
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  return tasks.slice(1, 4).some((task) => {
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
          [EVENT_NAME]: data.event_data[EVENT_NAME].sort(
            (a: Event, b: Event) => {
              const orderA = taskOrderMap.get(a.task_id) as number
              const orderB = taskOrderMap.get(b.task_id) as number
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
 * @function 领奖
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(rewardId: number, item: TaskItem): void {
  const { taskId, status } = item
  if (status === TaskStatus.REDEEMED) {
    return
  }
  if (status === TaskStatus.WAIT) {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      curReward.value = res.data.rewards[0]
      // 更新页面数据
      const taskIndex = eventData.value.findIndex(
        (item) => item.task_id === taskId,
      )
      showToast(
        `领取成功，您获得了 ${REWARD_MAP[curReward.value.name as keyof typeof REWARD_MAP]}*${curReward.value.count}`,
      )
      eventData.value[taskIndex].award[rewardId - 1] = 1

      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

const todayRiddle = ref<string[]>(['', '', ''])
const answer = ref<string>('')
function getActivityRiddle(): void {
  getWinterRiddle({ user: gameUid.value })
    .then((res) => {
      const question = res.question.replace(/：/g, ':')
      const parts = question.split('，')
      const [part1, part2] = parts[1].split('。')
      todayRiddle.value = [parts[0], part1, part2]
    })
    .catch((error) => {
      showToast(error.message)
    })
}
const isFinished = computed(() => {
  const activity = eventData.value[0]
  return activity.award[0] === 1
})
function guessRiddle(): void {
  if (isFinished.value) return
  if (answer.value.length === 0) {
    showToast('答案为空')
    return
  }
  guessWinterRiddle({
    user: gameUid.value,
    answer: answer.value,
  })
    .then(() => {
      claimMissionReward({
        event: EVENT_NAME,
        task: TASK_VALUE,
        rewardId: 1,
      })
        .then(async () => {
          // 更新页面数据
          await handleTokenFly()
          answer.value = ''
          activityData.value.token_info.lantern_token = tokenCount.value + 10
          activityData.value.event_data[EVENT_NAME][0].award[0] = 1
          showToast('答案正确，您获得了花灯代币*10')
          // 更新红点
          setRedDot()
        })
        .catch((error) => {
          showToast(error.message)
        })
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function handleTokenFly
 * @description 奖励飞入代币总数动画
 * @returns {Promise<void>}
 */
async function handleTokenFly(): Promise<void> {
  const token = document.querySelector('.riddle-icon') as HTMLElement
  const clone = token.cloneNode(true) as HTMLElement
  document.body.appendChild(clone)
  const tokenRect = token.getBoundingClientRect()
  // 调整克隆div的位置和样式
  gsap.set(clone, {
    position: 'absolute',
    top: tokenRect.top,
    left: tokenRect.left,
  })
  const target = document.querySelector('.coin-icon') as HTMLElement
  const targetRect = target.getBoundingClientRect()
  await new Promise<void>((resolve) => {
    gsap.to(clone, {
      duration: 0.5, // 动画持续时间（秒）
      top: targetRect.top,
      left: targetRect.left,
      ease: 'power1.inOut', // 使用缓动效果
      onComplete: () => {
        clone.remove()
        resolve() // 动画完成后调用resolve
      },
    })
  })
}

// 规则弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}
// 记录初始窗口高度
const originalHeight = window.innerHeight
// 键盘是否显示
const isKeyboardShow = ref(false)

/**
 * @function 处理窗口大小变化的函数，兼容安卓机防止弹出虚拟键盘后页面顶上去
 */
const handleResize = throttle(() => {
  const currentHeight = window.visualViewport?.height || window.innerHeight
  isKeyboardShow.value = originalHeight > currentHeight
}, 200)
</script>

<style lang="scss" scoped>
.fade {
  transition: opacity 0.5s ease-in-out 0.5s;
}
.hide {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
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
.page {
  background-image: url('@/assets/images/winter2025-4/bg.jpg');
  &-main {
    &.keyboard-show {
      transform: scale(1);
    }
  }
}
.tree {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1680px;
  height: 1200px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url('@/assets/images/winter2025-4/tree.png');
}
.title {
  position: absolute;
  left: 405px;
  top: 60px;
  z-index: 10;
  width: 753px;
  height: 204px;
  background-image: url('@/assets/images/winter2025-4/title.png');
}
.help {
  position: absolute;
  width: 83px;
  height: 83px;
  top: 18px;
  right: -60px;
  background-image: url('@/assets/images/winter2025-4/help.png');
}
.back {
  position: absolute;
  width: 169px;
  height: 135px;
  top: 30px;
  left: 80px;
  background-image: url('@/assets/images/winter2025-4/back.png');
}
.coin {
  padding-left: 20px;
  position: absolute;
  top: 40px;
  right: 70px;
  width: 204px;
  height: 51px;
  color: #fffae9;
  font-size: 34px;
  background-color: #1d2e58;
  border-radius: 40px;
}
.coin-icon {
  width: 36px;
  height: 57px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-4/coin.png');
}
.acc-task1-title {
  width: 232px;
  height: 45px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/winter2025-4/riddle.png');
}
.acc-task2-title {
  width: 229px;
  height: 45px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/winter2025-4/candle.png');
}
.acc-task3-title {
  width: 231px;
  height: 45px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/winter2025-4/boat.png');
}
.acc-task-icon {
  width: 178px;
  height: 230px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

@for $i from 1 through 3 {
  .riddle-acc-task-icon#{$i} {
    &.wait {
      background-image: url('@/assets/images/winter2025-4/riddle-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/winter2025-4/riddle-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/winter2025-4/riddle-task#{$i}-redeemed.png');
    }
  }
}
@for $i from 1 through 3 {
  .candle-acc-task-icon#{$i} {
    &.wait {
      background-image: url('@/assets/images/winter2025-4/candle-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/winter2025-4/candle-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/winter2025-4/candle-task#{$i}-redeemed.png');
    }
  }
}
@for $i from 1 through 3 {
  .boat-acc-task-icon#{$i} {
    &.wait {
      background-image: url('@/assets/images/winter2025-4/boat-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/winter2025-4/boat-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/winter2025-4/boat-task#{$i}-redeemed.png');
    }
  }
}
.riddle-acc-task-icon1.can {
  background-size: 73px 79px;
}
.riddle-acc-task-icon2.can {
  background-size: 71px 79px;
}
.riddle-acc-task-icon3.can {
  background-size: 75px 72px;
}
.boat-acc-task-icon1.can {
  background-size: 62px 82px;
}
.boat-acc-task-icon2.can {
  background-size: 68px 71px;
}
.boat-acc-task-icon3.can {
  background-size: 48px 80px;
}
.candle-acc-task-icon1.can {
  background-size: 79px 82px;
}
.candle-acc-task-icon2.can {
  background-size: 64px 80px;
}
.candle-acc-task-icon3.can {
  background-size: 48px 79px;
}
@for $i from 1 through 3 {
  .lamp#{$i} {
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url('@/assets/images/winter2025-4/lamp#{$i}.png');
  }
}
.riddle-container {
  padding-top: 160px;
  padding-right: 60px;
  position: absolute;
  bottom: 100px;
  right: 140px;
  width: 534px;
  height: 851px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/winter2025-4/riddle-bg.png');
}
.riddle-title {
  width: 230px;
  height: 59px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/winter2025-4/riddle-title.png');
}
.riddle {
  writing-mode: vertical-lr;
  letter-spacing: 6px;
  text-orientation: upright;
  &.num {
    letter-spacing: 0px;
  }
}

.riddle-input {
  padding-left: 40px;
  width: 418px;
  height: 81px;
  font-size: 34px;
  color: #f7ede3;
  background-color: #dfb58a;
  border-radius: 40px;
}
.riddle-input::placeholder {
  color: #efdac4;
}
.riddle-icon {
  width: 39px;
  height: 59px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-4/riddle-coin.png');
  &-finished {
    background-image: url('@/assets/images/winter2025-4/riddle-coin-finished.png');
  }
}
.riddle-reward {
  width: 330px;
  font-size: 38px;
  color: #ce7f3f;
  line-height: 1;
}
.right-icon {
  width: 57px;
  height: 57px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-4/right.png');
}
.btn {
  margin-top: 22px;
  width: 303px;
  height: 93px;
  font-size: 34px;
  text-align: center;
  color: #b0824f;
  background-color: #fffeed;
  border-radius: 50px;
  box-shadow: 0 6px 6px 0 rgba(81, 81, 81, 0.2);
  &-finished {
    color: #584127;
    background-color: #7f7f76;
  }
}
</style>
