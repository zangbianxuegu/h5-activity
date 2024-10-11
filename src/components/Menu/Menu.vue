<template>
  <div>
    <div v-for="item in computedMenuData" :key="item.label">
      <div
        :class="[
          'nav-item flex flex-row items-center text-center',
          'hover:cursor-pointer',
          {
            'nav-item-main': isMainNavItem(item),
            'nav-item--active': isMenuItemActive(item),
            'nav-item-main--active':
              isMenuItemActive(item) && isMainNavItem(item),
            'nav-item--new': item.isNew || item.hasUnclaimedReward,
          },
        ]"
        @click="handleNav(item)"
      >
        <div class="icon-container">
          <img
            class="nav-icon"
            :class="getNavIconClass(item)"
            :src="handleMenuIcon(item)"
            alt="star"
          />
        </div>
        <span
          v-html="item.label.replace(' ', '<br/>')"
          class="nav-text text-left"
          :class="getNavTextClass(item)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { type MenuItem } from '@/types'
import {
  FRIENDSHIP_WEEK_2024_LIST,
  MAIN_ACTIVITY_LIST,
  RETURN_BUFF_LIST,
} from '@/constants'
import { useMenuStore } from '@/stores/menu'

const router = useRouter()
const route = useRoute()

// 获取全局菜单数据
const menuStore = useMenuStore()
const menuData = computed(() => menuStore.menuData)
// 根据子菜单状态重新计算菜单数据
const computedMenuData = computed<MenuItem[]>(() => {
  return menuData.value.map((menuItem) => {
    if (menuItem.children && menuItem.children.length > 0) {
      const isNew = menuItem.children.some((child) => child.isNew)
      const hasUnclaimedReward = menuItem.children.some(
        (child) => child.hasUnclaimedReward,
      )
      return {
        ...menuItem,
        isNew,
        hasUnclaimedReward,
      }
    }
    return menuItem
  })
})

// 判断当前菜单是否选中 isActive
function isMenuItemActive(item: MenuItem): boolean {
  const module = route?.meta?.module
  if (module && typeof module === 'string') {
    return (
      item.value === module ||
      (FRIENDSHIP_WEEK_2024_LIST.includes(item.value) &&
        module === 'activitycenter_week_friendship_2024') || // 有友节周任务
      (item.value === 'return_buff' && RETURN_BUFF_LIST.includes(module)) // 回流页面
    )
  }
  return false
}

function isMainNavItem(item: MenuItem): boolean {
  return MAIN_ACTIVITY_LIST.includes(item.value)
}

// 菜单点击事件
function handleNav(curItem: MenuItem): void {
  if (isMenuItemActive(curItem)) {
    return
  }
  void router.push({ name: curItem.routeName }).catch((err) => {
    console.error('Failed to navigate: ', err)
  })
}

// 菜单导航 icon
function handleMenuIcon(curItem: MenuItem): string {
  const defaultIcon = new URL(
    '../../assets/images/common/nav-icon.png',
    import.meta.url,
  ).href
  const activitySanrio2024 = new URL(
    '../../assets/images/common/nav-icon-sanrio.png',
    import.meta.url,
  ).href
  const activitycenterPosterAnniversary2024 = new URL(
    '../../assets/images/common/nav-icon-cake.png',
    import.meta.url,
  ).href
  const activitycenterAnniversaryVisit2024 = new URL(
    '../../assets/images/common/nav-icon-small-cake.png',
    import.meta.url,
  ).href
  const activitycenterFriendship2024 = new URL(
    '../../assets/images/common/nav-icon-sunflower.png',
    import.meta.url,
  ).href
  const activitycenterSeason24Reserve = new URL(
    '../../assets/images/common/nav-icon-moomin.png',
    import.meta.url,
  ).href
  const menuIconMap: Record<string, string> = {
    activity_sanrio_2024: activitySanrio2024,
    activitycenter_poster_anniversary_2024: activitycenterPosterAnniversary2024,
    activitycenter_anniversary_visit_2024: activitycenterAnniversaryVisit2024,
    activitycenter_friendship_2024: activitycenterFriendship2024,
    activitycenter_season24_reserve: activitycenterSeason24Reserve,
  }
  let key = curItem.value
  if (key.includes('friendship_2024')) {
    key = 'activitycenter_friendship_2024'
  }
  return menuIconMap[key] || defaultIcon
}

function getNavIconClass(curItem: MenuItem): string[] {
  const navIconPrefix = 'nav-icon'
  const menuIconMap: Record<string, string> = {
    activity_sanrio_2024: `${navIconPrefix}-sanrio`,
    activitycenter_poster_anniversary_2024: `${navIconPrefix}-poster-anniversary-2024`,
    activitycenter_anniversary_visit_2024: `${navIconPrefix}-anniversary-visit-2024`,
    activitycenter_friendship_2024: `${navIconPrefix}-friendship-2024`,
    activitycenter_season24_reserve: `${navIconPrefix}-season24-reserve`,
  }
  let key = curItem.value
  if (key.includes('friendship_2024')) {
    key = 'activitycenter_friendship_2024'
  }
  return menuIconMap[key] ? [menuIconMap[key]] : []
}

function getNavTextClass(curItem: MenuItem): string[] {
  const navTextPrefix = 'nav-text'
  const menuTextMap: Record<string, string> = {
    activity_sanrio_2024: `${navTextPrefix}-sanrio`,
    activitycenter_tournament_of_triumph_1: `${navTextPrefix}-tournament1`,
    activitycenter_Halloweentreasure_2024: `${navTextPrefix}-halloweentreasure`,
  }
  return menuTextMap[curItem.value] ? [menuTextMap[curItem.value]] : []
}
</script>

<style scoped>
.nav-item {
  position: relative;
  width: 460px;
  height: 200px;
  /* font-size: 16px; px-to-viewport-ignore */
  font-size: 40px;
  /* font-size: max(40px, 1rem); */
  color: rgba(255, 255, 255, 0.6);

  &--active {
    color: #fff7b0;
    font-weight: 500;
    text-shadow: 0 0 6px;
    background-image: url('@/assets/images/common/nav-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }

  &--new {
    &::after {
      position: absolute;
      right: 60px;
      top: 60px;
      display: block;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgb(184, 25, 26);
      animation: pulse 1.5s infinite;
    }
  }

  &-main {
    color: #3b8395;

    &--active {
      color: #66e8ff;
    }
  }
}
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.2;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.icon-container {
  width: 150px;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nav-icon {
  width: 49px;
  height: 52px;
  &-sanrio {
    width: 94px;
    height: 82px;
  }
  &-poster-anniversary-2024 {
    width: 91px;
    height: 70px;
  }
  &-anniversary-visit-2024 {
    width: 84px;
    height: 67px;
  }
  &-friendship-2024 {
    width: 73px;
    height: 89px;
  }
  &-season24-reserve {
    width: 74px;
    height: 85px;
  }
}
.nav-text {
  width: 200px;

  &-sanrio {
    width: 300px;
  }

  &-tournament1 {
    width: 240px;
  }

  &-halloweentreasure {
    width: 240px;
  }
}
</style>
