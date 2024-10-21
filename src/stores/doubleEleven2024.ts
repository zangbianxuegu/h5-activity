// 2024 双十一活动
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
            task_id: 'use_candle',
            stages: [20, 40, 60, 80, 100],
            score: '',
            awarded_types: [],
            award: [0, 0, 0, 0, 0],
          },
          {
            value: 0,
            task_id: 'send_heart_friends',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'collecting_season_candles',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'use_consumables',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'like_message_boat',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'send_heart_wax_friend',
            stages: [11],
            score: '',
            awarded_types: [],
            award: [0],
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
