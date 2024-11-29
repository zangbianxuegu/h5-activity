import type CanRewardBubbleAnimation from '@/components/CanRewardBubbleAnimation'

// 常量
export const EVENT_NAME = 'activitycenter_invitation_code'
export const SESSION_IS_VISITED_KEY = 'isVisitedInvitationCode'

// 奖励类型
export interface Reward {
  name: string
  count: number
}

// 任务项类型
export interface TaskItem {
  id: number
  taskId: string
  title: string
  status: 'wait' | 'redeemed' | 'can' | string
  val: number
  stages: number[]
  canRewardLottieRef: Ref<Array<InstanceType<typeof CanRewardBubbleAnimation>>>
  hadRenderLottie?: Ref<boolean>
}

// 新玩家绑定任务
export function createBindList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_invitation_code_m1',
      title: '绑定奖励',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}

// 邀请人数
export function createTopAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_invitation_code_m2',
      title: '邀请人数1人',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_invitation_code_m2',
      title: '邀请人数2人',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'activitycenter_invitation_code_m2',
      title: '邀请人数3人',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}

// 被邀请玩家累计收集光之翼数量
export function createMiddleAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_invitation_code_m3',
      title: '被邀请玩家累计收集光之翼数量30',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_invitation_code_m3',
      title: '被邀请玩家累计收集光之翼数量60',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'activitycenter_invitation_code_m3',
      title: '被邀请玩家累计收集光之翼数量100',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 4,
      taskId: 'activitycenter_invitation_code_m3',
      title: '被邀请玩家累计收集光之翼数量150',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 5,
      taskId: 'activitycenter_invitation_code_m3',
      title: '被邀请玩家累计收集光之翼数量300',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}

// 被邀请玩家累计献祭次数
export function createBottomAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_invitation_code_m4',
      title: '被邀请玩家累计献祭次数1次',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 2,
      taskId: 'activitycenter_invitation_code_m4',
      title: '被邀请玩家累计献祭次数2次',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 3,
      taskId: 'activitycenter_invitation_code_m4',
      title: '被邀请玩家累计献祭次数3次',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 4,
      taskId: 'activitycenter_invitation_code_m4',
      title: '被邀请玩家累计献祭次数4次',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
    {
      id: 5,
      taskId: 'activitycenter_invitation_code_m4',
      title: '被邀请玩家累计献祭次数5次',
      status: 'wait',
      val: 0,
      stages: [1],
      canRewardLottieRef: ref() as Ref<
        Array<InstanceType<typeof CanRewardBubbleAnimation>>
      >,
      hadRenderLottie: ref(false),
    },
  ]
}
