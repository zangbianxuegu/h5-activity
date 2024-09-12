<template>
  <activity-modal ref="modalReward">
    <template #content>
      <section class="text-center" aria-labelledby="modalRewardTitle">
        <h3 class="mt-4 text-[40px] font-medium text-[#454545]">
          <p v-if="props.isEnd">
            恭喜您完成一圈，额外获得<span class="text-[#399cf3]">
              {{ rewardsText[props.rewards[0].name as keyof RewardsName] }}
            </span>
          </p>
          <p v-else>
            恭喜你获得
            <span v-if="isHeyteaCoupon" class="text-[#399cf3]">
              喜茶券：{{ props.rewards[0].code }}
            </span>
            <span v-else class="text-[#399cf3]">
              {{ rewardsText[props.rewards[0].name as keyof RewardsName] }}
            </span>
          </p>
        </h3>
        <figure class="mt-10 flex flex-col items-center text-center">
          <img
            :src="handleSrc(String(props.rewards[0].name))"
            :class="[isHeyteaCoupon ? 'h-[172px] w-[289px]' : 'w-[200px]']"
            alt="reward image"
          />
          <figcaption class="mt-2 text-[40px] text-[#399cf3]">
            {{ rewardsText[props.rewards[0].name as keyof RewardsName] }}
            <span v-if="!isHeyteaCoupon">*{{ props.rewards[0].count }}</span>
          </figcaption>
        </figure>
      </section>
    </template>
    <template #footer v-if="isHeyteaCoupon">
      <p class="absolute bottom-8 left-0 w-full text-center text-[#adadad]">
        可在【奖励查询】查看中奖历史及详细使用方法
      </p>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import { type Rewards } from '@/types'
import ActivityModal from '@/components/Modal'
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const rewardsText: RewardsName = {
  heytea_token: '喜遇券',
  heytea_coupon: '光遇喜茶联动30-3优惠券',
  heytea_gift: '光遇喜茶联动赠饮券',
  heytea_half: '光遇喜茶联动第二杯半价券',
  fireworks: '浪漫烟花',
  trail_red: '红色尾迹',
  rainbow: '绚丽彩虹',
  message_boat: '传信纸船',
  energy_potion: '光能药剂',
  tiny: '小不点',
  huge: '大只佬',
  breath_potion: '呼吸药剂',
  gravity: '漂浮',
  shrink: '返老还童',
  grow: '长大成人',
  energy: '元气满满',
  bonfire: '篝火',
  glow: '璀璨之星',
  crab_rock_trick: '螃蟹恶作剧',
  repellant_krill: '冥龙克星',
}

interface RewardsName {
  heytea_token: string
  heytea_coupon: string
  heytea_gift: string
  heytea_half: string
  fireworks: string
  trail_red: string
  rainbow: string
  message_boat: string
  energy_potion: string
  tiny: string
  huge: string
  breath_potion: string
  gravity: string
  shrink: string
  grow: string
  energy: string
  bonfire: string
  glow: string
  crab_rock_trick: string
  repellant_krill: string
}

interface Props {
  rewards: Rewards
  isEnd: boolean
}

const props = defineProps<Props>()

// 是否为喜茶券
const isHeyteaCoupon = computed(() =>
  ['heytea_coupon', 'heytea_gift', 'heytea_half'].includes(
    props.rewards[0].name,
  ),
)

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
