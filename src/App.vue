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
import { useRoute } from 'vue-router'

const route = useRoute()
// const router = useRouter()

// 基本信息
const baseStore = useBaseStore()
const token = computed(() => baseStore.baseInfo.token)
const { updateBaseInfoItems } = baseStore

// 菜单数据
const menuStore = useMenuStore()
const menuData = computed(() => menuStore.menuData)
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
  return Object.entries(activitiesResponse).reduce<Activity[]>(
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
}

// 生成菜单数据
function generateMenuData(
  originalMenuItems: MenuItem[],
  activeEvents: Activity[],
): MenuItem[] {
  const activeEventsMap = new Map(
    activeEvents.map((event) => [event.activity, event]),
  )
  return originalMenuItems.reduce<MenuItem[]>((activeMenu, menuItem) => {
    const event = activeEventsMap.get(menuItem.value)
    if (event || menuItem.children?.length) {
      const updatedMenuItem = { ...menuItem }
      if (event) {
        updatedMenuItem.isNew = event.isNew
        updatedMenuItem.isClaimedReward = event.isClaimedReward
        activeMenu.push(updatedMenuItem)
      }
      if (menuItem.children?.length) {
        const activeChildren = generateMenuData(menuItem.children, activeEvents)
        if (activeChildren.length) {
          updatedMenuItem.children = activeChildren
          activeMenu.push(updatedMenuItem)
        }
      }
    }
    return activeMenu
  }, [])
}

// 获取所有活动信息
function getAllEvents(): void {
  getPlayerMissionData({})
    .then((res) => {
      const activeEvents = extractActiveEvents(res.data.event_data)
      // console.log('可用的活动数组 activeEvents: ', activeEvents)
      const newMenuData = generateMenuData(menuData.value, activeEvents)
      console.log('newMenuData: ', newMenuData)
      // TODO: 会导致每次刷新页面或返回（操作工具栏），到第一个活动页面
      // if (newMenuData.length > 0) {
      //   void router.replace({ name: newMenuData[0].routeName })
      // }

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
  background-image: url('@/assets/images/bulletin/bg.jpg');
}
.nav-sprite {
  width: 443px;
  height: 107px;
  line-height: 107px;
  background-image: url('@/assets/images/bulletin/nav-sprite.png');
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
