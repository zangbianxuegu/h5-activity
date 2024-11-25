<template>
  <div>
    <h2 class="sr-only">{{ title }}</h2>
    <ul class="task-list">
      <li
        v-for="(item, index) in tasks"
        :key="item.taskId"
        :class="['relative flex h-[150px] items-center justify-between']"
      >
        <p :class="['text-[32px]', 'w-[320px]', 'text-white']">
          <span>{{ item.title }}</span>
          <span v-if="item.id === 3" class="text-[#ffb033]">
            (<span>{{ item.val }}/{{ item.stages[0] }}</span
            >)
          </span>
        </p>
        <bubble
          :reward="item"
          :bubbleScale="1.85"
          :bounce-class="`reward-bounce-${item.taskId}`"
        >
          <div
            :class="[
              'task-item animate__animated animate__fadeIn relative z-10 bg-contain',
              `task-item${index + 1}`,
              `task-item${identityMap[type as keyof typeof identityMap]}-${index + 1}`,
              item.status,
            ]"
            @click="$emit('reward', 1, item)"
          ></div>
        </bubble>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
import Bubble from '@/components/Bubble'
/**
 * hadRenderLottie: 是否渲染过lottie（解决因computed和watch多次更新导致多次渲染lottie）
 */
interface Reward {
  id: number
  taskId: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  val: number
  stages: number[]
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}
defineProps<{
  title: string
  tasks: Reward[]
  type: string
}>()
defineEmits<(e: 'reward', type: number, item: Reward) => void>()

const identityMap = {
  player: 1,
  krill: 2,
  spirit: 3,
}
</script>

<style lang="scss" scoped>
.task-list {
  width: 440px;
  margin-right: 124px;
}
.task-item {
  width: 138px;
  height: 113px;
  background-repeat: no-repeat;
  background-size: cover;
}
.task-item1 {
  &.wait {
    background-image: url('@/assets/images/netease-werewolf-join/task1-wait.png');
  }
  &.can {
    background-image: url('@/assets/images/netease-werewolf-join/task1-can.png');
  }
  &.redeemed {
    transition: background-image 1s ease;
    background-image: url('@/assets/images/netease-werewolf-join/task1-redeemed.png');
  }
}

@for $j from 1 through 3 {
  @each $k in 2, 3 {
    .task-item#{$j}-#{$k} {
      &.wait {
        background-image: url('@/assets/images/netease-werewolf-join/task#{$j}-#{$k}-wait.png');
      }
      &.can {
        background-image: url('@/assets/images/netease-werewolf-join/task#{$j}-#{$k}-can.png');
      }
      &.redeemed {
        transition: background-image 1s ease;
        background-image: url('@/assets/images/netease-werewolf-join/task#{$j}-#{$k}-redeemed.png');
      }
    }
  }
}
</style>
