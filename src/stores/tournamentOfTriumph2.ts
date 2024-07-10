import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_tournament_of_triumph_2', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_tournament_of_triumph_2'>
    >({
      event_data: {
        activitycenter_tournament_of_triumph_2: [
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_2_top3',
            stages: [1, 3, 6],
            score: '',
            awarded_types: [],
            award: [0, 0, 0],
          },
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_2_top1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
        ],
      },
      current_time: 1718618114,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_tournament_of_triumph_2'>,
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
