<template>
  <Transition appear mode="out-in">
    <div class="hmj-contribute flex h-screen">
      <div class="hmj-contribute-main">
        <Transition appear mode="out-in">
          <div class="main-container">
            <div class="test-btn-group absolute">
              <van-button type="primary" @click="onClickViewMyWorks"
                >我的作品</van-button
              >
              <van-button type="primary" @click="onClickGetFilePickerToken"
                >获取filepicker token</van-button
              >
              <van-button type="primary" @click="onClickReviewText"
                >检测文字信息</van-button
              >
              <van-button type="primary" @click="onClickUploadImgToFilePicker"
                >filepiker上传图片</van-button
              >
              <van-button type="primary" @click="onClickUploadWorksDataToServer"
                >上传数据到服务端</van-button
              >
              <van-button type="primary" @click="onClickTestContribute"
                >测试投稿整个流程</van-button
              >
            </div>
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
                    <div class="manuscript-container">
                      <div
                        v-show="!worksData.worksImgSrc"
                        class="btn-manuscript-group"
                      >
                        <div
                          class="btn-manuscript"
                          @click="onClickGoToUploadWorks"
                        >
                          <div class="icon-container">
                            <van-icon name="plus" />
                          </div>
                          <span>上传作品</span>
                          <!-- 隐藏触发上传稿件的元素 -->
                          <input
                            ref="imageUploadsInputDomRef"
                            type="file"
                            id="image_uploads_cut_test"
                            name="image_uploads"
                            accept="*"
                            v-show="false"
                          />
                        </div>
                      </div>
                      <div
                        v-show="worksData.worksImgSrc"
                        class="works-image-container"
                      >
                        <div
                          v-if="!isContributed"
                          class="remove-upload-img"
                          @click="removeUploadImg"
                        >
                          <van-icon name="cross" />
                        </div>
                        <img
                          ref="formWorksRef"
                          id="works-img"
                          :src="worksData.worksImgSrc"
                          alt=""
                          srcset=""
                        />
                        <p v-if="isContributed" class="worksId">
                          <span
                            >ID
                            <span id="works-id">{{ worksData.id }}</span>
                          </span>
                          <van-icon
                            id="copy-works-id"
                            name="description-o"
                            @click="onClickCopyWorksId"
                          />
                        </p>
                        <div
                          v-if="isContributed && !isCheckedSuccess"
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
                          placeholder="作者名仅限字母、文字"
                          :disabled="isContributed"
                          @change="
                            (event: Event) =>
                              onChangeAuthorWordCount(event, 'author')
                          "
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
                          placeholder="作品名仅限字母、文字"
                          :disabled="isContributed"
                          @change="
                            (event: Event) =>
                              onChangeAuthorWordCount(event, 'worksName')
                          "
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
                          placeholder="请输入作品介绍"
                          :disabled="isContributed"
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
                    <div @click.stop="onClickDownloadTemplate">
                      <van-icon name="share-o" />
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

        <!-- 裁剪弹窗 -->
        <Teleport to="body">
          <van-overlay
            class="cropper-modal-container"
            :show="cropperData.isShow"
          >
            <div class="modal-wrapper">
              <div class="modal-body flex flex-col justify-center align-middle">
                <div
                  class="cropper-container-header flex w-full justify-between align-middle"
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
                  class="cropper-container-footer flex justify-center align-middle"
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
        <!-- 我的作品弹窗 -->
        <works-detail-modal
          v-model:show="isShowMyWorksModal"
          :worksData="myWorksData"
          @update-works-data="updateWorksDataFromWorksDetailModal"
        ></works-detail-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showConfirmDialog, showToast } from 'vant'
import html2canvas from 'html2canvas'
import WorksDetailModal from './components/WorksDetailModal.vue'
import axios from 'axios'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { saveImgToDeviceAlbum } from '@/utils/request'
import ClipboardJS from 'clipboard'
import {
  getFilePickerToken,
  reviewText,
  uploadImgToFilePicker,
  uploadWorksDataToServer,
} from '@/utils/filePicker'

import type {
  ReviewTextRejectResult,
  UploadImgToFilePickerResponse,
} from '@/utils/filePicker'

