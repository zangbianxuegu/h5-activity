<template>
  <div>
    <Teleport to="body">
      <van-overlay class="works-detail-overlay" :show="show">
        <div class="wrapper">
          <div class="works-detail-modal-body bg-cover bg-center bg-no-repeat">
            <div class="works-detail-modal-container">
              <div class="left">
                <div class="img-container">
                  <img
                    v-if="isExitsDesign"
                    id="img-container"
                    :src="worksData.worksImgSrc"
                    alt=""
                    srcset=""
                  />

                  <!-- 作品已删除 -->
                  <div
                    v-else
                    class="flex h-full w-full flex-col items-center justify-center"
                  >
                    <img
                      src="@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/no-exist.jpg"
                      alt="作品已删除"
                      class="h-[401px] w-[270px]"
                    />
                    <p class="mt-[10px] text-[48px] text-[#b8b8b8]">
                      作品已删除
                    </p>
                  </div>
                </div>

                <!-- 举报按钮和标识 -->
                <div
                  v-if="isOther && !worksData.isReported && isExitsDesign"
                  class="btn-report cursor-pointer bg-cover bg-center bg-no-repeat"
                  @click.stop="onClickReport"
                >
                  <span class="sr-only"> 举报 </span>
                </div>
                <div
                  v-if="isOther && worksData.isReported"
                  class="text-reported"
                >
                  已举报
                </div>
              </div>
              <div class="right" v-if="isExitsDesign">
                <div class="works-preview-basic-info">
                  <p v-if="worksData.id">
                    <span>编号：</span>
                    <span id="works-id"
                      >{{ worksData.id }}
                      <span
                        id="copy-works-id"
                        @click="onClickCopyWorksId"
                        class="btn-copy cursor-pointer"
                        >复制</span
                      >
                    </span>
                  </p>
                  <p>
                    <span>作者：</span>
                    <span>{{ worksData.author }}</span>
                  </p>
                  <p>
                    <span>作品：</span>
                    <span>{{ worksData.worksName }}</span>
                  </p>
                </div>
                <div class="line bg-cover bg-center bg-no-repeat"></div>
                <div class="works-preview-introduce">
                  <p>{{ worksData.worksIntroduce }}</p>
                </div>
                <div class="btn-group-bar">
                  <!-- 删除 -->
                  <div
                    v-if="isSelf"
                    @click.stop="onClickHandleBarDelete"
                    class="btn delete cursor-pointer"
                  >
                    <img :src="deleteBtnIcon" alt="" />
                  </div>
                  <!-- 收藏 -->
                  <div
                    v-if="isOther"
                    @click.stop="onClickHandleBarLike"
                    class="btn like cursor-pointer"
                  >
                    <img :src="likeBtnImg" alt="" />
                  </div>
                  <!-- 下载 -->
                  <div
                    @click.stop="onClickHandleBarDownload"
                    class="btn down cursor-pointer"
                  >
                    <img :src="downloadBtnIcon" alt="" />
                  </div>
                  <!-- 分享 -->
                  <div
                    v-if="
                      !isPC &&
                      isShowShareBtnAfterGetChannel &&
                      isShowShareBtnByChannel
                    "
                    @click.stop="onClickHandleBarShare"
                    class="btn share cursor-pointer"
                    id="WorksDetailModalShareBtn"
                  >
                    <img :src="shareBtnIcon" alt="" />
                  </div>
                </div>
              </div>
              <div
                class="btn-close cursor-pointer bg-contain bg-center bg-no-repeat"
                @click="onClickCloseModal"
              >
                <span class="sr-only">关闭</span>
              </div>
            </div>
          </div>
        </div>
      </van-overlay>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import throttle from 'lodash.throttle'
import { showToast } from 'vant'
import { showShare } from '@/utils/ngShare/share'
import qs from 'qs'
import { useBaseStore } from '@/stores/base'
import { saveImgToDeviceAlbum } from '@/utils/request'
import {
  ConfirmIconType,
  DesignDetailsType,
  EventDayOfDesign01,
} from '@/types/activity/dayofdesign01'
import {
  deleteDesignDetails,
  report,
  updateFavorites,
} from '@/apis/dayOfDesign01'
import { NgshareChannel, sharePlatformCodeOrder } from '@/utils/ngShare/types'
import { useEnvironment } from '@/composables/useEnvironment'
import likeBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-favorite.png'
import likedBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-favorited.png'
import deleteBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-delete.png'
import shareBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-share.png'
import downloadBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-download.png'
import { showConfirmDialog } from '@/utils/dayOfDesign01/confirmDialog'
import { webViewStatistics } from '@/apis/base'
import { useClipboard } from '@vueuse/core'
import {
  eventMap,
  type EventMapConfig,
  FILE_PICKER_POLICY_NAME,
  getShareH5PageUrl,
} from '@/constants/dayofdesign01'

