import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_pc_celebration'

export const curRewards: Ref<Rewards[]> = ref([
  {
    name: 'CharSkyKid_Horn_CursorHairpin',
    count: 1,
  },
])

export interface Rewards {
  name: string
  count: number
}

export interface TaskItem {
  id: number
  taskId: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

// 任务列表
export function createTaskItem(): TaskItem {
  return {
    id: 1,
    taskId: 'activitycenter_pc_celebration_m1',
    title: '领光标发饰',
    status: 'wait',
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  }
}
