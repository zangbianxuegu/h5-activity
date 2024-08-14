<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="summerday flex h-screen">
      <div class="summerday-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              清凉夏末 魔法相赠
              <p>
                <time datetime="2024-08-29">8.29</time>-
                <time datetime="2024-09-11">9.11</time>
              </p>
            </div>
            <div
              class="help cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 任务列表 -->
            <h2 id="taskListHeading" class="sr-only">任务列表</h2>
            <ul
              class="task-list clear-both bg-cover"
              aria-labelledby="taskListHeading"
            >
              <li
                v-for="(item, index) in taskList"
                :key="item.id"
                :class="[
                  'task-item animate__animated animate__fadeIn animate__slow bg-contain',
                  `task-item${index + 1}`,
                  `${item.status}`,
                ]"
                :aria-label="`任务 ${index + 1}: ${item.title}`"
                @click="handleReward(item.value, item.status, 1, index)"
              >
                <p class="task-text sr-only">{{ item.title }}</p>
              </li>
            </ul>
            <!-- 累计任务列表 -->
            <h2 id="accTaskListHeading" class="sr-only">累计任务列表</h2>
            <ul class="acc-task-list" aria-labelledby="accTaskListHeading">
              <li
                v-for="(item, index) in accTaskList"
                :key="item.id"
                :class="[
                  'acc-task-item animate__animated animate__fadeIn bg-contain',
                  `acc-task-item${index + 1}`,
                  `${item.status}`,
                ]"
                :aria-label="`累计任务 ${index + 1}: ${item.title}`"
                @click="handleReward(item.value, item.status, item.id, 4)"
              >
                <p class="sr-only">{{ item.title }}</p>
              </li>
            </ul>
            <!-- 累计收集代币进度 -->
            <section
              class="acc-progress bg-contain text-center"
              aria-labelledby="accProgressHeading"
            >
              <h2 id="accProgressHeading" class="sr-only text-lg font-bold">
                累计收集代币
              </h2>
              <p class="acc-progress-count">
                <span class="sr-only">当前代币数量：</span>
                ({{ collectedCount <= 50 ? collectedCount : 50 }}/50)
              </p>
            </section>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section aria-labelledby="activity-rules-title">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年8月29日~2024年9月11日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，体验一次捉迷藏玩法，即可领取
                  <span class="text-[#ffcb4d]">烧烤架魔法*2</span>
                </li>
                <li>
                  活动期间，使用一次沙滩球魔法，即可领取
                  <span class="text-[#ffcb4d]">沙滩球魔法*2</span>
                </li>
                <li>
                  活动期间，兑换一件夏之日物品，即可领取
                  <span class="text-[#ffcb4d]">遥鲲泳圈试用魔法*2</span>
                </li>
                <li>
                  活动期间，累计登录5天，即可领取
                  <span class="text-[#ffcb4d]">体型重塑*2</span>
                </li>
                <li>
                  活动期间，收集夏之日代币，即可领取：
                  <div class="grid grid-cols-3">
                    <span>收集数目</span>
                    <span class="col-span-2">对应奖励</span>
                    <span>20个</span>
                    <span class="col-span-2 text-[#ffcb4d]">璀璨之星*1</span>
                    <span>30个</span>
                    <span class="col-span-2 text-[#ffcb4d]"
                      >冲浪板试用魔法*1</span
                    >
                    <span>50个</span>
                    <span class="col-span-2 text-[#ffcb4d]">爱心*2</span>
                  </div>
                </li>
              </ul>
            </section>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <section
              class="flex h-full flex-col"
              aria-labelledby="modalRewardTitle"
            >
              <h2 id="modalRewardTitle" class="sr-only">领奖弹框</h2>
              <p class="modal-text">
                恭喜你获得
                <span class="modal-text-blue">
                  {{ rewardsText[curRewards.name as keyof RewardsName] }} *
                  {{ curRewards.count }} </span
                >：
              </p>
              <div class="flex flex-1 items-center justify-center">
                <img
                  :src="handleSrc(String(curRewards.name))"
                  alt="reward image"
                />
              </div>
            </section>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { DesignConfig, Event } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { useActivityStore } from '@/stores/summerday2024'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  outfit_prop_marshmallow: string
  beachball: string
  outfit_prop_mantafloat: string
  resize_potion: string
  glow: string
  outfit_prop_surfboard: string
  heart: string
}
const rewardsText: RewardsName = {
  outfit_prop_marshmallow: '烧烤架魔法',
  beachball: '沙滩球魔法',
  outfit_prop_mantafloat: '遥鲲泳圈试用魔法',
  resize_potion: '体型重塑',
  glow: '璀璨之星',
  outfit_prop_surfboard: '冲浪板试用魔法',
  heart: '爱心',
}
const curRewards: Ref<Rewards> = ref({
  name: 'outfit_prop_marshmallow',
  count: 2,
})

