import { ref } from 'vue'
import type { DesignItem } from '@/types'

interface DesignData {
  designList: DesignItem[]
  totalPage: number
}

interface Store {
  cachedRecommend: globalThis.Ref<DesignItem[]>
  cachedFavorite: globalThis.Ref<DesignData>
  cachedSearch: globalThis.Ref<DesignData>
  updateCachedRecommend: (newData: DesignItem[]) => void
  updateCachedFavorite: (newData: DesignData) => void
  updateCachedSearch: (newData: DesignData) => void
}

export const initCachedData = {
  designList: [],
  totalPage: 0,
}

export function useStore(): Store {
  // 本地缓存的推荐数据
  const cachedRecommend = ref<DesignItem[]>([])

  // 更新本地缓存的推荐数据
  function updateCachedRecommend(newData: DesignItem[]): void {
    cachedRecommend.value = newData
  }

  // 本地缓存的收藏数据
  const cachedFavorite = ref<DesignData>(initCachedData)

  // 更新本地缓存的收藏数据
  function updateCachedFavorite(newData: DesignData): void {
    cachedFavorite.value = newData
  }

  // 本地缓存的搜索数据
  const cachedSearch = ref<DesignData>(initCachedData)

  // 更新本地缓存的搜索数据
  function updateCachedSearch(newData: DesignData): void {
    cachedSearch.value = newData
  }

  // 返回状态和更新函数
  return {
    cachedRecommend,
    cachedFavorite,
    cachedSearch,
    updateCachedRecommend,
    updateCachedFavorite,
    updateCachedSearch,
  }
}
