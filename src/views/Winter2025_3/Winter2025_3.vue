<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div class="h-full w-full">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative bg-contain bg-no-repeat">
            <div class="sr-only">
              相遇寄福
              <p>
                <time datetime="2025-1-23">1.23</time>
                <time datetime="2025-2-10">2.10</time>
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
            <div class="back cursor-pointer bg-contain" @click="router.back()">
              <div class="sr-only">back</div>
            </div>
            <!-- 代币总数 -->
            <div class="coin flex items-center">
              <div class="coin-icon"></div>
              <div class="flex-1 text-center">{{ tokenCount }}</div>
            </div>
            <!-- 全服赠送心火 -->
            <div class="absolute left-[308px] top-[20%] h-[590px] w-[1472px]">
              <h2 class="task-title bg-contain bg-no-repeat"></h2>
              <ul class="flex">
                <li
                  v-for="(item, index) in serverAccTaskList"
                  :key="item.id"
                  :class="[
                    'animate__animated animate__fadeIn absolute',
                    `server-acc-task-item${index + 1}`,
                  ]"
                >
                  <p class="text-center text-[32px] text-[#d9dfc8]">
                    {{ item.title }}
                  </p>
                  <div
                    :class="['lantern cursor-pointer', `${item.status}`]"
                    @click="handleReward(index + 1, item)"
                  ></div>
                </li>
              </ul>
            </div>
            <!-- 给好友赠送心火 -->
            <ul class="absolute right-[30px] top-[20%]">
              <li
                v-for="(task, tdx) in personAccTaskList"
                :key="tdx"
                class="acc-task-item flex items-center justify-end"
              >
                <div class="text-right text-[32px] text-[#fff]">
                  <p>给好友赠送心火{{ (tdx * 4 + 1) * 10 }}次</p>
                  <p class="text-[28px] text-[#ffeb8c]">
                    （{{ updateRewardToken(tdx) }}/{{ (tdx * 4 + 1) * 10 }}）
                  </p>
                </div>

                <div v-for="(item, index) in task" :key="item.taskId">
                  <Bubble
                    :bubble-scale="1.8"
                    :reward="item"
                    :bounce-class="`${item.taskId}-${item.id}`"
                    @click="handleReward(tdx + 1, item)"
                  >
                    <div
                      :class="[
                        'acc-task-icon animate__animated animate__fadeIn relative z-10',
                        `acc-task${tdx + 1}-icon${index + 1}`,
                        `${item.status}`,
                      ]"
                    ></div>
                  </Bubble>
                </div>
              </li>
            </ul>
            <!-- 左边小人-->
            <div class="npc1"></div>
            <!-- 右边小人-->
            <div class="npc2"></div>
            <!-- 相遇礼盒-->
            <div class="gift"></div>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
        <ModalReward ref="modalReward" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { Event } from '@/types'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/winter2025_3'
import { useActivityStore as useActivityLanternStore } from '@/stores/winter2025_4'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import Bubble from '@/components/Bubble'
import ModalHelp from './components/ModalHelp.vue'
import ModalReward from './components/ModelReward.vue'
import { useTransition } from '@/composables/useTransition'
import { REWARD_MAP } from '@/constants/rewardMap'
import {
  EVENT_NAME,
  type Reward,
  type TaskItem,
  TaskStatus,
  createPersonAccTaskList,
  createServerAccTaskList,
  SESSION_IS_VISITED_KEY,
} from './config'

const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransition(SESSION_IS_VISITED_KEY)

const curReward: Ref<Reward> = ref({
  name: 'lantern_token',
  count: 10,
})
const modalReward = ref<InstanceType<typeof ModalReward> | null>(null)

const PERSON_ACC_TASK_LIST = createPersonAccTaskList()
const SERVER_ACC_TASK_LIST = createServerAccTaskList()
// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])
const activityLanternStore = useActivityLanternStore()
const tokenCount = computed(() =>
  Number(activityLanternStore.activityData.token_info?.lantern_token || 0),
)
const router = useRouter()

// 任务排序
const taskOrderMap = new Map(
  [SERVER_ACC_TASK_LIST[0], PERSON_ACC_TASK_LIST[0]].map((task, index) => {
    if (Array.isArray(task)) {
      return [task[0].taskId, index]
    } else {
      return [task.taskId, index]
    }
  }),
)
const updateRewardToken = (index: number): ComputedRef => {
  return computed(() => {
    const activity = eventData.value[1]
    const targetCount = activity.stages[index]
    return Math.min(activity.value, targetCount)
  })
}

// 获取任务状态
const getTaskStatus = (activity: Event, index: number): TaskStatus => {
  const { award, value, stages } = activity
  if (award?.[index] === 1) return TaskStatus.REDEEMED
  if (award?.[index] === 0 && value >= stages?.[index]) return TaskStatus.CAN
  return TaskStatus.WAIT
}

const serverAccTaskList = computed(() => {
  const activity = eventData.value[0]
  return SERVER_ACC_TASK_LIST.map((item, index) => {
    return {
      ...item,
      status: getTaskStatus(activity, index),
    }
  })
})

