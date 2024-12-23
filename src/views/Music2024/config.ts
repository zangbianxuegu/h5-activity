import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_music_2024'

// 任务状态枚举
export enum TaskStatus {
  WAIT = 'wait',
  REDEEMED = 'redeemed',
  CAN = 'can',
  OVERDUE = 'overdue',
}

// 任务项类型
export interface Reward {
  id: number
  value: string
  title: string
  date?: string
  status: TaskStatus
  canRewardLottieRef?: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
  className?: string
  tagTxt?: string
}

// 奖励类型
export interface Rewards {
  name: string
  count: number
}

// 奖励名称
export const REWARD_TEXT = {
  glow: '璀璨之星魔法',
  energy: '元气满满魔法',
  recording_candle: '留影蜡烛',
  energy_potion: '光能药剂',
  gravity: '漂浮魔法',
  grow: '长大成人',
  trail_rainbow: '彩虹尾迹',
  heart: '爱心',
}

// 任务列表
export function createTaskList(): Reward[] {
  return [
    {
      id: 1,
      value: 'activitycenter_music_2024_m8',
      title: '完成任意\n5个任务',
      status: TaskStatus.WAIT,
    },
    {
      id: 2,
      value: 'activitycenter_music_2024_m2',
      title: '云巢小镇\n“喜悦”',
      status: TaskStatus.WAIT,
      date: '12.6-12.7',
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      value: 'activitycenter_music_2024_m3',
      title: '云巢小镇\n“希望”',
      status: TaskStatus.WAIT,
      date: '12.8-12.9',
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 4,
      value: 'activitycenter_music_2024_m4',
      title: '圆梦村剧场\n“梦想”',
      status: TaskStatus.WAIT,
      date: '12.10-12.11',
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 5,
      value: 'activitycenter_music_2024_m5',
      title: '音乐餐厅\n“忧郁”',
      status: TaskStatus.WAIT,
      date: '12.12-12.13',
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 6,
      value: 'activitycenter_music_2024_m6',
      title: '星光沙漠\n“信心”',
      status: TaskStatus.WAIT,
      date: '12.14-12.16',
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 7,
      value: 'activitycenter_music_2024_m7',
      title: '落日竞技场\n“胜利”',
      status: TaskStatus.WAIT,
      date: '12.17-12.20',
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 8,
      value: 'activitycenter_music_2024_m1',
      title: '用小镇舞台\n的乐器演奏',
      status: TaskStatus.WAIT,
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}
