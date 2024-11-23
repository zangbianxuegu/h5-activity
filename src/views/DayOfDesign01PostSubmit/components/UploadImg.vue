<template>
  <div class="flex h-full w-full items-center justify-center">
    <div
      class="upload-img-container flex h-full w-full items-center justify-center"
      @click="onClickGoToUploadWorks"
    >
      <div
        v-show="!data"
        class="img-wait-upload-container flex items-center justify-center"
      >
        <div class="upload-btn-container flex items-center justify-center">
          <div class="icon-container">
            <van-icon name="plus" />
          </div>
        </div>
        <!-- 隐藏触发上传稿件的元素 -->
        <input
          ref="imageUploadsInputDomRef"
          type="file"
          id="image_uploads_cut_test"
          name="image_uploads"
          :accept="accept"
          v-show="false"
        />
      </div>
      <div
        v-show="data"
        class="img-uploaded-container h-full w-full items-center justify-center"
      >
        <!-- 删除作品按钮 -->
        <div
          v-if="data"
          class="remove-upload-icon"
          @click.stop="removeUploadImg"
        >
          <van-icon name="cross" :max-count="1" :deletable="false" />
        </div>
        <!-- 作品图 -->
        <img ref="formWorksRef" :src="imgDataBase64" alt="" srcset="" />
      </div>
    </div>

    <!-- 裁剪弹窗 -->
    <Teleport to="body">
      <van-overlay class="cropper-modal-container" :show="cropperData.isShow">
        <div class="modal-wrapper">
          <div class="modal-body flex flex-col items-center justify-center">
            <div
              class="cropper-container-header flex w-full items-center justify-between"
            >
              <div @click="onClickCancelCropper" class="btn-cancel-cropper">
                <van-icon name="arrow-left" />
              </div>
              <div class="btn-cancel-cropper flex-1"></div>
              <div @click="onClickFinishCropper" class="btn-cancel-cropper">
                完成
              </div>
            </div>
            <div class="cropper-container-body">
              <div id="upload_img_cut_test_container" @click.stop>
                <img
                  id="img-container"
                  :src="cropperData.preCropperImgUrl"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="cropper-container-footer flex items-center justify-center"
            >
              已截取分辨率: 1200 * 900
            </div>
          </div>
        </div>
      </van-overlay>
    </Teleport>
    <!-- 裁剪弹窗边框样式 -->
    <Teleport to=".cropper-view-box" v-if="cropperData.isShowBorderCorn">
      <div class="cropper-corner left-top-corner"></div>
      <div class="cropper-corner right-top-corner"></div>
      <div class="cropper-corner right-bottom-corner"></div>
      <div class="cropper-corner left-bottom-corner"></div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { useEnvironment } from '@/composables/useEnvironment'
import { blobToUrl } from '@/utils/file'
import { showToast, showLoadingToast, closeToast, showImagePreview } from 'vant'

/**
 * @description: 上传图片组件（包含裁剪功能）
 * @param {any} data 上传图片数据
 * @param {string} accept 上传图片类型
 * @param {boolean} previewFullImage 预览图片是否全屏
 * @param {boolean} disabled 是否禁用
 * @param {boolean} readonly 是否只读
 * @param {boolean} deletable 是否可删除
 * @param {() => void} afterRead 上传后的回调
 * @param {() => void} beforeRead 上传前的回调
 * @param {() => void} beforeDelete 删除前的回调
 * @param {number} maxSize 上传图片体积的最大限制
 * @param {number} minSize 上传图片体积的最小限制
 * @param {boolean} reupload 是否可重新上传
 */
interface UploadImgProps {
  data: any
  accept?: string
  previewFullImage?: boolean
  reupload?: boolean
  disabled?: boolean
  readonly?: boolean
  deletable?: boolean
  afterRead?: () => void
  beforeRead?: () => void
  beforeDelete?: () => void
  maxSize?: number
  minSize?: number
  cropper?: boolean
}

const props = withDefaults(defineProps<UploadImgProps>(), {
  accept: 'image/png, image/jpg, image/jpeg',
  reupload: false,
})

const emits = defineEmits<{
  (e: 'update:data', value: any): void
  (e: 'afterRead', value: any): void
  (e: 'beforeRead', value: any): void
  (e: 'beforeDelete'): void
  (e: 'reupload', value: any): void
}>()

const { isIos } = useEnvironment()

const updateFileData = (data: Blob): void => {
  emits('update:data', data)
}

const imgDataBase64 = ref()
watch(
  () => props.data,
  async (newVal) => {
    if (newVal) {
      imgDataBase64.value = await blobToUrl(newVal)
    }
  },
)

// 作品上传相关
const imageUploadsInputDomRef = ref()
const onClickGoToUploadWorks = (): void => {
  if (!props.data) {
    imageUploadsInputDomRef.value.click()
  } else {
    if (props.reupload) {
      imageUploadsInputDomRef.value.click()
    } else if (props.previewFullImage) {
      showImagePreview([imgDataBase64.value])
    }
  }
}

// 删除上传图片
const removeUploadImg = (): void => {
  emits('beforeDelete')
  emits('update:data', null)
}

// 作品裁剪
let CROPPER: Cropper | null
const cropperData = ref({
  isShow: false,
  preCropperImgUrl: '',
  isShowBorderCorn: false,
})

watch(
  () => cropperData.value.isShow,
  (newValue) => {
    if (newValue) {
      const img = new Image()
      img.src = cropperData.value.preCropperImgUrl
      img.onload = function () {
        setTimeout(() => {
          // 添加裁剪边框的边角修饰
          cropperData.value.isShowBorderCorn = true
        }, 500)
      }
    } else {
      cropperData.value.isShowBorderCorn = false
    }
  },
)

