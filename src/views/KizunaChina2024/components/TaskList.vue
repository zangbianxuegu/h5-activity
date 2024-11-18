<template>
  <div>
    <div
      :class="['flex', name === 'allTaskList' ? 'task-list' : 'hide-task-list']"
    >
      <ul aria-labelledby="taskListHeading">
        <li
          v-for="(item, index) in taskList"
          :key="item.title"
          :class="[
            'task-item mb-[14px] flex items-center justify-between',
            `task-item-${item.status}`,
          ]"
          :aria-label="`任务: ${item.title}`"
        >
          <p
            :class="[
              'w-[300px] text-[32px]',
              name === 'allTaskList' ? 'ml-[76px]' : 'ml-[36px]',
            ]"
          >
            <span
              :class="`${name === 'allTaskList' ? (item.status === 'redeemed' ? 'text-[#b3b7c7]' : 'text-white') : 'text-white'}`"
              >{{ item.title }}</span
            >
            <span
              v-if="index === 4"
              :class="`${item.status === 'redeemed' ? 'text-[#b3b7c7]' : 'text-[#fef282]'}`"
              >（{{ item.val > 3 ? 3 : item.val }}/3）</span
            >
          </p>
          <div class="mr-[10px] flex">
            <div
              v-for="(v, i) in item.content.value"
              :key="item.title + v.id"
              class="relative mr-[4px]"
            >
              <can-reward-bubble-animation
                :ref="v.canRewardLottieRef"
                :id="`${v.taskId}${index}${i}`"
                class="reward-can-dynamic-bubble pointer-events-none z-0"
              ></can-reward-bubble-animation>
              <div
                v-if="['wait', 'can', 'redeemed'].includes(v.status)"
                :class="[
                  'reward animate__animated animate__fadeIn relative z-10 bg-contain',
                  name,
                  `${v.status}${i + 1}`,
                  `${v.status}${i + 1}-${index + 1}`,
                ]"
                @click="reward($event.target as HTMLElement, v, 1)"
              ></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
/**
 * hadRenderLottie: 是否渲染过lottie（解决因computed和watch多次更新导致多次渲染lottie）
 */
interface Reward {
  id: number
  taskId: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  val: number
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

defineProps<{
  taskList: any[]
  name: string
}>()

const emits =
  defineEmits<
    (e: 'reward', dom: HTMLElement[], item: Reward, index: number) => void
  >()
const reward = (dom: HTMLElement, item: Reward, index: number): void => {
  const grandparentElement = (dom.parentElement as HTMLElement).parentElement
  // 检查祖父级元素是否存在
  if (grandparentElement) {
    // 使用 children 属性获取所有直接子元素
    const allChildren = grandparentElement.children
    // 将 HTMLCollection 转换为数组以便使用数组方法
    const childrenArray = Array.from(allChildren) as HTMLElement[]
    const bubbleBurstDomList = [
      childrenArray[0].lastElementChild,
      childrenArray[1].lastElementChild,
    ] as HTMLElement[]
    emits('reward', bubbleBurstDomList, item, index)
  }
}
</script>

<style lang="scss" scoped>
.task-list {
  .task-item {
    width: 687px;
    height: 163px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-image: url('@/assets/images/kizuna-china-2024/row-bg.png');
  }
  .task-item-redeemed {
    background-image: url('@/assets/images/kizuna-china-2024/row-bg-redeemed.png');
  }
}
.hide-task-list {
  height: 230px;
  width: 644px;
  padding-top: 80px;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('@/assets/images/kizuna-china-2024/hide-task-bg.png');
}
.reward {
  width: 140px;
  height: 130px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  &.wait1 {
    background-image: url('@/assets/images/kizuna-china-2024/dumpling-wait.png');
  }
  &.can1 {
    background-image: url('@/assets/images/kizuna-china-2024/dumpling-can.png');
  }
  &.redeemed1 {
    background-image: url('@/assets/images/kizuna-china-2024/dumpling-redeemed.png');
  }
  @for $i from 1 through 5 {
    &.wait2-#{$i} {
      background-image: url('@/assets/images/kizuna-china-2024/task#{$i}-wait.png');
    }
    &.can2-#{$i} {
      background-image: url('@/assets/images/kizuna-china-2024/task#{$i}-can.png');
    }
    &.redeemed2-#{$i} {
      background-image: url('@/assets/images/kizuna-china-2024/task#{$i}-redeemed.png');
    }
  }
  &.hideTaskList {
    &.wait1 {
      background-image: url('@/assets/images/kizuna-china-2024/task2-wait.png');
    }
    &.can1 {
      background-image: url('@/assets/images/kizuna-china-2024/task2-can.png');
    }
    &.redeemed1 {
      background-image: url('@/assets/images/kizuna-china-2024/task2-redeemed.png');
    }
    &.wait2-1 {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task7-wait.png');
    }
    &.can2-1 {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task7-can.png');
    }
    &.redeemed2-1 {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task7-redeemed.png');
    }
  }
}
$reward-bubble-wait-width: 120px;
$reward-bubble-wait-height: 120px;
.reward-can-dynamic-bubble {
  width: $reward-bubble-wait-width + 20px;
  height: $reward-bubble-wait-height;
  position: absolute;
  top: 16px;
  left: 0;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.8) !important;
  }
}
</style>