// 主任务列表
const TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_summerday_2024_m1',
    title: '体验一次捉迷藏玩法',
    status: 'wait',
  },
  {
    id: 2,
    value: 'use_consumables',
    title: '使用一次沙滩球魔法',
    status: 'wait',
  },
  {
    id: 3,
    value: 'activitycenter_summerday_2024_m2',
    title: '兑换一件夏之日物品',
    status: 'wait',
  },
  {
    id: 4,
    value: 'login_days',
    title: '累计登录5天',
    status: 'wait',
  },
]
// 累计任务列表
const ACC_TASK_LIST = [
  {
    id: 1,
    value: 'collecting_event_candles',
    title: '收集夏之日代币20个',
    status: 'wait',
  },
  {
    id: 2,
    value: 'collecting_event_candles',
    title: '收集夏之日代币30个',
    status: 'wait',
  },
  {
    id: 3,
    value: 'collecting_event_candles',
    title: '收集夏之日代币50个',
    status: 'wait',
  },
]

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
useResponsiveStyles(designConfig)

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_summerday_2024'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const collectedCount = computed(
  () => activityData.value.event_data[EVENT_NAME][4].value,
)

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.value, index]),
)

// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT_NAME][index]
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

// 累计任务列表
const accTaskList = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][4]
  return ACC_TASK_LIST.map((item, index) => {
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

const sessionIsVisitedKey = 'isVisitedSummerday2024'
const isVisited = Session.get(sessionIsVisitedKey)
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
  Session.set(sessionIsVisitedKey, true)
})

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 处理 img src
 * @param name 奖励名
 * @returns {string} 图片路径
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

/**
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-4项，任务列表
  const tasksValid = tasks
    .slice(0, 4)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  // 检查第5项，累计任务
  const accTask = tasks[4]
  const accTasksValid = accTask.stages.some(
    (stage, index) => accTask.value >= stage && accTask.award[index] === 0,
  )
  return tasksValid || accTasksValid
}

/**
 * @function 设置红点
 * @returns {void}
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(
    activityData.value.event_data[EVENT_NAME],
  )
  console.log('hasUnclaimedReward: ', hasUnclaimedReward)
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

/**
 * @function 获取任务进度
 * @returns {void}
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_summerday_2024: data.event_data[EVENT_NAME].sort(
            (a: Event, b: Event) => {
              const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
              const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
              return orderA - orderB
            },
          ),
        },
      }
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
      console.log('activityStore: ', activityStore)
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param status 状态
 * @param rewardId 第几个奖励节点
 * @param index 任务索引
 * @returns {void}
 */
function handleReward(
  task: string,
  status: string,
  rewardId: number,
  index: number,
): void {
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
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
      // 更新页面数据
      activityData.value.event_data[EVENT_NAME][index].award[rewardId - 1] = 1
      // 更新红点
      setRedDot()
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
.summerday {
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
    background-image: url('@/assets/images/summerday-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 170px;
  top: 159px;
  width: 1305px;
  height: 217px;
  background-image: url('@/assets/images/summerday-2024/title.png');
}
.help {
  position: absolute;
  width: 127px;
  height: 127px;
  top: 74px;
  right: 0;
  background-image: url('@/assets/images/summerday-2024/help.png');
}
.task-list {
  position: absolute;
  left: 70px;
  top: 431px;
  padding: 74px 39px 105px 140px;
  width: 1379px;
  height: 499px;
  background-image: url('@/assets/images/summerday-2024/main-bg.png');
}
.task-item {
  float: left;
  margin-right: 70px;
  width: 230px;
  height: 320px;
}
@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/summerday-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/summerday-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/summerday-2024/task#{$i}-redeemed.png');
    }
  }
}
.acc-task-item {
  position: absolute;
  width: 180px;
  height: 210px;
}
.acc-task-item1 {
  right: 25px;
  top: 554px;
}
.acc-task-item2 {
  right: 125px;
  top: 339px;
}
.acc-task-item3 {
  right: 313px;
  top: 218px;
}
@for $i from 1 through 3 {
  .acc-task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/summerday-2024/acc-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/summerday-2024/acc-task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/summerday-2024/acc-task#{$i}-redeemed.png');
    }
  }
}
.acc-progress {
  position: absolute;
  right: 130px;
  bottom: 66px;
  padding-top: 96px;
  width: 433px;
  height: 181px;
  background-image: url('@/assets/images/summerday-2024/progress-bg.png');

  &-count {
    height: 50px;
    line-height: 50px;
    font-size: 34px;
    color: #fff281;
  }
}
</style>
