<template>
  <div class="flex h-full items-center justify-between px-[120px]">
    <div class="text-white">
      <p class="text-[36px]">我的邀请码</p>
      <p class="text-[56px] font-medium">{{ inviteInfo.myCode }}</p>
    </div>
    <!-- 分隔线 -->
    <div class="line"></div>
    <!-- 复制按钮 -->
    <div class="copy" @click="copyCode"></div>
    <!-- 分享按钮 -->
    <div class="share"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  inviteInfo: {
    type: Object,
    default: () => {},
  },
})

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
    document.execCommand('copy')
  } catch (err) {
    console.error('无法复制文本: ', err)
  }
  document.body.removeChild(textArea)
}

const copyCode = (): void => {
  copyTextToClipboard(props.inviteInfo.myCode)
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
.share {
  width: 74px;
  height: 82px;
  background-image: url('@/assets/images/invitation-code/share.png');
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
