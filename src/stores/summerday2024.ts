// 2024 夏之日活动
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
            task_id: 'activitycenter_summerday_2024_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'use_consumables',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_summerday_2024_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'login_days',
            stages: [5],
            score: '',
            is_today_sign_in: 0,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'collecting_event_candles',
            stages: [20, 30, 50],
            score: '',
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
