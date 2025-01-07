// 常量
export const EVENT_NAME = 'activitycenter_dayofdesign01_vote1_mission'
export const SESSION_IS_VISITED_KEY = 'isVisitedDayofdesign01VoteMission'

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
}

// 任务列表
export function createTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'login_days',
      title: '登录游戏',
      status: 'wait',
      val: 0,
      stages: [1],
    },
    {
      id: 2,
      taskId: 'dayofdesign_view_1',
      title: '查看作品详情',
      status: 'wait',
      val: 0,
      stages: [1],
    },
    {
      id: 3,
      taskId: 'dayofdesign_view_3',
      title: '查看3个作品',
      status: 'wait',
      val: 0,
      stages: [3],
    },
  ]
}

// 累计任务列表
export function createAccTaskList(): TaskItem[] {
  return [
    {
      id: 1,
      taskId: 'activitycenter_dayofdesign01_vote1_mission_m4',
      title: '累计投票10次',
      status: 'wait',
      val: 0,
      stages: [10],
    },
    {
      id: 2,
      taskId: 'activitycenter_dayofdesign01_vote1_mission_m4',
      title: '累计投票20次',
      status: 'wait',
      val: 0,
      stages: [20],
    },
    {
      id: 3,
      taskId: 'activitycenter_dayofdesign01_vote1_mission_m4',
      title: '累计投票30次',
      status: 'wait',
      val: 0,
      stages: [30],
    },
    {
      id: 4,
      taskId: 'activitycenter_dayofdesign01_vote1_mission_m4',
      title: '累计投票40次',
      status: 'wait',
      val: 0,
      stages: [40],
    },
    {
      id: 5,
      taskId: 'activitycenter_dayofdesign01_vote1_mission_m4',
      title: '累计投票50次',
      status: 'wait',
      val: 0,
      stages: [50],
    },
  ]
}
