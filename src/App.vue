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
          v-if="isGameDev || isGame || isGameDev2"
          class="nav-debug mb-4 flex w-full justify-center py-2"
          href="https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game_dev/pages/debug/index.html"
          >前往调试</a
        >
        <a
          href="http://10.227.199.103:5173/pages/debug/index.html"
          class="nav-debug mb-4 flex w-full justify-center py-2"
          >debug</a
        >
        <a
          href="http://10.227.199.103:5173/#/hmj-contribute"
          class="nav-debug mb-4 flex w-full justify-center py-2"
          >我要投稿</a
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
      v-if="isGameDev2"
      class="fixed right-0 top-0 z-10 bg-yellow-600 px-1 text-sm text-white"
    >
      game_dev2
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
import type {
  MenuItem,
  Activity,
  ActivityTime,
  TokenParams,
  UserInfo,
} from '@/types'
import { HALLOWEEN_2024_LIST, MENU_ITEMS } from '@/constants'
import { getPlayerMissionData } from '@/utils/request'
import { numberToBinaryArray } from '@/utils/utils'
import { getUserInfo, getJinglingToken } from '@/apis/base'
import { useBaseStore } from '@/stores/base'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/activity'
import { useRoute, useRouter } from 'vue-router'
import { getErrorCustom, isErrorCustom } from './utils/error'
import { useEnvironment } from '@/composables/useEnvironment'

const { isLocal, isGameDev, isGame, isProd, isGameDev2 } = useEnvironment()
const jinglingUrl = isProd.value
  ? 'https://gmsdk.gameyw.netease.com/sprite/index'
  : 'https://dev.gmsdk.gameyw.netease.com/sprite/index'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)

// 基本信息
const baseStore = useBaseStore()
const { updateBaseInfoItems } = baseStore
const currentChannel = computed(() => baseStore.baseInfo.channel)

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
  has_unclaimed_reward: number
  active: number
}
type Activities = Record<string, ActivityData>

onMounted(async () => {
  try {
    await getBaseInfo()
    getAllEvents()
  } catch (error) {
    // console.error(error)
  }
})

let tokenParams: TokenParams = {
  game_uid: '',
  uid: '',
  map: '',
  return_buff: '',
  os: '',
  source: 'normal',
}

// 获取基本信息
async function getBaseInfo(): Promise<void> {
  try {
    const res: UserInfo = await getUserInfo()
    const channel = res.channel
    const appChannel = res.appChannel
    const returnBuff = res.return_buff
    const gameUid = res.game_uid
    updateBaseInfoItems({ channel })
    updateBaseInfoItems({ appChannel })
    updateBaseInfoItems({ returnBuff })
    updateBaseInfoItems({ gameUid })
    tokenParams = {
      ...tokenParams,
      game_uid: res.game_uid,
      uid: res.uid,
      map: res.map,
      return_buff: res.return_buff,
      os: res.os,
    }
  } catch (error) {
    showToast((error as Error).message)
  }
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

/**
 * @description 调整2024万圣节活动
 * @param arr 菜单列表
 * @param startTime 活动开始时间
 */
function adjustActivitySort(arr: Activity[], startTime: number): Activity[] {
  // 万圣节活动
  const predefinedActivities = HALLOWEEN_2024_LIST.map((activityName) =>
    arr.find((activity) => activity.activity === activityName),
  ).filter((activity) => activity !== undefined) as Activity[]

  // 其余的活动
  const otherActivities = arr.filter(
    (activity) => !HALLOWEEN_2024_LIST.includes(activity.activity),
  )

  // 合并
  return [
    ...otherActivities.filter(
      (activity) => activity.startTime >= (startTime || 0),
    ),
    ...predefinedActivities,
    ...otherActivities.filter(
      (activity) => activity.startTime < (startTime || 0),
    ),
  ]
}

// 抽取有效的活动信息
function extractActiveEvents(activitiesResponse: Activities): Activity[] {
  let halloween2024StartTime: number = 0
  let res = Object.entries(activitiesResponse).reduce<Activity[]>(
    (activeEvents, [activityName, activityInfo]) => {
      if (activityInfo.active === 1) {
        const activity = {
          activity: activityName,
          startTime: activityInfo.start_time,
          endTime: activityInfo.end_time,
          isNew: activityInfo.is_new === 1,
          hasUnclaimedReward:
            activityName === 'activity_center_notice'
              ? false
              : activityInfo.has_unclaimed_reward > 0,
        }
        if (activityName === 'activitycenter_Halloweentask_2024') {
          halloween2024StartTime = activity.startTime
        }
        // 回流菜单数据处理
        if (activityName === 'return_buff') {
          const hasUnclaimedRewardArr = numberToBinaryArray(
            activityInfo.has_unclaimed_reward,
          )
          MENU_ITEMS.forEach((menuItem) => {
            if (menuItem.routeName === 'ReturnBuff') {
              if (menuItem.children?.length) {
                menuItem.children = menuItem.children.map((item, index) => {
                  return {
                    ...item,
                    hasUnclaimedReward: hasUnclaimedRewardArr[index] === 1,
                  }
                })
              }
            }
          })
        }
        activeEvents.push(activity)
      }
      return activeEvents
    },
    [],
  )
  // 按照 startTime 排序
  res.sort((a, b) => b.startTime - a.startTime)
  // 测试绘梦节活动会场
  res.push({
    activity: 'activitycenter_dayofdesign01_post_exhibit',
    startTime: 0,
    endTime: 0,
    isNew: false,
    hasUnclaimedReward: false,
  })
  // 调整2024万圣节活动排序
  res = adjustActivitySort(res, halloween2024StartTime)
  // 最后调整回流、小光快报的位置
  return res.sort((a, b) => {
    if (a.activity === 'return_buff') return -1
    if (b.activity === 'return_buff') return 1
    if (a.activity === 'activity_center_notice') return 1
    if (b.activity === 'activity_center_notice') return -1
    return 0 // 保持现有顺序不变
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
        updatedMenuItem.hasUnclaimedReward = event.hasUnclaimedReward
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
  console.log('currentChannel: ', currentChannel.value)
  getPlayerMissionData({ channel: currentChannel.value })
    .then((res) => {
      isLoading.value = false
      const activeEvents = extractActiveEvents(res.data.event_data)
      console.log('activeEvents', activeEvents)

      const newMenuData = generateMenuData(MENU_ITEMS, activeEvents)
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
      const errorMessage = error.message
      if (isErrorCustom(errorMessage)) {
        // 自定义异常的处理的实例化获取和输出
        const errorCustom = getErrorCustom(errorMessage)
        showToast(errorCustom.getErrorMessage())
      } else {
        showToast(error.message)
      }
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
