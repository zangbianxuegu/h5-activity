<template>
  <div class="page flex min-h-screen bg-cover bg-center bg-no-repeat">
    <nav
      class="nav flex h-screen w-[460px] shrink-0 flex-col justify-between py-4"
    >
      <div class="menu overflow-y-scroll">
        <Menu></Menu>
      </div>
      <div class="nav-sprite flex">
        <a
          class="nav-sprite-text"
          :href="`https://dev.gmsdk.gameyw.netease.com/sprite/index?token=${token}`"
          >前往精灵>></a
        >
      </div>
    </nav>
    <main class="flex items-center justify-center">
      <!-- <router-view v-slot="{ Component }">
        <Transition name="fade-in" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view> -->
      <router-view></router-view>
    </main>
    <div
      v-if="isLocal"
      class="fixed right-0 top-0 z-10 bg-blue-600 px-1 text-sm text-white"
    >
      本地地址
    </div>
    <div
      v-if="isGameDev"
      class="fixed right-0 top-0 z-10 bg-yellow-600 px-1 text-sm text-white"
    >
      game_dev
    </div>
    <div
      v-if="isGame"
      class="fixed right-0 top-0 z-10 bg-green-600 px-1 text-sm text-white"
    >
      game
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { showToast } from 'vant'
import Menu from '@/components/Menu'
import { type MenuItem, type Activity, type ActivityTime } from '@/types'
import {
  getPlayerMissionData,
  getUserInfo,
  getJinglingToken,
} from '@/utils/request'
import { useBaseStore } from '@/stores/base'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import { useRoute, useRouter } from 'vue-router'

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
    label: '小光快报',
    value: 'activity_center_notice',
    routeName: 'Bulletin',
    isNew: false,
    isClaimedReward: true,
  },
]

const localUrl = 'https://10.227.198.175:5173'
const gameUrl =
  'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game/index.html'
const gameDevUrl =
  'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game_dev/index.html'
const isLocal = ref(window.location.href.includes(localUrl))
const isGame = ref(window.location.href.includes(gameUrl))
const isGameDev = ref(window.location.href.includes(gameDevUrl))

const route = useRoute()
const router = useRouter()

// 基本信息
const baseStore = useBaseStore()
const token = computed(() => baseStore.baseInfo.token)
const { updateBaseInfoItems } = baseStore

// 菜单数据
const menuStore = useMenuStore()
const { updateMenuData } = menuStore

// 活动信息
const activityStore = useActivityStore()
const { updateActivityTime } = activityStore

// 接口数据类型
interface ActivityData {
  start_time: number
  end_time: number
  is_new: number
  is_claimed_reward: number
  active: number
}
type Activities = Record<string, ActivityData>

onMounted(() => {
  try {
    getAllEvents()
    getBaseInfo()
  } catch (error) {
    console.error(error)
  }
})

// 获取基本信息
function getBaseInfo(): void {
  getUserInfo()
    .then((res) => {
      console.log('App 页面获取基本信息 res: ', res)
      const channel = res.channel
      const appChannel = res.appChannel
      updateBaseInfoItems({ channel })
      updateBaseInfoItems({ appChannel })
      const tokenParams = {
        game_uid: res.game_uid,
        uid: res.uid,
        map: res.map,
        return_buff: res.return_buff,
        os: res.os,
      }
      return getJinglingToken(tokenParams)
    })
    .then((res) => {
      const token = res.data.token
      console.log('App 页面获取 token: ', token)
      updateBaseInfoItems({ token })
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 抽取有效的活动信息
function extractActiveEvents(activitiesResponse: Activities): Activity[] {
  return Object.entries(activitiesResponse)
    .reduce<Activity[]>((activeEvents, [activityName, activityInfo]) => {
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
    }, [])
    .sort((a, b) => {
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
function getAllEvents(): void {
  getPlayerMissionData({})
    .then((res) => {
      const activeEvents = extractActiveEvents(res.data.event_data)
      console.log('activeEvents: ', activeEvents)
      const newMenuData = generateMenuData(initMenuItems, activeEvents)
      console.log('newMenuData: ', newMenuData)
      // 跳转到第一个活动页面
      // - 进入首页
      // - 活动未开启
      if (
        newMenuData.length > 0 &&
        (route.path === '/' ||
          !newMenuData.find((item) => item.routeName === route.name))
      ) {
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
      const module = route.meta.module

      if (module && typeof module === 'string') {
        menuStore.updatedMenuDataByRoute(module)
      }
    })
    .catch((error) => {
      console.log('app.vue', error)

      showToast(error.message)
    })
}

// 格式化日期
function formatDate(startTime: number, endTime: number): string {
  const start = dayjs.unix(startTime)
  const end = dayjs.unix(endTime)
  return `${start.format('M.D')}-${end.format('M.D')}`
}
</script>

<style scoped>
.menu::-webkit-scrollbar {
  display: none;
}
.page {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/common/bg.jpg');
}
.nav-sprite {
  width: 443px;
  height: 107px;
  line-height: 107px;
  background-image: url('@/assets/images/common/nav-sprite.png');
  background-size: contain;
  background-position: center;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.6);

  &-text {
    padding-left: 140px;
    width: 100%;
    height: 100%;
  }
}
</style>
