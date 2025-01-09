<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div
      class="page relative z-20 flex h-screen w-screen items-center justify-center bg-cover bg-center"
    >
      <div class="page-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative bg-contain bg-no-repeat">
            <div class="sr-only">
              舞蛇贺岁
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
            <!-- 任务列表 -->
            <div class="main-box absolute">
              <!-- 拼图列表 -->
              <ul
                v-for="(list, index) in taskList"
                :key="list.id"
                :class="[
                  'task-list relative bg-contain',
                  {
                    active: getListIsActive(index),
                  },
                ]"
              >
                <h2 class="ml-[135px] mt-[138px] text-[42px] text-[#ffedcf]">
                  {{ list.title }}
                </h2>
                <img
                  :src="handleSrc(`pic${index + 1}`)"
                  class="task-img absolute left-[21px] top-[200px] h-[626px] w-[346px] overflow-hidden"
                  alt="pic"
                />
                <!-- 拼图块列表 -->
                <ul
                  class="absolute left-[21px] top-[200px] h-[626px] w-[346px]"
                >
                  <!-- 3块拼图 -->
                  <li
                    v-for="task in list.children.slice(0, 3)"
                    :key="task.id"
                    :class="[
                      'task-item relative flex items-center justify-center bg-cover bg-no-repeat',
                      task.status,
                      `task-item-${task.id}`,
                      `task-item-${list.id}-${task.id}`,
                      { 'opacity-0': task.status === TaskStatus.REDEEMED },
                    ]"
                    @click="handleReward(1, task, list.id)"
                  >
                    <p
                      class="whitespace-pre-wrap text-center text-[36px] text-[#935733]"
                    >
                      {{ task.title }}
                    </p>
                    <div
                      :class="[
                        'token coin-icon absolute z-20 hidden',
                        `token-${list.id}-${task.id}`,
                      ]"
                    ></div>
                  </li>
                  <!-- 解锁整块拼图的额外奖励 -->
                  <li
                    v-if="
                      list.children[3].id === 4 &&
                      list.children[3].status !== TaskStatus.WAIT
                    "
                    :class="[
                      'task-item-extra flex items-center justify-center',
                      {
                        'animate__animated animate__fadeOut animate__delay-2s':
                          list.children[3].status === TaskStatus.REDEEMED,
                      },
                    ]"
                  >
                    <Bubble
                      :bubble-scale="1.9"
                      :reward="list.children[3]"
                      :bounce-class="`${list.children[3].taskId}-${list.id}`"
                      @click="handleReward(1, list.children[3])"
                    >
                      <div
                        :class="[
                          'task-icon animate__animated animate__fadeIn relative z-10 bg-contain bg-center bg-no-repeat',
                          `task-icon${list.id}`,
                          `${list.children[3].status}`,
                        ]"
                      ></div>
                    </Bubble>
                  </li>
                </ul>
              </ul>
            </div>
          </section>
        </Transition>
      </div>
      <!-- 活动规则弹框 -->
      <ModalHelp ref="modalHelp" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import type { Event } from '@/types'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/winter2025_2'
import { useTokenStore } from '@/stores/winter2025'
import Bubble from '@/components/Bubble'
import ModalHelp from './components/ModalHelp.vue'
import { useTransition } from '@/composables/useTransition'
import { REWARD_MAP } from '@/constants/rewardMap'
import {
  EVENT_NAME,
  type Reward,
  type TaskItem,
  TaskStatus,
  createTaskList,
  SESSION_IS_VISITED_KEY,
} from './config'

gsap.registerPlugin(MotionPathPlugin)
// 响应式缩放
getResponsiveStylesFactor(2560, 1200)
const router = useRouter()

// 规则弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransition(SESSION_IS_VISITED_KEY)

const TASK_LIST = createTaskList()

// 任务排序
const TASK_LIST_ALL = TASK_LIST.map((list) => list.children).flat()
const TASK_ID_list = TASK_LIST_ALL.map((task) => task.taskId)
const taskOrderMap = new Map(
  TASK_LIST_ALL.map((task, index) => [task.taskId, index]),
)

