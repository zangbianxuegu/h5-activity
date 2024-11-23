<template>
  <Transition appear mode="out-in">
    <div class="hmj-contribute flex h-screen">
      <div class="hmj-contribute-main">
        <Transition appear mode="out-in">
          <div class="main-container">
            <div class="test-btn-group absolute"></div>
            <div class="header">
              <h1>投递稿件</h1>
              <p>投递期：2025年1月1日~2025年1月31日</p>
            </div>
            <div class="body">
              <div
                class="main-container flex flex-col justify-between align-middle"
              >
                <p class="">请按模板上传大小为10MB，尺寸为1200×900px的图片</p>
                <div class="flex flex-1 justify-between align-middle">
                  <div class="left">
                    <div
                      class="works-img-container flex justify-center align-middle"
                    >
                      <upload-img
                        v-model:data="worksData.worksImg"
                        :cropper="true"
                        :max-size="10 * 1024 * 1024"
                        :min-size="100 * 1024"
                        :reupload="false"
                        :preview-full-image="true"
                      ></upload-img>
                      <!-- 查看作品详情 -->
                      <div
                        v-if="isCheckedSuccess && worksData.worksImgSrc"
                        class="btn-view-works-details"
                        @click="onClickViewMyWorks"
                      >
                        <van-icon name="aim" />
                      </div>
                      <!-- 作品id -->
                      <p
                        v-if="isContributed && worksData.worksImgSrc"
                        class="worksId"
                      >
                        <span>【{{ worksGroupName }}组】</span>
                        <span
                          >ID
                          <span id="works-id">{{ currentWorksPureId }}</span>
                        </span>
                        <van-icon
                          id="copy-works-id"
                          name="description-o"
                          @click="onClickCopyWorksId"
                        />
                      </p>
                      <!-- 作品审查提示 -->
                      <div
                        v-if="
                          isContributed &&
                          !isCheckedSuccess &&
                          worksData.worksImgSrc
                        "
                        class="check-status-info-modal"
                      >
                        <div
                          v-if="isShowCheckStatusTip"
                          class="info-text-container"
                          :class="{
                            'check-fail': isCheckedFail,
                            checking: isChecking,
                          }"
                        >
                          {{ checkStatusTip }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="right">
                    <div class="form-container">
                      <div class="field-container author-field-container">
                        <label for="author">作者名</label>
                        <input
                          v-model="worksData.author"
                          name="author"
                          id="author"
                          type="text"
                          maxlength="8"
                          placeholder="请输入作者名，不含符号"
                          :disabled="isContributed"
                          @change="
                            (event: Event) =>
                              onChangeAuthorWordCount(event, 'author')
                          "
                          @blur="onBlurInput"
                        />
                        <span class="word-count">{{ authorWordCount }}/8</span>
                      </div>
                      <div class="field-container works-field-container">
                        <label for="works">作品名</label>
                        <input
                          v-model="worksData.worksName"
                          name="works"
                          id="works"
                          type="text"
                          maxlength="8"
                          placeholder="请输入作品名，不含符号"
                          :disabled="isContributed"
                          @change="
                            (event: Event) =>
                              onChangeAuthorWordCount(event, 'worksName')
                          "
                          @blur="onBlurInput"
                        />
                        <span class="word-count"
                          >{{ worksNameWordCount }}/8</span
                        >
                      </div>
                      <div class="works-introduce-field-container">
                        <label for="worksIntroduce">作品介绍</label>
                        <textarea
                          v-model="worksData.worksIntroduce"
                          name="worksIntroduce"
                          id="worksIntroduce"
                          type="text"
                          maxlength="50"
                          placeholder="请分享你的创作故事"
                          :disabled="isContributed"
                          @blur="onBlurInput"
                        ></textarea>
                        <span class="word-count"
                          >{{ worksIntroduceWordCount }}/50</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <div class="footer flex justify-between align-middle">
                  <div class="left-btn-group flex flex-1 justify-start">
                    <div
                      class="btn-edit-basic"
                      @click="onClickDownloadTemplate"
                    >
                      下载模板
                    </div>
                    <div
                      class="btn-edit-basic"
                      @click="onClickGoToDrawingGuide"
                    >
                      绘制指南
                    </div>
                  </div>
                  <div
                    @click="onClickContributeWorks"
                    class="right-btn-group flex flex-1 justify-end align-middle"
                  >
                    <div :class="contributeBtnClass">
                      {{ contributeBtnText }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
        <!-- 确认投稿弹窗 -->
        <Teleport to="body">
          <van-overlay
            :show="previewData.isShow"
            @click="previewData.isShow = false"
            class="works-preview-modal"
          >
            <div class="wrapper">
              <div class="modal-body">
                <div id="user-work-container">
                  <div class="left">
                    <div class="works-preview-basic-info">
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
                  </div>
                  <div class="right">
                    <img
                      id="img-container"
                      :src="worksData.worksImgSrc"
                      alt=""
                      srcset=""
                    />
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <van-button @click="confirmSubmitWork" size="small"
                  >确认投稿</van-button
                >
              </div>
            </div>
          </van-overlay>
        </Teleport>
        <!-- web生成拼装图的隐藏DOM -->
        <Teleport to="body">
          <div
            class="ps_ignore-user-wrok-upload-container bg-contain bg-center bg-no-repeat"
          >
            <div class="left">
              <img
                id="img-container"
                :src="worksData.worksImgSrc"
                alt=""
                srcset=""
              />
            </div>
            <div class="right">
              <div class="decorate-works-basic-info">
                <p>
                  <span>作品ID: </span>
                  <span>{{ worksData.worksName }}</span>
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
              <div class="decorate-works-introduce">
                <span>作品介绍：</span>
                <span>{{ worksData.worksIntroduce }}</span>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- 我的作品弹窗 -->
        <works-detail-modal
          v-model:show="isShowMyWorksModal"
          :event="EVENT_DAY_OF_DESIGN_01.ALL"
          :type="DESIGN_DETAILS_TYPE.SELF"
          :works-data="myWorksData"
          :file-picker-config="filePickerConfig"
          @after-delete="initPageData"
        ></works-detail-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  closeToast,
  showConfirmDialog,
  showLoadingToast,
  showToast,
} from 'vant'
import html2canvas from 'html2canvas'
import WorksDetailModal from './components/WorksDetailModal.vue'
import UploadImg from './components/UploadImg.vue'
import { saveImgToDeviceAlbum } from '@/utils/request'
import {
  DESIGN_REVIEW_STATUS,
  type SelfDesignDetails,
} from '@/types/activity/dayofdesign01'
import { blobToUrl } from '@/utils/file'
import {
  FILE_PICKER_POLICY_NAME,
  groupNameAndCodeMap,
} from '@/constants/dayofdesign01'
import { type ReviewTextRejectResult } from '@/utils/filePicker/types'
import {
  DESIGN_DETAILS_TYPE,
  EVENT_DAY_OF_DESIGN_01,
} from '@/types/activity/dayofdesign01'
import {
  deleteDesignDetails,
  getDesignDetails,
  uploadWorksToServer,
} from '@/apis/dayOfDesign01'
import ClipboardJS from 'clipboard'

interface WorksData {
  author: string
  worksName: string
  worksIntroduce: string
  id: string
  checkStatus: DESIGN_REVIEW_STATUS | undefined
  worksImg?: Blob | null
  worksImgSrc: string
  worksDecorateImg: Blob | null
  worksDecorateImgSrc: string
}

interface MyWorksData {
  author: string
  worksName: string
  worksIntroduce: string
  id: string
  worksImgSrc: string
  worksDecorateImgSrc: string
}

const worksData = ref<WorksData>({
  id: '',
  author: '',
  worksName: '',
  worksIntroduce: '',
  worksImg: null,
  worksImgSrc: '',
  checkStatus: undefined,
  worksDecorateImg: null,
  worksDecorateImgSrc: '',
})

watch(
  () => worksData.value.worksImg,
  async (newValue) => {
    if (newValue) {
      worksData.value.worksImgSrc = await blobToUrl(newValue)
    }
  },
)

// 投稿前的确认作品
const previewData = ref({
  isShow: false,
})

// 是否已上传作品
const isContributed = computed((): boolean => {
  return worksData.value.id !== ''
})
// 是否已审核通过
const isCheckedSuccess = computed((): boolean => {
  return worksData.value.checkStatus === DESIGN_REVIEW_STATUS.PASSED
})
// 是否审核失败
const isCheckedFail = computed((): boolean => {
  return worksData.value.checkStatus === DESIGN_REVIEW_STATUS.REFUSED
})
// 是否审核中
const isChecking = computed((): boolean => {
  return worksData.value.checkStatus === DESIGN_REVIEW_STATUS.VERIFYING
})

// 作者名的字数统计
const authorWordCount = computed(() => {
  return worksData.value.author?.length
})
// 作品名的字数统计
const worksNameWordCount = computed(() => {
  return worksData.value.worksName?.length
})
// 作品介绍的字数统计
const worksIntroduceWordCount = computed(() => {
  return worksData.value.worksIntroduce?.length
})

// 是否显示作品审核信息
const isShowCheckStatusTip = computed((): boolean => {
  if (!isContributed.value || isCheckedSuccess.value) {
    return false
  }
  return true
})

// 作品审核信息
const checkStatusTip = computed((): string => {
  // 0 表示审核中，1 表示审核未通过，2表示审核通过
  if (isChecking.value) {
    return `作品编号 ${worksData.value.id} 预计将于48小时内审核完毕`
  }
  return `很抱歉，您的作品编号 ${worksData.value.id}，未通过审核，请联系客服了解详情`
})

// 投稿按钮的文本
const contributeBtnText = computed((): string => {
  if (!isContributed.value) {
    return '立即投稿'
  } else if (isChecking.value) {
    return '审核中......'
  }
  return '重新上传'
})

const contributeBtnClass = computed((): string => {
  if (isChecking.value) {
    return 'btn-checking'
  }
  return 'btn-contribute'
})

// 复制作品id
const onClickCopyWorksId = (): void => {
  // eslint-disable-next-line no-new
  new ClipboardJS('#copy-works-id', {
    text: function () {
      return document.querySelector('#works-id')?.textContent as string
    },
  })
  showToast('编号已复制到剪贴板！')
}

// 即时处理作品名、作者名
const onChangeAuthorWordCount = (
  event: Event,
  key: 'author' | 'worksName',
): void => {
  const inputValue = (event.target as HTMLInputElement)?.value
  worksData.value[key] = inputValue.trim()
}

const onBlurInput = (): void => {
  console.log('blur')
  document.querySelector('body')?.focus()
}

// 下载模板
const onClickDownloadTemplate = async (): Promise<void> => {
  try {
    const imageUrl = 'http://10.227.199.103:7897/images/hmj-works-template.png'
    const res = await saveImgToDeviceAlbum(imageUrl)
    if (res) {
      showToast('下载成功')
    }
  } catch (error: any) {
    showToast('下载失败')
  }
}
// 点击绘制指南
const onClickGoToDrawingGuide = (): void => {
  window.location.href = 'https://m.163.com/'
}

// 删除作品确认弹窗
const showConfirmDialogForReupload = (): void => {
  void showConfirmDialog({
    title: '',
    message: '确认删除投稿作品？',
  }).then(async () => {
    // on confirm
    try {
      const res = await deleteDesignDetails(
        filePickerConfig.value.policyName,
        worksData.value.id,
        worksData.value.worksImgSrc,
      )
      if (res) {
        showToast('删除成功')
      }
      setTimeout(() => {
        void initPageData()
      }, 500)
    } catch (error) {
      showToast('网络波动，删除失败，请稍后再试')
      console.error(error)
    }
  })
}

// 点击我要投稿按钮
const onClickContributeWorks = async (): Promise<void> => {
  if (!isContributed.value) {
    // 未上传作品
    // 判空检查
    const fieldTips = [
      { param: 'worksImgSrc', emptyTip: '请先上传作品' },
      {
        param: 'author',
        emptyTip: '请填写作者名',
        verifyErrorTip: '作者名不含字符',
      },
      {
        param: 'worksName',
        emptyTip: '请填写作品名',
        verifyErrorTip: '作品名不含字符',
      },
      { param: 'worksIntroduce', emptyTip: '请填写作品介绍' },
    ]
    const keyList = fieldTips.map((e) => e.param)
    // 检查空值
    const emptyParam = keyList.find(
      (key): boolean =>
        (
          worksData.value[key as keyof typeof worksData.value] as string
        )?.trim() === '',
    )
    if (emptyParam) {
      showToast(
        fieldTips.find((item) => item.param === emptyParam)?.emptyTip as string,
      )
      return
    }
    // 检查作者名和作品名仅限字母和汉字
    const verifyReg = /^[0-9A-Za-z\u4e00-\u9fa5]{1,8}$/
    const verifyError = keyList.find((key): boolean => {
      if (key === 'author' || key === 'worksName') {
        return !verifyReg.test(
          (
            worksData.value[key as keyof typeof worksData.value] as string
          )?.trim(),
        )
      }
      return false
    })
    if (verifyError) {
      showToast(
        fieldTips.find((item) => item.param === verifyError)
          ?.verifyErrorTip as string,
      )
      return
    }

    // 预览
    previewData.value.isShow = true
  } else if (isCheckedSuccess.value || isCheckedFail.value) {
    // 上传作品后并且审核成功
    showConfirmDialogForReupload()
  } else if (isChecking.value) {
    // 作品审核中
    showToast('作品审核中，请耐心等待')
  }
}

// 生成拼装图
const changeDomToImage = (): Promise<void> => {
  return new Promise((resolve): void => {
    const target = document.querySelector(
      '.ps_ignore-user-wrok-upload-container',
    ) as HTMLElement
    void html2canvas(target, {
      scale: 1, // 设置画布的缩放比例为 1
      width: 1760, // 设置输出图像的宽度
      height: 990, // 设置输出图像的高度
    }).then((canvas) => {
      canvas.toBlob((blob): void => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          worksData.value.worksDecorateImg = blob
          worksData.value.worksDecorateImgSrc = url
          resolve()
        }
      })
    })
  })
}

