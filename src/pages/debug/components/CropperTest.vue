<template>
  <div>
    <input type="file" id="imageUpload" accept="*" />
    <br /><br />
    <div id="imageContainer">
      <img
        id="renderedImage"
        src=""
        alt="Uploaded Image"
        style="display: none; max-width: 100%; height: auto"
      />
    </div>
    <el-button @click="getCropImg">获取裁剪效果</el-button>
    <img
      id="renderedCropImage"
      src=""
      alt=""
      style="max-width: 100%; height: auto"
    />
    <div class="previewText">裁剪预览</div>
    <div class="previewBox"></div>
    <div class="previewBoxRound"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

let CROPPER: Cropper // 创建一个cropper的全局对象
// let zoomFlag = true
const addListen = (): void => {
  document
    .getElementById('imageUpload')
    ?.addEventListener('change', function (event) {
      const file = event.target?.files[0]
      const reader = new FileReader()
      const imgElement = document.getElementById(
        'renderedImage',
      ) as HTMLImageElement

      if (file) {
        reader.onload = function (e) {
          imgElement.src = e.target?.result as string
          imgElement.style.display = 'block'
          CROPPER = new Cropper(imgElement, {
            aspectRatio: 4 / 3,
            viewMode: 0,
            minContainerWidth: 1200,
            minContainerHeight: 900,
            minCropBoxWidth: 1200,
            minCropBoxHeight: 900,
            dragMode: 'move',
            cropBoxResizable: false,
            zoom: (event) => {
              console.log('zoom event', event)
              if (event.detail.ratio > event.detail.oldRatio) {
                console.log('放大')
              } else {
                console.log('缩小')
                //   CROPPER.zoomTo(1)
              }
            },
            // preview: [document.querySelector('.previewBox'), document.querySelector('.previewBoxRound')]
          })
        }

        reader.readAsDataURL(file)
      } else {
        imgElement.src = ''
        imgElement.style.display = 'none'
      }
    })
}

const getCropImg = (): void => {
  // getCroppedCanvas方法可以将裁剪区域的数据转换成canvas数据
  CROPPER.getCroppedCanvas({
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
  addListen()
})
</script>
<style scoped>
#imageContainer {
  margin-top: 20px;
}

#renderedImage {
  border: 2px solid #ccc;
  border-radius: 5px;
}
</style>
