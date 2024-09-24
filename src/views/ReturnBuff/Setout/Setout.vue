<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="setout flex h-full w-full">
      <Transition appear :name="headTransitionName" mode="out-in">
        <div class="header flex">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            天空王国回归指南
          </h1>
          <div
            class="sub-title overflow-hidden bg-contain bg-center bg-no-repeat"
          >
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
            <p class="indent-[-9999px]">体验每日精彩旅程，获取重逢礼遇</p>
          </div>
        </div>
      </Transition>
      <Transition appear :name="mainTransitionName" mode="out-in">
        <div class="task flex flex-row flex-wrap">
          <div
            v-for="item in taskList"
            :key="item.name"
            class="task-box flex overflow-hidden bg-contain bg-center bg-no-repeat"
          >
            <h2
              :class="[
                'task-title bg-contain bg-center bg-no-repeat indent-[-9999px]',
                `${item.name}`,
              ]"
            >
              {{ item.title }}
            </h2>
            <ul class="task-list flex flex-row">
              <li
                v-for="task in item.children"
                :key="task.name"
                :class="[
                  'task-item animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `${task.name}`,
                  `${task.status}`,
                ]"
                @click="handleReward(task.name, task.status)"
              >
                {{ task.title }}
              </li>
            </ul>
            <div
              :class="[
                'progress-bar bg-contain bg-no-repeat',
                `progress-bar-${item.progress}`,
              ]"
            >
              <ul
                :class="[
                  'progress-list flex justify-between',
                  `progress-list-${item.name}`,
                ]"
              >
                <li
                  class="progress-item"
                  v-for="task in item.children"
                  :key="task.name"
                >
                  {{ task.stage }}
                </li>
              </ul>
            </div>
          </div>
          <!-- 领取启程礼 -->
          <div
            :class="[
              'common-task animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat',
              `${normalExtraStatus}`,
            ]"
            @click="handleReward('return_buff_normal_extra', normalExtraStatus)"
          >
            <p v-if="normalExtraStatus === 'wait'" class="common-task-text">
              完成任务 {{ completedTaskCount }}/10
            </p>
          </div>
        </div>
      </Transition>
      <activity-modal ref="modalHelp">
        <template #content>
          <div class="h-[640px] overflow-auto px-4">
            <p class="modal-text mt-4">
              <span class="font-semibold">参与条件：</span>
            </p>
            <p class="modal-text">
              离开天空王国<span class="text-[#ffcb4d]">≥15天且历史光翼≥30</span
              >的旅人回归后可参与活动
            </p>
            <p class="modal-text mt-4">
              <span class="font-semibold">参与方式：</span>
            </p>
            <p class="modal-text">
              1、完成收集蜡烛10/20/30根任务，即可依次解锁奖励<span
                class="text-[#ffcb4d]"
                >漂浮*1、光能药剂*1、元气满满*1</span
              >；
            </p>
            <p class="modal-text">
              2、完成使用蜡烛10/20/30根任务，即可依次解锁奖励<span
                class="text-[#ffcb4d]"
                >蜡烛*1、蜡烛*2、蜡烛*3</span
              >；
            </p>
            <p class="modal-text">
              3、完成向好友赠送心火5/10/15次任务，即可依次解锁奖励<span
                class="text-[#ffcb4d]"
                >篝火*1、畅谈长桌*1、秋千*1</span
              >；
            </p>
            <p class="modal-text">
              4、完成使用魔法5/10/15次任务，即可依次解锁奖励<span
                class="text-[#ffcb4d]"
                >随机发型魔法*1、随机斗篷魔法*1、随机裤子魔法*1</span
              >；
            </p>
            <p class="modal-text">
              5、完成10个节点任务，即可领取启程礼<span class="text-[#ffcb4d]"
                >爱心*2、留影蜡烛*2、彩虹尾迹*2</span
              >。
            </p>
            <p class="modal-text mt-4">
              <span class="font-semibold">奖励说明：</span>
            </p>
            <p class="modal-text">1、在活动页点击，即可领取对应任务奖励；</p>
            <p class="modal-text">
              2、领奖后奖励将直接发送到游戏内角色，请在游戏内确认；
            </p>
            <p class="modal-text">
              3、活动将在旅人<span class="text-[#ffcb4d]">回归后14天后结束</span
              >，请按时参与并领取奖励～
            </p>
            <p class="modal-text">
              4、参与过回归活动的旅人，30天内将无法再次参与。
            </p>
          </div>
        </template>
      </activity-modal>
      <activity-modal ref="modalReward" class="reward-box">
        <template #content>
          <div class="h-[640px] overflow-auto px-4">
            <p class="reward-title mt-4">恭喜你获得活动奖励</p>
            <div class="flex items-center justify-around">
              <ul
                :class="[
                  'reward-list mt-6 flex w-full items-center justify-around',
                  `reward-list-${curRewards.length}`,
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
          </div>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getReturnBuffData, claimReturnBuffReward } from '@/apis/returnBuff'
