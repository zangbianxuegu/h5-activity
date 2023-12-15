<template>
  <div class="flex text-white">
    <nav class="w-40 shrink-0 border-r py-4">
      <Menu :data="menuData"></Menu>
    </nav>
    <main class="p-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Menu from '@/components/Menu'

const menuData = [
  {
    label: '二级菜单名称1',
    value: 'activity_2',
    routeName: 'SubPage1',
    active: false,
  },
  {
    label: '二级菜单名称2',
    value: 'activity_3',
    routeName: 'SubPage2',
    active: false,
  },
]
</script>

<style scoped></style>
