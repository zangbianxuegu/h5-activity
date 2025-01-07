import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_winter_2025_3', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_winter_2025_3'>>({
      event_data: {
        activitycenter_winter_2025_3: [
          {
            value: 50000000,
            task_id: 'send_heart_wax_friend_server',
            stages: [10000000, 20000000, 30000000, 40000000, 50000000],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0, 0, 0, 0],
          },
          {
            value: 10,
            task_id: 'send_heart_wax_friend',
            stages: [10, 50],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_winter_2025_3'>,
    ): void {
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
