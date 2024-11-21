// 2024 云音乐活动
import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_cloud_music_2024', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_cloud_music_2024'>>({
      event_data: {
        activitycenter_cloud_music_2024: [
          {
            value: 1,
            task_id: 'activitycenter_cloud_music_2024_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_cloud_music_2024_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 1,
            task_id: 'activitycenter_cloud_music_2024_m3',
            stages: [2],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_cloud_music_2024_m4',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_cloud_music_2024_m5',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 1,
            task_id: 'activitycenter_cloud_music_2024_m6',
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
      newEventData: ActivityData<'activitycenter_cloud_music_2024'>,
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