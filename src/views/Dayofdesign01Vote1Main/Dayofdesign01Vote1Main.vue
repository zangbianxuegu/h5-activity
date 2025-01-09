<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div class="h-full w-full">
        <Transition appear :name="headTransitionName" mode="out-in">
          <header class="design-header animate__animated animate__fadeIn">
            <h1 class="title overflow-hidden bg-contain bg-no-repeat">
              <p class="sr-only">绘梦节选款期投票开启</p>
            </h1>
            <h2 class="sub-title">
              <p class="text-[40px] text-white">
                <time datetime="2025-02-01">2.1</time>-
                <time datetime="2025-02-16">2.16</time>
              </p>
              <div
                class="help cursor-pointer bg-contain bg-no-repeat"
                @click="handleHelp"
              ></div>
            </h2>
            <button
              class="activity-details absolute right-0 top-[60px]"
              @click="gotoRules"
            >
              活动详情>>
            </button>
          </header>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="animate__animated animate__fadeIn">
            <div class="absolute bottom-[10%] left-[32%] flex">
              <button
                type="button"
                class="btn mr-[50px] rounded-full bg-white text-[#5a7091]"
              >
                <RouterLink
                  to="/dayofdesign01-vote1-group"
                  class="block h-full w-full"
                >
                  前往活动
                </RouterLink>
              </button>
              <button
                type="button"
                class="btn rounded-full bg-[#fffab6] text-[#836a4e]"
              >
                <a
                  class="block h-full w-full"
                  href="https://sky.163.com/n/2024/hmj/#hjzphp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  赛况播报
                </a>
              </button>
            </div>
          </section>
        </Transition>

        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import ModalHelp from '../Dayofdesign01Vote1Mission/components/ModalHelp.vue'
import { useTransition } from '@/composables/useTransition'

// 弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

const SESSION_IS_VISITED_KEY = 'isVisitedDayofdesign01Vote1Main'

const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransition(SESSION_IS_VISITED_KEY)

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}

/**
 * @function gotoRules
 * @description 前往活动规则页面
 * @returns {void}
 */
function gotoRules(): void {
  window.location.href = 'https://sky.163.com/n/2024/hmj/#index'
}
</script>

<style lang="scss" scoped>
$font-family-bold: 'Source Han Sans CN Medium';

.fade-in-body-enter-active {
  transition: opacity 1s ease-out;
}
.fade-in-body-enter-from {
  opacity: 0.2;
}
.fade-in-head-enter-active {
  transition: opacity 1s ease-out 0.2s;
}
.fade-in-head-enter-from {
  opacity: 0.2;
}
.fade-in-main-enter-active {
  transition: opacity 1s ease-out 0.5s;
}
.fade-in-main-enter-from {
  opacity: 0.2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
}
.page {
  padding-left: 460px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote1-main/bg.jpg');
}
.title {
  position: absolute;
  left: 500px;
  top: 2.5%;
  width: 1141px;
  height: 158px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote1-main/title.png');
}
.sub-title {
  position: absolute;
  left: 500px;
  top: 15%;
  text-shadow: 3px 3px 10px #934ea2;
}
.help {
  position: absolute;
  right: -67px;
  top: 6px;
  width: 51px;
  height: 52px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-vote1-main/help.png');
}
.activity-details {
  right: 0;
  top: 100px;
  border-top-left-radius: 38px;
  border-bottom-left-radius: 38px;
  width: 240px;
  height: 76px;
  line-height: 76px;
  font-size: 34px;
  color: #5b7090;
  background-color: #f0e5f1;
  box-shadow: 0 6px 6px rgba(108, 108, 108, 0.12);
  padding-left: 22px;

  &::before {
    position: absolute;
    content: '';
    left: 5px;
    top: 5px;
    border: 2px solid #fff;
    border-top-left-radius: 33px;
    border-bottom-left-radius: 33px;
    border-right: 0;
    width: 235px;
    height: 66px;
  }
}
.btn {
  font-weight: $font-family-bold;
  font-size: 40px;
  width: 330px;
  height: 96px;
  line-height: 96px;
  text-align: center;
  box-shadow: 0 6px 6px 0 rgba(81, 81, 81, 0.2);
}
</style>
