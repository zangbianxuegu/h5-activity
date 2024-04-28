<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="mayday flex h-screen">
      <div class="mayday-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              田月桑时春风雀跃
            </h1>
            <div class="date flex items-center align-middle">
              <div class="date-text">5.1-5.7</div>
              <div
                class="date-help bg-contain bg-center bg-no-repeat"
                @click="handleHelp"
              ></div>
            </div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div class="signin flex">
            <ul class="signin-list flex flex-row flex-wrap" ref="daysList">
              <li
                v-for="(item, index) in taskList"
                :key="item.stage"
                :class="[
                  'signin-day overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `signin-day${item.stage}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.name, item.status, index + 1)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </Transition>
        <div
          :class="[
            'completed-reward bg-contain bg-center bg-no-repeat',
            `${completedStatus}`,
          ]"
          @click="
            handleReward('activity_sign_mayday_2024_m2', completedStatus, 1)
          "
        ></div>
        <p class="signin-days">已签到 {{ activityData[0].value }} 天</p>
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年5月1日~2024年5月7日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、累计签到1天，即可领取<span class="text-[#ffcb4d]"
                >元气满满</span
              >；
            </p>
            <p class="modal-text">
              2、累计签到2天，即可领取<span class="text-[#ffcb4d]"
                >光能药剂</span
              >；
            </p>
            <p class="modal-text">
              3、累计签到3天，即可领取<span class="text-[#ffcb4d]"
                >彩虹尾迹</span
              >；
            </p>
            <p class="modal-text">
              4、累计签到4天，即可领取<span class="text-[#ffcb4d]"
                >璀璨之星</span
              >；
            </p>
            <p class="modal-text">
              5、累计签到5天，即可领取<span class="text-[#ffcb4d]">篝火</span>；
            </p>
            <p class="modal-text">
              6、累计签到6天，即可领取<span class="text-[#ffcb4d]"
                >体型重塑</span
              >；
            </p>
            <p class="modal-text">
              7、活动期间完签，即可额外领取<span class="text-[#ffcb4d]"
                >爱心*2</span
              >。
            </p>
          </template>
        </activity-modal>
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
                class="modal-reward"
                :src="handleSrc(String(curRewards.name))"
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
import {
  getPlayerMissionData,
  setPlayerTask,
  claimMissionReward,
} from '@/utils/request'
import { type Event, type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  energy: string
  energy_potion: string
  trail_rainbow: string
  glow: string
  bonfire: string
  resize_potion: string
  heart: string
}

const rewardsText: RewardsName = {
  energy: '元气满满',
  energy_potion: '光能药剂',
  trail_rainbow: '彩虹尾迹',
  glow: '璀璨之星',
  bonfire: '篝火',
  resize_potion: '体型重塑',
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
const daysList = ref<HTMLInputElement | null>(null)

const menuStore = useMenuStore()
const activityStore = useActivityStore()
// 活动数据
const activityData = computed(
  () => activityStore.eventData.activity_sign_mayday_2024,
)
const isTodaySignIn = ref(false)
const curRewards: Ref<Rewards> = ref({
  name: 'energy',
  count: 1,
})
// 获取活动数据的时间
// let activityFetchTime = 0
const TASK_LIST = [
  {
    name: 'activity_sign_mayday_2024_m1',
    title: '第一天',
    stage: 1,
    status: 'wait',
  },
  {
    name: 'activity_sign_mayday_2024_m1',
    title: '第二天',
    stage: 2,
    status: 'wait',
  },
  {
    name: 'activity_sign_mayday_2024_m1',
    title: '第三天',
    stage: 3,
    status: 'wait',
  },
  {
    name: 'activity_sign_mayday_2024_m1',
    title: '第四天',
    stage: 4,
    status: 'wait',
  },
  {
    name: 'activity_sign_mayday_2024_m1',
    title: '第五天',
    stage: 5,
    status: 'wait',
  },
  {
    name: 'activity_sign_mayday_2024_m1',
    title: '第六天',
    stage: 6,
    status: 'wait',
  },
]
// 主任务列表状态
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value[0]
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
// 完签奖励状态
const completedStatus = computed(() => {
  return activityData.value[1].award[0] === 1
    ? 'redeemed'
    : activityData.value[0].value >= 6
    ? 'can'
    : 'wait'
})
// 所有任务列表
const ALL_TASK_LIST = [
  {
    name: 'activity_sign_mayday_2024_m1',
  },
  {
    name: 'activity_sign_mayday_2024_m2',
  },
]
const taskOrderMap = new Map(
  ALL_TASK_LIST.map((task, index) => [task.name, index]),
)

const isVisited = Session.get('isVisitedMayday2024')
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
  Session.set('isVisitedMayday2024', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/sign-mayday-2024/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  // activityFetchTime = Date.now()
  getPlayerMissionData({ event: 'activity_sign_mayday_2024' })
    .then((res) => {
      // 获取数据并按照 ALL_TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activity_sign_mayday_2024.sort(
          (a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? ALL_TASK_LIST.length
            const orderB = taskOrderMap.get(b.task_id) ?? ALL_TASK_LIST.length
            return orderA - orderB
          },
        )
      isTodaySignIn.value = Boolean(activityData[0].is_today_sign_in)
      // 1、更新活动数据
      activityStore.updateEventData('activity_sign_mayday_2024', activityData)
      // 2、更新红点
      updateMenuStore()
      // 开始签到
      if (!isTodaySignIn.value && activityData[0].value < 6) {
        handleSignin()
      }
    })
    .catch((error) => {
      console.log('mayday.vue', error)
      showToast(error.message)
    })
}

