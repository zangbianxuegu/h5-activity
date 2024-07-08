import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_tournament_of_triumph_1', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_tournament_of_triumph_1'>
    >({
      event_data: {
        activitycenter_tournament_of_triumph_1: [
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_1_dawn',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_1_prairie',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_1_rain',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_1_sunset',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_1_dusk',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_tournament_of_triumph_1_night',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'collecting_event_candles',
            stages: [3, 6, 10],
            score: '',
            awarded_types: [],
            award: [0, 0, 0],
          },
        ],
      },
      current_time: 1718618114,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_tournament_of_triumph_1'>,
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
