<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="reunion flex h-full w-full">
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
        <div class="flex">
          <div class="day-task">
            <ul class="task-list flex flex-row flex-wrap">
              <li
                v-for="item in taskList"
                :key="item.stage"
                :class="[
                  'task-item animate__animated  animate__fadeIn overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
                  `task-item${item.stage}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.name, item.status)"
              >
                {{ item.title }}
              </li>
            </ul>
          </div>
          <div class="common-task">
            <div
              class="task-common animate__animated animate__fadeIn bg-contain bg-center bg-no-repeat"
              :class="{ redeemed: activityData.return_award }"
            ></div>
            <button
              v-if="!activityData.return_award"
              type="button"
              class="btn bg-transparent bg-contain bg-center bg-no-repeat indent-[-9999px]"
              :class="{ disabled: activityData.return_award }"
              :disabled="activityData.return_award"
              @click="
                handleReward(
                  `return_buff_sprite_level${activityData.level}`,
                  activityData.return_award ? 'redeemed' : 'can',
                )
              "
            >
              领取重逢礼
            </button>
          </div>
        </div>
      </Transition>
      <activity-modal ref="modalHelp">
        <template #content>
          <div class="h-[640px] overflow-auto px-2">
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
              1、符合参与条件的回归旅人登录游戏并打开“天空王国回归指南”活动页面，即可领取重逢礼<span
                class="text-[#ffcb4d]"
                >皮皮猫套装试用魔法</span
              >；
            </p>
            <p class="modal-text">
              2、解锁每日回归任务，完成后即可回到活动页面领取对应奖励；
            </p>
            <p class="modal-text">
              3、回归后<b>14日内</b>完成全部任务，即可解锁额外奖励<span
                class="text-[#ffcb4d]"
                >爱心*3、冥龙克星*3、体型重塑*3</span
              >；
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
          <div class="h-[640px] overflow-auto px-2">
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
import dayjs from 'dayjs'
import { showToast } from 'vant'
import { getReturnBuffData, claimReturnBuffReward } from '@/apis/returnBuff'
import { type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { useMenuStore } from '@/stores/menu'
import { useBaseStore } from '@/stores/base'
import ActivityModal from '@/components/Modal'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

const rewardMap = {
  return_buff_sprite_level1: [
    {
      name: '皮皮猫套装试用魔法',
      img: 'suit',
    },
  ],
  return_buff_sprite_level2: [
    {
      name: '皮皮猫套装试用魔法',
      img: 'suit',
    },
  ],
  return_buff_sprite_level3: [
    {
      name: '皮皮猫套装试用魔法',
      img: 'suit',
    },
  ],
  return_buff_sprite_1: [
    {
      name: '炫彩步尘*1',
      img: 'flair_flower',
    },
    {
      name: '随机面具试用魔法*1',
      img: 'musk',
    },
  ],
  return_buff_sprite_2: [
    {
      name: '蜡烛*1',
      img: 'candles',
    },
    {
      name: '随机发型试用魔法*1',
      img: 'hair',
    },
  ],
  return_buff_sprite_3: [
    {
      name: '蜡烛*1',
      img: 'candles',
    },
    {
      name: '随机头饰试用魔法*1',
      img: 'headwear',
    },
  ],
  return_buff_sprite_4: [
    {
      name: '蜡烛*2',
      img: 'candles',
    },
    {
      name: '随机项链试用魔法*1',
      img: 'necklace',
    },
  ],
  return_buff_sprite_5: [
    {
      name: '蜡烛*2',
      img: 'candles',
    },
    {
      name: '随机斗篷试用魔法*1',
      img: 'cloak',
    },
  ],
  return_buff_sprite_6: [
    {
      name: '蜡烛*2',
      img: 'candles',
    },
    {
      name: '随机衣服试用魔法*1',
      img: 'clothes',
    },
  ],
  return_buff_sprite_7: [
    {
      name: '蜡烛*2',
      img: 'candles',
    },
    {
      name: '爱心*2',
      img: 'heart',
    },
  ],
  return_buff_sprite_extra: [
    {
      name: '爱心*3',
      img: 'heart',
    },
    {
      name: '冥龙克星*3',
      img: 'repellant_krill',
    },
    {
      name: '体型重塑*3',
      img: 'resize_potion',
    },
  ],
}

const curRewards = ref(rewardMap.return_buff_sprite_level1)

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

// 当前时间
const baseStore = useBaseStore()
const currentTime = computed(() => baseStore.baseInfo.currentTime)
// 回流第几天
let currentDay = 1

const activityData = ref({
  return_time: 1715296688,
  return_award: false,
  mission: ['0', '0', '0', '0', '0', '0', '0'],
  level: '3',
  extra_award: false,
  award: ['0', '0', '0', '0', '0', '0', '0'],
})

const TASK_LIST = [
  {
    name: 'return_buff_sprite_1',
    title: '第一天',
    stage: 1,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_2',
    title: '第二天',
    stage: 2,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_3',
    title: '第三天',
    stage: 3,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_4',
    title: '第四天',
    stage: 4,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_5',
    title: '第五天',
    stage: 5,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_6',
    title: '第六天',
    stage: 6,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_7',
    title: '第七天',
    stage: 7,
    status: 'wait',
  },
  {
    name: 'return_buff_sprite_extra',
    title: '完成7日任务后可领取',
    stage: 8,
    status: 'wait',
  },
]

// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value
    if (index === 7) {
      return {
        ...item,
        status: activity.extra_award
          ? 'redeemed'
          : activity.mission.every((item) => item === '1')
            ? 'can'
            : 'wait',
      }
    }
    return {
      ...item,
      status:
        currentDay < index + 1
          ? 'locked'
          : activity.award[index] === '1'
            ? 'redeemed'
            : activity.award[index] === '0' && activity.mission[index] === '1'
              ? 'can'
              : 'wait',
    }
  })
})

// 是否有未领取的奖励
const hasUnclaimedReward = computed(() => {
  const completedMissionLength = activityData.value.mission.filter(
    (m) => m === '1',
  ).length
  const claimedAwardLength = activityData.value.award.filter(
    (a) => a === '1',
  ).length
  const hasUnclaimedReturnAward = !activityData.value.return_award
  const hasUnclaimedExtraAward =
    completedMissionLength === 7 && !activityData.value.extra_award
  return (
    hasUnclaimedReturnAward || // 回流固定奖励
    completedMissionLength > claimedAwardLength || // 累计奖励
    hasUnclaimedExtraAward // 完成7日后额外奖励
  )
})

const isVisited = Session.get('isVisitedReunion')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

onMounted(() => {
  // modalReward.value?.openModal()
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedReunion', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../../assets/images/return-buff/reunion/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getReturnBuffData({ page: 1 })
    .then((res) => {
      activityData.value = res.data
      const returnDate = dayjs.unix(res.data.return_time).startOf('day')
      const currentDate = dayjs.unix(currentTime.value).startOf('day')
      currentDay = currentDate.diff(returnDate, 'day') + 1
      // 更新红点
      menuStore.updateMenuDataByHasUnclaimedReward(
        'return_buff_reunion',
        hasUnclaimedReward.value,
      )
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 领奖
function handleReward(type: string, status: string): void {
  if (status === 'locked') {
    showToast('请等待任务开启')
    return
  }
  if (status === 'wait') {
    showToast('请在游戏中完成这个任务')
    return
  }
  if (status === 'redeemed') {
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
.reunion {
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
.task-list {
  position: absolute;
  left: 146px;
  top: 380px;
  width: 1216px;
}
.task-item {
  margin: 0 12px 12px 0;
  width: 280px;
  height: 320px;
}
@for $i from 1 through 7 {
  .task-item#{$i} {
    &.locked {
      background-image: url('@/assets/images/return-buff/reunion/task#{$i}-locked.png');
    }
    &.wait {
      background-image: url('@/assets/images/return-buff/reunion/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/return-buff/reunion/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/return-buff/reunion/task#{$i}-redeemed.png');
    }
  }
}
.task-item8 {
  margin: -10px 0 0 0;
  width: 300px;
  height: 350px;

  &.wait {
    background-image: url('@/assets/images/return-buff/reunion/task-extra-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/return-buff/reunion/task-extra-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/return-buff/reunion/task-extra-redeemed.png');
  }
}
.task-common {
  position: absolute;
  right: 40px;
  bottom: 250px;
  width: 437px;
  height: 310px;
  background-image: url('@/assets/images/return-buff/reunion/task-common-can.png');

  &.redeemed {
    background-image: url('@/assets/images/return-buff/reunion/task-common-redeemed.png');
  }
}
.btn {
  position: absolute;
  right: 40px;
  bottom: 96px;
  width: 424px;
  height: 132px;
  background-image: url('@/assets/images/return-buff/reunion/btn.png');
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
  &-1 {
    width: 80%;
    .reward-item {
      height: 300px;
    }
    .reward-img {
      width: 200px;
    }
  }
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
