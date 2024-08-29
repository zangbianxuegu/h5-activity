<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="dice flex h-screen">
      <div class="dice-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title relative overflow-hidden bg-contain bg-no-repeat"
            @click="moveTest(0, 3)"
          >
            <div class="sr-only">
              旅行尾迹地图
              <p>
                <time datetime="2024-08-29">10.1</time>-
                <time datetime="2024-09-11">10.7</time>
              </p>
            </div>
            <div
              class="help cursor-pointer bg-contain"
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
              </ul>
            </nav>
            <!-- 螃蟹 -->
            <div class="crab absolute right-0 top-[198px] bg-contain">
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
              class="dices absolute right-[36px] top-[468px] z-10 flex flex-col"
            >
              <!-- 万能骰子，选择点数 -->
              <button
                type="button"
                class="dice-item dice-select relative cursor-pointer bg-contain"
                aria-label="选择点数的万能骰子"
                onclick="alert('选择点数的万能骰子被点击')"
              >
                <span
                  class="absolute right-[-25px] top-[-25px] h-[60px] w-[60px] rounded-full bg-[#838ce0] text-center font-medium leading-[60px] text-white"
                  >2</span
                >
              </button>

              <!-- 随机骰子 -->
              <button
                type="button"
                class="dice-item dice-random relative mt-[60px] cursor-pointer bg-contain"
                aria-label="随机骰子"
                @click="handleDiceRandom"
              >
                <span
                  class="absolute right-[-25px] top-[-25px] h-[60px] w-[60px] rounded-full bg-[#838ce0] text-center font-medium leading-[60px] text-white"
                  >10</span
                >
              </button>
            </div>
            <!-- sky 动画 -->
            <AnimateSky
              ref="animateSky"
              class="absolute h-[185px] w-[127px]"
              json-path="./spine/yuyan/yuyan.json"
              atlas-path="./spine/yuyan/yuyan.atlas"
              :animations="[]"
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
        <activity-modal ref="modalHelp">
          <template #content>
            <section aria-labelledby="activity-rules-title">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text">
                <span class="font-semibold">活动时间：</span>
                2024年10月1日~2024年10月7日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <ul class="modal-text list-inside list-decimal">
                <li>活动期间，可前往飞行里程碑页面完成各种任务获取骰子</li>
                <li>
                  使用骰子后，角色可在旅行尾迹地图上移动相应的格数，并获取对应的奖励。每次完成一圈后，会获得<span
                    class="text-[#ffcb4d]"
                    >飞行券*30</span
                  >的额外奖励；
                </li>
                <li>使用飞行券可在纪念品商店兑换各种道具。</li>
              </ul>
            </section>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <section
              class="flex h-full flex-col"
              aria-labelledby="modalRewardTitle"
            >
              <h2 id="modalRewardTitle" class="sr-only">领奖弹框</h2>
              <p class="modal-text">
                恭喜你获得
                <span class="modal-text-blue">
                  {{ rewardsText[curRewards.name as keyof RewardsName] }} *
                  {{ curRewards.count }} </span
                >：
              </p>
              <div class="flex flex-1 items-center justify-center">
                <img
                  :src="handleSrc(String(curRewards.name))"
                  alt="reward image"
                />
              </div>
            </section>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getDiceMapData } from '@/apis/diceMap'
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useBaseStore } from '@/stores/base'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import AnimateSky from './components/AnimateSky.vue'
import AnimateDice from './components/AnimateDice.vue'
import {
  ANIMATION,
  animationListIdle,
  coordinates,
  animateSkySizes,
  type Animation,
} from './configs'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  outfit_prop_marshmallow: string
  beachball: string
  outfit_prop_mantafloat: string
  resize_potion: string
  glow: string
  outfit_prop_surfboard: string
  heart: string
}
const rewardsText: RewardsName = {
  outfit_prop_marshmallow: '烧烤架魔法',
  beachball: '沙滩球魔法',
  outfit_prop_mantafloat: '遥鲲泳圈试用魔法',
  resize_potion: '体型重塑',
  glow: '璀璨之星',
  outfit_prop_surfboard: '冲浪板试用魔法',
  heart: '爱心',
}
const curRewards: Ref<Rewards> = ref({
  name: 'outfit_prop_marshmallow',
  count: 2,
})

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

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const baseStore = useBaseStore()
const gameUid = computed(() => baseStore.baseInfo.gameUid)

// refs
const animateSky = ref<InstanceType<typeof AnimateSky> | null>(null)
const animateDice = ref<InstanceType<typeof AnimateDice> | null>(null)
// 随机骰子数值
const diceNum = ref(1)
// 是否正在播放骰子动画
const isDiceAnimating = ref(false)

