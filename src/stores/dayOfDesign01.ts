// 绘梦节活动
import { defineStore } from 'pinia'
import type { DesignItem } from '@/types'

export const useActivityStore = defineStore(
  'dayofdesign01',
  () => {
    const recommendData = ref<DesignItem[]>([
      {
        design_id: '',
        author_name: '',
        design_name: '',
        raw_url: '',
        favorite: false,
        error: false,
      },
    ])
    // 更新推荐作品
    function updateRecommendData(newEventData: DesignItem[]): void {
      recommendData.value = newEventData
    }

    return {
      recommendData,
      updateRecommendData,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
