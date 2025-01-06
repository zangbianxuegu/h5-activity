import { showToast } from 'vant'
import { defineStore } from 'pinia'
import type { TokeInfo } from '@/types'
import { getPlayerMissionData } from '@/utils/request'

export const useTokenStore = defineStore(
  'activitycenter_winter_main_2025', // 须与活动事件名一致
  () => {
    // 代币数量
    const tokeInfo = ref<TokeInfo>({
      lantern_token: 0,
    })

    const isLoaded = ref(false)

    // 更新花灯代币数量
    function updateTokenInfo(tokenInfo: TokeInfo): void {
      tokeInfo.value = tokenInfo
      isLoaded.value = true
    }

    /**
     * 初始化数据
     */
    function initData(): void {
      if (!isLoaded.value) {
        getPlayerMissionData({
          event: 'activitycenter_winter_2025_5',
          token: 'lantern_token',
        })
          .then((res) => {
            const tokenInfo = res.data.token_info
            updateTokenInfo(tokenInfo)
          })
          .catch((error) => {
            showToast(error.message)
          })
      }
    }

    return {
      tokeInfo,
      updateTokenInfo,
      initData,
    }
  },
  {
    persist: {
      storage: sessionStorage,
    },
  },
)
