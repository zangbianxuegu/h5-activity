<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="music2024 flex h-screen">
      <div class="music2024-main">
        <div class="tips bg-contain"></div>
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title bg-contain bg-no-repeat">
            <div class="sr-only">
              曲意畅想 谱写乐章
              <p>
                <time datetime="2024-12-6">12.6</time>-
                <time datetime="2024-12-19">12.19</time>
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
            <!-- 任务列表 -->
            <h2 id="taskListHeading" class="sr-only">任务列表</h2>
            <ul class="task-list flex">
              <li
                v-for="(item, index) in taskList"
                :key="item.id"
                class="task-item flex flex-col items-center"
                :class="[`task-item${index + 1}`, `${item.status}`]"
              >
                <div
                  class="relative"
                  :aria-label="`任务 ${index + 1}: ${item.title}`"
                >
                  <can-reward-bubble-animation
                    v-if="index != 0"
                    :ref="item.canRewardLottieRef"
                    :id="item.value"
                    class="reward-can-dynamic-bubble z-0"
                  ></can-reward-bubble-animation>
                  <!-- 圆 -->
                  <div
                    :class="[
                      'task-item-icon animate__animated animate__fadeIn relative z-10',
                      `task-item-icon${index + 1}`,
                      `${item.status}`,
                    ]"
                    @click.capture="handleReward($event, 1, item)"
                  ></div>
                  <!-- 对号 -->
                  <p
                    class="task-icon-right"
                    v-if="item.status === 'redeemed' && index !== 0"
                  ></p>
                </div>
                <div class="task-item-desc relative top-[-34px]">
                  <p
                    :class="['task-item-tag', `${item.className}`]"
                    v-if="item.date"
                  >
                    {{ item.tagText }}
                  </p>
                  <p
                    :class="[
                      'task-item-title',
                      `${
                        item.status === 'can'
                          ? 'text-[#ffeea9]'
                          : item.status === 'redeemed' ||
                              item.status === 'overdue'
                            ? 'text-[#bebebe]'
                            : 'text-white'
                      }`,
                    ]"
                  >
                    {{ item.title }}
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section
              aria-labelledby="activity-rules-title"
              class="h-[680px] overflow-y-scroll p-4"
            >
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年12月6日~2024年12月19日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>
                  活动期间，使用云巢小镇上的乐器练习演奏，即可领取
                  <span class="text-[#ffcb4d]">璀璨之星魔法*1</span>
                </li>
                <li>
                  12.6~12.7，在小镇的舞台上录制一段欢乐主题的演奏，即可领取
                  <span class="text-[#ffcb4d]">元气满满魔法*1</span>
                </li>
                <li>
                  12.8~12.9，在小镇的舞台上录制一段希望主题的演奏，即可领取
                  <span class="text-[#ffcb4d]">留影蜡烛*1</span>
                </li>
                <li>
                  12.10~12.11，在圆梦村剧场的舞台上录制一段竖琴演奏，即可领取
                  <span class="text-[#ffcb4d]">光能药剂*1</span>
                </li>
                <li>
                  12.12~12.13，在音乐餐厅的舞台上录制一段忧郁主题的演奏，即可领取
                  <span class="text-[#ffcb4d]">漂浮魔法*1</span>
                </li>
                <li>
                  12.14~12.16，在小王子的梦的舞台上录制一段自信主题的演奏，即可领取
                  <span class="text-[#ffcb4d]">长大成人</span>
                </li>
                <li>
                  12.17~12.19，在落日竞技场的舞台上录制一段胜利主题演奏的演奏，即可领取
                  <span class="text-[#ffcb4d]">彩虹尾迹*1</span>
                </li>
                <li>
                  活动期间完成任意5个任务，即可领取
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
import { Session } from '@/utils/storage'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/music2024'
import gsap from 'gsap'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  glow: string
  energy: string
  recording_candle: string
  energy_potion: string
  gravity: string
  grow: string
  trail_rainbow: string
  heart: string
}
/**
 * hadRenderLottie: 是否渲染过lottie（解决因computed和watch多次更新导致多次渲染lottie）
 */
