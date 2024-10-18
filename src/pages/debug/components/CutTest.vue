<template>
  <div class="container w-full">
    <van-button @click="uploadImg">上传图片</van-button>
    <van-button @click="getCropImg">获取裁剪图片</van-button>
    <van-button @click="downloadCropImg">下载裁剪图片</van-button>
    <van-overlay :show="isShow" @click="isShow = false">
      <div class="modal-wrapper">
        <div class="modal-body">
          <div id="upload_img_cut_test_container" @click.stop>
            <img id="img-container" src="" alt="" srcset="" />
          </div>
        </div>
        <div class="modal-footer" @click.stop>
          <van-button @click="downloadCropImg">下载裁剪图片</van-button>
        </div>
      </div>
    </van-overlay>
    <input
      type="file"
      id="image_uploads_cut_test"
      name="image_uploads"
      accept="image/jpeg"
      v-show="false"
    />
    <img
      id="renderedCropImage"
      src=""
      alt=""
      style="max-width: 100%; height: auto"
    />
  </div>
</template>

<script setup lang="ts">
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

let CROPPER: Cropper | null
const currentImg = {
  src: '',
  blob: '',
}

const isShow = ref(false)

const uploadImg = (): void => {
  const file = document.getElementById(
    'image_uploads_cut_test',
  ) as HTMLInputElement
  file.click()
}

const downloadImg = (blob: Blob): void => {
  const imgUrl = URL.createObjectURL(blob)
  currentImg.src = imgUrl
  const link = document.createElement('a')
  link.href = currentImg.src
  link.download = 'download.jpeg'
  link.click()
}

const downloadCropImg = (): void => {
  const canvas = CROPPER?.getCroppedCanvas({
    width: 1200,
    height: 900,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  })
  canvas?.toBlob((blob) => {
    const imgBlob = blob as Blob
    if (imgBlob.size > 10 * 1024 * 1024) {
      // 进行压缩处理
      const quality = 0.7 // 压缩质量
      // downloadImg(blob)
      canvas.toBlob(
        (compressedBlob) => {
          downloadImg(compressedBlob as Blob)
        },
        'image/jpeg',
        quality,
      )
    } else {
      downloadImg(imgBlob)
    }
  }, 'image/jpeg')
}

const listenUploadImgChange = (): void => {
  document
    .getElementById('image_uploads_cut_test')
    ?.addEventListener('change', function (event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      const file = files[0]

      if (file) {
        const reader = new FileReader()

        reader.onload = function (e) {
          const img = new Image()

          img.onload = function () {
            isShow.value = true
            void nextTick(() => {
              document
                .querySelector('#upload_img_cut_test_container img')
                ?.setAttribute('src', e.target?.result as string)
              console.log(img)
              console.log(
                `宽度: ${img.width}, 高度: ${img.height}, 大小：${img.sizes}`,
              )
              showCut()
            })
          }

          img.src = e.target?.result as string // 使用 FileReader 读取的图片数据
        }

        reader.readAsDataURL(file) // 读取文件为 Data URL
      }
    })
}

const showCut = (): void => {
  const image = document.querySelector(
    '#upload_img_cut_test_container img',
  ) as HTMLImageElement
  console.log('image', image)
  CROPPER?.destroy()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CROPPER = new Cropper(image, {
    aspectRatio: 4 / 3,
    background: false,
    highlight: true,
    viewMode: 1,
    // minContainerWidth: 1200,
    // minContainerHeight: 900,
    minCropBoxWidth: 1200,
    minCropBoxHeight: 900,
    dragMode: 'crop', // crop
    cropBoxResizable: false,
    cropBoxMovable: false,
    responsive: true, // 响应式
    ready() {
      // 固定裁剪框的大小
      // const cropBoxData = CROPPER?.getCropBoxData()
      // CROPPER?.setCropBoxData({
      //   left: cropBoxData?.left,
      //   top: cropBoxData?.top,
      //   width: 1200, // 固定宽度
      //   height: 900, // 固定高度
      // })
      CROPPER?.setDragMode('move')
    },
    zoom: (event) => {
      console.log('zoom event', event)
      if (event.detail.ratio > event.detail.oldRatio) {
        console.log('放大')
      } else {
        console.log('缩小')
      }
    },
    crop(event) {
      console.log('crop event', event)
    },
  })
}

const getCropImg = (): void => {
  // getCroppedCanvas方法可以将裁剪区域的数据转换成canvas数据
  CROPPER?.getCroppedCanvas({
    width: 1200,
    height: 900,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  }).toBlob((blob) => {
    // 然后调用浏览器原生的toBlob方法将canvas数据转换成blob数据

    // 之后就可以愉快的将blob数据发送至后端啦，可根据自己情况进行发送，我这里用的是axios
    const formData = new FormData()
    // 第三个参数为文件名，可选填.
    formData.append('croppedImage', blob)
    const imgUrl = URL.createObjectURL(blob as Blob)
    currentImg.src = imgUrl
    const renderedCropImageDom = document.querySelector(
      '#renderedCropImage',
    ) as HTMLImageElement
    renderedCropImageDom.setAttribute('src', imgUrl)
    // let config = {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // }

    // this.$axios
    //   .post(flow_mission_UploadFile(), param, config)
    //   .then((response) => {
    //     console.log(response)
    //   })
    //   .catch((err) => {
    //     console.log(err)
    //   })
  })
}

onMounted(() => {
  listenUploadImgChange()
})
</script>

<style scoped lang="scss">
.container :deep(.van-button) {
  width: 100%;
  padding: 0;
  .van-button__content {
    width: 100%;
    .van-button__text {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
#upload_img_cut_test_container {
  width: 1200px;
  height: 900px;
}
#renderedCropImage {
  width: 1200px;
  height: 900px;
}
.modal-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .modal-body {
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-footer {
    width: 100%;
    height: 170px;
  }
}
</style>
