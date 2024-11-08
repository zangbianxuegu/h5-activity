import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_netease_werewolf', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_netease_werewolf'>>({
      event_data: {
        activitycenter_netease_werewolf: [
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_extra',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m7',
            stages: [1],
            score: '',
            is_werewolf_reward: true,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m6',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m5',
            stages: [1],
            score: '',
            is_werewolf_reward: true,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m4',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m3',
            stages: [1],
            score: '',
            is_werewolf_reward: true,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m2',
            stages: [1],
            score: '',
            is_werewolf_reward: true,
            awarded_types: [],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_netease_werewolf_m1',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            award: [0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_netease_werewolf'>,
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
