<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="nature flex h-screen">
      <div class="nature-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              予光千缕碧浪万顷
            </h1>
            <div class="date flex items-center align-middle">
              <div class="date-text">5.28-6.10</div>
              <div
                class="date-help bg-contain bg-center bg-no-repeat"
                @click="handleHelp"
              ></div>
            </div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <!-- 主任务 -->
            <div class="main-box">
              <div class="main-task">
                <ul class="task-list flex flex-row flex-wrap">
                  <li
                    v-for="(item, index) in taskList"
                    :key="item.stage"
                    :class="[
                      'task-item bg-contain bg-center bg-no-repeat',
                      `task1-${index + 1}`,
                      `${item.status}`,
                    ]"
                    @click="handleReward(item.name, item.status, index + 1)"
                  >
                    <p class="task-text">
                      <span>{{ Number(item.stage) / 10000 }}</span>
                      <span class="task-text-unit">万</span>
                    </p>
                  </li>
                </ul>
                <!-- 进度 -->
                <div class="progress">
                  <div class="progress-inner">
                    <div
                      :class="[
                        'progress-wave-mask',
                        `progress-wave-mask-${progress}`,
                      ]"
                    >
                      <div ref="progressWave" class="progress-wave"></div>
                    </div>
                    <div
                      ref="progressConch"
                      :class="['progress-conch', `progress-conch-${progress}`]"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 其他任务 -->
            <div class="sub-task">
              <ul class="sub-task-list flex flex-row flex-wrap">
                <li
                  v-for="(item, index) in subTaskList"
                  :key="item.name"
                  :class="[
                    'sub-task-item overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                    `sub-task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.name, item.status, 1)"
                >
                  {{ item.title }}
                </li>
              </ul>
            </div>
          </div>
        </Transition>
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年5月28日~2024年6月10日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、全服污染物清除数量达到200万次，即可领取<span
                class="text-[#ffcb4d]"
                >呼吸药剂*2</span
              >；
            </p>
            <p class="modal-text">
              2、全服污染物清除数量达到400万次，获得<span class="text-[#ffcb4d]"
                >海蓝波浪发型试用魔法*2</span
              >；
            </p>
            <p class="modal-text">
              3、全服污染物清除数量达到600万次，获得<span class="text-[#ffcb4d]"
                >璀璨之星*2</span
              >；
            </p>
            <p class="modal-text">
              4、全服污染物清除数量达到800万次，获得<span class="text-[#ffcb4d]"
                >筑巢季蜡烛*2</span
              >；
            </p>
            <p class="modal-text">
              5、全服污染物清除数量达到1000万次，获得<span
                class="text-[#ffcb4d]"
                >体型重塑*2</span
              >；
            </p>
            <p class="modal-text">
              6、活动期间，清除一次污染物，可获得
              <span class="text-[#ffcb4d]">蜡烛*1</span>；
            </p>
            <p class="modal-text">
              7、活动期间，收集10个珍珠代币，可获得

              <span class="text-[#ffcb4d]">蜡烛*1</span>；
            </p>
            <p class="modal-text">
              8、活动期间，用珍珠代币兑换任意一件自然日外观，可获得

              <span class="text-[#ffcb4d]">爱心*2</span>。
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
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
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
  breath_potion: string
  outfit_hair_naturewater: string
  glow: string
  season_candle: string
  resize_potion: string
  candles: string
  heart: string
}

