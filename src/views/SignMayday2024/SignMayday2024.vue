<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="mayday flex h-screen flex-col items-center justify-center">
      <div class="mayday-wrapper">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              田月桑时春风雀跃
            </h1>
            <div class="date flex items-center align-middle">
              <div class="date-text">{{ activityTime }}</div>
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
                v-for="(item, index) in rewardList"
                :key="item.stage"
                :class="[
                  'signin-day overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `signin-day${item.stage}`,
                  `${item.status}`,
                ]"
                @click="
                  handleReward(
                    'activity_sign_mayday_2024_m1',
                    item.status,
                    index + 1,
                  )
                "
              >
                {{ item }}
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
        <p class="signin-days">已签到 {{ activityData[1].value }} 天</p>
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2023年11月16日~2023年11月29日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、在云峰的活动区域内点播一次歌曲，即可领取<span
                class="text-[#ffcb4d]"
                >畅谈长桌</span
              >×2；
            </p>
            <p class="modal-text">
              2、点赞一首别人点播的歌曲，即可领取<span class="text-[#ffcb4d]"
                >秋千</span
              >×2；
            </p>
            <p class="modal-text">
              3、使用一次古典音乐桌椅魔法，即可领取<span class="text-[#ffcb4d]"
                >篝火</span
              >×2；
            </p>
            <p class="modal-text">
              4、活动期间累计点播10次歌曲，即可领取<span class="text-[#ffcb4d]"
                >爱心</span
              >×2。
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
import { type Mayday2024Event, type DesignConfig } from '@/types'
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

// px -> vw
// const calculatePxToViewport = (px: number): string => {
//   const clientWidth = document.documentElement.clientWidth
//   return Math.round(((px * factor.value) / DESIGN_WIDTH) * clientWidth) + 'px'
//   // return ((px * factor.value) / DESIGN_WIDTH) * 100 + 'vw'
// }

// 样式对象转换
// const generateDynamicStyles = (
//   styleObj: Record<string, number>,
// ): Record<string, string> => {
//   const dynamicStyles: Record<string, string> = {}
//   for (const [key, value] of Object.entries(styleObj)) {
//     dynamicStyles[key] = calculatePxToViewport(value)
//   }
//   return dynamicStyles
// }

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const daysList = ref<HTMLInputElement | null>(null)

const menuStore = useMenuStore()
const activityStore = useActivityStore()
// 活动时间字符串
const activityTime = computed(
  () => activityStore.activityTime.activity_sign_mayday_2024,
)
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
let activityFetchTime = 0
const REWARD_LIST = [
  {
    stage: 1,
    status: 'wait',
  },
  {
    stage: 2,
    status: 'wait',
  },
  {
    stage: 3,
    status: 'wait',
  },
  {
    stage: 4,
    status: 'wait',
  },
  {
    stage: 5,
    status: 'wait',
  },
  {
    stage: 6,
    status: 'wait',
  },
]
// 奖励列表状态
const rewardList = computed(() => {
  return REWARD_LIST.map((item, index) => {
    return {
      ...item,
      status:
        activityData.value[1].award[index] === 1
          ? 'redeemed'
          : item.stage > activityData.value[1].value
          ? 'wait'
          : 'can',
    }
  })
})
// 完签奖励状态
const completedStatus = computed(() => {
  return activityData.value[0].award[0] === 1
    ? 'redeemed'
    : activityData.value[1].value < 6
    ? 'wait'
    : 'can'
})

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
  activityFetchTime = Date.now()
  getPlayerMissionData({ event: 'activity_sign_mayday_2024' })
    .then((res) => {
      const activityData: Mayday2024Event =
        res.data.event_data?.activity_sign_mayday_2024
      isTodaySignIn.value = Boolean(activityData[1].is_today_sign_in)
      const shouldClaimedRewardCount = activityData[1].stages.filter(
        (stage) => stage <= activityData[1].value,
      ).length
      const isClaimedReward =
        activityData[1].award.filter((item) => item === 1).length ===
          shouldClaimedRewardCount && activityData[0].award[0] === 1
      // 更新菜单数据 isClaimedReward
      console.log('menuStore: ', menuStore)
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_sign_mayday_2024',
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData('activity_sign_mayday_2024', activityData)
      // console.log('signin activityStore', activityStore)
      // 开始签到
      if (!isTodaySignIn.value && activityData[1].value < 6) {
        handleSignin()
      }
    })
    .catch((error) => {
      console.log('mayday.vue', error)
      showToast(error.message)
    })
}

// 设置获取活动数据时间间隔大于3s
function getActivityDataDelayed(): void {
  const curTime = Date.now()
  const timeElapsed = curTime - activityFetchTime
  if (timeElapsed > 3500) {
    getActivityData()
  } else {
    const delay = 3500 - timeElapsed
    const timer = setTimeout(() => {
      getActivityData()
      clearTimeout(timer)
    }, delay)
  }
}

// 签到
function handleSignin(): void {
  // 更新任务进度，更新 value
  setPlayerTask({ task: 'activity_sign_mayday_2024_m1' })
    .then(() => {
      showToast('签到成功')
      getActivityDataDelayed()
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
      getActivityDataDelayed()
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
.mayday {
  width: 2100px;

  &-wrapper {
    position: relative;
    width: calc(2040px * var(--scale-factor));
    height: calc(1140px * var(--scale-factor));
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('@/assets/images/sign-mayday-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: calc(242px * var(--scale-factor));
  top: calc(58px * var(--scale-factor));
}
.title {
  position: absolute;
  width: calc(1125px * var(--scale-factor));
  height: calc(342px * var(--scale-factor));
  background-image: url('@/assets/images/sign-mayday-2024/title.png');
}
.date {
  position: absolute;
  left: calc(560px * var(--scale-factor));
  top: calc(78px * var(--scale-factor));

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: #fff;
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 48px;
    height: 49px;
    background-image: url('@/assets/images/signin/help.png');
  }
}
.signin {
  position: relative;
  left: calc(288px * var(--scale-factor));
  top: calc(432px * var(--scale-factor));
}
.signin-list {
  width: calc(1000px * var(--scale-factor));
}
.signin-day {
  margin: 0 calc(10px * var(--scale-factor)) calc(10px * var(--scale-factor)) 0;
  width: calc(240px * var(--scale-factor));
  height: calc(240px * var(--scale-factor));
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
  left: calc(1492px * var(--scale-factor));
  top: calc(190px * var(--scale-factor));
  width: calc(300px * var(--scale-factor));
  height: calc(300px * var(--scale-factor));
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
  right: calc(320px * var(--scale-factor));
  bottom: calc(176px * var(--scale-factor));
  font-size: calc(38px * var(--scale-factor));
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
