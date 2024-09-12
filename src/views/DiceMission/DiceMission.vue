<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="dice-mission flex h-screen">
      <div class="dice-mission-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            飞行里程碑
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <div class="task-list-container">
              <ul
                class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
              >
                <li
                  v-for="(task, taskIndex) in taskList"
                  :key="task.name"
                  :class="[`task-item${taskIndex + 1}`]"
                >
                  <ul>
                    <li
                      v-for="(reward, rewardIndex) in task.rewards"
                      :key="reward.name"
                      @click="
                        handleReward(task.name, taskIndex, reward, rewardIndex)
                      "
                      :class="[
                        'reward-item bg-contain bg-center bg-no-repeat',
                        `reward${rewardIndex + 1}`,
                        `${reward.status}`,
                        'animate__animated',
                        `${taskIndex === 6 || taskIndex === 7 ? 'animate__flipInX' : 'animate__slideInLeft'}`,
                      ]"
                    >
                      <div v-if="taskIndex < 6" class="reward-bubble-container">
                        <div
                          :id="reward.name"
                          class="reward-can-dynamic-bubble"
                        ></div>
                        <div
                          v-if="reward.status === 'wait'"
                          :class="[
                            'wait-container',
                            `${isCustomDice(reward) ? 'dice-custom-container' : 'dice-random-container'}`,
                          ]"
                        >
                          <div
                            @click="(event) => clickBubbleRewardWait(event)"
                            :class="[
                              'animate-reward-wait bg-contain bg-center bg-no-repeat',
                              `${isCustomDice(reward) ? 'dice-custom-wait' : 'dice-random-wait'}`,
                            ]"
                          ></div>
                          <span
                            :class="[
                              'condition-text',
                              task.name === 'online_time'
                                ? 'condition-text-online'
                                : 'condition-text-other',
                            ]"
                            >{{ reward.conditionText }}</span
                          >
                        </div>
                        <div
                          v-if="reward.status === 'can'"
                          class="can-container"
                        >
                          <div
                            :class="[
                              'reward-dice',
                              `${isCustomDice(reward) ? 'can-reward-dice-custom' : 'can-reward-dice-random'}`,
                            ]"
                          ></div>
                          <span
                            :class="[
                              'condition-text',
                              task.name === 'online_time'
                                ? 'condition-text-online'
                                : 'condition-text-other',
                            ]"
                            >{{ reward.conditionText }}</span
                          >
                        </div>
                        <div
                          v-if="reward.status === 'redeemed'"
                          :class="[
                            'redeemed-container',
                            `${isCustomDice(reward) ? 'dice-custom-container' : 'dice-random-container'}`,
                          ]"
                        >
                          <div
                            :class="[
                              'bg-contain bg-center bg-no-repeat',
                              `${reward.name}-redeemed-reward-bubble`,
                              `${isCustomDice(reward) ? 'dice-custom-redeemed' : 'dice-random-redeemed'}`,
                            ]"
                          ></div>
                          <span
                            :class="[
                              'condition-text',
                              task.name === 'online_time'
                                ? 'condition-text-online'
                                : 'condition-text-other',
                            ]"
                            >{{ reward.conditionText }}</span
                          >
                        </div>
                      </div>
                      <div v-else>
                        <div
                          :class="[
                            'reward-card-container bg-contain bg-center bg-no-repeat',
                            `${reward.name}`,
                            `${reward.name === 'activitycenter_dice_mission_11' && reward.status === 'can' ? 'rotate-20' : ''}`,
                            `${reward.name === 'activitycenter_dice_mission_12' && reward.status === 'can' ? 'rotate-50' : ''}`,
                          ]"
                        >
                          <div
                            v-if="reward.status === 'can'"
                            class="reward-card can"
                          >
                            <div class="reward-card-bg"></div>
                            <div class="light-border-card"></div>
                            <div class="light-border-reward"></div>
                            <div
                              class="reward bg-contain bg-center bg-no-repeat"
                            ></div>
                          </div>
                          <div
                            v-if="reward.status === 'wait'"
                            class="reward-card wait bg-contain bg-center bg-no-repeat"
                          ></div>
                          <div
                            v-if="reward.status === 'redeemed'"
                            class="reward-card redeemed bg-contain bg-center bg-no-repeat"
                          ></div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="task-line bg-contain bg-center bg-no-repeat"></div>
            </div>
            <div
              class="reward-token-online-time-container bg-contain bg-center"
            >
              <div class="token-count flex items-center justify-center">
                <span>
                  ({{ rewardTokenOnlineTime.currentCount }}/{{
                    rewardTokenOnlineTime.targetCount
                  }})
                </span>
              </div>
            </div>
            <div class="card-hook bg-contain bg-center bg-no-repeat"></div>
          </div>
        </Transition>
        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <div class="flex h-full flex-col">
              <p class="modal-text">
                恭喜你获得
                <span class="modal-text-blue"
                  >{{ rewardsText[curRewards.name as keyof RewardsName] }} *
                  {{ curRewards.count }}</span
                >：
              </p>
              <div class="flex flex-1 items-center justify-center">
                <img
                  class="reward-img"
                  :src="handleSrc(String(curRewards.name))"
                  alt="reward"
                />
              </div>
            </div>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData } from '@/utils/request'
