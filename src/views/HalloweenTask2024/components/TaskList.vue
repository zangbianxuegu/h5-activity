<template>
  <div>
    <h2 class="sr-only">{{ title }}</h2>
    <ul :class="listClass">
      <li
        v-for="item in tasks"
        :key="item.value"
        :class="[
          'flex items-center justify-between',
          `${props.title === '捣蛋清单' ? 'mb-[22px]' : 'mb-[16px]'}`,
        ]"
      >
        <p :class="getTextClass(item.status)">
          {{ item.title }}
        </p>
        <div class="relative" @click="$emit('reward', $event, 1, item)">
          <can-reward-bubble-animation
            @click.stop="$emit('reward', $event, 1, item)"
            :ref="item.canRewardLottieRef"
            :id="item.value"
            :class="[
              'reward-can-dynamic-bubble',
              { 'trick-reward-can-dynamic-bubble': title === '捣蛋清单' },
            ]"
          ></can-reward-bubble-animation>
          <div
            v-if="['wait', 'can', 'redeemed'].includes(item.status)"
            :class="getItemClass(item.status)"
          ></div>
        </div>
      </li>
    </ul>
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
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}
const props = defineProps<{
  title: string
  tasks: Reward[]
  listClass: string
  itemClass: string
}>()
defineEmits<
  (e: 'reward', event: MouseEvent, type: number, item: Reward) => void
>()
const getTextClass = (status: string): Array<string | object> => [
  'text-[32px]',
  {
    'text-[#fff1ad]': status === 'can',
    'text-[#d9d9d9]': status === 'redeemed',
    'text-white': status === 'wait',
    'mt-[10px]': props.title === '每日任务',
    'mt-[16px]': props.title === '每周任务',
    'trick-bg': props.title === '捣蛋清单',
  },
]
const getItemClass = (status: string): string[] => [
  props.itemClass,
  'animate__animated animate__fadeIn bg-contain',
  status,
]
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
.daily-task-list {
  position: absolute;
  left: 394px;
  top: 408px;
  width: 400px;
  white-space: nowrap;
  word-break: keep-all;
}
.weekly-task-list {
  position: absolute;
  left: 350px;
  bottom: 204px;
}
.task-item {
  width: 90px;
  height: 76px;
  background-repeat: no-repeat;
  background-size: cover;
}
.trick-task-list {
  position: absolute;
  left: 920px;
  top: 444px;
  height: 520px;
  overflow-x: hidden;
  overflow-y: scroll;
  .trick-bg {
    padding-left: 164px;
    width: 790px;
    height: 85px;
    line-height: 85px;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url('@/assets/images/halloween-task-2024/row.png');
  }
  .trick-task-item {
    width: 120px;
    height: 92px;
    background-repeat: no-repeat;
    background-size: cover;
    margin-left: -180px;
  }
}
.reward-can-dynamic-bubble {
  width: 90px;
  height: 75px;
  position: absolute;
  top: 12px;
  right: -4px;
  & > :first-child {
    position: absolute;
    top: -12px;
    transform: scale(1.9) !important;
  }
}
.trick-reward-can-dynamic-bubble {
  width: 102px;
  height: 78px;
  top: 18px;
  right: 68px;
}
</style>
