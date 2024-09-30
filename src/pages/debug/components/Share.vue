<template>
  <div class="page-container">
    <van-button type="success" @click="onClickShareBtn">分享</van-button>
    <van-share-sheet
      v-model:show="showShare"
      title="立即分享给好友"
      :options="options"
      @select="onSelectChannel"
    />
  </div>
</template>

<script setup lang="ts">
import {
  NGSHARE_SHARE_CHANNEL,
  NGSHARE_CONTENT_TYPE,
} from '@/utils/ngShare/types'
import { ngshareByH5 } from '@/utils/ngShare/index'

interface ShareOption {
  name: string
  icon: string
  shareChannel: NGSHARE_SHARE_CHANNEL
}

const showShare = ref(false)
const options: ShareOption[] = [
  {
    name: '微信',
    icon: 'wechat',
    shareChannel: NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND,
  },
  {
    name: '微信朋友圈',
    icon: 'wechat',
    shareChannel: NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE,
  },
  {
    name: '微博',
    icon: 'weibo',
    shareChannel: NGSHARE_SHARE_CHANNEL.WEI_BO,
  },
]

const onSelectChannel = async (option: ShareOption): Promise<void> => {
  await ngshareByH5(NGSHARE_CONTENT_TYPE.LINK, option.shareChannel, {
    text: '分享文本',
    title: '分享标题',
    link: 'http://10.227.199.103:5173/#/reward-interaction',
    desc: '分享说明',
    // u3dshareThumb: '', // 分享缩略图地址(安卓必传)
  })
  showShare.value = false
}

const onClickShareBtn = async (): Promise<void> => {
  showShare.value = true
}
onMounted(() => {})
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
