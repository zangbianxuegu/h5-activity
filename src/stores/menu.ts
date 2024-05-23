import { defineStore } from 'pinia'
import { type MenuItem } from '@/types'
import { setWebRedDot, updateRedDot } from '@/utils/request'
import { showToast } from 'vant'

export const useMenuStore = defineStore('menu', () => {
  // 菜单数据
  const menuData = ref<MenuItem[]>([
    // {
    //   label: '大耳狗茶话会',
    //   value: 'activity_sanrio_2024',
    //   routeName: 'Sanrio2024',
    //   isNew: false,
    //   isClaimedReward: true,
    //   children: [],
    // },
    // {
    //   label: '田月桑时春风雀跃',
    //   value: 'activity_sign_mayday_2024',
    //   routeName: 'SignMayday2024',
    //   isNew: false,
    //   isClaimedReward: true,
    //   children: [],
    // },
  ])

  function checkHasRedDot(items: MenuItem[]): boolean {
    for (const item of items) {
      if (item.isNew || !item.isClaimedReward) {
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

  // 监控是否有红点，通知客户端进行更新
  watch(
    () => hasRedDot.value,
    (newVal, oldVal) => {
      console.log('newVal, oldVal: ', newVal, oldVal)
      console.log('开始通知客户端更新红点')
      updateRedDot()
        .then((res) => {
          console.log('通知客户端更新红点res: ', res)
        })
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
        'activity_center_notice',
        'activity_dragonboat_2024',
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

  // 更新菜单数据 isClaimedReward
  function updateMenuDataByIsClaimedReward(
    event: string,
    isClaimedReward: boolean,
  ): void {
    menuData.value = menuData.value.map((item) => {
      if (
        item.value === 'activity_return_buff' &&
        item.children &&
        item.children.length > 0
      ) {
        const children = item.children.map((child) => {
          return {
            ...child,
            isClaimedReward:
              child.value === event ? isClaimedReward : child.isClaimedReward,
          }
        })
        return {
          ...item,
          children,
        }
      }
      return {
        ...item,
        isClaimedReward:
          item.value === event ? isClaimedReward : item.isClaimedReward,
      }
    })
  }

  return {
    menuData,
    updateMenuData,
    updatedMenuDataByRoute,
    updateMenuDataByIsNew,
    updateMenuDataByIsClaimedReward,
  }
})
