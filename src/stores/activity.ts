import { defineStore } from 'pinia'
import { type ActivityTime } from '@/types'

export const useActivityStore = defineStore('activity', () => {
  // 活动数据
  const activityTime = ref<ActivityTime>({})

  function updateActivityTime(newActivityTime: ActivityTime): void {
    activityTime.value = newActivityTime
  }

  return {
    activityTime,
    updateActivityTime,
  }
})
