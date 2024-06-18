<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="anniversary-visit-2024 flex h-screen">
      <div class="anniversary-visit-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            巡光嘉年华
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div class="task-main">
            <!-- 打卡集章 -->
            <div class="task-list-container">
              <div
                class="tag-clock overflow-hidden bg-contain bg-center bg-no-repeat"
              ></div>
              <ul
                class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
              >
                <li
                  v-for="(item, index) in taskList.slice(0, 8)"
                  :key="item.name"
                  :class="[
                    'task-item bg-contain bg-center bg-no-repeat indent-[-9999px]',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.name, item.status)"
                >
                  {{ item.title }}
                  <div
                    class="task-star-container"
                    v-if="![0, 1, 2].includes(index)"
                  >
                    <div
                      v-for="(_, starIndex) in item.starCountCan"
                      :key="starIndex"
                      class="task-star task-star-can overflow-hidden bg-contain bg-center bg-no-repeat"
                    ></div>
                    <div
                      v-for="(_, starIndex) in item.starCount -
                      item.starCountCan"
                      :key="starIndex"
                      class="task-star task-star-wait overflow-hidden bg-contain bg-center bg-no-repeat"
                    ></div>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 每日任务 -->
            <div>
              <div
                class="tag-everyday-task overflow-hidden bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                class="tag-everyday-task-start-line overflow-hidden bg-contain bg-center bg-no-repeat"
              ></div>
              <ul>
                <li
                  v-for="(task, index) in taskList.slice(8, 10)"
                  :key="task.name"
                  :class="[
                    'task-item overflow-hidden bg-contain bg-center bg-no-repeat ',
                    `task-item${index + 9}`,
                    `${task.status}`,
                  ]"
                >
                  <div
                    :class="[
                      'task-daily-item z-10 indent-[-9999px]',
                      `task-daily-item${index}`,
                    ]"
                    @click="handleReward(task.name, task.status)"
                  >
                    {{ task.title }}
                  </div>
                </li>
              </ul>
            </div>
            <!-- 抽奖 -->
            <div>
              <p
                class="task-tips overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
              >
                完成8个打开集章任务，参与抽取TGC专属斗篷
              </p>
              <div
                :class="[
                  'activity-btn overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `${taskList[10].status}`,
                ]"
                @click="handleReward(taskList[10].name, taskList[10].status)"
              >
                参与抽奖
              </div>
            </div>
          </div>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年6月29日~2024年7月14日
            </p>
            <p class="modal-text">
              <span class="font-semibold">嘉年华限时活动时间：</span>
            </p>
            <p class="modal-text">1、嘉年华球赛：每个偶数小时，0~12分</p>
            <p class="modal-text">2、小狗派对：每个偶数小时，15~27分</p>
            <p class="modal-text">3、先祖巡游：每个偶数小时，30~45分</p>
            <p class="modal-text">4、嘉年华烟花大会：每个偶数小时，44~60分</p>
            <p class="modal-text">
              <span class="font-semibold">印章任务：</span>
            </p>
            <p class="modal-text">
              1、活动期间，参与1次嘉年华球赛，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >60礼花</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，参与1次先祖巡游，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >60礼花</span
              >；
            </p>
            <p class="modal-text">
              3、活动期间，欣赏1次嘉年华烟花表演，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >60礼花</span
              >；
            </p>
            <p class="modal-text">
              4、活动期间，累计2天与嘉年华的小狗互动，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >80礼花</span
              >；
            </p>
            <p class="modal-text">
              5、活动期间，累计2天在档案馆查看编年史，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >80礼花</span
              >；
            </p>
            <p class="modal-text">
              6、活动期间，累计2天在艺术馆观看艺术展，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >80礼花</span
              >；
            </p>
            <p class="modal-text">
              7、活动期间，累计3天在冥想之地感受宁静，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >100礼花</span
              >；
            </p>
            <p class="modal-text">
              8、活动期间，累计3天前往嘉年华影院观看特别放映，即可解锁印章并获取<span
                class="text-[#ffcb4d]"
                >100礼花</span
              >。
            </p>
            <p class="modal-text">
              <span class="font-semibold">每日任务：</span>
            </p>
            <p class="modal-text">
              1、活动期间，每日在云巢冥想加入嘉年华，即可获取<span
                class="text-[#ffcb4d]"
                >50礼花</span
              >；
            </p>
            <p class="modal-text">
              2、活动期间，每日在云巢收集一个星星代币，即可获取<span
                class="text-[#ffcb4d]"
                >50礼花</span
              >。
            </p>
            <p class="modal-text">
              <span class="font-semibold">抽奖活动：</span>
            </p>
            <p class="modal-text">
              1、活动期间，完成八个打卡任务后可以参与抽奖；
            </p>
            <p class="modal-text">
              2、中奖名单将于2024年7月19日当天在官网公布，敬请留意！
            </p>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
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
        <!-- 抽奖弹框 -->
        <activity-modal ref="modalLottery">
          <template #content>
            <p class="modal-text m-4 p-4">
              您已成功参与抽奖，中奖名单将于2024年7月19日当天在官网公布，敬请留意！
            </p>
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
  fireworks_token: string
}

