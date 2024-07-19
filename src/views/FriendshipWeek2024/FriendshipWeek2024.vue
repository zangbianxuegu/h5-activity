<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="friendship flex h-screen">
      <div class="friendship-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              向友葵的每周惊喜
            </h1>
            <div class="heart bg-contain"></div>
            <p :class="['date bg-contain', `date${currentFriendshipWeek}`]"></p>
            <div class="help bg-contain bg-no-repeat" @click="handleHelp"></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <main>
            <!-- 任务列表 -->
            <ul class="task-list">
              <li
                v-for="(item, index) in taskList"
                :key="item.id"
                :class="[
                  'task-item animate__animated animate__fadeIn bg-contain bg-no-repeat indent-[-9999px]',
                  `task-item${index + 1}`,
                  `week${currentFriendshipWeek}-task-item${index + 1}`,
                  `${item.status}`,
                  {
                    empty: item.isNotOpened,
                  },
                ]"
                @click="handleReward(item.name, item.status, item.isNotOpened)"
              >
                <p class="task-text">{{ item.title }}</p>
                <!-- 进度 -->
                <ol
                  v-if="item.hasIndicates && !item.isNotOpened"
                  class="task-indicates"
                >
                  <li
                    v-for="(_, index) in Array.from({ length: item.stage })"
                    :key="index"
                    :class="[
                      'task-indicate overflow-hidden indent-[-9999px]',
                      { active: item.value >= index + 1 },
                    ]"
                  >
                    {{ index + 1 }}
                  </li>
                </ol>
              </li>
            </ul>
          </main>
        </Transition>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年7月17日~2024年8月27日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            1、活动期间，通过每日礼物、每日任务、每周惊喜可获得<span
              class="text-[#ffcb4d]"
              >阳光</span
            >；
          </p>
          <p class="modal-text">
            2、使用阳光可呵护向友葵（每次固定消耗100点），向友葵成长至四个阶段时可解锁对应的奖励；
          </p>
          <p class="modal-text">3、使用阳光可在养分补给页面兑换各种道具；</p>
          <p class="modal-text">
            4、当向友葵成长至第二阶段和第四阶段时，养分补给页面会解锁<span
              class="text-[#ffcb4d]"
              >有友节专属外观兑换</span
            >，可使用<span class="text-[#ffcb4d]">爱心</span>进行兑换。
          </p>
        </template>
      </activity-modal>
      <!-- 奖励弹框 -->
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
  </Transition>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { showToast } from 'vant'
import type { Event, DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useBaseStore } from '@/stores/base'
import { useActivityStore } from '@/stores/friendshipWeek2024'

