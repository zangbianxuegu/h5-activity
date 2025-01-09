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
          2025年1月23日~2025年2月10日
        </h3>
        <h3 class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>
            活动期间，全服送心火达到指定次数，可领取<span class="text-[#ffcb4d]"
              >花灯</span
            >代币：

            <ul class="modal-text ml-[40px] list-inside list-disc">
              <li>
                全服送心火次数达到1000万获得<span class="text-[#ffcb4d]"
                  >花灯*50</span
                >
              </li>
              <li>
                全服送心火次数达到2000万获得<span class="text-[#ffcb4d]"
                  >花灯*50</span
                >
              </li>
              <li>
                全服送心火次数达到3000万获得<span class="text-[#ffcb4d]"
                  >花灯*60</span
                >
              </li>
              <li>
                全服送心火次数达到4000万获得<span class="text-[#ffcb4d]"
                  >花灯*60</span
                >
              </li>
              <li>
                全服送心火次数达到5000万获得<span class="text-[#ffcb4d]"
                  >花灯*80</span
                >
              </li>
            </ul>
          </li>
          <li>
            活动期间，个人送心火达到指定次数，可领取以下奖励：
            <ul class="modal-text ml-[40px] list-inside list-disc">
              <li>
                个人送心火次数达到10，获得<span class="text-[#ffcb4d]"
                  >新年烟花*2</span
                >
              </li>
              <li>
                个人送心火次数达到50，获得<span class="text-[#ffcb4d]"
                  >爱心*2、《光·遇》“相遇”限定礼盒抽奖资格</span
                >
              </li>
            </ul>
          </li>
          <li>
            相遇礼盒抽奖说明：
            <ul class="modal-text ml-[40px]">
              <li>
                活动结束后，我们将从领取了<span class="text-[#ffcb4d]"
                  >抽奖资格</span
                >的旅人中，抽选<span class="text-[#ffcb4d]">500位幸运旅人</span
                >赠送<span class="text-[#ffcb4d]">《光·遇》“相遇”限定礼盒</span
                >;
              </li>
              <li>
                中奖名单将于<span class="text-[#ffcb4d]">2月17日12:00</span
                >于《光·遇》官网公示。
              </li>
            </ul>
          </li>
          <li>
            相遇礼盒发放说明：
            <ul class="modal-text ml-[40px]">
              <li>
                我们将于<span class="text-[#ffcb4d]">2月17日</span
                >给500位幸运旅人发送<span class="text-[#ffcb4d]"
                  >游戏内邮件</span
                >，请中奖的旅人根据邮件指引，前往精灵输入中奖口令码，获取信息收集问卷，填写收货地址等信息。
              </li>
              <li>
                收货信息填写截止时间为<span class="text-[#ffcb4d]"
                  >2月28日23:59:59</span
                >，过期未填写视为放弃奖励；
              </li>
              <li>
                礼盒将于<span class="text-[#ffcb4d]">3月1日起</span>陆续寄出。
              </li>
            </ul>
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
