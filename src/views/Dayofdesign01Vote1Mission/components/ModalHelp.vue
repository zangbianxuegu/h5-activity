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
          <span class="font-semibold">【选款期】</span>
        </h3>
        <h3 class="modal-text mt-[10px]">
          <span class="font-semibold">活动时间：</span>2025年2月1日 ~ 2月16日
        </h3>
        <h3 class="modal-text mt-[10px]">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <p class="modal-text">
          1、选款期开启后，玩家可对成功参赛的作品进行投票，4个分组中分别投出得票数<span
            class="text-[#d57518]"
            >前15名</span
          >的作品，<span class="text-[#d57518]">共计前60名</span
          >的作品可进入官方评选期；
        </p>
        <p class="modal-text">
          2、活动期间，前往<span class="text-[#d57518]">绘梦节-活动会场</span
          >页面可对作品进行投票、收藏、分享；
        </p>
        <p class="modal-text">3、选款期开启后，创作者将无法再删除作品；</p>
        <p class="modal-text">
          4、完成指定任务即可获得分组投票次数，每个账号每天可以获得<span
            class="text-[#d57518]"
            >每个分组的投票次数*3</span
          >，投票达到指定次数时可获得<span class="text-[#d57518]">助梦礼包</span
          >，打开后可从<span class="text-[#d57518]">爱心、蜡烛、魔法</span
          >等多种好礼中随机抽取一个；
        </p>
        <p class="modal-text">
          5、更多活动细则，请前往<span class="text-[#d57518]"
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
