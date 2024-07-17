import { defineStore } from 'pinia'
import { type BaseInfo } from '@/types'

export const useBaseStore = defineStore('base', () => {
  // 基本信息
  const baseInfo: Ref<BaseInfo> = ref({
    currentTime: 0,
    currentFriendshipWeek: 0,
    channel: '',
    appChannel: '',
    token: '',
    returnBuff: 'true',
    gameUid: '',
  })

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
