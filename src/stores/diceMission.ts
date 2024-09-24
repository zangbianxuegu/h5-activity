import { defineStore } from 'pinia'
import type { ActivityData } from '@/types'

export const useActivityStore = defineStore(
  'activitycenter_dice_mission', // 须与活动事件名一致
  () => {
    // 活动数据
    const activityData = ref<ActivityData<'activitycenter_dice_mission'>>({
      event_data: {
        activitycenter_dice_mission: [
          // 累计在线时长
          {
            value: 0,
            task_id: 'online_time',
            stages: [10, 20, 30, 40, 60],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0, 0, 0, 0],
          },
          // 点赞一个纸船
          {
            value: 0,
            task_id: 'like_message_boat',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          // 收集1根蜡烛
          {
            value: 0,
            task_id: 'collecting_candles',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          // 赠送一次心火
          {
            value: 0,
            task_id: 'send_heart_wax_friend',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          // 赠送一次爱心
          {
            value: 0,
            task_id: 'send_heart_friends',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          // 完成全部每日任务
          {
            value: 0,
            task_id: 'finish_daily_quests',
            stages: [1],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0],
          },
          // 使用20/50根蜡烛
          {
            value: 0,
            task_id: 'use_candle',
            stages: [20, 50],
            score: '',
            is_eggy_reward: false,
            awarded_types: [],
            award: [0, 0],
          },
        ],
      },
      current_time: 0,
    })
    // 更新活动数据
    function updateActivityData(
      newEventData: ActivityData<'activitycenter_dice_mission'>,
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
