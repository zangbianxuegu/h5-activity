import { defineStore } from 'pinia'
import { TokenNameEnum, type DiceStore } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_dice_store', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<DiceStore>({
      token_info: { [TokenNameEnum.DiceStore]: 0 },
      sprite_exchange_store: {
        store_list: [
          { remaining_amount: 3, price: 60, id: 0 },
          { remaining_amount: 5, price: 60, id: 1 },
          { remaining_amount: 5, price: 30, id: 2 },
          { remaining_amount: 5, price: 30, id: 3 },
          { remaining_amount: 5, price: 30, id: 4 },
          { remaining_amount: 10, price: 20, id: 5 },
          { remaining_amount: 5, price: 3, id: 6 },
          { remaining_amount: 3, price: 6, id: 7 },
        ],
      },
    })
    // 更新活动数据
    function updateActivityData(newEventData: DiceStore): void {
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