/**
 * @param type self:自己作品详情，other:他人作品详情
 */
const props = defineProps<{
  type: DesignDetailsType
  event: EventDayOfDesign01
  show: boolean
  worksData: {
    id: string
    author: string
    worksName: string
    worksIntroduce: string
    worksImgSrc: string
    worksDecorateImgSrc: string
    isFavorite?: boolean
    isReported?: boolean
  }
  filePickerConfig: {
    policyName: string
    filePickerUrl: string
  }
  avtivityEvent?: EventDayOfDesign01 // 活动阶段事件
}>()

const isExitsDesign = ref(true)
watch(
  () => props.worksData.worksImgSrc,
  (newVal) => {
    const img = new Image()
    img.src = newVal
    img.onload = () => {
      isExitsDesign.value = true
    }
    img.onerror = () => {
      isExitsDesign.value = false
    }
  },
)

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      worksHandleModal.value.isShow = props.show
    }
  },
)

const isFavorite = ref(props.worksData.isFavorite)

watchEffect(() => {
  isFavorite.value = props.worksData.isFavorite
})

const emits = defineEmits<{
  'update:show': [show: boolean]
  'after-delete': []
  'update-favorite': [isFavorite: boolean]
  'after-report': []
}>()

// 没有传默认投稿期传值
const avtivityEvent: ComputedRef<EventDayOfDesign01> = computed(
  () => props.avtivityEvent || EventDayOfDesign01.Exhibit,
)

// 点赞按钮
const likeBtnImg = computed(() => {
  return isFavorite.value ? likedBtnIcon : likeBtnIcon
})

const isSelf = computed(() => {
  return props.type === DesignDetailsType.Self
})

const isOther = computed(() => {
  return props.type === DesignDetailsType.Other
})

const worksHandleModal = ref({
  isShow: false,
})

const shareData = ref({
  show: false,
})

const baseStore = useBaseStore()
const getLogoUrl = (): string => {
  return 'https://ma75.gsf.netease.com/sky_logo.png'
}

const environment = useEnvironment()
const isPC = computed(() => environment.isPC)

let isCanShareImg = true

watch(
  () => props.worksData.worksDecorateImgSrc,
  (newValue) => {
    const img = new Image()
    img.src = newValue
    // 审核图通过后，分享按钮显示
    img.onload = () => {
      isCanShareImg = true
    }
    // 未通过时，请求审核接口更新审核状态
    img.onerror = async () => {
      isCanShareImg = false
    }
  },
)

const shareLinkParams = computed(() => {
  return encodeURIComponent(
    qs.stringify({
      ch: baseStore.baseInfo.channel,
      d_id: props.worksData.id,
      d_name: props.worksData.worksName,
      d_author: props.worksData.author,
      d_introduce: props.worksData.worksIntroduce,
      d_img: props.worksData.worksImgSrc,
      d_img_share: props.worksData.worksDecorateImgSrc,
    }),
  )
})

const onClickReport = (): void => {
  showConfirmDialog('是否要举报这个作品？', ConfirmIconType.Report)
    .then(async () => {
      try {
        if (props.worksData.isReported) {
          showToast('已举报过该作品')
        } else {
          await report(FILE_PICKER_POLICY_NAME, props.worksData.id)
          emits('after-report')
          showToast('举报成功')
        }
      } catch (error: any) {
        showToast(error.message)
      }
    })
    .catch((error) => {
      console.log('cancel report', error)
    })
}

const currentEvent = eventMap.get(avtivityEvent.value) as EventMapConfig

// 在点击分享渠道前触发
const beforeClickShareChannel = (): void => {
  void webViewStatistics({
    module: currentEvent.statisticsModules.share,
    event: avtivityEvent.value,
  })
}

