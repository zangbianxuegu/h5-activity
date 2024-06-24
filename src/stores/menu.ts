import { defineStore } from 'pinia'
import { type MenuItem } from '@/types'
import { updateRedDot } from '@/apis/base'
import { setWebRedDot } from '@/utils/request'
import { showToast } from 'vant'

export const useMenuStore = defineStore('menu', () => {
  // 菜单数据
  const menuData = ref<MenuItem[]>([])

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
        'activity_sign_in_1',
        'activity_season22_start',
        'activity_sanrio_2024',
        'activity_sign_mayday_2024',
        'activity_nature_2024',
        'activity_childrens_day_2024',
        'activity_center_notice',
        'activity_dragonboat_2024',
        'activity_anniversary_warmup_2024',
        'activitycenter_poster_anniversary_2024',
        'activity_season22_sprint',
        'activitycenter_anniversary_visit_2024',
        'activitycenter_anniversary_server_2024',
        'activitycenter_anniversary_store_2024',
        'activitycenter_store_friendship_2024',
        'activitycenter_main_friendship_2024',
        'activitycenter_sign_friendship_2024',
        'activitycenter_week1_friendship_2024',
        'activitycenter_week2_friendship_2024',
        'activitycenter_week3_friendship_2024',
        'activitycenter_week4_friendship_2024',
        'activitycenter_week5_friendship_2024',
        'activitycenter_week6_friendship_2024',
        'activitycenter_poster_friendship_2024',
        'activitycenter_tournament_of_triumph_1',
        'activitycenter_tournament_of_triumph_2',
        'activitycenter_tournament_of_triumph_3',
        'activitycenter_rainbow2_2024',
      ].includes(event)
    ) {
      curItem = menuData.value.find((item) => item.value === event)
    } else if (['activity_sign_in_2', 'activity_sign_in_3'].includes(event)) {
      curItem = menuData.value
        .find((item) => item.value === 'signin')
        ?.children?.find((child) => child.value === event)
    }
    if (curItem?.isNew) {
      setWebRedDot({ event })
        .then(() => {
          menuData.value = menuData.value.map((item) => {
            if (
              item.value === 'signin' &&
              item.children &&
              item.children.length > 0
            ) {
              const children = item.children.map((child) => {
                const isNew = child.value === event ? false : child.isNew
                return {
                  ...child,
                  isNew,
                }
              })
              return {
                ...item,
                children,
              }
            }
            return {
              ...item,
              isNew: item.value === event ? false : item.isNew,
            }
          })
        })
        .catch((error) => {
          showToast(error.message)
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
        item.value === 'return_buff' &&
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
    updateMenuData,
    updatedMenuDataByRoute,
    updateMenuDataByIsNew,
    updateMenuDataByIsClaimedReward,
    updateMenuDataByHasUnclaimedReward,
  }
})
