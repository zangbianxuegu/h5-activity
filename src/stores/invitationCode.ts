import type { ActivityData } from '@/types'
import { defineStore } from 'pinia'

export const useActivityStore = defineStore(
  'activitycenter_invitation_code', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_invitation_code'>>({
      event_data: {
        activitycenter_invitation_code: [
          {
            value: 0,
            task_id: 'activitycenter_invitation_code_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_invitation_code_m2',
            stages: [1, 2, 3],
            score: '',
            awarded_types: [],
            award: [0, 0, 0],
          },
          {
            value: 0,
            task_id: 'activitycenter_invitation_code_m3',
            stages: [30, 60, 100, 150, 300],
            score: '',
            awarded_types: [],
            award: [0, 0, 0, 0, 0],
          },
          {
            value: 0,
            task_id: 'activitycenter_invitation_code_m4',
            stages: [1, 2, 3, 4, 5],
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
      newEventData: ActivityData<'activitycenter_invitation_code'>,
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
