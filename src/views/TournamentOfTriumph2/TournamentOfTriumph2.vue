<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="tournament flex h-screen">
      <div class="tournament-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              奖牌收藏挑战赛 7.26-8.10
            </h1>
            <h2 class="indent-[-9999px]">让荣誉勋章见证每一次努力</h2>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 累计任务列表 -->
            <ul class="task-list flex items-center bg-contain">
              <li
                v-for="(item, index) in accTaskList"
                :key="item.id"
                :class="[
                  'task-item bg-contain indent-[-9999px]',
                  `task-item${index + 1}`,
                  `${item.status}`,
                ]"
                @click="handleReward(item.value, item.status, item.id, 0)"
              >
                <p class="task-text">{{ item.title }}</p>
              </li>
            </ul>
            <!-- 人物 -->
            <div class="sky animate__animated animate__fadeIn bg-contain"></div>
            <!-- 第一名任务 -->
            <div
              :class="[
                'top1-task task-item4 bg-contain indent-[-9999px]',
                `${top1Task.status}`,
              ]"
              @click="handleReward(top1Task.value, top1Task.status, 1, 1)"
            >
              {{ top1Task.title }}
            </div>
          </section>
        </Transition>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年7月26日~2024年8月10日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            活动期间在任意运动日锦标赛中累积达成一定数量的名次要求即可获得对应奖励：
          </p>
          <p class="modal-text">
            累积<span class="text-[#ffcb4d]">获得1次前三名</span>即可赢取<span
              class="text-[#ffcb4d]"
              >元气满满魔法*1</span
            >；
          </p>
          <p class="modal-text">
            累积<span class="text-[#ffcb4d]">获得3次前三名</span>即可赢取<span
              class="text-[#ffcb4d]"
              >蜡烛*2</span
            >；
          </p>
          <p class="modal-text">
            累积<span class="text-[#ffcb4d]">获得6次前三名</span>即可赢取<span
              class="text-[#ffcb4d]"
              >体型重塑*2</span
            >；
          </p>
          <p class="modal-text">
            <span class="text-[#ffcb4d]">获得1次第一名</span>即可赢取<span
              class="text-[#ffcb4d]"
              >爱心*1</span
            >；
          </p>
          <p class="modal-text">加油冲刺吧~</p>
        </template>
      </activity-modal>
      <!-- 奖励弹框 -->
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
              width="80"
              height="80"
              class="modal-reward"
              :src="rewardImageSrc"
              alt="reward"
            />
          </div>
        </template>
      </activity-modal>
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
import { useActivityStore } from '@/stores/tournamentOfTriumph2'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  energy: string
  candles: string
  resize_potion: string
  heart: string
}
const rewardsText: RewardsName = {
  energy: '元气满满',
  candles: '蜡烛',
  resize_potion: '体型重塑',
  heart: '爱心',
}
const curRewards: Ref<Rewards> = ref({
  name: '元气满满',
  count: 1,
})

const ACC_TASK_LIST = [
  {
    id: 1,
    title: '获得1次前三名',
    value: 'activitycenter_tournament_of_triumph_2_top3',
    status: 'wait',
  },
  {
    id: 2,
    title: '获得3次前三名',
    value: 'activitycenter_tournament_of_triumph_2_top3',
    status: 'wait',
  },
  {
    id: 3,
    title: '获得6次前三名',
    value: 'activitycenter_tournament_of_triumph_2_top3',
    status: 'wait',
  },
]
const TASK_LIST = [
  {
    id: 1,
    value: 'activitycenter_tournament_of_triumph_2_top3',
    children: ACC_TASK_LIST,
  },
  {
    id: 2,
    title: '获得1次金牌',
    value: 'activitycenter_tournament_of_triumph_2_top1',
    status: 'wait',
  },
]

// 任务排序
const taskOrderMap = new Map(
  TASK_LIST.map((task, index) => [task.value, index]),
)

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

