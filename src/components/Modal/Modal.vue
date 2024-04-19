<template>
  <div
    class="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
    :class="{ 'pointer-events-none opacity-0': !isOpen }"
    @click="openModal"
  >
    <div
      class="modal relative transform bg-contain bg-center bg-no-repeat px-4 transition duration-300"
      :class="{ 'translate-y-6': !isOpen }"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      @click.stop
    >
      <div
        class="modal-close absolute right-2.5 top-1.5 overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
        @click="closeModal"
      >
        关闭
      </div>
      <div class="my-2 flex items-center justify-center">
        <h2
          class="modal-title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
        >
          标题
        </h2>
      </div>
      <div class="modal-content my-4 px-2">
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

const openModal = (): void => {
  isOpen.value = true
}

const closeModal = (): void => {
  isOpen.value = false
}

defineProps({
  backgroundImage: {
    type: String,
    default: new URL('@/assets/images/common/modal-bg.png', import.meta.url)
      .href,
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
  background-image: url('@/assets/images/common/modal-bg.png');

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

  &-content {
    padding-bottom: 80px;
    height: 600px;
    overflow-y: scroll;
    mask-image: linear-gradient(to bottom, black 80%, transparent);
  }
}
</style>
