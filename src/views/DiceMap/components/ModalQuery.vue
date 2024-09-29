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
      <div class="content">
        <p
          v-if="props.heyteaRewards && props.heyteaRewards.length > 0"
          class="tips text-center text-[32px] text-[#399cf3]"
        >
          活动结束后无法再查询喜茶券码，请及时兑换！
        </p>
        <ul
          v-if="props.heyteaRewards && props.heyteaRewards.length > 0"
          class="list mt-2"
        >
          <li
            v-for="item in props.heyteaRewards"
            :key="item.code"
            class="item flex items-center"
          >
            <div class="item-name bg-no-repeat">
              <span class="text-[40px] text-[#399cf3]">{{
                heyteaRewardText[item.type as keyof typeof heyteaRewardText]
              }}</span>
            </div>
            <div class="relative">
              <span class="inline-block w-full text-[40px] text-[#399cf3]">{{
                item.code
              }}</span>
              <button
                class="copy absolute bg-transparent bg-contain bg-no-repeat"
                @click="copyToClipboard(item.code)"
              >
                <span class="sr-only">复制</span>
              </button>
            </div>
          </li>
        </ul>
        <div v-else class="list flex items-center justify-center text-gray-500">
          暂无中奖记录
        </div>
      </div>
    </template>
    <template #footer>
      <p class="footer text-center text-[32px] text-[#adadad]">
        「喜茶券兑换路径」：复制券码—打开喜茶GO小程序—「我的」—「喜茶券」—「兑换喜茶券」—输入券码—兑换使用
      </p>
    </template>
  </activity-modal>
</template>

<script setup lang="ts">
import { type HeyteaRewards } from '@/types'
import ActivityModal from '@/components/Modal'
import { showToast } from 'vant'
const modalQuery = ref<InstanceType<typeof ActivityModal> | null>(null)

interface Props {
  heyteaRewards: HeyteaRewards | null
}

const props = defineProps<Props>()

const heyteaRewardText = {
  heytea_coupon: '光遇喜茶联动30-3优惠券',
  heytea_gift: '光遇喜茶联动赠饮券',
  heytea_half: '光遇喜茶联动第二杯半价券',
}

function open(): void {
  modalQuery.value?.openModal()
}

/**
 * @function copyToClipboard
 * @description 复制券码
 * @param text 券码
 */
function copyToClipboard(text: string): void {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showToast('优惠券码复制成功')
      })
      .catch(() => {
        copyToClipboardFallback(text)
      })
  } else {
    copyToClipboardFallback(text)
  }
}

function copyToClipboardFallback(text: string): void {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed' // 避免影响用户体验
  document.body.appendChild(textarea)
  textarea.select()
  try {
    const successful = document.execCommand('copy')
    if (successful) {
      showToast('优惠券码复制成功')
    }
  } catch (err) {
    console.error('Fallback method error: ', err)
  }
  document.body.removeChild(textarea)
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
.content {
  margin-top: 20px;
  height: 560px;
  width: 100%;
}
.tips {
  height: 40px;
  line-height: 40px;
}
.list {
  padding: 0 2px;
  width: 100%;
  height: 520px;
  overflow-y: scroll;
}
.item {
  margin-bottom: 20px;
  padding: 0 22px 0 27px;
  border-radius: 22px;
  width: 100%;
  height: 90px;
  line-height: 90px;
  overflow: hidden;
  background-color: #fff;

  &-name {
    height: 90px;
    width: 50%;
    line-height: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-image: url('@/assets/images/dice-map/modal-query-divider.png');
    background-position: right center;
    background-size: 3px 87px;
  }
  .relative {
    width: 50%;
    margin-left: 20px;
  }
}
.copy {
  right: 0;
  top: 24px;
  width: 50px;
  height: 46px;
  background-image: url('@/assets/images/dice-map/modal-query-copy.png');
}
.footer {
  margin-top: 20px;
  padding-top: 20px;
}
</style>
