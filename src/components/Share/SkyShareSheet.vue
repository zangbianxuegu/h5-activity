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
import { NgshareChannel } from '@/utils/ngShare/types'
import type { ShareFormatConfig } from '@/utils/ngShare/share'
import { calculatePxToViewport } from '@/utils/utils'

/**
 * @description 分享选项
 * @param name 名称
 * @param icon 图标，有默认图标，或者自定义图标，可传入图片URL
 */
interface ShareSheetOption {
  name: string
  icon: string | NgshareChannel
  shareChannel: NgshareChannel
}

interface SkyShareSheetProps {
  show: boolean
  shareFormatConfig: ShareFormatConfig
  options: ShareSheetOption[]
  title?: string
  desc?: string
  url?: string
  image?: string
  channel?: NgshareChannel
  onShareSuccess?: () => void
  onShareFail?: () => void
}

const defaultIcon: Record<NgshareChannel, string> = {
  [NgshareChannel.WechatFriend]: iconWechat,
  [NgshareChannel.WechatFriendCircle]: iconWechatmoment,
  [NgshareChannel.DouYin]: iconDouyin,
  [NgshareChannel.Weibo]: iconWeibo,
  [NgshareChannel.Bilibili]: iconBilibili,
  [NgshareChannel.DaShenFriendCircle]: iconGodlikemoment,
  [NgshareChannel.XiaoHongShu]: iconXhs,
  [NgshareChannel.QQ]: '',
  [NgshareChannel.QQZone]: '',
  [NgshareChannel.KuaiShou]: '',
  [NgshareChannel.Facebook]: '',
  [NgshareChannel.DaShenFriend]: '',
  [NgshareChannel.YiXinFriend]: '',
  [NgshareChannel.YiXinFriendCircle]: '',
}

const props = withDefaults(defineProps<SkyShareSheetProps>(), {
  show: false,
})

const getIconImg = (icon: NgshareChannel): string => {
  return defaultIcon[icon]
}

const btnList = computed(() => {
  return props.options.map((item) => {
    return {
      ...item,
      iconImg:
        typeof Number(item.icon) === 'number'
          ? getIconImg(item.icon as NgshareChannel)
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

    const rect = hoverEl.getBoundingClientRect()
    const top = rect.top
    const left = rect.left

    // 92和38为小角的宽高
    hoverTop.value = `${top - containerHeight - parseFloat(calculatePxToViewport(38))}px`
    hoverLeft.value = `${left - containerWidth + parseFloat(calculatePxToViewport(92)) + hoverEl.clientWidth / 2}px`
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
  min-width: 238px;
  height: 161px;
  position: absolute;
  top: v-bind(hoverTop);
  left: v-bind(hoverLeft);
  display: flex;
  justify-self: center;
  align-items: center;
  gap: 60px;
  padding: 20px;
  border-radius: 20px;
  background-color: rgba(90, 113, 145, 0.9);
  box-shadow: 0px 6px 8px 0px rgba(108, 108, 108, 0.6);
  border: solid 2px rgba(255, 255, 255, 0.3);
  z-index: 999;
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
  &::after {
    content: '';
    width: 92px;
    height: 38px;
    position: absolute;
    bottom: 1px;
    right: 0;
    transform: translate(-50%, 100%);
    background-position: center;
    background-size: 100% 100%;
    background-image: url('@/assets/images/common/share/bg-share-bar-corn.png');
  }
}

.sky-share-sheet-overlay {
  background-color: transparent;
}
</style>
