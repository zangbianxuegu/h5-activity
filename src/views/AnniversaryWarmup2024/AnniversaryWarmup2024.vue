<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="anniversary flex h-screen">
      <div class="anniversary-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              成为派对新星吧！
            </h1>
            <div class="date flex items-center align-middle">
              <div class="date-text">6.21-6.28</div>
              <div
                class="date-help bg-contain bg-center bg-no-repeat"
                @click="handleHelp"
              ></div>
            </div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <ul class="task-list flex flex-row flex-wrap">
            <li
              v-for="(item, index) in taskList"
              :key="item.stage"
              :class="[
                'task-item bg-contain bg-center bg-no-repeat indent-[-9999px]',
                `task1-${index + 1}`,
                `${item.status}`,
              ]"
              @click="handleReward(item.name, item.status)"
            >
              {{ item.title }}
              <ol
                v-if="index >= 2"
                class="task-indicates flex justify-center overflow-hidden"
              >
                <li
                  v-for="(_, j) in Array.from({ length: item.stage })"
                  :key="j"
                  class="task-indicate overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
                  :class="{ active: item.value >= j + 1 }"
                >
                  {{ j + 1 }}
                </li>
              </ol>
            </li>
          </ul>
        </Transition>
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年6月21日~2024年6月28日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，在舞台成功完成1次节目留影，即可领取<span
                class="text-[#ffcb4d]"
                >留影蜡烛*1，体型重塑*1</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，给1位好友发送周年派对的邀请函，即可领取<span
                class="text-[#ffcb4d]"
                >浪漫烟花*1，生日蛋糕切件*1</span
              >；
            </p>
            <p class="modal-text">
              3、活动期间，与舞池中的8位员工逐一拥抱，即可领取<span
                class="text-[#ffcb4d]"
                >传信纸船*1，体型重塑*1</span
              >；
            </p>
            <p class="modal-text">
              4、活动期间，累计3天与吧台员工对饮，即可领取<span
                class="text-[#ffcb4d]"
                >蜡烛*2，生日蛋糕*1</span
              >；
            </p>
            <p class="modal-text">
              5、活动期间，累计5天在舞池狂欢庆祝，即可领取<span
                class="text-[#ffcb4d]"
                >爱心*2，生日庆典大蛋糕*1</span
              >。
            </p>
          </template>
        </activity-modal>
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
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import { type Event, type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

const rewardMap = {
  activity_anniversary_warmup_2024_m1: [
    {
      name: '留影蜡烛*1',
      img: 'recording_candle',
    },
    {
      name: '体型重塑*1',
      img: 'resize_potion',
    },
  ],
  activity_anniversary_warmup_2024_m2: [
    {
      name: '浪漫烟花*1',
      img: 'fireworks',
    },
    {
      name: '生日蛋糕切件*1',
      img: 'birthdaycake_small',
    },
  ],
  activity_anniversary_warmup_2024_m3: [
    {
      name: '传信纸船*1',
      img: 'message_boat',
    },
    {
      name: '体型重塑*1',
      img: 'resize_potion',
    },
  ],
  activity_anniversary_warmup_2024_m4: [
    {
      name: '蜡烛*2',
      img: 'candles',
    },
    {
      name: '生日蛋糕*1',
      img: 'birthdaycake_medium',
    },
  ],
  activity_anniversary_warmup_2024_m5: [
    {
      name: '爱心*2',
      img: 'heart',
    },
    {
      name: '生日庆典大蛋糕*1',
      img: 'birthdaycake_large',
    },
  ],
}

const curRewards = ref(rewardMap.activity_anniversary_warmup_2024_m1)

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

const menuStore = useMenuStore()
const activityStore = useActivityStore()
// 活动数据
const activityData = computed(
  () => activityStore.eventData.activity_anniversary_warmup_2024,
)

const TASK_LIST = [
  {
    name: 'activity_anniversary_warmup_2024_m1',
    title: '在舞台成功完成1次节目留影',
    stage: 1,
    status: 'wait',
  },
  {
    name: 'activity_anniversary_warmup_2024_m2',
    title: '给1位好友发送周年派对邀请函',
    stage: 2,
    status: 'wait',
  },
  {
    name: 'activity_anniversary_warmup_2024_m3',
    title: '与舞池中的8位员工逐一拥抱',
    stage: 3,
    status: 'wait',
  },
  {
    name: 'activity_anniversary_warmup_2024_m4',
    title: '累计3天与吧台员工对饮',
    stage: 4,
    status: 'wait',
  },
  {
    name: 'activity_anniversary_warmup_2024_m5',
    title: '累计5天在舞池狂欢庆祝',
    stage: 5,
    status: 'wait',
  },
]
// 主任务列表状态
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value[index]
    return {
      ...item,
      value: activity.value,
      stage: activity.stages[0],
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
            ? 'can'
            : 'wait',
    }
  })
})

const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))

const isVisited = Session.get('isVisitedAnniversaryWarmup2024')
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
  Session.set('isVisitedAnniversaryWarmup2024', true)
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

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_anniversary_warmup_2024' })
    .then((res) => {
      // 获取数据并按照 ALL_TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activity_anniversary_warmup_2024.sort(
          (a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
            const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
            return orderA - orderB
          },
        )
      // 是否已领奖：所有任务已领奖
      const isClaimedReward = !activityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      // 更新菜单数据 isClaimedReward
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_anniversary_warmup_2024',
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData(
        'activity_anniversary_warmup_2024',
        activityData,
      )
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 领奖
function handleReward(task: string, status: string): void {
  if (status === 'redeemed') {
    showToast('已领奖')
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: 'activity_anniversary_warmup_2024',
    task,
    rewardId: 1,
  })
    .then(async (res) => {
      console.log('reward res: ', res)
      curRewards.value = rewardMap[task as keyof typeof rewardMap]
      modalReward.value?.openModal()

      // 更新页面数据
      const newActivityData = activityData.value.map((item) => {
        const newItem = { ...item }
        if (item.task_id === task) {
          newItem.award = [1]
        }
        return newItem
      })
      activityStore.updateEventData(
        'activity_anniversary_warmup_2024',
        newActivityData,
      )
      const isClaimedReward = !newActivityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_anniversary_warmup_2024',
        isClaimedReward,
      )
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
    background-image: url('@/assets/images/anniversary-warmup-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 42px;
  top: 99px;
}
.title {
  position: absolute;
  width: 1147px;
  height: 251px;
  background-image: url('@/assets/images/anniversary-warmup-2024/title.png');
}
.date {
  position: absolute;
  left: 739px;
  top: 199px;
  transform: skewY(-4deg);

  &-text {
    font-size: 48px;
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
.task-list {
  position: absolute;
  left: 150px;
  top: 509px;
}
.task-item {
  position: relative;
  margin-right: 40px;
  width: 264px;
  height: 411px;

  &:last-of-type {
    margin-right: 0;
  }
}
@for $i from 1 through 5 {
  .task1-#{$i} {
    &.wait {
      background-image: url('@/assets/images/anniversary-warmup-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/anniversary-warmup-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/anniversary-warmup-2024/task#{$i}-redeemed.png');
    }
  }
}
.task-indicates {
  position: absolute;
  bottom: -38px;
  left: 1px;
  width: 257px;
}
.task-indicate {
  margin-left: 7px;
  width: 26px;
  height: 25px;
  background-image: url('@/assets/images/anniversary-warmup-2024/star.png');

  &:first-child {
    margin-left: 0;
  }

  &.active {
    background-image: url('@/assets/images/anniversary-warmup-2024/star-active.png');
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
</style>
