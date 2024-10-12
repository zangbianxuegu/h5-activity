export interface HalloweenTreasureHuntParams {
  event: string
  task: string
  grid_id: number
}

export interface HalloweenTreasureHuntRes {
  code: number
  msg: string
  is_obtaind_treasure: boolean
  remaining_tickets: number
  token_count: number
  rewards: Record<string, string>
}

interface SpriteExchangeStore {
  store_list: any[]
}

export interface HalloweenPassResData {
  limit_exceeded: boolean
  draw_id: number
  sprite_exchange_store: SpriteExchangeStore
  token_info: Record<string, number>
}

export interface HalloweenPassLotteryParams {
  event: string
  token_count: number
}
export interface HalloweenPassLotteryRes {
  code: number
  msg: string
  rewards: Record<string, string>
  token_count: number
  draw_id: number
}
