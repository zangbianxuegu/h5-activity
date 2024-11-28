export type SearchType = 'collect' | 'recommend'

export interface ListParams {
  event: string
  policy_name: string
  group?: string
}

export interface ListResponse<T> {
  code: number
  msg: string
  data: T
}

export interface DesignsData {
  designs: DesignItem[]
}

export interface FavoriteData extends DesignsData {
  is_end: boolean
  count: number
}

export interface DesignItem {
  design_id: string
  author_name: string
  design_name: string
  raw_url: string
  favorite_time: number
  favorite: boolean
}

export interface ListRecommendParams extends ListParams {}

export type ListRecommendRes = ListResponse<DesignItem[]>

export interface ListFavoriteParams extends ListParams {
  favorite_time?: number
}

export type ListFavoriteRes = ListResponse<FavoriteData>

export interface ListSearchParams extends ListParams {
  search_term: string
  id_offset?: string
}

export type ListSearchRes = ListResponse<FavoriteData>

export interface DetailParams {
  policy_name: string
  design_id?: string
  favorite_time?: number
}
