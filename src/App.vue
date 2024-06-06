<template>
  <div class="page flex min-h-screen bg-cover bg-center bg-no-repeat">
    <van-overlay :show="isLoading" class="flex items-center justify-center">
      <van-loading />
    </van-overlay>
    <nav
      class="nav flex h-screen w-[460px] shrink-0 flex-col justify-between py-4"
    >
      <div class="menu overflow-y-scroll">
        <Menu></Menu>
      </div>
      <div>
        <a
          v-if="isGameDev || isGame"
          class="nav-debug mb-4 flex w-full justify-center py-2"
          href="https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game_dev/pages/debug/index.html"
          >前往调试</a
        >
        <div class="nav-sprite flex">
          <!-- <a
            class="nav-sprite-text"
            :href="`https://dev.gmsdk.gameyw.netease.com/sprite/index?token=${token}`"
            >前往精灵>></a
          > -->
          <div class="nav-sprite-text" @click="handleToSprite">前往精灵>></div>
        </div>
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
    label: '剪刀石头布！',
    value: 'activity_childrens_day_2024',
    routeName: 'ChildrensDay2024',
    isNew: false,
    isClaimedReward: true,
    children: [],
  },
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
    label: '击鼓行舟 粽香十里',
    value: 'activity_dragonboat_2024',
    routeName: 'DragonBoat2024',
    isNew: false,
    isClaimedReward: true,
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
    label: '欢聚周年 畅享派对',
    value: 'activitycenter_poster_anniversary_2024',
    routeName: 'PosterAnniversary2024',
    isNew: false,
    isClaimedReward: true,
  },
  {
    label: '成为派对新星吧！',
    value: 'activity_anniversary_warmup_2024',
    routeName: 'AnniversaryWarmup2024',
    isNew: false,
    isClaimedReward: true,
  },
  {
    label: '巡光嘉年华',
    value: 'activity_anniversary_visit_2024',
    routeName: 'AnniversaryVisit2024',
    isNew: false,
    isClaimedReward: true,
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
const prodUrl = 'https://sky.h5.163.com/game/'
const isLocal = ref(window.location.href.includes(localUrl))
const isGame = ref(window.location.href.includes(gameUrl))
const isGameDev = ref(window.location.href.includes(gameDevUrl))
const isProd = ref(window.location.href.includes(prodUrl))
const jinglingUrl = isProd.value
  ? 'https://gmsdk.gameyw.netease.com/sprite/index'
  : 'https://dev.gmsdk.gameyw.netease.com/sprite/index'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

// 基本信息
const baseStore = useBaseStore()
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
    // console.error(error)
  }
})

let tokenParams: {
  game_uid: string
  uid: string
  map: string
  return_buff: string
  os: string
} = {
  game_uid: '',
  uid: '',
  map: '',
  return_buff: '',
  os: '',
}

// 获取基本信息
function getBaseInfo(): void {
  getUserInfo()
    .then((res) => {
      const channel = res.channel
      const appChannel = res.appChannel
      const returnBuff = res.return_buff
      updateBaseInfoItems({ channel })
      updateBaseInfoItems({ appChannel })
      updateBaseInfoItems({ returnBuff })
      tokenParams = {
        game_uid: res.game_uid,
        uid: res.uid,
        map: res.map,
        return_buff: res.return_buff,
        os: res.os,
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 前往精灵
function handleToSprite(): void {
  getJinglingToken(tokenParams)
    .then((res) => {
      const val = res.data.token
      window.location.href = `${jinglingUrl}?token=${val}`
    })
    .catch((error) => {
      showToast(error.message)
    })
}

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
  const returnBuff = baseStore.baseInfo.returnBuff
  if (returnBuff === 'true') {
    res.unshift({
      activity: 'activity_return_buff',
      startTime: 9999999999,
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

watch(
  () => route.name,
  (newVal, oldVal) => {
    console.log('old route name: ', oldVal)
    console.log('new route name: ', newVal)
    if (newVal === 'Home' && oldVal === undefined) {
      const menuData = computed(() => menuStore.menuData)
      if (menuData.value && menuData.value.length > 0) {
        console.log('watch 开始 router replace')
        void router.replace({ name: menuData.value[0].routeName })
      }
    }
  },
)

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

// 获取所有活动信息
function getAllEvents(): void {
  isLoading.value = true
  getPlayerMissionData({})
    .then((res) => {
      isLoading.value = false
      const activeEvents = extractActiveEvents(res.data.event_data)
      console.log('activeEvents', activeEvents)

      const newMenuData = generateMenuData(initMenuItems, activeEvents)
      console.log('newMenuData: ', newMenuData)
      if (!newMenuData || newMenuData.length === 0) {
        showToast('网络连接异常，请稍后重试')
        return
      }
      // 跳转到第一个活动页面：
      // - 进入首页 /
      // - 活动未开启

      // fix: 有可能 route.path === '/'，而 route.name === undefined
      // 在修改活动页面比如Nature2024.vue，然后刷新页面时发生（MuMu模拟器）
      // 注意 route 作为对象不能实时的反应状态信息
      // console.log('route: ', route)
      // console.log('route.name: ', route.name)
      // console.log('route.path: ', route.path)
      if (
        newMenuData.length > 0 &&
        ((route.path === '/' && route.name === 'Home') ||
          (route.name !== undefined && !hasMenuItem(newMenuData, route)))
      ) {
        console.log('开始 router replace')
        void router.replace({ name: newMenuData[0].routeName })
      }

      // 活动时间
      const newActivityTime = activeEvents
        .filter((item) => item.startTime && item.endTime)
        .reduce<ActivityTime>((acc, cur) => {
          acc[cur.activity] = {
            startTime: cur.startTime,
            endTime: cur.endTime,
          }
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
      isLoading.value = false
      showToast(error.message)
    })
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
.nav-debug {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
