import { defineStore } from 'pinia'
import type { TokeInfo } from '@/types'

export const useTokenStore = defineStore(
  'activitycenter_winter_main_2025', // 须与活动事件名一致
  () => {
    // 代币数量
    const tokeInfo = ref<TokeInfo>({
      lantern_token: 0,
    })

    // 更新花灯代币数量
    function updateTokenInfo(tokenInfo: TokeInfo): void {
      tokeInfo.value = tokenInfo
    }

    return {
      tokeInfo,
      updateTokenInfo,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