// 添加上传作品的监听
const listenUploadImgChange = (): void => {
  imageUploadsInputDomRef.value.addEventListener(
    'change',
    function (event: Event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      const file = files[0]

      // 设置允许的文件格式和文件大小限制
      const allowedTypes = props.accept
      const maxSizeLimit = 10 * 1024 * 1024 // 10 MB
      const minSizeLimit = 100 * 1024 // 100kb

      if (file) {
        // 检查文件类型
        if (!allowedTypes.includes(file.type)) {
          showToast('上传失败，只能上传png和jpg')
          return
        }
        // 检查文件大小
        if (props.maxSize && file.size > maxSizeLimit) {
          showToast('您选择的图片大小超过10MB，无法上传')
          return
        } else if (props.minSize && file.size < minSizeLimit) {
          showToast('您选择的图片过小，可能会影响展示效果')
        }

        if (props.cropper) {
          showLoadingToast({
            message: '准备裁剪中...',
            forbidClick: true,
            duration: 0,
          })
          const reader = new FileReader()
          reader.readAsDataURL(file) // 读取文件为 Data URL
          reader.onload = function (e) {
            const readFileResult = e.target?.result as string
            const img = new Image()
            img.src = readFileResult
            img.onload = async () => {
              const width = img.width // 获取图像的宽度
              const height = img.height // 获取图像的高度
              if (isIos && (width * height) / 1000000 > 15) {
                // 处理ios MP影响
                showToast(
                  '您选择的图片像素过大，无法上传，建议按照模板上传1200*900的图片',
                )
              } else {
                cropperData.value.isShow = true
                cropperData.value.preCropperImgUrl = readFileResult
                await nextTick()
                showCropperModal()
              }
            }
          }
        } else {
          updateFileData(file)
        }
      }
    },
  )
}

// 展示裁剪
const showCropperModal = (): void => {
  const image = document.querySelector(
    '#upload_img_cut_test_container img',
  ) as HTMLImageElement
  CROPPER?.destroy()
  CROPPER = new Cropper(image, {
    aspectRatio: 4 / 3,
    background: false,
    highlight: true,
    center: false,
    viewMode: 3,
    minCropBoxWidth: 1200,
    minCropBoxHeight: 900,
    cropBoxResizable: false,
    cropBoxMovable: false,
    responsive: true, // 响应式
    dragMode: 'move',
    ready: () => {
      closeToast()
    },
  })
}

// 完成裁剪
const onClickFinishCropper = (): void => {
  try {
    // getCroppedCanvas方法可以将裁剪区域的数据转换成canvas数据
    const cropperCanvas = CROPPER?.getCroppedCanvas({
      width: 1200,
      height: 900,
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    }) as HTMLCanvasElement

    cropperCanvas?.toBlob((blob): void => {
      void (async function (blob) {
        updateFileData(blob as Blob)
      })(blob)
      hideCropperModal()
    })
  } catch (error) {
    console.log('error', error)
  }
}

// 隐藏裁剪
const hideCropperModal = (): void => {
  cropperData.value.isShow = false
  cropperData.value.preCropperImgUrl = ''
  imageUploadsInputDomRef.value.value = ''
}

// 取消裁剪
const onClickCancelCropper = (): void => {
  hideCropperModal()
}

onMounted(() => {
  listenUploadImgChange()
})
</script>

<style scoped lang="scss">
// 预览弹窗
.works-preview-modal {
  padding: 20px 60px;
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .modal-body {
      height: calc(100% - 100px);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-footer {
      height: 100px;
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
// 裁剪区域开始
img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
#upload_img_cut_test_container {
  width: 1200px;
  height: 900px;
}
.cropper-modal-container {
  .modal-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .modal-body {
      width: 1200px;
      height: calc(100% - 70px);
      display: flex;
      justify-content: center;
      align-items: center;
      .cropper-container-header,
      .cropper-container-footer {
        color: #fff;
      }
    }
  }
}
// 裁剪区域结束
.upload-img-container {
}
// 待upload区域
.img-wait-upload-container {
}
// 已upload区域
.img-uploaded-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  // 删除图片icon
  .remove-upload-icon {
    // width: 50px;
    // height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    position: absolute;
    top: 0px;
    right: 0;
    padding: 15px 15px 5px 5px;
    border-radius: 50%;
    font-size: 40px;
    color: #fff;
    background-color: #918d8d;
  }
  img {
    height: 100%;
    width: fit-content;
  }
}
</style>
<style lang="scss">
.cropper-dashed {
  opacity: 0;
}
.cropper-view-box {
  outline: none;
  display: inline-block;
  position: relative;
}
.cropper-corner {
  width: 40px;
  height: 40px;
  border: 5px solid #fff;
  &.left-top-corner {
    position: absolute;
    top: 0;
    left: 0;
    border-right: none;
    border-bottom: none;
  }
  &.right-top-corner {
    position: absolute;
    top: 0;
    right: 0;
    border-left: none;
    border-bottom: none;
  }
  &.right-bottom-corner {
    position: absolute;
    bottom: 0;
    right: 0;
    border-top: none;
    border-left: none;
  }
  &.left-bottom-corner {
    position: absolute;
    bottom: 0;
    left: 0;
    border-top: none;
    border-right: none;
  }
}
.van-uploader {
  width: 100%;
  height: 100%;
  .van-uploader__wrapper {
    width: 100%;
    height: 100%;
    .van-uploader__preview {
      width: 100%;
      height: 100%;
      .van-uploader__preview-image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
