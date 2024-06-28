import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_sign_friendship_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_sign_friendship_2024'>
    >({
      event_data: {
        activitycenter_sign_friendship_2024: [
          {
            value: 0,
            task_id: 'activitycenter_sign_friendship_2024_m1',
            stages: [0],
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
      newEventData: ActivityData<'activitycenter_sign_friendship_2024'>,
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
