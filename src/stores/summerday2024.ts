import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_summerday_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_summerday_2024'>>({
      event_data: {
        activitycenter_summerday_2024: [
          {
            value: 0,
            task_id: 'activitycenter_season23_start_m1',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_season23_start_m2',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'login_days',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'collecting_season_candles',
            stages: [20, 30, 50],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0, 0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_summerday_2024'>,
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
