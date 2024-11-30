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
          2024年12月6日~2025年2月17日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>活动期间，前往活动中心的页面可查看自己的专属邀请码；</li>
          <li>
            将邀请码告知其他旅人，对方可填入自己的邀请码进行绑定，绑定成功后即可立即获得一份奖励；
          </li>
          <li>
            当被邀请的旅人的数量和活跃度达到一定条件时，邀请的旅人可获得奖励。
          </li>
          <b>邀请码绑定规则：</b>
        </ul>
        <ul class="modal-text list-inside list-decimal">
          <li>
            每个角色只能主动绑定一个他人的邀请码，但一个角色的邀请码可被多个旅人绑定；
          </li>
          <li>不可以绑定自己的邀请码；</li>
          <li>绑定邀请码后无法进行更换或解绑；</li>
          <li>
            两个角色之间无法进行互相绑定，即A绑定了B的邀请码后，B无法再绑定A；
          </li>
          <li>
            <span class="text-[#ffcb4d]">2024年12月6日1点前</span
            >创建的角色无法绑定他人的邀请码。
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
