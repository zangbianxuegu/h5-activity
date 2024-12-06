<template>
  <div class="flex h-full w-full p-[30px]">
    <iframe :src="url" frameborder="0" class="h-full w-full"></iframe>
  </div>
</template>

<script setup>
const route = useRoute()
const jsbridge = JSON.stringify(window.UniSDKJSBridge)
const url = computed(() => route.meta.externalUrl + '?jsbridge=' + jsbridge)
</script>