interface Reward {
  id: number
  value: string
  title: string
  date: string
  status: 'wait' | 'redeemed' | 'can' | 'overdue' | string
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
  className?: string
  tagTxt?: string
}
const rewardsText: RewardsName = {
  glow: '璀璨之星魔法',
  energy: '元气满满魔法',
  recording_candle: '留影蜡烛',
  energy_potion: '光能药剂',
  gravity: '漂浮魔法',
  grow: '长大成人',
  trail_rainbow: '彩虹尾迹',
  heart: '爱心',
}
const curRewards: Ref<Rewards> = ref({
  name: 'glow',
  count: 1,
})

// 创建任务的函数
const taskItem = (
  id: number,
  value: string,
  title: string,
  date: string = '',
  status = 'wait',
  canRewardLottieRef = ref() as Ref<
    Array<InstanceType<typeof CanRewardBubbleAnimation>>
  >,
  hadRenderLottie = ref(false),
): Reward => ({
  id,
  value,
  title,
  date,
  status,
  canRewardLottieRef,
  hadRenderLottie,
})
// 主任务列表
const TASK_LIST = [
  taskItem(
    1,
    'activitycenter_music_2024_m8',
    '完成任意\n5个任务',
    '',
    'wait',
    undefined,
  ),
  taskItem(2, 'activitycenter_music_2024_m2', '云巢小镇\n“喜悦”', '12.6-12.7'),
  taskItem(3, 'activitycenter_music_2024_m3', '云巢小镇\n“希望”', '12.8-12.9'),
  taskItem(
    4,
    'activitycenter_music_2024_m4',
    '圆梦村剧场\n“梦想”',
    '12.10-12.11',
  ),
  taskItem(
    5,
    'activitycenter_music_2024_m5',
    '音乐餐厅\n“忧郁”',
    '12.12-12.13',
  ),
  taskItem(
    6,
    'activitycenter_music_2024_m6',
    '星光沙漠\n“信心”',
    '12.14-12.16',
  ),
  taskItem(
    7,
    'activitycenter_music_2024_m7',
    '落日竞技场\n“胜利”',
    '12.17-12.19',
  ),
  taskItem(8, 'activitycenter_music_2024_m1', '用小镇舞台\n的乐器演奏'),
]

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
getResponsiveStylesFactor()
// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_music_2024'
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)

// 任务排序
const taskOrderMap = new Map(
  [...TASK_LIST].map((task, index) => [task.value, index]),
)

// 获取任务状态
const getTaskStatus = (activity: Event): string => {
  const { award, value, stages } = activity
  if (award?.[0] === 1) return 'redeemed'
  if (award?.[0] === 0 && value >= stages?.[0]) return 'can'
  return 'wait'
}
// 任务列表
const taskList = computed(() => {
  const statusMap: Record<
    number,
    Record<string, { className: string; tagText: string }>
  > = {
    1: {
      any: { className: 'nostart', tagText: '' },
    },
    2: {
      redeemed: { className: 'redeemed', tagText: '已完成' },
      can: { className: 'redeemed', tagText: '已完成' },
      wait: { className: 'ongoing', tagText: '正在进行' },
    },
    3: {
      redeemed: { className: 'redeemed', tagText: '已完成' },
      can: { className: 'redeemed', tagText: '已完成' },
      overdue: { className: 'overdue', tagText: '已过期' },
    },
  }

  return TASK_LIST.map((item, index) => {
    const activity = activityData.value.event_data[EVENT_NAME][index]
    let status = getTaskStatus(activity)

    let className: string = ''
    let tagText: string = ''

    if (item.date !== '') {
      const result = checkTodayAgainstDateRange(item.date)
      status = result === 3 && status === 'wait' ? 'overdue' : status
      const statusInfo = getStatusInfo(statusMap, result, status, item.date)
      ;({ className, tagText } = statusInfo)
    }

    return {
      ...item,
      className,
      tagText,
      status,
    }
  })
})

/**
 * @function 检查当前日期在指定日期范围的状态
 * @param {string} data 时间范围
 * @returns {1|2|3} 未到时间|正在进行|已过期
 */
