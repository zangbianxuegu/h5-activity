<template>
  <van-overlay :show="isVisible" class="flex items-center justify-center">
    <van-loading />
  </van-overlay>
</template>

<script setup lang="ts">
const isVisible = ref(false)

function showVisible(): void {
  isVisible.value = true
}
function hideVisible(): void {
  isVisible.value = false
}

defineExpose({
  showVisible,
  hideVisible,
})
</script>
