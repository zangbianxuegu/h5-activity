import { defineStore } from 'pinia'
import type { FriendshipStore2024 } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_store_friendship_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<FriendshipStore2024>({
      token_info: { sunlight_token: 0 },
      sprite_exchange_store: {
        store_list: [
          { remaining_amount: 5, price: 100, id: 0 },
          { remaining_amount: 5, price: 100, id: 1 },
          { remaining_amount: 5, price: 100, id: 2 },
          { remaining_amount: 5, price: 100, id: 3 },
          { remaining_amount: 10, price: 50, id: 4 },
          { remaining_amount: 20, price: 30, id: 5 },
          { remaining_amount: 1, price: 15, id: 6 },
          { remaining_amount: 1, price: 20, id: 7 },
        ],
      },
      currency_info: { heart: 11 },
    })
    // 更新活动数据
    function updateActivityData(newEventData: FriendshipStore2024): void {
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