const rewardsText: RewardsName = {
  breath_potion: '呼吸药剂',
  outfit_hair_naturewater: '海蓝波浪发型试用魔法',
  glow: '璀璨之星',
  season_candle: '筑巢季蜡烛',
  resize_potion: '体型重塑',
  candles: '蜡烛',
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

const menuStore = useMenuStore()
const activityStore = useActivityStore()
// 活动数据
const activityData = computed(
  () => activityStore.eventData.activity_nature_2024,
)
const curRewards: Ref<Rewards> = ref({
  name: 'breath_potion',
  count: 2,
})
const TASK_LIST = [
  {
    name: 'activity_nature_2024_m1',
    title: '全服污染物清除数量200万',
    stage: 1,
    status: 'wait',
  },
  {
    name: 'activity_nature_2024_m1',
    title: '全服污染物清除数量400万',
    stage: 2,
    status: 'wait',
  },
  {
    name: 'activity_nature_2024_m1',
    title: '全服污染物清除数量600万',
    stage: 3,
    status: 'wait',
  },
  {
    name: 'activity_nature_2024_m1',
    title: '全服污染物清除数量800万',
    stage: 4,
    status: 'wait',
  },
  {
    name: 'activity_nature_2024_m1',
    title: '全服污染物清除数量1000万',
    stage: 5,
    status: 'wait',
  },
]
// 主任务列表状态
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value[0]
    return {
      ...item,
      value: activity.value,
      stage: activity.stages[index],
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
const SUB_TASK_LIST = [
  {
    name: 'activity_nature_2024_m2',
    title: '清除一次污染物',
    status: 'wait',
  },
  {
    name: 'collecting_event_candles',
    title: '收集10个珍珠代币',
    status: 'wait',
  },
  {
    name: 'activity_nature_2024_m4',
    title: '用珍珠代币兑换一件自然日外观',
    status: 'wait',
  },
]
// 其他任务列表数据
const subTaskList = computed(() => {
  return SUB_TASK_LIST.map((item, index) => {
    const activity = activityData.value[index + 1]
    return {
      ...item,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
          ? 'can'
          : 'wait',
    }
  })
})

const ALL_TASK_LIST = [
  {
    name: 'activity_nature_2024_m1',
  },
  {
    name: 'activity_nature_2024_m2',
  },
  {
    name: 'collecting_event_candles',
  },
  {
    name: 'activity_nature_2024_m4',
  },
]

const taskOrderMap = new Map(
  ALL_TASK_LIST.map((task, index) => [task.name, index]),
)

const progress = computed(() => {
  let val = Math.abs(Number(activityData.value[0].value))
  if (val < 2000000) {
    val = 0
  } else if (val >= 2000000 && val < 4000000) {
    val = 1
  } else if (val >= 4000000 && val < 6000000) {
    val = 2
  } else if (val >= 6000000 && val < 8000000) {
    val = 3
  } else if (val >= 8000000 && val < 10000000) {
    val = 4
  } else if (val >= 10000000) {
    val = 5
  }
  return val
})

const isVisited = Session.get('isVisitedNature2024')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

const progressWave = ref<HTMLDivElement | null>(null)
const progressConch = ref<HTMLDivElement | null>(null)
onMounted(() => {
  try {
    if (progressConch.value) {
      progressConch.value.addEventListener('animationstart', () => {
        if (progressWave.value) {
          progressWave.value.classList.add('active')
        }
      })
    }
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedNature2024', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/nature-2024/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_nature_2024' })
    .then((res) => {
      // 获取数据并按照 ALL_TASK_LIST 的顺序进行排序
      const activityData: Event[] = res.data.event_data?.activity_nature_2024
        .sort((a: Event, b: Event) => {
          const orderA = taskOrderMap.get(a.task_id) ?? ALL_TASK_LIST.length
          const orderB = taskOrderMap.get(b.task_id) ?? ALL_TASK_LIST.length
          return orderA - orderB
        })
        .map((item: Event) => {
          return {
            ...item,
            value: Math.abs(Number(item.value)),
          }
        })
      // 是否已领奖：所有任务已领奖
      // - 任务1：主任务获得的奖励已全部领取
      // - 任务2：其他任务已领奖（不存在可领奖但未领奖任务）
      const shouldM1ClaimedRewardCount = activityData[0].stages.filter(
        (stage) => stage <= activityData[0].value,
      ).length
      const isM1ClaimedReward =
        activityData[0].award.filter((item) => item === 1).length >=
        shouldM1ClaimedRewardCount
      const isClaimedReward =
        isM1ClaimedReward &&
        !activityData.some(
          (item) => item.award[0] === 0 && item.value >= item.stages[0],
        )
      // 更新菜单数据 isClaimedReward
      console.log('menuStore: ', menuStore)
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_nature_2024',
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData('activity_nature_2024', activityData)
      console.log('activityStore: ', activityStore)
    })
    .catch((error) => {
      console.log('nature2024.vue', error)
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
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: 'activity_nature_2024',
    task,
    rewardId,
  })
    .then((res) => {
      const rewards = res.data.rewards
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 分别对主任务和其他任务处理显示
      const newActivityData = activityData.value.map((item, index) => {
        const newItem = { ...item }
        if (task === 'activity_nature_2024_m1' && index === 0) {
          newItem.award[rewardId - 1] = 1
        } else if (item.task_id === task) {
          newItem.award = [1]
        }
        return newItem
      })
      activityStore.updateEventData('activity_nature_2024', newActivityData)
      const shouldM1ClaimedRewardCount = newActivityData[0].stages.filter(
        (stage) => stage <= newActivityData[0].value,
      ).length
      const isM1ClaimedReward =
        newActivityData[0].award.filter((item) => item === 1).length ===
        shouldM1ClaimedRewardCount
      const isClaimedReward =
        isM1ClaimedReward &&
        !newActivityData.some(
          (item) => item.award[0] === 0 && item.value >= item.stages[0],
        )
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_nature_2024',
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
.nature {
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
    background-image: url('@/assets/images/nature-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 440px;
  top: 138px;
}
.title {
  position: absolute;
  width: 986px;
  height: 188px;
  background-image: url('@/assets/images/nature-2024/title.png');
}
.date {
  position: absolute;
  left: 980px;
  top: 120px;

  &-text {
    font-size: 16px; /* px-to-viewport-ignore */
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
.main-box {
  position: absolute;
  left: 440px;
  top: 316px;
}
.main-task {
  position: relative;
  width: 1469px;
  height: 540px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/nature-2024/main-bg.png');
}
.progress {
  position: absolute;
  left: 13px;
  bottom: 16px;

  &-inner {
    position: relative;
    width: 1437px;
    height: 79px;
    background-repeat: no-repeat;
    background-position: left center;
    background-size: cover;
    background-image: url('@/assets/images/nature-2024/wave-bg.png');
  }

  &-wave {
    width: 1437px;
    height: 79px;
    background-repeat: no-repeat;
    background-position: left center;
    background-size: cover;
    background-image: url('@/assets/images/nature-2024/wave.png');
    opacity: 0;
    &.active {
      opacity: 1;
      transition: opacity 1s;
    }

    &-mask {
      height: 79px;
      overflow: hidden;
      // mask-image: linear-gradient(to right, #3262a5 95%, transparent);
      mask-image: linear-gradient(to right, black 95%, transparent);

      &-1 {
        width: 140px;
      }

      &-2 {
        width: 420px;
      }

      &-3 {
        width: 700px;
      }

      &-4 {
        width: 980px;
      }

      &-5 {
        width: 1473px;
      }
    }
  }

  &-conch {
    // display: none;
    position: absolute;
    will-change: transform;
    bottom: -10px;
    width: 95px;
    height: 96px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('@/assets/images/nature-2024/conch.png');

    &-1 {
      left: 0;
      animation: moveRight1 1s ease-out forwards;
    }

    &-2 {
      left: 100px;
      animation: moveRight2 1s ease-out forwards;
    }

    &-3 {
      left: 380px;
      animation: moveRight3 1s ease-out forwards;
    }

    &-4 {
      left: 660px;
      animation: moveRight4 1s ease-out forwards;
    }

    &-5 {
      left: 940px;
      animation: moveRight5 1s ease-out forwards;
    }
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes moveRight1 {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(100px, 0, 0);
  }
}
@keyframes moveRight2 {
  from {
    transform: translate3d(100px, 0, 0);
  }
  to {
    transform: translate3d(280px, 0, 0);
  }
}
@keyframes moveRight3 {
  from {
    transform: translate3d(100px, 0, 0);
  }
  to {
    transform: translate3d(280px, 0, 0);
  }
}
@keyframes moveRight4 {
  from {
    transform: translate3d(100px, 0, 0);
  }
  to {
    transform: translate3d(280px, 0, 0);
  }
}
@keyframes moveRight5 {
  from {
    transform: translate3d(100px, 0, 0);
  }
  to {
    transform: translate3d(280px, 0, 0);
  }
}

.task-list {
  position: absolute;
  left: 20px;
  top: 150px;
}
.task-item {
  margin: 0 -26px;
  width: 332px;
  height: 240px;
}
@for $i from 1 through 5 {
  .task1-#{$i} {
    &.wait {
      background-image: url('@/assets/images/nature-2024/task1-#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/nature-2024/task1-#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/nature-2024/task1-#{$i}-redeemed.png');
    }
  }
}
.task-text {
  margin-top: 240px;
  text-align: center;
  font-size: 46px;
  color: #fff;
  &-unit {
    font-size: 28px;
  }
}
.sub-task {
  position: absolute;
  left: 420px;
  bottom: 50px;
}
.sub-task-item {
  width: 500px;
  height: 150px;
}
@for $i from 1 through 3 {
  .sub-task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/nature-2024/task#{$i + 1}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/nature-2024/task#{$i + 1}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/nature-2024/task#{$i + 1}-redeemed.png');
    }
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
