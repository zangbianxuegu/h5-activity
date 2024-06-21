<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="anniversary-server-2024 flex h-screen">
      <div class="anniversary-server-2024-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            成为星星收藏家
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <div>
            <div class="poster-box">
              <div
                v-if="currentProgress >= 1"
                class="poster poster-repellant_krill animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                v-if="currentProgress >= 1"
                class="poster poster-balloon animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                v-if="currentProgress >= 2"
                class="poster poster-blue animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                v-if="currentProgress >= 2"
                class="poster poster-dog animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                v-if="currentProgress >= 3"
                class="poster poster-forefather animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                v-if="currentProgress >= 4"
                class="poster poster-chen animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                v-if="currentProgress >= 5"
                class="poster poster-sky animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              ></div>
            </div>
            <div class="task-list-container">
              <ul
                class="task-list flex flex-row flex-wrap items-center justify-evenly bg-contain bg-center"
              >
                <li
                  v-for="(item, index) in taskList"
                  :key="item.name"
                  :class="[
                    'task-item bg-contain bg-center bg-no-repeat',
                    `task-item${index + 1}`,
                    `${item.status}`,
                  ]"
                  @click="handleReward(item.name, item.status, index + 1)"
                >
                  <span
                    :class="['task-condition', `task-condition${index + 1}`]"
                    >{{ item.condition
                    }}<span class="unit">{{
                      index + 1 !== 5 ? '万' : '亿'
                    }}</span></span
                  >
                </li>
              </ul>
              <div class="progress-bar-wait bg-contain bg-center bg-no-repeat">
                <div
                  class="progress-bar-star bg-contain bg-center bg-no-repeat"
                  :class="[`progress-bar-star-${currentProgress}`]"
                ></div>
              </div>
              <div
                class="progress-bar-already-finish"
                :class="[`progress-bar-already-finish-${currentProgress}`]"
              >
                <div
                  class="progress-bar-finish bg-contain bg-center bg-no-repeat"
                ></div>
              </div>
            </div>
          </div>
        </Transition>
        <activity-modal ref="modalHelp">
          <template #content>
            <p class="modal-text">
              <span class="font-semibold">活动时间：</span
              >2024年6月29日~2024年7月14日
            </p>
            <p class="modal-text">
              <span class="font-semibold">活动内容：</span>
            </p>
            <p class="modal-text">
              <span
                >活动期间统计全服玩家获得星星代币的数量，达成进度后所有玩家均可领取进度奖励：</span
              >
            </p>
            <p class="modal-text">
              1、全服玩家获得星星代币数量达到2000w，即可领取<span
                class="text-[#ffcb4d]"
                >浪漫烟花魔法*3</span
              >；
            </p>
            <p class="modal-text">
              2、全服玩家获得星星代币数量达到4000w，即可领取<span
                class="text-[#ffcb4d]"
                >生日蛋糕*3</span
              >；
            </p>
            <p class="modal-text">
              3、全服玩家获得星星代币数量达到6000w，即可领取<span
                class="text-[#ffcb4d]"
                >彩虹尾迹*3</span
              >；
            </p>
            <p class="modal-text">
              4、全服玩家获得星星代币数量达到8000w，即可领取<span
                class="text-[#ffcb4d]"
                >生日庆典大蛋糕*3</span
              >；
            </p>
            <p class="modal-text">
              5、全服玩家获得星星代币数量达到1亿，即可领取<span
                class="text-[#ffcb4d]"
                >爱心*3</span
              >。
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
  fireworks: string
  birthdaycake_medium: string
  trail_rainbow: string
  birthdaycake_large: string
  heart: string
}

