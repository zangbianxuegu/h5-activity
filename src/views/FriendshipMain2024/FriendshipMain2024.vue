<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="anniversary flex h-screen">
      <div class="anniversary-main">
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
            <div class="sunlight">300</div>
            <!-- 每日任务 -->
            <div
              :class="[
                'daily-task bg-contain indent-[-9999px]',
                `daily-task-${dailyTask.week}`,
                `${dailyTask.status}`,
              ]"
              @click="handleDailyTask"
            >
              <h2>每日任务</h2>
              <p>{{ dailyTask.title }}</p>
            </div>
            <!-- 向日葵 -->
            <div class="sunflower-box">
              <div ref="sunflower" class="sunflower bg-contain"></div>
              <div
                class="sunflower-sunlight bg-contain"
                @click="handleUsingSunlight"
              >
                <p class="sunflower-text">-100</p>
              </div>
              <img
                v-show="!isUsingSunlight"
                class="img-sleep"
                src="@/assets/images/friendship-main-2024/sleep.gif"
                alt="zzz"
              />
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
                  @click="handleReward(item.value, item.status)"
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
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'
import { useActivityStore as useStoreFriendshipMain } from '@/stores/friendshipMain2024'
import { useActivityStore as useStoreFriendshipWeek1 } from '@/stores/friendshipWeek12024'

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
const sunflower = ref<HTMLDivElement | null>(null)
const storeFriendshipMain = useStoreFriendshipMain()
const storeFriendshipWeek1 = useStoreFriendshipWeek1()
const mainTaskData = computed(() => storeFriendshipMain.activityData)
const dailyTaskData = computed(() => storeFriendshipWeek1.activityData)

const isVisited = Session.get('isVisitedFriendshipMain2024')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

// 每日任务
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
]
const dailyTask = computed(() => {
  const daily =
    dailyTaskData.value.event_data.activitycenter_week1_friendship_2024[0]
  const res =
    DAILY_TASK_LIST.find((item) => item.value === daily.task_id) ||
    DAILY_TASK_LIST[0]
  res.status =
    daily.award[0] === 1 ? 'redeemed' : daily.value >= 1 ? 'can' : 'wait'
  return res
})

// 向日葵进度任务
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
const mainTaskList = computed(() => {
  const main =
    mainTaskData.value.event_data.activitycenter_main_friendship_2024[0]
  return MAIN_TASK_LIST.map((item, index) => {
    const award = main.award[index]
    const value = main.value
    return {
      ...item,
      status: award === 1 ? 'redeemed' : value >= item.stage ? 'can' : 'wait',
    }
  })
})
// 进度
const progress = computed(() => {
  let percentage =
    (mainTaskData.value.event_data.activitycenter_main_friendship_2024[0]
      .value /
      2400) *
    100
  if (percentage < 0) {
    percentage = 0
  } else if (percentage > 100) {
    percentage = 100
  }
  percentage = Math.round(percentage)
  return percentage + '%'
})
// 是否在使用阳光
const isUsingSunlight = ref(false)

onMounted(() => {
  try {
    getActivityData()
    setTimeout(() => {
      mainTaskData.value.event_data.activitycenter_main_friendship_2024[0].value = 400
    }, 2000)
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
// function handleSrc(name: string): string {
//   const imgSrc = new URL(
//     `../../assets/images/common/reward/reward-${name}.png`,
//     import.meta.url,
//   ).href

//   return imgSrc
// }

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activitycenter_main_friendship_2024' })
    .then((res) => {
      storeFriendshipMain.updateActivityData(res.data)
    })
    .catch((error) => {
      showToast(error.message)
    })

  getPlayerMissionData({ event: 'activitycenter_week1_friendship_2024' })
    .then((res) => {
      storeFriendshipWeek1.updateActivityData(res.data)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 每日任务
function handleDailyTask(): void {
  if (dailyTask.value.status === 'redeemed') {
    return
  }
  if (dailyTask.value.status === 'wait') {
    showToast('还未完成任务')
  }
}

// 使用阳光
function handleUsingSunlight(): void {
  isUsingSunlight.value = true
  sunflower.value?.classList.add('sunflower-animate')
  setTimeout(() => {
    isUsingSunlight.value = false
    sunflower.value?.classList.remove('sunflower-animate')
  }, 2000)
}

// 领奖
function handleReward(task: string, status: string): void {
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: 'activitycenter_main_friendship_2024',
    task,
    rewardId: 1,
  })
    .then((res) => {
      console.log('领奖 res: ', res)
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
.anniversary {
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
  bottom: 74px;
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
    width: 186px;
    height: 189px;
    cursor: pointer;
    background-image: url('@/assets/images/friendship-main-2024/sunlight-circle.png');
  }

  &-text {
    margin: -15px 0 0 115px;
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
@for $i from 1 through 2 {
  .daily-task-#{$i} {
    &.wait {
      background-image: url('@/assets/images/friendship-main-2024/daily-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/friendship-main-2024/daily-task#{$i}-can.png');
    }
    &.can {
      background-image: url('@/assets/images/friendship-main-2024/daily-task#{$i}-redeemed.png');
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
</style>
