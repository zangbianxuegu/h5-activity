<template>
  <Transition appear mode="out-in">
    <div class="hmj-contribute flex h-screen">
      <div class="hmj-contribute-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">绘梦节-我要投稿</div>
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear mode="out-in">
          <div
            class="main-container flex flex-col items-center justify-between bg-contain bg-center bg-no-repeat"
          >
            <div class="main flex flex-1 justify-between align-middle">
              <div class="left">
                <div
                  class="works-img-container flex justify-center bg-contain bg-center bg-no-repeat align-middle"
                >
                  <upload-img
                    v-model:data="worksData.worksImg"
                    :cropper="true"
                    :max-size="10 * 1024 * 1024"
                    :min-size="100 * 1024"
                    :reupload="false"
                    :preview-full-image="true"
                    :show-delete-btn="false"
                  ></upload-img>
                  <div class="works-operate-btn-container">
                    <!-- 删除作品作品 -->
                    <div
                      v-if="!isContributed && isUploaded"
                      class="btn-delete-works bg-contain bg-center bg-no-repeat"
                      @click="onClickDeleteWorks"
                    ></div>
                    <!-- 查看作品详情 -->
                    <div
                      v-if="isCheckedSuccess && isUploaded"
                      class="btn-view-works-details bg-contain bg-center bg-no-repeat"
                      @click="onClickViewMyWorks"
                    ></div>
                  </div>
                  <!-- 作品id -->
                  <p
                    v-if="isContributed && isCheckedSuccess && isUploaded"
                    class="worksId"
                  >
                    <span class="group-value">【{{ worksGroupName }}组】</span>
                    <span class="id-value">
                      ID:&ensp;<span id="works-id">{{
                        currentWorksPureId
                      }}</span>
                    </span>
                    <span @click="onClickCopyWorksId" class="btn-copy"
                      >复制</span
                    >
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
                      <span v-html="checkStatusTip"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right">
                <div class="form-container">
                  <div
                    class="field-container author-field-container bg-cover bg-center bg-no-repeat"
                  >
                    <div class="field-bg"></div>
                    <label
                      for="author"
                      class="label-author bg-cover bg-center bg-no-repeat"
                    ></label>
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
                  <div
                    class="field-container works-field-container bg-cover bg-center bg-no-repeat"
                  >
                    <div class="field-bg"></div>
                    <label
                      for="works"
                      class="label-works bg-cover bg-center bg-no-repeat"
                    ></label>
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
                    <span class="word-count">{{ worksNameWordCount }}/8</span>
                  </div>
                  <div
                    class="works-introduce-field-container bg-cover bg-center bg-no-repeat"
                  >
                    <div class="field-textarea-bg"></div>
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
              <div class="left-btn-group">
                <div class="btn-edit-basic" @click="onClickDownloadTemplate">
                  下载模板
                </div>
                <div class="btn-edit-basic" @click="onClickGoToDrawingGuide">
                  绘制指南
                </div>
              </div>
              <div @click="onClickContributeWorks" class="right-btn-group">
                <div
                  :class="contributeBtnClass"
                  class="bg-cover bg-center bg-no-repeat"
                >
                  {{ contributeBtnText }}
                </div>
              </div>
            </div>
            <div class="cat-npc bg-contain bg-center bg-no-repeat"></div>
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
      <!-- 活动规则弹框 -->
      <ModalHelp ref="modalHelp" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { closeToast, showLoadingToast, showToast } from 'vant'
import html2canvas from 'html2canvas'
import WorksDetailModal from './components/WorksDetailModal.vue'
import ModalHelp from '@/views/DiceMap/components/ModalHelp.vue'
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
import { Session } from '@/utils/storage'
import { showConfirmDialog } from '@/utils/dayOfDesign01/confirmDialog'

const sessionIsVisitedKey = 'isVisitedDayOfDesign01PostSubmit'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
// 显示帮助
function handleHelp(): void {
  modalHelp.value?.open()
}

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

// 是否已上传作品（只显示，不一定上传）
const isUploaded = computed((): boolean => {
  return !!worksData.value.worksImgSrc
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
    return `您的稿件被收录到了【${worksGroupName.value}组】作品编号${worksData.value.id}<br />预计将于48小时内审核完毕`
  }
  return `很抱歉，您的作品编号 ${worksData.value.id}<br />未通过审核`
})