function checkTodayAgainstDateRange(data: string): 1 | 2 | 3 {
  const [start, end] = data.split('-').map((date) => date.split('.'))
  // 解析给定的日期范围
  const startMonth = parseInt(start[0], 10)
  const startDay = parseInt(start[1], 10)
  const endMonth = parseInt(end[0], 10)
  const endDay = parseInt(end[1], 10)
  // 获取当前日期
  const today = new Date()
  const currentMonth = today.getMonth() + 1 // 月份从0开始计数，需要加1
  const currentDay = today.getDate()
  // 判断当前日期是否在范围内
  if (
    currentMonth < startMonth ||
    (currentMonth === startMonth && currentDay < startDay)
  ) {
    return 1 // 未到时间
  }
  if (
    currentMonth > endMonth ||
    (currentMonth === endMonth && currentDay > endDay)
  ) {
    return 3 // 已过期
  }
  return 2 // 正在进行
}

function getStatusInfo(
  statusMap: Record<
    number,
    Record<
      string,
      {
        className: string
        tagText: string
      }
    >
  >,
  result: number,
  status: string,
  date: string,
): {
  className: string
  tagText: string
} {
  const defaultStatus = statusMap[result]?.[status] ||
    statusMap[result]?.any || { className: '', tagText: '' }
  return { ...defaultStatus, tagText: defaultStatus.tagText || date }
}

const sessionIsVisitedKey = 'isVisitedMusic24'
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

/**
 * @function 检查是否有未领奖
 * @param {Event[]} tasks 任务列表
 * @returns {boolean} 是否有未领奖
 */
