import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_cloud_music_2024'
export const ACC_TASK_VALUE = 'activitycenter_cloud_music_2024_m6'
export const ACC_TASK_INDEX = 5

// 任务状态枚举
export enum TaskStatus {
  WAIT = 'wait',
  REDEEMED = 'redeemed',
  CAN = 'can',
}

// 任务项类型
export interface TaskItem {
  id: number
  value: string
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
  message_cloudmusic: '分享音符',
  outfit_prop_saxophone: '萨克斯',
  outfit_prop_violin: '小提琴',
  outfit_prop_triumphhandpan: '凯旋手碟',
  outfit_prop_rhythmguitar: '白吉它',
  coutfit_prop_fledglingharp: '雏鸟之琴',
  swing: '秋千',
  outfit_prop_cloudmusictable: 'outfit_prop_cloudmusictable',
  heart: '爱心',
}

// 任务列表
export const TASK_LIST: TaskItem[] = [
  {
    id: 1,
    value: 'activitycenter_cloud_music_2024_m1',
    title: '点评一次分享音符',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'activitycenter_cloud_music_2024_m2',
    title: '点赞一次分享音符',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'activitycenter_cloud_music_2024_m3',
    title: '放置2个分享音符',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 4,
    value: 'activitycenter_cloud_music_2024_m4',
    title: '和好友一起牵手听分享音符',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 5,
    value: 'activitycenter_cloud_music_2024_m5',
    title: '在雨林秘密花园中用分享海螺点歌',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]

// 累计任务列表
export const ACC_TASK_LIST: TaskItem[] = [
  {
    id: 1,
    value: 'activitycenter_cloud_music_2024_m6',
    title: '累计获得积分1',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 2,
    value: 'activitycenter_cloud_music_2024_m6',
    title: '累计获得积分2',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 3,
    value: 'activitycenter_cloud_music_2024_m6',
    title: '累计获得积分3',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 4,
    value: 'activitycenter_cloud_music_2024_m6',
    title: '累计获得积分4',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
  {
    id: 5,
    value: 'activitycenter_cloud_music_2024_m6',
    title: '累计获得积分5',
    status: TaskStatus.WAIT,
    canRewardLottieRef: ref() as Ref<
      Array<InstanceType<typeof CanRewardBubbleAnimation>>
    >,
    hadRenderLottie: ref(false),
  },
]