import type { DesignConfig, Event, EventName } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/diceMission'
import ModalHelp from '@/views/DiceMap/components/ModalHelp.vue'
import gsap from 'gsap'
import { SpinePlayer } from '@esotericsoftware/spine-player'

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

const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const menuStore = useMenuStore()
const activityStore = useActivityStore()

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  random_dice: string
  custom_dice: string
}

const rewardsText: RewardsName = {
  random_dice: '随机骰子',
  custom_dice: '自定义骰子',
}

interface Task {
  name: string
  title: string
  rewards: Reward[]
}

interface Reward {
  name: string
  count: number
  rewardId?: string
  status: 'wait' | 'redeemed' | 'can' | string
  conditionText?: string
}

const EVENT_NAME = 'activitycenter_dice_mission' as EventName
// 活动数据
const activityData = computed(() => activityStore.activityData)
const curRewards: Ref<Rewards> = ref({
  name: 'random_dice',
  count: 0,
})

const rewardTokenOnlineTime = ref({
  currentCount: 0,
  targetCount: 60,
})

const TASK_LIST: Task[] = [
  {
    name: 'online_time',
    title: '累计在线时长',
    rewards: [
      {
        name: 'activitycenter_dice_mission_1',
        count: 1,
        status: 'wait',
        conditionText: '10',
      },
      {
        name: 'activitycenter_dice_mission_2',
        count: 1,
        status: 'wait',
        conditionText: '20',
      },
      {
        name: 'activitycenter_dice_mission_3',
        count: 1,
        status: 'wait',
        conditionText: '30',
      },
      {
        name: 'activitycenter_dice_mission_4',
        count: 1,
        status: 'wait',
        conditionText: '40',
      },
      {
        name: 'activitycenter_dice_mission_5', // 万能骰子
        count: 1,
        status: 'wait',
        conditionText: '60',
      },
    ],
  },
  {
    name: 'like_message_boat',
    title: '点赞1个纸船',
    rewards: [
      {
        name: 'activitycenter_dice_mission_6',
        count: 1,
        status: 'wait',
        conditionText: '点赞1个纸船',
      },
    ],
  },
  {
    name: 'collecting_candles',
    title: '收集1根蜡烛',
    rewards: [
      {
        name: 'activitycenter_dice_mission_7',
        count: 1,
        status: 'wait',
        conditionText: '收集1根蜡烛',
      },
    ],
  },
  {
    name: 'send_heart_wax_friend',
    title: '赠送1次心火',
    rewards: [
      {
        name: 'activitycenter_dice_mission_8',
        count: 1,
        status: 'wait',
        conditionText: '赠送1次心火',
      },
    ],
  },
  {
    name: 'send_heart_friends',
    title: '赠送1次爱心',
    rewards: [
      {
        name: 'activitycenter_dice_mission_9',
        count: 1,
        status: 'wait',
        conditionText: '赠送1次爱心',
      },
    ],
  },
  {
    name: 'finish_daily_quests',
    title: '完成全部每日任务',
    rewards: [
      {
        name: 'activitycenter_dice_mission_10', // 万能骰子
        count: 1,
        status: 'wait',
        conditionText: '完成全部每日任务',
      },
    ],
  },
  {
    name: 'use_candle',
    title: '使用20根蜡烛',
    rewards: [
      {
        name: 'activitycenter_dice_mission_11', // 万能骰子
        count: 1,
        status: 'wait',
      },
      {
        name: 'activitycenter_dice_mission_12', // 万能骰子
        count: 2,
        status: 'wait',
      },
    ],
  },
]
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((task) => {
    const activity =
      activityData.value.event_data.activitycenter_dice_mission.find(
        (_task) => _task.task_id === task.name,
      ) as Event
    if (task.name === 'online_time') {
      rewardTokenOnlineTime.value.currentCount = Math.floor(activity.value / 60)
    }
    const _task = {
      ...task,
      rewards: task.rewards.map((reward, rewardIndex) => {
        const resObject = { ...reward }
        resObject.status =
          activity.award[rewardIndex] === 1
            ? 'redeemed'
            : activity.award[rewardIndex] === 0 &&
                activity.value >= activity.stages[rewardIndex]
              ? 'can'
              : 'can'
        if (resObject.status === 'can') {
          void nextTick(() => {
            if (task.name === 'use_candle') {
              clickCardRewardAnimate(reward.name)
            } else {
              setTimeout(() => {
                spineAnimate(reward.name)
              }, 1000)
            }
          })
        }
        return resObject
      }),
    }
    return _task
  })
})

