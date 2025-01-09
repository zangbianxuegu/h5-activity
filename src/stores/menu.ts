import { defineStore } from 'pinia'
import { type MenuItem } from '@/types'
import { updateRedDot } from '@/apis/base'
import { setWebRedDot } from '@/utils/request'
import { showToast } from 'vant'

export const useMenuStore = defineStore('menu', () => {
  // 菜单数据
  const menuData = ref<MenuItem[]>([])
  const isMenuVisible = ref(true)

  function checkHasRedDot(items: MenuItem[]): boolean {
    for (const item of items) {
      if (item.isNew || item.hasUnclaimedReward) {
        return true
      }
      if (item.children && item.children.length > 0) {
        const areChildrenRedDot = checkHasRedDot(item.children)
        if (areChildrenRedDot) {
          return true
        }
      }
    }
    return false
  }

  const hasRedDot = computed(() => checkHasRedDot(menuData.value))
  let isFirstLoad = true

  // 监控是否有红点，通知客户端进行更新
  watch(
    () => hasRedDot.value,
    (newVal, oldVal) => {
      if (isFirstLoad) {
        isFirstLoad = false
        return
      }
      console.log('oldVal hasRedDot: ', oldVal)
      console.log('newVal hasRedDot: ', newVal)
      updateRedDot()
        .then((_) => {})
        .catch((error) => {
          showToast(error.message)
        })
    },
  )

  // 改变菜单显示状态
  function changeMenuVisible(visible: boolean): void {
    isMenuVisible.value = visible
  }

  // 更新菜单数据
  function updateMenuData(newMenuData: MenuItem[]): void {
    menuData.value = newMenuData
  }

  // 更新菜单，根据访问页面
  function updatedMenuDataByRoute(event: string): void {
    // updateMenuDataByIsActive(event)
    updateMenuDataByIsNew(event)
  }

  // 更新菜单数据 isNew
  function updateMenuDataByIsNew(event: string): void {
    // 接口更新红点状态
    let curItem = null
    if (
      [
        'activitycenter_winter_2025_1',
        'activitycenter_winter_2025_2',
        'activitycenter_winter_2025_3',
        'activitycenter_winter_2025_4',
        'activitycenter_winter_2025_5',
      ].includes(event)
    ) {
      curItem = menuData.value
        .find((item) => item.value === 'activitycenter_winter_main_2025')
        ?.children?.find((child) => child.value === event)
    } else {
      curItem = menuData.value.find((item) => item.value === event)
    }
    if (curItem?.isNew) {
      void setWebRedDot({ event }).then(() => {
        menuData.value = menuData.value.map((item) => {
          if (
            ['activitycenter_winter_main_2025'].includes(item.value) &&
            item.children &&
            item.children.length > 0
          ) {
            const children = item.children.map((child: MenuItem) => {
              return {
                ...child,
                isNew: child.value === event ? false : child.isNew,
              }
            })
            const isNewOfParent: boolean = children.some(
              (child: MenuItem) => child.isNew,
            )
            return {
              ...item,
              children,
              isNew: isNewOfParent,
            }
          }
          return {
            ...item,
            isNew: item.value === event ? false : item.isNew,
          }
        })
        console.log('menuData.value: ', menuData.value)
      })
    }
  }

  /**
   * @function 更新菜单数据hasUnclaimedReward
   * @param event 活动名
   * @param hasUnclaimedReward 是否有未领奖
   */
  function updateMenuDataByHasUnclaimedReward(
    event: string,
    hasUnclaimedReward: boolean,
  ): void {
    menuData.value = menuData.value.map((item) => {
      if (
        ['return_buff', 'activitycenter_winter_main_2025'].includes(
          item.value,
        ) &&
        item.children &&
        item.children.length > 0
      ) {
        const children = item.children.map((child: MenuItem) => {
          return {
            ...child,
            hasUnclaimedReward:
              child.value === event
                ? hasUnclaimedReward
                : child.hasUnclaimedReward,
          }
        })
        const hasUnclaimedRewardOfParent: boolean = children.some(
          (child: MenuItem) => child.hasUnclaimedReward,
        )
        return {
          ...item,
          children,
          hasUnclaimedReward: hasUnclaimedRewardOfParent,
        }
      }
      return {
        ...item,
        hasUnclaimedReward:
          item.value === event ? hasUnclaimedReward : item.hasUnclaimedReward,
      }
    })
  }

  /**
   * @function 更新菜单数据isClaimedReward
   * @param event 活动名
   * @param isClaimedReward 是否已领奖
   * @description 如果删除此方法，build 会报错。保留这个方法，是为了不侵入性修改之前的所有活动页面。
   */
  function updateMenuDataByIsClaimedReward(
    event: string,
    isClaimedReward: boolean,
  ): void {
    menuData.value = menuData.value.map((item) => {
      return {
        ...item,
        hasUnclaimedReward:
          item.value === event ? !isClaimedReward : item.hasUnclaimedReward,
      }
    })
  }

  return {
    menuData,
    isMenuVisible,
    changeMenuVisible,
    updateMenuData,
    updatedMenuDataByRoute,
    updateMenuDataByIsNew,
    updateMenuDataByIsClaimedReward,
    updateMenuDataByHasUnclaimedReward,
  }
})
