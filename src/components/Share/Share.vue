<template>
  <div class="page-container">
    <sky-share-sheet
      v-model:show="isShow"
      :options="shareChannel"
      @select="onSelectChannel"
      :share-format-config="shareFormatConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { NgshareChannel, NgshareContentType } from '@/utils/ngShare/types'
import type {
  NgshareShareLinkConfig,
  NgshareShareImageConfig,
} from '@/utils/ngShare/types'
import { ngshareByH5 } from '@/utils/ngShare/index'
import SkyShareSheet from './SkyShareSheet.vue'
import type { ShareFormatConfig } from '@/utils/ngShare/share'

/**
 * @prop shareChannel 分享渠道，传[]默认分享所有渠道
 */
const props = defineProps<{
  show?: boolean
  shareFormatConfig: ShareFormatConfig
  shareChannel: NgshareChannel[] | []
  shareLinkConfig: NgshareShareLinkConfig
  shareImageConfig: NgshareShareImageConfig
}>()

const isShow = ref(false)
onMounted(() => {
  isShow.value = true
})

interface ShareOption {
  name: string
  icon: string
  shareChannel: NgshareChannel
}

const showShare = ref(false)
const options: ShareOption[] = [
  {
    name: '微信朋友圈',
    icon: NgshareChannel.WECHAT_FRIEND_CIRCLE,
    shareChannel: NgshareChannel.WECHAT_FRIEND_CIRCLE,
  },
  {
    name: '微信',
    icon: NgshareChannel.WECHAT_FRIEND,
    shareChannel: NgshareChannel.WECHAT_FRIEND,
  },
  {
    name: '抖音',
    icon: NgshareChannel.DOU_YIN,
    shareChannel: NgshareChannel.DOU_YIN,
  },
  {
    name: '哔哩哔哩',
    icon: NgshareChannel.BILIBILI,
    shareChannel: NgshareChannel.BILIBILI,
  },
  {
    name: '微博',
    icon: NgshareChannel.WEI_BO,
    shareChannel: NgshareChannel.WEI_BO,
  },
  {
    name: '网易大神圈子',
    icon: NgshareChannel.DA_SHEN_FRIEND_CIRCLE,
    shareChannel: NgshareChannel.DA_SHEN_FRIEND_CIRCLE,
  },
  {
    name: '小红书',
    icon: NgshareChannel.XIAO_HONG_SHU,
    shareChannel: NgshareChannel.XIAO_HONG_SHU,
  },
]
const shareChannel = computed(() => {
  if (props.shareChannel.length === 0) {
    return options
  } else {
    return options.filter((item) =>
      (props.shareChannel as string[]).includes(item.shareChannel as string),
    )
  }
})

const onSelectChannel = async (option: ShareOption): Promise<void> => {
  const shareLinkList = [
    NgshareChannel.WECHAT_FRIEND_CIRCLE,
    NgshareChannel.WECHAT_FRIEND,
    NgshareChannel.WEI_BO,
    NgshareChannel.DA_SHEN_FRIEND_CIRCLE,
  ]
  const shareImgList = [
    NgshareChannel.BILIBILI,
    NgshareChannel.DOU_YIN,
    NgshareChannel.XIAO_HONG_SHU,
  ]
  const contentType = shareLinkList.includes(option.shareChannel)
    ? NgshareContentType.LINK
    : NgshareContentType.IMAGE
  let shareConfig: NgshareShareLinkConfig | NgshareShareImageConfig =
    props.shareLinkConfig
  if (shareImgList.includes(option.shareChannel)) {
    shareConfig = props.shareImageConfig
  }
  await ngshareByH5(contentType, option.shareChannel, shareConfig)
  showShare.value = false
}
</script>
<style>
html {
  font-family: sans-serif;
}

.page-container {
  color: #fff;
  background: #ccc;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid black;
  overflow: scroll;
}
</style>
