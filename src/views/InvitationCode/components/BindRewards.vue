<template>
  <div
    class="flex h-full w-full flex-col items-center justify-between py-[14px]"
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
        placeholder="点击输入邀请码"
        type="text"
      />
      <!-- 绑定按钮 -->
      <button
        class="flex h-[58px] w-[166px] items-center justify-center rounded-[29px] bg-[#ffc75b] text-[32px] text-white"
        :disabled="btnLoading"
        @click="handleBind"
      >
        <van-loading
          v-show="btnLoading"
          color="#fff"
          size="8px"
          class="mr-[8px]"
        />
        {{ inviteInfo.bindCode ? '已绑定' : btnLoading ? '绑定中' : '绑定' }}
      </button>
    </div>
    <!-- 文案 -->
    <div class="mt-[4px] flex items-center justify-center">
      <div class="line left"></div>
      <div class="mx-[3px] text-[32px] text-[#e0ffdc]">绑定邀请码获得奖励!</div>
      <div class="line right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { acceptInvite } from '@/apis/invitationCode'
import { showToast } from 'vant'

const emit = defineEmits(['reward', 'getUserInviteInfo'])

const props = defineProps({
  m1Status: {
    type: String,
    default: 'wait',
  },
  inviteInfo: {
    type: Object,
    default: () => {},
  },
})

const bindCode = ref('')
const btnLoading = ref(false)

/**
 * @function 获取邀请码相关信息
 * @returns {void}
 */
function handleBind(): void {
  if (!bindCode.value || props.inviteInfo.bindCode) return
  btnLoading.value = true
  acceptInvite({ code: bindCode.value.trim() })
    .then((res) => {
      if (res.code === 200) {
        showToast('绑定成功')
        emit('getUserInviteInfo')
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
    .finally(() => {
      btnLoading.value = false
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
.line {
  width: 124px;
  height: 2px;
  background-repeat: no-repeat;
  background-size: cover;
  &.left {
    background-image: url('@/assets/images/invitation-code/left-line.png');
  }
  &.right {
    background-image: url('@/assets/images/invitation-code/right-line.png');
  }
}
</style>
