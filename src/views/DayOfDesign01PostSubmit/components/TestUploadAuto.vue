<template>
  <div>
    <van-floating-bubble icon="chat" @click="onClickBubble" />
    <Teleport to="body">
      <van-overlay class="overlay" :show="show">
        <div class="wrapper">
          <div
            class="upload-container flex flex-col items-start justify-center gap-[20px]"
          >
            <div
              class="upload-container_btn-row flex items-center justify-center"
            >
              <van-button
                class="btn-auto-upload"
                size="small"
                type="success"
                @click="onClockUplpadAuto"
                >一键上传 <van-loading v-show="isUploading"
              /></van-button>
              <van-button
                size="small"
                type="warning"
                @click="onClockCopySuccessIdList"
                >复制本次上传成功id</van-button
              >
              <span v-if="isFinishedUpload">已完成本次上传</span>
            </div>
            <div class="upload-info-container w-full">
              <div class="w-full">
                成功进度：<van-progress
                  class="success-progress"
                  :percentage="percentage"
                  :pivot-text="`${uploadProcessData.successCount}/${uploadProcessData.idCount}`"
                />
              </div>
            </div>
          </div>
        </div>
      </van-overlay>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { getDesignId, uploadWorksToServer } from '@/apis/dayOfDesign01'
import uploadIdList from '@/assets/config/uploadId.json'
import {
  FILE_PICKER_POLICY_NAME,
  FILE_PICKER_POLICY_NAME_SHARE_IMG,
} from '@/constants/dayofdesign01'
import { useClipboard } from '@vueuse/core'
import { showToast } from 'vant'

const show = ref(false)

const onClickBubble = (): void => {
  show.value = !show.value
}

const filePickerConfig = ref({
  token: '',
  policyName: FILE_PICKER_POLICY_NAME,
  shareImgPolicyName: FILE_PICKER_POLICY_NAME_SHARE_IMG,
  filePickerUrl: '',
  currentUoloadFileUrl: '',
})

const worksData = {
  author: '一键上传作者名',
  worksName: '一键上传作品名',
  worksIntroduce: '一键上传作品介绍',
}

interface ReviewTextServerRequestFormat {
  author_name: string
  design_name: string
  description: string
}

// 获取检查文本服务端要求的字段格式
const getReviewTextServerRequestFormat = (
  author: string,
  worksName: string,
  worksIntroduce: string,
): ReviewTextServerRequestFormat => {
  return {
    author_name: author,
    design_name: worksName,
    description: worksIntroduce,
  }
}

const fetchImg = (): Promise<Blob> => {
  return new Promise((resolve) => {
    // 请求图片的 URL
    const imageUrl =
      'http://gips2.baidu.com/it/u=195724436,3554684702&fm=3028&app=3028&f=JPEG&fmt=auto?w=1280&h=960'
    fetch(imageUrl)
      .then((response) => {
        // 检查请求是否成功
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        // 将响应数据转换为 Blob
        return response.blob()
      })
      .then((blob) => {
        resolve(blob)
      })
      .catch((error) => {
        console.error(
          'There has been a problem with your fetch operation:',
          error,
        )
      })
  })
}

const uploadProcessData = ref({
  idCount: uploadIdList.length,
  successCount: 0,
  failCount: 0,
  countUploadIndex: 0,
  successIdList: [] as string[],
})

const percentage = computed(() => {
  return (
    (uploadProcessData.value.successCount / uploadProcessData.value.idCount) *
    100
  )
})

const isUploading = computed(() => {
  return (
    uploadProcessData.value.successCount + uploadProcessData.value.failCount <
      uploadProcessData.value.idCount &&
    (uploadProcessData.value.successCount > 0 ||
      uploadProcessData.value.failCount > 0)
  )
})

const isFinishedUpload = computed(() => {
  return (
    uploadProcessData.value.successCount + uploadProcessData.value.failCount ===
    uploadProcessData.value.idCount
  )
})

const upload = async (testUUID: string, imgBlob: Blob): Promise<void> => {
  try {
    await getDesignId(filePickerConfig.value.policyName, testUUID)
    const res = await uploadWorksToServer(
      filePickerConfig.value.policyName,
      filePickerConfig.value.shareImgPolicyName,
      getReviewTextServerRequestFormat(
        worksData.author,
        worksData.worksName,
        worksData.worksIntroduce,
      ),
      imgBlob,
      imgBlob,
      testUUID,
    )
    if (res?.design_id) {
      uploadProcessData.value.successCount += 1
      uploadProcessData.value.successIdList.push(testUUID)
    }
  } catch (error) {
    uploadProcessData.value.failCount += 1
  }
}

const onClockUplpadAuto = async (): Promise<any> => {
  const imgBlob = await fetchImg()
  for (let index = 0; index < uploadIdList.length; index++) {
    await upload(uploadIdList[index].id, imgBlob)
  }
}

const { copy, isSupported } = useClipboard({ legacy: true })
const onClockCopySuccessIdList = async (): Promise<void> => {
  if (!isSupported.value) {
    showToast('未授权,不支持')
    return
  }
  // 执行复制操作
  await copy(uploadProcessData.value.successIdList.join('，'))
  showToast('编号已复制到剪贴板！')
}
</script>

<style scoped lang="scss">
.overlay {
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 20px 10%;
  }
}
.upload-container {
  width: 100%;
  .success-progress {
    margin: 50px 0;
    width: 100%;
  }
}
:deep(.van-button__text) {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
