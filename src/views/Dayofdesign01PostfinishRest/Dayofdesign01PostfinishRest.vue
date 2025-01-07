<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div class="h-full w-full">
        <Transition appear :name="headTransitionName" mode="out-in">
          <header class="design-header relative">
            <h1 class="title overflow-hidden bg-contain bg-no-repeat">
              <p class="sr-only">绘梦节征集期作品整理中</p>
            </h1>
            <h2 class="sub-title text-[40px] text-white">
              选款投票期将于2月1日10:00开启
            </h2>
          </header>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useTransition } from '@/composables/useTransition'

const SESSION_IS_VISITED_KEY = 'isVisitedDayofdesign01PostfinishRest'
const { bodyTransitionName, headTransitionName } = useTransition(
  SESSION_IS_VISITED_KEY,
)
</script>

<style lang="scss" scoped>
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
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-postfinish-rest/bg.jpg');
}
.title {
  position: absolute;
  left: 180px;
  top: 53px;
  width: 1212px;
  height: 153px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-postfinish-rest/title.png');
}
.sub-title {
  position: absolute;
  left: 482px;
  top: 210px;
  text-shadow: 3px 3px 70px #1e6ab1;
  letter-spacing: 2px;
}
</style>
