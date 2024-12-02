<template>
  <Teleport to="body">
    <van-overlay
      class="works-detail-overlay"
      :show="show"
      @click="hideModal"
      class-name="sky-share-sheet-overlay"
      z-index="999"
    >
      <div
        ref="shareSheetContainerRef"
        class="sky-share-sheet bg-cover bg-center bg-no-repeat"
      >
        <div
          v-for="channel in btnList"
          :key="channel.name"
          class="btn-container"
          @click="onSelect(channel)"
        >
          <img :src="channel.iconImg" alt="" />
        </div>
      </div>
    </van-overlay>
  </Teleport>
</template>

<script setup lang="ts">
import iconWechat from '@/assets/images/common/share/icon-share-wechat.png'
import iconWechatmoment from '@/assets/images/common/share/icon-share-wechatmoment.png'
import iconWeibo from '@/assets/images/common/share/icon-share-weibo.png'
import iconBilibili from '@/assets/images/common/share/icon-share-bilibili.png'
import iconGodlikemoment from '@/assets/images/common/share/icon-share-godlikemoment.png'
import iconXhs from '@/assets/images/common/share/icon-share-xhs.png'
import iconDouyin from '@/assets/images/common/share/icon-share-douyin.png'
import { NGSHARE_SHARE_CHANNEL } from '@/utils/ngShare/types'
import type { ShareFormatConfig } from '@/utils/ngShare/share'

/**
 * @description 分享选项
 * @param name 名称
 * @param icon 图标，有默认图标，或者自定义图标，可传入图片URL
 */
interface ShareSheetOption {
  name: string
  icon: string | NGSHARE_SHARE_CHANNEL
  shareChannel: NGSHARE_SHARE_CHANNEL
}

interface SkyShareSheetProps {
  show: boolean
  shareFormatConfig: ShareFormatConfig
  options: ShareSheetOption[]
  title?: string
  desc?: string
  url?: string
  image?: string
  channel?: NGSHARE_SHARE_CHANNEL
  onShareSuccess?: () => void
  onShareFail?: () => void
}

const defaultIcon: Record<NGSHARE_SHARE_CHANNEL, string> = {
  [NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND]: iconWechat,
  [NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE]: iconWechatmoment,
  [NGSHARE_SHARE_CHANNEL.DOU_YIN]: iconDouyin,
  [NGSHARE_SHARE_CHANNEL.WEI_BO]: iconWeibo,
  [NGSHARE_SHARE_CHANNEL.BILIBILI]: iconBilibili,
  [NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND_CIRCLE]: iconGodlikemoment,
  [NGSHARE_SHARE_CHANNEL.XIAO_HONG_SHU]: iconXhs,
  [NGSHARE_SHARE_CHANNEL.QQ]: '',
  [NGSHARE_SHARE_CHANNEL.QQ_ZONE]: '',
  [NGSHARE_SHARE_CHANNEL.KUAI_SHOU]: '',
  [NGSHARE_SHARE_CHANNEL.FACEBOOK]: '',
  [NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND]: '',
  [NGSHARE_SHARE_CHANNEL.YI_XIN_FRIEND]: '',
  [NGSHARE_SHARE_CHANNEL.YI_XIN_FRIEND_CIRCLE]: '',
}

const props = withDefaults(defineProps<SkyShareSheetProps>(), {
  show: false,
})

const getIconImg = (icon: NGSHARE_SHARE_CHANNEL): string => {
  return defaultIcon[icon]
}

const btnList = computed(() => {
  return props.options.map((item) => {
    return {
      ...item,
      iconImg:
        typeof Number(item.icon) === 'number'
          ? getIconImg(item.icon as NGSHARE_SHARE_CHANNEL)
          : item.icon,
    }
  })
})

const shareSheetContainerRef = ref<HTMLElement | null>()

const hoverTop = ref()
const hoverLeft = ref()

const teleportToTargetEl = async (): Promise<void> => {
  await nextTick()
  const targetElByHover = props.shareFormatConfig.targetElByHover
  if (targetElByHover) {
    const hoverEl: HTMLElement = (
      Object.prototype.toString.call(targetElByHover) === '[object String]'
        ? document.querySelector(targetElByHover as string)
        : targetElByHover
    ) as HTMLElement
    const containerWidth = shareSheetContainerRef.value?.offsetWidth || 0
    const containerHeight = shareSheetContainerRef.value?.offsetHeight || 0

    const top = hoverEl.offsetTop
    const left = hoverEl.offsetLeft
    hoverTop.value = `${top - containerHeight / 2 + 10}px`
    hoverLeft.value = `${left - containerWidth / 2 - 6}px`
  } else {
    hoverTop.value = `${10}px`
    hoverLeft.value = `${10}px`
  }
}

const emits = defineEmits<{
  'update:show': [value: boolean]
  select: [option: ShareSheetOption]
}>()

const hideModal = (): void => {
  emits('update:show', false)
}

const onSelect = (option: ShareSheetOption): void => {
  emits('select', option)
}

onMounted(async () => {
  await teleportToTargetEl()
})
</script>
<style scoped lang="scss">
.sky-share-sheet {
  width: 1000px;
  height: 199px;
  position: absolute;
  top: v-bind(hoverTop);
  left: v-bind(hoverLeft);
  display: flex;
  justify-self: center;
  align-items: center;
  padding: 0 20px 30px 20px;
  z-index: 999;
  background-image: url('@/assets/images/common/share/bg-share-bar.png');
  & > div {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 88px;
      height: 88px;
    }
  }
}
.sky-share-sheet-overlay {
  background-color: transparent;
}
</style>
