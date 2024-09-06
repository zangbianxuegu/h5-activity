<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="dice flex h-screen">
      <div class="dice-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              旅行尾迹地图
              <p>
                <time datetime="2024-08-29">10.1</time>-
                <time datetime="2024-09-11">10.7</time>
              </p>
            </div>
            <div
              class="help z-10 cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 导航按钮 -->
            <nav class="nav absolute">
              <ul>
                <li class="nav-item nav-dice bg-contain">
                  <a href="http://" class="block h-full w-full">
                    <span class="sr-only">获取骰子</span>
                  </a>
                </li>
                <li class="nav-item nav-store mt-3 bg-contain">
                  <a href="http://" class="block h-full w-full">
                    <span class="sr-only">兑换商店</span>
                  </a>
                </li>
                <li class="nav-item nav-query mt-3 bg-contain" @click="test">
                  <!-- <a href="javascript:void" class="block h-full w-full">
                    <span class="sr-only">奖励查询</span>
                  </a> -->
                </li>
              </ul>
            </nav>
            <!-- 开始 -->
            <div class="start absolute bg-contain">
              <span class="sr-only">开始</span>
            </div>
            <!-- 螃蟹 -->
            <div class="crab absolute right-0 top-[104px] bg-contain">
              <!-- 左眼 -->
              <span
                class="crab-eye crab-eye-left inline-block rounded-full bg-contain"
              ></span>
              <!-- 有眼 -->
              <span
                class="crab-eye crab-eye-right inline-block rounded-full bg-contain"
              ></span>
            </div>
            <!-- 骰子操作 -->
            <div
              class="dices absolute right-[12px] top-[446px] z-10 flex flex-col"
            >
              <!-- 万能骰子，选择点数 -->
              <button
                type="button"
                class="dice-item dice-select relative cursor-pointer bg-contain"
                aria-label="选择点数的万能骰子"
                @click="handleDiceSelect"
              >
                <span
                  class="dice-num absolute right-[-2px] top-[-2px] h-[60px] w-[60px] rounded-full bg-[#64a2e8] text-center font-medium leading-[60px] text-white"
                  >2</span
                >
              </button>
              <!-- 随机骰子 -->
              <button
                type="button"
                class="dice-item dice-random relative cursor-pointer bg-contain"
                aria-label="随机骰子"
                @click="handleDiceRandom"
              >
                <span
                  class="dice-num absolute right-[-2px] top-[-2px] h-[60px] w-[60px] rounded-full bg-[#64a2e8] text-center font-medium leading-[60px] text-white"
                  >10</span
                >
              </button>
            </div>
            <!-- 格子 -->
            <!-- <div
              class="row absolute left-[240px] top-[93px] flex h-[940px] w-[1600px] flex-wrap"
            >
              <div
                class="h-[94px] w-[160px] border border-solid border-green-500"
                v-for="(_, index) in Array.from({ length: 100 })"
                :key="index"
              ></div>
            </div> -->
            <!-- 地图上显示的奖励 -->
            <!-- 位置 6：喜茶 -->
            <div class="reward reward-pos6 bg-contain"></div>
            <!-- 位置 13：烟花 -->
            <div class="reward reward-pos13 bg-contain"></div>
            <!-- 位置 16：喜茶 -->
            <div class="reward reward-pos16 bg-contain"></div>
            <!-- 位置 28：随机 -->
            <div class="reward reward-pos28 bg-contain"></div>
            <!-- 位置 30：喜茶 -->
            <div class="reward reward-pos30 bg-contain"></div>
            <!-- 位置 45：彩虹尾迹 -->
            <div class="reward reward-pos45 bg-contain"></div>
            <!-- 位置 48：喜茶 -->
            <div class="reward reward-pos48 bg-contain"></div>
            <!-- sky 动画 -->
            <!-- right -->
            <AnimateSky
              :ref="animateSkyRefs.animateSkyRight"
              class="sky-right absolute h-[400px] w-[450px]"
              json-path="./spine/yuyan/yuyan.json"
              atlas-path="./spine/yuyan/yuyan.atlas"
              :premultiplied-alpha="true"
              @complete="OnAnimationSkyComplete"
            />
            <!-- front -->
            <AnimateSky
              :ref="animateSkyRefs.animateSkyFront"
              class="sky-front absolute h-[400px] w-[450px]"
              json-path="./spine/yuyan/yuyan.json"
              atlas-path="./spine/yuyan/yuyan.atlas"
              :premultiplied-alpha="true"
              @complete="OnAnimationSkyComplete"
            />
            <!-- left -->
            <AnimateSky
              :ref="animateSkyRefs.animateSkyLeft"
              class="sky-left absolute h-[400px] w-[450px]"
              json-path="./spine/yuyan/yuyan.json"
              atlas-path="./spine/yuyan/yuyan.atlas"
              :premultiplied-alpha="true"
              @complete="OnAnimationSkyComplete"
            />
            <!-- back -->
            <AnimateSky
              :ref="animateSkyRefs.animateSkyBack"
              class="sky-back absolute h-[400px] w-[450px]"
              json-path="./spine/yuyan/yuyan.json"
              atlas-path="./spine/yuyan/yuyan.atlas"
              :premultiplied-alpha="true"
              @complete="OnAnimationSkyComplete"
            />
            <!-- 随机骰子动画 -->
            <AnimateDice
              ref="animateDice"
              class="absolute left-[871px] top-[232px] h-[626px] w-[1194px]"
              jsonPath="./spine/touzi/touzi.json"
              atlasPath="./spine/touzi/touzi.atlas"
              :animations="[]"
              :premultiplied-alpha="false"
              :auto-play="false"
              @complete="onAnimateDiceComplete"
            />
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
        <!-- 领奖弹框 -->
        <ModalReward ref="modalReward" />
        <!-- 奖励查询弹框 -->
        <ModalQuery ref="modalQuery" />
        <!-- 选择路线弹框 -->
        <ModalRoute ref="modalRoute" @choose="chooseRoute" />
        <!-- 选择点数弹框 -->
        <ModalDice ref="modalDice" @choose="chooseDiceNum" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getDiceMapData } from '@/apis/diceMap'
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { useBaseStore } from '@/stores/base'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { capitalizeFirstLetter } from '@/utils/utils'
import AnimateSky from './components/AnimateSky.vue'
import AnimateDice from './components/AnimateDice.vue'
import ModalHelp from './components/ModalHelp.vue'
import ModalReward from './components/ModalReward.vue'
import ModalQuery from './components/ModalQuery.vue'
import ModalRoute from './components/ModalRoute.vue'
import ModalDice from './components/ModalDice.vue'
import {
  ANIMATION,
  isIdle,
  coordinates,
  directions,
  type Animation,
  type Route,
} from './configs'

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

