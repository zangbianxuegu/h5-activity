<template>
  <div>
    <h2 class="sr-only">{{ title }}</h2>
    <ul class="task-list">
      <li
        v-for="item in tasks"
        :key="item.taskId"
        :class="['relative flex h-[150px] items-center justify-between']"
      >
        <p :class="['text-[32px]', 'w-[320px]', 'text-white']">
          {{ item.title }}
        </p>
        <bubble :reward="item">
          <div class="relative" @click="$emit('reward', 1, item)">
            <div
              :class="[
                'task-item animate__animated animate__fadeIn z-10 bg-contain',
                item.status,
              ]"
            ></div>
          </div>
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
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}
defineProps<{
  title: string
  tasks: Reward[]
}>()
defineEmits<(e: 'reward', type: number, item: Reward) => void>()
</script>

<style lang="scss" scoped>
.wait {
  background-image: url('@/assets/images/halloween-task-2024/wait.png');
}
.can {
  background-image: url('@/assets/images/halloween-task-2024/can.png');
}
.redeemed {
  background-image: url('@/assets/images/halloween-task-2024/redeemed.png');
}

.task-item {
  width: 140px;
  height: 110px;
  background-repeat: no-repeat;
  background-size: cover;
}
.task-list {
  width: 440px;
  margin-right: 124px;
}
</style>
