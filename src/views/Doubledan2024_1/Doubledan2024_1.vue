<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="doubledan flex h-screen">
      <div class="doubledan-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              温暖冬日 翻开惊喜
              <p>
                <time datetime="2024-12-24">12.24</time>-
                <time datetime="2025-1-7">1.7</time>
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
            <h2 id="taskListHeading" class="sr-only">任务列表</h2>
            <div class="main-container flex">
              <!-- 累积任务列表 -->
              <div class="acc-task-container">
                <ul class="acc-task-list">
                  <li
                    v-for="(item, index) in accTaskList"
                    :key="index"
                    class="acc-task-item"
                    :class="[
                      `acc-task-item${index + 1}`,
                      `${item.status}`,
                      item.status === 'redeemed' ? 'flipped' : '',
                    ]"
                    @click="handleReward(index + 1, item)"
                  >
                    <div
                      class="acc-task-front animate__animated animate__fadeIn"
                    ></div>
                    <div
                      class="acc-task-back animate__animated animate__fadeIn"
                    >
                      <div class="acc-task-gift">
                        <img
                          :src="handleSrc(item.info.name)"
                          alt="奖品"
                          class="h-full"
                          v-if="item.info.name"
                        />
                      </div>
                      <div class="acc-task-right"></div>
                    </div>
                  </li>
                </ul>
              </div>
              <!-- 任务列表 -->
              <div class="task-container">
                <ul>
                  <template v-for="item in taskList" :key="item.id">
                    <li
                      :class="[
                        'task-item',
                        'animate__animated animate__fadeIn',
                        `${item.status}`,
                      ]"
                      @click="handleReward(1, item)"
                    ></li>
                  </template>
                </ul>
              </div>
            </div>
            <div class="tips bg-contain">
              <p class="sr-only">累计登录天数可抽取对应奖励</p>
            </div>
            <div class="people"><p class="sr-only">两个小人</p></div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section aria-labelledby="activity-rules-title" class="p-4">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年12月24日~2025年1月7日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>活动期间，达成累计登录天数，即可翻牌抽取随机奖励</li>
                <li>
                  活动期间，完成全部登录任务，即可领取
                  <span class="text-[#ffcb4d]">爱心*2</span>
                </li>
              </ul>
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
import type { Event } from '@/types'
import { useTransitions } from './composables/useTransition'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import {
  type TaskItem,
  type Reward,
  EVENT_NAME,
  ACC_TASK_INDEX,
  TaskStatus,
  createTaskList,
  createAccTaskList,
  SESSION_IS_VISITED_KEY,
} from './config'
import { REWARD_MAP } from '@/constants/rewardMap'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/doubledan2024_1'

const curRewards: Ref<Reward> = ref({
  name: 'resize_potion',
  count: 2,
})

const TASK_LIST = createTaskList()
const ACC_TASK_LIST = createAccTaskList()

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST, ACC_TASK_LIST[0]].map((task, index) => [task.taskId, index]),
)
// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()
const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransitions(SESSION_IS_VISITED_KEY)

// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 获取任务状态
const getTaskStatus = (activity: Event, startIndex: number): TaskStatus => {
  const { award, value, stages } = activity
  if (award?.[startIndex] === 1) return TaskStatus.REDEEMED
  if (award?.[startIndex] === 0 && value >= stages?.[startIndex])
    return TaskStatus.CAN
  return TaskStatus.WAIT
}
// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT_NAME][index]
    return {
      ...item,
      status: getTaskStatus(activity, 0),
    }
  })
})

