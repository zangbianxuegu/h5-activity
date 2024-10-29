export type SearchType = 'collect' | 'recommend'

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
