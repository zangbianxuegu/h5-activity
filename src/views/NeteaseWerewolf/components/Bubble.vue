<template>
  <can-reward-bubble-animation
    :ref="reward.canRewardLottieRef"
    :id="`${reward.taskId}`"
    class="reward-can-dynamic-bubble animate__animated animate__fadeIn animate__slow"
  ></can-reward-bubble-animation>
  <slot></slot>
</template>

<script setup lang="ts">
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import gsap from 'gsap'
// 定义单个奖励项接口
interface Reward {
  id: number // 奖励ID
  taskId: string // 任务字段名
  title: string // 奖励标题
  status: 'wait' | 'redeemed' | 'can' | string // 奖励状态
  val: number // 奖励值
  canRewardLottieRef: Ref<InstanceType<typeof CanRewardBubbleAnimation>> // 可领取动画引用
  hadRenderLottie?: Ref<boolean> // 是否已渲染动画
  isWerewolfReward: boolean // 是否是狼人杀侧奖励
}
const emit = defineEmits(['close'])

const closeModal = (): void => {
  emit('close')
}

const props = defineProps({
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
})

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

const handleTask = (reward: Reward): void => {
  if (reward.status === 'can') {
    // 使用 nextTick 确保在 DOM 更新后执行
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
 * @function 处理气泡爆炸动画
 * @param {HTMLElement[]} domList - 需要处理动画的DOM元素列表
 * @param {Reward} item - 奖励对象
 * @returns {Promise<void>}
 * @description 并行处理所有元素的气泡爆炸动画
 */
async function handleBubbleBurst(
  domList: HTMLElement[],
  item: Reward,
): Promise<void> {
  // 使用 Promise.all 并行处理所有元素的动画
  await Promise.all(domList.map((dom) => bubbleBurst(dom, item)))
}

/**
 * @function 气泡爆炸动画
 * @param {HTMLElement} dom - dom元素
 * @param {Reward} reward - 奖励对象
 * @returns {Promise<void>}
 */
const bubbleBurst = async (dom: HTMLElement, reward: Reward): Promise<void> => {
  // 如果存在可领取奖励的Lottie动画引用，播放点击气泡爆炸动画
  if (reward.canRewardLottieRef) {
    reward.canRewardLottieRef.value.playAnimationClickBubble()
  }
  // 果冻效果
  await gsap
    .timeline()
    .to(dom, { scaleY: 0.8, duration: 0.2, ease: 'power1.in', opacity: 0.9 }) // 垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out', opacity: 0.5 }) // 垂直拉伸
    .to(dom, { scaleY: 1, duration: 0.2, ease: 'power1.out', opacity: 0 }) // 再次垂直压挤并淡出
}

/**
 * @function 点击气泡弹弹弹的果冻效果
 * @param {HTMLElement} dom - dom元素
 * @returns {void}
 */
const clickBubbleReward = (dom: HTMLElement): void => {
  gsap
    .timeline()
    .to(dom, { scaleY: 0.8, duration: 0.2, ease: 'power1.in' }) // 垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 垂直拉伸
    .to(dom, { scaleY: 0.9, duration: 0.2, ease: 'power1.out' }) // 再次垂直压挤
    .to(dom, { scaleY: 1.1, duration: 0.2, ease: 'power1.out' }) // 再次垂直拉伸
    .to(dom, { scaleY: 1, duration: 0.2, ease: 'power1.out' }) // 恢复原样
}

watchEffect(() => {
  handleTask(props.reward as Reward)
})

defineExpose({
  closeModal,
  handleBubbleBurst,
  clickBubbleReward,
})
</script>

<style lang="scss" scoped>
.reward-can-dynamic-bubble {
  position: absolute;
  & > :first-child {
    position: absolute;
    transform: scale(1.6) !important;
  }
}
</style>
