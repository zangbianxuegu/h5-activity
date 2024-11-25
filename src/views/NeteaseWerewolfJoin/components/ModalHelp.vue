<template>
  <help-modal ref="modalHelp">
    <template #content>
      <section
        aria-labelledby="activity-rules-title"
        class="h-[640px] overflow-y-scroll px-4"
      >
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">活动时间：</span>
          2024年12月19日~2025年1月8日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>活动期间，完成不同任务，获得奖励。</li>
          <li>
            以光之子身份完成以下任务：<br />
            &nbsp;活动任务：成功指认冥龙之子3次，获得
            <span class="text-[#ffcb4d]">蜡烛*2</span><br />
            &nbsp;每周任务：每周完成一场游戏，获得
            <span class="text-[#ffcb4d]">篝火*1</span><br />
            &nbsp;每周任务：每周在顺序发言到自己时做1个动作，<br />
            &nbsp;获得
            <span class="text-[#ffcb4d]">璀璨之星*1</span><br />
          </li>
          <li>
            以冥龙之子身份完成以下任务：<br />
            &nbsp;活动任务：撞翻光之子或先知5次，获得
            <span class="text-[#ffcb4d]">蜡烛*2</span><br />
            &nbsp;每周任务：每周完成一场游戏，获得
            <span class="text-[#ffcb4d]">秋千*1</span><br />
            &nbsp;每周任务：每周在顺序发言到自己时做1个动作，<br />
            &nbsp;获得
            <span class="text-[#ffcb4d]">漂浮*1</span><br />
          </li>
          <li>
            以先知身份完成以下任务：<br />
            &nbsp;活动任务：成功查验到冥龙之子2次，获得
            <span class="text-[#ffcb4d]">蜡烛*2</span><br />
            &nbsp;每周任务：每周完成一场游戏，获得
            <span class="text-[#ffcb4d]">畅谈长桌*1</span><br />
            &nbsp;每周任务：每周在顺序发言到自己时做1个动作，<br />
            &nbsp;获得
            <span class="text-[#ffcb4d]">冥龙克星*1</span><br />
          </li>
          <li>
            不限制身份的任务：<br />
            &nbsp;至少完成1局“冥龙之夜”游戏，累计1天，获得
            <span class="text-[#ffcb4d]">光能药剂*1</span><br />
            &nbsp;至少完成1局“冥龙之夜”游戏，累计3天，获得
            <span class="text-[#ffcb4d]">体型重塑*1</span><br />
            &nbsp;至少完成1局“冥龙之夜”游戏，累计5天，获得
            <span class="text-[#ffcb4d]">兜帽女巫发型</span><br />
            &nbsp;至少完成1局“冥龙之夜”游戏，累计7天，获得
            <span class="text-[#ffcb4d]">爱心*1</span><br />
            &nbsp;至少完成1局“冥龙之夜”游戏，累计10天，获得
            <span class="text-[#ffcb4d]">红底女巫斗篷</span>
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