const EVENT = 'activitycenter_tournament_of_triumph_2'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const isRewardImageLoaded = ref(false)
const rewardImageSrc = ref(handleSrc(String(curRewards.value.name)))
// 累计任务列表
const accTaskList = computed(() => {
  const accTasks = activityData.value.event_data[EVENT][0]
  return ACC_TASK_LIST.map((item, index) => {
    return {
      ...item,
      status:
        accTasks.award[index] === 1
          ? 'redeemed'
          : accTasks.award[index] === 0 &&
              accTasks.value >= accTasks.stages[index]
            ? 'can'
            : 'wait',
    }
  })
})
// 获得1次第一名
const top1Task = computed(() => {
  const task = activityData.value.event_data[EVENT][1]
  return {
    ...TASK_LIST[1],
    status:
      task.award[0] === 1
        ? 'redeemed'
        : task.award[0] === 0 && task.value >= task.stages[0]
          ? 'can'
          : 'wait',
  }
})

const isVisited = Session.get('isVisitedTournamentOfTriumph2')
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
  Session.set('isVisitedTournamentOfTriumph2', true)
})

/**
 * @function 显示帮助
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 处理 img src
 * @param name 奖励名
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href
  return imgSrc
}

/**
 * @function 预加载图片
 * @param src 图片路径
 */
function preLoadImage(src: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve()
    }
  })
}

/**
 * @function 是否已领奖
 * @param tasks 任务列表
 */
function hasClaimedReward(tasks: Event[]): boolean {
  // 检查第2项
  const top1TaskValid =
    (tasks[1].value === 0 && tasks[1].award[0] === 0) ||
    (tasks[1].value >= 1 && tasks[1].award[0] === 1)
  if (!top1TaskValid) {
    return false
  }
  // 检查第1项，累计任务
  const accTasks = tasks[0]
  const accTasksValid = accTasks.stages.every(
    (stage, index) => accTasks.value < stage || accTasks.award[index] === 1,
  )
  return accTasksValid
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const isClaimedReward = hasClaimedReward(activityData.value.event_data[EVENT])
  menuStore.updateMenuDataByIsClaimedReward(EVENT, isClaimedReward)
}

/**
 * @function 获取任务进度
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT })
    .then((res) => {
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT]: data.event_data[EVENT].sort((a: Event, b: Event) => {
            const orderA = taskOrderMap.get(a.task_id) ?? 2
            const orderB = taskOrderMap.get(b.task_id) ?? 2
            return orderA - orderB
          }),
        },
      }
      activityStore.updateActivityData(newActivityData)
      // 更新红点
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
    event: EVENT,
    task,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 让图片先加载再展示
      isRewardImageLoaded.value = false
      rewardImageSrc.value = handleSrc(String(curRewards.value.name))
      await preLoadImage(rewardImageSrc.value)
      isRewardImageLoaded.value = true
      modalReward.value?.openModal()

      // 更新页面数据
      activityData.value.event_data[EVENT][index].award[rewardId - 1] = 1
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
.tournament {
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
    background-image: url('@/assets/images/tournament-of-triumph-2/bg.jpg');
  }
}
.header {
  position: relative;
  left: 190px;
  top: 180px;
}
.title {
  width: 1091px;
  height: 267px;
  background-image: url('@/assets/images/tournament-of-triumph-2/title.png');
}
.help {
  position: absolute;
  left: 1060px;
  bottom: 40px;
  width: 87px;
  height: 87px;
  background-image: url('@/assets/images/tournament-of-triumph-2/help.png');
}
.sky {
  position: absolute;
  left: 59px;
  top: 471px;
  width: 313px;
  height: 605px;
  background-image: url('@/assets/images/tournament-of-triumph-2/sky.png');
}
.task-list {
  position: absolute;
  left: 222px;
  top: 453px;
  padding: 0 102px 0 103px;
  width: 1291px;
  height: 413px;
  background-image: url('@/assets/images/tournament-of-triumph-2/task-main-bg.png');
}
.task-item {
  margin-right: 45px;
  width: 332px;
  height: 240px;
  &:nth-child(3) {
    margin-right: 0;
  }
}
@for $i from 1 through 4 {
  .task-item#{$i} {
    &.wait {
      background-image: url('@/assets/images/tournament-of-triumph-2/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/tournament-of-triumph-2/task#{$i}-can.png');
    }
    &.redeemed {
      background-image: url('@/assets/images/tournament-of-triumph-2/task#{$i}-redeemed.png');
    }
  }
}
.top1-task {
  position: absolute;
  right: 108px;
  top: 76px;
  width: 405px;
  height: 405px;
}
</style>
