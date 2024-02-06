<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="holiday flex h-screen flex-col items-center justify-center">
      <div class="holiday-wrapper">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              假日打卡
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
          <div class="flex">
            <img
              class="photo"
              src="@/assets/images/signin/photo.png"
              alt="img"
            />
            <div class="signin">
              <ul class="signin-list flex flex-row flex-wrap" ref="daysList">
                <li
                  v-for="(item, index) in state.daysList"
                  :key="item"
                  :class="[
                    'signin-day overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                    `signin-day${index + 1}`,
                    activityData.award[index] === 1 ? 'active' : '',
                  ]"
                >
                  {{ item }}
                </li>
              </ul>
              <div class="signin-footer">
                <p class="signed-days text-right">
                  已累计签到<span class="signed-days-num">{{
                    activityData.value
                  }}</span
                  >/9天
                </p>
                <div class="flex items-end">
                  <div
                    class="signin-btn signin-btn-replenishment disabled overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
                  >
                    限时补签
                  </div>
                  <div
                    class="signin-btn signin-btn-today overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
                    :class="{ disabled: isTodaySignIn }"
                    @click="handleSignin"
                  >
                    今日签到
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
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
import { type Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'

const menuStore = useMenuStore()

const activityStore = useActivityStore()
// 活动时间字符串
const activityTime = computed(
  () => activityStore.activityTime.activity_sign_in_1,
)
// 活动数据
const activityData = computed(() => activityStore.eventData.activity_sign_in_1)

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  rainbow: string
  candles: string
  message_boat: string
  trail_red: string
  energy: string
  recording_candle: string
  heart: string
  bonfire: string
  resize_potion: string
}

const rewardsText: RewardsName = {
  rainbow: '彩虹',
  candles: '蜡烛',
  message_boat: '传信纸船',
  trail_red: '红色尾迹',
  energy: '元气满满',
  recording_candle: '留影蜡烛',
  heart: '爱心',
  bonfire: '篝火',
  resize_potion: '体型重塑',
}

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const daysList = ref<HTMLInputElement | null>(null)
const isTodaySignIn = ref(false)
const curRewards: Ref<Rewards> = ref({
  name: 'rainbow',
  count: 1,
})
const rewardId = ref(1)
// 获取活动数据的时间
let activityFetchTime = 0

const isVisited = Session.get('isVisitedHoliday')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

const state = reactive({
  daysList: [
    '第一天',
    '第二天',
    '第三天',
    '第四天',
    '第五天',
    '第六天',
    '第七天',
    '第八天',
    '第九天',
  ],
})

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedHoliday', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/signin/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  activityFetchTime = Date.now()
  getPlayerMissionData({ event: 'activity_sign_in_1' })
    .then((res) => {
      const activityData: Event = res.data.event_data?.activity_sign_in_1[0]
      rewardId.value = activityData.value
      isTodaySignIn.value = Boolean(activityData.is_today_sign_in)
      const shouldClaimedRewardCount = activityData.stages.filter(
        (stage) => stage <= activityData.value,
      ).length
      const isClaimedReward =
        activityData.award.filter((item) => item === 1).length ===
        shouldClaimedRewardCount
      // 更新菜单数据 isClaimedReward
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_sign_in_1',
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData('activity_sign_in_1', activityData)
      // console.log('signin activityStore', activityStore)
    })
    .catch((error) => {
      console.log('holiday.vue', error)

      showToast(error.message)
    })
}

// 签到
function handleSignin(): void {
  if (isTodaySignIn.value) {
    showToast('今日已签到')
    return
  }
  if (rewardId.value >= 9) {
    showToast('签到任务已全部完成')
    return
  }
  // 更新任务进度，更新 value
  setPlayerTask({ task: 'activity_sign_in_m1' })
    .then(() => {
      // 更新 reward_id
      rewardId.value++

      // 领奖
      return claimMissionReward({
        event: 'activity_sign_in_1',
        task: 'activity_sign_in_m1',
        rewardId: rewardId.value,
      })
    })
    .then((res) => {
      const rewards = res.data.rewards
      console.log('signin rewards: ', rewards)
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 设置获取活动数据时间间隔大于3s
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
.holiday {
  width: 2100px;
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/signin/signin-bg.jpg');
}
.title {
  width: 506px;
  height: 184px;
  background-image: url('@/assets/images/signin/title.png');
}
.date {
  margin-left: 20px;
  margin-top: 90px;

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
.photo {
  width: 511px;
  height: 690px;
}
.signin {
  position: relative;
  margin: 20px 0 0 50px;
}
.signin-footer {
  position: absolute;
  right: 0;
  bottom: 15px;
}
.signin-btn {
  margin-left: 40px;

  &-today {
    width: 366px;
    height: 114px;
    background-image: url('@/assets/images/signin/signin-btn-today.png');

    &.disabled {
      background-image: url('@/assets/images/signin/signin-btn-today-disabled.png');
    }
  }

  &-replenishment {
    margin-bottom: 5px;
    width: 270px;
    height: 97px;
    background-image: url('@/assets/images/signin/signin-btn-replenishment.png');

    &.disabled {
      background-image: url('@/assets/images/signin/signin-btn-replenishment-disabled.png');
    }
  }
}
.signed-days {
  margin-right: 30px;
  margin-bottom: 8px;
  font-size: 12px; /* px-to-viewport-ignore */
  font-weight: 300;
  letter-spacing: 1px;
  color: rgb(225, 225, 225, 0.8);

  &-num {
    color: #ffcd71;
  }
}
.signin-list {
  width: 992px;
}
.signin-day {
  margin: 0 20px 20px 0;
  width: 228px;
  height: 228px;
}
.signin-day1 {
  background-image: url('@/assets/images/signin/signin-day1.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day1-active.png');
  }
}
.signin-day2 {
  background-image: url('@/assets/images/signin/signin-day2.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day2-active.png');
  }
}
.signin-day3 {
  background-image: url('@/assets/images/signin/signin-day3.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day3-active.png');
  }
}
.signin-day4 {
  background-image: url('@/assets/images/signin/signin-day4.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day4-active.png');
  }
}
.signin-day5 {
  background-image: url('@/assets/images/signin/signin-day5.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day5-active.png');
  }
}
.signin-day6 {
  background-image: url('@/assets/images/signin/signin-day6.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day6-active.png');
  }
}
.signin-day7 {
  background-image: url('@/assets/images/signin/signin-day7.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day7-active.png');
  }
}
.signin-day8 {
  background-image: url('@/assets/images/signin/signin-day8.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day8-active.png');
  }
}
.signin-day9 {
  background-image: url('@/assets/images/signin/signin-day9.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day9-active.png');
  }
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
@/stores/menu
