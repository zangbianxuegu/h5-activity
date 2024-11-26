import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_doubledan_2024_2'
export const ACC_TASK_VALUE = 'collecting_event_candles'
export const ACC_TASK_INDEX = 4

// 任务状态枚举
export enum TaskStatus {
  NOSTART = 'nostart',
  WAIT = 'wait',
  REDEEMED = 'redeemed',
  CAN = 'can',
  OVERDUE = 'overdue',
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

// 奖励名称
export const REWARD_TEXT = {
  gravity: '漂浮魔法',
  tiny: '小不点',
  shrink: '返老还童',
  outfit_body_yellowpinafore: '爱丽丝围裙套装礼包试用魔法',
  message_boat: '传信纸船',
  trail_rainbow: '彩虹尾迹',
  heart: '爱心',
}

// 任务列表
export function createTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_doubledan_2024_m1',
      title: '在茶桌收获烛火',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_doubledan_2024_m3',
      title: '帮助一次瞌睡海牛',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'activitycenter_doubledan_2024_m4',
      title: '帮助一次帽匠',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 4,
      taskId: 'activitycenter_doubledan_2024_m5',
      title: '领取宴会节奶奶的\n礼物',
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
      title: '15',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: ACC_TASK_VALUE,
      title: '30',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: ACC_TASK_VALUE,
      title: '50',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}
