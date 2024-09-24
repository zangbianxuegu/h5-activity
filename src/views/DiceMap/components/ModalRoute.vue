<template>
  <activity-modal ref="modalDirection" :show-close="false">
    <template #content>
      <section
        class="model-route-container"
        aria-labelledby="modalDirectionTitle"
      >
        <h2 class="mt-6 text-center text-[40px] text-[#454545]">
          请选择前进方向
        </h2>
        <div class="flex justify-center pb-8">
          <button
            type="button"
            class="arrow-btn arrow-btn-up cursor-pointer bg-contain bg-no-repeat"
            aria-label="向上"
            @click="handleChoose('B')"
          >
            <span class="sr-only">向上</span>
          </button>
          <button
            type="button"
            class="arrow-btn arrow-btn-right cursor-pointer bg-contain bg-no-repeat"
            aria-label="向右"
            @click="handleChoose('A')"
          >
            <span class="sr-only">向右</span>
          </button>
        </div>
      </section>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'

const modalDirection = ref<InstanceType<typeof ActivityModal> | null>(null)

const emit = defineEmits(['choose'])

function open(): void {
  modalDirection.value?.openModal()
}

function handleChoose(route: string): void {
  modalDirection.value?.closeModal()
  emit('choose', route)
}

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.model-route-container {
  & > div {
    margin-top: 160px;
  }
}
.arrow-btn {
  width: 202px;
  height: 202px;
  border-radius: 30px;
  background-color: #fff;
  box-shadow: 0 0 27px 16px rgba(193, 228, 250, 0.78);

  &-up {
    background-size: 66px 119px;
    background-position: center center;
    background-image: url('@/assets/images/dice-map/arrow-up.png');
  }

  &-right {
    margin-left: 230px;
    background-size: 69px 119px;
    background-position: center center;
    background-image: url('@/assets/images/dice-map/arrow-up.png');
    transform: rotate(90deg);
    transform-origin: center center;
  }
}
</style>