// refs
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
const modalReward = ref<InstanceType<typeof ModalReward> | null>(null)
const modalQuery = ref<InstanceType<typeof ModalQuery> | null>(null)
const modalRoute = ref<InstanceType<typeof ModalRoute> | null>(null)
const modalDice = ref<InstanceType<typeof ModalDice> | null>(null)
const animateDice = ref<InstanceType<typeof AnimateDice> | null>(null)
const animateSkyRefs = {
  animateSkyFront: ref<InstanceType<typeof AnimateSky> | null>(null),
  animateSkyBack: ref<InstanceType<typeof AnimateSky> | null>(null),
  animateSkyRight: ref<InstanceType<typeof AnimateSky> | null>(null),
  animateSkyLeft: ref<InstanceType<typeof AnimateSky> | null>(null),
}
// 当前 animateSky 实例
let curAnimateSky = animateSkyRefs.animateSkyRight

// 活动数据
const baseStore = useBaseStore()
const gameUid = computed(() => baseStore.baseInfo.gameUid)

// 随机骰子数值
const diceNum = ref(1)
// 是否正在播放骰子动画
const isDiceAnimating = ref(false)
// 当前动画类型
// let curAnimation = ANIMATION.RIGHT_IDLE
// 当前位置，0-49
let curPosition = 35
// 是否需要设置位置
let isNeedSetPos = true
// 当前路线
let curRoute = 'A' as Route // A、B
// 剩余步数
let remainingSteps = 0
// 是否切换了方向
let hasSwitched = true

const sessionIsVisitedKey = 'isVisitedDiceMap'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

/**
 * @function 监听游戏uid
 * @description 因为gameUid可能在进入页面时还未获取到，所以需要监听游戏uid
 */
