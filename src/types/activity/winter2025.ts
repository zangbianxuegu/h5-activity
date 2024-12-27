import type { Response, ActivityData } from '@/types'

export interface RiddleRes extends Response {
  question: string
}

export interface Winter2025ResData
  extends ActivityData<'activitycenter_winter_2025_4'> {
  token_info: Record<string, number>
}
