<template>
  <activity-modal
    ref="modalHelp"
    modal-class="w-[1140px] h-[830px]"
    :background-image="modalImage"
    :overlay-opacity="70"
  >
    <template #close>
      <h2
        class="modal-close absolute right-[15px] top-[15px] overflow-hidden bg-contain bg-center bg-no-repeat"
        @click="close"
      >
        <span class="sr-only">关闭</span>
      </h2>
    </template>
    <template #title>
      <h2 class="modal-title mb-[20px] overflow-hidden bg-contain bg-center">
        <span class="sr-only">提示</span>
      </h2>
    </template>
    <template #content>
      <section
        aria-labelledby="activity-rules-title"
        class="h-[620px] overflow-y-scroll px-[80px]"
      >
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">【征集期】</span>
        </h3>
        <h3 class="modal-text mt-[10px]">
          <span class="font-semibold">活动时间：</span>2025年1月1日 ~ 1月31日
        </h3>
        <h3 class="modal-text mt-[10px]">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <p class="modal-text">
          1、活动期间，请使用<span class="text-[#d57518]"
            >我要投稿-下载模板</span
          >中的模板，并根据本期主题：<span class="text-[#d57518]">国风演绎</span
          >进行<span class="text-[#d57518]">发型</span>和<span
            class="text-[#d57518]"
            >斗篷</span
          >部位的设计和绘制。依照尺寸要求上传作品后，审核通过即视为投稿成功；
        </p>
        <p class="modal-text">
          2、投递稿件时，作品将随机自动进入四个分组的其中之一，<span
            class="text-[#d57518]"
            >分组无法修改</span
          >，仅用于投票，不代表分类等其他信息标签；
        </p>
        <p class="modal-text">
          3、稿件投递通常在<span class="text-[#d57518]">48小时</span
          >内审核完毕，如遇节假日可能会有所顺延，如果您对审核结果存在疑问，可以通过屏幕右上角的<span
            class="text-[#d57518]"
            >设置-精灵-客服-绘梦节作品申诉</span
          >，提交相关反馈；
        </p>
        <p class="modal-text">
          4、每个账号可投递<span class="text-[#d57518]">一份稿件</span
          >参与比赛，投稿作品与<span class="text-[#d57518]"
            >游戏账号一对一绑定</span
          >，如果您对已投稿的作品不满意，可以删除原作品后上传新作品，<span
            class="text-[#d57518]"
            >48小时内仅允许进行一次投稿</span
          >，即两次投稿的间隔时间需大于48小时。<span class="text-[#d57518]"
            >请勿在征集期临近结束时进行删除重传</span
          >，避免两次投稿的规定间隔时间与审核时间导致您的作品超过最终上传期限；
        </p>
        <p class="modal-text">
          5、请在保证作品的原创性的同时，务必<span class="text-[#d57518]"
            >保留您的绘制过程</span
          >，以便出现争议时作为申诉证明。切勿使用联动IP、AIGC或他人作品进行投稿，一经发现作品将被<span
            class="text-[#d57518]"
            >下架并取消参赛资格</span
          >。参赛作品须为《光·遇》相关，参赛者投稿作品即视为<span
            class="text-[#d57518]"
            >接受本次活动的所有规则</span
          >；
        </p>
        <p class="modal-text">
          6、请勿投递与活动无关的稿件内容，一经发现我们将对灌水账号进行<span
            class="text-[#d57518]"
            >禁止上传</span
          >的处罚限制；
        </p>
        <p class="modal-text">
          7、更多活动细则，请前往<span class="text-[#d57518]"
            >绘梦节-活动详情</span
          >查看完整活动信息。
        </p>
      </section>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalImage = new URL(
  '@/assets/images/dayofdesign01/common/modal-bg-large.png',
  import.meta.url,
).href

function open(): void {
  modalHelp.value?.openModal()
}

function close(): void {
  modalHelp.value?.closeModal()
}

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.modal-title {
  width: 113px;
  height: 66px;
  background-image: url('@/assets/images/dayofdesign01/common/title-tips.png');
}
.modal-close {
  width: 71px;
  height: 71px;
  background-image: url('@/assets/images/dayofdesign01/common/close.png');
}
</style>
