export interface StoreItem {
  remaining_amount: number
  price: number
  id: number
}

// interface CurrencyInfo {
//   heart: number
// }

interface TokenInfo {
  fireworks_token?: number
  sunlight_token?: number
}

interface SpriteExchangeStore {
  store_list: StoreItem[]
}

export interface AnniversaryStore2024 {
  token_info: TokenInfo
  sprite_exchange_store: SpriteExchangeStore
}

export interface FriendshipStore2024 {
  token_info: TokenInfo
  sprite_exchange_store: SpriteExchangeStore
}

export enum TokenNameEnum {
  DiceStore = 'heytea_token',
}
export interface BaseStore {
  token_info: Record<TokenNameEnum, number>
  sprite_exchange_store: SpriteExchangeStore
}

export interface DiceStore extends BaseStore {}
