<template>
  <div
    class="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
    :class="{ 'pointer-events-none opacity-0': !isOpen }"
    @click="openModal"
  >
    <div
      class="modal relative transform bg-contain bg-center bg-no-repeat px-4 transition duration-300"
      :class="{ 'translate-y-6': !isOpen }"
      @click.stop
    >
      <div
        class="modal-close absolute right-2.5 top-1.5 overflow-hidden bg-contain bg-center bg-no-repeat indent-[100%]"
        @click="closeModal"
      >
        关闭
      </div>
      <div class="mt-2 flex items-center justify-center">
        <h2
          class="modal-title overflow-hidden bg-contain bg-center bg-no-repeat indent-[100%]"
        >
          标题
        </h2>
      </div>
      <div class="px-2 py-6"><slot name="content"></slot></div>
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
defineExpose({
  openModal,
  closeModal,
})
</script>

<style lang="scss" scoped>
.modal {
  width: 1168px;
  height: 866px;
  background-image: url('@/assets/images/signin/modal-bg.png');

  &-title {
    width: 113px;
    height: 66px;
    background-image: url('@/assets/images/signin/modal-title.png');
  }

  &-close {
    width: 81px;
    height: 81px;
    background-image: url('@/assets/images/signin/modal-close.png');
  }
}
</style>
