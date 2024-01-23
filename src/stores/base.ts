import { defineStore } from 'pinia'
import { type BaseInfo } from '@/types'

export const useBaseStore = defineStore('base', () => {
  // 基本信息
  const baseInfo = ref<BaseInfo>({})

  function updateBaseInfo(newBaseInfo: BaseInfo): void {
    baseInfo.value = newBaseInfo
  }

  function updateBaseInfoItems(obj: any): void {
    const newBaseInfo = { ...baseInfo.value, ...obj }
    baseInfo.value = newBaseInfo
  }

  return {
    baseInfo,
    updateBaseInfo,
    updateBaseInfoItems,
  }
})
