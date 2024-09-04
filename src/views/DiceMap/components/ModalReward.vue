<template>
  <activity-modal ref="modalReward">
    <template #content>
      <section class="flex h-full flex-col" aria-labelledby="modalRewardTitle">
        <h2 id="modalRewardTitle" class="sr-only">领奖弹框</h2>
        <p class="modal-text">
          恭喜你获得
          <span class="modal-text-blue">
            {{ rewardsText[curRewards.name as keyof RewardsName] }} *
            {{ curRewards.count }} </span
          >：
        </p>
        <div class="flex flex-1 items-center justify-center">
          <img :src="handleSrc(String(curRewards.name))" alt="reward image" />
        </div>
      </section>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const rewardsText: RewardsName = {
  outfit_prop_marshmallow: '烧烤架魔法',
  beachball: '沙滩球魔法',
  outfit_prop_mantafloat: '遥鲲泳圈试用魔法',
  resize_potion: '体型重塑',
  glow: '璀璨之星',
  outfit_prop_surfboard: '冲浪板试用魔法',
  heart: '爱心',
}
const curRewards: Ref<Rewards> = ref({
  name: 'outfit_prop_marshmallow',
  count: 2,
})
interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  outfit_prop_marshmallow: string
  beachball: string
  outfit_prop_mantafloat: string
  resize_potion: string
  glow: string
  outfit_prop_surfboard: string
  heart: string
}

function open(): void {
  modalReward.value?.openModal()
}

/**
 * @function 处理 img src
 * @param name 奖励名
 * @returns {string} 图片路径
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

defineExpose({
  open,
})
</script>
