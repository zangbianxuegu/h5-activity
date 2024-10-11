export interface TreasureHuntParams {
  event: string
  task: string
  grid_id: number
}

export interface TreasureHuntRes {
  code: number
  msg: string
  is_obtaind_treasure: boolean
  remaining_tickets: number
  token_count: number
  rewards: Record<string, string>
}