function checkHasUnclaimedReward(tasks: Event[]): boolean {
  // 检查1-8项，任务列表
  const tasksValid = tasks
    .slice(0, 8)
    .some((task) => task.value >= task.stages[0] && task.award[0] === 0)
  return tasksValid
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
 * @param event 鼠标事件
 * @param rewardId 第几个奖励节点 不传默认1
 * @param item 任务项
 * @returns {void}
 */
function handleReward(event: MouseEvent, rewardId: number, item: Reward): void {
  const { status, value, id } = item
  if (status === 'redeemed' || status === 'overdue') {
    return
  }
  if (status === 'wait') {
    showToast('还未完成任务')
    clickBubbleRewardWait(event)
    return
  }
  claimMissionReward({
    event: EVENT_NAME,
    task: value,
    rewardId,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = {
        name: rewards[0].name,
        count: rewards[0].count,
      }
      id !== 1 && (await bubbleBurst(event, item))
      // 更新页面数据
      const taskIndex = activityData.value.event_data[EVENT_NAME].findIndex(
        (item) => {
          return item.task_id === value
        },
      )
      activityData.value.event_data[EVENT_NAME][taskIndex].award[rewardId - 1] =
        1
      showToast(
        `领取成功，您获得了 ${
          rewardsText[curRewards.value.name as keyof RewardsName]
        }*${curRewards.value.count}`,
      )
      // 更新红点
      setRedDot()
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 奖品wait状态点击果冻效果
const clickBubbleRewardWait = (event: MouseEvent): void => {
  const dom = event.target
  gsap
    .timeline()
    .to(dom, { scaleY: 0.8, duration: 0.2, ease: 'power1.in' }) // 垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 垂直拉伸
    .to(dom, { scaleY: 0.9, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1, duration: 0.2, ease: 'power1.out' }) // 恢复原样
}

const initCanRewardLottie = (reward: Reward): void => {
  if (reward.canRewardLottieRef?.value) {
    reward.canRewardLottieRef?.value[0].initLottie()
  }
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    reward.hadRenderLottie.value = true
  }
}

const handleTask = (task: Reward): void => {
  if (task.status === 'can') {
    void nextTick(() => {
      if (task.hadRenderLottie && !task.hadRenderLottie.value) {
        initCanRewardLottie(task)
      }
    })
  } else {
    task.canRewardLottieRef?.value?.[0]?.destroyAnimation()
  }
}

watchEffect(() => {
  taskList.value.forEach(handleTask)
})

const bubbleBurst = async (
  event: MouseEvent,
  reward: Reward,
): Promise<void> => {
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value[0].playAnimationClickBubble()
  }
  const target = event.target
  // 溅射效果
  await gsap
    .timeline()
    .to(target, {
      scaleY: 0.8,
      duration: 0.2,
      ease: 'power1.in',
      opacity: 0.9,
    }) // 垂直压挤
    .to(target, {
      scaleY: 1.1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0.5,
    }) // 垂直拉伸
    .to(target, {
      scaleY: 1,
      duration: 0.2,
      ease: 'power1.out',
      opacity: 0,
    }) // 再次垂直压挤
}

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
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

.music2024 {
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
    background-image: url('@/assets/images/music-2024/bg.jpg');
  }
}

.title {
  position: absolute;
  left: 134px;
  top: 32px;
  width: 1176px;
  height: 209px;
  background-image: url('@/assets/images/music-2024/title.png');
}
.help {
  position: absolute;
  width: 75px;
  height: 75px;
  top: 116px;
  right: 0px;
  background-image: url('@/assets/images/music-2024/help.png');
}
.tips {
  position: absolute;
  width: 877px;
  height: 65px;
  bottom: 20px;
  right: 22px;
  background-image: url('@/assets/images/music-2024/tips.png');
}

.task-list {
  position: absolute;
  left: 76px;
  top: 300px;
  width: 1949px;
  height: 660px;
  flex-wrap: wrap;
}
.task-item {
  position: absolute;
}
.task-item1 {
  left: 20px;
  bottom: -24px;
  .task-item-desc {
    width: 218px;
    top: -18px;
    background-image: url('@/assets/images/music-2024/task1-star.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center 8px;
  }
  &.redeemed {
    .task-item-desc {
      background-image: url('@/assets/images/music-2024/task1-star-redeemed.png');
    }
  }
}
.task-item2 {
  top: 130px;
  left: 266px;
  .task-item-tag.nostart {
    width: 144px;
  }
}
.task-item3 {
  top: 30px;
  left: 482px;
  .task-item-tag.nostart {
    width: 144px;
  }
}
.task-item4 {
  top: -48px;
  left: 720px;
}
.task-item5 {
  top: 52px;
  right: 724px;
}
.task-item6 {
  bottom: 114px;
  right: 516px;
}
.task-item7 {
  top: 88px;
  right: 292px;
}
.task-item8 {
  top: -52px;
  right: 82px;
  .task-item-title {
    top: -40px;
  }
}

.task-item-tag {
  width: 144px;
  height: 42px;
  color: #fff;
  font-size: 28px;
  text-align: center;
  line-height: 1.6;
  border-radius: 22px;
  &.ongoing {
    background-color: #82b063;
  }
  &.nostart {
    width: 177px;
    background-color: #77a2ff;
  }
  &.redeemed {
    background-color: #4e6aaa;
  }
  &.overdue {
    background-color: #7f8594;
  }
}
.task-item-title {
  margin-top: 4px;
  font-size: 30px;
  text-align: center;
  line-height: 1.2;
  white-space: pre-line;
}
.task-icon-right {
  width: 46px;
  height: 46px;
  position: absolute;
  top: 134px;
  right: 52px;
  z-index: 10;
  background-image: url('@/assets/images/music-2024/task-icon-right.png');
  background-repeat: no-repeat;
  background-size: contain;
}
.task-item-icon {
  width: 256px;
  height: 230px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
@for $i from 1 through 10 {
  .task-item-icon#{$i} {
    &.wait {
      background-image: url('@/assets/images/music-2024/task#{$i}-wait.png');
    }
    &.redeemed,
    &.overdue {
      background-image: url('@/assets/images/music-2024/task#{$i}-redeemed.png');
    }
    &.can {
      background-image: url('@/assets/images/music-2024/task#{$i}-can.png');
    }
  }
}
.task-item-icon1 {
  width: 318px;
  height: 235px;
}
.task-item-icon1.can {
  background-position: 2px 7px;
}
.task-item-icon2.can {
  background-size: 96px 52px;
}
.task-item-icon3.can {
  background-size: 48px 80px;
}
.task-item-icon4.can {
  background-size: 76px 81px;
}
.task-item-icon5.can {
  background-size: 67px 87px;
}
.task-item-icon6.can {
  background-size: 69px 86px;
}
.task-item-icon7.can {
  background-size: 94px 84px;
}
.task-item-icon8.can {
  background-size: 79px 82px;
}
.reward-can-dynamic-bubble {
  width: 180px;
  height: 160px;
  position: absolute;
  top: 46px;
  left: 38px;
  pointer-events: none;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}
</style>
