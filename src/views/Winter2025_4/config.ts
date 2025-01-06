import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_winter_2025_4'
export const TASK_VALUE = 'activitycenter_winter_2025_4_m4'
export const SESSION_IS_VISITED_KEY = 'isVisitedWinter2025_4'

// 奖励类型
export interface Reward {
  name: string
  count: number
}

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
  canRewardLottieRef?: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

// 今日谜题
export function createTask(): TaskItem {
  return {
    id: 1,
    taskId: TASK_VALUE,
    title: '今日谜题',
    status: TaskStatus.WAIT,
  }
}
// 收集季节蜡烛
export function createCandlesAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'collecting_season_candles',
      title: '收集5根季节蜡烛',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'collecting_season_candles',
      title: '收集15根季节蜡烛',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'collecting_season_candles',
      title: '收集20根季节蜡烛',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}

// 累计猜对灯谜
export function createRiddlesAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_winter_2025_4_m1',
      title: '猜对灯谜1次',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_winter_2025_4_m1',
      title: '猜对灯谜3次',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'activitycenter_winter_2025_4_m1',
      title: '猜对灯谜5次',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}

// 累计点赞
export function createBoatAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_winter_2025_4_m3',
      title: '累计点赞1天',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_winter_2025_4_m3',
      title: '累计点赞3天',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'activitycenter_winter_2025_4_m3',
      title: '累计点赞5天',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}
