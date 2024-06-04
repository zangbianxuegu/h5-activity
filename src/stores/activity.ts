import { defineStore } from 'pinia'
import type {
  EventData,
  EventDataKeys,
  EventDataKeysToObject,
  ActivityTime,
  Event,
} from '@/types'

export const useActivityStore = defineStore(
  'activity',
  () => {
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
      // 劳动节签到活动
      activity_sign_mayday_2024: [
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
      ],
      // 筑巢季季初活跃活动
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
      // 三丽鸥联动活动
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
      // 海洋节/自然日
      activity_nature_2024: [
        {
          task_id: 'activity_nature_2024_m1',
          stages: [2000000, 4000000, 6000000, 8000000, 10000000],
          award: [0, 0, 0, 0, 0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'activity_nature_2024_m2',
          stages: [1],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'collecting_event_candles',
          stages: [10],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'activity_nature_2024_m4',
          stages: [1],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
      ],
      // 击鼓行舟棕香十里活动
      activity_dragonboat_2024: [
        {
          task_id: 'use_consumables',
          stages: [1],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'activity_dragonboat_2024_m2',
          stages: [1],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'finish_daily_quests',
          stages: [1],
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
          task_id: 'activity_dragonboat_2024_m5',
          stages: [1],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
      ],
      // 儿童节 2024
      activity_childrens_day_2024: [
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm1',
          stages: [3],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm2',
          stages: [1],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm3',
          stages: [2],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm4',
          stages: [2],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm5',
          stages: [1],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm6',
          stages: [3],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm7',
          stages: [1],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_childrens_day_2024_qm_settlement',
          stages: [0],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
      ],
      // 周年庆预热 2024
      activity_anniversary_warmup_2024: [
        {
          value: 0,
          task_id: 'activity_anniversary_warmup_2024_m1',
          stages: [1],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_anniversary_warmup_2024_m2',
          stages: [1],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_anniversary_warmup_2024_m3',
          stages: [8],
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_anniversary_warmup_2024_m4',
          stages: [3],
          score: '',
          is_today_sign_in: 0,
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
        {
          value: 0,
          task_id: 'activity_anniversary_warmup_2024_m5',
          stages: [5],
          score: '',
          is_today_sign_in: 0,
          is_eggy_reward: false,
          awarded_types: [],
          award: [0],
        },
      ],
      activity_season22_sprint: [
        {
          task_id: 'activity_season22_sprint_m1',
          stages: [1],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'collecting_candles',
          stages: [50],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'login_days',
          stages: [5],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
        {
          task_id: 'activity_season22_sprint_m4',
          stages: [3],
          award: [0],
          value: 0,
          score: '',
          is_eggy_reward: false,
          awarded_types: [],
        },
      ],
    })

    // 设置eventDataKeys
    let eventDataKeys: EventDataKeys[]
    const activeEventName: EventDataKeysToObject =
      {} as unknown as EventDataKeysToObject
    function setEventDataKeys(): void {
      eventDataKeys = Object.keys(eventData.value) as EventDataKeys[]
      eventDataKeys.forEach((e: EventDataKeys) => {
        activeEventName[e] = e
      })
    }
    setEventDataKeys()

    function updateActivityTime(newActivityTime: ActivityTime): void {
      activityTime.value = newActivityTime
    }

    function updateEventData(
      event: keyof EventData,
      newEventData: Event | Event[],
    ): void {
      if (
        event === 'activity_season22_start' ||
        event === 'activity_sign_mayday_2024' ||
        event === 'activity_sanrio_2024' ||
        event === 'activity_nature_2024' ||
        event === 'activity_dragonboat_2024' ||
        event === 'activity_childrens_day_2024' ||
        event === 'activity_anniversary_warmup_2024' ||
        event === 'activity_season22_sprint'
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
      activeEventName,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ['eventData'],
    },
  },
)
