import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_winter_2025_3'
export const SESSION_IS_VISITED_KEY = 'isVisitedWinter2025_3'

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
  animationDelay?: number
}
// 好友赠送心火列表
export function createPersonAccTaskList(): TaskItem[][] {
  return [
    [
      {
        id: 1,
        taskId: 'send_heart_wax_friend',
        status: TaskStatus.WAIT,
        title: '个人送心火次数达到10次',
        canRewardLottieRef: ref() as Ref<
          Array<InstanceType<typeof CanRewardBubbleAnimation>>
        >,
        hadRenderLottie: ref(false),
      },
    ],
    [
      {
        id: 2,
        taskId: 'send_heart_wax_friend',
        status: TaskStatus.WAIT,
        title: '个人送心火次数达到50次',
        canRewardLottieRef: ref() as Ref<
          Array<InstanceType<typeof CanRewardBubbleAnimation>>
        >,
        hadRenderLottie: ref(false),
      },
      {
        id: 3,
        taskId: 'send_heart_wax_friend',
        status: TaskStatus.WAIT,
        title: '个人送心火次数达到50次',
        canRewardLottieRef: ref() as Ref<
          Array<InstanceType<typeof CanRewardBubbleAnimation>>
        >,
        hadRenderLottie: ref(false),
      },
    ],
  ]
}

// 全服赠送心火列表
export function createServerAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'send_heart_wax_friend_server',
      title: '1000万次',
      status: TaskStatus.WAIT,
      animationDelay: 0,
    },
    {
      id: 2,
      taskId: 'send_heart_wax_friend_server',
      title: '2000万次',
      status: TaskStatus.WAIT,
      animationDelay: 0.2,
    },
    {
      id: 3,
      taskId: 'send_heart_wax_friend_server',
      title: '3000万次',
      status: TaskStatus.WAIT,
      animationDelay: 0.8,
    },
    {
      id: 4,
      taskId: 'send_heart_wax_friend_server',
      title: '4000万次',
      status: TaskStatus.WAIT,
      animationDelay: 0.2,
    },
    {
      id: 5,
      taskId: 'send_heart_wax_friend_server',
      title: '5000万次',
      status: TaskStatus.WAIT,
      animationDelay: 0.6,
    },
  ]
}
