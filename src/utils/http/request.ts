import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { Response } from './types'
import { Local } from '@/utils/storage'

axios.defaults.baseURL = '/api'
axios.defaults.timeout = 1000 * 60
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  // 根据不同 env 设置不同的 baseURL
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
})

// axios 实例拦截请求
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 设置 token
    const token = Local.get('token')
    token && (config.headers['X-Auth-Token'] = token)
    return Promise.resolve(config)
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// axios 实例拦截响应
service.interceptors.response.use(
  (res: AxiosResponse) => {
    return Promise.resolve(res)
  },
  (err: AxiosError): Promise<AxiosError> => {
    const { response } = err
    if ((response?.data as Response).code === 401) {
      Local.remove('token')
      location.reload()
    }
    return Promise.reject(err)
  },
)

export type { AxiosResponse, AxiosRequestConfig }

export default service
