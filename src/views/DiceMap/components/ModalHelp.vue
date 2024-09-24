<template>
  <activity-modal ref="modalHelp">
    <template #content>
      <section class="content px-4" aria-labelledby="activity-rules-title">
        <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
        <h3 class="modal-text">
          <span class="font-semibold">活动时间：</span>
          2024年9月27日~2024年10月11日
        </h3>
        <h3 class="modal-text mt-2">
          <span class="font-semibold">活动内容：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>
            活动期间，可在活动页面通过完成任务获取<span class="text-[#ffcb4d]"
              >蟹蟹的士</span
            >和<span class="text-[#ffcb4d]">遥鲲飞机</span
            >。使用蟹蟹的士可在棋盘上按照随机步数进行移动，使用遥鲲飞机可按照指定步数进行移动，角色移动到目的地后可获得对应格子上的奖励。奖励包含<span
              class="text-[#ffcb4d]"
              >喜遇券*20、 喜遇券*10、红色尾迹和浪漫烟花</span
            >；
          </li>
          <li>
            角色移动到带有问号的格子上时，可获得随机魔法，更有机会获得<span
              class="text-[#ffcb4d]"
              >光遇喜茶联动「30-3优惠券」、「第二杯半价券」或「赠饮券」</span
            >（赠饮券可免费兑换光遇喜茶联动茶饮一杯）
            <br />
            注意：优惠券、第二杯半价券和赠饮券数量有限，库存消耗完后即止，此时只能获得随机魔法作为奖励；
          </li>
          <li>
            当角色移动回起点时，剩余未走完的步数将被清零不再继续移动。角色从起点处开始新一轮游戏，并获得<span
              class="text-[#ffcb4d]"
              >喜遇券*30</span
            >的额外奖励；
          </li>
          <li>
            使用喜遇券可在喜遇商店兑换各种道具，包含<span class="text-[#ffcb4d]"
              >爱心、彩虹尾迹以及各种魔法</span
            >。同时，也可使用蜡烛兑换<span class="text-[#ffcb4d]">蟹蟹的士</span
            >和<span class="text-[#ffcb4d]">遥鲲飞机</span>。
          </li>
        </ul>
        <h3 class="modal-text mt-2">
          <span class="font-semibold">光遇喜茶联动优惠券使用规则：</span>
        </h3>
        <ul class="modal-text list-inside list-decimal">
          <li>
            请前往<span class="text-[#ffcb4d]">喜茶GO小程序</span
            >兑换使用。喜茶券兑换路径：<span class="text-[#ffcb4d]"
              >复制券码—打开喜茶GO小程序—我的—喜茶券—兑换喜茶券—输入券码—兑换使用</span
            >；
          </li>
          <li>请在结算页面手动勾选对应可用喜茶券；</li>
          <li>
            喜茶券有效时间：2024年9月27日至2024年10月31日
            <br />
            注意：若在使用喜茶优惠券时遇到问题，请联系喜茶客服处理。详细使用规则以喜茶GO页面规则展示为准。活动结束后无法再查询喜茶券码，请及时兑换！
          </li>
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
<style scoped>
.content {
  height: 640px;
  overflow: auto;
}
</style>