const rewardsText: RewardsName = {
  fireworks: '浪漫烟花',
  birthdaycake_medium: '生日蛋糕',
  trail_rainbow: '彩虹尾迹',
  birthdaycake_large: '生日庆典大蛋糕',
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

const EVENT_NAME: EventDataKeys =
  activityStore.activeEventName.activitycenter_anniversary_server_2024

// 活动数据
const activityData = computed(
  () => activityStore.eventData[EVENT_NAME] as Event[],
)
const curRewards: Ref<Rewards> = ref({
  name: 'fireworks',
  count: 3,
})
const TASK_LIST = [
  {
    name: 'activitycenter_anniversary_server_2024_m1',
    title: '全服玩家获得星星代币数量达到2000w',
    status: 'wait',
    condition: '2000',
  },
  {
    name: 'activitycenter_anniversary_server_2024_m2',
    title: '全服玩家获得星星代币数量达到4000w',
    status: 'wait',
    condition: '4000',
  },
  {
    name: 'activitycenter_anniversary_server_2024_m3',
    title: '全服玩家获得星星代币数量达到6000w',
    status: 'wait',
    condition: '6000',
  },
  {
    name: 'activitycenter_anniversary_server_2024_m4',
    title: '全服玩家获得星星代币数量达到8000w',
    status: 'wait',
    condition: '8000',
  },
  {
    name: 'activitycenter_anniversary_server_2024_m5',
    title: '全服玩家获得星星代币数量达到1亿',
    status: 'wait',
    condition: '1',
  },
]
// 任务列表数据
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value[index]
    return {
      ...item,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[index]
          ? 'can'
          : 'wait',
    }
  })
})

const sessionIsVisitedKey = 'isVisitedAnniversaryServer2024'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

// 当前任务的完成进度
const currentProgress = computed(() => {
  return taskList.value.filter((e) => e.status !== 'wait').length
})

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
      const activityData: Event[] = res.data.event_data?.[EVENT_NAME]
      // 是否已领奖：所有任务已领奖
      const shouldClaimedRewardCount = activityData[0].stages.filter(
        (stage) => stage <= activityData[0].value,
      ).length
      const isClaimedReward =
        activityData[0].award.filter((item) => item === 1).length >=
        shouldClaimedRewardCount
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
    event: EVENT_NAME,
    task,
    rewardId,
  })
    .then((res) => {
      updateActivityDataRewardStatusNoRequest(task)
      const rewards = res.data.rewards
      modalReward.value?.openModal()
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}
</script>

<style lang="scss" scoped>
$progress-bar-star-tail-half-width: 17px;
$progress-bar-star-width: 181px;
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
.anniversary-server-2024 {
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
    background-image: url('@/assets/images/anniversary-server-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 262px;
  top: 40px;
  width: 896px;
  height: 255px;
  background-image: url('@/assets/images/anniversary-server-2024/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 47px;
  height: 47px;
  top: 0px;
  left: 839px;
}
.task-item {
  width: 280px;
  height: 247px;
  position: absolute;
  top: 728px;
  color: #fff;
  text-align: center;
  .task-condition {
    position: absolute;
    top: 343px;
    left: 140px;
    transform: translate(-50%, -50%);
    font-size: 40px;
    .unit {
      font-size: 20px;
    }
  }
}
@for $i from 1 through 5 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/anniversary-server-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/anniversary-server-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/anniversary-server-2024/task#{$i}-redeemed.png');
    }

    @if $i == 1 {
      left: 180px;
    } @else if $i == 2 {
      left: 536px;
    } @else if $i == 3 {
      left: 918px;
    } @else if $i == 4 {
      left: 1288px;
    } @else if $i == 5 {
      left: 1658px;
    }
  }
}
.task-condition {
  color: #fff;
  text-align: center;
}

