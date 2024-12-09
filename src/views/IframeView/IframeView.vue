<template>
  <div class="iframe-container absolute flex">
    <iframe :src="url" frameborder="0" class="absolute h-full w-full"></iframe>
  </div>
</template>

<script setup>
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
const route = useRoute()
const url = computed(() => route.meta.externalUrl)

window.addEventListener('message', (event) => {
  if (event.origin !== 'https://h5maker-backend-ma75.nie.netease.com') {
    return
  }
  if (event.data) {
    console.log('接收 postMessage event.data: ', event.data)
    const key = event.data.key
    switch (key) {
      case 'getPlayerMissionData':
        getPlayerMissionData({ event: event.data.params.event })
          .then((res) => {
            event.source.postMessage(
              {
                key,
                res,
              },
              event.origin,
            )
          })
          .catch((error) => {
            showToast(error.message)
          })
        break
      case 'claimMissionReward':
        claimMissionReward({
          event: event.data.params.event,
          task: event.data.params.task,
          rewardId: event.data.params.rewardId,
        })
          .then((res) => {
            event.source.postMessage(
              {
                key,
                res,
              },
              event.origin,
            )
          })
          .catch((error) => {
            showToast(error.message)
          })
        break

      default:
        break
    }
  }
})
</script>
<style scoped>
.iframe-container {
  width: 2040px;
  height: 1140px;
}
</style>
