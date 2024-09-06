<template>
  <activity-modal ref="modalReward">
    <template #content>
      <section class="text-center" aria-labelledby="modalRewardTitle">
        <h3 class="mt-4 text-[40px] font-medium text-[#454545]">
          恭喜你获得“
          <span class="text-[#399cf3]">
            {{ rewardsText[curRewards.name as keyof RewardsName] }} </span
          >”
        </h3>
        <!-- <figure class="">
          <img
            :src="handleSrc(String(curRewards.name))"
            class="h-[172px] w-[289px]"
            alt="reward image"
          />
          <figcaption class="mt-2">
            {{ rewardsText[curRewards.name as keyof RewardsName] }} * 1
          </figcaption>
        </figure> -->
        <figure class="mt-10 flex flex-col items-center text-center">
          <img
            src="@/assets/images/dice-map/coupon-discount.png"
            class="h-[172px] w-[289px]"
            alt="reward image"
          />
          <figcaption class="mt-2 text-[#399cf3]">
            喜茶联动第二杯半价券
          </figcaption>
        </figure>
      </section>
    </template>
    <template #footer>
      <p class="text-center text-[#adadad]">
        可在【中奖查询】查看中奖历史及详细使用方法
      </p>
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
// function handleSrc(name: string): string {
//   const imgSrc = new URL(
//     `../../../assets/images/common/reward/reward-${name}.png`,
//     import.meta.url,
//   ).href

//   return imgSrc
// }

defineExpose({
  open,
})
</script>
