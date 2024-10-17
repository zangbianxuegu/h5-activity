<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="halloween flex h-screen">
      <div class="halloween-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <section>
            <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
              <div class="sr-only">
                惊吓？惊喜！出奇寻宝
                <p>
                  <time datetime="2024-10-26">10.26</time>-
                  <time datetime="2024-11-15">11.15</time>
                </p>
              </div>
              <div
                class="help cursor-pointer bg-contain"
                @click="handleHelp"
              ></div>
            </h1>
            <!-- 铲数 -->
            <div class="shovel">
              <div class="shovel-icon bg-cover"></div>
              <div class="shovel-count flex justify-center">
                {{ Number(shovelCount) > 0 ? shovelCount : 0 }}
              </div>
            </div>
          </section>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="treasure-map">
            <!-- 坑 -->
            <div class="absolute flex flex-wrap">
              <div
                v-for="(_, rowIndex) in 6"
                :key="rowIndex"
                class="flex w-full"
              >
                <div
                  v-for="(_, colIndex) in 12"
                  :key="colIndex"
                  class="hole w-1/12 bg-transparent bg-cover"
                >
                  <div
                    v-if="hasHoleBorder(rowIndex, colIndex, 'left')"
                    class="hole-left bg-transparent bg-cover"
                  ></div>
                  <div
                    v-if="hasHoleBorder(rowIndex, colIndex, 'right')"
                    class="hole-right bg-transparent bg-cover"
                  ></div>
                  <div
                    v-if="hasHoleBorder(rowIndex, colIndex, 'top')"
                    class="hole-top bg-transparent bg-cover"
                  ></div>
                  <div
                    v-if="hasHoleBorder(rowIndex, colIndex, 'bottom')"
                    class="hole-bottom bg-transparent bg-cover"
                  ></div>
                  <div
                    v-if="
                      hasHoleBorder(rowIndex, colIndex, 'top') &&
                      hasHoleBorder(rowIndex, colIndex, 'left')
                    "
                    class="hole-top-left bg-transparent bg-cover"
                  ></div>
                  <div
                    v-if="
                      hasHoleBorder(rowIndex, colIndex, 'bottom') &&
                      hasHoleBorder(rowIndex, colIndex, 'left')
                    "
                    class="hole-bottom-left bg-transparent bg-cover"
                  ></div>
                  <div
                    v-if="
                      hasHoleBorder(rowIndex, colIndex, 'bottom') &&
                      hasHoleBorder(rowIndex, colIndex, 'right')
                    "
                    class="hole-bottom-right bg-transparent bg-cover"
                  ></div>
                </div>
              </div>
            </div>

            <!-- 奖励 -->
            <div
              :class="[
                'reward absolute h-full w-full',
                isLoaded ? 'opacity-100' : 'opacity-0',
              ]"
            >
              <div
                class="repellant_krill animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">冥龙</span>
              </div>
              <div
                class="crab crab1 animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">螃蟹</span>
              </div>
              <div
                class="crab crab2 animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">螃蟹</span>
              </div>
              <div
                class="pumpkin_crab animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">南瓜螃蟹</span>
              </div>
              <div class="cat animate__animated animate__fadeIn bg-cover">
                <span class="sr-only">皮皮猫</span>
              </div>
              <div
                class="candy candy1 animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">糖果</span>
              </div>
              <div
                class="candy candy2 animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">糖果</span>
              </div>
              <div
                class="candy candy3 animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">糖果</span>
              </div>
              <div
                class="candy candy4 animate__animated animate__fadeIn bg-cover"
              >
                <span class="sr-only">糖果</span>
              </div>
              <div
                v-for="item in spiderWebs"
                :key="item"
                class="spider-web bg-cover"
                :style="getSpiderWebStyle(item)"
              >
                <span class="sr-only">蜘蛛网</span>
              </div>
            </div>

            <!-- 砖 -->
            <div class="brick-list absolute flex flex-wrap">
              <div
                v-for="(_, rowIndex) in 6"
                :key="rowIndex"
                class="flex w-full"
              >
                <div
                  v-for="(_, colIndex) in 12"
                  :key="colIndex"
                  :class="[
                    'brick w-1/12 bg-cover transition',
                    { 'opacity-0': isDigged(rowIndex, colIndex) },
                    getBrickClass(rowIndex, colIndex),
                  ]"
                  @click="handleDig(rowIndex, colIndex)"
                ></div>
              </div>
            </div>

            <!-- 挖宝动画 -->
            <AnimateDig
              ref="animateDig"
              class="absolute left-[110px] top-[-180px] hidden h-[300px] w-[250px]"
              json-path="./spine/halloween-2024/2024Halloween.json"
              atlas-path="./spine/halloween-2024/2024Halloween.atlas"
              @complete="onAnimateDigComplete"
            />
          </section>
        </Transition>
        <footer class="footer flex w-full justify-center">
          <p class="tips">点击土块挖掘宝藏，活动截止日期：11月16日0点</p>
        </footer>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section class="px-4" aria-labelledby="activity-rules-title">
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text mt-4">
                <span class="font-semibold">活动时间：</span>
                2024年10月26日~2024年11月15日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <p>活动期间，玩家可以使用捣蛋挖宝次数进行挖宝：</p>
              <ul class="modal-text list-inside list-decimal">
                <li>每次挖宝均可获得10捣蛋币的奖励</li>
                <li>
                  挖出宝藏可获得额外捣蛋币奖励，对应奖励如
                  <div class="grid grid-cols-2">
                    <span>宝藏</span>
                    <span>奖励</span>
                    <span>糖果</span>
                    <span class="text-[#ffcb4d]">20</span>
                    <span>皮皮猫</span>
                    <span class="text-[#ffcb4d]">80</span>
                    <span>螃蟹</span>
                    <span class="text-[#ffcb4d]">30</span>
                    <span>冥龙</span>
                    <span class="text-[#ffcb4d]">100</span>
                    <span>南瓜螃蟹</span>
                    <span class="text-[#ffcb4d]">50</span>
                  </div>
                </li>
              </ul>
            </section>
          </template>
        </activity-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import type { DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import { generateDynamicStyles } from '@/utils/utils'
import { getPlayerMissionData } from '@/utils/request'
import { halloweenTreasureHunt } from '@/apis/halloween'
import { useActivityStore } from '@/stores/halloweenTreasure2024'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'
import AnimateDig from './components/AnimateDig.vue'

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
useResponsiveStyles(designConfig)

interface Adjacent {
  left: number | null
  right: number | null
  top: number | null
  bottom: number | null
}

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const animateDig = ref<InstanceType<typeof AnimateDig> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_Halloweentreasure_2024'
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
// 铲数
const shovelCount = computed(
  () => Number(activityData.value.event_data[EVENT_NAME][0].ticket) ?? 0,
)
// 已经挖开的格子
const openedBricks = computed(() => {
  const digged = activityData.value.event_data[EVENT_NAME][0].map
  if (digged) {
    return digged
  }
  return []
})
// 页面是否已加载完成
const isLoaded = ref(false)
// 蜘蛛网位置
const spiderWebs = [
  2, 3, 6, 9, 11, 15, 21, 24, 25, 29, 30, 35, 36, 43, 45, 52, 57, 61, 65, 67,
]
// 宝藏位置
const candy = [5, 10, 17, 22, 48, 60, 56, 68]
const cat = [46, 47, 58, 59, 70, 71]
const crab = [0, 1, 12, 13, 41, 42, 53, 54]
const pumpkinCrab = [19, 20, 31, 32]
const repellantKrill = [26, 27, 38, 39, 50, 51, 62, 63]
const treasureMap: Record<string, number[]> = {
  糖果: candy,
  皮皮猫: cat,
  螃蟹: crab,
  南瓜螃蟹: pumpkinCrab,
  冥龙克星: repellantKrill,
}
// 当前格子id
let curGridId = 0
let curRowIndex = 0
let curColIndex = 0
// 当前代币数
let curHalloweenTokenCount = '10'
// 是否正在挖
let isDigging = false
// 是否挖到宝藏
let isObtaindTreasure = false

const sessionIsVisitedKey = 'isVisitedHalloweentreasure2024'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

onMounted(() => {
  try {
    if (document.readyState === 'complete') {
      showRewards()
    } else {
      window.addEventListener('load', showRewards)
    }
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

/**
 * @description 显示奖励
 * @returns {void}
 */
function showRewards(): void {
  isLoaded.value = true
}

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.openModal()
}

/**
 * @function getActivityData
 * @description 获取任务进度
 * @returns {void}
 */
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      const data = res.data
      const newActivityData = {
        ...data,
        event_data: {
          [EVENT_NAME]: data.event_data[EVENT_NAME],
        },
      }
      // 更新缓存活动数据
      activityStore.updateActivityData(newActivityData)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function getSpiderWebStyle
 * @description 获取蜘蛛网样式
 * @param {number} item 格子位置
 * @returns {Record<string, string>} 样式对象
 */
function getSpiderWebStyle(item: number): Record<string, string> {
  const left = (item % 12) * 141 + 8
  const top = Math.floor(item / 12) * 118 + 2
  return generateDynamicStyles({ left, top })
}

/**
 * @function getBrickStyle
 * @description 获取砖块类
 * @param {number} rowIndex 行索引
 * @param {number} colIndex 列索引
 * @returns {string} 砖块类
 */
function getBrickClass(rowIndex: number, colIndex: number): string {
  const patterns = [
    ['brick1', 'brick2'],
    ['brick3', 'brick4'],
    ['brick5', 'brick6'],
  ]
  const patternIndex = rowIndex % 3
  const pattern = patterns[patternIndex]
  return pattern[colIndex % 2]
}

/**
 * @function hasHoleBorder
 * @description 判断是否有坑边
 * @param {number} rowIndex 行索引
 * @param {number} colIndex 列索引
 * @param {keyof Adjacent} border 坑边，left、right、top、bottom
 * @returns {boolean} 是否有坑边
 */
function hasHoleBorder(
  rowIndex: number,
  colIndex: number,
  border: keyof Adjacent,
): boolean {
  if (isDigged(rowIndex, colIndex)) {
    const adjacent = getAdjacent(rowIndex, colIndex)
    return (
      adjacent[border] === null ||
      !openedBricks.value.includes(adjacent[border] as number)
    )
  }
  return false
}

/**
 * @description 获取相邻格子位置
 * @param {number} rowIndex 行索引
 * @param {number} colIndex 列索引
 * @returns {Adjacent} 相邻格子位置
 */
function getAdjacent(rowIndex: number, colIndex: number): Adjacent {
  return {
    left: colIndex > 0 ? rowIndex * 12 + colIndex - 1 : null,
    right: colIndex < 11 ? rowIndex * 12 + colIndex + 1 : null,
    top: rowIndex > 0 ? (rowIndex - 1) * 12 + colIndex : null,
    bottom: rowIndex < 5 ? (rowIndex + 1) * 12 + colIndex : null,
  }
}

/**
 * @description 判断砖块是否挖过
 * @param {number} rowIndex 行索引
 * @param {number} colIndex 列索引
 * @returns {boolean} 是否挖过
 */
function isDigged(rowIndex: number, colIndex: number): boolean {
  const index = rowIndex * 12 + colIndex
  return openedBricks.value.includes(index)
}

/**
 * @description 挖宝
 * @param {number} rowIndex 行索引
 * @param {number} colIndex 列索引
 * @returns {void}
 */
function handleDig(rowIndex: number, colIndex: number): void {
  // 正在挖
  if (isDigging) {
    return
  }
  // 没有挖宝次数
  if (shovelCount.value <= 0) {
    showToast('没有挖宝次数')
    return
  }
  // 已经挖过
  if (openedBricks.value?.length >= 72) {
    showToast('已经全部挖完了~')
    return
  }
  const index = rowIndex * 12 + colIndex
  if (openedBricks.value?.includes(index)) {
    showToast('已经挖过了~')
    return
  }
  isDigging = true
  curRowIndex = rowIndex
  curColIndex = colIndex
  curGridId = rowIndex * 12 + colIndex
  // 设置挖宝动画
  if (animateDig.value) {
    const newStyle = generateDynamicStyles({
      width: 250,
      height: 300,
      left: -31 + 141 * curColIndex,
      top: -180 + 118 * curRowIndex,
    })
    Object.assign(animateDig.value.$el.style, newStyle)
    animateDig.value.$el.classList.remove('hidden')
    animateDig.value.playAnimation('shovel', false)
  }
}

/**
 * @function onAnimateDigComplete
 * @description 挖宝动画完成回调函数
 * @param entry
 */
function onAnimateDigComplete(entry: any): void {
  if (entry.animation.name.includes('shovel')) {
    halloweenTreasureHunt({
      event: EVENT_NAME,
      task: `${EVENT_NAME}_m1`,
      grid_id: curGridId,
    })
      .then((res) => {
        activityData.value.event_data[EVENT_NAME][0].map?.push(curGridId)
        activityData.value.event_data[EVENT_NAME][0].ticket =
          res.remaining_tickets
        curHalloweenTokenCount = res.rewards.halloween_token
        isObtaindTreasure = res.is_obtaind_treasure
        // 设置金币动画
        if (animateDig.value) {
          const newStyle = generateDynamicStyles({
            width: 250,
            height: 200,
            left: 55 + 141 * curColIndex,
            top: -100 + 118 * curRowIndex,
          })
          Object.assign(animateDig.value.$el.style, newStyle)
          animateDig.value.playAnimation('species', false)
        }
      })
      .catch((error) => {
        showToast(error.message)
      })
  }
  if (entry.animation.name.includes('species')) {
    if (isObtaindTreasure) {
      let treasureName = ''
      for (const [name, ids] of Object.entries(treasureMap)) {
        if (ids.includes(curGridId)) {
          treasureName = name
          break
        }
      }
      showToast(
        `恭喜您挖到了${treasureName}宝藏，获得捣蛋币*${curHalloweenTokenCount}`,
      )
    } else {
      showToast(`捣蛋币+${curHalloweenTokenCount}`)
    }
    animateDig.value?.$el.classList.add('hidden')
    isDigging = false
  }
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
.halloween {
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
    background-image: url('@/assets/images/halloween-treasure-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 486px;
  top: 20px;
  width: 1136px;
  height: 291px;
  background-image: url('@/assets/images/halloween-treasure-2024/title.png');
}
.help {
  position: absolute;
  width: 91px;
  height: 91px;
  top: -4px;
  right: 35px;
  background-image: url('@/assets/images/halloween-treasure-2024/help.png');
}
.footer {
  position: absolute;
  left: 0;
  bottom: 10px;
}
.tips {
  position: relative;
  width: 1036px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 34px;
  color: #e2f6fd;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 45%;
    transform: translateY(-50%);
    width: 208px;
    height: 12px;
    background-image: url('@/assets/images/halloween-treasure-2024/tips-bg.png');
    background-size: contain;
    z-index: -1;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
    transform: scaleX(-1);
  }
}
.shovel {
  position: absolute;
  right: 174px;
  top: 204px;
  width: 204px;
  height: 67px;

  &-icon {
    position: absolute;
    left: 2px;
    top: -10px;
    width: 68px;
    height: 77px;
    background-image: url('@/assets/images/halloween-treasure-2024/shovel.png');
  }

  &-count {
    margin-top: 16px;
    padding: 0 25px 0 70px;
    border-radius: 51px;
    width: 204px;
    height: 51px;
    line-height: 51px;
    font-size: 45px;
    color: #fff;
    background: rgba(#8b7ab2, $alpha: 0.85);
  }
}
.treasure-map {
  position: absolute;
  left: 177px;
  top: 305px;
  width: 1689px;
  height: 705px;
  background: #5d316d;
}
.brick {
  width: 147px;
  height: 126px;
  margin-right: -6px;
  margin-bottom: -8px;
}
.hole {
  width: 141px;
  height: 118px;
  position: relative;
  background-position: center center;

  &:nth-child(2n) {
    background-size: 123px 99px;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-bg2.png');
  }

  &:nth-child(2n + 1) {
    background-size: 129px 101px;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-bg1.png');
  }

  &-left {
    position: absolute;
    left: -5px;
    top: -2px;
    width: 17px;
    height: 123px;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-left.png');
  }

  &-right {
    position: absolute;
    right: -8px;
    top: -2px;
    width: 8px;
    height: 123px;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-right.png');
  }

  &-top {
    position: absolute;
    top: -5px;
    left: 5px;
    width: 141px;
    height: 18px;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-top.png');
  }

  &-bottom {
    position: absolute;
    left: 0px;
    bottom: -5px;
    width: 141px;
    height: 10px;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-bottom.png');
  }

  &-top-left {
    position: absolute;
    left: 12px;
    top: 12px;
    width: 12px;
    height: 10px;
    // border: 1px solid red;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-top-left.png');
  }

  &-bottom-left {
    position: absolute;
    left: 12px;
    bottom: 4px;
    width: 6px;
    height: 6px;
    // border: 1px solid red;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-bottom-left.png');
  }

  &-bottom-right {
    position: absolute;
    right: 0px;
    bottom: 4px;
    width: 4px;
    height: 4px;
    // border: 1px solid red;
    background-image: url('@/assets/images/halloween-treasure-2024/hole-bottom-right.png');
  }
}
@for $i from 1 through 6 {
  .brick#{$i} {
    background-image: url('@/assets/images/halloween-treasure-2024/brick#{$i}.png');
  }
}
.repellant_krill {
  position: absolute;
  left: 299px;
  top: 271px;
  width: 252px;
  height: 419px;
  background-image: url('@/assets/images/halloween-treasure-2024/reward-repellant_krill.png');
}
.crab {
  position: absolute;
  width: 244px;
  height: 188px;
  background-image: url('@/assets/images/halloween-treasure-2024/reward-crab.png');
}
.crab1 {
  left: 26px;
  top: 34px;
}
.crab2 {
  left: 729px;
  top: 381px;
}
.pumpkin_crab {
  position: absolute;
  left: 1003px;
  top: 145px;
  width: 245px;
  height: 198px;
  background-image: url('@/assets/images/halloween-treasure-2024/reward-pumpkin_crab.png');
}
.cat {
  position: absolute;
  left: 1429px;
  top: 370px;
  width: 257px;
  height: 321px;
  background-image: url('@/assets/images/halloween-treasure-2024/reward-cat.png');
}
.candy {
  position: absolute;
  width: 115px;
  height: 155px;
  background-image: url('@/assets/images/halloween-treasure-2024/reward-candy.png');
}
.candy1 {
  left: 725px;
  top: 32px;
}
.candy2 {
  left: 1430px;
  top: 32px;
}
.candy3 {
  left: 22px;
  top: 516px;
}
.candy4 {
  left: 1150px;
  top: 516px;
}
.spider-web {
  position: absolute;
  width: 124px;
  height: 118px;
  background-image: url('@/assets/images/halloween-treasure-2024/spider-web.png');
}
</style>
