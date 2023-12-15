<template>
  <div class="bg-white">
    About
    <a class="bg-blue-600 text-lg text-white" href="http://www.baidu.com"
      >跳转链接</a
    >
    <button class="m-2 border p-2" @click="onClick">按钮</button>
  </div>
</template>

<script setup lang="ts">
function onClick(): void {
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'openBrowser',
    reqData: { webURL: 'https://www.baidu.com' },
  })
}
</script>

<style scoped></style>
