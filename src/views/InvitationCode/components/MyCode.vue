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
import { useClipboard } from '@vueuse/core'
import { showToast } from 'vant'

const { copy, isSupported } = useClipboard({ legacy: true })

const props = defineProps({
  inviteInfo: {
    type: Object,
    default: () => {},
  },
})

/**
 * @function 复制文本的异步函数
 * @param textToCopy 要复制的文本
 * @returns {Promise<void>}
 */
const onCopy = async (textToCopy: string): Promise<void> => {
  // 检查是否支持复制功能
  if (!isSupported.value) {
    showToast('未授权,不支持')
    return
  }
  // 执行复制操作
  await copy(textToCopy)
  showToast('已复制')
}

/**
 * @function 复制邀请码
 * @returns {void}
 */
const copyCode = async (): Promise<void> => {
  try {
    await onCopy(
      `给你我的邀请码${props.inviteInfo.myCode}，下载《光·遇》和我一同遇见温暖，云间探险！~绑定邀请码即可共同获得邀约礼遇！`,
    )
  } catch (error) {
    showToast('复制失败')
  }
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
