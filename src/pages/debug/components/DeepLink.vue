<template>
  <div class="container w-full">
    <van-button @click="openGame">启动游戏</van-button>
  </div>
</template>

<script setup lang="ts">
const openGame = (): void => {
  location.href = 'ntes://game.mobile/sky'
}
</script>

<style scoped lang="scss">
.container :deep(.van-button) {
  width: 100%;
  padding: 0;
  .van-button__content {
    width: 100%;
    .van-button__text {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>
