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
import { useEnvironment } from '@/composables/useEnvironment'

const { isProd } = useEnvironment()

// 获取响应式样式因子，用于调整UI元素大小以适应不同屏幕尺寸
const { factor } = getResponsiveStylesFactor()
console.log('factor: ', factor.value)

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
// 基本信息
const baseStore = useBaseStore()
const appChannel = computed(() => baseStore.baseInfo.appChannel)
// 是否已预约
const isReserved = ref(false)

const pathProd =
  '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=5cb546a0d5456870b97d9424&type=67596cca93d2053a0757a54e&utm_campaign=skybanner&utm_medium=banner&utm_source=gameyy.ma75&wsSubGameInfoId=67596cca93d2053a0757a54e'
const pathDev =
  '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=60963fb3e9db025984063ad7&type=675c0ac1af32530ebdf8b8b0&utm_medium=gmc&utm_source=kf.ma75&wsSubGameInfoId=675c0ac1af32530ebdf8b8b0'
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
  getSeasonReservationStatus(appChannel.value)
    .then((res) => {
      isReserved.value = res.code === 200
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
    throttledFetchData() // 使用节流
  }
}

/**
 * 点击“约定相见”，前往小程序预约新季节
 */
async function handleToReserve(): Promise<void> {
  if (isReserved.value) {
    return
  }
  await getSeasonReservationStatus(appChannel.value)
  await openWechatMiniprogram(miniProgramParams).catch((error) => {
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
  background-image: url('@/assets/images/season23-reserve/help.png');
}
.btn {
  position: absolute;
  right: 381px;
  bottom: 62px;
  width: 443px;
  height: 162px;
  background-image: url('@/assets/images/season24-reserve/btn.png');

  &-reserved {
    width: 445px;
    height: 164px;
    background-image: url('@/assets/images/season24-reserve/btn-reserved.png');
  }
}
</style>
