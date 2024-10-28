<template>
  <div class="page-container">
    <van-share-sheet
      v-model:show="isShow"
      title="立即分享给好友"
      :options="shareChannel"
      @select="onSelectChannel"
      @closed="onClosed"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NGSHARE_SHARE_CHANNEL,
  NGSHARE_CONTENT_TYPE,
} from '@/utils/ngShare/types'
import type {
  NgshareShareLinkConfig,
  NgshareShareImageConfig,
} from '@/utils/ngShare/types'
import { ngshareByH5 } from '@/utils/ngShare/index'

/**
 * @prop shareChannel 分享渠道，传[]默认分享所有渠道
 */
const props = defineProps<{
  show?: boolean
  shareChannel: NGSHARE_SHARE_CHANNEL[] | []
  shareLinkConfig: NgshareShareLinkConfig
  shareImageConfig: NgshareShareImageConfig
  closed: () => void
}>()

const isShow = ref(false)
onMounted(() => {
  isShow.value = true
})
const onClosed = (): void => {
  props.closed()
}

interface ShareOption {
  name: string
  icon: string
  shareChannel: NGSHARE_SHARE_CHANNEL
}

const showShare = ref(false)
const options: ShareOption[] = [
  {
    name: '微信朋友圈',
    icon: 'wechat',
    shareChannel: NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE,
  },
  {
    name: '微信',
    icon: 'wechat',
    shareChannel: NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND,
  },
  {
    name: '抖音',
    icon: 'weibo',
    shareChannel: NGSHARE_SHARE_CHANNEL.DOU_YIN,
  },
  {
    name: '哔哩哔哩',
    icon: 'weibo',
    shareChannel: NGSHARE_SHARE_CHANNEL.BILIBILI,
  },
  {
    name: '微博',
    icon: 'weibo',
    shareChannel: NGSHARE_SHARE_CHANNEL.WEI_BO,
  },
  {
    name: '网易大神圈子',
    icon: 'weibo',
    shareChannel: NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND_CIRCLE,
  },
  {
    name: '小红书',
    icon: 'weibo',
    shareChannel: NGSHARE_SHARE_CHANNEL.XIAO_HONG_SHU,
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
    NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE,
    NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND,
    NGSHARE_SHARE_CHANNEL.WEI_BO,
  ]
  const shareImgList = [
    NGSHARE_SHARE_CHANNEL.BILIBILI,
    NGSHARE_SHARE_CHANNEL.DOU_YIN,
    NGSHARE_SHARE_CHANNEL.XIAO_HONG_SHU,
  ]
  const contentType = shareLinkList.includes(option.shareChannel)
    ? NGSHARE_CONTENT_TYPE.LINK
    : NGSHARE_CONTENT_TYPE.IMAGE
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
