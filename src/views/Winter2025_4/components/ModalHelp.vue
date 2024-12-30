<template>
  <help-modal ref="modalHelp">
    <template #content>
      <section aria-labelledby="activity-rules-title" class="px-4">
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">活动时间：</span>
          2025年2月11日~2025年2月17日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>
            活动期间，每日猜对一次灯谜，即可领取
            <span class="text-[#ffcb4d]">花灯代币*10</span>
          </li>
          <li>
            活动期间，达成累计猜对灯谜次数，即可领取
            <span class="text-[#ffcb4d]">光能药剂*1，长大成人*1，秋千*1</span>
          </li>
          <li>
            活动期间，达成累计点赞纸船天数，即可对应领取
            <span class="text-[#ffcb4d]">漂浮*1，返老还童*1，留影蜡烛*1</span>
          </li>
          <li>
            活动期间，达成累计收集季节蜡烛数量，即可对应领取
            <span class="text-[#ffcb4d]">璀璨之星*1，大只佬*1，蜡烛*1</span>
          </li>
        </ul>
      </section>
    </template>
  </help-modal>
</template>

<script setup lang="ts">
import HelpModal from '@/components/Modal'

const modalHelp = ref<InstanceType<typeof HelpModal> | null>(null)

function open(): void {
  modalHelp.value?.openModal()
}

defineExpose({
  open,
})
</script>
