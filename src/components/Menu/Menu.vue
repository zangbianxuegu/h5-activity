<template>
  <div>
    <div v-for="item in computedMenuData" :key="item.label">
      <div
        :class="[
          'nav-item flex flex-row items-center text-center',
          'hover:cursor-pointer',
          item.value === 'activity_sanrio_2024' ? 'nav-item-main' : '',
          isMenuItemActive(item)
            ? item.value === 'activity_sanrio_2024'
              ? 'nav-item--active nav-item-main--active'
              : 'nav-item--active'
            : '',
          item.isNew || item.isClaimedReward === false ? 'nav-item--new' : '',
        ]"
        @click="handleNav(item)"
      >
        <img
          class="nav-icon"
          :class="{ 'nav-icon-sanrio': item.value === 'activity_sanrio_2024' }"
          :src="handleMenuIcon(item)"
          alt="star"
        />
        <span
          class="nav-text text-left"
          :class="{ 'nav-text-sanrio': item.value === 'activity_sanrio_2024' }"
          >{{ item.label }}</span
        >
      </div>
    </div>
    <!-- <ul class="text-white">
      <li
        class="w-full border text-center"
        @click="
          handleResetTaskValue(
            'activity_sign_mayday_2024',
            'activity_sign_mayday_2024_m1',
            'true',
          )
        "
      >
        重置任务进度劳动节1
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetTaskValue(
            'activity_sign_mayday_2024',
            'activity_sign_mayday_2024_m2',
            'true',
          )
        "
      >
        重置任务进度劳动节2
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
        @click="
          handleResetSpriteReward(
            'activity_sign_mayday_2024',
            'activity_sign_mayday_2024_m1',
          )
        "
      >
        重置领奖数据劳动节1
      </li>
      <li
        class="w-full border text-center"
        @click="
          handleResetSpriteReward(
            'activity_sign_mayday_2024',
            'activity_sign_mayday_2024_m2',
          )
        "
      >
        重置领奖数据劳动节2
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
        @click="handleGmsResetWebRedDot('activity_sign_mayday_2024')"
      >
        重置红点劳动节
      </li>
      <li
        class="w-full border text-center"
        @click="handleGmsResetWebRedDot('activity_center_notice')"
      >
        重置红点小光快报
      </li>
    </ul> -->
  </div>
</template>

<script setup lang="ts">
// import { showToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { type MenuItem } from '@/types'
// import {
//   resetTaskValue,
//   resetSpriteReward,
//   gmsResetWebRedDot,
// } from '@/utils/request'
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
        ['activity_sign_in_2', 'activity_sign_in_3'].includes(module)) ||
      (item.value === 'activity_return_buff' &&
        [
          'activity_return_buff_reunion',
          'activity_return_buff_setout',
          'activity_return_buff_together',
        ].includes(module))
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

// 菜单导航 icon
function handleMenuIcon(curItem: MenuItem): string {
  return curItem.value === 'activity_sanrio_2024'
    ? new URL('../../assets/images/common/nav-icon-sanrio.png', import.meta.url)
        .href
    : new URL('../../assets/images/common/nav-icon.png', import.meta.url).href
}

// // 重置任务进度（包括每日签到数据）
// function handleResetTaskValue(
//   event: string,
//   task: string,
//   clearDailyValue: string,
// ): void {
//   resetTaskValue({ event, task, clearDailyValue })
//     .then(() => {
//       showToast('重置任务进度成功')
//     })
//     .catch((error) => {
//       showToast(error.message)
//     })
// }

// // 重置领奖数据
// function handleResetSpriteReward(event: string, task: string): void {
//   resetSpriteReward({ event, task })
//     .then(() => {
//       showToast('重置领奖数据成功')
//     })
//     .catch((error) => {
//       showToast(error.message)
//     })
// }

// // 重置红点
// function handleGmsResetWebRedDot(event: string): void {
//   gmsResetWebRedDot({ event })
//     .then(() => {
//       showToast('重置红点成功')
//     })
//     .catch((error) => {
//       showToast(error.message)
//     })
// }
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
.nav-icon {
  margin: 0 42px 0 43px;
  width: 49px;
  height: 52px;

  &-sanrio {
    margin: 0 20px;
    padding: 0;
    width: 94px;
    height: 82px;
  }
}
.nav-text {
  width: 180px;

  &-sanrio {
    width: 300px;
  }
}
</style>
