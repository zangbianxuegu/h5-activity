<template>
  <div>
    <van-button type="success" @click="onClickSave"
      >保存图片（当前页面截图）</van-button
    >
    <van-button
      ref="shareBtnRef"
      type="success"
      @click="onClickShare"
      id="shareBtn"
      >分享图片（当前页面截图）</van-button
    >
    <div class="img-container" v-if="imageUrl">
      <h3>生成的图片：</h3>
      <img :src="imageUrl" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEnvironment } from '@/composables/useEnvironment'
import { postMsgToNative } from '@/utils/request'
import { closeToast, showLoadingToast, showToast } from 'vant'
import html2canvas from 'html2canvas'
import { showShare } from '@/utils/ngShare/share'

const { isPC } = useEnvironment()
const saveImgToDeviceAlbum = (
  url: any,
  timeoutErrorCount: number = 7000,
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    showLoadingToast({
      message: '下载中......',
      forbidClick: true,
      duration: 0,
    })
    // const imageFormatRegex =
    //   /\.(jpg|jpeg|png|gif|bmp|svg|webp|tiff|tif|heif|heic)$/i
    // // 优化PC保存filepicker的url
    // if (!imageFormatRegex.test(url)) {
    //   url += '.jpg'
    // }
    const img = new Image()
    img.src = url
    img.onload = function () {
      postMsgToNative({
        methodId: 'saveWebImage',
        reqData: {
          imageURL: url,
        },
        callback: {
          nativeCallback: function (respJSONString: string) {
            const callbackRes = JSON.parse(respJSONString)
            const result = callbackRes.result
            closeToast()
            if (result === 'success') {
              resolve(true)
            } else if (result === 'failed') {
              reject(new Error('下载图片失败'))
            }
          },
        },
      })
    }
    img.onerror = function () {
      closeToast()
      reject(new Error('下载图片失败'))
    }
    if (!isPC) {
      // 超时处理
      setTimeout(() => {
        reject(new Error('下载图片失败'))
      }, timeoutErrorCount)
    }
  })
}

const generateImg = (): Promise<any> => {
  const target = document.querySelector('body') as HTMLElement
  return new Promise((resolve): void => {
    void html2canvas(target, {
      scale: 1, // 设置画布的缩放比例为 1
      width: 1830, // 设置输出图像的宽度
      height: 960, // 设置输出图像的高度
      useCORS: true,
      backgroundColor: 'transparent',
    }).then((canvas) => {
      const dataUrl = canvas.toDataURL('image/png')
      resolve(dataUrl)
    })
  })
}

const imageUrl = ref('')
const onClickSave = async (): Promise<void> => {
  try {
    imageUrl.value = await generateImg()
    console.log('imageUrl', imageUrl.value)

    const res = await saveImgToDeviceAlbum(imageUrl)
    if (res) {
      showToast('下载成功')
    }
  } catch (error: any) {
    showToast('下载失败')
  }
}

const shareBtnRef = ref<ComponentPublicInstance>()
const onClickShare = async (): Promise<void> => {
  imageUrl.value = await generateImg()
  showShare(
    { targetElByHover: shareBtnRef.value?.$el },
    [],
    {
      title: '测试标题',
      text: '测试标题',
      desc: '测试标题',
      link: '',
      u3dshareThumb: '', // 分享缩略图地址(安卓必传)
      shareThumb: '',
    },
    {
      title: '测试标题',
      text: '测试文本',
      image: imageUrl.value,
    },
  )
}
</script>

<style scoped lang="scss">
.img-container {
  img {
    border: 1px solid #ccc;
  }
}
</style>
