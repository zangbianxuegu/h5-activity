// 常量
export const EVENT_NAME = 'activitycenter_doubledan_2024_1'
export const ACC_TASK_VALUE = 'login_days'
export const ACC_TASK_INDEX = 1
export const SESSION_IS_VISITED_KEY = 'isVisitedDoubledan2024_1'

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
  info?: Reward
}

// 奖励类型
export interface Reward {
  name: string
  count: number
}

// 奖励名称
export const REWARD_TEXT = {
  outfit_prop_crabbitportal: '仙境茶会门扉礼包试用魔法',
  outfit_hat_bluebow: '进行曲制服礼包试用魔法',
  outfit_body_yellowpinafore: '爱丽丝围裙套装礼包试用魔法',
  candles: '蜡烛',
  heart: '爱心',
  grow: '长大成人',
  huge: '大只佬',
  shrink: '返老还童',
  tiny: '小不点',
  gravity: '漂浮魔法',
  glow: '璀璨之星魔法',
  energy: '元气满满魔法',
  energy_potion: '光能药剂',
  fireworks: '浪漫烟花魔法',
  resize_potion: '体型重塑',
  trail_rainbow: '彩虹尾迹',
  swing: '秋千',
}

// 任务列表
export function createTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_doubledan_2024_m11',
      title: '完成全部登录任务',
      status: TaskStatus.WAIT,
    },
  ]
}

// 累计任务列表
export function createAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: ACC_TASK_VALUE,
      title: '累计登录1天',
      status: TaskStatus.WAIT,
    },
    {
      id: 2,
      taskId: ACC_TASK_VALUE,
      title: '累计登录2天',
      status: TaskStatus.WAIT,
    },
    {
      id: 3,
      taskId: ACC_TASK_VALUE,
      title: '累计登录3天',
      status: TaskStatus.WAIT,
    },
    {
      id: 4,
      taskId: ACC_TASK_VALUE,
      title: '累计登录4天',
      status: TaskStatus.WAIT,
    },
    {
      id: 5,
      taskId: ACC_TASK_VALUE,
      title: '累计登录5天',
      status: TaskStatus.WAIT,
    },
    {
      id: 6,
      taskId: ACC_TASK_VALUE,
      title: '累计登录6天',
      status: TaskStatus.WAIT,
    },
    {
      id: 7,
      taskId: ACC_TASK_VALUE,
      title: '累计登录7天',
      status: TaskStatus.WAIT,
    },
    {
      id: 8,
      taskId: ACC_TASK_VALUE,
      title: '累计登录8天',
      status: TaskStatus.WAIT,
    },
    {
      id: 9,
      taskId: ACC_TASK_VALUE,
      title: '累计登录9天',
      status: TaskStatus.WAIT,
    },
    {
      id: 10,
      taskId: ACC_TASK_VALUE,
      title: '累计登录10天',
      status: TaskStatus.WAIT,
    },
  ]
}