// 投稿按钮的文本
const contributeBtnText = computed((): string => {
  if (!isContributed.value) {
    return '立即投稿'
  } else if (isChecking.value) {
    return '审核中...'
  }
  return '重新投稿'
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
  document.querySelector('body')?.focus()
}

// 下载模板
const onClickDownloadTemplate = async (): Promise<void> => {
  try {
    const imageUrl = 'https://ma75.gsf.netease.com/dayofdesign01_template.png'
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
  void showConfirmDialog('确认删除投稿作品？')
    .then(async () => {
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
    .catch(() => {})
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

const onClickDeleteWorks = (): void => {
  worksData.value.worksImg = null
  worksData.value.worksImgSrc = ''
}

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
    const designDetails = (await getDesignDetails({
      policy_name: filePickerConfig.value.policyName,
    })) as SelfDesignDetails
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
  Session.set(sessionIsVisitedKey, true)
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
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('@/assets/images/dayofdesign01/common/bg.jpg');
  }
}
.title {
  width: 902px;
  height: 228px;
  position: absolute;
  top: 10px;
  left: 190px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: 52px;
  left: 634px;
  // border: 1px solid red;
}
.main-container {
  width: 1630px;
  height: 850px;
  position: absolute;
  top: 207px;
  left: 204px;
  padding: 50px 42px 0px 50px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/bg-content.png');
  .main {
    .left {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 50px;
    }
    .right {
      width: 600px;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }
  .footer {
    width: 100%;
    height: 140px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .left-btn-group {
      flex: 1;
      padding-right: 50px;
    }
    .right-btn-group {
      width: 600px;
      & > div {
        width: 420px;
        height: 76px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/btn-main.png');
        box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
        font-size: 34px;
        font-family: SourceHanSansCN-Medium;
        font-weight: 700;
        letter-spacing: 1px;
        &.btn-contribute {
          color: #836a4e;
          opacity: 0.9;
        }
        &.btn-checking {
          color: #836a4e;
          opacity: 0.75;
        }
      }
    }
    .btn-edit-basic {
      width: 260px;
      height: 76px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0px;
      border-radius: 38px;
      border: 3px;
      margin-right: 40px;
      background-color: #ffffff;
      box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
      color: #5a7191;
      font-size: 34px;
      letter-spacing: 1px;
      font-family: SourceHanSansCN-Medium;
      font-weight: 700;
    }
  }
  .cat-npc {
    width: 328px;
    height: 216px;
    position: absolute;
    top: calc((-216px + 45px));
    right: 75px;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/cat-npc.png');
  }
}
.works-img-container {
  width: 880px;
  height: 660px;
  position: relative;
  border-radius: 22px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/border-upload-container.png');
  overflow: hidden;
  .works-operate-btn-container {
    position: absolute;
    right: 40px;
    bottom: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    .btn-delete-works {
      width: 67px;
      height: 67px;
      background-size: 200%;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-delete.png');
      &:hover {
        background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-delete-hover.png');
      }
    }
    .btn-view-works-details {
      width: 67px;
      height: 67px;
      background-size: 200%;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-view-detail.png');
      &:hover {
        background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-view-detail-hover.png');
      }
    }
  }
  .worksId {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
    position: absolute;
    top: 0;
    left: 0;
    width: 500px;
    height: 76px;
    padding: 0 28px;
    color: #fff;
    font-size: 32px;
    background-color: rgba(89, 128, 143, 0.9);
    border-radius: 22px 0px 22px 0px;
    .btn-copy {
      width: 100px;
      height: 47px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 14px;
      background-color: #e4f9ff;
      box-shadow: 0px 6px 6px 0px rgba(108, 108, 108, 0.12);
      border-radius: 23px;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #5a7191;
    }
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
    background-color: rgba(0, 0, 0, 0.3);
    .info-text-container {
      width: 810px;
      height: 160px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      background-color: rgba(228, 249, 255, 0.7);
      font-size: 32px;
      font-weight: 700;
      border-radius: 22px;
      &.checking {
        color: #5a7191;
      }
      &.check-fail {
        color: #cf5a4d;
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
  gap: 32px;
  .word-count {
    font-size: 36px;
    color: #fff;
    opacity: 0.8;
  }
}
.field-container {
  width: 100%;
  height: 76px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding-right: 28px;
  .field-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #5a7191;
    border-radius: 38px;
    opacity: 0.3;
  }
  label {
    width: 180px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fff;
    opacity: 1;
    z-index: 10;
    &.label-author {
      width: 19px;
      height: 24px;
      margin-left: 30px;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-input-user.png');
    }
    &.label-works {
      width: 21px;
      height: 43px;
      margin-left: 29px;
      background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-submit/icon-input-pen.png');
    }
  }
  input {
    flex: 1;
    height: 100%;
    margin-left: 20px;
    font-size: 28px;
    color: #fff;
    background-color: transparent;
    opacity: 0.6;
    &::placeholder {
      color: #fff;
    }
  }
}
.works-introduce-field-container {
  width: 100%;
  height: 444px;
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .field-textarea-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #5a7191;
    border-radius: 24px;
    opacity: 0.3;
  }
  textarea {
    width: 100%;
    height: 100%;
    padding: 23px;
    font-size: 30px;
    color: #fff;
    resize: none;
    background-color: transparent;
    opacity: 0.6;
    &::placeholder {
      color: #fff;
    }
  }
  .word-count {
    position: absolute;
    bottom: 0;
    right: 10px;
    opacity: 0.8;
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
