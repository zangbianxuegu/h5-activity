<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="season25-reserve flex h-screen">
      <div class="season25-reserve-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1 class="title overflow-hidden bg-contain indent-[-9999px]">
              期待在彩染季 与你再次相遇 1.7-1.20
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
            <span v-if="isReserved"> 已预约 </span>
            <span v-else> 约定相见 </span>
          </button>
        </div>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <div class="h-[640px] overflow-auto px-4">
            <p class="modal-text mt-4">
              <span class="font-semibold">活动时间：</span
              >2025年1月7日-2025年1月20日
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
          </div>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import throttle from 'lodash.throttle'
import type { MiniProgramParams } from '@/types'
import { Session } from '@/utils/storage'
import { useBaseStore } from '@/stores/base'
import { openWechatMiniprogram, getSeasonReservationStatus } from '@/apis/base'
import { getResponsiveStylesFactor } from '@/utils/responsive'
import ActivityModal from '@/components/Modal'

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
const { factor } = getResponsiveStylesFactor()
console.log('factor: ', factor.value)

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
// 基本信息
const baseStore = useBaseStore()
const appchannel = baseStore.baseInfo.appChannel
// 是否已预约
const isReserved = ref(false)

const prodUrl = 'https://sky.h5.163.com/game/'
const isProd = ref(window.location.href.includes(prodUrl))
const pathProd =
  '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=5cb546a0d5456870b97d9424&type=66b20e387389f41328a99946&utm_campaign=skybanner&utm_medium=banner&utm_source=gameyy.ma75&wsSubGameInfoId=66b20e387389f41328a99946'
const pathDev =
  '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=60963fb3e9db025984063ad7&type=66bf49c30d3a2d1bd8ae4341&utm_medium=GMC&utm_source=kf.ma75&wsSubGameInfoId=66bf49c30d3a2d1bd8ae4341'
// 正式版：0，测试版：1，体验版：2
const type = isProd.value ? 0 : 1
const path = isProd.value ? pathProd : pathDev
// 打开微信小程序传参，运营提供
const miniProgramParams: MiniProgramParams = {
  username: 'gh_5ebd38011f07',
  path,
  type,
}

const isVisited = Session.get('isVisitSeason25Reserve')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
}

onMounted(async () => {
  Session.set('isVisitSeason25Reserve', true)
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
  getSeasonReservationStatus(appchannel)
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
.season25-reserve {
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
    background-image: url('@/assets/images/season25-reserve/bg.jpg');
  }
}
.header {
  position: relative;
  left: 444px;
  top: 96px;
  width: 1081px;
}
.title {
  position: absolute;
  width: 1081px;
  height: 326px;
  background-image: url('@/assets/images/season25-reserve/title.png');
  background-repeat: no-repeat;
}
.help {
  position: absolute;
  right: 32px;
  top: 98px;
  width: 61px;
  height: 61px;
  background-image: url('@/assets/images/season25-reserve/help.png');
}
.btn {
  position: absolute;
  right: 381px;
  bottom: 62px;
  width: 443px;
  height: 162px;
  background-image: url('@/assets/images/season25-reserve/btn.png');

  &-reserved {
    width: 445px;
    height: 164px;
    background-image: url('@/assets/images/season25-reserve/btn-reserved.png');
  }
}
</style>
