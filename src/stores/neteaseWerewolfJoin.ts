import type { ActivityData } from '@/types'
import { defineStore } from 'pinia'

export const useActivityStore = defineStore(
  'activitycenter_netease_werewolf_join', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<
      ActivityData<'activitycenter_netease_werewolf_join'>
    >({
      event_data: {
        activitycenter_netease_werewolf_join: [
          {
            value: 0,
            task_id: 'activitycenter_werewolf_player_m3',
            stages: [3],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_player_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_player_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_krill_m3',
            stages: [5],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_krill_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_krill_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },

          {
            value: 0,
            task_id: 'activitycenter_werewolf_spirit_m3',
            stages: [2],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_spirit_m1',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_spirit_m2',
            stages: [1],
            score: '',
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_werewolf_join_m1',
            stages: [1, 3, 5, 7, 10],
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
      newEventData: ActivityData<'activitycenter_netease_werewolf_join'>,
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
