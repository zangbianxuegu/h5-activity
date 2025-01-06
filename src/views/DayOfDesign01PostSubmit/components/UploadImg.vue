<template>
  <div class="flex h-full w-full items-center justify-center">
    <div
      class="upload-img-container flex h-full w-full cursor-pointer items-center justify-center"
      @click="onClickGoToUploadWorks"
    >
      <div
        v-show="!data"
        class="img-wait-upload-container flex items-center justify-center"
      >
        <div
          class="upload-btn-container flex flex-col items-center justify-center"
        >
          <div class="icon-upload bg-contain bg-center bg-no-repeat"></div>
          <span>上传作品</span>
          <span>请按模板上传小于10兆，尺寸为1200×900像素的图片</span>
        </div>
        <!-- 隐藏触发上传稿件的元素 -->
        <form ref="formRef">
          <input
            ref="imageUploadsInputDomRef"
            type="file"
            id="image_uploads_cut_test"
            name="image_uploads"
            :accept="accept"
            v-show="false"
          />
        </form>
      </div>
      <div
        v-show="data"
        class="img-uploaded-container h-full w-full items-center justify-center"
      >
        <!-- 删除作品按钮 -->
        <div
          v-if="data && showDeleteBtn"
          class="remove-upload-icon cursor-pointer"
          @click.stop="removeUploadImg"
        >
          <van-icon name="cross" :max-count="1" :deletable="false" />
        </div>
        <!-- 作品图 -->
        <img
          ref="formWorksRef"
          :src="imgDataSrc"
          alt=""
          srcset=""
          :onerror="errorDefaultWorksImg"
          @contextmenu.prevent
        />
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
              <div
                @click="onClickCancelCropper"
                class="btn-cancel-cropper cursor-pointer bg-contain bg-center bg-no-repeat"
              ></div>
              <div
                class="flex flex-1 items-center justify-center text-[#e4f9ff]"
              >
                裁剪 1200像素*900像素 尺寸
              </div>
              <div
                @click="onClickFinishCropper"
                class="btn-finish-cropper flex cursor-pointer items-center justify-center"
              >
                完成
              </div>
            </div>
            <div ref="cropperContainerBodyRef" class="cropper-container-body">
              <div
                id="upload_img_cut_container"
                @click.stop
                class="cursor-pointer"
              >
                <img
                  id="img-container"
                  :src="cropperData.preCropperImgUrl"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
            <div
              class="cropper-container-footer flex w-full items-center justify-center text-[#bfbfbf]"
            >
              已截取分辨率：1200*900
            </div>
          </div>
        </div>
      </van-overlay>
    </Teleport>
    <!-- 裁剪弹窗边框样式 -->
    <Teleport to=".cropper-crop-box" v-if="cropperData.isShowBorderCorn">
      <div class="cropper-corner left-top-corner"></div>
      <div class="cropper-corner right-top-corner"></div>
      <div class="cropper-corner right-bottom-corner"></div>
      <div class="cropper-corner left-bottom-corner"></div>
      <div class="cropper-center-line top-line"></div>
      <div class="cropper-center-line right-line"></div>
      <div class="cropper-center-line bottom-line"></div>
      <div class="cropper-center-line left-line"></div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import defaultWorksImg from '@/assets/images/dayofdesign01/dayofdesign01-post-submit/works-default.png'
import { blobToUrl } from '@/utils/file'
import { showToast, showLoadingToast, closeToast, showImagePreview } from 'vant'
import { usePlatform } from '@/composables/usePlatform'

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
 * @param {boolean} showDeleteBtn 是否显示默认的删除按钮
 */
interface UploadImgProps {
  data: string | Blob | null | undefined
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
  showDeleteBtn?: boolean
}

const props = withDefaults(defineProps<UploadImgProps>(), {
  accept: 'image/png, image/jpg, image/jpeg',
  reupload: false,
  showDeleteBtn: true,
})

const errorDefaultWorksImg = ref(`this.src="${defaultWorksImg}"`)

const emits = defineEmits<{
  (e: 'update:data', value: any): void
  (e: 'afterRead', value: any): void
  (e: 'beforeRead', value: any): void
  (e: 'beforeDelete'): void
  (e: 'reupload', value: any): void
}>()

const { isIos } = usePlatform()

const updateFileData = (data: Blob): void => {
  emits('update:data', data)
}

// 可以为在线图片link或者base64
const imgDataSrc = ref()
watch(
  () => props.data,
  async (newVal) => {
    if (newVal) {
      if (Object.prototype.toString.call(newVal) === '[object Blob]') {
        imgDataSrc.value = await blobToUrl(newVal as Blob)
      } else {
        imgDataSrc.value = newVal
      }
    }
  },
)

