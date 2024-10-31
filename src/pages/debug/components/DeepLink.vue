<template>
  <div class="container w-full">
    <van-button @click="openGame">启动游戏</van-button>
    <div>
      <wx-open-launch-app
        id="launch-btn"
        appid="ntes://game.mobile/sky"
        extinfo=""
      >
        <component :is="'script'" type="text/wxtag-template">
          <button class="btn" style="width: 40rem; height: 5rem">
            App内查看
          </button>
        </component>
      </wx-open-launch-app>
    </div>
  </div>
</template>

<script setup lang="ts">
const openGame = (): void => {
  location.href =
    'ntes://game.mobile/sky?type=w&url=http://10.227.199.103:5173/#/dice-mission?name=11&age=2'
}

// onMounted(() => {
//   wx.ready(() => {
//     const btn = document.getElementById('launch-btn') as HTMLButtonElement
//     btn.addEventListener('launch', function (e) {
//       console.log('success')
//     })
//     btn.addEventListener('error', function (e) {
//       console.log('fail', e.detail)
//     })
//   })
//   document.addEventListener('WeixinOpenTagsError', function (e) {
//     console.error('WeixinOpenTagsError', e.detail.errMsg) // 无法使用开放标签的错误原因，需回退兼容。仅无法使用开放标签，JS-SDK其他功能不受影响
//   })
//   wx.config({
//     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印
//     appId: '', // 必填，公众号的唯一标识
//     timestamp: 1, // 必填，生成签名的时间戳
//     nonceStr: generateUUID(), // 必填，生成签名的随机串
//     signature: '', // 必填，签名
//     jsApiList: ['wx-open-launch-app'], // 必填，需要使用的JS接口列表
//     openTagList: ['wx-open-launch-app'], // 可选，需要使用的开放标签列表，例如['wx-open-launch-app']
//   })
// })
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
