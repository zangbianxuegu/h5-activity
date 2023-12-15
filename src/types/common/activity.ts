export interface MenuItem {
  label: string
  value: string
  active: boolean
  routeName: string
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
