<template>
  <help-modal ref="modalHelp">
    <template #content>
      <section
        aria-labelledby="activity-rules-title"
        class="h-[640px] overflow-y-scroll px-[40px]"
      >
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">活动时间：</span>
          2025年1月23日~2025年2月10日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>
            活动期间，完成任务可以解锁一块拼图，获得<span class="text-[#ffcb4d]"
              >花灯*60</span
            >
          </li>
          <li>解锁一整块拼图，可获得额外奖励；</li>
          <li>
            使用花灯可在<span class="text-[#ffcb4d]">新春百货</span
            >处兑换想要的奖励；
          </li>
          <li>
            <span class="text-[#ffcb4d]">2月18日0点</span
            >时，未使用的花灯将被清零，请及时使用！
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
