<template>
  <div>
    <Teleport to="body">
      <van-overlay class="works-detail-overlay" :show="show">
        <div class="wrapper">
          <div class="works-detail-modal-body modal-body">
            <div class="works-detail-modal-container">
              <div id="works-detail-modal">
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
                      <span>编号: </span>
                      <span id="works-id">{{ worksData.id }}</span>
                      <van-icon
                        id="copy-works-id"
                        name="description-o"
                        @click="onClickCopyWorksId"
                      />
                    </p>
                    <p>
                      <span>作品名: </span>
                      <span>{{ worksData.worksName }}</span>
                    </p>
                    <p>
                      <span>作者名: </span>
                      <span>{{ worksData.author }}</span>
                    </p>
                  </div>
                  <div class="works-preview-introduce">
                    <span>作品介绍：</span>
                    <p>{{ worksData.worksIntroduce }}</p>
                  </div>
                  <div class="handle-bar">
                    <div v-if="!isPC" @click.stop="onClickHandleBarShare">
                      <van-icon name="share-o" />
                    </div>
                    <div @click.stop="onClickHandleBarDelete">
                      <van-icon name="delete-o" />
                    </div>
                    <div v-if="isSelf" @click.stop="onClickHandleBarDownload">
                      <van-icon name="down" />
                    </div>
                    <div v-if="isOther" @click.stop="throttleClickShare">
                      <van-icon :name="favorite ? 'like' : 'like-o'" />
                    </div>
                  </div>
                </div>
                <div class="btn-close" @click="onClickCloseModal">
                  <van-icon name="cross" />
                </div>
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
import { showConfirmDialog, showToast } from 'vant'
import { showShare } from '@/utils/ngShare/share'
import ClipboardJS from 'clipboard'
import { useBaseStore } from '@/stores/base'
import { saveImgToDeviceAlbum } from '@/utils/request'
import { DESIGN_DETAILS_TYPE } from '@/types/activity/dayofdesign01'
import { deleteDesignDetails, updateFavorites } from '@/apis/dayOfDesign01'
import { NGSHARE_SHARE_CHANNEL } from '@/utils/ngShare/types'
import { useEnvironment } from '@/composables/useEnvironment'

/**
 * @param type self:自己作品详情，other:他人作品详情
 */
const props = defineProps<{
  type: DESIGN_DETAILS_TYPE
  event: string
  show: boolean
  favorite?: boolean
  worksData: {
    id: string
    author: string
    worksName: string
    worksIntroduce: string
    worksImgSrc: string
    worksDecorateImgSrc: string
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
const emits = defineEmits(['update:show', 'update:favorite', 'afterDelete'])

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

const onClickHandleBarShare = (): void => {
  shareData.value.show = true
  showShare(
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
      link: 'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/h5_dev/dayofdesign01.html',
      // link: 'http://10.227.199.103:3000/dayofdesign01.html',
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
  void showConfirmDialog({
    title: '',
    message: '确认删除投稿作品？',
  }).then(async () => {
    // on confirm
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
      }, 500)
    } catch (error) {
      showToast('删除失败')
      console.error(error)
    }
  })
}

// 点击下载按钮，下载作品拼装图
const onClickHandleBarDownload = async (): Promise<void> => {
  try {
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
    const favoriteResult = !props.favorite
    if (props.type === DESIGN_DETAILS_TYPE.OTHER) {
      await updateFavorites(
        props.worksData.id,
        favoriteResult,
        props.event,
        props.filePickerConfig.policyName,
      )
      showToast(favoriteResult ? '收藏成功' : '取消收藏成功')
      emits('update:favorite', !props.favorite)
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
    .modal-body {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.works-detail-modal-body {
  height: 100%;
  .works-detail-modal-container {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #works-detail-modal {
    height: 900px;
    width: 1788px;
    display: flex;
    justify-content: center;
    align-items: center;
    .left {
      width: 1200px;
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
      width: calc(1788px - 1200px);
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding-left: 80px;
      color: #ababab;
      font-size: 40px;
      color: #fff;
      .works-preview-basic-info {
        width: 100%;
        height: 228px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
          span {
            margin-right: 10px;
          }
        }
      }
      .works-preview-introduce {
        width: 100%;
        flex: 1;
      }
      .handle-bar {
        width: 100%;
        height: 128px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 108px;
        & > div {
          margin-right: 70px;
        }
      }
    }
  }
}
.btn-close {
  position: absolute;
  top: 26px;
  right: 64px;
  font-size: 100px;
  color: #fff;
}
// 查看稿件结束
</style>
