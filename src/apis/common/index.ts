import http from '@/utils/http'
import type * as types from './type'

// 一级栏目列表
export const columnList = (data: types.OperateParams): Promise<any> =>
  http.get('/zlb/column/super/list', { ...data })
