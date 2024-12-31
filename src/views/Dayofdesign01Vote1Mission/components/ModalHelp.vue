<template>
  <activity-modal
    ref="modalHelp"
    modal-class="w-[1140px] h-[830px]"
    :background-image="modalImage"
    :overlay-opacity="70"
  >
    <template #close>
      <h2
        class="modal-close absolute right-[15px] top-[15px] overflow-hidden bg-contain bg-center bg-no-repeat"
        @click="close"
      >
        <span class="sr-only">关闭</span>
      </h2>
    </template>
    <template #title>
      <h2 class="modal-title mb-[20px] overflow-hidden bg-contain bg-center">
        <span class="sr-only">提示</span>
      </h2>
    </template>
    <template #content>
      <section
        aria-labelledby="activity-rules-title"
        class="h-[620px] overflow-y-scroll px-[80px]"
      >
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">【xx期】</span>
        </h3>
        <h3 class="modal-text mt-[10px]">
          <span class="font-semibold">活动时间：</span>2025年2月1日 ~ 2月16日
        </h3>
        <h3 class="modal-text mt-[10px]">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <p class="modal-text">1、活动期间</p>
      </section>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalImage = new URL(
  '@/assets/images/dayofdesign01/common/modal-bg-large.png',
  import.meta.url,
).href

function open(): void {
  modalHelp.value?.openModal()
}

function close(): void {
  modalHelp.value?.closeModal()
}

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.modal-title {
  width: 113px;
  height: 66px;
  background-image: url('@/assets/images/dayofdesign01/common/title-tips.png');
}
.modal-close {
  width: 71px;
  height: 71px;
  background-image: url('@/assets/images/dayofdesign01/common/close.png');
}
</style>
