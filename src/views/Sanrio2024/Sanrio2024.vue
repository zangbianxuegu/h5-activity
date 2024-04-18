<template>
  <div class="sanrio flex h-screen">
    <div class="sanrio-main">
      <div class="relative flex h-full w-full">
        <!-- 信封关闭 -->
        <div ref="envelopeClosed" class="envelope-closed">
          <!-- <div class="envelope-closed-cover"></div> -->
          <div
            ref="envelopePhoto"
            class="envelope-photo animation-breathing"
            @click="handleOpenEnvelope"
          ></div>
        </div>
        <!-- 信封打开 -->
        <div
          ref="envelopeOpen"
          class="envelope-open"
          :class="{ finished: isVisited }"
        >
          <div
            ref="envelopeBg"
            class="envelope-bg"
            :class="{ finished: isVisited }"
          ></div>
          <div
            ref="envelopeMain"
            class="envelope-main"
            :class="{ finished: isVisited }"
          >
            <div class="header flex">
              <h1 class="title overflow-hidden indent-[-9999px]">
                大耳狗茶话会
              </h1>
              <div class="date flex items-center align-middle">
                <div class="date-text">{{ activityTime }}</div>
                <div
                  class="date-help bg-contain bg-center bg-no-repeat"
                  @click="handleHelp"
                ></div>
              </div>
            </div>
            <!-- 任务1-4 -->
            <ul class="task-list flex flex-row flex-wrap">
              <li
                v-for="(item, index) in taskList.slice(0, 4)"
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
            <!-- 任务5-6（累计任务） -->
            <ul class="acc-task-list flex flex-row">
              <li
                v-for="(item, index) in taskList.slice(4)"
                :key="item.name"
                :class="[
                  'acc-task-item overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `task-item${index + 5}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.name, item.status)"
              >
                {{ item.title }}
                <ol class="acc-task-indicates">
                  <li
                    v-for="(_, index) in Array.from({ length: item.stage })"
                    :key="index"
                    class="acc-task-indicate overflow-hidden indent-[-9999px]"
                    :class="{ active: item.value >= index + 1 }"
                  >
                    {{ index + 1 }}
                  </li>
                </ol>
              </li>
            </ul>
          </div>
          <div ref="envelopeOpenBody" class="envelope-open-body"></div>
        </div>
      </div>
    </div>
    <activity-modal ref="modalHelp">
      <template #content>
        <p class="modal-text">
          <span class="font-semibold">活动时间：</span
          >2024年4月28日~2024年5月18日
        </p>
        <p class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </p>
        <p class="modal-text">
          1、活动期间，与沏茶师打个招呼，即可领取<span class="text-[#ffcb4d]"
            >小不点*2</span
          >；
        </p>
        <p class="modal-text">
          2、活动期间，拾取1次肉桂卷代币，即可领取<span class="text-[#ffcb4d]"
            >元气满满*2</span
          >；
        </p>
        <p class="modal-text">
          3、活动期间，与陌生人坐在甜品桌上聊天，即可领取<span
            class="text-[#ffcb4d]"
            >传信纸船*2</span
          >；
        </p>
        <p class="modal-text">
          4、活动期间，与大耳狗在合影区拍照，即可领取<span
            class="text-[#ffcb4d]"
            >光能药剂*2</span
          >;
        </p>
        <p class="modal-text">
          5、活动期间，累计3天与大耳狗在合影区拍照，即可领取<span
            class="text-[#ffcb4d]"
            >蜡烛*2</span
          >;
        </p>
        <p class="modal-text">
          6、活动期间，累计5天拜访甜点工坊，即可领取<span class="text-[#ffcb4d]"
            >爱心*2</span
          >。
        </p>
      </template>
    </activity-modal>
    <activity-modal
      ref="modalReward"
      :background-image="rewardModalBackgroundImage"
    >
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
      <template #footer>
        <p class="modal-footer">奖励已经发放，请回到游戏内领取</p>
      </template>
    </activity-modal>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { type Event, type DesignConfig } from '@/types'
import { Local } from '@/utils/storage'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'

interface Rewards {
  name: string
  count: number
}

interface RewardsName {
  tiny: string
  energy: string
  message_boat: string
  energy_potion: string
  candles: string
  heart: string
}

