import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'
// 常量
export const EVENT_NAME = 'activitycenter_icefestival2025'
export const ACC_TASK_VALUE = 'activitycenter_icefestival2025_like'
export const ACC_TASK_INDEX = 2
export const SESSION_IS_VISITED_KEY = 'isVisitedIceFestival2025'

// 任务状态枚举
export enum TaskStatus {
  WAIT = 'wait',
  REDEEMED = 'redeemed',
  CAN = 'can',
}

// 任务项类型
export interface TaskItem {
  id: number
  taskId: string
  title: string
  status: TaskStatus
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

// 奖励类型
export interface Reward {
  name: string
  count: number
}

// 任务列表
export function createTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_icefestival2025_create',
      title: '在活动专属共享\n空间神坛成功创\n建任意共享空间',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_icefestival2025_like_received',
      title: '自己的作品获得\n任意一个玩家点赞',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}

// 累计任务列表
export function createAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: ACC_TASK_VALUE,
      title: '1天',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: ACC_TASK_VALUE,
      title: '3天',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: ACC_TASK_VALUE,
      title: '5天',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}