const filePickerConfig = ref({
  token: '',
  policyName: FILE_PICKER_POLICY_NAME,
  shareImgPolicyName: FILE_PICKER_POLICY_NAME,
  filePickerUrl: '',
  currentUoloadFileUrl: '',
})

const isShowMyWorksModal = ref(false)
const myWorksData = ref<MyWorksData>({
  id: '',
  author: '',
  worksName: '',
  worksIntroduce: '',
  worksImgSrc: '',
  worksDecorateImgSrc: '',
})

// 查看我的作品
const onClickViewMyWorks = async (): Promise<void> => {
  myWorksData.value = {
    id: worksData.value.id,
    author: worksData.value.author,
    worksName: worksData.value.worksName,
    worksIntroduce: worksData.value.worksIntroduce,
    worksImgSrc: worksData.value.worksImgSrc,
    worksDecorateImgSrc: worksData.value.worksDecorateImgSrc,
  }
  isShowMyWorksModal.value = true
}

const initPageData = async (): Promise<void> => {
  await updateDesignDetails()
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
// 分组名字
const worksGroupName = computed(() => {
  return groupNameAndCodeMap.get(worksData.value.id.split('')[0])
})
const currentWorksPureId = computed(() => {
  return worksData.value.id.slice(1)
})

const confirmSubmitWork = async (): Promise<void> => {
  let apiTimeout = true

  function stopSubmit(): void {
    apiTimeout = false
    closeToast()
  }

  showLoadingToast({
    message: '正在投稿...',
    forbidClick: true,
    duration: 0,
    onOpened: () => {
      // 协议超时未返回结果，自动关闭
      setTimeout(() => {
        if (apiTimeout) {
          stopSubmit()
          showToast('上传异常，请刷新后重试')
        }
      }, 10 * 1000)
    },
  })

  await changeDomToImage()
  try {
    if (worksData.value.worksImg && worksData.value.worksDecorateImg) {
      const res = await uploadWorksToServer(
        filePickerConfig.value.policyName,
        filePickerConfig.value.shareImgPolicyName,
        getReviewTextServerRequestFormat(
          worksData.value.author,
          worksData.value.worksName,
          worksData.value.worksIntroduce,
        ),
        worksData.value.worksImg,
        worksData.value.worksDecorateImg,
      )
      worksData.value.id = res?.design_id
      worksData.value.checkStatus = DESIGN_REVIEW_STATUS.VERIFYING
      stopSubmit()
      showToast('投稿成功')
    } else {
      stopSubmit()
      showToast('上传异常，请刷新后重试')
    }
  } catch (error: any) {
    stopSubmit()
    const { message } = error
    if (message?.includes('errorType')) {
      // 字段检测异常的错误处理
      const errorObject: ReviewTextRejectResult = JSON.parse(message)
      const { invalidKey, invalidReasonDefaultText } = errorObject
      showToast(invalidReasonDefaultText)
      console.log(`${invalidKey}字段检测不通过`)
    } else {
      showToast('上传异常，请刷新后重试')
    }
  }
}

const updateDesignDetails = async (): Promise<void> => {
  try {
    const designDetails = (await getDesignDetails(
      filePickerConfig.value.policyName,
    )) as SelfDesignDetails
    const isCountribute = JSON.stringify(designDetails) !== '{}'
    if (isCountribute) {
      worksData.value.id = designDetails.design_id
      worksData.value.author = designDetails.author_name
      worksData.value.worksName = designDetails.design_name
      worksData.value.worksIntroduce = designDetails.description
      worksData.value.worksImgSrc = designDetails.raw_url
      worksData.value.worksDecorateImgSrc = designDetails.share_url
      worksData.value.checkStatus = designDetails.review_status
    } else {
      worksData.value.id = ''
      worksData.value.author = ''
      worksData.value.worksName = ''
      worksData.value.worksIntroduce = ''
      worksData.value.worksImgSrc = ''
      worksData.value.worksImg = null
      worksData.value.worksDecorateImgSrc = ''
      worksData.value.worksDecorateImg = null
      worksData.value.checkStatus = undefined
    }
  } catch (error) {}
}

onMounted(async () => {
  await initPageData()
})
</script>

<style lang="scss" scoped>
.hmj-contribute {
  position: relative;
  width: 2100px;

  &-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 2040px;
    height: 1140px;
    background-color: #fff;
    padding: 20px 40px;
  }
}
.main-container {
  width: 100%;
  height: 100%;
}
.header {
  width: 100%;
  height: 160px;
  border: 1px solid red;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 50px;
    color: #00b0f0;
  }
  p {
    font-size: 40px;
    color: #a6a6a6;
  }
}
.body {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid pink;
  height: calc(100% - 160px);
  padding: 160px 0;
  .main-container {
    width: 1549px;
    height: 774px;
    border: 1px solid red;
    .left {
      width: 50%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 69px;
    }
    .right {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .footer {
      width: 100%;
      height: 90px;
      margin-top: 10px;
      .btn-edit-basic {
        width: 230px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0px;
        border-radius: 69.93px;
        border: 3px;
        opacity: 0px;
        color: #10576a;
        background-color: #d0eeec;
        margin-right: 40px;
      }
      .btn-contribute {
        width: 680px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 69.93px;
        font-size: 40px;
        color: #fff;
        background: #41ddff;
      }
      .btn-checking {
        width: 680px;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 69.93px;
        font-size: 40px;
        color: #fff;
        background: #256a79;
      }
    }
  }
}
.works-img-container {
  width: 800px;
  height: 600px;
  border-radius: 50px;
  background-color: #abe5fa;
  overflow: hidden;
  .remove-upload-img {
    position: absolute;
    top: -10px;
    right: 0;
    font-size: 50px;
    color: #fff;
  }
  .btn-view-works-details {
    position: absolute;
    bottom: 0px;
    right: 10px;
    font-size: 60px;
    color: #fff;
  }
  img {
    width: 100%;
    height: 100%;
  }
  .worksId {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 468px;
    height: 70px;
    color: #fff;
    font-size: 38px;
    background-color: #33ccff;
  }
  .check-status-info-modal {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000026;
    .info-text-container {
      width: 730px;
      height: 136px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 22px 38.5px;
      text-align: center;
      border-radius: 30px;
      font-size: 38px;
      background-color: #00000099;
      &.checking {
        color: #fff;
      }
      &.check-fail {
        color: #ff6060;
      }
    }
  }
}
.form-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .word-count {
    font-size: 36px;
    color: #fff;
  }
}
.field-container {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 10px;
  background-color: #abe5fa;
  label {
    width: 180px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
    border-radius: 10px;
    background-color: #00b0f0;
  }
  input {
    width: calc(100% - 180px);
    height: 100%;
    padding-left: 10px;
    font-size: 30px;
    color: #fff;
    background-color: transparent;
    &::placeholder {
      color: #fff;
    }
  }
}
.works-introduce-field-container {
  width: 100%;
  height: 270px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 60px;
  border-radius: 40px;
  background-color: #abe5fa;
  label {
    width: 180px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
    border-radius: 10px;
    background-color: #00b0f0;
  }
  textarea {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    padding-bottom: 40px;
    font-size: 30px;
    color: #fff;
    resize: none;
    background-color: transparent;
    &::placeholder {
      color: #fff;
    }
  }
  .word-count {
    position: absolute;
    bottom: 0;
    right: 10px;
  }
}
.btn-contribute-works {
  width: 300px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #fff;
  border-radius: 10px;
  background-color: #00b0f0;
}

