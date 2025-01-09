<template>
  <div class="iframe-container absolute flex h-screen w-screen">
    <iframe
      :src="url"
      frameborder="0"
      class="absolute h-full w-full"
      :onload="fadeIn"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { startListener, stopListener } from '@/utils/jsBridgeDeliver'
import { useEnvironment } from '@/composables/useEnvironment'
import gsap from 'gsap'

const { isProd } = useEnvironment()
const route = useRoute()
const externalUid = computed(() => route.meta.externalUid as string)
const url = ref('')

const fadeIn = (): void => {
  gsap.from('.iframe-container', {
    opacity: 0,
    duration: 1,
    ease: 'power1.out',
  })
}

const updateUrl = (): void => {
  if (isProd.value) {
    url.value = `https://sky.h5.163.com/page/${externalUid.value}.html`
  } else {
    url.value = `https://h5maker-backend-ma75.nie.netease.com/page/${externalUid.value}`
  }
}

updateUrl()

watch(route, updateUrl)

onMounted(() => {
  startListener()
})

onUnmounted(() => {
  stopListener()
})
</script>

<style scoped>
.iframe-container {
  opacity: 1;
}
</style>
