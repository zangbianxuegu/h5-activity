import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_winter_2025_2', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_winter_2025_2'>>({
      event_data: {
        activitycenter_winter_2025_2: [
          // 迎金蛇
          {
            value: 1,
            task_id: 'activitycenter_winter_2025_2_m1',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m2',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m3',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_extra1',
            stages: [3],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          // 舞龙灯
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m10',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m4',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m5',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_extra2',
            stages: [3],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          // 观晚会
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m6',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m7',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_m8',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_extra3',
            stages: [3],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          // 闹新春
          {
            value: 0,
            task_id: 'use_consumables_fireworks',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'use_consumables_social_lantern',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'collecting_event_candles',
            stages: [10],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_extra4',
            stages: [3],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          // 访亲友
          {
            value: 0,
            task_id: 'unlock_friend_carry',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'send_heart_wax_friend',
            stages: [5],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'send_friend_5hearts',
            stages: [1],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
          {
            value: 0,
            task_id: 'activitycenter_winter_2025_2_extra5',
            stages: [3],
            score: '',
            is_werewolf_reward: false,
            awarded_types: [],
            awarded_infos: [[]],
            award: [0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_winter_2025_2'>,
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
