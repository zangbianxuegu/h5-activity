// 2024 万圣节魔法坩埚惊喜无限（抽奖）
import { defineStore } from 'pinia'
import type { HalloweenPassResData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_Halloweenpass_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<HalloweenPassResData>({
      limit_exceeded: false,
      draw_id: 0,
      sprite_exchange_store: {
        store_list: [],
      },
      token_info: {
        halloween_token: 0,
      },
    })
    // 更新活动数据
    function updateActivityData(newEventData: HalloweenPassResData): void {
      activityData.value = newEventData
    }

    return {
      activityData,
      updateActivityData,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
