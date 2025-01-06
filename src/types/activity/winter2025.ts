import type { Response } from '@/types'

export interface RiddleRes extends Response {
  question: string
}
export interface TokeInfo {
  lantern_token: number
}
