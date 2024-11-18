import type { Response } from '@/types'

// 定义狼人杀特定响应接口，继承通用响应接口
export interface WerewolfRes extends Response {
  werewolf_nickname: string
  werewolf_nid: string
}
