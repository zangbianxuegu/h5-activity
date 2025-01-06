import type { Response } from '@/types'

export interface RiddleRes extends Response {
  question: string
}
export interface TokenInfo {
  lantern_token: number
}
