<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="friendship flex h-screen">
      <div class="friendship-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              向友葵的成长日记 7.17-8.27
            </h1>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <main>
            <!-- 阳光数量 -->
            <div class="sunlight">{{ activityData.token_count }}</div>
            <!-- 每日任务 -->
            <div
              :class="[
                'daily-task bg-contain indent-[-9999px]',
                `daily-task-${dailyTask.week}`,
                `${dailyTask.status}`,
              ]"
              @click="
                handleReward(dailyTask.value, dailyTask.status, 1, 'daily')
              "
            >
              <h2>每日任务</h2>
              <p>{{ dailyTask.title }}</p>
            </div>
            <!-- 向日葵 -->
            <div class="sunflower-box">
              <div ref="sunflower" class="sunflower bg-contain"></div>
              <!-- 阳光 -->
              <div
                v-if="isUsingSunlightsEnabled"
                :class="[
                  'sunflower-sunlight flex items-center justify-center bg-contain',
                  {
                    active: (Number(activityData.token_count) || 0) >= 100,
                  },
                ]"
                @click="handleUsingSunlight"
              >
                <div class="sunlight-icon bg-contain"></div>
                <p class="sunflower-text">-100</p>
              </div>
              <!-- zzz -->
              <img
                v-show="!isUsingSunlight"
                class="img-sleep"
                src="@/assets/images/friendship-main-2024/sleep.gif"
                alt="zzz"
              />
              <!-- heart -->
              <img
                v-show="isUsingSunlight"
                class="img-heart"
                src="@/assets/images/friendship-main-2024/heart.gif"
                alt="heart"
              />
            </div>
            <!-- 进度奖励 -->
            <div class="main-task">
              <!-- 奖励列表 -->
              <ul class="task-list grid grid-cols-4 place-items-center">
                <li
                  v-for="(item, index) in mainTaskList"
                  :key="item.id"
                  :class="[
                    'task-item bg-contain bg-center bg-no-repeat',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="
                    handleReward(item.value, item.status, item.id, 'main')
                  "
                >
                  <p class="task-text">{{ item.stage }}</p>
                </li>
              </ul>
              <!-- 进度 -->
              <div class="progress bg-cover">
                <div class="progress-finished bg-cover"></div>
              </div>
            </div>
          </main>
        </Transition>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年7月17日~2024年8月27日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            1、活动期间，通过每日礼物、每日任务、每周惊喜可获得<span
              class="text-[#ffcb4d]"
              >阳光</span
            >；
          </p>
          <p class="modal-text">
            2、使用阳光可呵护向友葵（每次固定消耗100点），向友葵成长至四个阶段时可解锁对应的奖励；
          </p>
          <p class="modal-text">3、使用阳光可在养分补给页面兑换各种道具；</p>
          <p class="modal-text">
            4、当向友葵成长至第二阶段和第四阶段时，养分补给页面会解锁<span
              class="text-[#ffcb4d]"
              >有友节专属外观兑换</span
            >，可使用<span class="text-[#ffcb4d]">爱心</span>进行兑换。
          </p>
        </template>
      </activity-modal>
      <!-- 奖励弹框 -->
      <activity-modal ref="modalReward" class="reward-box">
        <template #content>
          <p class="reward-title mt-4">恭喜你获得活动奖励</p>
          <div class="flex items-center justify-around">
            <ul
              :class="[
                'reward-list mt-6 flex w-full items-center justify-around',
                `reward-list_${curRewards.length}`,
              ]"
            >
              <li
                class="reward-item flex flex-col items-center justify-between"
                v-for="item in curRewards"
                :key="item.img"
              >
                <div class="reward-img-wrap flex items-center justify-center">
                  <img
                    class="reward-img"
                    :src="handleSrc(item.img)"
                    alt="reward"
                  />
                </div>
                <p class="reward-name">{{ item.name }}</p>
              </li>
            </ul>
          </div>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import {
  getPlayerMissionData,
  claimMissionReward,
  setPlayerTask,
} from '@/utils/request'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/friendshipMain2024'

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
const sunflower = ref<HTMLDivElement | null>(null)
const menuStore = useMenuStore()
const storeFriendshipMain = useActivityStore()
const activityData = computed(() => storeFriendshipMain.activityData)
const dailyTaskData = computed(
  () => activityData.value.event_data.activitycenter_main_friendship_2024[0],
)
const mainTaskData = computed(
  () => activityData.value.event_data.activitycenter_main_friendship_2024[1],
)