// 累计任务列表
const accTaskList = computed(() => {
  const activity = activityData.value.event_data[EVENT_NAME][ACC_TASK_INDEX]
  let info = { name: '', count: 1 }
  return ACC_TASK_LIST.map((item, index) => {
    if (activity.awarded_infos && activity.award[index] === 1) {
      info = activity.awarded_infos[index][0]
    }
    return {
      ...item,
      status: getTaskStatus(activity, index),
      info,
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

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  const tasksValid =
    tasks[0].value >= tasks[0].stages[0] && tasks[0].award[0] === 0
  const accTask = tasks[ACC_TASK_INDEX]
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
          [EVENT_NAME]: data.event_data[EVENT_NAME].sort(
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
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(rewardId: number, item: TaskItem): void {
  const { status, taskId } = item
  if (status === TaskStatus.REDEEMED) {
    return
  }
  if (status === TaskStatus.WAIT) {
    showToast('还未完成任务')
    return
  }

  claimMissionReward({
    event: EVENT_NAME,
    task: taskId,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = rewards[0]
      // 更新页面数据
      const taskIndex = activityData.value.event_data[EVENT_NAME].findIndex(
        (item) => {
          return item.task_id === taskId
        },
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      const awardedInfos = activityData.value.event_data[EVENT_NAME][taskIndex]
        .awarded_infos as Reward[][]
      awardedInfos[rewardId - 1] = rewards

      showToast(
        `领取成功，您获得了 ${
          REWARD_MAP[curRewards.value.name as keyof typeof REWARD_MAP]
        }*${curRewards.value.count}`,
      )
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 处理 img src
 * @param name 奖励名
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/rewards/${name}.png`,
    import.meta.url,
  ).href
  return imgSrc
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

.doubledan {
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
    background-image: url('@/assets/images/doubledan-2024-1/bg.jpg');
  }
}

.title {
  position: absolute;
  top: 97px;
  left: 230px;
  width: 1158px;
  height: 190px;
  background-image: url('@/assets/images/doubledan-2024-1/title.png');
}

.help {
  position: absolute;
  width: 83px;
  height: 83px;
  bottom: 12px;
  right: 0px;
  background-image: url('@/assets/images/doubledan-2024-1/help.png');
  background-repeat: no-repeat;
}

.tips {
  position: absolute;
  bottom: 20px;
  left: 382px;
  width: 563px;
  height: 75px;
  background-image: url('@/assets/images/doubledan-2024-1/tips.png');
}

.people {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 791px;
  height: 655px;
  background-image: url('@/assets/images/doubledan-2024-1/people.png');
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
}

.main-container {
  position: absolute;
  left: 87px;
  top: 257px;
  width: 1580px;
  height: 771px;
  background-image: url('@/assets/images/doubledan-2024-1/main-bg.png');
  background-size: contain;
  background-repeat: no-repeat;
}

.acc-task-container {
  margin-left: 54px;
  margin-top: 60px;
}

.acc-task-list {
  display: grid;
  grid-template-columns: 220px 140px repeat(3, 220px);
  grid-template-rows: repeat(3, 220px);
  grid-template-areas:
    'task-item1 task-item2 task-item2 task-item3 task-item4'
    'task-item5 task-item6 task-item6 task-item7 task-item8'
    'task-item9 task-item6 task-item6 task-item10 task-item10';
}

.acc-task-item {
  position: relative;
  perspective: 1000px;
  transition: transform 0.5s linear;
  transform-style: preserve-3d;
  cursor: pointer;
  &.flipped {
    transform: rotateY(180deg);
  }
}

.acc-task-front,
.acc-task-back {
  position: absolute;
  width: 100%;
  height: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  backface-visibility: hidden;
}

.acc-task-front {
  z-index: 1;
  background-size:
    162px 148px,
    contain,
    contain;
}

.acc-task-back {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: contain, contain;
  transform: rotateY(180deg);
}

.acc-task-gift {
  height: 120px;
}

.acc-task-item6 {
  .acc-task-gift {
    height: 150px;
  }
}

.acc-task-right {
  position: absolute;
  bottom: 14px;
  right: 5px;
  width: 57px;
  height: 57px;
  background-image: url('@/assets/images/doubledan-2024-1/acc-task-redeemed-right.png');
  background-repeat: no-repeat;
  background-size: contain;
}

// 通用样式
@mixin common-style($i) {
  &.wait {
    .acc-task-front {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task#{$i}-wait-num.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-wait-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-wait-bg.png');
    }
  }
  &.can,
  &.redeemed {
    .acc-task-front {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task#{$i}-can-num.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-can-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-can-bg.png');
    }
  }
  &.redeemed {
    .acc-task-back {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task-redeemed-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-redeemed-bg.png');
    }
  }
}

// 特殊样式
@mixin special-style($i) {
  &.wait {
    .acc-task-front {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task#{$i}-wait-num.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-wait-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task#{$i}-wait-bg.png');
    }
  }
  &.can,
  &.redeemed {
    .acc-task-front {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task#{$i}-can-num.png'),
        url('@/assets/images/doubledan-2024-1/acc-task-can-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task#{$i}-can-bg.png');
    }
  }
  &.redeemed {
    .acc-task-back {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task-redeemed-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task#{$i}-redeemed-bg.png');
    }
  }
}

@for $i from 1 through 10 {
  .acc-task-item#{$i} {
    grid-area: task-item#{$i};
    @if $i == 2 or $i == 10 {
      @include special-style($i);
    } @else {
      @include common-style($i);
    }
  }
}
.acc-task-item6 {
  &.wait {
    .acc-task-front {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task6-wait-num.png'),
        url('@/assets/images/doubledan-2024-1/acc-task6-wait-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task6-wait-bg.png');
    }
  }
  &.can,
  &.redeemed {
    .acc-task-front {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task6-can-num.png'),
        url('@/assets/images/doubledan-2024-1/acc-task6-can-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task6-can-bg.png');
    }
  }
  &.redeemed {
    .acc-task-back {
      background-image: url('@/assets/images/doubledan-2024-1/acc-task6-redeemed-star.png'),
        url('@/assets/images/doubledan-2024-1/acc-task6-redeemed-bg.png');
    }
  }
}

.task-item {
  margin-top: 100px;
  margin-left: 94px;
  width: 346px;
  height: 347px;
  background-size: contain;
  background-repeat: no-repeat;
  &.wait {
    background-image: url('@/assets/images/doubledan-2024-1/task1-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/doubledan-2024-1/task1-can.png');
  }
  &.redeemed {
    background-image: url('@/assets/images/doubledan-2024-1/task1-redeemed.png');
  }
}
</style>
