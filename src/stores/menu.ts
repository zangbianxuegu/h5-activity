import { defineStore } from 'pinia'
import { type MenuItem } from '@/types'
import { setWebRedDot } from '@/utils/request'
import { showToast } from 'vant'

export const useMenuStore = defineStore('menu', () => {
  // 菜单数据
  const menuData = ref<MenuItem[]>([
    // {
    //   label: '假日打卡',
    //   value: 'activity_sign_in_1',
    //   routeName: 'Holiday',
    //   isNew: false,
    //   isClaimedReward: true,
    //   children: [],
    // },
    // {
    //   label: '签到活动',
    //   value: 'signin',
    //   routeName: 'Signin',
    //   isNew: false,
    //   isClaimedReward: true,
    //   children: [
    //     {
    //       label: '冬季签到',
    //       value: 'activity_sign_in_2',
    //       routeName: 'Winter',
    //       isNew: false,
    //       isClaimedReward: true,
    //     },
    //     {
    //       label: '暑假签到',
    //       value: 'activity_sign_in_3',
    //       routeName: 'Summer',
    //       isNew: false,
    //       isClaimedReward: true,
    //     },
    //   ],
    // },
    {
      label: '田月桑时春风雀跃',
      value: 'activity_sign_mayday_2024',
      routeName: 'SignMayday2024',
      isNew: false,
      isClaimedReward: true,
      children: [],
    },
    {
      label: '小光快报',
      value: 'activity_center_notice',
      routeName: 'Bulletin',
      isNew: false,
      isClaimedReward: true,
    },
  ])

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
        'activity_sign_mayday_2024',
        'activity_center_notice',
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
        item.value === 'signin' &&
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
