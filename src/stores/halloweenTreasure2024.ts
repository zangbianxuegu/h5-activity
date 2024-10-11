// 2024 万圣节寻宝活动
import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_Halloweentreasure_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_Halloweentreasure_2024'>
    >({
      event_data: {
        activitycenter_Halloweentreasure_2024: [
          // {
          //   map: [],
          //   ticket: 0,
          // },
          {
            value: 0,
            task_id: 'activitycenter_Halloweentreasure_2024_m1',
            stages: [72],
            score: '',
            awarded_types: [],
            award: [0],
            map: [1, 2],
            ticket: 10,
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_Halloweentreasure_2024'>,
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
