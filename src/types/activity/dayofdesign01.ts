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
