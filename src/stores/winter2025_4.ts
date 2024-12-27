import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_winter_2025_4', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_winter_2025_4'>>({
      event_data: {
        activitycenter_winter_2025_4: [
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_4_m4',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_4_m1',
            stages: [1, 3, 5],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0, 0],
          },

          {
            value: 0,
            task_id: 'activitycenter_winter_2025_4_m3',
            stages: [1, 3, 5],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0, 0],
          },
          {
            value: 0,
            task_id: 'collecting_season_candles',
            stages: [5, 15, 20],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0, 0],
          },
        ],
      },
      current_time: 0,
      token_count: '0',
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_winter_2025_4'>,
    ): void {
      activityData.value = newEventData
    }
    // 更新花灯代币数量
    function updateTokenCount(newTokenCount: string): void {
      activityData.value.token_count = newTokenCount
    }

    return {
      activityData,
      updateActivityData,
      updateTokenCount,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
