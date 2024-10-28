<template>
  <div>
    <div
      :class="[
        'flex rounded-2xl',
        name === 'allTaskList' ? 'task-list' : 'hide-task-list',
      ]"
    >
      <ul aria-labelledby="taskListHeading">
        <li
          v-for="(item, index) in taskList"
          :key="item.title"
          :class="[
            'task-item mb-[10px] flex items-center justify-between',
            `task-item-${item.status}`,
          ]"
          :aria-label="`任务: ${item.title}`"
        >
          <div class="flex">
            <div
              v-for="(v, i) in item.content"
              :key="i"
              class="relative mr-[4px]"
            >
              <can-reward-bubble-animation
                :ref="v.canRewardLottieRef"
                :id="`${v.value}${index}${i}`"
                class="reward-can-dynamic-bubble"
              ></can-reward-bubble-animation>
              <div
                v-if="['wait', 'can', 'redeemed'].includes(v.status)"
                :class="[
                  'reward animate__animated animate__fadeIn bg-contain',
                  name,
                  `${v.status}${i + 1}`,
                  `${v.status}${i + 1}-${index + 1}`,
                ]"
                @click="$emit('reward', $event, v, i + 1)"
              ></div>
            </div>
          </div>
          <p class="ml-[16px] w-[600px] text-[32px]">
            <span
              :class="`${item.status === 'redeemed' ? 'text-[#b3b7c7]' : 'text-white'}`"
              >{{ item.title }}</span
            >
            <span
              v-if="index === 4"
              :class="`${item.status === 'redeemed' ? 'text-[#b3b7c7]' : 'text-[#fef282]'}`"
              >（{{ item.val }}/3）</span
            >
          </p>
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
  value: string
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

defineEmits<
  (e: 'reward', event: MouseEvent, item: Reward, index: number) => void
>()
</script>

<style lang="scss" scoped>
.task-list {
  position: absolute;
  left: 60px;
  top: 300px;
  padding: 20px;
  background-color: rgba($color: #000000, $alpha: 0.6);
  backdrop-filter: blur(8px);
}
.hide-task-list {
  position: absolute;
  right: 50px;
  top: 160px;
  padding: 15px 30px;
  background-color: rgba($color: #fff, $alpha: 0.2);
}
.reward {
  width: 140px;
  height: 129px;
  background-repeat: no-repeat;
  background-size: contain;
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
      background-image: url('@/assets/images/kizuna-china-2024/acc-task6-wait.png');
    }
    &.can1 {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task6-can.png');
    }
    &.redeemed1 {
      background-image: url('@/assets/images/kizuna-china-2024/acc-task6-redeemed.png');
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
.task-item {
  width: 600px;
  height: 139px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.task-item-redeemed {
  background-image: url('@/assets/images/kizuna-china-2024/row-bg-redeemed.png');
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
    transform: scale(1.3) !important;
  }
}
</style>
