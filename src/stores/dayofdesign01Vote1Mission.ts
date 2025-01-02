import type { ActivityData } from '@/types'
import { defineStore } from 'pinia'

export const useActivityStore = defineStore(
  'activitycenter_dayofdesign01_vote1_mission', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_dayofdesign01_vote1_mission'>
    >({
      event_data: {
        activitycenter_dayofdesign01_vote1_mission: [
          {
            value: 0,
            task_id: 'activitycenter_dayofdesign01_vote1_mission_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_dayofdesign01_vote1_mission_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_dayofdesign01_vote1_mission_m3',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_dayofdesign01_vote1_mission_m4',
            stages: [10, 20, 30, 40, 50],
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
      newEventData: ActivityData<'activitycenter_dayofdesign01_vote1_mission'>,
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
