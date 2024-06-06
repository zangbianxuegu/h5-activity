<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season22-sprint flex h-screen">
      <div class="season22-sprint-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            闲适安居 筑巢小憩
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <ul
              class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
            >
              <li
                v-for="(item, index) in taskList"
                :key="item.name"
                :class="[
                  'task-item overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `task-item${index + 1}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.name, item.status)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
        </Transition>
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年7月11日~2024年7月17日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，完成所有季节任务，即可领取<span
                class="text-[#ffcb4d]"
                >体型重塑</span
              >×2；
            </p>
            <p class="modal-text">
              2、活动期间，累计收集50根蜡烛，即可领取<span
                class="text-[#ffcb4d]"
                >蜡烛</span
              >×2；
            </p>
            <p class="modal-text">
              3、活动期间，累计登录5天，即可领取<span class="text-[#ffcb4d]"
                >爱心</span
              >×2；
            </p>
            <p class="modal-text">
              4、活动期间，达成筑巢季毕业，即可领取<span class="text-[#ffcb4d]"
                >季节蜡烛</span
              >×6（奖励将在下个季节开始后的一周内通过邮件发放）。
            </p>
          </template>
        </activity-modal>
        <activity-modal ref="modalReward">
          <template #content>
            <div v-if="rewardModalType === 'defaultType'">
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
            </div>
            <div v-else>
              <p class="modal-text">领取奖励说明：</p>
              <p class="modal-text mt-1">
                2024年7月25日<span class="text-[#ffcb4d]">新版本更新后</span
                >，可在游戏内通过<span class="text-[#ffcb4d]">邮件</span
                >领取<span class="text-[#ffcb4d]">季节蜡烛*6</span
                >，感谢您的参与！
              </p>
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
import type { Event, DesignConfig, EventDataKeys } from '@/types'
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
  resize_potion: string
  candles: string
  heart: string
  season_candle: string
}

const rewardsText: RewardsName = {
  resize_potion: '体型重塑',
  candles: '蜡烛',
  heart: '爱心',
  season_candle: '新赛季季节蜡烛',
}

// delayType任务4是发延迟奖品，奖品弹窗形式有所区别
const rewardModalType = ref<'defaultType' | 'delayType'>('defaultType')

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

const EVENT_NAME: EventDataKeys =
  activityStore.activeEventName.activity_season22_sprint

// 活动数据
const activityData = computed(
  () => activityStore.eventData[EVENT_NAME] as Event[],
)
const curRewards: Ref<Rewards> = ref({
  name: 'resize_potion',
  count: 1,
})
const TASK_LIST = [
  {
    name: 'activity_season22_sprint_m1',
    title: '完成全部季节活动',
    status: 'wait',
  },
  {
    name: 'collecting_candles',
    title: '累计收集50根蜡烛',
    status: 'wait',
  },
  {
    name: 'login_days',
    title: '累计登录5天',
    status: 'wait',
  },
  {
    name: 'activity_season22_sprint_m4',
    title: '筑巢季毕业',
    status: 'wait',
  },
]
const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value[index]
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

const isVisited = Session.get('isVisitedSeason22Sprint')
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
  Session.set('isVisitedSeason22Sprint', true)
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
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      // 获取数据并按照 TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activity_season22_sprint.sort(
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
        EVENT_NAME as string,
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData(EVENT_NAME, activityData)
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
    event: EVENT_NAME,
    task,
    rewardId: 1,
  })
    .then((res) => {
      const rewards = res.data.rewards
      if (task === 'activity_season22_sprint_m4') {
        rewardModalType.value = 'delayType'
      } else {
        rewardModalType.value = 'defaultType'
        curRewards.value = {
          name: Object.keys(rewards)[0],
          count: Number(Object.values(rewards)[0]),
        }
      }
      modalReward.value?.openModal()
      // 后端接口请求限制间隔 3s
      // 优化用户体验，不再延时请求接口，直接前端更新数据展示
      const newActivityData = activityData.value.map((item) => {
        return {
          ...item,
          award: item.task_id === task ? [1] : item.award,
        }
      })
      activityStore.updateEventData(EVENT_NAME, newActivityData)
      const isClaimedReward = !newActivityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      menuStore.updateMenuDataByIsClaimedReward(
        EVENT_NAME as string,
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
.season22-sprint {
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
    background-image: url('@/assets/images/season22-sprint/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 448px;
  top: 840px;
  width: 1166px;
  height: 267px;
  background-image: url('@/assets/images/season22-sprint/title.png');
}
.date-help {
  position: absolute;
  top: -2px;
  right: 31px;
  border-radius: 50%;
  width: 47px;
  height: 47px;
}
.task-item {
  width: 360px;
  height: 360px;
  position: absolute;
}
@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/season22-sprint/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/season22-sprint/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/season22-sprint/task#{$i}-redeemed.png');
    }
    @if $i == 1 {
      top: 402px;
      left: 330px;
    }
    @if $i == 2 {
      top: 496px;
      left: 666px;
    }
    @if $i == 3 {
      top: 496px;
      left: 1000px;
    }
    @if $i == 4 {
      top: 402px;
      left: 1356px;
    }
  }
}
.finish-all-task-img-container {
  width: 356px;
  height: 241px;
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
