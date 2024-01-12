<template>
  <div class="page flex min-h-screen bg-cover bg-center bg-no-repeat">
    <nav class="nav flex w-[460px] shrink-0 flex-col justify-between py-4">
      <div>
        <Menu></Menu>
      </div>
      <div class="nav-sprite flex">
        <a
          class="nav-sprite-text"
          href="https://dev.gmsdk.gameyw.netease.com/sprite/index?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDQ4ODQ4NjgsInV1aWQiOiJtYTc1LmJjNGIzYjVmYTA1YjJjZDYzMjNjZmJlMmE2MTQwODYxIn0.hQNhfb9Axnabb9SpeIGt5ETrYL0_FLThU1gKMNX71tA"
          >前往精灵>></a
        >
      </div>
    </nav>
    <main class="">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Menu from '@/components/Menu'
import { type MenuItem } from '@/types'
import { getPlayerMissionData } from '@/utils/request'
import { useMenuStore } from '@/stores/menuStore'
import { useRoute } from 'vue-router'

const route = useRoute()

const menuStore = useMenuStore()
const menuData = computed(() => menuStore.menuData)

// 活动数组类型
interface Activity {
  activity: string
  isNew: boolean
  isClaimedReward: boolean
}

// 接口数据类型
interface ActivityData {
  start_time: number
  is_new: number
  is_claimed_reward: number
  end_time: number
  active: number
}
type Activities = Record<string, ActivityData>

onMounted(() => {
  try {
    getAllEvents()
  } catch (error) {
    console.error(error)
  }
})

// 抽取有效的活动信息
function extractActiveEvents(activitiesResponse: Activities): Activity[] {
  return Object.entries(activitiesResponse).reduce<Activity[]>(
    (activeEvents, [activityName, activityInfo]) => {
      if (activityInfo.active === 1) {
        activeEvents.push({
          activity: activityName,
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
    if (event || menuItem.children) {
      const updatedMenuItem = { ...menuItem }
      if (event) {
        updatedMenuItem.isNew = event.isNew
        updatedMenuItem.isClaimedReward = event.isClaimedReward
      }
      if (menuItem.children) {
        const activeChildren = generateMenuData(menuItem.children, activeEvents)
        if (activeChildren.length) {
          updatedMenuItem.children = activeChildren
        } else {
          delete updatedMenuItem.children
        }
      }
      activeMenu.push(updatedMenuItem)
    }
    return activeMenu
  }, [])
}

// 获取所有活动信息
function getAllEvents(): void {
  getPlayerMissionData({}, function (res) {
    console.log('所有活动 res: ', res)

    const activeEvents = extractActiveEvents(res)
    console.log('可用的活动数组 activeEvents: ', activeEvents)
    const newMenuData = generateMenuData(menuData.value, activeEvents)
    console.log('最终的菜单数据 newMenuData: ', newMenuData)

    // 更新 store 存储
    menuStore.updateMenuData(newMenuData)

    // fix: 首次请求完菜单信息之后更新红点状态，路由拦截时数据还是初始数据
    const module = route.meta.module

    if (module && typeof module === 'string') {
      menuStore.updatedMenuDataByRoute(module)
    }
  })
}
</script>

<style scoped>
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
