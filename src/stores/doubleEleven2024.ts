// 2024 夏之日活动
import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_double_eleven_2024_2', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_double_eleven_2024_2'>
    >({
      event_data: {
        activitycenter_double_eleven_2024_2: [
          {
            value: 0,
            task_id: 'activitycenter_double_eleven_2024_2_m1',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_double_eleven_2024_2_m2',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_double_eleven_2024_2_m3',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_double_eleven_2024_2_m4',
            stages: [11],
            score: '',
            is_today_sign_in: 0,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_double_eleven_2024_2_m5',
            stages: [11],
            score: '',
            is_today_sign_in: 0,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'use_season_candles',
            stages: [20, 40, 60, 80, 100],
            score: '',
            awarded_types: [],
            award: [0, 0, 0, 0, 0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_double_eleven_2024_2'>,
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
