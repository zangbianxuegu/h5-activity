<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="dice flex h-screen">
      <div class="dice-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              因光而遇 因遇而喜
              <p>
                <time datetime="2024-09-27">9.27</time>-
                <time datetime="2024-10-11">10.11</time>
              </p>
            </div>
            <div
              class="help z-30 cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 导航按钮 -->
            <nav class="nav absolute z-10">
              <ul>
                <li class="nav-item nav-dice bg-contain">
                  <RouterLink to="/dice-mission" class="block h-full w-full">
                    <span class="sr-only">获取骰子</span>
                  </RouterLink>
                </li>
                <li class="nav-item nav-store mt-3 bg-contain">
                  <RouterLink to="/dice-store" class="block h-full w-full">
                    <span class="sr-only">兑换商店</span>
                  </RouterLink>
                </li>
                <li
                  class="nav-item nav-query mt-3 bg-contain"
                  @click="handleRewardQuery"
                >
                  <a href="javascript:void(0);" class="block h-full w-full">
                    <span class="sr-only">奖励查询</span>
                  </a>
                </li>
              </ul>
            </nav>
            <!-- 螃蟹 -->
            <div class="crab absolute right-0 top-[104px] bg-contain">
              <!-- 左眼 -->
              <span
                class="crab-eye crab-eye-left inline-block rounded-full bg-contain"
              ></span>
              <!-- 右眼 -->
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
                  :class="[
                    'dice-num absolute right-[-2px] top-[-2px] h-[60px] w-[60px] rounded-full bg-[#64a2e8] text-center font-medium leading-[60px] text-white',
                    { 'dice-num-mini': diceCountRandom > 99 },
                  ]"
                  >{{ diceCountCustom }}</span
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
                  :class="[
                    'dice-num absolute right-[-2px] top-[-2px] h-[60px] w-[60px] rounded-full bg-[#64a2e8] text-center font-medium leading-[60px] text-white',
                    { 'dice-num-mini': diceCountRandom > 99 },
                  ]"
                  >{{ diceCountRandom }}</span
                >
              </button>
            </div>
            <!-- 格子 勿删-->
            <!-- <div
              class="row absolute left-[240px] top-[93px] flex h-[940px] w-[1600px] flex-wrap"
            >
              <div
                class="h-[94px] w-[160px] border border-solid border-green-500"
                v-for="(_, index) in Array.from({ length: 100 })"
                :key="index"
              ></div>
            </div> -->
            <!-- 已完成圈数 -->
            <p class="turns" v-if="turns > 0">已完成圈数：{{ turns }}</p>
            <!-- 地图上显示的奖励 -->
            <!-- 位置1：喜遇券 30 -->
            <div
              v-if="turns > 0"
              class="start absolute bg-contain bg-no-repeat"
            >
              <div class="reward reward-pos0 bg-contain"></div>
            </div>
            <!-- 开始 -->
            <div v-else class="start-text absolute bg-contain">
              <span class="sr-only">开始</span>
            </div>
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
            <AnimateSky
              ref="animateSky"
              class="absolute h-[400px] w-[450px]"
              json-path="./spine/dice-map/yuyan/yuyan.json"
              atlas-path="./spine/dice-map/yuyan/yuyan.atlas"
              @success="onAnimateSkySuccess"
              @complete="OnAnimateSkyComplete"
            />
            <!-- 螃蟹动画 -->
            <div
              ref="overlay"
              class="overlay fixed inset-0 z-10 hidden bg-black opacity-0 transition-opacity duration-200"
            ></div>
            <AnimateCrab
              ref="animateCrab"
              class="absolute left-[638px] top-[227px] z-20 h-[686px] w-[764px]"
              jsonPath="./spine/dice-map/crab/crab.json"
              atlasPath="./spine/dice-map/crab/crab.atlas"
              @complete="onAnimateCrabComplete"
            />
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
        <!-- 领奖弹框 -->
        <ModalReward ref="modalReward" :rewards="curRewards" :is-end="isEnd" />
        <!-- 奖励查询弹框 -->
        <ModalQuery ref="modalQuery" :heytea-rewards="heyteaRewards" />
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
import { useStorage } from '@vueuse/core'
import { getDiceMapData, getRandomDiceNum, diceMove } from '@/apis/diceMap'
import type { DesignConfig, DiceType, HeyteaRewards, Rewards } from '@/types'
import { Session } from '@/utils/storage'
import { useBaseStore } from '@/stores/base'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import AnimateSky from './components/AnimateSky.vue'
import AnimateCrab from './components/AnimateCrab.vue'
import ModalHelp from './components/ModalHelp.vue'
import ModalReward from './components/ModalReward.vue'
import ModalQuery from './components/ModalQuery.vue'
import ModalRoute from './components/ModalRoute.vue'
import ModalDice from './components/ModalDice.vue'
import {
  ANIMATION,
  isIdle,
  coordinates,
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
const overlay = ref<InstanceType<typeof HTMLDivElement> | null>(null)
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
const modalReward = ref<InstanceType<typeof ModalReward> | null>(null)
const modalQuery = ref<InstanceType<typeof ModalQuery> | null>(null)
const modalRoute = ref<InstanceType<typeof ModalRoute> | null>(null)
const modalDice = ref<InstanceType<typeof ModalDice> | null>(null)
const animateCrab = ref<InstanceType<typeof AnimateCrab> | null>(null)
const animateSky = ref<InstanceType<typeof AnimateSky> | null>(null)

// 活动数据
const baseStore = useBaseStore()
const gameUid = computed(() => baseStore.baseInfo.gameUid)

// 拥有的骰子数量
const diceCountCustom = ref(0)
const diceCountRandom = ref(0)
// 随机骰子数值
const diceNum = ref(1)
// 当前位置，0-49
let curPosition = 0
// 记录 move 之前的位置
let prePosition = 0
// 当前路线
let curRoute = 'A' as Route // A、B
// 剩余步数
let remainingSteps = 0
// 骰子类型
let diceType: DiceType = 'random_dice'
// 骰子数值
let diceValue = 0
// 路线选择
let choices: Record<string, number> | null = null
// 角色动画是否已加载完成
const isAnimateSkyLoaded = ref(false)
// 是否已获取数据
const isDiceDataLoaded = ref(false)
// 是否正在移动：从选择步数或随机步数动画->角色移动->请求move接口完成
const isMoving = ref(false)
// 是否结束一圈
const isEnd = ref(false)
// 当前奖励
const curRewards = ref<Rewards>([{ count: 10, name: 'heytea_coupon' }])
// 喜茶优惠券
const heyteaRewards = ref<HeyteaRewards>([{ type: '', code: '' }])
// 已完成圈数
const turns = useStorage('dice-map-turns', 0)

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
 * 监听游戏uid
 * 因为gameUid可能在进入页面时还未获取到，所以需要监听游戏uid
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

/**
 * 监听是否获取接口数据和动画是否加载完成，开始待机动画
 */
watch(
  [isAnimateSkyLoaded, isDiceDataLoaded],
  ([newVal1, newVal2]) => {
    if (newVal1 && newVal2) {
      animateSkyIdle()
    }
  },
  { immediate: true },
)

onMounted(() => {
  try {
    if (gameUid.value !== '') {
      handleDiceData()
    }
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

/**
 * @function setAnimateSkyPosition
 * @description 设置动画位置，根据动画大小和坐标位置
 * @param {number} position 坐标位置
 */
function setAnimateSkyPosition(position: number, loop: boolean): void {
  const { x, y, direction } = coordinates[position]
  console.log('开始设置位置：', x, y)
  let offsetX = 225
  let offsetY = 200
  switch (direction) {
    case 'right':
      if (loop) {
        offsetX = 230
        offsetY = 203
      }
      break
    case 'front':
      offsetX = 220
      offsetY = 210
      break
    case 'left':
      if (loop) {
        offsetX = 230
        offsetY = 200
      } else {
        offsetX = 235
        offsetY = 200
      }
      break
    case 'back':
      if (loop) {
        offsetX = 225
        offsetY = 221
      } else {
        offsetX = 225
        offsetY = 220
      }
      break
    default:
      break
  }
  if (animateSky.value) {
    const style = generateDynamicStyles({
      left: x - offsetX,
      top: y - offsetY,
    })
    animateSky.value.$el.style.left = style.left
    animateSky.value.$el.style.top = style.top
  }
}

/**
 * @function animateSkyPlay
 * @description 角色动画。
 * @param {number} position 位置
 * @param {Animation} animation 动画名称
 */
function animateSkyPlay(position: number, animation: Animation): void {
  console.log('position: ', position)
  const loop = isIdle(animation)
  animateSky.value?.playAnimation(animation, loop)
  requestAnimationFrame(() => {
    setAnimateSkyPosition(position, loop)
  })
}

/**
 * @function animateSkyMove
 * @description 角色移动。根据当前位置和路线选择进行 move 动画。
 */
function animateSkyMove(): void {
  isMoving.value = true
  if (curPosition === 7) {
    // 先进行路线选择
    modalRoute.value?.open()
  } else {
    const animation = (coordinates[curPosition].direction +
      '_move') as Animation
    animateSkyPlay(curPosition, animation)
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
  if (diceCountCustom.value === 0) {
    showToast('暂时没有遥鲲路过，可在光遇见喜中获取')
    return
  }
  if (isMoving.value) {
    return
  }
  modalDice.value?.open()
}

/**
 * @function chooseDiceNum
 * @description 选择万能骰子点数
 * @param num 选择的点数
 */
function chooseDiceNum(num: number): void {
  isMoving.value = true
  diceCountCustom.value--
  diceType = 'custom_dice'
  calculateRemainingSteps(num)
  diceValue = num
  setTimeout(() => {
    animateSkyMove()
  }, 200)
}

/**
 * @function handleDiceRandom
 * @description 点击随机骰子
 */
function handleDiceRandom(): void {
  if (diceCountRandom.value === 0) {
    showToast('暂时没有蟹蟹路过，可在光遇见喜中获取')
    return
  }
  if (isMoving.value) {
    return
  }
  isMoving.value = true
  diceCountRandom.value--
  getRandomDiceNum(gameUid.value)
    .then((res: any) => {
      console.log('res: ', res)
      diceNum.value = res.value
      diceType = 'random_dice'
      const animationName = `in_${diceNum.value}`
      setTimeout(() => {
        overlay.value?.classList.add('opacity-50')
        overlay.value?.classList.remove('hidden')
        animateCrab.value?.playAnimation(animationName, false)
      }, 200)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function onAnimateCrabComplete
 * @description 随机骰子（螃蟹）动画完成
 */
function onAnimateCrabComplete(): void {
  // 剩余步数可能和骰子点数不一致，move 传参步数需要和骰子点数一致
  calculateRemainingSteps(diceNum.value)
  diceValue = diceNum.value
  overlay.value?.classList.remove('opacity-50')
  overlay.value?.classList.add('hidden')
  setTimeout(() => {
    animateSkyMove()
  }, 200)
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

// sky 动画加载成功
function onAnimateSkySuccess(): void {
  isAnimateSkyLoaded.value = true
}

/**
 * @function OnAnimateSkyComplete
 * @description 角色动画完成回调函数
 * @param entry
 */
function OnAnimateSkyComplete(entry: any): void {
  if (!entry.animation) {
    return
  }
  if (entry.animation.name.includes('move')) {
    remainingSteps--
    setCurPositionForward()
    if (remainingSteps > 0) {
      setTimeout(() => {
        animateSkyMove()
      }, 100)
    } else {
      animateSkyOver()
    }
  }
}

/**
 * @function animateSkyOver
 * @description 角色动画 move 完成
 */
function animateSkyOver(): void {
  // 在 move 结束时，请求 move 接口
  handleDiceMove()
  // fix: 动效，转角仍然有卡一帧的问题
  // 异步 100 ms 执行 idle，但是转向 front 仍然比较明显
  setTimeout(() => {
    animateSkyIdle()
  }, 100)
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
        choices = {
          '7': 8,
        }
      } else {
        animation = ANIMATION.FRONT_MOVE
        choices = {
          '7': 36,
        }
      }
      animateSkyPlay(curPosition, animation)
    }, 200)
  }
}

/**
 * @function calculateRemainingSteps
 * @description 计算剩余步数
 */
function calculateRemainingSteps(num: number): void {
  // 判断是否是最后一步
  if (curPosition > 30 && curPosition < 36 && curPosition + num > 36) {
    remainingSteps = 36 - curPosition
  } else {
    remainingSteps = num
  }
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
      isDiceDataLoaded.value = true
      turns.value = res.data.round_count
      curPosition = res.data.cur_pos
      prePosition = res.data.cur_pos
      diceCountCustom.value = Number(res.data.custom_dice)
      diceCountRandom.value = Number(res.data.random_dice)
      heyteaRewards.value = res.data.heytea_reward
      // 测试
      // heyteaRewards.value = [
      //   {
      //     type: 'heytea_coupon',
      //     code: 'ed64q7cfxrm1',
      //   },
      //   {
      //     type: 'heytea_half',
      //     code: 'ed64q7cfxrm2',
      //   },
      // ]
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function handleDiceMove
 * @description 走格子移动
 */
function handleDiceMove(): void {
  diceMove({
    user: gameUid.value,
    cur_pos: prePosition,
    dice_type: diceType,
    dice_value: diceValue,
    choices,
  })
    .then((res) => {
      isMoving.value = false
      curPosition = res.data.cur_pos
      prePosition = res.data.cur_pos
      isEnd.value = res.data.is_end
      if (isEnd.value) {
        turns.value++
      }
      diceCountCustom.value = Number(res.data.custom_dice)
      diceCountRandom.value = Number(res.data.random_dice)
      const rewards = res.data.rewards
      if (rewards?.length > 0) {
        modalReward.value?.open()
        curRewards.value = rewards
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function handleRewardQuery
 * @description 打开中奖查询
 */
function handleRewardQuery(): void {
  modalQuery.value?.open()
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
  left: 530px;
  top: 607px;
  width: 678px;
  height: 313px;
  background-image: url('@/assets/images/dice-map/title.png');
}
.help {
  position: absolute;
  width: 80px;
  height: 80px;
  top: 95px;
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
  font-size: 40px;
  box-shadow:
    0 0 10px rgba(188, 255, 195, 0.68),
    0 0 2px rgba(188, 255, 195, 0.68);

  &-mini {
    font-size: 32px;
  }
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
.turns {
  position: absolute;
  left: 246px;
  top: 1028px;
  margin-top: 20px;
  font-size: 38px;
  color: #ddffd1;
}
.start {
  left: 246px;
  top: 935px;
  width: 156px;
  height: 93px;
  background-image: url('@/assets/images/dice-map/start-bg.png');
}
.start-text {
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

  &-pos0 {
    left: 32px;
    top: -24px;
    width: 91px;
    height: 120px;
    background-image: url('@/assets/images/common/reward/reward-heytea_token_yellow.png');
  }

  &-pos6 {
    left: 1228px;
    top: 908px;
    width: 97px;
    height: 125px;
    background-image: url('@/assets/images/common/reward/reward-heytea_token.png');
  }

  &-pos13 {
    left: 1676px;
    top: 514px;
    width: 130px;
    height: 141px;
    background-image: url('@/assets/images/dice-map/reward-fireworks.png');
  }

  &-pos16 {
    left: 1683px;
    top: 254px;
    width: 97px;
    height: 125px;
    background-image: url('@/assets/images/common/reward/reward-heytea_token.png');
  }

  &-pos28 {
    left: 304px;
    top: 156px;
    width: 89px;
    height: 126px;
    background-image: url('@/assets/images/dice-map/reward-random.png');
  }

  &-pos30 {
    left: 292px;
    top: 347px;
    width: 97px;
    height: 125px;
    background-image: url('@/assets/images/common/reward/reward-heytea_token.png');
  }

  &-pos45 {
    left: 732px;
    top: 324px;
    width: 158px;
    height: 144px;
    background-image: url('@/assets/images/dice-map/reward-trail_red.png');
  }

  &-pos48 {
    left: 1062px;
    top: 254px;
    width: 97px;
    height: 125px;
    background-image: url('@/assets/images/common/reward/reward-heytea_token.png');
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