const isShowShareBtnAfterGetChannel = ref(false)
let sharePlatformCode = ''
const sharePlatform: NgshareChannel[] = []
let updateSharePlatformCodetimer: NodeJS.Timeout | string | number | undefined
// 异步获取分享渠道的code
const getSharePlatformCode = (): Promise<string> => {
  let intervalCount = 6
  return new Promise((resolve) => {
    updateSharePlatformCodetimer = setInterval(() => {
      intervalCount--
      // 如果配置接口请求不到，导致更新不了配置，默认全分享平台打开
      if (intervalCount === 0) {
        updateSharePlatformCodetimer &&
          clearInterval(updateSharePlatformCodetimer)
        resolve(baseStore.baseInfo.sharePlatformCode || '111111')
      } else {
        if (baseStore.baseInfo.sharePlatformCode) {
          updateSharePlatformCodetimer &&
            clearInterval(updateSharePlatformCodetimer)
          resolve(baseStore.baseInfo.sharePlatformCode)
        }
      }
    }, 500)
  })
}

// 根据渠道包获取分享可显示的分享平台
const getShareChannel = async (): Promise<void> => {
  sharePlatformCode = await getSharePlatformCode()
  isShowShareBtnByChannel.value = sharePlatformCode !== '000000'

  // 开启的分享平台(1开启，0关闭)
  function isOpen(codeValue: string): boolean {
    return codeValue === '1'
  }

  const codeArr = sharePlatformCode.split('')
  sharePlatformCodeOrder.forEach((channel, index) => {
    if (channel === 'wechat') {
      if (isOpen(codeArr[index])) {
        sharePlatform.push(NgshareChannel.WechatFriend)
        sharePlatform.push(NgshareChannel.WechatFriendCircle)
      }
    } else if (channel === 'douyin') {
      if (isOpen(codeArr[index]) && isCanShareImg) {
        sharePlatform.push(NgshareChannel.DouYin)
      }
    } else if (channel === 'bilibili' && isCanShareImg) {
      if (isOpen(codeArr[index])) {
        sharePlatform.push(NgshareChannel.Bilibili)
      }
    } else if (channel === 'weibo') {
      if (isOpen(codeArr[index])) {
        sharePlatform.push(NgshareChannel.Weibo)
      }
    } else if (channel === 'dashen') {
      if (isOpen(codeArr[index])) {
        sharePlatform.push(NgshareChannel.DaShenFriendCircle)
      }
    } else if (channel === 'xiaohongshu' && isCanShareImg) {
      if (isOpen(codeArr[index])) {
        sharePlatform.push(NgshareChannel.XiaoHongShu)
      }
    }
  })
  isShowShareBtnAfterGetChannel.value = true
}
const onClickHandleBarShare = (): void => {
  const shareInfo = currentEvent.shareInfo
  shareData.value.show = true
  showShare(
    { targetElByHover: '#WorksDetailModalShareBtn' },
    sharePlatform,
    {
      title: shareInfo.getTitle(),
      text: shareInfo.getText(props.worksData.worksName),
      desc: shareInfo.getDesc(props.worksData.worksName),
      link: `${getShareH5PageUrl()}${shareLinkParams.value}`,
      u3dshareThumb: getLogoUrl(), // 分享缩略图地址(安卓必传)
      shareThumb: getLogoUrl(),
    },
    {
      title: shareInfo.getTitle(),
      text: currentEvent.shareInfo.getText(props.worksData.worksName),
      image: props.worksData.worksDecorateImgSrc || '',
    },
    beforeClickShareChannel,
  )
}

// 点击删除作品按钮
const onClickHandleBarDelete = async (): Promise<void> => {
  void showConfirmDialog('确认删除投稿作品？').then(async () => {
    try {
      const res = await deleteDesignDetails(
        props.filePickerConfig.policyName,
        props.worksData.id,
        props.worksData.worksImgSrc,
      )
      if (res) {
        showToast('删除成功')
      }
      setTimeout(() => {
        emits('after-delete')
        onClickCloseModal()
      }, 500)
    } catch (error) {
      showToast('网络波动，删除失败，请稍后再试')
      console.error(error)
    }
  })
}