interface WorksData {
  author: string
  worksName: string
  worksIntroduce: string
  id: string
  checkStatus: number | undefined
  worksImg?: File | undefined
  worksImgSrc: string
  worksDecorateImg?: File | undefined
  worksDecorateImgSrc?: string
}

const worksData = ref<WorksData>({
  id: '',
  author: '',
  worksName: '',
  worksIntroduce: '',
  worksImg: undefined,
  worksImgSrc: '',
  checkStatus: undefined,
  worksDecorateImgSrc: '',
})

const previewData = ref({
  isShow: false,
})

// 是否已上传作品
const isContributed = computed((): boolean => {
  return worksData.value.id !== ''
})
// 是否已审核通过
const isCheckedSuccess = computed((): boolean => {
  return worksData.value.checkStatus === 2
})
// 是否已审核通过
const isCheckedFail = computed((): boolean => {
  return worksData.value.checkStatus === 1
})
// 是否审核中
const isChecking = computed((): boolean => {
  return worksData.value.checkStatus === 0
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
  if (worksData.value.checkStatus === 0) {
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

// 强制输入纠正
const onChangeAuthorWordCount = (
  event: Event,
  key: 'author' | 'worksName',
): void => {
  const inputValue = (event.target as HTMLInputElement)?.value
  worksData.value[key] = inputValue.trim()
}

const onClickDownloadTemplate = async (): Promise<void> => {
  const imageUrl = 'http://10.227.199.103:7897/images/hmj-works-template.png'
  const res = await saveImgToDeviceAlbum(imageUrl)
  if (res) {
    showToast('下载成功')
  } else {
    showToast('下载失败')
  }
}
const onClickGoToDrawingGuide = (): void => {
  showToast('先别急,绘制指南还没做')
}
const formWorksRef = ref()
const imageUploadsInputDomRef = ref()
const onClickGoToUploadWorks = (): void => {
  imageUploadsInputDomRef.value.click()
}

let CROPPER: Cropper | null
const cropperData = ref({
  isShow: false,
  preCropperImgUrl: '',
  isShowBorderCorn: false,
})

watchEffect(() => {
  if (cropperData.value.isShow) {
    setTimeout(() => {
      cropperData.value.isShowBorderCorn = true
    }, 500)
  } else {
    cropperData.value.isShowBorderCorn = false
  }
})

// 添加上传作品的监听
const listenUploadImgChange = (): void => {
  imageUploadsInputDomRef.value.addEventListener(
    'change',
    function (event: Event) {
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      const file = files[0]

      // 设置允许的文件格式和文件大小限制
      const allowedTypes = ['image/jpeg', 'image/png']
      const maxSize = 10 * 1024 * 1024 // 10 MB
      const minSize = 100 * 1024 // 100kb

      if (file) {
        // 检查文件类型
        if (!allowedTypes.includes(file.type)) {
          showToast('上传失败，只能上传png和jpg')
          return
        }
        // 检查文件大小
        if (file.size > maxSize) {
          showToast('您选择的图片大小超过10MB，无法上传')
          return
        } else if (file.size < minSize) {
          showToast('您选择的图片过小，可能会影响展示效果')
        }
        const reader = new FileReader()

        reader.onload = function (e) {
          const img = new Image()

          cropperData.value.isShow = true
          cropperData.value.preCropperImgUrl = e.target?.result as string
          void nextTick(() => {
            showCropperModal()
          })

          img.src = e.target?.result as string // 使用 FileReader 读取的图片数据
        }

        reader.readAsDataURL(file) // 读取文件为 Data URL
      }
    },
  )
}

// 展示裁剪
const showCropperModal = (): void => {
  const image = document.querySelector(
    '#upload_img_cut_test_container img',
  ) as HTMLImageElement
  console.log('image', image)
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
    ready() {
      CROPPER?.setDragMode('move')
    },
    zoom: (event) => {
      console.log('zoom event', event)
      if (event.detail.ratio > event.detail.oldRatio) {
        // console.log('放大')
      } else {
        // console.log('缩小')
      }
    },
    crop(event) {
      // console.log('crop event', event)
    },
  })
}

// 完成裁剪
const onClickFinishCropper = (): void => {
  // getCroppedCanvas方法可以将裁剪区域的数据转换成canvas数据
  CROPPER?.getCroppedCanvas({
    width: 1200,
    height: 900,
    fillColor: '#fff',
    imageSmoothingEnabled: true,
    imageSmoothingQuality: 'high',
  }).toBlob((blob) => {
    const imgUrl = URL.createObjectURL(blob as Blob)
    worksData.value.worksImgSrc = imgUrl
    worksData.value.worksImg = new File([blob as Blob], 'hello.png', {
      type: blob?.type,
    })
    hideCropperModal()
  })
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

// 删除上传作品
const removeUploadImg = (): void => {
  worksData.value.worksImgSrc = ''
}

// 请求后端检查作品信息是否合规
const checkWorkInfoValid = (): Promise<boolean> => {
  showToast('作品信息检查中...')
  // const { author, workName, workIntroduce } = workInfo.value
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

// 删除作品确认弹窗
const showConfirmDialogForReupload = (): void => {
  showConfirmDialog({
    title: '',
    message: '确认删除投稿作品？',
  })
    .then(async () => {
      // on confirm
      try {
        const { data } = await axios.get(
          'http://10.227.199.103:7897/ma75WXJ/deleteWorks',
          {
            params: {
              userId,
            },
          },
        )

        showToast(data.message)
        setTimeout(() => {
          void initPageData()
        }, 500)
      } catch (error) {
        console.error(error)
      }
    })
    .catch(() => {
      // on cancel
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
        verifyErrorTip: '作者名仅限字母、文字',
      },
      {
        param: 'worksName',
        emptyTip: '请填写作品名',
        verifyErrorTip: '作品名仅限字母、文字',
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
    const verifyReg = /^[A-Za-z\u4e00-\u9fa5]{1,8}$/
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
    // 检查信息是否合规
    const checkResult = await checkWorkInfoValid()
    // eslint-disable-next-line no-useless-return
    if (!checkResult) return

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
          worksData.value.worksDecorateImg = new File([blob], 'hello.png', {
            type: blob?.type,
          })
          worksData.value.worksDecorateImgSrc = url
          resolve()
          // const link = document.createElement('a')
          // link.href = url
          // link.download = '111'
          // link.click()
        }
      })
    })
  })
}