import { type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { useMenuStore } from '@/stores/menu'
import ActivityModal from '@/components/Modal'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

const rewardMap = {
  return_collect_candle_1: [
    {
      name: '漂浮魔法*1',
      img: 'gravity',
    },
  ],
  return_collect_candle_2: [
    {
      name: '光能药剂*1',
      img: 'energy_potion',
    },
  ],
  return_collect_candle_3: [
    {
      name: '元气满满*1',
      img: 'energy',
    },
  ],
  return_use_candle_1: [
    {
      name: '蜡烛*1',
      img: 'candles',
    },
  ],
  return_use_candle_2: [
    {
      name: '蜡烛*2',
      img: 'candles',
    },
  ],
  return_use_candle_3: [
    {
      name: '蜡烛*3',
      img: 'candles',
    },
  ],
  return_send_heard_wax_1: [
    {
      name: '篝火*1',
      img: 'bonfire',
    },
  ],
  return_send_heard_wax_2: [
    {
      name: '畅谈长桌*1',
      img: 'table',
    },
  ],
  return_send_heard_wax_3: [
    {
      name: '秋千*1',
      img: 'swing',
    },
  ],
  return_use_consumable_1: [
    {
      name: '随机发型魔法*1',
      img: 'hair',
    },
  ],
  return_use_consumable_2: [
    {
      name: '随机斗篷魔法*1',
      img: 'cloak',
    },
  ],
  return_use_consumable_3: [
    {
      name: '随机衣服魔法*1',
      img: 'clothes',
    },
  ],
  return_buff_normal_extra: [
    {
      name: '爱心*2',
      img: 'heart',
    },
    {
      name: '留影蜡烛*2',
      img: 'recording_candle',
    },
    {
      name: '彩虹尾迹*2',
      img: 'trail_rainbow',
    },
  ],
}

const curRewards = ref(rewardMap.return_collect_candle_1)

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

const activityData = ref({
  return_time: 1715296688,
  mission: {
    return_use_consumable: ['0', '0', '0'],
    return_use_candle: ['0', '0', '0'],
    return_send_heard_wax: ['0', '0', '0'],
    return_collect_candle: ['0', '0', '0'],
    return_buff_normal_extra: ['0'],
  },
  level: '3',
  award: {
    return_use_consumable: ['0', '0', '0'],
    return_use_candle: ['0', '0', '0'],
    return_send_heard_wax: ['0', '0', '0'],
    return_collect_candle: ['0', '0', '0'],
    return_buff_normal_extra: ['0'],
  },
})
type TasKCateName = keyof typeof activityData.value.mission
interface TaskCate {
  name: TasKCateName
  title: string
  progress: number
  children: any
}
interface Task {
  name: string
  title: string
  stage: number
  status: string
}
const TASK_COLLECT_CANDLE: Task[] = [
  {
    name: 'return_collect_candle_1',
    title: '收集蜡烛10',
    stage: 10,
    status: 'wait',
  },
  {
    name: 'return_collect_candle_2',
    title: '收集蜡烛20',
    stage: 20,
    status: 'wait',
  },
  {
    name: 'return_collect_candle_3',
    title: '收集蜡烛30',
    stage: 30,
    status: 'wait',
  },
]
const TASK_USE_CANDLE: Task[] = [
  {
    name: 'return_use_candle_1',
    title: '使用蜡烛10',
    stage: 10,
    status: 'wait',
  },
  {
    name: 'return_use_candle_2',
    title: '使用蜡烛20',
    stage: 20,
    status: 'wait',
  },
  {
    name: 'return_use_candle_3',
    title: '使用蜡烛30',
    stage: 30,
    status: 'wait',
  },
]
const TASK_SEND_HEARD_WAX: Task[] = [
  {
    name: 'return_send_heard_wax_1',
    title: '赠送心火5',
    stage: 5,
    status: 'wait',
  },
  {
    name: 'return_send_heard_wax_2',
    title: '赠送心火10',
    stage: 10,
    status: 'wait',
  },
  {
    name: 'return_send_heard_wax_3',
    title: '赠送心火15',
    stage: 15,
    status: 'wait',
  },
]
const TASK_USE_CONSUMABLE: Task[] = [
  {
    name: 'return_use_consumable_1',
    title: '使用魔法5',
    stage: 5,
    status: 'wait',
  },
  {
    name: 'return_use_consumable_2',
    title: '使用魔法10',
    stage: 10,
    status: 'wait',
  },
  {
    name: 'return_use_consumable_3',
    title: '使用魔法15',
    stage: 15,
    status: 'wait',
  },
]
const TASK_LIST: TaskCate[] = [
  {
    name: 'return_collect_candle',
    title: '收集蜡烛',
    progress: 0,
    children: TASK_COLLECT_CANDLE,
  },
  {
    name: 'return_use_candle',
    title: '使用蜡烛',
    progress: 0,
    children: TASK_USE_CANDLE,
  },
  {
    name: 'return_send_heard_wax',
    title: '赠送心火',
    progress: 0,
    children: TASK_SEND_HEARD_WAX,
  },
  {
    name: 'return_use_consumable',
    title: '使用魔法',
    progress: 0,
    children: TASK_USE_CONSUMABLE,
  },
]
const taskList = computed(() => {
  return TASK_LIST.map((item) => {
    const mission = activityData.value.mission[item.name]
    const award = activityData.value.award[item.name]
    return {
      ...item,
      progress: mission.filter((m: string) => m === '1').length,
      children: item.children.map((child: Task, index: number) => {
        return {
          ...child,
          status:
            award[index] === '1'
              ? 'redeemed'
              : mission[index] === '1'
                ? 'can'
                : 'wait',
        }
      }),
    }
  })
})

// 任务 return_buff_normal_extra 的状态
const normalExtraStatus = computed(() => {
  return activityData.value.award.return_buff_normal_extra[0] === '1'
    ? 'redeemed'
    : activityData.value.mission.return_buff_normal_extra[0] === '1'
      ? 'can'
      : 'wait'
})

// 已完成任务数量
const completedTaskCount = computed(() => {
  let count = 0
  const mission = activityData.value.mission
  for (const key in mission) {
    mission[key as TasKCateName].forEach((item: string) => {
      if (item === '1') {
        count++
      }
    })
  }
  return count
})

type TaskName = keyof typeof activityData.value.mission

// 是否有未领取的奖励
const hasUnclaimedReward = computed(() => {
  function hasUnclaimedRewardOf(task: string): boolean {
    return (
      activityData.value.mission[task as TaskName].filter(
        (value) => value === '1',
      ).length >
      activityData.value.award[task as TaskName].filter(
        (award) => award === '1',
      ).length
    )
  }
  const hasUnclaimedNormalExtra =
    activityData.value.mission.return_buff_normal_extra[0] === '1' &&
    activityData.value.award.return_buff_normal_extra[0] === '0'
  const hasUnclaimedCollectCandle = hasUnclaimedRewardOf(
    'return_collect_candle',
  )
  const hasUnclaimedSendHeardWax = hasUnclaimedRewardOf('return_send_heard_wax')
  const hasUnclaimedUseCandle = hasUnclaimedRewardOf('return_use_candle')
  const hasUnclaimedUseConsumable = hasUnclaimedRewardOf(
    'return_use_consumable',
  )

  return (
    hasUnclaimedNormalExtra ||
    hasUnclaimedCollectCandle ||
    hasUnclaimedSendHeardWax ||
    hasUnclaimedUseCandle ||
    hasUnclaimedUseConsumable
  )
})

const isVisited = Session.get('isVisitedSetout')
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
  Session.set('isVisitedSetout', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../../assets/images/return-buff/setout/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getReturnBuffData({ page: 2 })
    .then((res) => {
      activityData.value = res.data
      // 更新红点
      menuStore.updateMenuDataByHasUnclaimedReward(
        'return_buff_setout',
        hasUnclaimedReward.value,
      )
    })
    .catch((error) => {
      console.log('Setout.vue', error)
      showToast(error.message)
    })
}

// 领奖
function handleReward(type: string, status: string): void {
  if (status === 'redeemed') {
    showToast('已领奖')
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    return
  }
  claimReturnBuffReward({
    type,
  })
    .then((_) => {
      modalReward.value?.openModal()
      curRewards.value = rewardMap[type as keyof typeof rewardMap]
      getActivityData()
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
.setout {
  position: relative;
}
.title {
  position: absolute;
  left: 298px;
  top: 85px;
  width: 1020px;
  height: 194px;
  background-image: url('@/assets/images/return-buff/reunion/title.png');
}
.sub-title {
  position: absolute;
  left: 645px;
  top: 286px;
  width: 727px;
  height: 50px;
  background-image: url('@/assets/images/return-buff/reunion/sub-title.png');
}
.help {
  margin-left: 626px;
  width: 47px;
  height: 47px;
  background-image: url('@/assets/images/common/help.png');
}
.task {
  position: relative;
  left: 70px;
  top: 370px;
  width: 1454px;
  height: 620px;
}
.task-box {
  position: relative;
  margin-bottom: 100px;
  width: 691px;
  height: 260px;
  background-image: url('@/assets/images/return-buff/setout/box-bg.png');

  &:nth-child(2n + 1) {
    margin-right: 72px;
  }
}
.task-title {
  position: absolute;
  left: 31px;
  top: 80px;
  width: 142px;
  height: 144px;

  &.return_collect_candle {
    background-image: url('@/assets/images/return-buff/setout/return-collect-candle-icon.png');
  }

  &.return_use_candle {
    background-image: url('@/assets/images/return-buff/setout/return-use-candle-icon.png');
  }

  &.return_send_heard_wax {
    background-image: url('@/assets/images/return-buff/setout/return-send-heard-wax-icon.png');
  }

  &.return_use_consumable {
    background-image: url('@/assets/images/return-buff/setout/return-use-consumable-icon.png');
  }
}
.progress-bar {
  position: absolute;
  left: 172px;
  top: 152px;
  width: 456px;
  background-position: top center;

  &-0 {
    background-image: url('@/assets/images/return-buff/setout/progress-bar-0.png');
  }

  &-1 {
    background-image: url('@/assets/images/return-buff/setout/progress-bar-1.png');
  }

  &-2 {
    background-image: url('@/assets/images/return-buff/setout/progress-bar-2.png');
  }

  &-3 {
    background-image: url('@/assets/images/return-buff/setout/progress-bar-3.png');
  }
}
.progress-list {
  margin-top: 36px;
  padding-left: 116px;
  font-size: 34px;
  color: #fff;

  &-return_collect_candle,
  &-return_use_candle {
    padding-left: 102px;
  }
}
.task-list {
  position: absolute;
  left: 220px;
  top: 30px;
  z-index: 10;
}
.task-item {
  margin: 0 10px;
  // padding-top: 156px;
  width: 135px;
  height: 135px;
}
@for $i from 1 through 3 {
  .return_collect_candle_#{$i} {
    &.wait {
      background-image: url('@/assets/images/return-buff/setout/return-collect-candle-#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/return-buff/setout/return-collect-candle-#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/return-buff/setout/return-collect-candle-#{$i}-redeemed.png');
    }
  }
  .return_use_candle_#{$i} {
    &:nth-child(1) {
      margin-left: 30px;
    }
    &:nth-child(2) {
      margin-left: 10px;
    }
    &:nth-child(3) {
      margin-left: 10px;
    }
    &.wait {
      background-image: url('@/assets/images/return-buff/setout/return-use-candle-#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/return-buff/setout/return-use-candle-#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/return-buff/setout/return-use-candle-#{$i}-redeemed.png');
    }
  }
  .return_send_heard_wax_#{$i} {
    &.wait {
      background-image: url('@/assets/images/return-buff/setout/return-send-heard-wax-#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/return-buff/setout/return-send-heard-wax-#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/return-buff/setout/return-send-heard-wax-#{$i}-redeemed.png');
    }
  }
  .return_use_consumable_#{$i} {
    &:nth-child(3) {
      margin-left: 24px;
    }
    &.wait {
      background-image: url('@/assets/images/return-buff/setout/return-use-consumable-#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/return-buff/setout/return-use-consumable-#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/return-buff/setout/return-use-consumable-#{$i}-redeemed.png');
    }
  }
}
.common-task {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -225px 0 0 -225px;
  width: 450px;
  height: 450px;

  &.wait {
    background-image: url('@/assets/images/return-buff/setout/return-buff-normal-extra-wait.png');
  }

  &.can {
    background-image: url('@/assets/images/return-buff/setout/return-buff-normal-extra-can.png');
  }

  &.redeemed {
    background-image: url('@/assets/images/return-buff/setout/return-buff-normal-extra-redeemed.png');
  }

  &-text {
    margin-top: 225px;
    text-align: center;
    font-size: 28px;
    font-weight: 500;
    color: #fff;
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
  &-2 {
    width: 80%;
    .reward-item {
      width: 50%;
    }
  }
  &-3 {
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
