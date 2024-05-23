import { showToast } from 'vant'
import {
  type RouteLocationNormalized,
  createRouter,
  createWebHashHistory,
} from 'vue-router'
import { routes } from './routes'
import { useBaseStore } from '@/stores/base'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import dayjs from 'dayjs'
import { type MenuItem, type Activity, type ActivityTime } from '@/types'
import { getPlayerMissionData, webViewStatistics } from '@/utils/request'

// 接口数据类型
interface ActivityData {
  start_time: number
  end_time: number
  is_new: number
  is_claimed_reward: number
  active: number
}
type Activities = Record<string, ActivityData>

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, _, next) => {
  console.log('beforeEach to: ', to)
  const title = to?.meta?.title
  const module = to?.meta?.module
  if (title) {
    document.title = title as string
  }
  // 更新菜单数据 isActive
  if (module && typeof module === 'string') {
    const menuStore = useMenuStore()
    menuStore.updatedMenuDataByRoute(module)
  }
  // 日志数据上报
  try {
    if (typeof module === 'string') {
      if (
        ![
          'activity_center_notice',
          'activity_return_buff',
          'activity_return_buff_reunion',
          'activity_return_buff_setout',
          'activity_return_buff_together',
        ].includes(module)
      ) {
        webViewStatistics({ module })
          .then(() => {
            // console.log('日志数据上报成功. module: ' + module)
          })
          .catch((error) => {
            showToast(error.message)
          })
      }
    }
  } catch (error) {
    console.log('webViewStatistics error: ', error)
  } finally {
    next()
  }
})

router.afterEach((to, from) => {
  console.log('afterEach to, from: ', to, from)
  const menuStore = useMenuStore()
  const menuData = computed(() => menuStore.menuData)
  console.log('menuData.value: ', menuData.value)
  if (menuData.value.length > 0) {
    if (to.path === '/' || !hasMenuItem(menuData.value, to)) {
      console.log('开始 router replace')
      void router.replace({ name: menuData.value[0].routeName })
    }
  } else {
    getAllEvents(to)
  }
})

function hasMenuItem(menuData: MenuItem[], to: any): boolean {
  let res = false
  menuData.forEach((item) => {
    if (item.routeName === to.name) {
      res = true
    }
    if (item.children && item.children.length > 0) {
      item.children.forEach((child) => {
        if (child.routeName === to.name) {
          res = true
        }
      })
    }
  })
  return res
}

// 菜单初始值
const initMenuItems: MenuItem[] = [
  {
    label: '巢落大地筑梦共时',
    value: 'activity_season22_start',
    routeName: 'Season22Start',
    isNew: false,
    isClaimedReward: true,
    children: [],
  },
  {
    label: '田月桑时春风雀跃',
    value: 'activity_sign_mayday_2024',
    routeName: 'SignMayday2024',
    isNew: false,
    isClaimedReward: true,
    children: [],
  },
  {
    label: '大耳狗茶话会',
    value: 'activity_sanrio_2024',
    routeName: 'Sanrio2024',
    isNew: false,
    isClaimedReward: true,
    children: [],
  },
  {
    label: '予光千缕碧浪万顷',
    value: 'activity_nature_2024',
    routeName: 'Nature2024',
    isNew: false,
    isClaimedReward: true,
    children: [],
  },
  {
    label: '假日打卡',
    value: 'activity_sign_in_1',
    routeName: 'Holiday',
    isNew: false,
    isClaimedReward: true,
    children: [],
  },
  {
    label: '签到活动',
    value: 'signin',
    routeName: 'Signin',
    isNew: false,
    isClaimedReward: true,
    children: [
      {
        label: '冬季签到',
        value: 'activity_sign_in_2',
        routeName: 'Winter',
        isNew: false,
        isClaimedReward: true,
      },
      {
        label: '暑假签到',
        value: 'activity_sign_in_3',
        routeName: 'Summer',
        isNew: false,
        isClaimedReward: true,
      },
    ],
  },
  {
    label: '天空王国回归指南',
    value: 'activity_return_buff',
    routeName: 'ReturnBuff',
    isNew: false,
    isClaimedReward: true,
    children: [
      {
        label: '重逢',
        value: 'activity_return_buff_reunion',
        routeName: 'Reunion',
        isNew: false,
        isClaimedReward: true,
      },
      {
        label: '启程',
        value: 'activity_return_buff_setout',
        routeName: 'Setout',
        isNew: false,
        isClaimedReward: true,
      },
      {
        label: '同行',
        value: 'activity_return_buff_together',
        routeName: 'Together',
        isNew: false,
        isClaimedReward: true,
      },
    ],
  },
  {
    label: '小光快报',
    value: 'activity_center_notice',
    routeName: 'Bulletin',
    isNew: false,
    isClaimedReward: true,
  },
]