const rewardsText: RewardsName = {
  fireworks_token: '礼花',
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
const modalLottery = ref<InstanceType<typeof ActivityModal> | null>(null)

const menuStore = useMenuStore()
const activityStore = useActivityStore()

const EVENT_NAME: EventDataKeys =
  activityStore.activeEventName.activitycenter_anniversary_visit_2024

// 活动数据
const activityData = computed(
  () => activityStore.eventData[EVENT_NAME] as Event[],
)
const curRewards: Ref<Rewards> = ref({
  name: 'fireworks_token',
  count: 60,
})
const TASK_LIST = [
  {
    name: 'activitycenter_anniversary_visit_2024_m1',
    title: '参与1次嘉年华球赛',
    status: 'wait',
    starCount: 0,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m2',
    title: '参与1次先祖巡游',
    status: 'wait',
    starCount: 0,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m3',
    title: '欣赏1次嘉年华烟花',
    status: 'wait',
    starCount: 0,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m4',
    title: '累计2天与嘉年华的小狗互动',
    status: 'wait',
    starCount: 2,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m5',
    title: '累计2天在档案馆查看编年史',
    status: 'wait',
    starCount: 2,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m6',
    title: '累计2天在艺术馆观看艺术展',
    status: 'wait',
    starCount: 2,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m7',
    title: '累计3天在冥想之地感受宁静',
    status: 'wait',
    starCount: 3,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m8',
    title: '累计3天前往嘉年华影院观',
    status: 'wait',
    starCount: 3,
    starCountCan: 0,
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m9',
    title: '在云巢冥想加入嘉年华',
    status: 'wait',
  },
  {
    name: 'collecting_event_candles',
    title: '在云巢收集一个星星代币',
    status: 'wait',
  },
  {
    name: 'activitycenter_anniversary_visit_2024_m11',
    title: '参与抽奖',
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
      starCount: activity.stages[0],
      starCountCan:
        activity.value > activity.stages[0]
          ? activity.stages[0]
          : activity.value,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
          ? 'can'
          : 'wait',
    }
  })
})