watch(
  () => gameUid.value,
  (newVal) => {
    if (newVal !== '') {
      try {
        handleDiceData()
      } catch (error) {
        console.error(error)
      }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  // modalQuery.value?.open()
  try {
    if (gameUid.value !== '') {
      handleDiceData()
    }
    // 初始化角色动画
    setTimeout(() => {
      initAnimateSky()
    }, 1000)
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

// 初始化
function initAnimateSky(): void {
  // 设置 curAnimateSky
  for (const [direction, positions] of Object.entries(directions)) {
    if (positions.includes(curPosition)) {
      const refKey = `animateSky${capitalizeFirstLetter(direction)}`
      console.log('refKey: ', refKey)
      curAnimateSky = animateSkyRefs[refKey as keyof typeof animateSkyRefs]
      break
    }
  }
  animateSkyIdle()
}

// 动画测试
function test(): void {
  remainingSteps = 3
  isNeedSetPos = true
  animateSkyMove()
}

/**
 * @function setAnimateSkyPosition
 * @description 设置动画位置，根据动画大小和坐标位置
 * @param {number} position 坐标位置
 */
function setAnimateSkyPosition(position: number): void {
  const { x, y, direction } = coordinates[position]
  console.log('开始设置位置：', x, y)
  let offsetX = 225
  let offsetY = 200
  switch (direction) {
    case 'left':
      offsetX = 255
      break
    case 'back':
      offsetX = 215
      offsetY = 210
      break
    default:
      break
  }
  if (curAnimateSky.value) {
    const style = generateDynamicStyles({
      left: x - offsetX,
      top: y - offsetY,
    })
    curAnimateSky.value.$el.style.left = style.left
    curAnimateSky.value.$el.style.top = style.top
  }
}

/**
 * @function animateSkyPlay
 * @description 角色动画。
 * 1. 根据方向设置 curAnimateSky
 * 2. 设置位置
 * 3. 根据动画名称和是否循环进行播放
 * @param {number} position 位置
 * @param {Animation} animation 动画名称
 */
function animateSkyPlay(position: number, animation: Animation): void {
  console.log('position: ', position)
  // 1.1 让所有方向的 animateSky 实例隐藏
  if (hasSwitched) {
    for (const animateSky of Object.values(animateSkyRefs)) {
      animateSky.value?.$el.classList.add('hidden')
      // 清空动画
      animateSky.value?.setEmptyAnimation()
    }
    // 1.2 让当前方向上的 animateSky 实例显示进行动画
    curAnimateSky.value?.$el.classList.remove('hidden')
    console.log('curAnimateSky.value: ', curAnimateSky.value?.$el)
  }
  // 2 设置动画位置
  // fix: 结束 idle 不需要设置位置。角色停留在 move 的结束 pose 上。
  // 如果切换了方向，也需要设置位置
  if (isNeedSetPos || hasSwitched) {
    setAnimateSkyPosition(position)
  }
  // 3 开始动画
  const loop = isIdle(animation)
  curAnimateSky.value?.playAnimation(animation, loop)
}

/**
 * @function animateSkyMove
 * @description 角色移动。根据当前位置和路线选择进行 move 动画。
 */
function animateSkyMove(): void {
  if (curPosition === 7) {
    // 先进行路线选择
    modalRoute.value?.open()
  } else {
    // move animation
    // fix: 连续 move，每一次 move 之后，会有重影现象
    // 比如 0->2，0->1 move 结束时，角色在右边停留，1->2 时，设置位置，此时角色还是在视口右边，再进行动画 play，角色从视口中间开始，这样角色从右到中间有一个闪动。
    setTimeout(() => {
      const animation = (coordinates[curPosition].direction +
        '_move') as Animation
      animateSkyPlay(curPosition, animation)
    }, 0)
  }
}

/**
 * @function animateSkyIdle
 * @description 角色闲置。在当前位置进行 idle 动画。
 */
function animateSkyIdle(): void {
  const animation = (coordinates[curPosition].direction + '_idle') as Animation
  animateSkyPlay(curPosition, animation)
}

/**
 * @function handleDiceSelect
 * @description 点击万能骰子
 */
function handleDiceSelect(): void {
  modalDice.value?.open()
}

/**
 * @function handleDiceRandom
 * @description 点击随机骰子
 */
function handleDiceRandom(): void {
  if (isDiceAnimating.value) {
    return
  }
  isDiceAnimating.value = true
  // 生成1-6的随机数
  const random = Math.floor(Math.random() * 6) + 1
  console.log('生成的随机数: ', random)
  diceNum.value = random
  const animationName = `num_${diceNum.value}`
  setTimeout(() => {
    animateDice.value?.playAnimation(animationName, false)
  }, 200)
}

/**
 * @function onAnimateDiceComplete
 * @description 随机骰子动画完成
 */
function onAnimateDiceComplete(): void {
  console.log('随机骰子动画完成')
  isDiceAnimating.value = false
  remainingSteps = diceNum.value
  isNeedSetPos = true
  animateSkyMove()
}

/**
 * @function setCurPositionForward
 * @description 设置当前位置向前一步
 */
function setCurPositionForward(): void {
  // 当前位置 7，路线 B，下一步 36
  // 当前位置 35，下一步 0
  // 当前位置 49，下一步 22
  // 其他所有位置，下一步 + 1
  if (curPosition === 7 && curRoute === 'B') {
    curPosition = 36
  } else if (curPosition === 35) {
    curPosition = 0
  } else if (curPosition === 49) {
    curPosition = 22
  } else {
    curPosition++
  }
}

/**
 * @function OnAnimationSkyComplete
 * @description 角色动画完成回调函数
 * @param entry
 */
function OnAnimationSkyComplete(entry: any): void {
  // 重置是否切换了方式
  hasSwitched = false
  if (entry.animation.name.includes('move')) {
    remainingSteps--
    setCurPositionForward()

    // 切换方向
    // 结束时在这些位置，需要切换方向
    if ([0, 9, 18, 27, 39, 43, 45, 47].includes(curPosition)) {
      switchDirection(curPosition)
    }
    // 结束时在22，且路线为 B，需要切换方向
    if (curPosition === 22 && curRoute === 'B') {
      switchDirection(curPosition, 'left')
    }
    // 如果剩余步数大于0，继续 move 动画
    // 否则，进行 idle 动画
    if (remainingSteps > 0) {
      animateSkyMove()
    } else {
      // 设置为不需要设置位置
      isNeedSetPos = false
      animateSkyIdle()
    }
  }
}

/**
 * @function switchDirection
 * @description 切换方向，改变 curAnimateSky
 * @param {number} position 位置
 * @param {string} direction 方向
 */
function switchDirection(position: number, direction?: string): void {
  const finalDirection = direction || coordinates[position].direction
  const refKey = `animateSky${capitalizeFirstLetter(finalDirection)}`
  console.log('切换到animateSky实例: ', refKey)
  curAnimateSky = animateSkyRefs[refKey as keyof typeof animateSkyRefs]
  hasSwitched = true
}

/**
 * @function chooseRoute
 * @description 选择路线
 * @param {Route} route 路线：A | B
 */
function chooseRoute(route: Route): void {
  curRoute = route
  if (remainingSteps > 0) {
    setTimeout(() => {
      let animation = ANIMATION.RIGHT_MOVE
      if (curRoute === 'A') {
        animation = ANIMATION.RIGHT_MOVE
      } else {
        animation = ANIMATION.FRONT_MOVE
        // 切换方向
        switchDirection(curPosition, 'front')
      }
      animateSkyPlay(curPosition, animation)
    }, 200)
  }
}

/**
 * @function chooseDiceNum
 * @description 选择万能骰子点数
 * @param num 选择的点数
 */
function chooseDiceNum(num: number): void {
  remainingSteps = num
  isNeedSetPos = true
  setTimeout(() => {
    animateSkyMove()
  }, 200)
}

// px -> vw
const calculatePxToViewport = (px: number): string => {
  const clientWidth = document.documentElement.clientWidth
  return Math.round((px / DESIGN_WIDTH) * clientWidth) + 'px'
  // return ((px * factor.value) / DESIGN_WIDTH) * 100 + 'vw'
}

// 样式对象转换
const generateDynamicStyles = (
  styleObj: Record<string, number>,
): Record<string, string> => {
  const dynamicStyles: Record<string, string> = {}
  for (const [key, value] of Object.entries(styleObj)) {
    dynamicStyles[key] = calculatePxToViewport(value)
  }
  return dynamicStyles
}

/**
 * @function 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}

/**
 * @function handleDiceData
 * @description 获取走格子数据
 */
function handleDiceData(): void {
  getDiceMapData(gameUid.value)
    .then((res) => {
      console.log('res: ', res)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function 领奖
 * @param task 任务id
 * @param status 状态
 * @param rewardId 第几个奖励节点
 * @param index 任务索引
 * @returns {void}
 */
// function handleReward(
//   task: string,
//   status: string,
//   rewardId: number,
//   index: number,
// ): void {
//   if (status === 'redeemed') {
//     return
//   }
//   if (status === 'wait') {
//     showToast('还未完成任务')
//     return
//   }
//   claimMissionReward({
//     event: EVENT_NAME,
//     task,
//     rewardId,
//   })
//     .then((res) => {
//       const rewards = res.data.rewards
//       modalReward.value?.openModal()
//       curRewards.value = {
//         name: Object.keys(rewards)[0],
//         count: Number(Object.values(rewards)[0]),
//       }
//       // 更新页面数据
//       activityData.value.event_data[EVENT_NAME][index].award[rewardId - 1] = 1
//       // 更新红点
//       setRedDot()
//     })
//     .catch((error) => {
//       showToast(error.message)
//     })
// }
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
.dice {
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
    background-image: url('@/assets/images/dice-map/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 432px;
  top: 593px;
  width: 776px;
  height: 348px;
  background-image: url('@/assets/images/dice-map/title.png');
}
.help {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 110px;
  right: -20px;
}
.dice-item {
  width: 188px;
  height: 188px;
}
.dice-select {
  background-image: url('@/assets/images/dice-map/dice-select.png');
}
.dice-random {
  background-image: url('@/assets/images/dice-map/dice-random.png');
}
.dice-num {
  box-shadow:
    0 0 10px rgba(188, 255, 195, 0.68),
    0 0 2px rgba(188, 255, 195, 0.68);
}
.nav {
  left: 27px;
  top: 32px;

  &-item {
    width: 237px;
    height: 95px;
  }

  &-dice {
    background-image: url('@/assets/images/dice-map/btn-dice.png');
  }

  &-store {
    background-image: url('@/assets/images/dice-map/btn-store.png');
  }

  &-query {
    background-image: url('@/assets/images/dice-map/btn-query.png');
  }
}
.start {
  left: 277px;
  bottom: 140px;
  width: 85px;
  height: 44px;
  background-image: url('@/assets/images/dice-map/start.png');
}
.crab {
  width: 218px;
  height: 341px;
  background-image: url('@/assets/images/dice-map/crab.png');

  &-eye {
    position: absolute;
  }

  &-eye-left {
    left: 28px;
    top: 203px;
    width: 15px;
    height: 21px;
    background-image: url('@/assets/images/dice-map/crab-eye-left.png');
    animation: blink-left 2s infinite;
  }

  &-eye-right {
    position: absolute;
    left: 64px;
    top: 231px;
    width: 19px;
    height: 22px;
    background-image: url('@/assets/images/dice-map/crab-eye-right.png');
    animation: blink-right 2s infinite;
  }
}
@keyframes blink-left {
  0% {
    transform: scaleY(1) rotate(0deg);
  }
  6.7% {
    transform: scaleY(0.05) rotate(45deg);
  }
  20% {
    transform: scaleY(1) rotate(0deg);
  }
  100% {
    transform: scaleY(1) rotate(0deg);
  }
}
@keyframes blink-right {
  0% {
    transform: scaleY(1) rotate(0deg);
  }
  6.7% {
    transform: scaleY(0.05) rotate(40deg);
  }
  20% {
    transform: scaleY(1) rotate(0deg);
  }
  100% {
    transform: scaleY(1) rotate(0deg);
  }
}
.reward {
  position: absolute;
  animation: floatAndScale 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;

  &-pos6 {
    left: 1238px;
    top: 918px;
    width: 76px;
    height: 104px;
    background-image: url('@/assets/images/dice-map/reward-heytea.png');
  }

  &-pos13 {
    left: 1684px;
    top: 522px;
    width: 115px;
    height: 126px;
    background-image: url('@/assets/images/dice-map/reward-fireworks.png');
  }

  &-pos16 {
    left: 1693px;
    top: 264px;
    width: 76px;
    height: 104px;
    background-image: url('@/assets/images/dice-map/reward-heytea.png');
  }

  &-pos28 {
    left: 312px;
    top: 164px;
    width: 73px;
    height: 111px;
    background-image: url('@/assets/images/dice-map/reward-random.png');
  }

  &-pos30 {
    left: 302px;
    top: 357px;
    width: 76px;
    height: 104px;
    background-image: url('@/assets/images/dice-map/reward-heytea.png');
  }

  &-pos45 {
    left: 739px;
    top: 331px;
    width: 143px;
    height: 129px;
    background-image: url('@/assets/images/dice-map/reward-rainbow.png');
  }

  &-pos48 {
    left: 1072px;
    top: 264px;
    width: 76px;
    height: 104px;
    background-image: url('@/assets/images/dice-map/reward-heytea.png');
  }
}
@keyframes floatAndScale {
  0%,
  100% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  50% {
    transform: translate3d(0, -8px, 0) scale(1.08);
  }
}
</style>
