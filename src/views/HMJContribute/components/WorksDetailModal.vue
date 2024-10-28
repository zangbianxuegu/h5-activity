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
                    <div @click.stop="onClickHandleBarShare">
                      <van-icon name="share-o" />
                    </div>
                    <div @click.stop="onClickHandleBarDelete">
                      <van-icon name="delete-o" />
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
import { showConfirmDialog, showToast } from 'vant'
import { showShare } from '@/utils/ngShare/share'
import axios from 'axios'
import ClipboardJS from 'clipboard'
import { useBaseStore } from '@/stores/base'

const props = defineProps<{
  show: boolean
  worksData: {
    id: string
    author: string
    worksName: string
    worksIntroduce: string
    worksImgSrc: string
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
const emits = defineEmits(['update:show', 'updateWorksData'])

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

const onClickHandleBarShare = (): void => {
  showToast('分享')
  shareData.value.show = true
  showShare(
    [],
    {
      text: '分享文本',
      title: '分享标题',
      link: 'http://10.227.199.103:5173/pages/debug/index.html',
      desc: '分享说明',
      u3dshareThumb: getLogoUrl(), // 分享缩略图地址(安卓必传)
      shareThumb: getLogoUrl(),
    },
    {
      text: '分享文本',
      title: '分享标题',
      // image: props.worksData.worksImgSrc,
      image:
        'https://img2.baidu.com/it/u=1337068678,3064275007&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=750',
    },
  )
}

let userId = ''
const getUserId = async (): Promise<void> => {
  const response = await fetch('https://api.ipify.org?format=json')
  const data = await response.json()
  userId = data.ip.split('.').join('')
}
const onClickHandleBarDelete = async (): Promise<void> => {
  showConfirmDialog({
    title: '',
    message: '确认删除投稿作品？',
  })
    .then(async () => {
      const { data } = await axios.get(
        'http://10.227.199.103:7897/ma75WXJ/deleteWorks',
        {
          params: {
            userId,
          },
        },
      )

      showToast(data.message)
      setTimeout(() => {
        emits('updateWorksData', {
          id: '',
          author: '',
          worksName: '',
          worksIntroduce: '',
          worksImgSrc: '',
          checkStatus: undefined,
        })
        onClickCloseModal()

        // location.reload()
      }, 500)
    })
    .catch(() => {
      // on cancel
    })
}

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

onMounted(async () => {
  await getUserId()
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
