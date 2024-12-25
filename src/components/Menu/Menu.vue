<template>
  <div class="nav-list">
    <div
      v-for="item in computedMenuData"
      :key="item.label"
      :class="[
        'nav-item relative flex flex-row items-center bg-center bg-no-repeat text-center',
        'hover:cursor-pointer',
        `nav-item--${item.value.substring(15)}`,
        {
          'nav-item-main': isMainNavItem(item),
          'nav-item--active': isMenuItemActive(item),
          'nav-item-main--active':
            isMenuItemActive(item) && isMainNavItem(item),
          'nav-item--new': item.isNew && !item.hasUnclaimedReward,
          'nav-item--reward': item.hasUnclaimedReward,
        },
      ]"
      @click="handleNav(item)"
    >
      <div
        v-show="isMenuItemActive(item)"
        class="active-star absolute bg-contain bg-no-repeat"
      >
        <span class="sr-only">active star</span>
      </div>
      <span
        v-html="item.label.replace(' ', '<br/>')"
        class="nav-text text-center"
        :class="getNavTextClass(item)"
      ></span>
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

function getNavTextClass(curItem: MenuItem): string[] {
  const navTextPrefix = 'nav-text'
  const menuTextMap: Record<string, string> = {
    activity_sanrio_2024: `${navTextPrefix}-sanrio`,
    activitycenter_tournament_of_triumph_1: `${navTextPrefix}-tournament1`,
    activitycenter_Halloweentreasure_2024: `${navTextPrefix}-halloweentreasure`,
    activitycenter_icefestival2025: `${navTextPrefix}-icefestival2025`,
  }
  return menuTextMap[curItem.value] ? [menuTextMap[curItem.value]] : []
}
</script>

<style scoped>
.nav-list {
  border-left: 3px solid rgba(255, 255, 255, 0.2);
}
.nav-item {
  margin: 35px 0 35px 20px;
  border: 8px solid transparent;
  border-radius: 35px;
  width: 323px;
  height: 159px;
  font-size: 40px;
  color: rgba(255, 255, 255, 0.6);
  background-size: 307px 143px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 35px;
    pointer-events: none;
  }

  &--active {
    color: #fffedb;
    font-weight: 500;
    text-shadow:
      0 0 8px rgba(255, 235, 125, 0.27),
      0 0 4px rgba(255, 235, 125, 0.27);

    &::before {
      background: none;
    }
  }

  &--new {
    &::after {
      position: absolute;
      right: -30px;
      top: -20px;
      display: block;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgb(184, 25, 26);
      animation: pulse 1.5s infinite;
    }
  }

  &--reward {
    &::after {
      position: absolute;
      right: -40px;
      top: -30px;
      display: block;
      content: '';
      width: 42px;
      height: 41px;
      background-image: url('@/assets/images/common/gift.png');
      background-size: contain;
    }
  }
  /* 
    在此处添加不同活动的菜单背景图
    命名为活动事件名，例如 activitycenter_dayofdesign01_post_main，取：dayofdesign01_post_main
  */
  /* 绘梦节-主页面 */
  &--dayofdesign01_post_main {
    background-image: url('@/assets/images/common/menu/dayofdesign01-main.png');
  }
  /* 绘梦节-活动会场 */
  &--dayofdesign01_post_exhibit {
    background-image: url('@/assets/images/common/menu/dayofdesign01-exhibit.png');
  }
}
.active-star {
  left: -101px;
  top: 2px;
  width: 207px;
  height: 138px;
  background-image: url('@/assets/images/common/menu/active-star.png');
}
.nav-text {
  margin-left: 110px;
  width: 200px;
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
</style>
