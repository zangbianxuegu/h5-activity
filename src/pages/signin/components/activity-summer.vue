<template>
  <div class="main">
    <div class="title-box">
      <h1
        class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      >
        暑期签到
      </h1>
      <div class="date flex items-center align-middle">
        <div class="date-text">{{ time }}</div>
        <div
          class="date-help bg-contain bg-center bg-no-repeat"
          @click="handleHelp"
        ></div>
      </div>
    </div>
    <div class="main-content flex">
      <div class="signin-list flex flex-wrap">
        <div
          v-for="(item, index) in rewardList"
          :key="item.stage"
          :class="[
            'signin-item bg-contain bg-center bg-no-repeat',
            {
              'signin-item--left-top': index === 0,
              'signin-item--right-top': index === 3,
              'signin-item--left-bottom': index === 4,
              'signin-item--right-bottom': index === 7,
            },
          ]"
        >
          <div class="signin-title text-center">{{ item.stage }}天</div>
          <div
            class="signin-content flex items-center justify-center"
            @click="handleReward(item.status, index + 1)"
          >
            <div
              :class="[
                'signin-reward bg-contain bg-center bg-no-repeat',
                `signin-reward-${item.reward}`,
                `${item.status}`,
              ]"
            ></div>
          </div>
        </div>
      </div>
      <div class="signin-count bg-contain bg-center bg-no-repeat text-center">
        <div class="signin-title"></div>
        <div class="signin-count-num">
          <span>{{ activityData.value }}</span
          >天
        </div>
        <div class="absolute bottom-0 w-full text-center">
          <p class="signin-forget-num">漏签<span>2</span>天</p>
          <div
            class="signin-btn signin-btn-replenishment overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            补签
          </div>
        </div>
      </div>
    </div>
    <div
      class="signin-btn signin-btn-today overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      :class="{ 'disabled opacity-60': isTodaySignIn }"
      @click="handleSignin"
    >
      今日签到
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
            :src="handleSrc(String(curRewards.count))"
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
  eden_fragment: string
}

const rewardsText: RewardsName = {
  eden_fragment: '伊甸之眼碎片',
}

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const activityData: Ref<Event> = ref({
  task_id: 'activity_sign_in_m3',
  stages: [1, 3, 5, 7, 9, 12, 15, 20],
  award: [0, 0, 0, 0, 0, 0, 0, 0],
  value: 0,
  score: '',
  is_eggy_reward: false,
  is_today_sign_in: false,
  awarded_types: [],
})
const isTodaySignIn = ref(false)
const curRewards: Ref<Rewards> = ref({
  name: '',
  count: 10,
})
const rewardList = ref([
  {
    stage: 1,
    reward: 10,
    status: 'wait',
  },
  {
    stage: 3,
    reward: 10,
    status: 'wait',
  },
  {
    stage: 5,
    reward: 10,
    status: 'wait',
  },
  {
    stage: 7,
    reward: 10,
    status: 'wait',
  },
  {
    stage: 10,
    reward: 20,
    status: 'wait',
  },
  {
    stage: 15,
    reward: 20,
    status: 'wait',
  },
  {
    stage: 20,
    reward: 20,
    status: 'wait',
  },
  {
    stage: 25,
    reward: 20,
    status: 'wait',
  },
])

defineProps({
  time: String,
})

const emit = defineEmits<{
  onReward: [value: number]
}>()

onMounted(() => {
  getActivityData()
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../../assets/images/signin/summer-reward-${name}-wait.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_sign_in_3' }, function (data) {
    activityData.value = data?.activity_sign_in_3[0]
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
    console.log('summer activityData: ', activityData.value)
    rewardList.value = rewardList.value.map((item, index) => {
      return {
        ...item,
        status:
          activityData.value.award[index] === 1
            ? 'redeemed'
            : item.stage > activityData.value.value
            ? 'wait'
            : 'can',
      }
    })
  })
}

// 签到
function handleSignin(): void {
  if (isTodaySignIn.value) {
    showToast('今日已签到')
    return
  }
  // 更新任务进度，更新 value
  setPlayerTask({ task: 'activity_sign_in_m3' }, function () {
    showToast('签到成功')
    getActivityData()
  })
}

// 领奖
function handleReward(status: string, rewardId: number): void {
  if (status === 'redeemed') {
    showToast('已领奖')
    return
  }
  if (status === 'wait') {
    showToast('签到天数不足')
    return
  }
  claimMissionReward(
    {
      event: 'activity_sign_in_3',
      task: 'activity_sign_in_m3',
      rewardId,
    },
    function (rewards) {
      console.log('summer rewards: ', rewards)
      getActivityData()
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
    },
  )
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  padding-left: 825px;
  padding-top: 120px;
}
.title-box {
  height: 188px;
}
.title {
  width: 902px;
  height: 188px;
  background-image: url('@/assets/images/signin/summer-title.png');
}
.date {
  margin-left: 485px;
  margin-top: -150px;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: rgba(255, 255, 255, 0.7);
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 48px;
    height: 49px;
    background-image: url('@/assets/images/signin/help.png');
  }
}
.main-content {
  margin-top: 25px;
  margin-left: 30px;
}
.signin-list {
  width: 920px;
}
.signin-item {
  margin: 0 12px 12px 0;
  width: 218px;
  height: 284px;
  background-image: url('@/assets/images/signin/summer-day-bg.png');

  &--left-top {
    background-image: url('@/assets/images/signin/summer-day-bg-left-top.png');
  }

  &--right-top {
    background-image: url('@/assets/images/signin/summer-day-bg-right-top.png');
  }

  &--left-bottom {
    background-image: url('@/assets/images/signin/summer-day-bg-left-bottom.png');
  }

  &--right-bottom {
    background-image: url('@/assets/images/signin/summer-day-bg-right-bottom.png');
  }
}
.signin-title {
  height: 80px;
  line-height: 80px;
  font-size: 40px;
  color: #fff;
  letter-spacing: 1px;
}
.signin-content {
  width: 218px;
  height: 204px;
}
.signin-reward {
  &.wait {
    margin-top: 5px;
    width: 164px;
    height: 163px;
  }

  &.can {
    margin-top: 5px;
    margin-left: -5px;
    width: 184px;
    height: 184px;
  }

  &.redeemed {
    margin-top: 5px;
    margin-left: -1px;
    width: 181px;
    height: 181px;
  }

  &-10 {
    &.wait {
      background-image: url('@/assets/images/signin/summer-reward-10-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/summer-reward-10-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/summer-reward-10-redeemed.png');
    }
  }

  &-20 {
    &.wait {
      background-image: url('@/assets/images/signin/summer-reward-20-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/summer-reward-20-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/summer-reward-20-redeemed.png');
    }
  }
}
.signin-count {
  position: relative;
  margin-left: 15px;
  width: 235px;
  height: 575px;
  background-image: url('@/assets/images/signin/summer-signin-count.png');
}
.signin-btn {
  margin-bottom: 20px;

  &-replenishment {
    margin-left: 17px;
    width: 202px;
    height: 104px;
    background-image: url('@/assets/images/signin/summer-btn-replenishment.png');
  }

  &-today {
    margin: 76px 0 0 50px;
    width: 406px;
    height: 114px;
    background-image: url('@/assets/images/signin/summer-btn-today.png');
  }
}
.signin-count-num {
  margin-top: 120px;
  font-size: 100px;
  color: #fff;
}
.signin-forget-num {
  width: 100%;
  font-size: 30px;
  font-weight: 300;
  color: rgba(63, 106, 170, 0.9);
}
.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
.modal-reward {
  width: 164px;
  height: 163px;
}
</style>