const isVisited = Session.get('isVisitedFriendshipMain2024')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

// 以任务 id 来命名 key，方便领奖时获取。
// 周任务的每日任务奖励全部一样，故除外，为固定的。
const rewardMap = {
  activitycenter_main_friendship_2024_m1_1: [
    {
      name: '向日葵花盘装扮魔法*3',
      img: 'outfit_horn_sunflower_headwear',
    },
  ],
  activitycenter_main_friendship_2024_m1_2: [
    {
      name: '盆栽台灯*1',
      img: 'CharSkyKid_Prop_SunflowerLamp',
    },
  ],
  activitycenter_main_friendship_2024_m1_3: [
    {
      name: '爱心*3',
      img: 'heart',
    },
  ],
  activitycenter_main_friendship_2024_m1_4: [
    {
      name: '向日葵屏风*1',
      img: 'CharSkyKid_Prop_SunflowerScreen',
    },
  ],
  activitycenter_week_friendship_2024_m1: [
    {
      name: '阳光*50',
      img: 'sunlight_token',
    },
  ],
}
const curRewards = ref(rewardMap.activitycenter_main_friendship_2024_m1_1)

const DAILY_TASK_LIST = [
  {
    title: '收获1株双生向日葵',
    value: 'activitycenter_week1_friendship_2024_m1',
    week: '1',
    status: 'wait',
  },
  {
    title: '呵护1位好友的向日葵',
    value: 'activitycenter_week2_friendship_2024_m1',
    week: '2',
    status: 'wait',
  },
  {
    title: '和陌生人一起坐在向日葵长凳上',
    value: 'activitycenter_week3_friendship_2024_m1',
    week: '3',
    status: 'wait',
  },
  {
    title: '收获1株双生向日葵',
    value: 'activitycenter_week4_friendship_2024_m1',
    week: '4',
    status: 'wait',
  },
  {
    title: '呵护1位好友的向日葵',
    value: 'activitycenter_week5_friendship_2024_m1',
    week: '5',
    status: 'wait',
  },
  {
    title: '和陌生人一起坐在向日葵长凳上',
    value: 'activitycenter_week6_friendship_2024_m1',
    week: '6',
    status: 'wait',
  },
]
// 每日任务
const dailyTask = computed(() => {
  const res =
    DAILY_TASK_LIST.find(
      (item) => item.value === dailyTaskData.value.task_id,
    ) || DAILY_TASK_LIST[0]
  res.status =
    dailyTaskData.value.award[0] === 1
      ? 'redeemed'
      : dailyTaskData.value.value >= 1
        ? 'can'
        : 'wait'
  return res
})

const MAIN_TASK_LIST = [
  {
    id: 1,
    title: '向日葵花盘装扮魔法',
    value: 'activitycenter_main_friendship_2024_m1',
    stage: 600,
    status: 'wait',
  },
  {
    id: 2,
    title: '盆栽台灯',
    value: 'activitycenter_main_friendship_2024_m1',
    stage: 1200,
    status: 'wait',
  },
  {
    id: 3,
    title: '爱心',
    value: 'activitycenter_main_friendship_2024_m1',
    stage: 1800,
    status: 'wait',
  },
  {
    id: 4,
    title: '向日葵屏风',
    value: 'activitycenter_main_friendship_2024_m1',
    stage: 2400,
    status: 'wait',
  },
]
// 向日葵进度任务
const mainTaskList = computed(() => {
  return MAIN_TASK_LIST.map((item, index) => {
    const award = mainTaskData.value.award[index]
    const value = mainTaskData.value.value
    return {
      ...item,
      status: award === 1 ? 'redeemed' : value >= item.stage ? 'can' : 'wait',
    }
  })
})
// 进度
const progress = computed(() => {
  let percentage = (mainTaskData.value.value / 2400) * 100
  if (percentage < 0) {
    percentage = 0
  } else if (percentage > 100) {
    percentage = 100
  }
  percentage = Math.round(percentage)
  return percentage + '%'
})
// 是否可以使用阳光
const isUsingSunlightsEnabled = computed(() => mainTaskData.value.value < 2400)
// 是否在使用阳光
const isUsingSunlight = ref(false)

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedFriendshipMain2024', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const dailyValue = dailyTaskData.value.value
  const dailyAward = dailyTaskData.value.award
  const mainStages = mainTaskData.value.stages
  const mainValue = mainTaskData.value.value
  const mainAward = mainTaskData.value.award
  const shouldClaimedRewardCount = mainStages.filter(
    (stage) => stage <= mainValue,
  ).length
  const isClaimedReward =
    mainAward.filter((item) => item === 1).length >= shouldClaimedRewardCount &&
    !(dailyValue >= 1 && dailyAward[0] === 0)
  menuStore.updateMenuDataByIsClaimedReward(
    'activitycenter_main_friendship_2024',
    isClaimedReward,
  )
}