// 点击下载按钮，下载作品拼装图
const onClickHandleBarDownload = async (): Promise<void> => {
  try {
    void webViewStatistics({
      module: currentEvent.statisticsModules.download,
      event: avtivityEvent.value,
    })
    const worksDecorateImgSrc = props.worksData.worksDecorateImgSrc
    if (worksDecorateImgSrc) {
      const res = await saveImgToDeviceAlbum(worksDecorateImgSrc)
      if (res) {
        showToast('下载成功')
      }
    }
  } catch (error: any) {
    showToast('下载失败')
  }
}

// 点击收藏按钮
const handleLike = async (): Promise<void> => {
  try {
    if (props.type === DesignDetailsType.Other) {
      await updateFavorites(
        props.worksData.id,
        !isFavorite.value,
        props.event,
        props.filePickerConfig.policyName,
      )
      showToast(!isFavorite.value ? '已成功添加至我的收藏' : '取消收藏成功')
      isFavorite.value = !isFavorite.value
      emits('update-favorite', isFavorite.value)
    }
  } catch (error: any) {
    showToast(error?.message as string)
  }
}
// 后端也是1s CD
const onClickHandleBarLike = throttle(handleLike, 1000, {
  trailing: false,
})

const { copy, isSupported } = useClipboard({ legacy: true })
const onClickCopyWorksId = async (): Promise<void> => {
  if (!isSupported.value) {
    showToast('未授权,不支持')
    return
  }
  // 执行复制操作
  await copy(props.worksData.id)
  showToast('编号已复制到剪贴板！')
}

const onClickCloseModal = (): void => {
  emits('update:show', false)
}

const isShowShareBtnByChannel = ref(true)

onMounted(async () => {
  await getShareChannel()
})

onBeforeUnmount(() => {
  if (updateSharePlatformCodetimer) {
    clearInterval(updateSharePlatformCodetimer)
  }
})
</script>

<style lang="scss" scoped>
// 查看稿件开始
.works-detail-overlay {
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.works-detail-modal-body {
  width: 1831px;
  height: 961px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/bg-works-detail.png');
  .works-detail-modal-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0 30px 30px;
  }

  .left {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    .img-container {
      width: 1200px;
      height: 900px;
      border-radius: 40px;
      background-color: #fff;
      & > img {
        width: 100%;
        height: 100%;
      }
    }
    .btn-report {
      width: 130px;
      height: 114px;
      position: absolute;
      top: 23px;
      right: 31px;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-report.png');
      &:hover {
        background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-report-hover.png');
      }
    }
    .text-reported {
      width: 136px;
      height: 46px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 24px;
      right: 24px;
      border-radius: 20px;
      color: #fff;
      background-color: rgba(229, 100, 76, 1);
      font-size: 28px;
    }
  }
  .right {
    width: 600px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 80px 60px;
    color: #ababab;
    font-size: 40px;
    color: #fff;
    .works-preview-basic-info {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 30px;
      p {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        line-height: 36px;
        position: relative;
        span {
          position: relative;
          font-size: 36px;
          color: #7c6354;
          font-family: SourceHanSansCN-Regular;
          .btn-copy {
            width: 100px;
            height: 46px;
            position: absolute;
            top: 50%;
            right: -100%;
            transform: translate(-30%, -50%);
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #8c7669;
            box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
            border-radius: 23px;
            font-size: 28px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #fff;
          }
        }
      }
    }
    .line {
      width: 480px;
      height: 2px;
      margin: 37px 0 25px 0;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/line-dot.png');
    }
    .works-preview-introduce {
      width: 100%;
      flex: 1;
      overflow: hidden;
      p {
        font-size: 30px;
        color: #7c6354;
        font-family: SourceHanSansCN-Regular;
        line-height: 50px;
        word-wrap: break-word; /* 适用于较旧的浏览器 */
        overflow-wrap: break-word;
      }
    }
    .btn-group-bar {
      width: 100%;
      height: 128px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 57px;
      font-size: 108px;
      & > .btn {
        width: 121px;
        height: 121px;
        background-color: rgba(90, 77, 65, 0.6);
        border-radius: 30px;
        box-sizing: border-box;
        &:hover {
          border: 5px solid #fff;
        }
        &.delete img {
          padding: 24px;
        }
      }
    }
  }
}
.btn-close {
  width: 49px;
  height: 49px;
  position: absolute;
  top: 32px;
  right: 32px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-close-works-details.png');
}
// 查看稿件结束
</style>