interface TaskItem {
  id: number
  title: string
  name: string
  status: string
  hasIndicates: boolean
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
const baseStore = useBaseStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const currentFriendshipWeek = computed(
  () => baseStore.baseInfo.currentFriendshipWeek,
)
const currentTime = baseStore.baseInfo.currentTime
const event = `activitycenter_week${currentFriendshipWeek.value}_friendship_2024`

const isVisited = Session.get('isVisitedFriendshipWeek2024')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

const rewardMap = {
  activitycenter_week1_friendship_2024_m2: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '篝火*2',
      img: 'bonfire',
    },
  ],
  activitycenter_week1_friendship_2024_m3: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '向日葵花盘装扮魔法*2',
      img: 'outfit_horn_sunflower_headwear',
    },
  ],
  activitycenter_week1_friendship_2024_m4: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
  activitycenter_week2_friendship_2024_m2: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '畅谈长桌*2',
      img: 'table',
    },
  ],
  activitycenter_week2_friendship_2024_m3: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '向日葵花盘装扮魔法*2',
      img: 'outfit_horn_sunflower_headwear',
    },
  ],
  activitycenter_week2_friendship_2024_m4: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
  activitycenter_week3_friendship_2024_m2: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '留影蜡烛*2',
      img: 'recording_candle',
    },
  ],
  activitycenter_week3_friendship_2024_m3: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '体型重塑*2',
      img: 'resize_potion',
    },
  ],
  activitycenter_week3_friendship_2024_m4: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
  activitycenter_week4_friendship_2024_m2: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '秋千*2',
      img: 'swing',
    },
  ],
  activitycenter_week4_friendship_2024_m3: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '粉色尾迹*2',
      img: 'trail_pink',
    },
  ],
  activitycenter_week4_friendship_2024_m4: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
  activitycenter_week5_friendship_2024_m2: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '传信纸船*2',
      img: 'message_boat',
    },
  ],
  activitycenter_week5_friendship_2024_m3: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '彩虹尾迹*2',
      img: 'trail_rainbow',
    },
  ],
  activitycenter_week5_friendship_2024_m4: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
  activitycenter_week6_friendship_2024_m2: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '绚丽彩虹*2',
      img: 'rainbow',
    },
  ],
  activitycenter_week6_friendship_2024_m3: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '彩虹尾迹*2',
      img: 'trail_rainbow',
    },
  ],
  activitycenter_week6_friendship_2024_m4: [
    {
      name: '阳光*100',
      img: 'sunlight_token',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
}
const curRewards = ref(rewardMap.activitycenter_week1_friendship_2024_m2)

const TASK_LIST_MAP = {
  week1: [
    {
      id: 2,
      title: '通过星盘赠送好友10次阳光',
      name: 'activitycenter_week1_friendship_2024_m2',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 3,
      title: '获得3次来自好友的向友葵呵护',
      name: 'activitycenter_week1_friendship_2024_m3',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 4,
      title: '累计3天和陌生人一起坐在向日葵长凳上',
      name: 'activitycenter_week1_friendship_2024_m4',
      status: 'wait',
      hasIndicates: false,
    },
  ],
  week2: [
    {
      id: 2,
      title: '通过星盘赠送好友10次阳光',
      name: 'activitycenter_week2_friendship_2024_m2',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 3,
      title: '和好友一起参加3次比赛',
      name: 'activitycenter_week2_friendship_2024_m3',
      status: 'wait',
      hasIndicates: true,
    },
    {
      id: 4,
      title: '在竞技场中收获3次双生向日葵',
      name: 'activitycenter_week2_friendship_2024_m4',
      status: 'wait',
      hasIndicates: true,
    },
  ],
  week3: [
    {
      id: 2,
      title: '通过星盘赠送好友10次阳光',
      name: 'activitycenter_week3_friendship_2024_m2',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 3,
      title: '和好友一起参加3次比赛',
      name: 'activitycenter_week3_friendship_2024_m3',
      status: 'wait',
      hasIndicates: true,
    },
    {
      id: 4,
      title: '在竞技场中收获3次双生向日葵',
      name: 'activitycenter_week3_friendship_2024_m4',
      status: 'wait',
      hasIndicates: true,
    },
  ],
  week4: [
    {
      id: 2,
      title: '通过星盘赠送好友10次阳光',
      name: 'activitycenter_week4_friendship_2024_m2',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 3,
      title: '和好友牵手游玩鹊桥',
      name: 'activitycenter_week4_friendship_2024_m3',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 4,
      title: '累计3天在秘密花园抽签',
      name: 'activitycenter_week4_friendship_2024_m4',
      status: 'wait',
      hasIndicates: true,
    },
  ],
  week5: [
    {
      id: 2,
      title: '通过星盘赠送好友10次阳光',
      name: 'activitycenter_week5_friendship_2024_m2',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 3,
      title: '和3名不同发色的好友牵手',
      name: 'activitycenter_week5_friendship_2024_m3',
      status: 'wait',
      hasIndicates: true,
    },
    {
      id: 4,
      title: '在八人门中收获3次双生向日葵',
      name: 'activitycenter_week5_friendship_2024_m4',
      status: 'wait',
      hasIndicates: true,
    },
  ],
  week6: [
    {
      id: 2,
      title: '通过星盘赠送好友10次阳光',
      name: 'activitycenter_week6_friendship_2024_m2',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 3,
      title: '和1名相同发色的好友牵手',
      name: 'activitycenter_week6_friendship_2024_m3',
      status: 'wait',
      hasIndicates: false,
    },
    {
      id: 4,
      title: '在八人门中收获3次双生向日葵',
      name: 'activitycenter_week6_friendship_2024_m4',
      status: 'wait',
      hasIndicates: true,
    },
  ],
}
const TASK_LIST =
  TASK_LIST_MAP[
    `week${currentFriendshipWeek.value}` as keyof typeof TASK_LIST_MAP
  ]
// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity =
      activityData.value.event_data.activitycenter_week_friendship_2024[
        index + 1
      ]
    // 任务是否未开放
    const isNotOpened = checkTaskNotOpened(item)
    return {
      ...item,
      value: activity.value,
      stage: activity.stages[0],
      isNotOpened,
      status:
        activity.award[0] === 1
          ? 'redeemed'
          : activity.award[0] === 0 && activity.value >= activity.stages[0]
            ? 'can'
            : 'wait',
    }
  })
})

