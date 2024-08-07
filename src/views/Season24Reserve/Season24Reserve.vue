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
            class="btn bg-transparent bg-contain indent-[-9999px]"
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
            完成预约后可获得奖励：新季节蜡烛*3，奖励将在新季节开启后72小时内发放至邮箱，请耐心等候
          </p>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import type { DesignConfig, MiniProgramParams } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { openWechatMiniprogram } from '@/apis/base'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

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

const prodUrl = 'https://sky.h5.163.com/game/'
const isProd = ref(window.location.href.includes(prodUrl))
const type = isProd.value ? 0 : 1
// 打开微信小程序传参
const miniProgramParams: MiniProgramParams = {
  username: 'gh_5ebd38011f07',
  path: '/pages/game/index?game=ma75&cv=dashen&pageId=RewardDetailPage&squareId=5cb546a0d5456870b97d9424&type=66b20e387389f41328a99946&utm_campaign=skybanner&utm_medium=banner&utm_source=gameyy.ma75&wsSubGameInfoId=66b20e387389f41328a99946',
  type,
}

const isVisited = Session.get('isVisitSeason24Reserve')
const bodyTransitionName = ref('')
const headTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
}

onMounted(() => {
  Session.set('isVisitSeason24Reserve', true)
})

// 预约
function handleToReserve(): void {
  openWechatMiniprogram(miniProgramParams)
    .then()
    .catch((error) => {
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
  left: 490px;
  top: 90px;
  width: 1208px;
}
.title {
  position: absolute;
  width: 1208px;
  height: 302px;
  background-image: url('@/assets/images/season23-reserve/title.png');
}
.help {
  position: absolute;
  left: 1082px;
  top: 80px;
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
