<template>
  <div>
    <div v-for="item in computedMenuData" :key="item.label" class="">
      <div
        :class="[
          'nav-item item-center group flex items-center justify-center text-center',
          'hover:cursor-pointer',
          isMenuItemActive(item) ? 'nav-item--active' : '',
          item.isNew || item.isClaimedReward === false ? 'nav-item--new' : '',
        ]"
        @click="handleNav(item)"
      >
        <img
          class="nav-icon"
          src="@/assets/images/bulletin/nav-icon.png"
          alt="star"
        />
        <span class="nav-text">{{ item.label }}</span>
      </div>
    </div>
    <ul class="text-white">
      <li
        class="w-full border text-center"
        @click="
          handleResetTaskValue('activity_sign_in_1', 'activity_sign_in_m1')
        "
      >
        重置任务进度1
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetTaskValue('activity_sign_in_2', 'activity_sign_in_m2')
        "
      >
        重置任务进度2
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetTaskValue('activity_sign_in_3', 'activity_sign_in_m3')
        "
      >
        重置任务进度3
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetSpriteReward('activity_sign_in_1', 'activity_sign_in_m1')
        "
      >
        重置领奖数据1
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetSpriteReward('activity_sign_in_2', 'activity_sign_in_m2')
        "
      >
        重置领奖数据2
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetSpriteReward('activity_sign_in_3', 'activity_sign_in_m3')
        "
      >
        重置领奖数据3
      </li>
      <li
        class="w-full border text-center"
        @click="handleGmsResetWebRedDot('activity_sign_in_1')"
      >
        重置红点1
      </li>
      <li
        class="w-full border text-center"
        @click="handleGmsResetWebRedDot('activity_sign_in_2')"
      >
        重置红点2
      </li>
      <li
        class="w-full border text-center"
        @click="handleGmsResetWebRedDot('activity_sign_in_3')"
      >
        重置红点3
      </li>
      <li
        class="w-full border text-center"
        @click="handleGmsResetWebRedDot('activity_center_notice')"
      >
        重置红点小光快报
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { type MenuItem } from '@/types'
import {
  resetTaskValue,
  resetSpriteReward,
  gmsResetWebRedDot,
} from '@/utils/request'
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
      const isClaimedReward = menuItem.children.every(
        (child) => child.isClaimedReward,
      )
      return {
        ...menuItem,
        isNew,
        isClaimedReward,
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
      (item.value === 'signin' &&
        ['activity_sign_in_2', 'activity_sign_in_3'].includes(module))
    )
  }
  return false
}

// 菜单点击事件
function handleNav(curItem: MenuItem): void {
  void router.push({ name: curItem.routeName }).catch((err) => {
    console.error('Failed to navigate: ', err)
  })
}

// 重置任务进度（包括每日签到数据）
function handleResetTaskValue(event: string, task: string): void {
  resetTaskValue({ event, task })
    .then(() => {
      showToast('重置任务进度成功')
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 重置领奖数据
function handleResetSpriteReward(event: string, task: string): void {
  resetSpriteReward({ event, task })
    .then(() => {
      showToast('重置领奖数据成功')
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 重置红点
function handleGmsResetWebRedDot(event: string): void {
  gmsResetWebRedDot({ event })
    .then(() => {
      showToast('重置红点成功')
    })
    .catch((error) => {
      showToast(error.message)
    })
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
    background-image: url('@/assets/images/bulletin/nav-bg.png');
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
    }
  }
}
.nav-text {
  width: 160px;
}
.nav-icon {
  margin-right: 60px;
  width: 49px;
  height: 52px;
}
</style>
@/stores/menu
