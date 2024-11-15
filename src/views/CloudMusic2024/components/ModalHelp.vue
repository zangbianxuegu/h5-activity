<template>
  <activity-modal ref="modalHelp">
    <template #content>
      <section
        aria-labelledby="activity-rules-title"
        class="h-[640px] overflow-y-scroll p-4"
      >
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">活动时间：</span>
          2024年12月6日~2024年12月19日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <p class="modal-text">每完成一个任务，可积攒一分钟的听歌进度</p>
        <ul class="modal-text list-inside list-decimal">
          <li>点评一次分享音符</li>
          <li>点赞一次分享音符</li>
          <li>放置2个分享音符</li>
          <li>和好友一起牵手听分享音符</li>
          <li>在雨林秘密花园中使用分享海螺点歌</li>
        </ul>
        <p class="modal-text">每积攒一分钟的听歌进度，可依次获取以下奖励</p>
        <ul class="modal-text list-inside list-decimal">
          <li><span class="text-[#ffcb4d]">分享音符*1</span></li>
          <li>
            在<span class="text-[#ffcb4d]"
              >凯旋手碟试用魔法、白吉它试用魔法、雏鸟之琴试用魔法、小提琴试用魔法、萨克斯试用魔法 </span
            >中随机获得一个
          </li>
          <li><span class="text-[#ffcb4d]">秋千*2 </span></li>
          <li>
            <span class="text-[#ffcb4d]">古典音乐桌椅试用魔法*1 </span>
          </li>
          <li><span class="text-[#ffcb4d]">爱心×2 </span></li>
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
