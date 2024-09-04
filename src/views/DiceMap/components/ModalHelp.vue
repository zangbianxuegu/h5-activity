<template>
  <activity-modal ref="modalHelp">
    <template #content>
      <section aria-labelledby="activity-rules-title">
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">活动时间：</span>
          2024年10月1日~2024年10月7日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>活动期间，可前往飞行里程碑页面完成各种任务获取骰子</li>
          <li>
            使用骰子后，角色可在旅行尾迹地图上移动相应的格数，并获取对应的奖励。每次完成一圈后，会获得<span
              class="text-[#ffcb4d]"
              >飞行券*30</span
            >的额外奖励；
          </li>
          <li>使用飞行券可在纪念品商店兑换各种道具。</li>
        </ul>
      </section>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

function open(): void {
  modalHelp.value?.openModal()
}

defineExpose({
  open,
})
</script>
