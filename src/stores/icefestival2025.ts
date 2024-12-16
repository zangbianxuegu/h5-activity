import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_icefestival2025', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_icefestival2025'>>({
      event_data: {
        activitycenter_icefestival2025: [
          {
            value: 0,
            task_id: 'activitycenter_icefestival2025_create',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_icefestival2025_like_received',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_icefestival2025_like',
            stages: [1, 3, 5],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [1, 0, 1],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_icefestival2025'>,
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
