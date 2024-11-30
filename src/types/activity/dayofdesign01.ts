/**
 * @description 获取自己作品详情信息
 * @param {string} author_name 作者名字
 * @param {string} design_name 作品名字
 * @param {string} description 作品介绍
 * @param {string} raw_url 原图url
 * @param {string} share_url 分享图url
 */
export interface BaseDesignDetails {
  author_name: string
  design_name: string
  description: string
  raw_url: string
  share_url: string
}

/**
 * @description 作品审核状态
 * @param {string} PASSED 审核通过
 * @param {string} VERIFYING 审核中
 * @param {string} REFUSED 审核不通过
 */
export enum DESIGN_REVIEW_STATUS {
  PASSED = 'passed',
  VERIFYING = 'verifying',
  REFUSED = 'refused',
}

/**
 * @description 获取自己作品详情信息
 */
export interface SelfDesignDetails extends BaseDesignDetails {
  design_id: string
  review_status: DESIGN_REVIEW_STATUS
}

/**
 * @description 获取他人作品详情信息
 */
export interface OtherDesignDetails extends BaseDesignDetails {
  is_favorite: boolean
}

/**
 * @description 作品详情组件的展示类型
 */
export enum DESIGN_DETAILS_TYPE {
  SELF = 'self',
  OTHER = 'other',
}

/**
 * @description 绘梦节事件名
 */
export enum EVENT_DAY_OF_DESIGN_01 {
  ALL = 'activitycenter_dayofdesign01',
  EXHIBIT = 'activitycenter_dayofdesign01_post_exhibit',
}

/**
 * @description 作品列表页数据类型枚举
 */
export enum PageType {
  Recommend = 'recommend',
  Favorite = 'favorite',
  Search = 'search',
}

/**
 * @description 作品列表接口请求参数
 * @param {string} event 事件名
 * @param {string} policy_name 策略名
 * @param {string} [group] 分组（可选）
 */
export interface ListParams {
  event: string
  policy_name: string
  group?: string
}

/**
 * @description 作品列表接口返回
 * @param {number} code 状态码
 * @param {string} msg 信息
 * @param {T} data 数据
 */
export interface ListResponse<T> {
  code: number
  msg: string
  data: T
}

/**
 * @description 作品列表接口返回
 * @param {number} code 状态码
 * @param {string} msg 信息
 * @param {T} data 数据
 */
export interface DesignsData {
  designs: DesignItem[]
}

/**
 * @description 作品列表接口返回 - 收藏和搜索类型
 */
export interface FavoriteData extends DesignsData {
  is_end: boolean
  count: number
}

/**
 * @description 作品列表作品项
 * @param {string} design_id 作品ID
 * @param {string} author_name 作者名
 * @param {string} design_name 作品名
 * @param {string} raw_url 图片地址
 * @param {number} [favorite_time] 收藏时间，收藏列表才会有
 * @param {boolean} favorite 是否收藏
 */
export interface DesignItem {
  design_id: string
  author_name: string
  design_name: string
  raw_url: string
  favorite_time?: number
  favorite: boolean
}

/**
 * @description 作品列表接口请求参数 - 推荐
 */
export interface ListRecommendParams extends ListParams {}

/**
 * @description 作品列表接口返回 - 推荐
 */
export type ListRecommendRes = ListResponse<DesignItem[]>

/**
 * @description 作品列表接口请求参数 - 收藏
 * @param {number} [favorite_time] 最小收藏时间（可选）
 */
export interface ListFavoriteParams extends ListParams {
  favorite_time?: number
}

/**
 * @description 作品列表接口返回 - 收藏
 */
export type ListFavoriteRes = ListResponse<FavoriteData>

/**
 * @description 作品列表接口请求参数 - 搜索
 * @param {string} search_term 搜索文本
 * @param {string} [id_offset] 当前页最小的作品ID（可选）
 */
export interface ListSearchParams extends ListParams {
  search_term: string
  id_offset?: string
}

/**
 * @description 作品列表接口返回 - 搜索
 */
export type ListSearchRes = ListResponse<FavoriteData>

/**
 * @description 作品详情接口请求参数
 * @param {string} policy_name 策略名
 * @param {string} [design_id] 作品ID（可选），查看别人作品需要
 * @param {number} [favorite_time] 收藏时间（可选），查看收藏作品需要
 */
export interface DetailParams {
  policy_name: string
  design_id?: string
  favorite_time?: number
}