// 周任务排序
const taskOrderMap = new Map(TASK_LIST.map((task, index) => [task.name, index]))

// 如果获取所有活动信息接口较后返回，currentFriendshipWeek 会进行更新
// 观察当前周数，如果已经更新，进行数据请求
watch(
  () => currentFriendshipWeek.value,
  (newVal) => {
    if (newVal !== 0) {
      try {
        getActivityData()
      } catch (error) {
        console.error(error)
      }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  try {
    // 获取当前周数之后
    if (currentFriendshipWeek.value !== 0) {
      getActivityData()
    }
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedFriendshipWeek2024', true)
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

/**
 * @function 检查任务是否未开放
 * @param item 任务项
 */
function checkTaskNotOpened(item: TaskItem): boolean {
  // 第2周运动会任务在7.26之前未开放
  if (
    [
      'activitycenter_week2_friendship_2024_m3',
      'activitycenter_week2_friendship_2024_m4',
    ].includes(item.name)
  ) {
    const currentDate = dayjs.unix(currentTime)
    const targetDate = dayjs('2024-07-26')
    return currentDate.isBefore(targetDate)
  }
  // 第4周七夕节任务在8.8之前未开放
  if (
    [
      'activitycenter_week4_friendship_2024_m3',
      'activitycenter_week4_friendship_2024_m4',
    ].includes(item.name)
  ) {
    const currentDate = dayjs.unix(currentTime)
    const targetDate = dayjs('2024-08-08')
    return currentDate.isBefore(targetDate)
  }
  return false
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const isClaimedReward =
    !activityData.value.event_data.activitycenter_week_friendship_2024
      .slice(1)
      .some((item) => item.award[0] === 0 && item.value >= item.stages[0])
  menuStore.updateMenuDataByIsClaimedReward(event, isClaimedReward)
}

/**
 * @function 获取任务进度
 */
function getActivityData(): void {
  // 主任务
  getPlayerMissionData({ event })
    .then((res) => {
      const data = res.data
      // 改变属性名，store 中存储的属性名为 activitycenter_week_friendship_2024
      if (data.event_data[event]) {
        data.event_data.activitycenter_week_friendship_2024 =
          data.event_data[event]
      }
      const newActivityData = {
        ...data,
        event_data: {
          activitycenter_week_friendship_2024:
            data.event_data.activitycenter_week_friendship_2024.sort(
              (a: Event, b: Event) => {
                const orderA = taskOrderMap.get(a.task_id) ?? -1
                const orderB = taskOrderMap.get(b.task_id) ?? -1
                return orderA - orderB
              },
            ),
        },
      }
      activityStore.updateActivityData(newActivityData)
      // 设置红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param status 任务状态
 * @param isNotOpened 任务是否未开启
 */
function handleReward(
  task: string,
  status: string,
  isNotOpened: boolean,
): void {
  if (isNotOpened) {
    showToast('稍后开放~')
    return
  }
  if (status === 'redeemed') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimMissionReward({
    event,
    task,
    rewardId: 1,
  })
    .then(async (res) => {
      console.log('reward res: ', res)
      curRewards.value = rewardMap[task as keyof typeof rewardMap]
      modalReward.value?.openModal()

      // 更新页面数据
      const newActivityData = {
        ...activityData.value,
        event_data: {
          activitycenter_week_friendship_2024:
            activityData.value.event_data.activitycenter_week_friendship_2024.map(
              (item) => {
                return {
                  ...item,
                  award: item.task_id === task ? [1] : item.award,
                }
              },
            ),
        },
      }
      activityStore.updateActivityData(newActivityData)
      // 设置红点
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
.friendship {
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
    background-image: url('@/assets/images/friendship-week-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 279px;
  top: 35px;
  width: 1296px;
}
.heart {
  position: absolute;
  right: 280px;
  top: -5px;
  width: 45px;
  height: 43px;
  background-image: url('@/assets/images/friendship-week-2024/heart.png');
  animation: pulse 1s infinite;
}
.title {
  width: 981px;
  height: 258px;
  background-image: url('@/assets/images/friendship-week-2024/title.png');
}
.date {
  position: absolute;
  right: 56px;
  top: 64px;
}
.date1 {
  width: 243px;
  height: 67px;
  background-image: url('@/assets/images/friendship-week-2024/date1.png');
}
.date2 {
  width: 244px;
  height: 67px;
  background-image: url('@/assets/images/friendship-week-2024/date2.png');
}
.date3 {
  width: 213px;
  height: 62px;
  background-image: url('@/assets/images/friendship-week-2024/date3.png');
}
.date4 {
  width: 210px;
  height: 61px;
  background-image: url('@/assets/images/friendship-week-2024/date4.png');
}
.date5 {
  width: 242px;
  height: 66px;
  background-image: url('@/assets/images/friendship-week-2024/date5.png');
}
.date6 {
  width: 239px;
  height: 67px;
  background-image: url('@/assets/images/friendship-week-2024/date6.png');
}
.help {
  position: absolute;
  right: 0;
  top: 24px;
  width: 57px;
  height: 81px;
  background-image: url('@/assets/images/friendship-week-2024/help.png');
}
.task-item {
  position: absolute;
  width: 700px;
  height: 700px;
  &.empty {
    background-image: url('@/assets/images/friendship-week-2024/task-empty.png') !important;
  }
}
.task-item1 {
  left: 74px;
  top: 376px;
}
.task-item2 {
  left: 715px;
  top: 334px;
}
.task-item3 {
  left: 1327px;
  top: 117px;
}
@for $i from 1 through 6 {
  @for $j from 1 through 3 {
    .week#{$i}-task-item#{$j} {
      &.wait {
        background-image: url('@/assets/images/friendship-week-2024/week#{$i}-task#{$j}-wait.png');
      }
      &.can {
        background-image: url('@/assets/images/friendship-week-2024/week#{$i}-task#{$j}-can.png');
      }
      &.redeemed {
        background-image: url('@/assets/images/friendship-week-2024/week#{$i}-task#{$j}-redeemed.png');
      }
    }
  }
}
.task-indicates {
  position: absolute;
  left: 55%;
  bottom: 30px;
  transform: translate3d(-50%, 0, 0) rotate(-8deg);
}
.task-indicate {
  float: left;
  margin-left: 14px;
  width: 37px;
  height: 37px;
  background: url('@/assets/images/friendship-week-2024/star.png') no-repeat
    center center / 26px 26px;

  &:first-child {
    margin-left: 0;
  }

  &.active {
    background: url('@/assets/images/friendship-week-2024/star-active.png')
      no-repeat center center / 37px 37px;
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
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
