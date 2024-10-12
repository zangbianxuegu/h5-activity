import type { ActivityData } from '@/types'
import { defineStore } from 'pinia'

export const useActivityStore = defineStore(
  'activitycenter_Halloweentask_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_Halloweentask_2024'>>(
      {
        event_data: {
          activitycenter_Halloweentask_2024: [
            // { ticket: -1 },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m14',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m13',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m12',
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
              task_id: 'activitycenter_Halloweentask_2024_m10',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'collecting_event_candles',
              stages: [40],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m8',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m7',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m6',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m5',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m4',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m3',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m2',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
            {
              value: 0,
              task_id: 'activitycenter_Halloweentask_2024_m1',
              stages: [1],
              score: '',
              awarded_types: [],
              award: [0],
            },
          ],
        },
        current_time: 0,
      },
    )
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_Halloweentask_2024'>,
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
