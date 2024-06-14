export interface AnniversaryStore2024 {
  token_info: TokenInfo
  sprite_exchange_store: SpriteExchangeStore
}

interface SpriteExchangeStore {
  store_list: StoreItem[]
}

export interface StoreItem {
  remaining_amount: number
  price: number
  id: number
}

interface TokenInfo {
  fireworks_token: number
}