const rewardsText: RewardsName = {
  tiny: '小不点',
  energy: '元气满满',
  message_boat: '传信纸船',
  energy_potion: '光能药剂',
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
console.log('factor: ', factor)
const isVisited = ref(Local.get('isVisitedSanrio2024'))

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const rewardModalBackgroundImage = new URL(
  '@/assets/images/common/modal-bg-sanrio.png',
  import.meta.url,
).href

const menuStore = useMenuStore()
const activityStore = useActivityStore()

// 活动时间字符串
const activityTime = computed(
  () => activityStore.activityTime.activity_sanrio_2024,
)
// 活动数据
const activityData = computed(
  () => activityStore.eventData.activity_sanrio_2024,
)

const curRewards: Ref<Rewards> = ref({
  name: 'tiny',
  count: 2,
})
const TASK_LIST = [
  {
    name: 'activity_sanrio_2024_m1',
    title: '与沏茶师打个招呼',
    status: 'wait',
  },
  {
    name: 'collecting_event_candles',
    title: '拾取1个肉桂卷代币',
    status: 'wait',
  },
  {
    name: 'activity_sanrio_2024_m3',
    title: '与陌生人坐在甜品桌上聊天',
    status: 'wait',
  },
  {
    name: 'activity_sanrio_2024_m4',
    title: '与大耳狗在合影区拍照',
    status: 'wait',
  },
  {
    name: 'activity_sanrio_2024_m5',
    title: '累计3日与大耳狗在合影区拍照',
    status: 'wait',
  },
  {
    name: 'activity_sanrio_2024_m6',
    title: '累计5日拜访甜点工坊',
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

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
})

// 信封动画
const envelopeOpen = ref<HTMLDivElement | null>(null)
const envelopeClosed = ref<HTMLDivElement | null>(null)
const envelopePhoto = ref<HTMLDivElement | null>(null)
const envelopeBg = ref<HTMLDivElement | null>(null)
const envelopeMain = ref<HTMLDivElement | null>(null)
function handleOpenEnvelope(): void {
  if (envelopePhoto.value) {
    // 照片呼吸动画、淡出
    envelopePhoto.value.classList.remove('animation-breathing')
    envelopePhoto.value.classList.add('animation-photoFadeOut')
    envelopePhoto.value.addEventListener(
      'animationend',
      () => {
        if (envelopeClosed.value && envelopeOpen.value) {
          // 打开信封淡入
          envelopeOpen.value.classList.add('animation-openFadeIn')
          envelopeOpen.value.addEventListener(
            'animationend',
            () => {
              if (
                envelopeClosed.value &&
                envelopeOpen.value &&
                envelopeMain.value
              ) {
                // 关闭的信封、打开的信封下滑，主页向上滑动再落下
                envelopeClosed.value.classList.add('animation-closedSlideDown')
                envelopeOpen.value.classList.add('animation-openSlideDown')
                envelopeMain.value.classList.add('animation-slideAndFall')
                setTimeout(() => {
                  // 主页的信封背景也放大
                  // envelopeOpen.value?.classList.add('animation-openScale')
                  envelopeBg.value?.classList.add('animation-bgScale')
                  Local.set('isVisitedSanrio2024', true)
                }, 1500)
              }
            },
            { once: true },
          )
        }
      },
      { once: true },
    )
  }
}

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/sanrio-2024/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activity_sanrio_2024' })
    .then((res) => {
      // 获取数据并按照 TASK_LIST 的顺序进行排序
      const activityData: Event[] =
        res.data.event_data?.activity_sanrio_2024.sort((a: Event, b: Event) => {
          const orderA = taskOrderMap.get(a.task_id) ?? TASK_LIST.length
          const orderB = taskOrderMap.get(b.task_id) ?? TASK_LIST.length
          return orderA - orderB
        })
      // 是否已领奖：所有任务已领奖
      const isClaimedReward = !activityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      // 更新菜单数据 isClaimedReward
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_sanrio_2024',
        isClaimedReward,
      )
      // 更新缓存活动数据
      activityStore.updateEventData('activity_sanrio_2024', activityData)
    })
    .catch((error) => {
      console.log('sanrio2024.vue', error)
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
    event: 'activity_sanrio_2024',
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
      // 设置任务领奖状态 [0] -> [1]
      const newActivityData = activityData.value.map((item) => {
        return {
          ...item,
          award: item.task_id === task ? [1] : item.award,
        }
      })
      activityStore.updateEventData('activity_sanrio_2024', newActivityData)
      const isClaimedReward = !newActivityData.some(
        (item) => item.award[0] === 0 && item.value >= item.stages[0],
      )
      menuStore.updateMenuDataByIsClaimedReward(
        'activity_sanrio_2024',
        isClaimedReward,
      )
    })
    .catch((error) => {
      showToast(error.message)
    })
}
</script>