.progress-bar-wait {
  position: absolute;
  top: 974px;
  left: 160px;
  width: 1718px;
  height: 65px;
  background-image: url('@/assets/images/anniversary-server-2024/progress-bar-wait.png');
  overflow: hidden;
}
.progress-bar-already-finish {
  position: absolute;
  top: 974px;
  left: 160px;
  width: 0;
  // width: 165px;
  overflow: hidden;
  &-1 {
    animation: alreadyFinishWidth1 1s ease-out forwards;
  }
  &-2 {
    animation: alreadyFinishWidth2 1s ease-out forwards;
  }
  &-3 {
    animation: alreadyFinishWidth3 1s ease-out forwards;
  }
  &-4 {
    animation: alreadyFinishWidth4 1s ease-out forwards;
  }
  &-5 {
    animation: alreadyFinishWidth5 1.05s ease-out forwards;
  }
  .progress-bar-finish {
    width: 1727px;
    height: 65px;
    background-image: url('@/assets/images/anniversary-server-2024/progress-bar-finish.png');
  }
}
@keyframes alreadyFinishWidth1 {
  from {
    width: 0;
  }
  to {
    width: 165px;
  }
}
@keyframes alreadyFinishWidth2 {
  from {
    width: 165px;
  }
  to {
    width: 530px;
  }
}
@keyframes alreadyFinishWidth3 {
  from {
    width: 530px;
  }
  to {
    width: 909px;
  }
}
@keyframes alreadyFinishWidth4 {
  from {
    width: 909px;
  }
  to {
    width: 1271px;
  }
}
@keyframes alreadyFinishWidth5 {
  from {
    width: 1271px;
  }
  to {
    width: 1727px;
  }
}
.progress-bar-star {
  position: absolute;
  top: 0px;
  left: 0;
  width: 0;
  height: 65px;
  background-image: url('@/assets/images/anniversary-server-2024/progress-bar-star.png');
  z-index: 5;
  transform: scale(1, 0.7);
  &-1 {
    animation: progressStarSlide1 1s ease-out forwards;
  }
  &-2 {
    width: $progress-bar-star-width;
    animation: progressStarSlide2 1s ease-out forwards;
  }
  &-3 {
    width: $progress-bar-star-width;
    animation: progressStarSlide3 1s ease-out forwards;
  }
  &-4 {
    width: $progress-bar-star-width;
    animation: progressStarSlide4 1s ease-out forwards;
  }
  &-5 {
    width: $progress-bar-star-width;
    animation: progressStarSlide5 1s ease-out forwards;
  }
}
@keyframes progressStarSlide1 {
  from {
    width: 0;
  }
  to {
    width: $progress-bar-star-width;
  }
}
@keyframes progressStarSlide2 {
  from {
    left: 0px;
  }
  to {
    left: calc(
      530px - $progress-bar-star-width + $progress-bar-star-tail-half-width
    );
  }
}
@keyframes progressStarSlide3 {
  from {
    left: calc(
      530px - $progress-bar-star-width + $progress-bar-star-tail-half-width
    );
  }
  to {
    left: calc(
      909px - $progress-bar-star-width + $progress-bar-star-tail-half-width
    );
  }
}
@keyframes progressStarSlide4 {
  from {
    left: calc(
      909px - $progress-bar-star-width + $progress-bar-star-tail-half-width
    );
  }
  to {
    left: calc(
      1271px - $progress-bar-star-width + $progress-bar-star-tail-half-width
    );
  }
}
@keyframes progressStarSlide5 {
  from {
    left: calc(
      1271px - $progress-bar-star-width + $progress-bar-star-tail-half-width
    );
  }
  to {
    left: calc(1727px - $progress-bar-star-width);
  }
}

.poster {
  position: absolute;
}

.poster-repellant_krill {
  top: 344px;
  left: 8px;
  width: 508px;
  height: 448px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-repellant_krill.png');
}
.poster-blue {
  top: 325px;
  left: 451px;
  width: 280px;
  height: 395px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-blue.png');
}
.poster-sky {
  top: 424px;
  left: 727px;
  width: 373px;
  height: 295px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-sky.png');
}
.poster-chen {
  top: 269px;
  left: 1086px;
  width: 378px;
  height: 459px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-chen.png');
}
.poster-forefather {
  top: 269px;
  left: 1453px;
  width: 299px;
  height: 450px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-forefather.png');
}
.poster-balloon {
  top: 446px;
  left: 1800px;
  width: 177px;
  height: 254px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-balloon.png');
}
.poster-dog {
  top: 698px;
  left: 1559px;
  width: 97px;
  height: 149px;
  background-image: url('@/assets/images/anniversary-server-2024/poster-dog.png');
  transform: scaleX(-1);
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
