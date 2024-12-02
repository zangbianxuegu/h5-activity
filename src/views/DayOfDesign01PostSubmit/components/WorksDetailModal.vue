<template>
  <div>
    <Teleport to="body">
      <van-overlay class="works-detail-overlay" :show="show">
        <div class="wrapper">
          <div class="works-detail-modal-body bg-cover bg-center bg-no-repeat">
            <div class="works-detail-modal-container">
              <div class="left">
                <img
                  id="img-container"
                  :src="worksData.worksImgSrc"
                  alt=""
                  srcset=""
                />
              </div>
              <div class="right">
                <div class="works-preview-basic-info">
                  <p>
                    <span>编号：</span>
                    <span id="works-id">{{ worksData.id }}</span>
                    <span
                      id="copy-works-id"
                      @click="onClickCopyWorksId"
                      class="btn-copy cursor-pointer"
                      >复制</span
                    >
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
                  <!-- 收藏 -->
                  <div
                    v-if="isOther"
                    @click.stop="throttleClickShare"
                    :class="['btn', 'like', 'cursor-pointer']"
                  >
                    <img :src="likeBtnImg" alt="" />
                  </div>
                  <!-- 下载 -->
                  <div
                    v-if="isSelf"
                    @click.stop="onClickHandleBarDownload"
                    :class="['btn', 'down', 'cursor-pointer']"
                  >
                    <img :src="downloadBtnIcon" alt="" />
                  </div>
                  <!-- 分享 -->
                  <div
                    v-if="isShowShareBtn"
                    @click.stop="onClickHandleBarShare"
                    :class="['btn', 'share', 'cursor-pointer']"
                    id="WorksDetailModalShareBtn"
                  >
                    <img :src="shareBtnIcon" alt="" />
                  </div>
                  <!-- 删除 -->
                  <div
                    @click.stop="onClickHandleBarDelete"
                    :class="['btn', 'delete', 'cursor-pointer']"
                  >
                    <img :src="deleteBtnIcon" alt="" />
                  </div>
                </div>
              </div>
              <div
                class="btn-close cursor-pointer bg-contain bg-center bg-no-repeat"
                @click="onClickCloseModal"
              ></div>
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
import ClipboardJS from 'clipboard'
import qs from 'qs'
import { useBaseStore } from '@/stores/base'
import { saveImgToDeviceAlbum } from '@/utils/request'
import { DESIGN_DETAILS_TYPE } from '@/types/activity/dayofdesign01'
import {
  deleteDesignDetails,
  reviewShareDesign,
  updateFavorites,
} from '@/apis/dayOfDesign01'
import { NGSHARE_SHARE_CHANNEL } from '@/utils/ngShare/types'
import { useEnvironment } from '@/composables/useEnvironment'
import { FILE_PICKER_POLICY_NAME } from '@/constants/dayofdesign01'
import likeBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-favorite.png'
import likedBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-favorited.png'
import deleteBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-delete.png'
import shareBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-share.png'
import downloadBtnIcon from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-share-btn-download.png'
import { showConfirmDialog } from '@/utils/dayOfDesign01/confirmDialog'

/**
 * @param type self:自己作品详情，other:他人作品详情
 */
const props = defineProps<{
  type: DESIGN_DETAILS_TYPE
  event: string
  show: boolean
  worksData: {
    id: string
    author: string
    worksName: string
    worksIntroduce: string
    worksImgSrc: string
    worksDecorateImgSrc: string
    isFavorite?: boolean
  }
  filePickerConfig: {
    policyName: string
    filePickerUrl: string
  }
}>()

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      worksHandleModal.value.isShow = props.show
    }
  },
)

watch(
  () => props.worksData.isFavorite,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      isFavorite.value = newVal
    }
  },
)
const emits = defineEmits(['update:show', 'afterDelete', 'update-favorite'])

const isFavorite = ref(props.worksData.isFavorite)

// 点赞按钮
const likeBtnImg = computed(() => {
  return isFavorite.value ? likedBtnIcon : likeBtnIcon
})

const isSelf = computed(() => {
  return props.type === DESIGN_DETAILS_TYPE.SELF
})

const isOther = computed(() => {
  return props.type === DESIGN_DETAILS_TYPE.OTHER
})

const worksHandleModal = ref({
  isShow: false,
})

const shareData = ref({
  show: false,
})

const baseStore = useBaseStore()
const getLogoUrl = (): string => {
  return ['netease', 'app_store'].includes(baseStore.baseInfo.channel)
    ? 'https://webinput.nie.netease.com/img/sky/icon.png/128'
    : 'https://sky.res.netease.com/m/zt/20230707161622/img/logo_b01c9a2.png'
}

const environment = useEnvironment()
const isPC = computed(() => environment.isPC)

const isShowShareBtn = ref(true)

