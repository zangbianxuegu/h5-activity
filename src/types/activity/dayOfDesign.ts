export type SearchType = 'collect' | 'recommend'

export interface ListFavoriteParams {
  event: string
  policy_name: string
  favorite_time?: number
  group?: string
}

export interface ListFavoriteRes {
  code: number
  msg: string
  data: FavoriteData
}

export interface FavoriteData {
  is_end: boolean
  count: number
  designs: DesignItem[]
}

export interface DesignItem {
  design_id: number
  author_name: string
  design_name: string
  raw_url: string
  favorite_time: number
  is_favorite: boolean
}

export interface WorkListParams {
  page: number
  per_page: number
  keywords?: string
  type: SearchType
}

export interface WorkItem {
  id: string
  image_url: string
  author: string
  title: string
  description: string
  collected: boolean
}

export interface WorkData {
  list: WorkItem[]
  page: number
  total_pages: number
}

export interface WorkListRes {
  code: number
  msg: string
  data: WorkData
}
