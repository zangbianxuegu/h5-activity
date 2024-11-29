<template>
  <div
    :class="[
      'fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black',
      `bg-opacity-${overlayOpacity}`,
      { 'pointer-events-none opacity-0': !isOpen },
    ]"
    @click="openModal"
  >
    <div
      :class="[
        'relative transform bg-contain bg-center bg-no-repeat px-[16px] transition duration-300',
        modalClass,
        { 'translate-y-6': !isOpen },
      ]"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      @click.stop
    >
      <template v-if="showClose">
        <slot name="close">
          <div
            class="modal-close absolute right-2.5 top-1.5 overflow-hidden bg-contain bg-center bg-no-repeat"
            @click="closeModal"
          >
            <span class="sr-only">关闭</span>
          </div>
        </slot>
      </template>
      <div class="my-2 flex items-center justify-center">
        <slot name="title">
          <h2
            class="modal-title overflow-hidden bg-contain bg-center bg-no-repeat"
          >
            <span class="sr-only">提示</span>
          </h2>
        </slot>
      </div>
      <div class="modal-content">
        <slot name="content"></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const emit = defineEmits(['close'])

const openModal = (): void => {
  isOpen.value = true
}

const closeModal = (): void => {
  isOpen.value = false
  emit('close')
}

defineProps({
  // 弹框覆盖层透明度
  overlayOpacity: {
    type: Number,
    default: 50,
  },
  // 弹框背景图片
  backgroundImage: {
    type: String,
    default: new URL('@/assets/images/common/modal-bg.png', import.meta.url)
      .href,
  },
  // 弹框样式
  modalClass: {
    type: String,
    default: 'modal',
  },
  // 是否显示关闭
  showClose: {
    type: Boolean,
    default: true,
  },
})

defineExpose({
  openModal,
  closeModal,
})
</script>

<style lang="scss" scoped>
.modal {
  width: 1168px;
  height: 866px;

  &-title {
    width: 113px;
    height: 66px;
    background-image: url('@/assets/images/common/modal-title.png');
  }

  &-close {
    width: 81px;
    height: 81px;
    background-image: url('@/assets/images/common/modal-close.png');
  }
}
</style>
