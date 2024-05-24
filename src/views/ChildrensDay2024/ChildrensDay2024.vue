<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="childrens-day flex h-screen">
      <div class="childrens-day-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              剪刀石头布！准备好了吗？
            </h1>
            <div class="date flex items-center align-middle">
              <div class="date-text">6.1-6.7</div>
              <div
                class="date-help bg-contain bg-center bg-no-repeat"
                @click="handleHelp"
              ></div>
            </div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div class="relative h-full w-full overflow-hidden">
            <!-- 动作区域 -->
            <div ref="actionBox" class="action-box">
              <!-- 用户动作 -->
              <div ref="actionUser" class="action-user flex items-center">
                <div
                  ref="actionUserTitle"
                  class="action-user-title indent-[-9999px]"
                >
                  我选择
                </div>
                <!-- 动作选项 -->
                <ul class="action-user-list clear-left">
                  <li
                    ref="actionRock"
                    class="action-user-item action-user-item--rock flex items-center justify-center"
                    @click="handleAction('rock')"
                  >
                    <img
                      class="action-user-img action-user-img--rock"
                      src="@/assets/images/childrens-day-2024/action-option-rock.png"
                      alt="石头"
                    />
                    <img
                      class="action-user-indicator"
                      src="@/assets/images/childrens-day-2024/action-indicator-rock.png"
                      alt="石头"
                    />
                  </li>
                  <li
                    ref="actionScissors"
                    class="action-user-item action-user-item--scissors flex items-center justify-center"
                    @click="handleAction('scissors')"
                  >
                    <img
                      class="action-user-img action-user-img--scissors"
                      src="@/assets/images/childrens-day-2024/action-option-scissors.png"
                      alt="剪刀"
                    />
                    <img
                      class="action-user-indicator"
                      src="@/assets/images/childrens-day-2024/action-indicator-scissors.png"
                      alt="剪刀"
                    />
                  </li>
                  <li
                    ref="actionPaper"
                    class="action-user-item action-user-item--paper flex items-center justify-center"
                    @click="handleAction('paper')"
                  >
                    <img
                      class="action-user-img action-user-img--paper"
                      src="@/assets/images/childrens-day-2024/action-option-paper.png"
                      alt="布"
                    />
                    <img
                      class="action-user-indicator"
                      src="@/assets/images/childrens-day-2024/action-indicator-paper.png"
                      alt="布"
                    />
                  </li>
                </ul>
              </div>
              <!-- 小光动作 -->
              <div class="action-sky flex items-center">
                <div
                  ref="actionSky"
                  class="action-sky-item flex items-center justify-center"
                >
                  <img
                    class="action-sky-img"
                    src="@/assets/images/childrens-day-2024/action-option-sky.png"
                    alt="？"
                  />
                  <img
                    class="action-sky-indicator"
                    src="@/assets/images/childrens-day-2024/action-indicator-paper.png"
                    alt="布"
                  />
                </div>
              </div>
              <!-- 比分 -->
              <div
                ref="actionScore"
                class="action-score flex items-center justify-center"
              >
                {{ score }}
              </div>
            </div>
            <!-- 奖励 -->
            <img
              ref="taskImg"
              class="task"
              src="@/assets/images/childrens-day-2024/task1-can.png"
              alt="奖励"
              @click="handleReward('daily')"
            />
            <img
              ref="taskImgSettlement"
              class="task"
              src="@/assets/images/childrens-day-2024/task-heart1-can.png"
              alt="奖励"
              @click="handleReward('settlement')"
            />
            <!-- 人物 -->
            <!-- 初始状态 -->
            <div ref="skyInit" class="sky sky-init"></div>
            <!-- 小光赢了 -->
            <div ref="skyWin" class="sky sky-win"></div>
            <!-- 平局 -->
            <div ref="skyTie" class="sky sky-tie"></div>
            <!-- 小光输了 -->
            <div ref="skyLose" class="sky sky-lose"></div>
            <!-- 小光结算 -->
            <div ref="skySettlement" class="sky sky-settlement"></div>
            <!-- 文本框 -->
            <div ref="tips" class="tips">
              <div class="tips-wrapper">
                <div class="tips-box">
                  <p>
                    {{ tipsText }}
                  </p>
                </div>
              </div>
              <div class="text-light"></div>
            </div>
          </div>
        </Transition>
        <!-- 活动说明 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年6月1日~2024年6月7日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，每日可前往活动页面与小光进行猜拳比赛，<span
                class="text-[#ffcb4d]"
                >胜利或平局</span
              >可获得一份奖励，同时累计1分；
            </p>
            <p class="modal-text">
              2、<span class="text-[#ffcb4d]">活动最后一天（6月7日）时</span
              >与小光进行猜拳比赛后，根据累计的比分可获得一份额外的神秘奖励。记得参加哦~
            </p>
          </template>
        </activity-modal>
        <!-- 奖励弹框 -->
        <activity-modal ref="modalReward" @close="handleRewardClose">
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
                class="modal-reward"
                :src="handleSrc(`reward-${String(curRewards.name)}.png`)"
                alt="reward"
              />
            </div>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {
  getPlayerMissionData,
  setPlayerTask,
  claimMissionReward,
} from '@/utils/request'
import { type Event, type DesignConfig, type ActivityTimeItem } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useBaseStore } from '@/stores/base'
import { useActivityStore } from '@/stores/activity'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  shrink: string
  tiny: string
  grow: string
  huge: string
  crab_rock_trick: string
  repellant_krill: string
  currency_trick: string
  heart: string
}

