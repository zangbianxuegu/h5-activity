<template>
  <div v-for="item in data" :key="item.label" class="">
    <div
      :class="[
        'nav-item item-center group flex items-center justify-center text-center',
        'hover:cursor-pointer',
        item.active ? 'nav-item--active' : '',
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
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { type MenuItem } from '@/types'

const router = useRouter()

defineProps({
  data: Array<MenuItem>,
})

const emit = defineEmits<(event: 'onChange', newItem: MenuItem) => void>()

function handleNav(item: MenuItem): void {
  emit('onChange', item)
  void router.push({ name: item.routeName }).catch((err) => {
    console.error('Failed to navigate: ', err)
  })
}
</script>

<style scoped>
.nav-item {
  width: 460px;
  height: 200px;
  /* font-size: 16px; px-to-viewport-ignore */
  /* font-size: 40px; */
  font-size: max(40px, 1rem);
  color: rgba(255, 255, 255, 0.6);

  &--active {
    color: #fff7b0;
    font-weight: 500;
    text-shadow: 0 0 6px;
    background-image: url('@/assets/images/bulletin/nav-bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
}
.nav-icon {
  margin-right: 60px;
  width: 49px;
  height: 52px;
}
</style>
