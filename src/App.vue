<template>
  <!-- <div class="m-4 flex flex-row flex-wrap gap-4">
      <a
        class="border-b border-current font-semibold text-gray-600 no-underline"
        href="./pages/signin/index.html"
        >签到活动</a
      >
      <a
        class="border-b border-current font-semibold text-gray-600 no-underline"
        href="./pages/about/index.html"
        >关于</a
      >
      <router-link to="/test">test</router-link>
      <router-link to="/about">关于</router-link>
    </div> -->

  <div class="page flex min-h-screen bg-cover bg-center bg-no-repeat">
    <nav class="nav flex w-[460px] shrink-0 flex-col justify-between py-4">
      <div>
        <Menu :data="menuData" @on-change="onChange"></Menu>
      </div>
      <div class="nav-sprite flex">
        <a class="nav-sprite-text" href="https://game.163.com/">前往精灵>></a>
      </div>
    </nav>
    <main class="">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// window.location.href = './pages/signin/index.html'
import Menu from '@/components/Menu'
import { type MenuItem } from '@/types'

const menuData = ref<MenuItem[]>([
  {
    label: '菜单名称1',
    value: 'activity_1',
    routeName: 'Page1',
    active: true,
  },
  {
    label: '菜单名称2',
    value: 'subject',
    routeName: 'Page2',
    active: false,
  },
  {
    label: '小光快报',
    value: 'bulletin',
    routeName: 'Bulletin',
    active: false,
  },
])

function onChange(newItem: MenuItem): void {
  menuData.value.forEach((item) => {
    item.active = item.value === newItem.value
  })

  console.log('menuData: ', menuData)
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
