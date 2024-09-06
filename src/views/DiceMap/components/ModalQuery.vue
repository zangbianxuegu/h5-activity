<template>
  <activity-modal ref="modalQuery">
    <template #title>
      <h2
        class="modal-title overflow-hidden bg-contain bg-center indent-[-9999px]"
      >
        中奖查询
      </h2>
    </template>
    <template #content>
      <ul class="list">
        <li class="item flex items-center">
          <div class="item-name w-1/2 bg-no-repeat">
            <span class="font-medium text-[#399cf3]">喜茶联动30-3优惠券</span>
          </div>
          <div class="relative w-1/2">
            <span class="mr-4 inline-block w-full text-center text-[#399cf3]"
              >hasdfg73113</span
            >
            <button class="copy absolute bg-contain">
              <span class="sr-only">复制</span>
            </button>
          </div>
        </li>
        <li class="item"></li>
        <li class="item"></li>
        <li class="item"></li>
        <li class="item"></li>
        <li class="item"></li>
        <li class="item"></li>
        <li class="item"></li>
      </ul>
    </template>
    <template #footer>
      <p class="h-[140px] text-center text-[#adadad]">
        「喜茶券兑换路径」：复制券码—打开喜茶GO小程序—「我的」—「喜茶券」—「兑换喜茶券」—输入券码—兑换使用复制兑换码进行兑换
      </p>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import ActivityModal from '@/components/Modal'
const modalQuery = ref<InstanceType<typeof ActivityModal> | null>(null)

function open(): void {
  modalQuery.value?.openModal()
}

defineExpose({
  open,
})
</script>
<style lang="scss" scoped>
.modal-title {
  width: 230px;
  height: 66px;
  background-image: url('@/assets/images/dice-map/modal-query-title.png');
}
.list {
  margin: 40px auto 0;
  width: 995px;
  height: 490px;
}
.item {
  margin-bottom: 20px;
  padding: 0 30px 0 32px;
  border-radius: 22px;
  width: 995px;
  height: 90px;
  line-height: 90px;
  background-color: #fff;

  &-name {
    background-image: url('@/assets/images/dice-map/modal-query-divider.png');
    background-position: right center;
    background-size: 3px 87px;
  }
}
.copy {
  right: 0;
  top: 24px;
  width: 50px;
  height: 46px;
  background-image: url('@/assets/images/dice-map/modal-query-copy.png');
}
</style>
