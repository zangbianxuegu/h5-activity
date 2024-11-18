<template>
  <div
    class="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
    :class="{ 'pointer-events-none opacity-0': !isOpen }"
    @click="openModal"
  >
    <div
      class="modal relative transform bg-contain bg-center bg-no-repeat px-[94px] transition duration-300"
      :class="{ 'translate-y-6': !isOpen }"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
      @click.stop
    >
      <div
        v-if="showClose"
        class="modal-close absolute right-2.5 top-1.5 overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
        @click="closeModal"
      >
        关闭
      </div>
      <div class="my-2 flex items-center justify-center">
        <slot name="title">
          <h2 class="modal-title bg-contain bg-center bg-no-repeat">
            {{ title }}
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
  backgroundImage: {
    type: String,
    default: new URL('@/assets/images/common/modal-bg.png', import.meta.url)
      .href,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
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
    height: 66px;
  }

  &-close {
    width: 81px;
    height: 81px;
    background-image: url('@/assets/images/common/modal-close.png');
  }
  .modal-title {
    color: #5284b0;
    font-size: 54px;
    letter-spacing: 0.5px;
  }
}
</style>