const isCustomDice = (reward: Reward): boolean => {
  return [
    'activitycenter_dice_mission_5',
    'activitycenter_dice_mission_10',
    'activitycenter_dice_mission_11',
    'activitycenter_dice_mission_12',
  ].includes(reward.name)
}

const sessionIsVisitedKey = 'isVisitedDiceMission'
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

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.open()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))
// 设置红点
function setRedDot(): void {
  const taskList = activityData.value.event_data.activitycenter_dice_mission
  const hasUnclaimedReward = taskList.some((task) => {
    let res

    // 点击领取奖品更新红点
    if (currentTask.taskName) {
      res =
        task.value >= task.stages[currentTask.rewardIndex] &&
        task.award[currentTask.rewardIndex] === 0
    } else {
      // 初始化时更新红点
      const arard0Index = task.award.findIndex((award) => award === 0)
      if (arard0Index === -1) {
        return false
      } else {
        const stages0Value = task.stages[arard0Index]
        if (task.value >= stages0Value) {
          return true
        }
      }
    }

    return res
  })

  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data: any = res.data

      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_dice_mission: data.event_data[EVENT_NAME].sort(
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

const currentTask = reactive<{
  taskName: string
  taskIndex: number
  reward: Reward
  rewardIndex: number
}>({
  taskName: '',
  taskIndex: 0,
  reward: {} as unknown as Reward,
  rewardIndex: 0,
})
function updateActivityDataRewardStatusNoRequest(): void {
  const newActivityData = {
    ...activityData.value,
    event_data: {
      activitycenter_dice_mission:
        activityData.value.event_data.activitycenter_dice_mission.map(
          (task) => {
            const res = { ...task }
            const taskName = currentTask.taskName
            if (task.task_id === taskName) {
              if (res.award.length === 1) {
                res.award = [1]
              } else {
                res.award[currentTask.rewardIndex] = 1
              }
            }
            return res
          },
        ),
    },
  }
  activityStore.updateActivityData(newActivityData)
}

// 奖品wait状态点击果冻效果
const clickBubbleRewardWait = (event: MouseEvent): void => {
  const dom = event.target
  gsap
    .timeline()
    .to(dom, { scaleY: 0.8, duration: 0.2, ease: 'power1.in' }) // 垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 垂直拉伸
    .to(dom, { scaleY: 0.9, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1, duration: 0.2, ease: 'power1.out' }) // 恢复原样
}

interface SpineAnimateData {
  domId: string
  spine: SpinePlayer
}
const spineAnimateDataList: SpineAnimateData[] = []
const spineAnimate = (domId: string): void => {
  if (spineAnimateDataList.find((e) => e.domId === domId)) {
    return
  } else {
    spineAnimateDataList.push({
      domId,
      spine: null as unknown as SpinePlayer,
    })
  }
  console.log(1, domId)
  const dom = document.querySelector(`#${domId}`)
  if (dom) {
    const spine = new SpinePlayer(
      document.querySelector(`#${domId}`) as HTMLElement,
      {
        jsonUrl: './spine/bubble/bubble_glow.json',
        atlasUrl: './spine/bubble/bubble_glow.atlas',
        animation: 'loop',
        preserveDrawingBuffer: false,
        premultipliedAlpha: true,
        backgroundColor: '#00000000',
        showControls: false,
        alpha: true,
        viewport: {
          padLeft: '0%',
          padRight: '0%',
          padTop: '0%',
          padBottom: '0%',
        },
        success: (player) => {
          const spineItem = spineAnimateDataList.find(
            (e: SpineAnimateData) => e.domId === domId,
          )
          spineItem && (spineItem.spine = spine)
        },
      },
    )
  }
}

const bubbleBurst = (domId: string): void => {
  const spine = spineAnimateDataList.find((e) => e.domId === domId)
    ?.spine as SpinePlayer
  spine.setAnimation('get', false)
  const redeemedRewardBubbleDom = document.querySelector(
    `.${domId}-redeemed-reward-bubble`,
  )
  gsap
    .timeline()
    .to(redeemedRewardBubbleDom, {
      scaleY: 0.8,
      duration: 0.2,
      ease: 'power1.in',
      opacity: 0.3,
    }) // 垂直压挤
    .to(redeemedRewardBubbleDom, {
      scaleY: 1.1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0.7,
    }) // 垂直拉伸
    .to(redeemedRewardBubbleDom, {
      scaleY: 1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 1,
    }) // 再次垂直压挤
}
const pressInverval = 200
const pressChangeStatusInverval = pressInverval + 100
const clickCardRewardAnimate = (domId: string): void => {
  const dom = document.querySelector(`.${domId}`) as HTMLElement
  const mousedownFun = (): void => {
    console.log('mousedown')

    gsap.to(dom, {
      scale: 0.96,
      duration: pressInverval / 1000,
      ease: 'power1.in',
    })
  }
  const mouseUpFun = (): void => {
    console.log('mouseup')
    setTimeout(() => {
      gsap.to(dom, {
        scale: 1,
        duration: pressInverval / 1000,
        ease: 'power1.out',
      })
      // dom.classList.remove('fade')
      dom.removeEventListener('mousedown', mousedownFun as EventListener)
      dom.removeEventListener('mouseup', mouseUpFun)
    }, pressChangeStatusInverval)
  }
  // 按下时的效果
  dom.addEventListener('mousedown', mousedownFun)

  // 松开时的效果
  dom.addEventListener('mouseup', mouseUpFun)

  // 在鼠标移出按钮时，确保恢复正常状态
  // dom?.addEventListener('mouseleave', () => {
  //   setTimeout(() => {
  //     // gsap.to(dom, { scale: 1, duration: 0.2, ease: 'power1.out' })
  //   }, 1300)
  // })
}

// 领奖
function handleReward(
  taskName: string,
  taskIndex: number,
  reward: Reward,
  rewardIndex: number,
): Promise<void> {
  currentTask.taskName = taskName
  currentTask.taskIndex = taskIndex
  currentTask.reward = reward
  currentTask.rewardIndex = rewardIndex
  console.log('currentTask', currentTask)

  if (reward.status === 'can') {
    if (taskName === 'use_candle') {
      setTimeout(() => {
        updateActivityDataRewardStatusNoRequest()
      }, pressInverval - 100)
    } else {
      updateActivityDataRewardStatusNoRequest()
      void nextTick(() => {
        bubbleBurst(reward.name)
      })
    }
  }
  return Promise.resolve()
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
.dice-mission {
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
    background-image: url('@/assets/images/dice-mission/bg.jpg');
    overflow: hidden;
  }
}
.title {
  position: absolute;
  top: 50px;
  left: 119px;
  width: 523px;
  height: 242px;
  background-image: url('@/assets/images/dice-mission/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: 12px;
  left: 446px;
  // border: 1px solid red;
}

.task-line {
  width: 1686px;
  height: 588px;
  position: absolute;
  top: 239px;
  left: 170px;
  background-image: url('@/assets/images/dice-mission/task-line.png');
}

.reward-item {
  width: 220px;
  // height: 270px;
  position: absolute;
  z-index: 10;
  // border: 1px solid gray;
}

.reward-can-dynamic-bubble {
  width: 296px;
  height: 296px;
  position: absolute;
  top: -66px;
  left: -70px;
}

$reward-bubble-wait-width: 207px;
$reward-bubble-wait-height: 207px;
.reward-bubble-container {
  width: 266px;
  height: 266px;
  position: relative;
  // border: 1px solid pink;
  .condition-text-online {
    width: 83px;
    height: 38px;
    display: inline-block;
    line-height: 38px;
    border-radius: 20px;
    font-size: 30px;
    text-align: center;
  }
  .condition-text-other {
    color: #ffffff;
    font-size: 28px;
    left: 0;
  }
  .wait-container {
    .condition-text {
      bottom: -25px;
      &.condition-text-online {
        background-color: rgb(256, 256, 256, 0.3);
        color: #ffffff;
        text-shadow:
          -1px -1px 0px #8486f9,
          1px -1px 0px #8486f9,
          -1px 1px 0px #8486f9,
          1px 1px 0px #8486f9; /* 轮廓颜色 */
      }
      &.condition-text-other {
        color: #ffffff;
      }
    }
  }
  .wait-container,
  .redeemed-container {
    width: $reward-bubble-wait-width;
    height: $reward-bubble-wait-height;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    .condition-text {
      position: absolute;
      display: inline-block;
    }
    &.dice-custom-container {
      top: -12px;
      left: -22px;
      .condition-text {
        bottom: -15px;
      }
    }
    &.dice-random-container {
      top: -22px;
      left: -22px;
      .condition-text {
        bottom: -25px;
      }
    }
    div {
      width: $reward-bubble-wait-width;
      height: $reward-bubble-wait-height;
      position: absolute;
      &.dice-custom-wait {
        background-image: url('@/assets/images/dice-mission/dice-cusdom-bubble-wait.png');
      }
      &.dice-random-wait {
        background-image: url('@/assets/images/dice-mission/dice-random-bubble-wait.png');
      }
      &.dice-custom-redeemed {
        background-image: url('@/assets/images/dice-mission/dice-cusdom-bubble-redeemed.png');
      }
      &.dice-random-redeemed {
        background-image: url('@/assets/images/dice-mission/dice-random-bubble-redeemed.png');
      }
    }
  }
  // can领奖动态泡泡
  // .reward-can-dynamic-bubble {
  //   width: 296px;
  //   height: 296px;
  //   position: absolute;
  //   top: -66px;
  //   left: -70px;
  // }
  .can-container {
    width: 187px;
    height: 187px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .reward-dice {
      width: 226px;
      height: 226px;
      position: absolute;
      background-position: center;
      background-repeat: no-repeat;
      &.can-reward-dice-custom {
        top: -36px;
        left: -32px;
        background-size: 76px 86px;
        background-image: url('@/assets/images/dice-mission/reward-custom_dice.png');
      }
      &.can-reward-dice-random {
        top: -36px;
        left: -32px;
        background-size: 76px 86px;
        background-image: url('@/assets/images/dice-mission/reward-random_dice.png');
      }
      // border: 1px solid pink;
    }
    .condition-text {
      position: absolute;
      bottom: -22px;
      left: 40px;
      &.condition-text-online {
        color: #ffeea6;
        background-color: rgba(211, 211, 211, 0.5);
      }
      &.condition-text-other {
      }
    }
  }
  .redeemed-container {
    .condition-text {
      bottom: -15px;
      &.condition-text-online {
        color: rgba(132, 134, 249, 0.5);
        text-shadow:
          -1px -1px 0px rgba(0, 0, 0, 0),
          1px -1px 0px rgba(0, 0, 0, 0),
          -1px 1px 0px rgba(0, 0, 0, 0.1),
          1px 1px 0px rgba(0, 0, 0, 0.1); /* 轮廓颜色 */
        background-color: rgba(211, 211, 211, 0.5);
      }
      &.condition-text-other {
        color: #b2b2b2;
      }
    }
  }
}

.task-item1 {
  .reward1 {
    top: 501px;
    left: 109px;
  }
  .reward2 {
    top: 413px;
    left: 329px;
  }
  .reward3 {
    top: 392px;
    left: 561px;
  }
  .reward4 {
    top: 272px;
    left: 752px;
  }
  .reward5 {
    top: 97px;
    left: 1036px;
  }
}
.task-item2 {
  .reward1 {
    top: 635px;
    left: 646px;
    .condition-text {
      left: 26px !important;
    }
    &.can {
      .condition-text {
        left: 4px !important;
      }
    }
  }
}
.task-item3 {
  .reward1 {
    top: 468px;
    left: 889px;
    .condition-text {
      left: 26px !important;
    }
    &.can {
      .condition-text {
        left: 4px !important;
      }
    }
  }
}
.task-item4 {
  .reward1 {
    top: 342px;
    left: 1175px;
    .condition-text {
      left: 26px !important;
    }
    &.can {
      .condition-text {
        left: 4px !important;
      }
    }
  }
}
.task-item5 {
  .reward1 {
    top: 115px;
    left: 1406px;
    .condition-text {
      left: 26px !important;
    }
    &.can {
      .condition-text {
        left: 4px !important;
      }
    }
  }
}
.task-item6 {
  .reward1 {
    top: 106px;
    left: 1734px;
    .condition-text {
      width: 120px;
      line-height: 30px;
      top: 180px;
      left: 50px !important;
    }
    &.can {
      .condition-text {
        width: 120px;
        line-height: 30px;
        top: 166px;
        left: 27px !important;
      }
    }
  }
}
.reward-token-online-time-container {
  position: absolute;
  top: 825px;
  left: 68px;
  width: 321px;
  height: 105px;
  background-image: url('@/assets/images/dice-mission/bg-reward-token-online-time.png');
  .token-count {
    width: 100%;
    position: absolute;
    bottom: 4px;
    overflow: hidden;
    padding-right: 20px;
    span {
      font-family: SourceHanSansCN-Regular;
      font-size: 40px;
      color: #8bf8ff;
    }
  }
}
:deep(.van-rolling-text) {
  font-family: SourceHanSansCN-Regular;
  font-size: 46px;
  color: #fff281;
}

.reward-img {
  width: 150px;
}

$scale: 3.6;
.animate-reward {
  position: relative;
  .animate-reward-wait {
    width: 219px;
    height: 179px;
    background-image: url('@/assets/images/dice-mission/dice-cusdom-bubble-wait.png');
  }
  .animate-reward-can {
    width: 219px;
    height: 179px;
    background-repeat: no-repeat;
    transform-origin: top left;
    // border: 1px solid red;
  }
}
.task-item7 {
  .reward1 {
    width: 441px;
    height: 348px;
    top: 795px;
    left: 1456px;
    z-index: 20;
  }
  .reward2 {
    width: 476px;
    height: 315px;
    top: 532px;
    left: 1520px;
  }
}
$light-border-width: 10px;
$card-20-init-rotate: 8deg;
$card-50-init-rotate: -2deg;
$card-active-rotate: 2deg;
$card1-width: 400px;
$card1-height: 240px;
$card2-width: 470px;
$card2-height: 280px;
.reward-card-container {
  position: relative;
  &.activitycenter_dice_mission_11 {
    width: $card1-width + 10;
    height: $card1-height + 10;
    position: relative;
    left: 40px;
    transform-origin: left top;
    border-radius: 20px;
    // border: 1px solid red;
    transform: rotate($card-20-init-rotate);
    .reward-card {
      width: 100%;
      height: 100%;
      &.can {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        .reward-card-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          background-size: ($card1-width - 10) ($card1-height - 10);
          background-repeat: no-repeat;
          background-position: center;
          background-image: url('@/assets/images/dice-mission/task7-reward1-can.png');
          // border: 1px solid pink;
          border-radius: 20px;
          z-index: 20;
        }
        .light-border-card {
          width: 100%;
          height: 100%;
          // border: 1px solid red;
          position: absolute;
          top: 0px;
          left: 0px;
          background-size: ($card1-width + 60) ($card1-height + 50);
          background-position: center;
          background-repeat: no-repeat;
          background-image: url('@/assets/images/dice-mission/light-border-card.png');
          opacity: 0;
          opacity: 1;
          border-radius: 20px;
          animation: fade 2s infinite;
          z-index: 10;
        }
        .light-border-reward {
          width: 144px;
          height: 144px;
          position: absolute;
          top: 24px;
          left: 130px;
          background-image: url('@/assets/images/dice-mission/light-border-reward.png');
          background-size: cover;
          z-index: 30;
          animation: rotateRewardBorder 5s linear infinite;
        }
        .reward {
          width: 100px;
          height: 100px;
          position: absolute;
          top: 40px;
          left: 154px;
          background-image: url('@/assets/images/dice-mission/reward-custom_dice.png');
          z-index: 40;
          animation: cardRewarddiceScale 2s linear infinite alternate;
          // border: 1px solid red;
        }
      }
      &.wait {
        width: 100%;
        height: 100%;
        background-size: ($card1-width - 10) ($card1-height - 10);
        background-image: url('@/assets/images/dice-mission/task7-reward1-wait.png');
      }
      &.redeemed {
        width: 100%;
        height: 100%;
        background-size: ($card1-width - 10) ($card1-height - 10);
        background-image: url('@/assets/images/dice-mission/task7-reward1-redeemed.png');
      }
    }
  }
  &.activitycenter_dice_mission_12 {
    width: $card2-width + 10;
    height: $card2-height + 10;
    position: relative;
    transform-origin: left bottom;
    border-radius: 20px;
    // border: 1px solid red;
    transform: rotate($card-50-init-rotate);
    .reward-card {
      width: 100%;
      height: 100%;
      &.can {
        position: absolute;
        top: 10px;
        left: 0px;
        width: 100%;
        height: 100%;
        .reward-card-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          top: -10px;
          left: 0px;
          background-size: ($card2-width - 10) ($card2-height - 10);
          background-position: center;
          background-repeat: no-repeat;
          background-image: url('@/assets/images/dice-mission/task7-reward2-can.png');
          // border: 1px solid pink;
          border-radius: 20px;
          z-index: 20;
        }
        .light-border-card {
          width: 100%;
          height: 100%;
          // border: 1px solid red;
          position: absolute;
          top: -9px;
          left: -0px;
          background-size: ($card2-width + 70) ($card2-height + 50);
          background-position: center;
          background-repeat: no-repeat;
          background-image: url('@/assets/images/dice-mission/light-border-card.png');
          opacity: 0;
          // opacity: 1;
          border-radius: 20px;
          animation: fade 2s infinite;
          z-index: 10;
        }
        .light-border-reward {
          width: 152px;
          height: 152px;
          position: absolute;
          top: 22px;
          left: 154px;
          background-image: url('@/assets/images/dice-mission/light-border-reward.png');
          background-size: cover;
          z-index: 30;
          animation: rotateRewardBorder 5s linear infinite;
        }
        .reward {
          width: 100px;
          height: 100px;
          position: absolute;
          top: 40px;
          left: 182px;
          background-image: url('@/assets/images/dice-mission/reward-custom_dice.png');
          z-index: 40;
          animation: cardRewarddiceScale 2s linear infinite alternate;
          // border: 1px solid red;
        }
      }
      &.wait {
        width: 100%;
        height: 100%;
        background-size: ($card2-width - 10) ($card2-height - 10);
        background-image: url('@/assets/images/dice-mission/task7-reward2-wait.png');
      }
      &.redeemed {
        width: 100%;
        height: 100%;
        background-size: ($card2-width - 10) ($card2-height - 10);
        background-image: url('@/assets/images/dice-mission/task7-reward2-redeemed.png');
      }
    }
  }
}
.card-hook {
  width: 45px;
  height: 75px;
  position: absolute;
  top: 778px;
  left: 1543px;
  background-image: url('@/assets/images/dice-mission/card-hook.png');
  z-index: 20;
}
.lottie-list {
  display: flex;
}
.lottie {
  width: 400px;
  height: 400px;
  border: 1px solid red;
}
@keyframes cardRewarddiceScale {
  0% {
    scale: 0.9;
  }
  100% {
    scale: 1;
  }
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.rotate-20 {
  animation: rotate-20 2s infinite;
}
@keyframes rotate-20 {
  30% {
    transform: rotate($card-20-init-rotate);
  }
  40% {
    transform: rotate($card-20-init-rotate + $card-active-rotate);
  }
  50% {
    transform: rotate($card-20-init-rotate);
  }
  60% {
    transform: rotate($card-20-init-rotate + $card-active-rotate);
  }
  70% {
    transform: rotate($card-20-init-rotate);
  }
  100% {
    transform: rotate($card-20-init-rotate);
  }
}
.rotate-50 {
  animation: rotate-50 2s infinite;
}
@keyframes rotate-50 {
  30% {
    transform: rotate($card-50-init-rotate);
  }
  40% {
    transform: rotate($card-50-init-rotate + $card-active-rotate);
  }
  50% {
    transform: rotate($card-50-init-rotate);
  }
  60% {
    transform: rotate($card-50-init-rotate + $card-active-rotate);
  }
  70% {
    transform: rotate($card-50-init-rotate);
  }
  100% {
    transform: rotate($card-50-init-rotate);
  }
}
@keyframes rotateRewardBorder {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
#lottie {
  width: 300px; /* 根据需要调整尺寸 */
  height: 300px;
  border: 1px solid pink;
}
</style>