// 作品预览开始
#user-work-container {
  height: 1040px;
  width: 80%;
  background-color: #f4f1ea;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 70px;
  .left {
    width: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    color: #ababab;
    font-size: 40px;
    .works-preview-basic-info {
      width: 100%;
      height: 200px;
    }
    .works-preview-introduce {
      width: 100%;
      height: calc(100% - 200px);
      background-color: #d4d2c6;
      border-radius: 5px;
      padding: 30px;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    img {
      width: 1200px;
      height: 900px;
    }
  }
}
.ps_ignore-user-wrok-upload-container {
  font-size: 10px;
  height: 990px !important;
  width: 1760px !important;
  position: absolute;
  // top: 0;
  // left: 0;
  top: -10000px;
  left: -1000px;
  background-image: url('@/assets/images/hmj/bg-decrote-works.png');
  display: flex;
  justify-content: center;
  align-items: center;
  .left {
    width: 1400px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 1200px;
      height: 900px;
    }
  }
  .right {
    width: calc(1760px - 1200px);
    height: 100%;
    color: #928885;
    .decorate-works-basic-info {
      margin: 6.8em 0 0 7em;
      line-height: 4.5em;
    }
    .decorate-works-introduce {
      background-color: #d2cec3 60%;
      height: 67em;
      // border: 1px solid red;
      padding: 1em 5em 0em 2.5em;
      margin: 3em 5.5em 0 4.2em;
    }
    span {
      font-size: 2.3em;
      width: 100%;
    }
  }
}
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
// 作品预览结束
</style>