const sessionIsVisitedKey = 'isVisitedAnniversaryVisit2024'
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
        res.data.event_data?.activitycenter_anniversary_visit_2024.sort(
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

function updateActivityDataRewardStatusNoRequest(task: string): void {
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
  menuStore.updateMenuDataByIsClaimedReward(EVENT_NAME, isClaimedReward)
}

// 领奖
function handleReward(task: string, status: string): void {
  // 抽奖
  if (task === taskList.value[10].name) {
    if (status === 'wait') {
      showToast('还未完成任务')
      return
    }
    if (status === 'redeemed') {
      modalLottery.value?.openModal()
      return
    }
    claimMissionReward({
      event: EVENT_NAME,
      task,
      rewardId: 1,
    })
      .then((_) => {
        updateActivityDataRewardStatusNoRequest(task)
        modalLottery.value?.openModal()
      })
      .catch((error) => {
        showToast(error.message)
      })
  } else {
    // 领奖
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
        modalReward.value?.openModal()
        curRewards.value = {
          name: 'fireworks_token',
          count: Number(Object.values(rewards)[0]),
        }
        updateActivityDataRewardStatusNoRequest(task)
      })
      .catch((error) => {
        showToast(error.message)
      })
  }
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
.anniversary-visit-2024 {
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
    background-image: url('@/assets/images/anniversary-visit-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 1432px;
  top: 80px;
  width: 557px;
  height: 358px;
  background-image: url('@/assets/images/anniversary-visit-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 47px;
  height: 47px;
  top: 123px;
  left: 503px;
}
.tag-clock {
  position: absolute;
  top: 106px;
  left: 83px;
  width: 158px;
  height: 82px;
  background-image: url('@/assets/images/anniversary-visit-2024/tag-clock.png');
}
.task-item {
  width: 280px;
  height: 307px;
  position: absolute;
}
@for $i from 1 through 10 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/anniversary-visit-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/anniversary-visit-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/anniversary-visit-2024/task#{$i}-redeemed.png');
    }
    // 打卡集章
    @if $i <= 4 {
      top: 184px;
    } @else if $i <= 8 {
      top: 533px;
    }
    @if $i == 1 or $i == 5 {
      left: 141px;
    } @else if $i == 2 or $i == 6 {
      left: 453px;
    } @else if $i == 3 or $i == 7 {
      left: 765px;
    } @else if $i == 4 or $i == 8 {
      left: 1079px;
    }
    // 每日任务
    @if $i >= 9 {
      position: absolute;
      width: 542px;
      height: 327px;
      left: 1436px;
    }
    @if $i == 9 {
      top: 445px;
    }
    @if $i == 10 {
      top: 606px;
    }
  }
}
.task-daily-item {
  position: absolute;
  width: 542px;
  height: 150px;
}
.task-daily-item0 {
  top: 97px;
}
.task-daily-item1 {
  top: 85px;
}
.task-star-container {
  position: absolute;
  bottom: -57px;
  left: 140px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
}
.task-star {
  width: 37px;
  height: 37px;
  &-can {
    background-image: url('@/assets/images/anniversary-visit-2024/task-star-can.png');
  }
  &-wait {
    background-image: url('@/assets/images/anniversary-visit-2024/task-star-wait.png');
  }
}
.tag-everyday-task {
  position: absolute;
  top: 469px;
  left: 1399px;
  width: 158px;
  height: 82px;
  background-image: url('@/assets/images/anniversary-visit-2024/tag-everyday-task.png');
}
.tag-everyday-task-start-line {
  position: absolute;
  top: 469px;
  left: 1557px;
  width: 376px;
  height: 43px;
  background-image: url('@/assets/images/anniversary-visit-2024/tag-everyday-task-start-line.png');
}
.task-tips {
  position: absolute;
  top: 947px;
  left: 114px;
  width: 743px;
  height: 80px;
  background-image: url('@/assets/images/anniversary-visit-2024/task-tips.png');
}
.activity-btn {
  cursor: pointer;
  position: absolute;
  top: 918px;
  left: 968px;
  width: 413px;
  height: 132px;

  &.wait {
    background-image: url('@/assets/images/anniversary-visit-2024/lottery-wait.png');
  }

  &.can {
    background-image: url('@/assets/images/anniversary-visit-2024/lottery-can.png');
  }

  &.redeemed {
    background-image: url('@/assets/images/anniversary-visit-2024/lottery-soon.png');
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
