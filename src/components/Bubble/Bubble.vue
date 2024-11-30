<template>
  <div class="relative" @click.capture="handleClickBubble">
    <can-reward-bubble-animation
      :ref="reward.canRewardLottieRef"
      :id="`${reward.taskId}-${reward.id}`"
      class="reward-bubble animate__animated animate__fadeIn animate__slow pointer-events-none z-0"
    ></can-reward-bubble-animation>
    <div :class="bounceClass">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { animateBounce, animateBounceEase } from '@/utils/utils'
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 定义单个奖励项接口
interface Reward {
  id: number // 奖励ID
  taskId: string // 任务字段名
  title: string // 奖励标题
  status: 'wait' | 'redeemed' | 'can' // 奖励状态
  val: number // 奖励值
  canRewardLottieRef: Ref<InstanceType<typeof CanRewardBubbleAnimation>> // 可领取动画引用
  hadRenderLottie?: Ref<boolean> // 是否已渲染动画
}

const props = defineProps({
  // 奖励对象
  reward: {
    type: Object,
    default: () => ({
      id: 1,
      taskId: 'taskId',
      title: 'title',
      status: 'wait',
      val: 1,
      canRewardLottieRef: ref(),
      hadRenderLottie: ref(false),
    }),
  },
  // 奖励列表
  rewardList: {
    type: Array,
    default: () => [],
  },
  // 动画气泡放大倍数
  bubbleScale: {
    type: Number,
    default: 1,
  },
  /**
   * bounce 元素 class 名
   * 当存在 rewardList 时，关联的 Bubble 组件需要设置相同的 `bounce-class`
   */
  bounceClass: {
    type: String,
    default: '',
  },
  // 点击是否播放动画
  isPlayAnimation: {
    type: Boolean,
    default: true,
  },
})

/**
 * @function 点击气泡事件处理函数
 * @description 处理气泡点击事件，根据奖励状态执行不同的动画效果
 * @returns {Promise<void>}
 */
const handleClickBubble = async (): Promise<void> => {
  // 获取所有需要bounce的元素
  const bounceEleList = document.querySelectorAll(`.${props.bounceClass}`)
  const taskList = Array.from(bounceEleList).map(
    (bounceEle) => bounceEle.children[0],
  ) as HTMLElement[]
  // bubble 效果
  if (taskList.length > 0) {
    if (props.reward.status === 'wait') {
      taskList.forEach((task) => {
        // 元素 bounce
        animateBounce(task)
      })
    }
  }
}

/**
 * @function 点击奖励单个或多个气泡同时炸开动画
 * @returns {Promise<void>}
 */
const handleBubbleBurst = async (): Promise<void> => {
  // 获取所有需要bounce的元素
  const bounceEleList = document.querySelectorAll(`.${props.bounceClass}`)
  const taskList = Array.from(bounceEleList).map(
    (bounceEle) => bounceEle.children[0],
  ) as HTMLElement[]
  // 奖励列表
  let rewardList = props.rewardList
  if (!props.rewardList || props.rewardList.length === 0) {
    rewardList = [props.reward]
  }
  // bubble 效果
  if (taskList.length > 0 && props.isPlayAnimation) {
    // 领奖动画
    await Promise.all(
      taskList.map((task, idx) => {
        return bubbleBurst(task, rewardList[idx] as Reward)
      }),
    )
  }
}

/**
 * @function 初始化可领取奖励的Lottie动画
 * @param {Reward} reward - 奖励对象
 * @returns {void}
 */
const initCanRewardLottie = (reward: Reward): void => {
  // 初始化Lottie动画
  reward.canRewardLottieRef?.value.initLottie()
  // 避免多次更新computed和watch所引起的多次渲染lottie
  if (reward.hadRenderLottie) {
    // 标记Lottie动画已经渲染
    reward.hadRenderLottie.value = true
  }
}

/**
 * @function handleRewardLottie
 * @description 任务动画处理
 * @param {Reward} reward
 * @returns {void}
 */
const handleRewardLottie = (reward: Reward): void => {
  if (reward.status === 'can') {
    void nextTick(() => {
      // 检查是否需要初始化 Lottie 动画
      if (reward.hadRenderLottie && !reward.hadRenderLottie.value) {
        initCanRewardLottie(reward)
      }
    })
  } else {
    // 如果任务状态不是 'can'，销毁相关的 Lottie 动画
    reward.canRewardLottieRef?.value?.destroyAnimation()
  }
}

/**
 * @function 领奖气泡爆炸动画
 * @param {HTMLElement} dom - dom元素
 * @param {Reward} reward - 奖励对象
 * @returns {Promise<void>}
 */
const bubbleBurst = async (dom: HTMLElement, reward: Reward): Promise<void> => {
  // 播放 lottie 气泡爆炸动画
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value.playAnimationClickBubble()
  }
  // 元素 bounce
  await animateBounceEase(dom)
}

watch(
  () => props.reward.status,
  (newVal, oldVal) => {
    if (newVal === 'redeemed' && oldVal === 'can') {
      void handleBubbleBurst()
    }
  },
)

watch(
  () => props.reward,
  (newVal) => {
    if (newVal) {
      handleRewardLottie(newVal as Reward)
    }
  },
)
</script>

<style lang="scss" scoped>
.reward-bubble {
  position: absolute;
  & > :first-child {
    position: absolute;
    transform: scale(v-bind('props.bubbleScale')) !important;
  }
}
</style>
