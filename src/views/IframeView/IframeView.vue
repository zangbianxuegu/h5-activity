<template>
  <div class="iframe-container absolute flex">
    <iframe :src="url" frameborder="0" class="absolute h-full w-full"></iframe>
  </div>
</template>

<script setup>
import { showToast } from 'vant'
import { getDataForIframe } from '@/utils/iframe'
const route = useRoute()
const url = computed(() => route.meta.externalUrl)

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://h5maker-backend-ma75.nie.netease.com') {
    return
  }
  if (event.data) {
    console.log('接收 postMessage event.data: ', event.data)
    // 示例：
    // event.data = {
    //   type: 'protocol',
    //   resource: '/internal/jingling/get_player_mission_data',
    //   content: {
    //     source_token: '',
    //     source_id: '',
    //     event: 'activitycenter_double_eleven_2024_2',
    //   },
    // }
    getDataForIframe(event.data)
      .then((res) => {
        event.source.postMessage(res, event.origin)
      })
      .catch((error) => {
        showToast(error.message)
      })
  }
})
</script>
<style scoped>
.iframe-container {
  width: 2040px;
  height: 1140px;
}
</style>
