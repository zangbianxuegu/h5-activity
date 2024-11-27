<template>
  <div
    class="flex h-full w-full flex-col items-center justify-between py-[20px]"
  >
    <div
      class="flex h-[100px] items-center self-start overflow-hidden pl-[150px]"
    >
      <div class="bind-task bind-task1"></div>
      <div class="bind-task bind-task2"></div>
      <div class="bind-task bind-task3"></div>
    </div>
    <div class="flex items-center">
      <input
        class="ml-[36px] mr-[10px] h-[58px] w-[530px] rounded-[29px] pl-[30px] text-[32px]"
        placeholder="点击输入好友邀请码"
        type="text"
      />
      <button
        class="h-[58px] w-[166px] rounded-[29px] bg-[#ffc75b] text-[32px] text-white"
      >
        绑定
      </button>
    </div>
    <div class="bottom-text mb-[4px] mt-[14px]"></div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.bind-task {
  width: 120px;
  height: 120px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}
.bind-task1 {
  background-image: url('@/assets/images/invitation-code/bind-task1-wait.png');
}
.bind-task2 {
  background-image: url('@/assets/images/invitation-code/bind-task2-wait.png');
}
.bind-task3 {
  background-image: url('@/assets/images/invitation-code/bind-task3-wait.png');
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