const rewardsText: RewardsName = {
  shrink: '返老还童',
  tiny: '小不点',
  grow: '长大成人',
  huge: '大只佬',
  crab_rock_trick: '螃蟹恶作剧',
  repellant_krill: '冥龙克星',
  currency_trick: '糖果恶作剧',
  heart: '爱心',
}

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

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const actionBox = ref<HTMLDivElement | null>(null)
const actionScore = ref<HTMLDivElement | null>(null)
const taskImg = ref<HTMLImageElement | null>(null)
const taskImgSettlement = ref<HTMLImageElement | null>(null)
const tips = ref<HTMLDivElement | null>(null)
const skyInit = ref<HTMLDivElement | null>(null)
const skyWin = ref<HTMLDivElement | null>(null)
const skyTie = ref<HTMLDivElement | null>(null)
const skyLose = ref<HTMLDivElement | null>(null)
const skySettlement = ref<HTMLDivElement | null>(null)
const actionUserTitle = ref<HTMLDivElement | null>(null)
const actionRock = ref<HTMLLIElement | null>(null)
const actionScissors = ref<HTMLLIElement | null>(null)
const actionPaper = ref<HTMLLIElement | null>(null)
const actionSky = ref<HTMLDivElement | null>(null)

const baseStore = useBaseStore()
const menuStore = useMenuStore()
const activityStore = useActivityStore()
// 活动数据
const activityData = computed(
  () => activityStore.eventData.activity_childrens_day_2024,
)
// 活动时间
const activityTime = computed(
  () => activityStore.activityTime.activity_childrens_day_2024,
)
// 当前时间
const currentTime = computed(() => baseStore.baseInfo.currentTime)
// 当前是第几天
let currentDay = 1

const curRewards: Ref<Rewards> = ref({
  name: 'shrink',
  count: 1,
})

const ALL_TASK_LIST = [
  {
    name: 'activity_childrens_day_2024_qm1',
  },
  {
    name: 'activity_childrens_day_2024_qm2',
  },
  {
    name: 'activity_childrens_day_2024_qm3',
  },
  {
    name: 'activity_childrens_day_2024_qm4',
  },
  {
    name: 'activity_childrens_day_2024_qm5',
  },
  {
    name: 'activity_childrens_day_2024_qm6',
  },
  {
    name: 'activity_childrens_day_2024_qm7',
  },
  {
    name: 'activity_childrens_day_2024_qm_settlement',
  },
]

const taskOrderMap = new Map(
  ALL_TASK_LIST.map((task, index) => [task.name, index]),
)

