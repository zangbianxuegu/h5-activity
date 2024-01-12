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