/**
 * @function 获取任务进度
 */
function getActivityData(): void {
  // 主任务
  getPlayerMissionData({
    event: 'activitycenter_main_friendship_2024',
    token: 'sunlight_token',
  })
    .then((res) => {
      storeFriendshipMain.updateActivityData(res.data)
      // 设置红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

let startTime: number | null = null

function animateHeart(): void {
  if (!startTime) {
    startTime = performance.now()
  }
  const elapsedTime = (performance.now() - startTime) / 1000
  if (elapsedTime < 2) {
    requestAnimationFrame(animateHeart)
  } else {
    isUsingSunlight.value = false
    sunflower.value?.classList.remove('sunflower-animate')
    startTime = null
  }
}

/**
 * @function 使用阳光
 */
function handleUsingSunlight(): void {
  if (Number(activityData.value.token_count || 0) < 100) {
    showToast('阳光不足，无法呵护向友葵！')
    return
  }
  isUsingSunlight.value = true
  sunflower.value?.classList.add('sunflower-animate')
  requestAnimationFrame(animateHeart)
  setPlayerTask({ task: 'activitycenter_main_friendship_2024_m1', value: 100 })
    .then((res) => {
      const { token_count: tokenCount, task_value: taskValue } =
        res.data.activitycenter_main_friendship_2024.data
      showToast('您已成功呵护向友葵，成长值+100')
      // 阳光数量
      activityData.value.token_count = tokenCount
      // main value
      activityData.value.event_data.activitycenter_main_friendship_2024[1].value =
        taskValue
      // 更新页面数据
      storeFriendshipMain.updateActivityData(activityData.value)
      // 设置红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param status 任务状态
 * @param rewardId 第几个奖励节点
 * @param type 任务类型：周每日任务、main 任务
 */
function handleReward(
  task: string,
  status: string,
  rewardId: number,
  type: string,
): void {
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  let event
  if (type === 'daily') {
    event = task.split('_m1')[0]
  } else {
    event = 'activitycenter_main_friendship_2024'
  }
  claimMissionReward({
    event,
    task,
    rewardId,
  })
    .then(async (res) => {
      const rewardKey =
        type === 'daily'
          ? 'activitycenter_week_friendship_2024_m1'
          : `${task}_${rewardId}`
      curRewards.value = rewardMap[rewardKey as keyof typeof rewardMap]
      modalReward.value?.openModal()

      // 更新页面数据
      if (type === 'daily') {
        // daily 领奖
        activityData.value.event_data.activitycenter_main_friendship_2024[0].award[0] = 1
        // 更新阳光数量
        activityData.value.token_count = res.data.token_count
      } else {
        // main 领奖
        activityData.value.event_data.activitycenter_main_friendship_2024[1].award[
          rewardId - 1
        ] = 1
      }
      storeFriendshipMain.updateActivityData(activityData.value)
      // 设置红点
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
.friendship {
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
    background-image: url('@/assets/images/friendship-main-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 429px;
  top: 36px;
  width: 678px;
}
.title {
  width: 678px;
  height: 460px;
  background-image: url('@/assets/images/friendship-main-2024/title.png');
}
.help {
  position: absolute;
  left: 325px;
  top: 315px;
  width: 47px;
  height: 68px;
  background-image: url('@/assets/images/friendship-main-2024/help.png');
}
.sunlight {
  position: absolute;
  left: 22px;
  top: 22px;
  display: inline-block;
  border: 4px solid #a7d5eb;
  border-radius: 40px;
  padding: 0 36px 0 106px;
  height: 80px;
  line-height: 80px;
  font-size: 45px;
  color: #7b6d8d;
  background: url('@/assets/images/friendship-main-2024/sunlight.jpg') no-repeat
    16px center/59px 60px #fff;
}
.sunflower-box {
  position: absolute;
  left: 22px;
  bottom: 94px;
  width: 430px;
  height: 805px;
}
.sunflower {
  position: absolute;
  bottom: 0;
  width: 430px;
  height: 599px;
  background-image: url('@/assets/images/friendship-main-2024/sunflower.png');

  &-sunlight {
    position: absolute;
    left: 102px;
    top: 25px;
    width: 181px;
    height: 181px;
    cursor: pointer;
    background-image: url('@/assets/images/friendship-main-2024/sunlight-circle.png');

    &.active {
      animation: scaleAnimationCircle 2s infinite;
      animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
      background-image: url('@/assets/images/friendship-main-2024/sunlight-circle-active.png');
    }
  }

  &-text {
    position: absolute;
    top: -15px;
    left: 115px;
    width: 130px;
    height: 65px;
    border-radius: 65px;
    line-height: 65px;
    text-align: center;
    font-size: 45px;
    color: #fff;
    background: rgba(146, 146, 201, 0.86);
  }
}
.sunlight-icon {
  width: 89px;
  height: 90px;
  background-image: url('@/assets/images/friendship-main-2024/sunlight.png');
  animation: scaleAnimationSunlight 2s infinite;
  animation-timing-function: cubic-bezier(0.25, 0.45, 0.45, 0.95);
}

.sunflower-animate {
  animation: scaleMove 0.2s alternate;
}
.img-heart {
  position: absolute;
  left: 280px;
  top: 154px;
  width: 170px;
  height: 180px;
}
.img-sleep {
  position: absolute;
  left: 230px;
  top: 154px;
  width: 300px;
  height: 180px;
}
.daily-task {
  position: absolute;
  right: 43px;
  top: 16px;
  width: 406px;
  height: 473px;
}
@for $i from 1 through 6 {
  // 4-6 周任务和 1-3 周任务一样
  $j: ($i - 1) % 3 + 1;
  .daily-task-#{$i} {
    &.wait {
      background-image: url('@/assets/images/friendship-main-2024/daily-task#{$j}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/friendship-main-2024/daily-task#{$j}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/friendship-main-2024/daily-task#{$j}-redeemed.png');
    }
  }
}
.main-task {
  position: absolute;
  bottom: 0;
  right: 20px;
  width: 1719px;
  height: 362px;
}
.task-list {
  margin-left: 100px;
  padding: 0 20px;
  width: 100%;
  height: 229px;
}
.task-item {
  width: 213px;
  height: 229px;
}
@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/friendship-main-2024/main-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/friendship-main-2024/main-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/friendship-main-2024/main-task#{$i}-redeemed.png');
    }
  }
}
.task-text {
  margin-top: 295px;
  text-align: center;
  color: #87c36b;
  font-size: 44px;
  font-weight: 600;
  text-shadow:
    1px 7px 7px rgba(0, 0, 0, 0.19),
    -4px -4px 0 #fff,
    4px -4px 0 #fff,
    -4px 4px 0 #fff,
    4px 4px 0 #fff,
    -4px -4px 0 #fff,
    4px -4px 0 #fff,
    -4px 4px 0 #fff,
    4px 4px 0 #fff;
}
.progress {
  margin-left: -100px;
  margin-top: 10px;
  width: 1719px;
  height: 66px;
  background-image: url('@/assets/images/friendship-main-2024/progress.png');

  &-finished {
    width: v-bind(progress);
    height: 66px;
    background-image: url('@/assets/images/friendship-main-2024/progress-finished.png');
    transition: width 2s ease;
  }
}
.reward-box {
  text-align: center;
}
.reward-title {
  font-size: 40px;
  color: #454545;
  letter-spacing: 1px;
}
.reward-list {
  &_1 {
    width: 80%;
    .reward-item {
      height: 300px;
    }
    .reward-img {
      width: 200px;
    }
  }
  &_2 {
    width: 80%;
    .reward-item {
      width: 50%;
    }
  }
  &_3 {
    width: 100%;
    .reward-item {
      width: calc(100% / 3);
    }
  }
}
.reward-item {
  height: 260px;
}
.reward-img {
  width: 100px;
}
.reward-img-wrap {
  width: 100%;
  height: 200px;
}
.reward-name {
  font-size: 30px;
  color: #666;
}
@keyframes scaleMove {
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes scaleAnimationSunlight {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes scaleAnimationCircle {
  0% {
    transform: scale(1);
  }
  42% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
</style>
