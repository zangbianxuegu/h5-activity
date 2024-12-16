<template>
  <div class="iframe-container absolute flex">
    <iframe :src="url" frameborder="0" class="absolute h-full w-full"></iframe>
  </div>
</template>

<script setup>
import { startListener, stopListener } from '@/utils/jsBridgeDeliver'
const route = useRoute()
const url = computed(() => route.meta.externalUrl)

onMounted(() => {
  startListener()
})

onUnmounted(() => {
  stopListener()
})
</script>
<style scoped>
.iframe-container {
  width: 2040px;
  height: 1140px;
}
</style>
