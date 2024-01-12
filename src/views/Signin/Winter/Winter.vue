<template>
  <div class="winter flex h-screen flex-col items-center justify-center">
    <div class="winter-wrapper">
      <div class="flex">
        <h1
          class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
        >
          冬季签到
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
          <div class="signin-title">已累计签到</div>
          <div class="signin-count-num">
            <span>{{ activityData.value }}</span
            >天
          </div>
          <div class="signin-actions">
            <p class="signin-forget-num">（漏签<span>1</span>天）</p>
            <div
              class="signin-btn signin-btn-replenishment overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              补签
            </div>
            <div
              class="signin-btn signin-btn-today overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
              :class="{ 'disabled opacity-60': isTodaySignIn }"
              @click="handleSignin"
            >
              今日签到
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
              :src="handleSrc(String(curRewards.count))"
              alt="reward"
            />
          </div>
        </template>
      </activity-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import {
  getPlayerMissionData,
  setPlayerTask,
  claimMissionReward,
} from '@/utils/request'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menuStore'

const menuStore = useMenuStore()

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
  snow_token: string
}

const rewardsText: RewardsName = {
  snow_token: '雪花',
}

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const activityData: Ref<Event> = ref({
  task_id: 'activity_sign_in_m2',
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
    stage: 9,
    reward: 20,
    status: 'wait',
  },
  {
    stage: 12,
    reward: 20,
    status: 'wait',
  },
  {
    stage: 15,
    reward: 30,
    status: 'wait',
  },
  {
    stage: 20,
    reward: 30,
    status: 'wait',
  },
])

defineProps({
  time: String,
})

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
    `../../../../assets/images/signin/winter-reward-${name}-wait.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_sign_in_2' }, function (data) {
    activityData.value = data?.activity_sign_in_2[0]
    isTodaySignIn.value = Boolean(activityData.value.is_today_sign_in)
    const shouldClaimedRewardCount = activityData.value.stages.filter(
      (stage) => stage <= activityData.value.value,
    ).length
    const isClaimedReward =
      activityData.value.award.filter((item) => item === 1).length ===
      shouldClaimedRewardCount
    // 更新菜单数据 isClaimedReward
    menuStore.updateMenuDataByIsClaimedReward(
      'activity_sign_in_2',
      isClaimedReward,
    )
    console.log('winter menuStore: ', menuStore)
    console.log('winter activityData: ', activityData.value)
    // 更新奖励列表状态
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
  setPlayerTask({ task: 'activity_sign_in_m2' }, function () {
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
      event: 'activity_sign_in_2',
      task: 'activity_sign_in_m2',
      rewardId,
    },
    function (rewards) {
      console.log('winter rewards: ', rewards)
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
.title {
  width: 471px;
  height: 152px;
  background-image: url('@/assets/images/signin/winter-title.png');
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
.main-content {
  margin-top: 27px;
  margin-left: 12px;
}
.signin-list {
  width: 1248px;
}
.signin-item {
  margin: 0 12px 12px 0;
  width: 300px;
  height: 340px;
  background-image: url('@/assets/images/signin/winter-day-bg.png');

  &--left-top {
    background-image: url('@/assets/images/signin/winter-day-bg-left-top.png');
  }

  &--right-top {
    background-image: url('@/assets/images/signin/winter-day-bg-right-top.png');
  }

  &--left-bottom {
    background-image: url('@/assets/images/signin/winter-day-bg-left-bottom.png');
  }

  &--right-bottom {
    background-image: url('@/assets/images/signin/winter-day-bg-right-bottom.png');
  }
}
.signin-title {
  height: 90px;
  line-height: 90px;
  font-size: 40px;
  color: #fff;
  letter-spacing: 1px;
}
.signin-content {
  width: 300px;
  height: 250px;
}
.signin-reward {
  &.wait {
    width: 190px;
    height: 181px;
  }

  &.can {
    margin-top: 40px;
    width: 291px;
    height: 248px;
  }

  &.redeemed {
    margin-top: 16px;
    width: 241px;
    height: 224px;
  }

  &-10 {
    &.wait {
      background-image: url('@/assets/images/signin/winter-reward-10-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/winter-reward-10-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/winter-reward-10-redeemed.png');
    }
  }

  &-20 {
    &.wait {
      background-image: url('@/assets/images/signin/winter-reward-20-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/winter-reward-20-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/winter-reward-20-redeemed.png');
    }
  }

  &-30 {
    &.wait {
      background-image: url('@/assets/images/signin/winter-reward-30-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/winter-reward-30-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/winter-reward-30-redeemed.png');
    }
  }
}
.signin-count {
  position: relative;
  margin-left: 2px;
  width: 498px;
  height: 694px;
  background-image: url('@/assets/images/signin/winter-signin-count.png');
}
.signin-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.signin-btn {
  margin-bottom: 20px;

  &-replenishment {
    margin-left: 53px;
    width: 391px;
    height: 87px;
    background-image: url('@/assets/images/signin/winter-btn-replenishment.png');
  }

  &-today {
    margin-left: 46px;
    width: 406px;
    height: 114px;
    background-image: url('@/assets/images/signin/winter-btn-today.png');
  }
}
.signin-count-num {
  margin-top: 80px;
  font-size: 120px;
  color: #fff;
}
.signin-forget-num {
  width: 100%;
  font-size: 30px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
}
.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
.modal-reward {
  width: 190px;
  height: 181px;
}
</style>

<!-- <template>
  <div>
    <p>SubPage1</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style> -->
