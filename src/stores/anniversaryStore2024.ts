import { defineStore } from 'pinia'
import type { AnniversaryStore2024 } from '@/types'

export const useActivityStore = defineStore(
  'anniversaryStore2024',
  () => {
    // 活动数据
    const activityData = ref<AnniversaryStore2024>({
      token_info: {
        fireworks_token: 920,
      },
      sprite_exchange_store: {
        store_list: [
          { remaining_amount: 3, price: 100, id: 0 },
          { remaining_amount: 3, price: 100, id: 1 },
          { remaining_amount: 3, price: 60, id: 2 },
          { remaining_amount: 3, price: 60, id: 3 },
          { remaining_amount: 5, price: 60, id: 4 },
          { remaining_amount: 20, price: 30, id: 5 },
        ],
      },
    })
    // 更新活动数据
    function updateActivityData(newEventData: AnniversaryStore2024): void {
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
