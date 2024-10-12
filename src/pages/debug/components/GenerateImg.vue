<template>
  <div>
    <!-- <van-button @click="onClickDownloadImg">下载图片</van-button> -->
    <!-- <van-button @click="onClickPreview">预览</van-button> -->
    <van-button @click="uploadWork">上传作品</van-button>
    <van-button @click="submitWrok">我要投稿</van-button>
    <input
      type="file"
      id="image_uploads"
      name="image_uploads"
      accept="*"
      v-show="false"
    />
    <div>
      <van-cell-group inset>
        <van-field
          v-model="workInfo.author"
          label="作者名"
          placeholder="请输入用户名"
        />
        <van-field
          v-model="workInfo.workName"
          label="作品名"
          placeholder="请输入用户名"
        />
        <van-field
          v-model="workInfo.workIntroduce"
          label="作品介绍"
          placeholder="请输入用户名"
        />
      </van-cell-group>
      <div id="upload_img_container">
        <img id="img-container" src="" alt="" srcset="" />
      </div>
      <van-overlay
        :show="previewData.isShow"
        @click="previewData.isShow = false"
      >
        <div class="wrapper">
          <!-- <div class="modal-header"></div> -->
          <div class="modal-body">
            <div id="user-work-container"></div>
          </div>
          <div class="modal-footer">
            <van-button @click="confirmSubmitWork" size="small"
              >确认投稿</van-button
            >
          </div>
        </div>
      </van-overlay>
    </div>
    <div class="ps_ignore-user-wrok-upload-container">
      <div class="left">
        <p>
          <span>作品ID: </span>
          <span>{{ workInfo.id }}</span>
        </p>
        <p>
          <span>作品名: </span>
          <span>{{ workInfo.workName }}</span>
        </p>
        <p>
          <span>作者名: </span>
          <span>{{ workInfo.author }}</span>
        </p>
        <div>
          <span>作品介绍：</span>
          <p>{{ workInfo.workIntroduce }}</p>
        </div>
      </div>
      <div class="right">
        <img id="img-container" src="" alt="" srcset="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateUUID } from '@/utils/utils'
import html2canvas from 'html2canvas'
import { showToast } from 'vant'

const workInfo = ref({
  id: generateUUID(),
  author: '陈老师',
  workName: '光遇',
  workIntroduce: '劈里啪啦说了一大堆',
  img: '',
})

const previewData = ref({
  isShow: false,
})

const uploadWork = (): void => {
  const file = document.getElementById('image_uploads') as HTMLInputElement
  file.click()
}

// 下载浏览器图片
// const onClickDownloadImg = async (): Promise<void> => {
//   const userWork = document.getElementById('user-work-container') as HTMLElement
//   const userWorkAddInfo = document.querySelector(
//     '.ps_ignore-user-wrok-upload-container',
//   ) as HTMLElement
//   const clonedNode = userWork.cloneNode(true)
//   userWorkAddInfo.appendChild(clonedNode)
//   await html2canvas(userWorkAddInfo).then((canvas) => {
//     const imgData = canvas.toDataURL('image/png')
//     const link = document.createElement('a')
//     link.href = imgData
//     link.download = 'download.png'
//     link.click()
//   })
// }

const listenUploadImgChange = (): void => {
  document
    .getElementById('image_uploads')
    ?.addEventListener('change', function (event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      const file = files[0]

      if (file) {
        const reader = new FileReader()

        reader.onload = function (e) {
          const img = new Image()

          img.onload = function () {
            document
              .querySelector(
                '.ps_ignore-user-wrok-upload-container #img-container',
              )
              ?.setAttribute('src', e.target?.result as string)
            document
              .querySelector('#upload_img_container img')
              ?.setAttribute('src', e.target?.result as string)
            workInfo.value.img = e.target?.result as string
            console.log(img)
            console.log(
              `宽度: ${img.width}, 高度: ${img.height}, 大小：${img.sizes}`,
            )
          }

          img.src = e.target?.result as string // 使用 FileReader 读取的图片数据
        }

        reader.readAsDataURL(file) // 读取文件为 Data URL
      }
    })
}

const checkWorkInfoValid = (): Promise<boolean> => {
  showToast('作品信息检查中...')
  // const { author, workName, workIntroduce } = workInfo.value
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

const submitWrok = async (): Promise<void> => {
  // 检查信息是否填写
  if (
    !workInfo.value.workName ||
    !workInfo.value.author ||
    !workInfo.value.workIntroduce ||
    !workInfo.value.img
  ) {
    showToast('作品信息不完整')
    return
  }
  // 检查信息是否合规
  const checkResult = await checkWorkInfoValid()
  if (!checkResult) return
  // 预览
  onClickPreview()
}

const cloneChildrenNode = (source: string, target: string): void => {
  const sourceEl = document.querySelector(source) as HTMLElement
  const targetEl = document.querySelector(target) as HTMLElement
  targetEl.innerHTML = ''
  const children = Array.from(sourceEl.childNodes)
  children.forEach((child) => {
    targetEl.appendChild(child.cloneNode(true)) // 使用 cloneNode 复制节点
  })
}

const onClickPreview = (): void => {
  previewData.value.isShow = true
  void nextTick(() => {
    cloneChildrenNode(
      '.ps_ignore-user-wrok-upload-container',
      '#user-work-container',
    )
  })
}

const confirmSubmitWork = async (): Promise<void> => {
  const target = document.querySelector(
    '.ps_ignore-user-wrok-upload-container',
  ) as HTMLElement

  await html2canvas(target, {
    scale: 1, // 设置画布的缩放比例为 1
    width: 1000, // 设置输出图像的宽度
    height: 500, // 设置输出图像的高度
  }).then((canvas) => {
    canvas.toBlob((blob): void => {
      void (async () => {
        if (blob) {
          const uuid = generateUUID()
          const formData = new FormData()
          formData.append('file', blob, `${uuid}.png`)
          const response = await fetch(
            'http://10.227.199.103:7897/ma75WXJ/upload',
            {
              method: 'POST',
              body: formData,
            },
          )
          const result = await response.json()
          console.log(result)
          showToast(result.message)
        }
      })()
    })
  })
}

onMounted(() => {
  listenUploadImgChange()
  console.log(`设备的像素比是: ${window.devicePixelRatio}`)
  const userWorkAddInfo = document.querySelector(
    '.ps_ignore-user-wrok-upload-container',
  ) as HTMLElement
  const style = window.getComputedStyle(userWorkAddInfo)
  console.log(style.width)
  console.log(style.height)
})
</script>

<style scoped>
#user-work-container {
  height: 100%;
  width: 100%;
  background-color: antiquewhite;
  display: flex;
  justify-content: center;
  align-items: center;
  .left {
    width: 30%;
    height: 100%;
    border-right: 1px solid red;
    color: red;
    h1 {
      font-size: 30px;
      width: 100%;
      border: 1px solid pink;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    padding: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.ps_ignore-user-wrok-upload-container {
  font-size: 10px;
  border: 1px solid red;
  height: 500px !important;
  width: 1000px !important;
  position: absolute;
  top: -10000px;
  left: -1000px;
  background-color: antiquewhite;
  display: flex;
  justify-content: center;
  align-items: center;
  .left {
    width: 30%;
    height: 100%;
    border-right: 1px solid red;
    color: red;
    h1 {
      font-size: 3em;
      width: 100%;
      border: 1px solid pink;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    padding: 20px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.van-overlay {
  padding: 60px;
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .modal-body {
      height: calc(100% - 100px);
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
</style>
