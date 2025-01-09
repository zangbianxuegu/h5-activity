import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_winter_2025_2'
export const SESSION_IS_VISITED_KEY = 'isVisitedWinter2025_2'

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
export interface TaskListBox {
  id: number
  title: string
  children: TaskItem[]
}
export interface TaskItem {
  id: number
  taskId: string
  title: string
  status: TaskStatus
  canRewardLottieRef?: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}
// 任务列表-迎金蛇
export function createTaskList(): TaskListBox[] {
  return [
    {
      id: 1,
      title: '迎金蛇',
      children: [
        {
          id: 1,
          taskId: 'activitycenter_winter_2025_2_m1',
          status: TaskStatus.WAIT,
          title: '体验一次\n接蛇灯',
        },
        {
          id: 2,
          taskId: 'activitycenter_winter_2025_2_m2',
          status: TaskStatus.WAIT,
          title: '使用一次\n接蛇灯截图',
        },
        {
          id: 3,
          taskId: 'activitycenter_winter_2025_2_m3',
          status: TaskStatus.WAIT,
          title: '一局中衔接\n10个灯笼',
        },
        {
          id: 4,
          taskId: 'activitycenter_winter_2025_2_extra1',
          status: TaskStatus.WAIT,
          title: '完成迎金蛇全部任务',
          canRewardLottieRef: ref() as Ref<
            Array<InstanceType<typeof CanRewardBubbleAnimation>>
          >,
          hadRenderLottie: ref(false),
        },
      ],
    },
    {
      id: 2,
      title: '舞龙灯',
      children: [
        {
          id: 1,
          taskId: 'activitycenter_winter_2025_2_m10',
          status: TaskStatus.WAIT,
          title: '变成一次\n龙头',
        },
        {
          id: 2,
          taskId: 'activitycenter_winter_2025_2_m4',
          status: TaskStatus.WAIT,
          title: '加入龙头变\n身一次龙身',
        },
        {
          id: 3,
          taskId: 'activitycenter_winter_2025_2_m5',
          status: TaskStatus.WAIT,
          title: '与好友\n组成石龙',
        },
        {
          id: 4,
          taskId: 'activitycenter_winter_2025_2_extra2',
          status: TaskStatus.WAIT,
          title: '完成舞龙灯全部任务',
          canRewardLottieRef: ref() as Ref<
            Array<InstanceType<typeof CanRewardBubbleAnimation>>
          >,
          hadRenderLottie: ref(false),
        },
      ],
    },
    {
      id: 3,
      title: '观晚会',
      children: [
        {
          id: 1,
          taskId: 'activitycenter_winter_2025_2_m6',
          status: TaskStatus.WAIT,
          title: '观看一场\n《光·遇》春晚',
        },
        {
          id: 2,
          taskId: 'activitycenter_winter_2025_2_m7',
          status: TaskStatus.WAIT,
          title: '领取陈老师\n的礼物',
        },
        {
          id: 3,
          taskId: 'activitycenter_winter_2025_2_m8',
          status: TaskStatus.WAIT,
          title: '触发春晚\n变身彩蛋',
        },
        {
          id: 4,
          taskId: 'activitycenter_winter_2025_2_extra3',
          status: TaskStatus.WAIT,
          title: '完成观晚会全部任务',
          canRewardLottieRef: ref() as Ref<
            Array<InstanceType<typeof CanRewardBubbleAnimation>>
          >,
          hadRenderLottie: ref(false),
        },
      ],
    },
    {
      id: 4,
      title: '闹新春',
      children: [
        {
          id: 1,
          taskId: 'use_consumables_fireworks',
          status: TaskStatus.WAIT,
          title: '使用一次\n浪漫烟花',
        },
        {
          id: 2,
          taskId: 'use_consumables_social_lantern',
          status: TaskStatus.WAIT,
          title: '使用一次\n年画灯笼',
        },
        {
          id: 3,
          taskId: 'collecting_event_candles',
          status: TaskStatus.WAIT,
          title: '收集10个\n铜板代币',
        },
        {
          id: 4,
          taskId: 'activitycenter_winter_2025_2_extra4',
          status: TaskStatus.WAIT,
          title: '完成闹新春全部任务',
          canRewardLottieRef: ref() as Ref<
            Array<InstanceType<typeof CanRewardBubbleAnimation>>
          >,
          hadRenderLottie: ref(false),
        },
      ],
    },
    {
      id: 5,
      title: '访亲友',
      children: [
        {
          id: 1,
          taskId: 'unlock_friend_carry',
          status: TaskStatus.WAIT,
          title: '与1位好友\n解锁骑膊马',
        },
        {
          id: 2,
          taskId: 'send_heart_wax_friend',
          status: TaskStatus.WAIT,
          title: '给好友赠送\n5次心火',
        },
        {
          id: 3,
          taskId: 'send_friend_5hearts',
          status: TaskStatus.WAIT,
          title: '赠送好友\n新春5心红包',
        },
        {
          id: 4,
          taskId: 'activitycenter_winter_2025_2_extra5',
          status: TaskStatus.WAIT,
          title: '完成访亲友全部任务',
          canRewardLottieRef: ref() as Ref<
            Array<InstanceType<typeof CanRewardBubbleAnimation>>
          >,
          hadRenderLottie: ref(false),
        },
      ],
    },
  ]
}
