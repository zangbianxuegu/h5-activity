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
    <nav class="w-[460px] shrink-0 py-4">
      <Menu :data="menuData" @on-change="onChange"></Menu>
    </nav>
    <main class="">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
// window.location.href = './pages/signin/index.html'
import Menu from '@/components/Menu'

const menuData = [
  {
    label: '菜单名称1',
    value: 'activity_1',
    routeName: 'Page1',
    active: false,
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
    active: true,
  },
]

function onChange(val: any): void {
  console.log('val: ', val)
  menuData.forEach((item) => {
    item.active = false
    if (item.value === val.value) {
      item.active = true
    }
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
</style>