// 作品上传相关
const formRef = ref()
const imageUploadsInputDomRef = ref()
const onClickGoToUploadWorks = (): void => {
  if (!props.data) {
    imageUploadsInputDomRef.value.click()
  } else {
    if (props.reupload) {
      imageUploadsInputDomRef.value.click()
    } else if (props.previewFullImage) {
      showImagePreview([imgDataSrc.value])
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
const cropperContainerBodyRef = ref<HTMLElement | null>()

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

interface GetImgFileData {
  file: File
  blob: Blob
  fileBase64: string
  width: number
  height: number
  size: number
  type: string
}

// 添加上传作品的监听
const listenUploadImgChange = (): void => {
  imageUploadsInputDomRef.value.addEventListener(
    'change',
    async function (event: Event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      const file = files[0]

      // 设置允许的文件格式和文件大小限制
      const allowedTypes = props.accept
      const maxSizeLimit = props.maxSize || 10 * 1024 * 1024 // 10 MB
      const minSizeLimit = props.minSize || 100 * 1024 // 100kb

      if (file) {
        // 获取图片文件的数据
        async function getImgFileData(): Promise<GetImgFileData> {
          return await new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file) // 读取文件为 Data URL
            reader.onload = function (e) {
              const readFileResult = e.target?.result as string

              const img = new Image()
              img.src = readFileResult
              img.onload = async () => {
                const width = img.width // 获取图像的宽度
                const height = img.height // 获取图像的高度

                const blob = new Blob([file], { type: file.type })

                resolve({
                  file,
                  blob,
                  fileBase64: readFileResult,
                  width,
                  height,
                  size: file.size,
                  type: file.type,
                })
              }
              img.onerror = () => {
                reject(new Error('获取图片信息错误'))
              }
            }
          })
        }

        try {
          const {
            blob: _blob,
            fileBase64,
            width,
            height,
            size,
            type,
          } = await getImgFileData()

          // 裁剪与不裁剪的公共检测处理
          function commonCheck(): boolean {
            // 检查文件大小
            if (size > maxSizeLimit) {
              showToast(
                `您选择的图片大小超过${maxSizeLimit / 1024 / 1024}兆，无法上传`,
              )
              formRef.value.reset()
              return false
            } else if (size < minSizeLimit) {
              showToast('您选择的图片过小，可能会影响展示效果')
            }
            return true
          }

          if (props.cropper) {
            // 检查文件类型
            if (!allowedTypes.includes(type)) {
              showToast('上传失败，只能上传png和jpg')
              formRef.value.reset()
              return
            }
            if (!commonCheck()) {
              formRef.value.reset()
              return
            }
            showLoadingToast({
              message: '准备裁剪中......',
              forbidClick: true,
              duration: 0,
            })
            if (isIos && (width * height) / 1000000 > 15) {
              // 处理ios MP影响
              showToast(
                '您选择的图片像素过大，无法上传，建议按照模板上传1200*900的图片',
              )
              formRef.value.reset()
            } else {
              cropperData.value.isShow = true
              cropperData.value.preCropperImgUrl = fileBase64
              await nextTick()
              showCropperModal()
            }
          } else {
            // 检查文件类型
            if (!allowedTypes.includes(type)) {
              showToast('上传失败，只能上传png和jpg')
              formRef.value.reset()
              return
            }

            if (width !== 1200 || height !== 900) {
              showToast('上传失败，请按活动规则使用指定尺寸的模板进行创作')
              formRef.value.reset()
            } else {
              if (!commonCheck()) {
                formRef.value.reset()
                return
              }
              updateFileData(_blob)
            }
          }
        } catch (error) {
          console.error(error)
        }
      }
    },
  )
}

