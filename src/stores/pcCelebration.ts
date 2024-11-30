import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_pc_celebration', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_pc_celebration'>>({
      event_data: {
        activitycenter_pc_celebration: [
          {
            value: 0,
            task_id: 'activitycenter_pc_celebration_m1',
            stages: [0],
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
      newEventData: ActivityData<'activitycenter_pc_celebration'>,
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
