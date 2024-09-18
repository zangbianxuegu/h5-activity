<template>
  <div class="flex h-full w-full items-center">
    <van-collapse v-model="activeNames" accordion>
      <van-collapse-item title="文件上传下载功能" name="1">
        <div class="container-row">
          <div class="header-row">
            <h1>UI组件上传：</h1>
          </div>
          <div class="body-row">
            <van-uploader
              v-model="fileList"
              reupload
              max-count="2"
              :after-read="afterRead"
              :before-read="beforeRead"
            />
          </div>
        </div>
        <div class="container-row">
          <div class="header-row">
            <h1>原生组件上传：</h1>
          </div>
          <div class="body-row">
            <van-button @click="getFileInfo" type="primary" size="small"
              >获取上传文件信息</van-button
            >
            <input type="file" id="fileInput" accept="*" />
            <img id="imagePreview" alt="Image Preview" />
          </div>
        </div>
      </van-collapse-item>
      <van-collapse-item title="请求协议频率与数据容量" name="2">
      </van-collapse-item>
      <van-collapse-item title="web生成或拼接图片" name="3"></van-collapse-item>
      <van-collapse-item title="图片放大展示" name="4"></van-collapse-item>
      <van-collapse-item title="分享功能" name="5"></van-collapse-item>
    </van-collapse>
  </div>
</template>

<script setup lang="ts">
const activeNames = ref('1')
// 文件上传下载
const fileList = ref([
  { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
])
const afterRead = (file: any): void => {
  // 此时可以自行将文件上传至服务器
  console.log('file', file)
}
const beforeRead = (file: any): boolean => {
  console.log('beforeRead')
  return true
}
function getFileInfo(): void {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const files = fileInput?.files
  if (files?.length === 0) {
    alert('请选择文件')
  } else {
    alert('请在log查看文件信息')
    console.log('files', files)
  }
}
function showImg(): void {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  fileInput?.addEventListener('change', function (event) {
    const targetDom = event.target as HTMLInputElement
    const file = targetDom.files ? targetDom?.files[0] : null // 获取选择的文件
    console.log('file', file)

    const imagePreview = document.getElementById(
      'imagePreview',
    ) as HTMLImageElement
    if (file) {
      const reader = new FileReader()

      // 当文件读取完毕后，显示预览图像
      reader.onload = function (e) {
        imagePreview.src = e.target?.result as string // 设置图像源
        imagePreview.style.display = 'block' // 显示图像
      }

      reader.readAsDataURL(file) // 将文件读取为 Data URL
    } else {
      // 如果没有选择文件，则隐藏预览图像
      imagePreview.style.display = 'none'
    }
  })
}
function logEnvInfo(): void {
  console.log('User Agent: ', navigator.userAgent)
  console.log('Current URL: ', window.location.href)
  console.log('Page Title: ', document.title)
  console.log('Browser Language: ', navigator.language)
  console.log('Platform: ', navigator.platform)
  console.log(
    `Window Size: Width: ${window.innerWidth}, Height: ${window.innerHeight}`,
  )
}

onMounted(() => {
  logEnvInfo()
  showImg()
})
</script>

<style scoped lang="scss">
* {
  color: #fff;
}
.container-row {
  .header-row {
    h1 {
      font-size: 40px;
      color: #fff;
    }
  }
  .body-row {
    display: flex;
  }
}
#imagePreview {
  width: 300px;
  height: 300px;
}
:deep(.van-cell) {
  color: #fff;
  background-color: transparent;
}
:deep(.van-collapse-item__content) {
  background-color: transparent;
}
</style>
