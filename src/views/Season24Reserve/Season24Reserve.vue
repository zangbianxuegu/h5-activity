<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season23 flex h-screen">
      <div class="season23-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1 class="title overflow-hidden bg-contain indent-[-9999px]">
              期待在姆明季 能与你再次相遇 10.8-10.23
            </h1>
            <div class="help bg-contain" @click="handleHelp"></div>
          </div>
        </Transition>
        <div class="main">
          <button
            type="button"
            :class="[
              'btn bg-transparent bg-contain indent-[-9999px]',
              {
                'btn-reserved disabled': isReserved,
              },
            ]"
            @click="handleToReserve"
          >
            约定相见
          </button>
          <div class="reward bg-contain"></div>
        </div>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年10月8日-2024年10月23日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            活动期间，点击“约定相见”，即可前往小程序预约新季节。
          </p>
          <p class="modal-text">
            完成预约后可获得奖励：<span class="text-[#ffcb4d]"
              >新季节蜡烛*3</span
            >，奖励将在新季节首次登录游戏时通过邮件自动发送
          </p>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import throttle from 'lodash.throttle'
import type { DesignConfig, MiniProgramParams } from '@/types'
import { Session } from '@/utils/storage'
import { useBaseStore } from '@/stores/base'
import { openWechatMiniprogram, getSeasonReservationStatus } from '@/apis/base'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'

// 设计稿宽
const DESIGN_WIDTH = 2560
// 设计稿高
const DESIGN_HEIGHT = 1200
// 设计稿主体宽，减去边距：因为我们要保留主体部分的边距。
// 会影响最终计算出来的缩放系数，影响元素转换的实际大小，所以只能在这里减去，而不能在元素上写边距。
const DESIGN_MAYDAY_WIDTH = 2100 - 60
// 设计稿主体高，同宽。
const DESIGN_MAYDAY_HEIGHT = 1200 - 60
// 设计稿主体内容宽
const DESIGN_MAYDAY_CONTENT_WIDTH = DESIGN_MAYDAY_WIDTH
// 设计稿主体内容高
const DESIGN_MAYDAY_CONTENT_HEIGHT = DESIGN_MAYDAY_HEIGHT
// 设计稿主体内容宽高比
const DESIGN_MAYDAY_CONTENT_RATIO =
  DESIGN_MAYDAY_CONTENT_WIDTH / DESIGN_MAYDAY_CONTENT_HEIGHT

// 配置参数
const designConfig: DesignConfig = {
  designWidth: DESIGN_WIDTH,
  designHeight: DESIGN_HEIGHT,
  designMainWidth: DESIGN_MAYDAY_WIDTH,
  designMainHeight: DESIGN_MAYDAY_HEIGHT,
  designMainContentWidth: DESIGN_MAYDAY_CONTENT_WIDTH,
  designMainContentHeight: DESIGN_MAYDAY_CONTENT_HEIGHT,
  designMainContentRatio: DESIGN_MAYDAY_CONTENT_RATIO,
}

// 缩放系数
const { factor } = useResponsiveStyles(designConfig)
console.log('factor: ', factor.value)

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
// 基本信息
const baseStore = useBaseStore()
const channel = baseStore.baseInfo.channel
// 是否已预约
const isReserved = ref(false)

const prodUrl = 'https://sky.h5.163.com/game/'
const isProd = ref(window.location.href.includes(prodUrl))
const pathProd =
  '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=5cb546a0d5456870b97d9424&type=66b20e387389f41328a99946&utm_campaign=skybanner&utm_medium=banner&utm_source=gameyy.ma75&wsSubGameInfoId=66b20e387389f41328a99946'
// const pathDev =
//   '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=60963fb3e9db025984063ad7&type=66bf49c30d3a2d1bd8ae4341&utm_medium=GMC&utm_source=kf.ma75&wsSubGameInfoId=66bf49c30d3a2d1bd8ae4341'
const pathDev =
  '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=5cb546a0d5456870b97d9424&type=66b20e387389f41328a99946&utm_campaign=skybanner&utm_medium=banner&utm_source=gameyy.ma75&wsSubGameInfoId=66b20e387389f41328a99946'
// 正式版：0，测试版：1，体验版：2
const type = isProd.value ? 0 : 2
const path = isProd.value ? pathProd : pathDev
// 打开微信小程序传参，运营提供
const miniProgramParams: MiniProgramParams = {
  username: 'gh_5ebd38011f07',
  path,
  type,
}

const isVisited = Session.get('isVisitSeason24Reserve')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
}

onMounted(async () => {
  Session.set('isVisitSeason24Reserve', true)
  document.addEventListener('visibilitychange', handleVisibilityChange)
  getReserveStatus()
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

/**
 * 获取预约状态
 */
function getReserveStatus(): void {
  getSeasonReservationStatus(channel)
    .then(() => {
      isReserved.value = true
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * 节流获取预约状态
 */
const throttledFetchData = throttle(() => {
  getReserveStatus()
}, 1000)

/**
 * 页面显示时，执行
 */
function handleVisibilityChange(): void {
  if (document.visibilityState === 'visible') {
    console.log('页面重新显示')
    throttledFetchData() // 使用节流
  }
}

/**
 * 点击“约定相见”，前往小程序预约新季节
 */
function handleToReserve(): void {
  if (isReserved.value) {
    return
  }
  openWechatMiniprogram(miniProgramParams).catch((error) => {
    showToast(error.message)
  })
}

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
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
.season23 {
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
    background-image: url('@/assets/images/season23-reserve/bg.jpg');
  }
}
.header {
  position: relative;
  left: 618px;
  top: 100px;
  width: 1090px;
}
.title {
  position: absolute;
  width: 1090px;
  height: 301px;
  background-image: url('@/assets/images/season24-reserve/title.png');
}
.help {
  position: absolute;
  left: 960px;
  top: 78px;
  width: 61px;
  height: 61px;
  background-image: url('@/assets/images/season23-reserve/help.png');
}
.btn {
  position: absolute;
  right: 136px;
  bottom: 142px;
  width: 413px;
  height: 132px;
  background-image: url('@/assets/images/season23-reserve/btn.png');

  &-reserved {
    background-image: url('@/assets/images/season24-reserve/btn-reserved.png');
  }
}
.reward {
  position: absolute;
  right: 153px;
  bottom: 274px;
  width: 160px;
  height: 69px;
  background-image: url('@/assets/images/season23-reserve/reward.png');
}
</style>
