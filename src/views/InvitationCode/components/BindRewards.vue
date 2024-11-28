<template>
  <div
    class="flex h-full w-full flex-col items-center justify-between py-[20px]"
  >
    <div
      class="flex h-[100px] items-center self-start overflow-hidden pl-[150px]"
    >
      <!-- 奖励图标 -->
      <div
        v-for="(_, index) in 3"
        :key="index"
        :class="['bind-task', `bind-task${index + 1}`, m1Status]"
        @click="handleReward"
      ></div>
    </div>
    <div class="flex items-center">
      <!-- 输入框 -->
      <input
        v-model="bindCode"
        class="ml-[36px] mr-[10px] h-[58px] w-[530px] rounded-[29px] pl-[30px] pr-[40px] text-[32px]"
        placeholder="点击输入好友邀请码"
        type="text"
      />
      <!-- 绑定按钮 -->
      <button
        class="h-[58px] w-[166px] rounded-[29px] bg-[#ffc75b] text-[32px] text-white"
        @click="handleBind"
      >
        绑定
      </button>
    </div>
    <!-- 文案 -->
    <div class="sr-only">绑定好友邀请码获得奖励！</div>
    <div class="bottom-text mb-[4px] mt-[14px]"></div>
  </div>
</template>

<script setup lang="ts">
import { acceptInvite } from '@/apis/invitationCode'
import { showToast } from 'vant'

const emit = defineEmits(['reward'])

const props = defineProps({
  m1Status: {
    type: String,
    default: 'wait',
  },
})

const bindCode = ref('')

/**
 * @function 获取邀请码相关信息
 * @returns {void}
 */
function handleBind(): void {
  if (!bindCode.value) return
  acceptInvite({ code: bindCode.value.trim() })
    .then((res) => {
      if (res.code === 200) {
        showToast('绑定成功')
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 获取邀请码相关信息
 * @returns {void}
 */
function handleReward(): void {
  if (props.m1Status === 'redeemed') {
    return
  }
  if (props.m1Status === 'wait') {
    showToast('还未完成任务')
    return
  }
  emit('reward')
}
</script>

<style lang="scss" scoped>
.bind-task {
  width: 120px;
  height: 120px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
@for $i from 1 through 3 {
  .bind-task#{$i} {
    &.wait {
      background-image: url('@/assets/images/invitation-code/bind-task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/invitation-code/bind-task#{$i}-can.png');
    }
    &.redeemed {
      transition: background-image 1s ease;
      background-image: url('@/assets/images/invitation-code/bind-task#{$i}-redeemed.png');
    }
  }
}
.bottom-text {
  width: 614px;
  height: 30px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  background-image: url('@/assets/images/invitation-code/bottom-text.png');
}
</style>
