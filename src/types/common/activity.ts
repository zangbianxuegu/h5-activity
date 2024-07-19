import { type ACTIVITY_LIST } from '@/constants'
export interface BaseInfo {
  currentTime: number
  currentFriendshipWeek: number
  channel: string
  appChannel: string
  token: string
  returnBuff: string
  gameUid: string
}

export interface Activity {
  activity: string
  startTime: number
  endTime: number
  isNew: boolean
  hasUnclaimedReward: boolean
}

export type ActivityTimeItem = Pick<Activity, 'startTime' | 'endTime'>
export type ActivityTime = Record<string, ActivityTimeItem>

// 任务项类型
export interface Event {
  task_id: string
  stages: number[]
  award: number[]
  value: number
  score: string
  is_eggy_reward?: boolean
  is_today_sign_in?: boolean | number
  awarded_types: any[]
  task_names?: string[]
}

type SingleEventData<K extends EventName> = {
  [P in K]: Event[]
}
// 活动数据类型
export interface ActivityData<K extends EventName> {
  token_count?: string
  event_data: SingleEventData<K>
  current_time: number
}

// 所有活动集合，已废除
export interface EventData {
  activity_sign_in_1: Event
  activity_sign_in_2: Event
  activity_sign_in_3: Event
  activity_season22_start: Event[]
  activity_sign_mayday_2024: Event[]
  activity_sanrio_2024: Event[]
  activity_nature_2024: Event[]
  activity_childrens_day_2024: Event[]
  activity_dragonboat_2024: Event[]
  activity_anniversary_warmup_2024: Event[]
  activity_season22_sprint: Event[]
  activitycenter_anniversary_visit_2024: Event[]
  activitycenter_anniversary_server_2024: Event[]
}

export type EventDataKeys = keyof EventData

export type EventDataKeysToObject = {
  [k in keyof EventData]: EventDataKeys
}

export type EventName = (typeof ACTIVITY_LIST)[number]

export interface MenuItem {
  label: string
  value: string
  routeName: string
  isNew: boolean
  hasUnclaimedReward: boolean
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
