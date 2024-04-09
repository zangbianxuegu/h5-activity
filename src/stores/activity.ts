import { defineStore } from 'pinia'
import {
  type ActivityTime,
  type Event,
  type Mayday2024Event,
  type EventData,
} from '@/types'

export const useActivityStore = defineStore('activity', () => {
  // 活动数据
  const activityTime = ref<ActivityTime>({})
  const eventData = ref<EventData>({
    activity_sign_in_1: {
      task_id: 'activity_sign_in_m1',
      stages: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      award: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      value: 0,
      score: '',
      is_eggy_reward: false,
      is_today_sign_in: false,
      awarded_types: [],
    },
    activity_sign_in_2: {
      task_id: 'activity_sign_in_m2',
      stages: [1, 3, 5, 7, 9, 12, 15, 20],
      award: [0, 0, 0, 0, 0, 0, 0, 0],
      value: 0,
      score: '',
      is_eggy_reward: false,
      is_today_sign_in: false,
      awarded_types: [],
    },
    activity_sign_in_3: {
      task_id: 'activity_sign_in_m3',
      stages: [1, 3, 5, 7, 10, 15, 20, 25],
      award: [0, 0, 0, 0, 0, 0, 0, 0],
      value: 0,
      score: '',
      is_eggy_reward: false,
      is_today_sign_in: false,
      awarded_types: [],
    },
    activity_sign_mayday_2024: [
      {
        task_id: 'activity_sign_mayday_2024_m2',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
        task_names: ['activity_sign_mayday_2024_m1'],
      },
      {
        task_id: 'activity_sign_mayday_2024_m1',
        stages: [1, 2, 3, 4, 5, 6],
        award: [0, 0, 0, 0, 0, 0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        is_today_sign_in: false,
        awarded_types: [],
      },
    ],
    activity_season22_start: [
      {
        task_id: 'collecting_season_candles',
        stages: [15],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'login_days',
        stages: [3],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'unlock_spirit',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'activity_season22_start_m1',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
    ],
    activity_sanrio_2024: [
      {
        task_id: 'activity_sanrio_2024_m1',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'collecting_event_candles',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'activity_sanrio_2024_m3',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'activity_sanrio_2024_m4',
        stages: [1],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'activity_sanrio_2024_m5',
        stages: [3],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
      {
        task_id: 'activity_sanrio_2024_m6',
        stages: [5],
        award: [0],
        value: 0,
        score: '',
        is_eggy_reward: false,
        awarded_types: [],
      },
    ],
  })

  function updateActivityTime(newActivityTime: ActivityTime): void {
    activityTime.value = newActivityTime
  }

  function updateEventData(
    event: keyof EventData,
    newEventData: Event | Mayday2024Event | Event[],
  ): void {
    if (event === 'activity_sign_mayday_2024') {
      eventData.value[event] = newEventData as Mayday2024Event
    } else if (
      event === 'activity_season22_start' ||
      event === 'activity_sanrio_2024'
    ) {
      eventData.value[event] = newEventData as Event[]
    } else {
      eventData.value[event] = newEventData as Event
    }
  }

  return {
    activityTime,
    eventData,
    updateActivityTime,
    updateEventData,
  }
})
