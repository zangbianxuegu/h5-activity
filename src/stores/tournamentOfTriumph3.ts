import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_tournament_of_triumph_3', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_tournament_of_triumph_3'>
    >({
      event_data: {
        activitycenter_tournament_of_triumph_3: [
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_3_reward',
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
      newEventData: ActivityData<'activitycenter_tournament_of_triumph_3'>,
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