import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_rainbow1_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_rainbow1_2024'>>({
      event_data: {
        activitycenter_rainbow1_2024: [
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m9',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'collecting_event_candles',
            stages: [5],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m10',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m11',
            stages: [3],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m12',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m13',
            stages: [3],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m14',
            stages: [5],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_rainbow_2024_m15',
            stages: [8],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
        ],
      },
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_rainbow1_2024'>,
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
