// 2024 绊爱联动活动
import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_kizuna_china_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_kizuna_china_2024'>>({
      event_data: {
        activitycenter_kizuna_china_2024: [
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m3',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m4',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m5',
            stages: [3],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m6',
            stages: [2000000, 4000000, 6000000, 8000000, 10000000],
            score: '',
            awarded_types: [],
            award: [0, 0, 0, 0, 0],
          },
          {
            value: 0,
            task_id: 'activitycenter_kizuna_china_2024_m7',
            stages: [1],
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
      newEventData: ActivityData<'activitycenter_kizuna_china_2024'>,
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
