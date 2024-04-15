<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season22 flex h-screen">
      <div class="season22-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              巢落大地筑梦共时
            </h1>
            <div class="date flex items-center align-middle">
              <div
                class="date-text overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
              >
                {{ activityTime }}
              </div>
              <div
                class="date-help bg-contain bg-center bg-no-repeat"
                @click="handleHelp"
              ></div>
            </div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <ul class="task-list flex flex-row flex-wrap">
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
              >2024年4月25日~2024年5月1日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              1、活动期间，完成第一个季节任务，即可领取<span
                class="text-[#ffcb4d]"
                >秋千</span
              >×2；
            </p>
            <p class="modal-text">
              2、活动期间，获得一件新季节外观，即可领取<span
                class="text-[#ffcb4d]"
                >彩虹尾迹</span
              >×2；
            </p>
            <p class="modal-text">
              3、活动期间，累计登录3天，即可领取<span class="text-[#ffcb4d]"
                >蜡烛</span
              >×2；
            </p>
            <p class="modal-text">
              4、活动期间，收集15根季节蜡烛，即可领取<span
                class="text-[#ffcb4d]"
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
  swing: string
  trail_rainbow: string
  candles: string
  heart: string
}

const rewardsText: RewardsName = {
  swing: '秋千',
  trail_rainbow: '彩虹尾迹',
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
// 活动时间字符串
const activityTime = computed(
  () => activityStore.activityTime.activity_season22_start,
)
// 活动数据
const activityData = computed(
  () => activityStore.eventData.activity_season22_start,
)
const curRewards: Ref<Rewards> = ref({
  name: 'swing',
  count: 1,
})
const TASK_LIST = [
  {
    name: 'activity_season22_start_m1',
    title: '完成第一个季节任务',
    status: 'wait',
  },
  {
    name: 'activity_season22_start_m2',
    title: '获得一件新季节外观',
    status: 'wait',
  },
  {
    name: 'login_days',
    title: '累计登录3天',
    status: 'wait',
  },
  {
    name: 'collecting_season_candles',
    title: '收集15季节蜡烛',
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

const isVisited = Session.get('isVisitedSeason22Start')
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
  Session.set('isVisitedSeason22Start', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/season22-start/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_season22_start' })
    .then((res) => {
      // 获取数据并按照 TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activity_season22_start.sort(
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
      console.log('menuStore: ', menuStore)
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_season22_start',
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData('activity_season22_start', activityData)
      console.log('activityStore: ', activityStore)
    })
    .catch((error) => {
      console.log('season22start.vue', error)
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
    event: 'activity_season22_start',
    task,
    rewardId: 1,
  })
    .then((res) => {
      const rewards = res.data.rewards
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 后端接口请求限制间隔 3s
      // 优化用户体验，不再延时请求接口，直接前端更新数据展示
      const newActivityData = activityData.value.map((item) => {
        return {
          ...item,
          award: item.task_id === task ? [1] : item.award,
        }
      })
      activityStore.updateEventData('activity_season22_start', newActivityData)
      const isClaimedReward = !newActivityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_season22_start',
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
.season22 {
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
    background-image: url('@/assets/images/season22-start/bg.jpg');
  }
}
.header {
  position: relative;
  left: 430px;
  top: 186px;
}
.title {
  position: absolute;
  width: 1203px;
  height: 230px;
  background-image: url('@/assets/images/season22-start/title.png');
}
.date {
  position: absolute;
  left: 956px;
  top: -18px;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: #fff;
    width: 173px;
    height: 36px;
    background-image: url('@/assets/images/season22-start/date.png');
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 47px;
    height: 47px;
    background-image: url('@/assets/images/season22-start/help.png');
  }
}
.task-list {
  position: absolute;
  left: 300px;
  top: 520px;
}
.task-item {
  width: 360px;
  height: 360px;
}
.task-item2,
.task-item3 {
  margin-top: 90px;
}
@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/season22-start/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/season22-start/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/season22-start/task#{$i}-redeemed.png');
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