// 展示裁剪
const showCropperModal = (): void => {
  const image = document.querySelector(
    '#upload_img_cut_container img',
  ) as HTMLImageElement
  CROPPER?.destroy()
  CROPPER = new Cropper(image, {
    aspectRatio: 4 / 3,
    background: false,
    highlight: false,
    center: false,
    viewMode: 1,
    cropBoxResizable: true,
    cropBoxMovable: false,
    responsive: false, // 响应式
    dragMode: 'move',
    ready: () => {
      closeToast()
      void nextTick(async () => {
        if (!CROPPER) return
        const cropperContainerDom = cropperContainerBodyRef.value
        const cropperContainerDomWidth = cropperContainerDom?.offsetWidth || 0
        const cropperContainerDomHeight = cropperContainerDom?.offsetHeight || 0
        const imageDataOrigin = CROPPER.getImageData()
        const imageDataOriginWith = imageDataOrigin.width
        // 先放大图片至宽度撑满裁剪容器
        const zoomLevel = Math.ceil(
          cropperContainerDomWidth / imageDataOriginWith,
        )
        CROPPER.zoomTo(zoomLevel)

        CROPPER.setCropBoxData({
          width: cropperContainerDomWidth,
          height: cropperContainerDomHeight,
          left: 0,
          top: 0,
        })
        const imageData = CROPPER.getImageData()
        const containerData = CROPPER.getContainerData()
        const cropBoxData = CROPPER.getCropBoxData()

        // 计算设置裁剪框居中
        const cropBoxLeft = (containerData.width - cropBoxData.width) / 2
        CROPPER.setCropBoxData({
          left: cropBoxLeft,
        })

        // 计算设置裁剪的图片居中（宽度大于高度时，zoomTo(0)复原前设置居中）
        if (imageData.width > imageData.height) {
          if (imageData.width >= containerData.width) {
            CROPPER.moveTo(0, 0)
          } else {
            if (imageData.width <= cropBoxData.width) {
              CROPPER.moveTo(0, 0)
            }
          }
        }
        // 复原
        CROPPER.zoomTo(0)
        const imageDataFinal = CROPPER.getImageData()
        // 计算设置裁剪的图片居中（宽度小于高度时，zoomTo(0)复原后设置居中）
        if (imageDataOrigin.width <= imageDataOrigin.height) {
          CROPPER.moveTo(0, -((imageDataFinal.height - cropBoxData.height) / 2))
        }
        // 计算设置裁剪的图片居中（宽度大于高度，且宽度大于裁剪区域的宽度，zoomTo(0)复原后设置居中）
        if (imageDataFinal.width > cropBoxData.width) {
          CROPPER.moveTo(
            cropBoxLeft - (imageDataFinal.width - cropBoxData.width) / 2,
            0,
          )
        }
      })
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
// 裁剪区域开始
img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
#upload_img_cut_container {
  width: 1280px;
  height: 682px;
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
      width: 1280px;
      height: 960px;
      // height: calc(100% - 70px);
      display: flex;
      justify-content: center;
      align-items: center;
      .cropper-container-header,
      .cropper-container-footer {
        height: 141px;
        font-size: 32px;
        background-color: #000000;
      }
      .cropper-container-header {
        border-radius: 40px 40px 0 0;
        padding: 0 32px 0 62px;
        .btn-cancel-cropper {
          width: 71px;
          height: 48px;
          background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-cancel-cropper.png');
        }
        .btn-finish-cropper {
          width: 200px;
          height: 76px;
          background-color: #ffffff;
          box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
          border-radius: 38px;
          font-size: 34px;
          letter-spacing: 1px;
          color: #5a7191;
        }
      }
      .cropper-container-footer {
        border-radius: 0px 0px 40px 40px;
      }
      .cropper-container-body {
        width: 100%;
        height: 682px;
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
// 上传按钮与文本
.upload-btn-container {
  .icon-upload {
    width: 119px;
    height: 119px;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-upload.png');
    &:hover {
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-upload-hover.png');
    }
  }
  & > span {
    font-size: 32px;
    color: #ffffff;
  }
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
  border: 4px solid #fff;
  display: inline-block;
  position: relative;
}
.cropper-point {
  display: none;
}
.cropper-corner {
  width: 60px;
  height: 60px;
  border: 10px solid #fff;
  &.left-top-corner {
    position: absolute;
    top: -5px;
    left: -5px;
    border-right: none;
    border-bottom: none;
    border-radius: 20px 5px 5px 5px;
  }
  &.right-top-corner {
    position: absolute;
    top: -5px;
    right: -5px;
    border-left: none;
    border-bottom: none;
    border-radius: 5px 20px 5px 5px;
  }
  &.right-bottom-corner {
    position: absolute;
    bottom: -5px;
    right: -5px;
    border-top: none;
    border-left: none;
    border-radius: 5px 5px 20px 5px;
  }
  &.left-bottom-corner {
    position: absolute;
    bottom: -5px;
    left: -5px;
    border-top: none;
    border-right: none;
    border-radius: 5px 5px 5px 20px;
  }
}
.cropper-center-line {
  border-radius: 5px;
  background-color: #fff;
  &.top-line {
    width: 60px;
    height: 12px;
    position: absolute;
    top: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.bottom-line {
    width: 60px;
    height: 12px;
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.right-line {
    width: 12px;
    height: 60px;
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
  &.left-line {
    width: 12px;
    height: 60px;
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
