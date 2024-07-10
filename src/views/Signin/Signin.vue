<template>
  <div
    :class="[
      'signin flex text-white',
      isWinter ? 'signin-winter' : 'signin-summer',
    ]"
  >
    <nav class="flex items-center justify-center">
      <ul>
        <li
          v-for="item in subMenuData"
          :key="item.label"
          :class="[
            'nav-item mx-4 my-10 cursor-pointer',
            isMenuItemActive(item) ? 'nav-item--active' : '',
            item.isNew || item.hasUnclaimedReward ? 'nav-item--new' : '',
          ]"
          @click="handleNav(item)"
        >
          {{ item.label }}
        </li>
      </ul>
    </nav>
    <main class="signin-main">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { type MenuItem } from '@/types'
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
const menuData = computed(() => menuStore.menuData)
const subMenuData = computed(
  () => menuData.value.find((item) => item.value === 'signin')?.children || [],
)

const router = useRouter()
const route = useRoute()

const isWinter = ref(true)

// 判断当前菜单是否选中 isActive
function isMenuItemActive(item: MenuItem): boolean {
  const module = route?.meta?.module
  if (module && typeof module === 'string') {
    return item.value === module
  }
  return false
}

function handleNav(curItem: MenuItem): void {
  // 背景
  if (curItem.routeName === 'Winter') {
    isWinter.value = true
  } else {
    isWinter.value = false
  }

  // 路由
  void router.push({ name: curItem.routeName }).catch((err) => {
    console.error('Failed to navigate: ', err)
  })
}
</script>

<style scoped>
.signin {
  width: 2100px;
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &-winter {
    background-image: url('@/assets/images/signin/winter-bg.jpg');
  }

  &-summer {
    background-image: url('@/assets/images/signin/summer-bg.jpg');
  }
}
.nav-item {
  position: relative;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.8);

  &--active {
    color: #fff7b0;
    font-weight: 500;
    text-shadow: 0 0 6px;
  }

  &--new {
    &::after {
      position: absolute;
      right: -30px;
      top: -10px;
      display: block;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgb(184, 25, 26);
    }
  }
}
</style>