const personAccTaskList = computed(() => {
  const activity = eventData.value[1]
  return PERSON_ACC_TASK_LIST.map((task, index) => {
    return task.map((item) => {
      return {
        ...item,
        status: getTaskStatus(activity, index),
      }
    })
  })
})

onMounted(() => {
  try {
    getActivityData()
  } catch (error) {
    console.error(error)
  }
})

/**
 * @function 是否已领奖
 * @param tasks 累计任务列表
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 使用some方法遍历任务列表，对每个任务的阶段进行检查
  return tasks.some((task) => {
    // 判断任务值是否达到或超过当前阶段要求，且奖励未领取
    return task.stages.some(
      (item, index) => task.value >= item && task.award[index] === 0,
    )
  })
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(eventData.value)
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
              const orderA = taskOrderMap.get(a.task_id) as number
              const orderB = taskOrderMap.get(b.task_id) as number
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
  const { taskId, status } = item
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
      curReward.value = res.data.rewards[0]
      // 更新页面数据
      const taskIndex = eventData.value.findIndex(
        (item) => item.task_id === taskId,
      )
      if (taskId === 'send_heart_wax_friend' && rewardId === 2) {
        modalReward.value?.open()
      } else {
        showToast(
          `领取成功，您获得了 ${REWARD_MAP[curReward.value.name as keyof typeof REWARD_MAP]}*${curReward.value.count}`,
        )
        activityLanternStore.activityData.token_info.lantern_token =
          tokenCount.value + Number(curReward.value.count)
      }

      eventData.value[taskIndex].award[rewardId - 1] = 1

      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 规则弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
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
.page {
  background-image: url('@/assets/images/winter2025-3/bg.jpg');
}
.title {
  position: absolute;
  left: 863px;
  top: 86px;
  width: 661px;
  height: 154px;
  background-image: url('@/assets/images/winter2025-3/title.png');
}
.help {
  position: absolute;
  width: 64px;
  height: 64px;
  bottom: 12px;
  right: -64px;
  background-image: url('@/assets/images/winter2025-3/help.png');
}
.back {
  position: absolute;
  width: 169px;
  height: 135px;
  top: 30px;
  left: 80px;
  background-image: url('@/assets/images/winter2025-4/back.png');
}
.coin {
  padding-left: 20px;
  position: absolute;
  top: 40px;
  right: 70px;
  width: 204px;
  height: 51px;
  color: #fffae9;
  font-size: 34px;
  background-color: #2d314d;
  border-radius: 40px;
}
.coin-icon {
  width: 36px;
  height: 57px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-4/coin.png');
}
.gift {
  position: absolute;
  right: 100px;
  bottom: -30px;
  width: 548px;
  height: 544px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-3/gift.png');
}
.npc1 {
  position: absolute;
  left: 340px;
  bottom: 40px;
  width: 524px;
  height: 504px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-3/npc1.png');
}
.npc2 {
  position: absolute;
  right: 720px;
  bottom: 40px;
  width: 324px;
  height: 391px;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/winter2025-3/npc2.png');
}
.task-title {
  position: absolute;
  left: 638px;
  top: 62px;
  width: 525px;
  height: 53px;
  background-image: url('@/assets/images/winter2025-3/task-title.png');
}
.server-acc-task-item1 {
  top: 24px;
  left: 0px;
}
.server-acc-task-item2 {
  top: 84px;
  left: 310px;
}
.server-acc-task-item3 {
  top: 204px;
  left: 584px;
}
.server-acc-task-item4 {
  top: 244px;
  left: 904px;
}
.server-acc-task-item5 {
  top: 100px;
  right: 0;
}
.lantern {
  width: 266px;
  height: 352px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  &.wait {
    background-image: url('@/assets/images/winter2025-3/lantern-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/winter2025-3/lantern-can.png');
    animation: lanternGlow 2s infinite;
  }
  &.redeemed {
    background-image: url('@/assets/images/winter2025-3/lantern-redeemed.png');
  }
}

@keyframes lanternGlow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
.acc-task-item {
  border-bottom: 1px dashed #69636e;
}
.acc-task-icon {
  width: 190px;
  height: 199px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
@for $i from 1 through 2 {
  .acc-task#{$i}-icon#{$i} {
    &.can {
      background-image: url('@/assets/images/winter2025-3/acc#{$i}-task#{$i}-can.png');
    }
    &.wait {
      background-image: url('@/assets/images/winter2025-3/acc#{$i}-task#{$i}-wait.png');
    }

    &.redeemed {
      transition: background-image 1s ease;
      background-image: url('@/assets/images/winter2025-3/acc#{$i}-task#{$i}-redeemed.png');
    }
  }
}
.acc-task2-icon1 {
  &.can {
    background-image: url('@/assets/images/winter2025-3/acc2-task1-can.png');
  }
  &.wait {
    background-image: url('@/assets/images/winter2025-3/acc2-task1-wait.png');
  }

  &.redeemed {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/winter2025-3/acc2-task1-redeemed.png');
  }
}

.acc-task1-icon1.can {
  background-size: 67px 99px;
}
.acc-task2-icon1.can {
  background-size: 62px 85px;
}
.acc-task2-icon2.can {
  background-size: 59px 91px;
}
</style>