watch(
  () => props.worksData.worksDecorateImgSrc,
  (newValue) => {
    if (isPC.value) {
      isShowShareBtn.value = false
    } else {
      const img = new Image()
      img.src = newValue
      // 审核图通过后，分享按钮显示
      img.onload = () => {
        isShowShareBtn.value = true
      }
      // 未通过时，请求审核接口更新审核状态
      img.onerror = async () => {
        isShowShareBtn.value = false
        const { id } = props.worksData
        reviewShareDesign(id, FILE_PICKER_POLICY_NAME)
          .then(() => {
            isShowShareBtn.value = true
          })
          .catch(() => {
            isShowShareBtn.value = false
          })
      }
    }
  },
)

const shareLinkParams = computed(() => {
  return encodeURIComponent(
    qs.stringify({
      d_id: props.worksData.id,
      d_name: props.worksData.worksName,
      d_author: props.worksData.author,
      d_introduce: props.worksData.worksIntroduce,
      d_img: props.worksData.worksImgSrc,
      d_img_share: props.worksData.worksDecorateImgSrc,
    }),
  )
})

const onClickHandleBarShare = (): void => {
  console.log(
    `http://10.227.199.103:3000/dayofdesign01.html?${shareLinkParams.value}`,
  )

  shareData.value.show = true
  showShare(
    { targetElByHover: '#WorksDetailModalShareBtn' },
    props.worksData.worksDecorateImgSrc
      ? []
      : [
          NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND,
          NGSHARE_SHARE_CHANNEL.WECHAT_FRIEND_CIRCLE,
          NGSHARE_SHARE_CHANNEL.WEI_BO,
          NGSHARE_SHARE_CHANNEL.DA_SHEN_FRIEND_CIRCLE,
        ],
    {
      title: '绘梦节分享标题',
      text: '绘梦节分享文本',
      // link: `https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/h5_dev/dayofdesign01.html?${shareLinkParams.value}`,
      link: `http://10.227.199.103:3000/dayofdesign01.html?${shareLinkParams.value}`,
      desc: '绘梦节分享说明',
      u3dshareThumb: getLogoUrl(), // 分享缩略图地址(安卓必传)
      shareThumb: getLogoUrl(),
    },
    {
      title: '绘梦节分享标题',
      text: '绘梦节分享文本',
      image: props.worksData.worksDecorateImgSrc || '',
    },
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
        emits('afterDelete')
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
    // const module = 'day_of_design_download'
    // void webViewStatistics({ module })
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
const onClickHandleBarLike = async (): Promise<void> => {
  try {
    // const module = 'day_of_design_share'
    // void webViewStatistics({ module })
    if (props.type === DESIGN_DETAILS_TYPE.OTHER) {
      await updateFavorites(
        props.worksData.id,
        !isFavorite.value,
        props.event,
        props.filePickerConfig.policyName,
      )
      showToast(!isFavorite.value ? '收藏成功' : '取消收藏成功')
      isFavorite.value = !isFavorite.value
      emits('update-favorite', isFavorite)
    }
  } catch (error: any) {
    showToast(error?.message as string)
  }
}
// 后端也是1s CD
const throttleClickShare = throttle(onClickHandleBarLike, 1000, {
  trailing: false,
})

const onClickCopyWorksId = (): void => {
  // eslint-disable-next-line no-new
  new ClipboardJS('#copy-works-id', {
    text: function () {
      return document.querySelector('#works-id')?.textContent as string
    },
  })
  showToast('编号已复制到剪贴板！')
}

const onClickCloseModal = (): void => {
  emits('update:show', false)
}

onMounted(async () => {})
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
    justify-content: flex-end;
    img {
      width: 1200px;
      height: 900px;
      border-radius: 40px;
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
      height: 228px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 30px;
      p {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .btn-copy {
          width: 100px;
          height: 47px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 24px;
          background-color: #e4f9ff;
          box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
          border-radius: 23px;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #5a7191;
        }
        span {
          font-size: 36px;
          color: #5a7191;
          font-family: SourceHanSansCN-Regular;
        }
      }
    }
    .line {
      width: 480px;
      height: 2px;
      margin: 37px 0 30px 0;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/line-dot.png');
    }
    .works-preview-introduce {
      width: 100%;
      flex: 1;
      p {
        font-size: 30px;
        color: #5a7191;
        font-family: SourceHanSansCN-Regular;
        line-height: 50px;
      }
    }
    .btn-group-bar {
      width: 100%;
      height: 128px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 108px;
      & > .btn {
        width: 121px;
        height: 121px;
        background-color: rgba(90, 113, 145, 0.6);
        border-radius: 30px;
        box-sizing: border-box;
        &:hover {
          border: 3px solid #fff;
        }
        &.delete img {
          padding: 24px;
        }
      }
    }
  }
}
.btn-close {
  width: 69px;
  height: 69px;
  position: absolute;
  top: 32px;
  right: 32px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-close.png');
}
// 查看稿件结束
</style>