// 当前位置，0-49
let curPosition = 0
// 当前动画大小类型
let curSizeType = 'right_idle'

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
  try {
    if (gameUid.value !== '') {
      handleDiceData()
    }
    // 初始化角色动画
    setTimeout(() => {
      initAnimateSky()
    }, 2000)
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

// 初始化
function initAnimateSky(): void {
  const animation = (coordinates[curPosition].direction + '_idle') as Animation
  console.log('animation: ', animation)
  animateSkyPlay(curPosition, animation)
  // 测试
  // setAnimateSkySize('back_move')
  // setAnimateSkyPosition(curPosition, 'back_move')
  // animateSky.value?.playAnimation('back_move', true)
}

let leftSteps = 0

// 测试动画效果
function moveTest(from: number, to: number): void {
  const steps = to - from
  leftSteps = steps
  // 开始动画
  const animation = (coordinates[from].direction + '_move') as Animation
  animateSkyPlay(from, animation)
}

// 根据位置确定动画类型

/**
 * @function setAnimationSkySize
 * @description 设置动画大小，每个动画的大小是固定的
 * @param {string} animation 动画名称
 */
function setAnimateSkySize(animation: Animation): void {
  if (animateSky.value) {
    curSizeType = animation
    const style = generateDynamicStyles({
      width: animateSkySizes[animation].width,
      height: animateSkySizes[animation].height,
    })
    animateSky.value.$el.style.width = style.width
    animateSky.value.$el.style.height = style.height
  }
}

/**
 * @function setAnimateSkyPosition
 * @description 设置动画位置，根据动画大小和坐标位置
 * @param {number} position 坐标位置
 * @param {string} animation 动画名称
 */
function setAnimateSkyPosition(position: number, animation: Animation): void {
  const { x, y } = coordinates[position]
  let left = 0
  let top = 0
  switch (animation) {
    case ANIMATION.RIGHT_IDLE:
      left = Math.floor(x - animateSkySizes[animation].width / 2)
      top = Math.floor(y - animateSkySizes[animation].height / 2) + 22
      break
    case ANIMATION.RIGHT_MOVE:
      left = Math.floor(x - animateSkySizes[animation].width / 2) + 82
      top = Math.floor(y - animateSkySizes[animation].height / 2)
      break
    case ANIMATION.FRONT_IDLE:
      left = Math.floor(x - animateSkySizes[animation].width / 2)
      top = Math.floor(y - animateSkySizes[animation].height / 2) - 50
      break
    case ANIMATION.FRONT_MOVE:
      left = Math.floor(x - animateSkySizes[animation].width / 2)
      top = Math.floor(y - animateSkySizes[animation].height / 2) - 100
      break
    case ANIMATION.LEFT_IDLE:
      left = Math.floor(x - animateSkySizes[animation].width / 2) - 10
      top = Math.floor(y - animateSkySizes[animation].height / 2)
      break
    case ANIMATION.LEFT_MOVE:
      left = Math.floor(x - animateSkySizes[animation].width / 2) - 80
      top = Math.floor(y - animateSkySizes[animation].height / 2) - 20
      break
    case ANIMATION.BACK_IDLE:
      left = Math.floor(x - animateSkySizes[animation].width / 2) - 20
      top = Math.floor(y - animateSkySizes[animation].height / 2) - 40
      break
    case ANIMATION.BACK_MOVE:
      left = Math.floor(x - animateSkySizes[animation].width / 2) - 35
      top = Math.floor(y - animateSkySizes[animation].height / 2) - 10
      break
    default:
      break
  }
  if (animateSky.value) {
    const style = generateDynamicStyles({
      left,
      top,
    })
    animateSky.value.$el.style.left = style.left
    animateSky.value.$el.style.top = style.top
  }
}

/**
 * @function animateSkyPlay
 * @description 角色动画
 * @param {number} position 位置
 * @param {Animation} animation 动画名称
 */
function animateSkyPlay(position: number, animation: Animation): void {
  // 设置动画大小
  if (curSizeType !== animation) {
    setAnimateSkySize(animation)
  }
  // 设置动画位置
  setAnimateSkyPosition(position, animation)
  // 开始动画
  const loop = animationListIdle.includes(animation)
  animateSky.value?.playAnimation(animation, loop)
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
  console.log('random: ', random)
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
  console.log('骰子动画完成')
  isDiceAnimating.value = false
}

/**
 * @function onAnimate
 * @description 角色动画完成
 * @param entry
 */
function OnAnimationSkyComplete(entry: any): void {
  if (entry.animation.name.includes('idle')) {
    console.log(`角色动画完成${entry.animation.name}`)
  }
  if (entry.animation.name.includes('move')) {
    console.log(`角色动画完成${entry.animation.name}`)
    leftSteps--
    curPosition++
    if (leftSteps > 0) {
      // move animation
      setTimeout(() => {
        const animation = (coordinates[curPosition].direction +
          '_move') as Animation
        animateSkyPlay(curPosition, animation)
      }, 0)
    } else {
      // idle animation
      const animation = (coordinates[curPosition].direction +
        '_idle') as Animation
      animateSkyPlay(curPosition, animation)
    }
  }
}

// px -> vw
const calculatePxToViewport = (px: number): string => {
  const clientWidth = document.documentElement.clientWidth
  return Math.round(((px * factor.value) / DESIGN_WIDTH) * clientWidth) + 'px'
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
  modalHelp.value?.openModal()
}

/**
 * @function 处理 img src
 * @param name 奖励名
 * @returns {string} 图片路径
 */
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
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
  left: 488px;
  top: 641px;
  width: 755px;
  height: 218px;
  background-image: url('@/assets/images/dice-map/title.png');
}
.help {
  position: absolute;
  width: 80px;
  height: 80px;
  bottom: -10px;
  right: -10px;
}
.dice-item {
  width: 142px;
  height: 142px;
}
.dice-select {
  background-image: url('@/assets/images/dice-map/dice-select.png');
}
.dice-random {
  background-image: url('@/assets/images/dice-map/dice-random.png');
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
}
.crab {
  width: 244px;
  height: 230px;
  background-image: url('@/assets/images/dice-map/crab.png');

  &-eye {
    position: absolute;
  }

  &-eye-left {
    left: 26px;
    top: 98px;
    width: 15px;
    height: 21px;
    background-image: url('@/assets/images/dice-map/crab-eye-left.png');
    animation: blink-left 2s infinite;
  }

  &-eye-right {
    position: absolute;
    left: 63px;
    top: 128px;
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
</style>