// // 设置获取活动数据时间间隔大于3s
// function getActivityDataDelayed(): void {
//   const curTime = Date.now()
//   const timeElapsed = curTime - activityFetchTime
//   if (timeElapsed > 3500) {
//     getActivityData()
//   } else {
//     const delay = 3500 - timeElapsed
//     const timer = setTimeout(() => {
//       getActivityData()
//       clearTimeout(timer)
//     }, delay)
//   }
// }

// 签到
function handleSignin(): void {
  // 更新任务进度，更新 value
  setPlayerTask({ task: 'activity_sign_mayday_2024_m1' })
    .then(() => {
      showToast('签到成功')
      // getActivityDataDelayed()
      // 后端接口请求限制间隔 3s
      // 优化用户体验，不再延时请求接口，直接前端更新数据展示
      // 1、更新活动数据
      const value = activityData.value[0].value++
      if (value === 6) {
        activityData.value[1].value = 1
      }
      activityStore.updateEventData(
        'activity_sign_mayday_2024',
        activityData.value,
      )
      // 2、更新红点
      updateMenuStore()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 领奖
function handleReward(task: string, status: string, rewardId: number): void {
  if (status === 'redeemed') {
    showToast('已领奖')
    return
  }
  if (status === 'wait') {
    showToast('签到天数不足')
    return
  }
  claimMissionReward({
    event: 'activity_sign_mayday_2024',
    task,
    rewardId,
  })
    .then((res) => {
      const rewards = res.data.rewards
      console.log('mayday rewards: ', rewards)
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // getActivityDataDelayed()
      // 后端接口请求限制间隔 3s
      // 优化用户体验，不再延时请求接口，直接前端更新数据展示
      // 1、更新活动数据
      if (task === 'activity_sign_mayday_2024_m1') {
        activityData.value[0].award[rewardId - 1] = 1
      }
      if (task === 'activity_sign_mayday_2024_m2') {
        activityData.value[1].award[0] = 1
      }
      activityStore.updateEventData(
        'activity_sign_mayday_2024',
        activityData.value,
      )
      // 2、更新红点
      updateMenuStore()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 更新菜单（更新红点）
function updateMenuStore(): void {
  // 是否已领奖须同时满足以下两个条件：
  // - 任务1：签到获得的奖励已全部领取
  // - 任务2：完签且领奖或者未完签且未领奖
  const shouldClaimedRewardCount = activityData.value[0].stages.filter(
    (stage) => stage <= activityData.value[0].value,
  ).length
  const isClaimedReward =
    activityData.value[0].award.filter((item) => item === 1).length >=
      shouldClaimedRewardCount &&
    !(
      activityData.value[1].award[0] === 0 &&
      activityData.value[1].value >= activityData.value[1].stages[0]
    )
  menuStore.updateMenuDataByIsClaimedReward(
    'activity_sign_mayday_2024',
    isClaimedReward,
  )
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
.mayday {
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
    background-image: url('@/assets/images/sign-mayday-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 242px;
  top: 58px;
}
.title {
  position: absolute;
  width: 1125px;
  height: 342px;
  background-image: url('@/assets/images/sign-mayday-2024/title.png');
}
.date {
  position: absolute;
  left: 560px;
  top: 78px;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: #fff;
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 48px;
    height: 49px;
    background-image: url('@/assets/images/common/help.png');
  }
}
.signin {
  position: relative;
  left: 288px;
  top: 432px;
}
.signin-list {
  width: 1000px;
}
.signin-day {
  margin: 0 10px 10px 0;
  width: 240px;
  height: 240px;
}

@for $i from 1 through 6 {
  .signin-day#{$i} {
    &.wait {
      background-image: url('@/assets/images/sign-mayday-2024/day#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/sign-mayday-2024/day#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/sign-mayday-2024/day#{$i}-redeemed.png');
    }
  }
}
.completed-reward {
  position: absolute;
  left: 1492px;
  top: 190px;
  width: 300px;
  height: 300px;
  &.wait {
    background-image: url('@/assets/images/sign-mayday-2024/completed-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/sign-mayday-2024/completed-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/sign-mayday-2024/completed-redeemed.png');
  }
}
.signin-days {
  position: absolute;
  right: 320px;
  bottom: 176px;
  font-size: 38px;
  font-weight: 400;
  color: #fff;
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
</style>