// 提示文字
const tipsTextMap: Record<string, string> = {
  init: '平局或获胜即可获得小礼物，每天只有一次机会，快来挑战吧！',
  win: '嘿嘿，今天是我赢啦~明天记得再来挑战哦，我还有很多礼物呢！',
  tie: '哼！今天居然是平局！明天我一定能赢！要记得来噢！',
  lose: '太棒啦！领取今天的幸运礼物吧',
}
// 结算提示文字
const finalTipsTextMap: Record<string, string> = {
  win: '嘻嘻我赢咯~这是给你准备的小礼物，下次可要加油呀！',
  tie: '哼~你还挺厉害的嘛，这是给你的礼物，下次我们再来比试！',
  lose: '哇，你好厉害呀~快来领取大奖吧！',
}

// 0：未选择，1：剪刀，2：石头，3：布
// 动作值
const actionValueMap: Record<string, number> = {
  scissors: 1,
  rock: 2,
  paper: 3,
}
// 动作名称
const valueActionMap: Record<string, string> = {
  1: 'scissors',
  2: 'rock',
  3: 'paper',
}

// 小光的选择
let skyList: number[] = []
// 今日是否已完成
let isTodayPlayed = false
// 今日是否已领奖
let isTodayRedeemed = false
// 是否进入结算状态
let isInSettlement = false
// 结算是否已领奖
let isSettlementRedeemed = false
// 结算等级
let settlementLevel = 1
// 比分（用户:小光）
const score = ref('')
// 比赛结果（小光：win、tie、lose）
let skyResult = ''
// 提示文字（小光说）
const tipsText = ref(tipsTextMap.init)
let hasFetched = false

const isVisited = Session.get('isVisitedChildrensDay2024')
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
    // 验证活动时间以及获取当前天
    if (!hasFetched) {
      hasFetched = true
      checkActivityTimeAndDay(activityTime.value, currentTime.value)
    }
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedChildrensDay2024', true)
})

