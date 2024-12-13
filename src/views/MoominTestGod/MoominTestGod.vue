<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="moomin-test-god flex h-screen">
      <div class="moomin-test-god-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="logo bg-contain bg-no-repeat">
            <div class="sr-only">
              姆明谷的身份大揭秘
              <p>
                <time datetime="2024-12-6">12.27</time>-
                <time datetime="2025-1-6">1.6</time>
              </p>
            </div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <div class="unlock" @click="handleToUnlock"></div>
          </section>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { openWechatMiniprogram } from '@/apis/base'
import type { MiniProgramParams } from '@/types'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import { useTransitions } from './composables/useTransition'
import { useEnvironment } from '@/composables/useEnvironment'

const { isProd } = useEnvironment()
// 获取响应式样式因子
getResponsiveStylesFactor()
const { bodyTransitionName, headTransitionName, mainTransitionName } =
  useTransitions()

const pathProd =
  'https://fn.ds.163.com/c/wxaurl/?appId=wx53eacbe0d8a7a95a&cv=dashen&pageId=PromoteTransPage&path=%2Fpages%2Fsem%2Findex&semId=e93cd402db3f4ae9a536cb1d116ff26a&type=link&utm_campaign=mumingceshi1227&utm_medium=banner&utm_source=gameyy.ma75'
const pathDev =
  'https://fn.ds.163.com/c/wxaurl/?appId=wx53eacbe0d8a7a95a&cv=dashen&pageId=PromoteTransPage&path=%2Fpages%2Fsem%2Findex&semId=e93cd402db3f4ae9a536cb1d116ff26a&type=link&utm_campaign=mumingceshi1227&utm_medium=banner&utm_source=gameyy.ma75'
// 正式版：0，测试版：1，体验版：2
const type = isProd.value ? 0 : 1
const path = isProd.value ? pathProd : pathDev

// 打开微信小程序传参，运营提供
const miniProgramParams: MiniProgramParams = {
  username: 'gh_5ebd38011f07',
  path,
  type,
}

function handleToUnlock(): void {
  openWechatMiniprogram(miniProgramParams).catch((error) => {
    showToast(error.message)
  })
}
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

.moomin-test-god {
  position: relative;
  width: 2100px;

  &-main {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(var(--scale-factor));
    width: 2040px;
    height: 1140px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    background-image: url('@/assets/images/moomin-test-god/bg.jpg');
  }
}

.unlock {
  position: absolute;
  right: 164px;
  bottom: 200px;
  width: 405px;
  height: 94px;
  background-image: url('@/assets/images/moomin-test-god/btn.png');
  background-repeat: no-repeat;
  background-size: contain;
  cursor: pointer;
}

.logo {
  position: absolute;
  width: 253px;
  height: 40px;
  top: 50px;
  left: 65px;
  background-image: url('@/assets/images/moomin-test-god/logo.png');
}
</style>