// 抽取有效的活动信息
function extractActiveEvents(activitiesResponse: Activities): Activity[] {
  const res = Object.entries(activitiesResponse).reduce<Activity[]>(
    (activeEvents, [activityName, activityInfo]) => {
      if (activityInfo.active === 1) {
        activeEvents.push({
          activity: activityName,
          startTime: activityInfo.start_time,
          endTime: activityInfo.end_time,
          isNew: activityInfo.is_new === 1,
          isClaimedReward:
            activityName === 'activity_center_notice'
              ? true
              : activityInfo.is_claimed_reward === 1,
        })
      }
      return activeEvents
    },
    [],
  )
  const baseStore = useBaseStore()
  const returnBuff = baseStore.baseInfo.returnBuff
  if (returnBuff === 'true') {
    res.unshift({
      activity: 'activity_return_buff',
      startTime: 0,
      endTime: 0,
      isNew: false,
      isClaimedReward: true,
    })
  }
  return res.sort((a, b) => {
    // 如果是小光快报，让它排在最后
    if (a.activity === 'activity_center_notice') return 1
    if (b.activity === 'activity_center_notice') return -1
    return b.startTime - a.startTime
  })
}

// 生成菜单数据
function generateMenuData(
  menuItems: MenuItem[],
  activeEvents: Activity[],
): MenuItem[] {
  const activeEventsMap = new Map(
    activeEvents.map((event) => [event.activity, event]),
  )
  const filteredMenuItems = menuItems.reduce<MenuItem[]>(
    (activeMenu, menuItem) => {
      const event = activeEventsMap.get(menuItem.value)
      const updatedMenuItem = { ...menuItem }
      if (event) {
        updatedMenuItem.isNew = event.isNew
        updatedMenuItem.isClaimedReward = event.isClaimedReward
        activeMenu.push(updatedMenuItem)
      } else if (menuItem.children && menuItem.children.length > 0) {
        const activeChildren = generateMenuData(menuItem.children, activeEvents)
        if (activeChildren.length) {
          updatedMenuItem.children = activeChildren
          activeMenu.push(updatedMenuItem)
        }
      }
      return activeMenu
    },
    [],
  )

  // 对菜单进行排序，确保顺序与 activeEvents 一致
  function sortMenuItemsByActiveEventsOrder(menuItems: MenuItem[]): MenuItem[] {
    return menuItems.sort((a, b) => {
      const indexA = activeEvents.findIndex(
        (event) => event.activity === a.value,
      )
      const indexB = activeEvents.findIndex(
        (event) => event.activity === b.value,
      )
      return indexA - indexB
    })
  }
  const sortedMenuItems = sortMenuItemsByActiveEventsOrder(filteredMenuItems)
  sortedMenuItems.forEach((menuItem) => {
    if (menuItem.children && menuItem.children.length > 0) {
      menuItem.children = sortMenuItemsByActiveEventsOrder(menuItem.children) // 对子菜单也应用排序
    }
  })

  return sortedMenuItems
}

// 获取所有活动信息
function getAllEvents(to: RouteLocationNormalized): void {
  getPlayerMissionData({})
    .then((res) => {
      const menuStore = useMenuStore()
      const { updateMenuData } = menuStore
      const baseStore = useBaseStore()
      const { updateBaseInfoItems } = baseStore
      const activityStore = useActivityStore()
      const { updateActivityTime } = activityStore

      const activeEvents = extractActiveEvents(res.data.event_data)
      const newMenuData = generateMenuData(initMenuItems, activeEvents)
      console.log('newMenuData: ', newMenuData)
      if (!newMenuData || newMenuData.length === 0) {
        showToast('网络连接异常，请稍后重试')
        return
      }
      // 跳转到第一个活动页面：
      // - 进入首页 /
      // - 活动未开启

      if (
        newMenuData.length > 0 &&
        (to.path === '/' || !hasMenuItem(newMenuData, to))
      ) {
        console.log('初始 router replace')
        void router.replace({ name: newMenuData[0].routeName })
      }

      // 活动时间
      const newActivityTime = activeEvents
        .filter((item) => item.startTime && item.endTime)
        .reduce<ActivityTime>((acc, cur) => {
          acc[cur.activity] = formatDate(cur.startTime, cur.endTime)
          return acc
        }, {})

      // 更新 store 存储
      if (res.data?.current_time) {
        updateBaseInfoItems({ currentTime: res.data.current_time })
      }
      updateActivityTime(newActivityTime)
      updateMenuData(newMenuData)

      // fix: 首次请求完菜单信息之后更新红点状态，路由拦截时数据还是初始数据
      const module = to.meta.module

      if (module && typeof module === 'string') {
        menuStore.updatedMenuDataByRoute(module)
      }
    })
    .catch((error) => {
      console.log('router index getPlayerMissionData', error)
      showToast(error.message)
    })
}

// 格式化日期
function formatDate(startTime: number, endTime: number): string {
  const start = dayjs.unix(startTime)
  const end = dayjs.unix(endTime)
  return `${start.format('M.D')}-${end.format('M.D')}`
}

export default router
