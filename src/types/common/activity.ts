export interface BaseInfo {
  currentTime: number
  channel: string
  appChannel: string
  token: string
}

export interface Activity {
  activity: string
  startTime: number
  endTime: number
  isNew: boolean
  isClaimedReward: boolean
}

// export type ActivityTimeItem = Pick<Activity, 'startTime' | 'endTime'>
// export type ActivityTime = Record<string, ActivityTimeItem>

export type ActivityTime = Record<string, string>

export interface Event {
  task_id: string
  stages: number[]
  award: number[]
  value: number
  score: string
  is_eggy_reward: boolean
  is_today_sign_in: boolean
  awarded_types: any[]
}

export interface EventData {
  activity_sign_in_1: Event
  activity_sign_in_2: Event
  activity_sign_in_3: Event
}

export interface MenuItem {
  label: string
  value: string
  routeName: string
  isNew: boolean
  isClaimedReward: boolean
  children?: MenuItem[]
}

export interface DesignConfig {
  designWidth: number
  designHeight: number
  designMainWidth: number
  designMainHeight: number
  designMainContentWidth: number
  designMainContentHeight: number
  designMainContentRatio: number
}

export interface BulletinItem {
  channel: string
  description: string
  effective_time: string
  expired_time: string
  id: number
  img_name: string
  link_url: string
  name: string
  priority: number
  tag: string
  type: string
}

export interface BulletinData {
  bulletin: BulletinItem[]
}
