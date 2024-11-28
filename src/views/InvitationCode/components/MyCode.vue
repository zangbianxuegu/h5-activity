<template>
  <div class="flex h-full items-center justify-between px-[140px]">
    <!-- 邀请码 -->
    <div class="text-white">
      <p class="text-[36px]">我的邀请码</p>
      <p class="text-[56px] font-medium">
        {{ inviteInfo.myCode || '00000000' }}
      </p>
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <!-- 复制按钮 -->
    <div class="copy" @click="copyCode"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  inviteInfo: {
    type: Object,
    default: () => {},
  },
})

// 复制文本到剪贴板的函数
function copyTextToClipboard(text: string): void {
  // 使用文本域复制
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed' // 避免页面滚动
  textArea.style.top = '-9999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    // 执行复制命令
    document.execCommand('copy')
  } catch (err) {
    console.error('无法复制文本: ', err)
  }
  // 移除临时创建的文本域
  document.body.removeChild(textArea)
}

// 复制邀请码的函数
const copyCode = (): void => {
  copyTextToClipboard(
    `给你我的邀请码${props.inviteInfo.myCode}，下载《光·遇》和我一同遇见温暖，云间探险！~绑定邀请码即可共同获得邀约礼遇！`,
  )
}
</script>

<style lang="scss" scoped>
.line {
  width: 2px;
  height: 148px;
  background-image: url('@/assets/images/invitation-code/line.png');
  background-repeat: no-repeat;
  background-size: contain;
}
.copy {
  width: 74px;
  height: 82px;
  background-image: url('@/assets/images/invitation-code/copy.png');
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
