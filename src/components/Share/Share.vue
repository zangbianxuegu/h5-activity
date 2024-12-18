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
 * @prop beforeClickShareChannel 点击分享渠道前的回调
 */
const props = defineProps<{
  show?: boolean
  shareFormatConfig: ShareFormatConfig
  shareChannel: NgshareChannel[] | []
  shareLinkConfig: NgshareShareLinkConfig
  shareImageConfig: NgshareShareImageConfig
  beforeClickShareChannel: () => unknown
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
    icon: NgshareChannel.WechatFriendCircle,
    shareChannel: NgshareChannel.WechatFriendCircle,
  },
  {
    name: '微信',
    icon: NgshareChannel.WechatFriend,
    shareChannel: NgshareChannel.WechatFriend,
  },
  {
    name: '抖音',
    icon: NgshareChannel.DouYin,
    shareChannel: NgshareChannel.DouYin,
  },
  {
    name: '哔哩哔哩',
    icon: NgshareChannel.Bilibili,
    shareChannel: NgshareChannel.Bilibili,
  },
  {
    name: '微博',
    icon: NgshareChannel.Weibo,
    shareChannel: NgshareChannel.Weibo,
  },
  {
    name: '网易大神圈子',
    icon: NgshareChannel.DaShenFriendCircle,
    shareChannel: NgshareChannel.DaShenFriendCircle,
  },
  {
    name: '小红书',
    icon: NgshareChannel.XiaoHongShu,
    shareChannel: NgshareChannel.XiaoHongShu,
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
  props.beforeClickShareChannel()
  const shareLinkList = [
    NgshareChannel.WechatFriendCircle,
    NgshareChannel.WechatFriend,
    NgshareChannel.Weibo,
    NgshareChannel.DaShenFriendCircle,
  ]
  const shareImgList = [
    NgshareChannel.Bilibili,
    NgshareChannel.DouYin,
    NgshareChannel.XiaoHongShu,
  ]
  const contentType = shareLinkList.includes(option.shareChannel)
    ? NgshareContentType.Link
    : NgshareContentType.Image
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