let userId = ''

const getUserId = async (): Promise<void> => {
  const response = await fetch('https://api.ipify.org?format=json')
  const data = await response.json()
  userId = data.ip.split('.').join('')
}

const confirmSubmitWork = async (): Promise<void> => {
  // 生成作品拼装图
  await changeDomToImage()
  const formData = new FormData()
  formData.append('userId', userId)
  formData.append('author', worksData.value.author)
  formData.append('worksName', worksData.value.worksName)
  formData.append('introduce', worksData.value.worksIntroduce)
  formData.append('file', worksData.value.worksImg as File)
  formData.append('file', worksData.value.worksDecorateImg as File)
  console.log(
    'worksData.value.worksDecorateImg',
    worksData.value.worksDecorateImg,
  )

  try {
    await axios.post(
      'http://10.227.199.103:7897/ma75WXJ/contribute',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    showToast('投稿成功')
    await initPageData()
  } catch (error) {
    console.error('上传失败:', error)
  }
}

const getContributedWorksData = async (): Promise<WorksData | undefined> => {
  try {
    const { data } = await axios.get(
      'http://10.227.199.103:7897/ma75WXJ/getWorks',
      {
        params: {
          userId,
        },
      },
    )
    if (data.success) {
      return {
        id: data.data.id,
        author: data.data.author,
        worksName: data.data.worksName,
        worksIntroduce: data.data.introduce,
        worksImgSrc: data.data.path,
        checkStatus: data.data.checkStatus,
      }
    }
    showToast(data.message)
    return {
      id: '',
      author: '',
      worksName: '',
      worksIntroduce: '',
      worksImgSrc: '',
      checkStatus: undefined,
    }
  } catch (error) {
    console.error('上传失败:', error)
  }
}

const isShowMyWorksModal = ref(false)
const myWorksData = ref<WorksData>({
  id: '',
  author: '',
  worksName: '',
  worksIntroduce: '',
  worksImgSrc: '',
  checkStatus: undefined,
  worksDecorateImgSrc: '',
})

// 查看我的作品
const onClickViewMyWorks = async (): Promise<void> => {
  if (!isCheckedSuccess.value) {
    showToast('暂没有已通过审核的作品')
    return
  }
  const res = await getContributedWorksData()
  if (res) {
    myWorksData.value = res
    isShowMyWorksModal.value = true
  }
}

const initPageData = async (): Promise<void> => {
  await getUserId()
  const { id, author, worksName, worksIntroduce, worksImgSrc, checkStatus } =
    (await getContributedWorksData()) as WorksData
  worksData.value = {
    id,
    author,
    worksName,
    worksIntroduce,
    worksImgSrc,
    checkStatus,
  }
}

const updateWorksDataFromWorksDetailModal = (res: WorksData): void => {
  worksData.value = res
}

const filePickerConfig = ref({
  token: '',
  policyName: 'image_normal',
  filePickerUrl: 'http://devfp.ps.netease.com/test/file/new/',
  currentUoloadFileUrl: '',
})
const onClickGetFilePickerToken = async (): Promise<string> => {
  const token = await getFilePickerToken(
    filePickerConfig.value.filePickerUrl,
    filePickerConfig.value.policyName,
  )
  filePickerConfig.value.token = token
  console.log('token', token)
  return token
}
const onClickReviewText = async (): Promise<boolean> => {
  try {
    const res = await reviewText('', {
      author: worksData.value.author,
      worksName: worksData.value.worksName,
      worksIntroduce: worksData.value.worksIntroduce,
    })
    if (res) {
      return true
    }
  } catch (e: any) {
    const errorObject = JSON.parse(e) as ReviewTextRejectResult
    if (
      errorObject.errorType === 'invalidEvent' ||
      errorObject.errorType === 'badRequest'
    ) {
      showToast(errorObject.errorDefaultText)
    } else if (errorObject.errorType === 'valueError') {
      showToast(errorObject.invalidReasonDefaultText)
    }
  }
  return false
}
const onClickUploadImgToFilePicker =
  async (): Promise<UploadImgToFilePickerResponse> => {
    const worksImgFile = worksData.value.worksImg as File
    const res = await uploadImgToFilePicker(
      filePickerConfig.value.token,
      new Blob([worksImgFile], {
        type: worksImgFile.type,
      }),
    )
    filePickerConfig.value.currentUoloadFileUrl = res.url
    return res
  }
const onClickUploadWorksDataToServer = async (): Promise<any> => {
  try {
    const { design_id: designId } = await uploadWorksDataToServer(
      200,
      filePickerConfig.value.policyName,
      {
        author: worksData.value.author,
        worksName: worksData.value.worksName,
        worksIntroduce: worksData.value.worksIntroduce,
      },
      filePickerConfig.value.currentUoloadFileUrl,
    )
    worksData.value.id = designId
  } catch (e) {
    console.log(e)
  }
}

const onClickTestContribute = async (): Promise<void> => {
  // 获取filepicker token
  const token = await onClickGetFilePickerToken()
  if (token) {
    // 检测作品文本信息
    const reviewResult = await onClickReviewText()
    if (reviewResult) {
      // 上传稿件至filepicker
      const { url } = await onClickUploadImgToFilePicker()
      if (url) {
        // 存储稿件最终数据至服务端,完成投稿
        await onClickUploadWorksDataToServer()
      }
    }
  }
}

onMounted(async () => {
  // addEventListenerToImageUploads()
  listenUploadImgChange()
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
      justify-content: flex-end;
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
.manuscript-container {
  width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 50px;
  background-color: #abe5fa;
  overflow: hidden;
}
.btn-manuscript-group {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 80px;
}
.btn-manuscript {
  width: 140px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  .icon-container {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #00b0f0;
    border-radius: 20px;
    .van-icon {
      font-size: 50px;
    }
  }
  span {
    font-size: 28px;
  }
}
.works-image-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  .remove-upload-img {
    position: absolute;
    top: -10px;
    right: 0;
    font-size: 50px;
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
    width: 268px;
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
</style>
<style>
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
</style>
