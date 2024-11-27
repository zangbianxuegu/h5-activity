import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_doubledan_2024_1', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_doubledan_2024_1'>>({
      event_data: {
        activitycenter_doubledan_2024_1: [
          {
            value: 0,
            task_id: 'activitycenter_doubledan_2024_m11',
            stages: [0],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            awarded_infos: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'login_days',
            stages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            score: '',
            is_eggy_reward: false,
            awarded_infos: [],
            awarded_types: [],
            award: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_doubledan_2024_1'>,
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