<style lang="scss" scoped>
.sanrio {
  position: relative;
  width: 2100px;

  &-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3D(-50%, -50%, 0) scale(var(--scale-factor));
    width: 2040px;
    height: 1140px;
  }
}
.header {
  position: relative;
}
.date {
  position: absolute;
  left: 286px;
  top: 60px;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
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
.modal-footer {
  border-top: 2px solid #ccc;
  height: 80px;
  line-height: 80px;
  overflow: hidden;
  text-align: center;
  font-size: 30px;
  color: #585858;
}
.task-list {
  position: absolute;
  left: 670px;
  top: 240px;
}
.task-item {
  margin-left: -30px;
  width: 360px;
  height: 360px;
}
.acc-task-list {
  position: absolute;
  left: 696px;
  top: 770px;
}
.acc-task-item {
  position: relative;
  width: 612px;
  height: 261px;

  &:first-child {
    margin-right: 12px;
  }
}
.acc-task-indicates {
  position: absolute;
  left: 50%;
  bottom: 40px;
  transform: translate3d(-50%, 0, 0);
}
.acc-task-indicate {
  float: left;
  margin-left: 14px;
  width: 28px;
  height: 28px;
  background: #dedede;
  box-sizing: border-box;
  border: 3px solid #c4c4c4;
  border-radius: 28px;
  box-shadow: 0 2px 2px 0 rgba(15, 24, 48, 0.11);

  &:first-child {
    margin-left: 0;
  }

  &.active {
    background: #fffaa5;
    border-color: #ffce78;
  }
}
@for $i from 1 through 6 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/sanrio-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/sanrio-2024/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/sanrio-2024/task#{$i}-redeemed.png');
    }
  }
}

.envelope-closed {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -795px;
  margin-top: -430px;
  width: 1590px;
  height: 860px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/sanrio-2024/envelope-closed.png');
}
.envelope-closed-cover {
  position: absolute;
  left: 0;
  top: 0;
  width: 1590px;
  height: 478px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/sanrio-2024/envelope-closed-cover.png');
}
.envelope-photo {
  position: absolute;
  left: 564px;
  top: 358px;
  width: 468px;
  height: 329px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/sanrio-2024/envelope-photo.png');
}
.envelope-open {
  display: none;
  position: relative;
  left: 50%;
  margin-left: -795px;
  width: 1590px;
  height: 1000px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/sanrio-2024/envelope-open-bg.png');

  &.finished {
    display: block;
    top: 50%;
    margin-top: -500px;
  }
}
.envelope-open-body {
  z-index: 1;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1590px;
  height: 642px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/sanrio-2024/envelope-open-body.png');
}
.envelope-bg {
  z-index: 2;
  opacity: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -1020px;
  margin-top: -570px;
  width: 2040px;
  height: 1140px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: bottom center;
  background-image: url('@/assets/images/sanrio-2024/envelope-bg.png');
  transform: scale(0.7794);

  &.finished {
    opacity: 1;
    transform: scale(1);
  }
}
.envelope-main {
  position: relative;
  margin-left: -225px;
  margin-top: -120px;
  width: 2040px;
  height: 1140px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/sanrio-2024/envelope-main.png');
  transform: rotate(-4.73deg) scale(0.7);

  &.finished {
    margin-top: -70px;
    transform: rotate(0deg) scale(1);
    z-index: 10;
  }
}
.animation-openFadeIn {
  animation: fadeIn 1.5s forwards ease-in;
  display: block;
}
.animation-photoFadeOut {
  animation: fadeOut 0.8s forwards ease-in;
}
.animation-breathing {
  animation: breathe 4s infinite alternate;
}
.animation-bgScale {
  animation: bgScale 0.5s forwards ease-out;
}
.animation-closedSlideDown {
  animation: closedSlideDown 1s forwards ease-in;
}
.animation-openSlideDown {
  animation: openSlideDown 1s forwards ease-in;
}
.animation-slideAndFall {
  animation: slideAndFall 2s forwards ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes breathe {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
@keyframes closedSlideDown {
  from {
    margin-top: -430px;
  }
  to {
    margin-top: -360px;
  }
}
@keyframes openSlideDown {
  from {
    margin-top: 0;
  }
  to {
    margin-top: 70px;
  }
}
@keyframes bgScale {
  from {
    opacity: 1;
    margin-top: -500px;
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes slideAndFall {
  0% {
    transform: rotate(-4.73deg) scale(0.7);
  }
  50% {
    transform: translate3D(0, -1000px, 0) rotate(-4.73deg) scale(0.7);
    z-index: 10;
  }
  100% {
    transform: translate3D(0, 0, 0) rotate(0deg) scale(1);
    z-index: 10;
    margin-top: -70px;
  }
}
</style>
