<template>
  <div
    class="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
    :class="{ 'pointer-events-none opacity-0': !isOpen }"
  >
    <div
      ref="modalRef"
      class="modal animate__animated animate__fadeInUp animate__faster relative flex transform flex-col items-center justify-between bg-contain bg-center bg-no-repeat transition duration-300"
      @click.stop
    >
      <div class="modal-header flex items-center justify-between">
        <div class="modal-title flex flex-1 items-center justify-center">
          <h2
            class="modal-title-img overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            提示
          </h2>
        </div>
        <div
          class="modal-close overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          @click="closeModal"
        >
          关闭
        </div>
      </div>
      <div class="modal-content flex flex-1 items-center justify-center">
        {{ text }}
      </div>
      <div class="modal-footer flex items-center justify-center">
        <div class="footer_btn" @click="closeModal">我再想想</div>
        <div class="footer_btn" @click="onConfirm">确认</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { animateCSS } from '@/utils/utils'

const text = '确认删除投稿作品？'

const isOpen = ref(false)
const emit = defineEmits(['confirm', 'close'])

const onConfirm = (): void => {
  void animateCSS(
    modalRef.value,
    'animate__fadeOutDown',
    undefined,
    'faster',
  ).then(() => {
    isOpen.value = false
    emit('confirm')
  })
}

const modalRef = ref<HTMLElement | null>()

const closeModal = (): void => {
  void animateCSS(
    modalRef.value,
    'animate__fadeOutDown',
    undefined,
    'faster',
  ).then(() => {
    isOpen.value = false
    emit('close')
  })
}

onMounted(() => {
  void animateCSS(modalRef.value, 'animate__fadeInUp', undefined, 'faster')
  isOpen.value = true
})
</script>

<style scoped lang="scss">
.modal {
  width: 1000px;
  height: 640px;
  padding: 21px 30px 87px 30px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/bg-modal-tip.png');
  overflow: hidden;
}
.modal-header {
  width: 100%;
  height: 66px;
  position: relative;
  .modal-title {
    width: 100%;
    height: 100%;
    .modal-title-img {
      width: 113px;
      height: 66px;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/title-modal.png');
    }
  }

  .modal-close {
    width: 71px;
    height: 71px;
    position: absolute;
    right: -6px;
    top: -6px;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-close.png');
  }
}
.modal-content {
  font-size: 40px;
  color: #454545;
}
.modal-footer {
  width: 100%;
  height: 88px;
  gap: 102px;
  .footer_btn {
    width: 301px;
    height: 88px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
    border-radius: 44px;
    font-size: 40px;
    letter-spacing: 1px;
    color: #5a7191;
    &:hover {
      border: solid 3px #809bab;
    }
  }
}
</style>
