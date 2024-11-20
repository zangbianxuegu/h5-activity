<template>
  <div class="relative" @click.capture="clickBubble">
    <can-reward-bubble-animation
      :ref="reward.canRewardLottieRef"
      :id="`${reward.taskId}`"
      class="reward-can-dynamic-bubble animate__animated animate__fadeIn animate__slow pointer-events-none z-0"
    ></can-reward-bubble-animation>
    <div :class="`reward-icon-${reward.taskId}`">
      <slot></slot>
    </div>
  </div>
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
  // 是否为多个奖励
  multiple: {
    type: Boolean,
    default: false,
  },
  // 点击是否播放动画
  isPlayAnimation: {
    type: Boolean,
    default: true,
  },
})

/**
 * @function 点击气泡事件处理函数
 * @param {MouseEvent} e - 鼠标事件对象
 * @description 处理气泡点击事件，根据奖励状态执行不同的动画效果
 */
const clickBubble = async (e: MouseEvent): Promise<void> => {
  // 获取所有与当前奖励任务相关的DOM元素
  const taskItems = document.querySelectorAll(
    `.reward-icon-${props.reward.taskId}`,
  )
  const domList = Array.from(taskItems) as HTMLElement[]
  const innerDomList = domList.map((dom) => dom.children[0]) as HTMLElement[]
  if (props.reward.status === 'wait') {
    // 如果奖励状态为等待，对每个DOM元素执行弹跳动画
    domList.forEach((dom) => {
      animateBounce(dom)
    })
  } else if (props.reward.status === 'can' && props.isPlayAnimation) {
    if (!props.multiple) {
      await Promise.all(
        domList.map((_) => {
          return bubbleBurst(e.target as HTMLElement, props.reward as Reward)
        }),
      )
    } else {
      // 如果是多个奖励，执行多个气泡爆炸动画
      await multipleBubbleBurst(innerDomList, props.rewardList as Reward[])
    }
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

const handleTask = (reward: Reward): void => {
  if (reward.status === 'can') {
    // 使用 nextTick 确保在 DOM 更新后执行
    void nextTick(() => {
      // 检查是否需要初始化 Lottie 动画
      if (reward.hadRenderLottie && !reward.hadRenderLottie.value) {
        initCanRewardLottie(reward)
      }
    })
  }
}

/**
 * @function 处理多个气泡爆炸效果
 * @param {HTMLElement[]} domList - DOM元素列表
 * @param {Reward[]} rewardList - 奖励列表
 * @returns {Promise<void>}
 * @description 为每个DOM元素创建气泡爆炸效果，并等待所有效果完成
 */
const multipleBubbleBurst = async (
  domList: HTMLElement[],
  rewardList: Reward[],
): Promise<void> => {
  // 使用Promise.all并行处理所有气泡爆炸效果
  await Promise.all(
    domList.map((_, idx) => {
      // 对每个DOM元素调用bubbleBurst方法
      return bubbleBurst(domList[idx], rewardList[idx])
    }),
  )
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
 * @function 点击气泡弹动的果冻效果
 * @param {HTMLElement} dom - dom元素
 * @returns {void}
 */
const animateBounce = (dom: HTMLElement): void => {
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
  animateBounce,
  bubbleBurst,
  multipleBubbleBurst,
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
