<template>
  <activity-modal ref="modalDice">
    <template #content>
      <section aria-labelledby="modalDiceTitle">
        <h2 class="mt-6 text-center text-[40px] text-[#454545]">请选择点数</h2>
        <div class="box flex w-[828px] flex-wrap justify-center">
          <button
            v-for="(_, index) in Array.from({ length: 6 })"
            :key="index"
            type="button"
            :class="[
              'crab cursor-pointer bg-contain bg-no-repeat',
              `crab-${index}`,
            ]"
            :aria-label="String(index + 1)"
            @click="handleChoose(index + 1)"
          >
            <span class="crab-num">{{ index + 1 }}</span>
          </button>
        </div>
      </section>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'

const modalDice = ref<InstanceType<typeof ActivityModal> | null>(null)

const emit = defineEmits(['choose'])

function open(): void {
  modalDice.value?.openModal()
}

function handleChoose(num: number): void {
  modalDice.value?.closeModal()
  emit('choose', num)
}

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.box {
  margin: 20px auto;
}
.crab {
  position: relative;
  margin-right: 36px;
  width: 252px;
  height: 252px;
  background-image: url('@/assets/images/dice-map/dice-crab.png');

  &:nth-child(3n) {
    margin-right: 0;
  }

  &-num {
    position: absolute;
    left: 43px;
    top: 47px;
    height: 64px;
    width: 76px;
    line-height: 64px;
    font-size: 40px;
    text-align: center;
    color: #fff;
  }
}
</style>
