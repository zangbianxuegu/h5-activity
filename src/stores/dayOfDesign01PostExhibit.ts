// 绘梦节作品列表页面
import { type DesignItem } from '@/types'
import { defineStore } from 'pinia'
// import type { HalloweenPassResData } from '@/types'
interface DesignData {
  designList: DesignItem[]
  totalPage: number
}

export const useActivityStore = defineStore('dayOfDesign01PostExhibit', () => {
  // 收藏数据
  const designData = ref<DesignData>({
    // 收藏列表
    designList: [],
    // 总页数
    totalPage: 0,
  })
  // 更新活动数据
  function updateActivityData(newEventData: DesignData): void {
    designData.value = newEventData
  }

  return {
    designData,
    updateActivityData,
  }
})