// 当前奖励
const curReward: Ref<Reward> = ref({
  name: 'lantern_token',
  count: 60,
})

// 活动数据
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const eventData = computed(() => activityData.value.event_data[EVENT_NAME])
const tokenStore = useTokenStore()
const tokenCount = computed(() =>
  Number(tokenStore.tokenInfo?.lantern_token || 0),
)

// 任务列表
const taskList = computed(() => {
  return TASK_LIST.map((item, listIndex) => {
    return {
      ...item,
      children: TASK_LIST[listIndex].children.map((task, taskIndex) => {
        const index = listIndex * 4 + taskIndex
        return {
          ...task,
          status: getTaskStatus(eventData.value[index], 0),
        }
      }),
    }
  })
})
console.log('任务列表数据: ', taskList)

onMounted(() => {
  try {
    getActivityData()
    tokenStore.initData()
  } catch (error) {
    console.error(error)
  }
})

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
 * @param {TaskItem} item 任务项
 * @param {number} [listId] 任务列表id
 * @returns {void}
 */
function handleReward(rewardId: number, item: TaskItem, listId?: number): void {
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
      curReward.value = res.data.rewards.filter(
        (reward: Reward) => !TASK_ID_list.includes(reward.name),
      )[0]
      // 更新页面数据
      const taskIndex = eventData.value.findIndex(
        (item) => item.task_id === taskId,
      )
      if (!taskId.includes('extra')) {
        await handleTokenFly(item.id, listId as number)
      }
      showToast(
        `领取成功，您获得了 ${REWARD_MAP[curReward.value.name as keyof typeof REWARD_MAP]}*${curReward.value.count}`,
      )
      const newTokenInfo = {
        lantern_token: tokenCount.value + Number(curReward.value.count),
      }
      tokenStore.updateTokenInfo(newTokenInfo)
      eventData.value[taskIndex].award[rewardId - 1] = 1
      // TODO: 三个拼图块完成后，解锁额外任务
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function handleTokenFly
 * @description 奖励飞入代币总数动画
 * @param {number} taskId 任务id
 * @param {number} listId 任务列表id
 * @returns {Promise<void>}
 */
async function handleTokenFly(taskId: number, listId: number): Promise<void> {
  try {
    const token = document.querySelector(
      `.token-${listId}-${taskId}`,
    ) as HTMLElement
    token.classList.remove('hidden')
    const tokenRect = token.getBoundingClientRect()
    const target = document.querySelector('.coin-icon') as HTMLElement
    const targetRect = target.getBoundingClientRect()

    await new Promise<void>((resolve) => {
      gsap.to(token, {
        duration: 0.7,
        ease: 'power1.out',
        opacity: 1,
        startAt: { x: 0, y: 0, opacity: 1, scale: 1 },
        motionPath: {
          path: [
            // x, y 为目标位置距离运动元素的偏移量
            {
              x: -(
                tokenRect.left -
                targetRect.left -
                targetRect.width / 2 +
                tokenRect.width / 2
              ),
              y: -(
                tokenRect.top -
                targetRect.top -
                targetRect.height / 2 +
                tokenRect.height / 2
              ),
              scale: 0.5,
            },
          ],
          autoRotate: false,
        },
        onComplete: () => {
          gsap.set(token, { opacity: 0 })
          resolve() // 动画完成后调用resolve
        },
      })
    })
  } catch (error) {
    console.log('error: ', error)
  }
}

/**
 * @function 是否已领奖
 * @param tasks 累计任务列表
 * @returns {boolean} 是否有未领取奖励
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  return tasks.some(
    (task) => task.value >= task.stages[0] && task.award[0] === 0,
  )
}

/**
 * @function 设置红点
 */
function setRedDot(): void {
  const hasUnclaimedReward = checkHasUnclaimedReward(eventData.value)
  menuStore.updateMenuDataByHasUnclaimedReward(EVENT_NAME, hasUnclaimedReward)
}

/**
 * @function getTaskStatus
 * @description 获取任务状态
 * @param {Event} activity 活动数据
 * @param {number} index 当前索引
 * @returns {TaskStatus} 任务状态
 */
const getTaskStatus = (activity: Event, index: number): TaskStatus => {
  const { award, value, stages } = activity
  if (award?.[index] === 1) {
    return TaskStatus.REDEEMED
  } else if (award?.[index] === 0 && value >= stages?.[index]) {
    return TaskStatus.CAN
  }
  return TaskStatus.WAIT
}

/**
 * @function handleSrc
 * @description 处理动态图片路径
 * @param {string} name 图片名称
 * @returns {string} 图片路径
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/winter2025-2/${name}.jpg`,
    import.meta.url,
  ).href
  return imgSrc
}

/**
 * @function getListIsActive
 * @description 获取列表拼图任务是否完成
 * @param {number} index 任务列表索引
 * @returns {boolean} 是否完成
 */
function getListIsActive(index: number): boolean {
  return taskList.value[index]?.children
    .slice(0, 3)
    .every((task: TaskItem) => task.status === TaskStatus.REDEEMED)
}

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
  background-image: url('@/assets/images/winter2025-2/bg.jpg');
  // 主体内容区
  &-main {
    width: 2560px;
    height: 1200px;
    transform: scale(var(--scale-factor));
  }
}
.title {
  position: absolute;
  left: 1016px;
  top: 25px;
  width: 646px;
  height: 186px;
  background-image: url('@/assets/images/winter2025-2/title.png');
}
.help {
  position: absolute;
  width: 64px;
  height: 64px;
  bottom: 16px;
  right: -70px;
  background-image: url('@/assets/images/winter-main-2025/help.png');
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
.main-box {
  left: 50%;
  top: 180px;
  transform: translateX(-50%);
  width: calc(389px * 5 + 30px * 4);
  height: 988px;
}
.task-list {
  float: left;
  margin-right: 30px;
  width: 389px;
  height: 988px;
  background-image: url('@/assets/images/winter2025-2/box-bg.png');

  &:nth-last-child(1) {
    margin-right: 0;
  }

  &.active {
    background-image: url('@/assets/images/winter2025-2/box-bg-active.png');
  }
}
.task-img {
  border-radius: 24px;
}
.task-item {
  width: 346px;
  height: calc(626px / 3);
  border: 4px solid rgb(236, 205, 158);

  &:nth-child(1) {
    margin-top: 0;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    background-image: url('@/assets/images/winter2025-2/box-top.jpg');
  }

  &:nth-child(2) {
    background-image: url('@/assets/images/winter2025-2/box-middle.jpg');
  }

  &:nth-child(3) {
    border-bottom-left-radius: 24px;
    border-bottom-right-radius: 24px;
    background-image: url('@/assets/images/winter2025-2/box-bottom.jpg');
  }

  &.can {
    border-color: rgba(255, 237, 209, 1);
    animation: glow 1s infinite alternate;
  }

  &-extra {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 346px;
    height: calc(626px / 3);
    background: linear-gradient(to bottom, transparent, #a06163);
  }
}
@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(255, 237, 209, 1);
  }
  to {
    box-shadow: 0 0 50px rgba(255, 237, 209, 1);
  }
}
.task-icon {
  width: 200px;
  height: 200px;
}
@for $i from 1 through 5 {
  .task-icon#{$i} {
    &.can {
      background-image: url('@/assets/images/winter2025-2/task#{$i}.png');
    }
  }
}

.task-icon1.can {
  background-size: 93px 100px;
}
.task-icon2.can {
  background-size: 79px 112px;
}
.task-icon3.can {
  background-size: 74px 109px;
}
.task-icon4.can {
  background-size: 48px 114px;
}
.task-icon5.can {
  background-size: 65px 97px;
}
.token {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
