// 和后端约定好接口返回的数据结构
export interface Response<T = any> {
  data: string[]
  code: number | string
  message: string
  result: T
}
