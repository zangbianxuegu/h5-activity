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
import { NgshareChannel, NgshareContentType } from '@/utils/ngShare/types'
import { ngshareByH5 } from '@/utils/ngShare/index'
// import { useBaseStore } from '@/stores/base'

interface ShareOption {
  name: string
  icon: string
  shareChannel: NgshareChannel
}

const showShare = ref(false)
const options: ShareOption[] = [
  {
    name: '微信朋友圈',
    icon: 'wechat',
    shareChannel: NgshareChannel.WECHAT_FRIEND_CIRCLE,
  },
  {
    name: '微信',
    icon: 'wechat',
    shareChannel: NgshareChannel.WECHAT_FRIEND,
  },
  {
    name: '抖音',
    icon: 'weibo',
    shareChannel: NgshareChannel.DOU_YIN,
  },
  {
    name: '哔哩哔哩',
    icon: 'weibo',
    shareChannel: NgshareChannel.BILIBILI,
  },
  {
    name: '微博',
    icon: 'weibo',
    shareChannel: NgshareChannel.WEI_BO,
  },
  {
    name: '网易大神圈子',
    icon: 'weibo',
    shareChannel: NgshareChannel.DA_SHEN_FRIEND_CIRCLE,
  },
  {
    name: '小红书',
    icon: 'weibo',
    shareChannel: NgshareChannel.XIAO_HONG_SHU,
  },
  {
    name: '网易大神好友',
    icon: 'weibo',
    shareChannel: NgshareChannel.DA_SHEN_FRIEND,
  },
]

// const baseStore = useBaseStore()

const onSelectChannel = async (option: ShareOption): Promise<void> => {
  const shareLinkList = [
    NgshareChannel.WECHAT_FRIEND_CIRCLE,
    NgshareChannel.WECHAT_FRIEND,
    NgshareChannel.WEI_BO,
    NgshareChannel.DA_SHEN_FRIEND_CIRCLE,
    NgshareChannel.DA_SHEN_FRIEND,
  ]
  const shareImgList = [
    NgshareChannel.BILIBILI,
    NgshareChannel.DOU_YIN,
    NgshareChannel.XIAO_HONG_SHU,
  ]
  const contentType = shareLinkList.includes(option.shareChannel)
    ? NgshareContentType.LINK
    : NgshareContentType.IMAGE
  let shareConfig = {}
  if (shareLinkList.includes(option.shareChannel)) {
    shareConfig = {
      text: '分享文本',
      title: '分享标题',
      link: 'http://10.227.199.103:5174/pages/debug/index.html',
      desc: '分享说明',
      // u3dshareThumb: ['netease', 'app_store'].includes(
      //   baseStore.baseInfo.channel,
      // )
      //   ? 'https://webinput.nie.netease.com/img/sky/icon.png/128'
      //   : 'https://sky.res.netease.com/m/zt/20230707161622/img/logo_b01c9a2.png', // 分享缩略图地址(安卓必传)
    }
  } else if (shareImgList.includes(option.shareChannel)) {
    shareConfig = {
      text: '分享文本',
      title: '分享标题',
      image: 'http://10.227.199.103:7897/images/f104f32f22ed2ea586fdcc801.png',
      desc: '分享说明',
      // 'https://img2.baidu.com/it/u=1337068678,3064275007&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750',
    }
  }
  await ngshareByH5(contentType, option.shareChannel, shareConfig)
  showShare.value = false
}

const onClickShareBtn = async (): Promise<void> => {
  showShare.value = true
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
