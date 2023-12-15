<template>
  <div v-for="item in data" :key="item.label" class="">
    <div
      :class="[
        'nav-item item-center group flex w-full items-center justify-center text-center',
        'hover:cursor-pointer',
        item.active
          ? 'nav-item--active font-medium text-[#fff7b0]'
          : 'text-slate-300',
      ]"
      @click="handleNav(item)"
    >
      <span class="nav-text">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type MenuItem } from '@/types'

const router = useRouter()

defineProps({
  data: Array as PropType<MenuItem[]>,
})

const emit = defineEmits<{
  onChange: [value: any]
}>()

function handleNav(item: MenuItem): void {
  emit('onChange', { ...item, active: true })
  void router.push({ name: item.routeName })
}
</script>

<style scoped>
.nav-item {
  width: 460px;
  height: 200px;
  font-size: 40px;

  &--active {
    text-shadow: 0 0 6px;
    background-image: url('@/assets/images/bulletin/nav-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
}
.nav-text {
  width: 200px;
}
</style>
