<template>
  <!-- 领奖弹框 -->
  <reward-modal ref="modalReward">
    <template #content>
      <section aria-labelledby="activity-reward-title" class="px-4">
        <p class="modal-text">
          恭喜获得
          <span class="modal-text-blue">爱心 * 2，相遇礼盒抽奖资格</span>：
        </p>
        <div class="mt-10 flex items-center justify-center">
          <img class="reward-img" :src="handleSrc('heart')" alt="reward" />
        </div>
      </section>
    </template>
  </reward-modal>
</template>

<script lang="ts" setup>
import RewardModal from '@/components/Modal'
// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../../assets/images/common/rewards/${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}
const modalReward = ref<InstanceType<typeof RewardModal> | null>(null)

function open(): void {
  modalReward.value?.openModal()
}

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.reward-img {
  width: 200px;
}
</style>
