<template>
  <div class="main">
    <div class="flex">
      <h1
        class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      >
        假日打卡
      </h1>
      <div class="date flex items-center align-middle">
        <div class="date-text">{{ time }}</div>
        <div
          class="date-help bg-contain bg-center bg-no-repeat"
          @click="handleHelp"
        ></div>
      </div>
    </div>
    <div class="flex">
      <img class="photo" src="@/assets/images/signin/photo.png" alt="img" />
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
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import {
  getPlayerMissionData,
  setPlayerTask,
  claimMissionReward,
} from '@/utils/request'
import ActivityModal from './activity-modal.vue'

interface Event {
  task_id: string
  stages: number[]
  award: number[]
  value: number
  score: string
  is_eggy_reward: boolean
  is_today_sign_in: boolean
  awarded_types: any[]
}

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
const activityData: Ref<Event> = ref({
  task_id: 'activity_sign_in_m1',
  stages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  award: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  value: 0,
  score: '',
  is_eggy_reward: false,
  is_today_sign_in: false,
  awarded_types: [],
})
const isTodaySignIn = ref(false)
const curRewards: Ref<Rewards> = ref({
  name: 'rainbow',
  count: 1,
})
const rewardId = ref(1)

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

defineProps({
  time: String,
})

const emit = defineEmits<{
  onReward: [value: number]
}>()

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../../assets/images/signin/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_sign_in_1' }, function (data) {
    activityData.value = data?.activity_sign_in_1[0]
    rewardId.value = activityData.value.value
    isTodaySignIn.value = Boolean(activityData.value.is_today_sign_in)
    const shouldClaimedRewardCount = activityData.value.stages.filter(
      (stage) => stage <= activityData.value.value,
    ).length
    const isClaimedReward =
      activityData.value.award.filter((item) => item === 1).length ===
      shouldClaimedRewardCount
        ? 1
        : 0
    emit('onReward', isClaimedReward)
    console.log('signin activityData: ', activityData.value)
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
  setPlayerTask({ task: 'activity_sign_in_m1' }, function () {
    // 更新 reward_id
    rewardId.value++

    // 领奖
    claimMissionReward(
      {
        event: 'activity_sign_in_1',
        task: 'activity_sign_in_m1',
        rewardId: rewardId.value,
      },
      function (rewards) {
        console.log('signin rewards: ', rewards)
        getActivityData()
        modalReward.value?.openModal()
        curRewards.value = {
          name: Object.keys(rewards)[0],
          count: Number(Object.values(rewards)[0]),
        }
      },
    )
  })
}
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  left: 759px;
  top: 117px;
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