watch(
  [() => activityTime.value, () => currentTime.value],
  ([newActivityTime, newCurrentTime]) => {
    if (newActivityTime && newCurrentTime) {
      hasFetched = true
      checkActivityTimeAndDay(activityTime.value, currentTime.value)
    }
  },
)

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/childrens-day-2024/${name}`,
    import.meta.url,
  ).href

  return imgSrc
}

// 验证活动时间以及获取当前天
function checkActivityTimeAndDay(
  activityTime: ActivityTimeItem,
  currentTime: number,
): void {
  // 是否已获取活动时间
  if (!activityTime) {
    return
  }
  const { startTime, endTime } = activityTime
  const startDate = dayjs.unix(startTime)
  const endDate = dayjs.unix(endTime)
  const currentDate = dayjs.unix(currentTime)

  // 检查当前时间是否在活动时间段内
  if (currentDate.isAfter(endDate) || currentDate.isBefore(startDate)) {
    showToast('活动不在有效期内！')
    return
  }

  // 计算当前是活动的第几天
  const daysPassed = currentDate.diff(startDate, 'day')
  currentDay = daysPassed + 1 // 加1因为起始是第一天
  // 获取活动数据
  getActivityData()
  // 页面动画
  // handleAnimation(activityData.value)
}

// 设置比分
function setScore(skyValue: number, userValue: number): void {
  if (skyValue === 1) {
    // 剪刀
    if (userValue === 1) {
      skyResult = 'tie'
      score.value = '1:1'
    } else if (userValue === 2) {
      skyResult = 'lose'
      score.value = '1:0'
    } else if (userValue === 3) {
      skyResult = 'win'
      score.value = '0:1'
    }
  } else if (skyValue === 2) {
    // 石头
    if (userValue === 1) {
      skyResult = 'win'
      score.value = '0:1'
    } else if (userValue === 2) {
      skyResult = 'tie'
      score.value = '1:1'
    } else if (userValue === 3) {
      skyResult = 'lose'
      score.value = '1:0'
    }
  } else if (skyValue === 3) {
    // 布
    if (userValue === 1) {
      skyResult = 'lose'
      score.value = '1:0'
    } else if (userValue === 2) {
      skyResult = 'win'
      score.value = '0:1'
    } else if (userValue === 3) {
      skyResult = 'tie'
      score.value = '1:1'
    }
  }
}

// 用户动作选择
function handleAction(action: string, auto: boolean = false): void {
  const { startTime, endTime } = activityTime.value
  const startDate = dayjs.unix(startTime)
  const endDate = dayjs.unix(endTime)
  const systemCurrentDate = dayjs()
  // 重新获取当前时间，校验活动时间
  // 注意此处只是避免活动过期还停留在页面这种少数情况，不再获取服务器时间进行校验
  if (
    systemCurrentDate.isAfter(endDate) ||
    systemCurrentDate.isBefore(startDate)
  ) {
    showToast('活动不在有效期内！')
    return
  }

  if ((!isTodayPlayed && !auto) || (isTodayPlayed && auto)) {
    isTodayPlayed = true
    console.log('action: ', action)
    if (
      actionRock.value &&
      actionScissors.value &&
      actionPaper.value &&
      actionSky.value
    ) {
      // 小光和用户动作及值
      const skyValue = skyList[currentDay - 1]
      const skyAction = valueActionMap[skyValue]
      const userValue = actionValueMap[action]

      // 设置比分
      setScore(skyValue, userValue)

      // 接口：设置玩家选择
      if (!auto) {
        handleSetPlayerTask(
          `activity_childrens_day_2024_qm${currentDay}`,
          userValue,
        )
      }

      // 选择动作移动，其他动作淡出
      actionRock.value.classList.add('fade-out')
      actionScissors.value.classList.add('fade-out')
      actionPaper.value.classList.add('fade-out')
      if (action === 'rock') {
        actionRock.value.classList.add('moving-rock')
      } else if (action === 'scissors') {
        actionScissors.value.classList.add('moving-scissors')
      } else if (action === 'paper') {
        actionPaper.value.classList.add('moving-paper')
      }

      // 小光动作
      // 小光选择旋转、出现结果
      actionSky.value.classList.add('moving-sky')
      // 动画时长 1s，0.5s 时替换图片
      setTimeout(() => {
        if (actionSky.value) {
          const images = actionSky.value.getElementsByTagName('img')
          if (images.length > 0) {
            images[0].src = handleSrc(`action-option-${skyAction}.png`)
            images[1].src = handleSrc(`action-indicator-${skyAction}.png`)
            images[1].classList.add('fade-in')
          }
        }
      }, 500)
      // 第一段动画结束后，整体左移，比分出现
      actionRock.value.addEventListener(
        'animationend',
        () => {
          if (actionUserTitle.value && actionBox.value && actionScore.value) {
            // 动作区左移
            actionBox.value.classList.add('moving-box')
            // "我选择"淡出
            actionUserTitle.value.classList.add('fade-out')
            // 比分淡入
            actionScore.value.classList.add('fade-in')
          }
          if (
            skyInit.value &&
            skyWin.value &&
            skyLose.value &&
            skyTie.value &&
            taskImg.value &&
            tips.value
          ) {
            // 人物/小光
            skyInit.value.classList.add('fade-out')
            if (skyResult === 'win') {
              skyWin.value.classList.add('fade-in-slow')
            } else if (skyResult === 'lose') {
              skyLose.value.classList.add('fade-in-slow')
            } else if (skyResult === 'tie') {
              skyTie.value.classList.add('fade-in-slow')
            }
            // 奖励/任务，平局或者小光输了时展示
            if (skyResult === 'tie' || skyResult === 'lose') {
              if (isTodayRedeemed) {
                taskImg.value.src = handleSrc(`task${currentDay}-redeemed.png`)
              } else {
                taskImg.value.src = handleSrc(`task${currentDay}-can.png`)
              }
              taskImg.value.classList.add('fade-in-slow')
            }
            // 提示文字
            tips.value.classList.add('slide-in')
            tipsText.value = tipsTextMap[skyResult]
          }
        },
        { once: true },
      )
    }
  }
}

// 进入结算
function goSettlement(activityData: Event[]): void {
  // 计算总比分
  let userScore = 0
  let skyScore = 0
  for (let i = 0; i < 7; i++) {
    const task = activityData[i]
    if (task.value > 0 && task.score) {
      if (task.score === 'win') {
        userScore += 1
      } else if (task.score === 'lose') {
        skyScore += 1
      } else if (task.score === 'draw') {
        userScore += 1
        skyScore += 1
      }
    }
  }
  score.value = `${userScore}:${skyScore}`
  // 提示语
  if (userScore <= 2) {
    tipsText.value = finalTipsTextMap.win
    settlementLevel = 1
  } else if (userScore >= 3 && userScore <= 4) {
    tipsText.value = finalTipsTextMap.tie
    settlementLevel = 2
  } else if (userScore >= 5 && userScore <= 7) {
    tipsText.value = finalTipsTextMap.lose
    settlementLevel = 3
  }
  // 动作
  if (
    actionRock.value &&
    actionScissors.value &&
    actionPaper.value &&
    actionSky.value &&
    actionBox.value &&
    actionUserTitle.value &&
    actionScore.value
  ) {
    actionRock.value.classList.add('hidden')
    actionScissors.value.classList.add('hidden')
    actionPaper.value.classList.add('settlement')
    actionSky.value.classList.add('settlement')
    const images = actionSky.value.getElementsByTagName('img')
    if (images.length > 0) {
      images[0].src = handleSrc('action-option-rock.png')
      images[1].src = handleSrc('action-indicator-rock.png')
      images[1].classList.add('fade-in')
    }
    actionBox.value.classList.add('settlement')
    actionUserTitle.value.classList.add('hidden')
    actionScore.value.classList.add('settlement')
  }
  // 小光人物
  if (
    skySettlement.value &&
    skyInit.value &&
    skyWin.value &&
    skyTie.value &&
    skyLose.value
  ) {
    skyInit.value.classList.add('fade-out')
    skyWin.value.classList.add('fade-out')
    skyTie.value.classList.add('fade-out')
    skyLose.value.classList.add('fade-out')
    skySettlement.value.classList.add('fade-in-slow')
  }
  // 奖励
  if (taskImg.value && taskImgSettlement.value) {
    taskImg.value.classList.add('fade-out')
    if (isSettlementRedeemed) {
      taskImgSettlement.value.src = handleSrc(
        `task-heart${settlementLevel}-redeemed.png`,
      )
    } else {
      taskImgSettlement.value.src = handleSrc(
        `task-heart${settlementLevel}-can.png`,
      )
    }
    taskImgSettlement.value.classList.add('fade-in-slow')
  }
}

// 动画
function handleAnimation(activityData: Event[]): void {
  const task = activityData[currentDay - 1]
  // 小光的选择
  skyList = activityData.map((activity) => activity.stages[0]).slice(0, 7)
  // 用户动作值
  const userValue = task.value
  // 今日动作
  const action = valueActionMap[userValue]
  // 今日是否已完成
  isTodayPlayed = userValue > 0
  // 今日是否已领奖
  isTodayRedeemed = task.award[0] === 1 || task.score === 'lose'
  // 是否进入结算：今日是 7 号，且已领奖
  isInSettlement = currentDay === 7 && isTodayRedeemed
  // 结算是否已领奖
  isSettlementRedeemed = currentDay === 7 && activityData[7].award[0] === 1
  if (isInSettlement) {
    // 进入结算状态
    goSettlement(activityData)
  } else {
    // 设置每日最终状态
    handleAction(action, true)
  }
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_childrens_day_2024' })
    .then((res) => {
      // 获取数据并按照 ALL_TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activity_childrens_day_2024.sort(
          (a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? ALL_TASK_LIST.length
            const orderB = taskOrderMap.get(b.task_id) ?? ALL_TASK_LIST.length
            return orderA - orderB
          },
        )
      // 设置页面动画
      handleAnimation(activityData)
      const task = activityData[currentDay - 1]

      // 更新缓存活动数据
      activityStore.updateEventData('activity_childrens_day_2024', activityData)
      // 更新红点
      let isClaimedReward = true
      if (currentDay < 7) {
        // 输了就无奖励，为已领完奖
        if (task.score !== 'lose') {
          isClaimedReward =
            (task.value === 0 && task.award[0] === 0) ||
            (task.value > 0 && task.award[0] === 1)
        }
      } else {
        // 第 7 日不同，除了考虑第 7 日的领奖情况，还需要考虑结算奖励情况
        if (task.award[0] === 0 && task.score !== 'lose') {
          // 第 7 日未领奖
          isClaimedReward = task.value === 0
        } else {
          // 第 7 日已领奖或输了
          isClaimedReward = activityData[7].award[0] === 1
        }
      }
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_childrens_day_2024',
        isClaimedReward,
      )
    })
    .catch((error) => {
      console.log('childrens_day_2024.vue', error)
      showToast(error.message)
    })
}

// 设置玩家选择
function handleSetPlayerTask(task: string, value: number): void {
  // 更新任务进度，更新 value
  setPlayerTask({ task, value })
    .then(() => {
      // 更新缓存活动数据
      const newActivityData = activityData.value.map((item, index) => {
        const score =
          skyResult === 'win' ? 'lose' : skyResult === 'lose' ? 'win' : 'draw'
        return {
          ...item,
          value: index === currentDay - 1 ? value : item.value,
          score: index === currentDay - 1 ? score : item.score,
        }
      })
      activityStore.updateEventData(
        'activity_childrens_day_2024',
        newActivityData,
      )
      // 更新红点
      const isClaimedReward = skyResult === 'win'
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_childrens_day_2024',
        isClaimedReward,
      )
      // 如果是最后一天 6 月 7 日，且用户输了，进行画面更新，显示结算日奖励
      if (currentDay === 7 && skyResult === 'win') {
        // 等待每日比赛动画结束
        setTimeout(() => {
          goSettlement(activityData.value)
        }, 3000)
        // 更新红点
        menuStore.updateMenuDataByIsClaimedReward(
          'activity_childrens_day_2024',
          false,
        )
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 领奖
function handleReward(type: string): void {
  if (type === 'settlement') {
    if (isSettlementRedeemed) {
      showToast('已领奖')
      return
    }
    claimMissionReward({
      event: 'activity_childrens_day_2024',
      task: 'activity_childrens_day_2024_qm_settlement',
      rewardId: 1,
    })
      .then((res) => {
        const rewards = res.data.rewards
        modalReward.value?.openModal()
        curRewards.value = {
          name: Object.keys(rewards)[0],
          count: Number(Object.values(rewards)[0]),
        }
        // 更新页面
        isSettlementRedeemed = true
        if (taskImgSettlement.value) {
          taskImgSettlement.value.src = handleSrc(
            `task-heart${settlementLevel}-redeemed.png`,
          )
        }
        // 更新红点
        menuStore.updateMenuDataByIsClaimedReward(
          'activity_childrens_day_2024',
          true,
        )
      })
      .catch((error) => {
        showToast(error.message)
      })
  } else {
    if (isTodayRedeemed) {
      showToast('已领奖')
      return
    }
    claimMissionReward({
      event: 'activity_childrens_day_2024',
      task: `activity_childrens_day_2024_qm${currentDay}`,
      rewardId: 1,
    })
      .then((res) => {
        const rewards = res.data.rewards
        modalReward.value?.openModal()
        curRewards.value = {
          name: Object.keys(rewards)[0],
          count: Number(Object.values(rewards)[0]),
        }
        // 更新页面
        isTodayRedeemed = true
        if (taskImg.value) {
          taskImg.value.src = handleSrc(`task${currentDay}-redeemed.png`)
        }
        // 更新红点
        menuStore.updateMenuDataByIsClaimedReward(
          'activity_childrens_day_2024',
          true,
        )
      })
      .catch((error) => {
        showToast(error.message)
      })
  }
}

// 领奖弹框关闭
function handleRewardClose(): void {
  // 如果是最后一天 6 月 7 日，进行画面更新，显示结算日奖励
  if (currentDay === 7) {
    goSettlement(activityData.value)
    // 更新红点
    // 结算弹框，没有红点了
    if (isSettlementRedeemed) {
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_childrens_day_2024',
        true,
      )
    } else {
      // 第 7 日奖励弹框，结算奖励未领，有红点
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_childrens_day_2024',
        false,
      )
    }
  }
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
.childrens-day {
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
    background-image: url('@/assets/images/childrens-day-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 334px;
  top: 210px;
  z-index: 2;
}
.title {
  position: absolute;
  width: 620px;
  height: 244px;
  background-image: url('@/assets/images/childrens-day-2024/title.png');
}
.date {
  position: absolute;
  left: 350px;
  top: -26px;
  padding-left: 20px;
  width: 270px;
  height: 57px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/images/childrens-day-2024/time-bg.png');

  &-text {
    // font-size: 16px; /* px-to-viewport-ignore */
    font-size: 44px;
    color: #fff;
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 47px;
    height: 47px;
    background-image: url('@/assets/images/common/help.png');
  }
}
.action-box {
  position: relative;
  left: 0;
  top: 492px;
  width: 100%;
  height: 299px;

  &.settlement {
    transform: translate3d(-184px, 0, 0);
  }

  &.moving-box {
    animation: movingBox 1s forwards;
  }
}
.action-user,
.action-sky,
.action-score {
  position: absolute;
}
.action-user {
  width: 1073px;
  height: 299px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/images/childrens-day-2024/action-bg-user.png');

  &-title {
    position: absolute;
    left: 145px;
    width: 182px;
    height: 118px;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('@/assets/images/childrens-day-2024/action-user.png');
  }

  &-list {
    position: absolute;
    left: 392px;
  }

  &-item {
    position: relative;
    float: left;
    margin-right: 50px;
    width: 158px;
    height: 158px;
    border-radius: 158px;
    background: rgba(0, 0, 0, 0.51);

    &--rock {
      &.moving-rock {
        animation: movingRock 1s forwards;

        .action-user-indicator {
          right: 10px;
          bottom: 10px;
          transform: scale(0.67777);
        }
      }
    }

    &--scissors {
      &.moving-scissors {
        animation: movingScissors 1s forwards;

        .action-user-indicator {
          right: 10px;
          bottom: 10px;
          transform: scale(0.67777);
        }
      }
    }

    &--paper {
      &.moving-paper {
        animation: movingPaper 1s forwards;

        .action-user-indicator {
          right: 10px;
          bottom: 10px;
          transform: scale(0.67777);
        }
      }

      &.settlement {
        margin-left: 416px !important;
        transform: translateX(0) scale(1.5) !important;
        visibility: visible !important;
        opacity: 1 !important;
        background: none;

        .action-user-indicator {
          right: 10px;
          bottom: 10px;
          transform: scale(0.67777);
        }
      }
    }
  }

  &-img {
    &--rock {
      width: 76px;
      height: 113px;
    }
    &--scissors {
      width: 97px;
      height: 115px;
    }
    &--paper {
      width: 91px;
      height: 114px;
    }
  }

  &-indicator {
    position: absolute;
    right: 0;
    bottom: -8px;
    width: 45px;
    height: 45px;
  }
}
.action-sky {
  left: 1101px;
  width: 1044px;
  height: 299px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/images/childrens-day-2024/action-bg-sky.png');

  &-item {
    position: relative;
    margin-left: 118px;
    width: 158px;
    height: 158px;
    border-radius: 158px;
    background: rgba(0, 0, 0, 0.51);

    &.moving-sky {
      animation: movingSky 1s forwards;
    }

    &.settlement {
      transform: scale(1.5);
      background: none;
    }
  }

  &-img {
    width: 76px;
    height: 116px;
  }

  &-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 45px;
    height: 45px;
    opacity: 0;
    transform: scale(0.67777);
  }
}
.action-score {
  opacity: 0;
  left: 994px;
  top: 54px;
  width: 190px;
  height: 191px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/images/childrens-day-2024/score-bg.png');
  font-size: 42px;
  color: #424242;

  &.settlement {
    opacity: 1;
    z-index: 5;
    animation: movingScore 1s forwards;
  }
}
.task {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  right: 450px;
  top: 318px;
  width: 338px;
  height: 334px;
  z-index: 3;
}
.sky {
  position: absolute;
  background-repeat: no-repeat;
  background-size: cover;

  &-init {
    right: 68px;
    bottom: 0;
    width: 536px;
    height: 784px;
    background-image: url('@/assets/images/childrens-day-2024/sky-init.png');
  }

  &-win {
    opacity: 0;
    right: 42px;
    bottom: 0;
    width: 743px;
    height: 726px;
    background-image: url('@/assets/images/childrens-day-2024/sky-win.png');
  }

  &-tie {
    opacity: 0;
    right: 117px;
    bottom: 10px;
    width: 378px;
    height: 696px;
    background-image: url('@/assets/images/childrens-day-2024/sky-tie.png');
  }

  &-lose {
    opacity: 0;
    right: 110px;
    bottom: 0;
    width: 618px;
    height: 724px;
    background-image: url('@/assets/images/childrens-day-2024/sky-lose.png');
  }

  &-settlement {
    opacity: 0;
    right: 47px;
    bottom: 0;
    width: 669px;
    height: 706px;
    background-image: url('@/assets/images/childrens-day-2024/sky-settlement.png');
  }
}
.tips {
  position: absolute;
  right: 79px;
  top: 201px;
  width: 573px;

  &.slide-in {
    animation: slideIn 1s forwards;
  }

  &-wrapper {
    padding: 5px;
    border-radius: 20px;
    box-shadow: 0px 2px 2px 0 rgba(0, 0, 0, 0.06);
  }

  &-box {
    padding: 30px 25px;
    border-radius: 20px;
    line-height: 44px;
    color: #fff;
    font-size: 32px;
    background: rgba(0, 0, 0, 0.65);
  }
}
.text-light {
  position: absolute;
  right: -34px;
  top: -38px;
  width: 90px;
  height: 85px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('@/assets/images/childrens-day-2024/text-light.png');
}
.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
.modal-reward {
  width: 150px;
}
.fade-in {
  animation: fadeIn 0.5s forwards;
}
.fade-in-slow {
  animation: fadeIn 1s forwards;
}
.fade-out {
  animation: fadeOut 0.5s forwards;
}
@keyframes movingRock {
  0% {
    transform: translate3D(0, 0, 0);
  }
  50% {
    transform: translate3D(416px, 0, 0);
    background: none;
  }
  100% {
    transform: translate3D(416px, 0, 0) scale(1.5);
    background: none;
  }
}
@keyframes movingScissors {
  0% {
    transform: translate3D(0, 0, 0);
  }
  50% {
    transform: translate3D(208px, 0, 0);
    background: none;
  }
  100% {
    transform: translate3D(208px, 0, 0) scale(1.5);
    background: none;
  }
}
@keyframes movingPaper {
  0% {
    transform: translate3D(0, 0, 0);
  }
  50% {
    transform: translate3D(0, 0, 0);
    background: none;
  }
  100% {
    transform: translate3D(0, 0, 0) scale(1.5);
    background: none;
  }
}
@keyframes movingBox {
  from {
    transform: translate3D(0, 0, 0);
  }
  to {
    transform: translate3D(-184px, 0, 0);
  }
}
@keyframes movingSky {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(1440deg);
    background: none;
  }
  100% {
    transform: rotate(1440deg) scale(1.5);
    background: none;
  }
}
@keyframes movingScore {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scale {
  from {
    transform: scale(0);
    background: none;
  }
  to {
    transform: scale(1.5);
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
    visibility: hidden;
  }
  to {
    opacity: 1;
    visibility: visible;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate3D(0, 100px, 0);
  }
  to {
    opacity: 1;
    transform: translate3D(0, 0, 0);
  }
}
</style>
