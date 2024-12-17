<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="dice-store flex h-screen">
      <div class="dice-store-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1
            class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            喜遇商店
            <div
              class="date-help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 阳光总数 -->
            <div
              class="token-count-container flex items-center bg-contain bg-center bg-no-repeat"
            >
              <div class="token-img bg-contain bg-center bg-no-repeat"></div>
              <span id="count">0</span>
              <div
                id="launchToken"
                class="bg-contain bg-center bg-no-repeat"
              ></div>
            </div>
            <!-- 商品列表-一般兑换 -->
            <ul class="store-list flex flex-row flex-wrap">
              <li
                v-for="(item, index) in storeList.slice(0, 6)"
                :key="item.id"
                :class="[
                  'store-item bg-contain bg-center bg-no-repeat',
                  `store-${index + 1}`,
                  item.remaining_amount > 0 ? 'enable' : 'disable',
                ]"
                @click="handleExchange(item)"
              >
                <div class="cup-content bg-contain bg-center bg-no-repeat">
                  <div
                    v-if="item.remaining_amount <= 0"
                    class="sell-out bg-contain bg-center bg-no-repeat"
                  ></div>
                  <p class="exchange">
                    <span class="exchange-count">{{
                      item.remaining_amount
                    }}</span>
                  </p>
                </div>
              </li>
            </ul>
            <!-- 商品列表-特殊兑换 -->
            <ul class="store-list-special">
              <li
                v-for="(item, index) in storeList.slice(6, 8)"
                :key="item.id"
                :class="[
                  'store-item-special bg-contain bg-center bg-no-repeat',
                  `store-${index + 7}`,
                  item.remaining_amount > 0 ? 'enable' : 'disable',
                ]"
                @click="handleExchange(item)"
              >
                <div class="cup-content bg-contain bg-center bg-no-repeat">
                  <div
                    v-if="item.remaining_amount <= 0"
                    class="sell-out bg-contain bg-center bg-no-repeat"
                  ></div>
                  <p class="exchange-special">
                    <span class="exchange-count">{{
                      item.remaining_amount
                    }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </Transition>
        <footer class="footer bg-contain bg-center bg-no-repeat"></footer>
      </div>
      <!-- 活动规则说明 -->
      <ModalHelp ref="modalHelp" />
      <!-- 兑换弹框 -->
      <activity-modal ref="modalReward" class="reward-box">
        <template #content>
          <div class="confirm-get-reward-modal-content flex h-[500px] flex-col">
            <div>
              <div
                v-if="
                  curRewards[0].name === '蟹蟹的士' ||
                  curRewards[0].name === '遥鲲飞机'
                "
                class="reward-title mt-8"
              >
                <p>
                  是否用<span class="text-[#ffcb4d]"
                    >蜡烛*{{
                      curRewards[0].name === '蟹蟹的士' ? '3' : '6'
                    }}</span
                  >兑换{{ curRewards[0].name }}？
                </p>
                <p>
                  （使用后可以在活动棋盘上以<span class="text-[#ffcb4d]">{{
                    curRewards[0].name === '蟹蟹的士' ? '随机步数' : '指定步数'
                  }}</span
                  >进行移动）
                </p>
              </div>
              <p v-else class="reward-title mt-8">
                是否兑换“{{ curRewards[0].name }}”？
              </p>
            </div>
            <div class="flex flex-1 items-center justify-center">
              <div class="flex items-center justify-around">
                <ul
                  :class="[
                    'reward-list flex w-full items-center justify-around',
                    `reward-list_${curRewards.length}`,
                  ]"
                >
                  <li
                    class="reward-item flex flex-col items-center justify-between"
                    v-for="item in curRewards"
                    :key="item.img"
                  >
                    <div
                      class="reward-img-wrap flex items-center justify-center"
                    >
                      <img
                        class="reward-img"
                        :src="handleSrc(item.img)"
                        alt="reward"
                      />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="relative z-10 mt-4 flex justify-around">
            <button
              class="btn btn-cancel rounded-md text-white"
              type="button"
              @click="handleCancel"
            >
              我再想想
            </button>
            <button
              class="btn btn-confirm rounded-md text-white"
              type="button"
              @click="handleConfirm"
            >
              确认
            </button>
          </div>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData } from '@/utils/request'
import { purchaseSpriteToken } from '@/apis/purchase'
import {
  type StoreItem,
  type DesignConfig,
  type EventName,
  TokenNameEnum,
} from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useActivityStore as useDiceStore } from '@/stores/diceStore'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import MotionPathPlugin from 'gsap/MotionPathPlugin'
import ModalHelp from '@/views/DiceMap/components/ModalHelp.vue'
import gsap from 'gsap'
import { animateCSS } from '@/utils/utils'
import throttle from 'lodash.throttle'
const rewardMap = {
  0: [
    {
      name: '爱心',
      img: 'heart',
    },
  ],
  1: [
    {
      name: '彩虹尾迹',
      img: 'trail_rainbow',
    },
  ],
  2: [
    {
      name: '体型重塑',
      img: 'resize_potion',
    },
  ],
  3: [
    {
      name: '光能药剂',
      img: 'energy_potion',
    },
  ],
  4: [
    {
      name: '漂浮',
      img: 'gravity',
    },
  ],
  5: [
    {
      name: '随机颜色尾迹',
      img: 'trail_random',
    },
  ],
  6: [
    {
      name: '蟹蟹的士',
      img: 'random_dice',
    },
  ],
  7: [
    {
      name: '遥鲲飞机',
      img: 'custom_dice',
    },
  ],
}

const curRewards = ref(rewardMap['0'])

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

const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const diceStore = useDiceStore()
const EVENT_NAME = 'activitycenter_dice_store' as EventName
// 活动数据
const activityDataStore = computed(() => diceStore.activityData)
// 商店列表状态
const storeList = computed(() => {
  return activityDataStore.value.sprite_exchange_store.store_list
})
// 当前兑换项
const curItem = ref<StoreItem>({ remaining_amount: 3, price: 50, id: 0 })
const sessionIsVisitedKey = 'isVisitedDiceStore'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.open()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT_NAME })
    .then((res) => {
      diceStore.updateActivityData(res.data)
      console.log('activityDataStore.value', activityDataStore.value)
      console.log(targetNum.value)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

const targetNum = computed(() => {
  return activityDataStore.value.token_info[TokenNameEnum.DiceStore]
})
// const updateStoreToken = (value: number): void => {
//   targetNum.value = value
// }
const updateTokenAndStartRollingText = (): void => {
  // updateStoreToken(1)
  const countElement = document.getElementById('count') as HTMLElement
  // 使用 GSAP 动画
  gsap.to(countElement, {
    innerText: targetNum.value,
    duration: 1,
    snap: { innerText: 1 }, // 确保为整数
    ease: 'linear',
    onUpdate: function () {
      countElement.innerText = Math.floor(
        this.targets()[0].innerText,
      ).toString()
    },
  })
}
watch(
  targetNum,
  () => {
    void nextTick(() => {
      updateTokenAndStartRollingText()
    })
  },
  {
    immediate: true,
  },
)

gsap.registerPlugin(MotionPathPlugin)
function launchTokenToReward(
  rewardItem: StoreItem,
  tokenDom: HTMLElement,
): void {
  const tokenDomRect = tokenDom.getBoundingClientRect()
  const storeRewardItemDomClass = `.store-${rewardItem.id + 1}`
  const storeRewardItemDom = document.querySelector(
    storeRewardItemDomClass,
  ) as HTMLElement
  const storeRewardItemDomRect = storeRewardItemDom.getBoundingClientRect()
  const mainContainerDom = document.querySelector(
    '.dice-store-main',
  ) as HTMLElement
  const mainContainerRect = mainContainerDom.getBoundingClientRect()

  updateTokenAndStartRollingText()
  gsap.to(tokenDom, {
    duration: 0.7,
    ease: 'power1.inOut',
    opacity: 1,
    startAt: { x: 0, y: 0, opacity: 1, scale: 1 },
    motionPath: {
      path: [
        // 居中配置
        {
          x: mainContainerRect.left,
          y: mainContainerRect.height * 0.75,
          scale: 1,
        },
        {
          x:
            storeRewardItemDomRect.left -
            mainContainerRect.left +
            storeRewardItemDomRect.width / 2 -
            tokenDomRect.width,
          y:
            storeRewardItemDomRect.top -
            mainContainerRect.top +
            storeRewardItemDomRect.height / 2 -
            tokenDomRect.height,
          scale: 0.5,
        },
      ],
      autoRotate: false,
    },
    onComplete: () => {
      gsap.set(tokenDom, { opacity: 0 })
      void animateCSS(
        storeRewardItemDomClass,
        'animate__jackInTheBox',
        undefined,
        'faster',
      )
      const tokenCountContainer = document.querySelector(
        '.token-count-container',
      ) as HTMLElement
      tokenCountContainer.removeChild(tokenDom)
    },
  })
}

const launchTokenWithTrail = (
  storeRewardItem: StoreItem,
  trailItemCount = 5,
): void => {
  const trailDom = document.querySelector('#launchToken')
  for (let i = 0; i < trailItemCount; i++) {
    const newDom = trailDom?.cloneNode() as HTMLElement
    const tokenCountContainer = document.querySelector(
      '.token-count-container',
    ) as HTMLElement
    tokenCountContainer.appendChild(newDom)
    const timer = setTimeout(() => {
      launchTokenToReward(storeRewardItem, newDom)
      clearTimeout(timer)
    }, i * 100)
  }
}

const startRewardAnimate = (storeRewardItem: StoreItem): void => {
  launchTokenWithTrail(storeRewardItem)
}

const triggerReward = throttle(
  (storeRewardItem: StoreItem): void => {
    startRewardAnimate(storeRewardItem)
  },
  500,
  { leading: true, trailing: false },
)

// 兑换奖励
function handleExchange(item: StoreItem): void {
  if (item.remaining_amount <= 0) {
    return
  }
  curRewards.value = rewardMap[item.id as keyof typeof rewardMap]
  modalReward.value?.openModal()
  curItem.value = item
}

// 取消
function handleCancel(): void {
  modalReward.value?.closeModal()
}

// 确认
function handleConfirm(): void {
  purchaseSpriteToken({
    id: Number(curItem.value.id),
    remainingAmount: curItem.value.remaining_amount,
    storeCurrencyCount:
      curItem.value.id < 6
        ? activityDataStore.value.token_info[TokenNameEnum.DiceStore]
        : -1,
    storeEvent: EVENT_NAME,
  })
    .then((res) => {
      // code = 200 的错误
      const errorMap = {
        fail: '服务器异常，请稍后重试',
        'not enough store currency':
          curItem.value.id < 6 ? '代币不足，不可兑换' : '蜡烛不足，不可兑换',
        'existing unlock': '已拥有该物品，不可兑换',
        'old data': '兑换发生错误，请稍后重试',
        'exceed limit': '剩余可兑换数量不足',
      }
      if (res.msg !== 'ok') {
        showToast(errorMap[res.msg as keyof typeof errorMap])
        return
      }
      modalReward.value?.closeModal()
      // showToast('兑换奖励成功')
      const propNum = Number(Object.values(res.data.rewards)[0])
      const propCodeName = Object.keys(res.data.rewards)[0]
      let propName = ''
      if (curRewards.value[0].name !== '随机颜色尾迹') {
        propName = curRewards.value[0].name
      } else {
        const rewardNameWithCodeNameList = [
          { propCodeName: 'trail_aquamarine', propName: '海蓝尾迹' },
          { propCodeName: 'trail_black', propName: '黑色尾迹' },
          { propCodeName: 'trail_blue', propName: '淡蓝尾迹' },
          { propCodeName: 'trail_cyan', propName: '青色尾迹' },
          { propCodeName: 'trail_green', propName: '绿色尾迹' },
          { propCodeName: 'trail_magenta', propName: '桃红尾迹' },
          { propCodeName: 'trail_orange', propName: '橙色尾迹' },
          { propCodeName: 'trail_pink', propName: '粉红尾迹' },
          { propCodeName: 'trail_purple', propName: '紫色尾迹' },
          { propCodeName: 'trail_red', propName: '红色尾迹' },
          { propCodeName: 'trail_yellow', propName: '黄色尾迹' },
        ]
        const propInfo = rewardNameWithCodeNameList.find(
          (e) => e.propCodeName === propCodeName,
        )
        propName = propInfo?.propName as string
      }
      showToast(`奖励兑换成功，您获得了 ${propName} * ${propNum}`)
      if (curItem.value.id < 6) {
        triggerReward(curItem.value)
      }
      // 更新活动数据
      const result = res.data
      if (curItem.value.id < 6) {
        activityDataStore.value.token_info[TokenNameEnum.DiceStore] =
          result.token_count
      }
      const storeList =
        activityDataStore.value.sprite_exchange_store.store_list.map((item) => {
          return {
            ...item,
            remaining_amount:
              item.id === result.id
                ? result.remaining_amount
                : item.remaining_amount,
          }
        })
      activityDataStore.value.sprite_exchange_store.store_list = storeList
    })
    .catch((error) => {
      showToast(error.message)
    })
}

const initAnimate = (): void => {
  const storeItemDomList = document.querySelectorAll('.store-item')
  const storeItemSpecialDomList = document.querySelectorAll(
    '.store-item-special',
  )
  storeItemDomList.forEach((item) => {
    void animateCSS(item, 'animate__bounceIn', undefined, 'faster')
  })
  storeItemSpecialDomList.forEach((item) => {
    void animateCSS(item, 'animate__bounceIn', undefined, 'faster')
  })
}

onMounted(() => {
  try {
    initAnimate()
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})
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
.dice-store {
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
    background-image: url('@/assets/images/dice-store/bg.jpg');
  }
}
.title {
  position: absolute;
  top: 274px;
  left: 47px;
  width: 588px;
  height: 228px;
  background-image: url('@/assets/images/dice-store/title.png');
}
.date-help {
  position: absolute;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  top: -2px;
  left: 476px;
  // border: 1px solid red;
}
.store-list {
  position: absolute;
  left: 707px;
  top: 188px;
  width: 974px;
  height: 774px;
}
.store-item {
  position: relative;
  margin: 0 23px 33px 0;
  width: 277px;
  height: 381px;
}
.store-list-special {
  position: absolute;
  left: 1619px;
  top: 170px;
  width: 837px;
  height: 774px;
}
.store-item-special {
  position: relative;
  width: 278px;
  height: 400px;
  margin-bottom: 13px;
}
@for $i from 1 through 8 {
  .store-#{$i} {
    @if ($i >= 7) {
      & .cup-content {
        width: 190px;
        height: 214px;
        position: absolute;
        top: 155px;
        left: 48px;
      }
      &.disable {
        background-image: url('@/assets/images/dice-store/lg-disable.png');
        .cup-content {
          background-image: url('@/assets/images/dice-store/task#{$i}-disable.png');
          .exchange-count {
            color: #dae6eb;
          }
          .sell-out {
            width: 121px;
            height: 122px;
            position: absolute;
            top: -20px;
            left: 34px;
            background-image: url('@/assets/images/dice-store/sell-out.png');
          }
        }
      }
      &.enable {
        background-image: url('@/assets/images/dice-store/lg-enable.png');
        .exchange-count {
          color: #b4c2ee;
        }
        .cup-content {
          background-image: url('@/assets/images/dice-store/task#{$i}-enable.png');
        }
      }
    } @else {
      & .cup-content {
        width: 190px;
        height: 214px;
        position: absolute;
        top: 125px;
        left: 43px;
      }
      &.disable {
        width: 250px;
        height: 381px;
        margin-right: 40px;
        margin-left: 13px;
        background-image: url('@/assets/images/dice-store/sm-disable.png');
        .cup-content {
          left: 33px;
          background-image: url('@/assets/images/dice-store/task#{$i}-disable.png');
          .exchange-count {
            color: #dae6eb;
          }
          .sell-out {
            width: 121px;
            height: 122px;
            position: absolute;
            top: -20px;
            left: 34px;
            background-image: url('@/assets/images/dice-store/sell-out.png');
          }
        }
      }
      &.enable {
        background-image: url('@/assets/images/dice-store/sm-enable.png');
        .cup-content {
          background-image: url('@/assets/images/dice-store/task#{$i}-enable.png');
          .exchange-count {
            color: #b4c2ee;
          }
        }
      }
    }
  }
}
.exchange {
  position: absolute;
  bottom: 31px;
  width: 100%;
  text-align: center;
  font-size: 34px;
  line-height: 1;
  color: #fff;
  &.active {
    color: #e4d492;
  }
  .exchange-count {
    position: absolute;
    right: 20px;
    color: #b4c2ee;
    display: inline-block;
    width: 36px;
  }
}
.exchange-special {
  position: absolute;
  bottom: 31px;
  width: 100%;
  text-align: center;
  font-size: 34px;
  line-height: 1;
  color: #fff;
  &.active {
    color: #e4d492;
  }
  .exchange-count {
    position: absolute;
    right: 30px;
    color: #b4c2ee;
  }
}
.token-count-container {
  position: absolute;
  left: 60px;
  top: 52px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 204px;
  height: 51px;
  font-size: 45px;
  font-weight: 500;
  color: #ffffff;
  background-image: url('@/assets/images/dice-store/token-count-container-bg.png');
  .token-img {
    position: absolute;
    top: -10px;
    left: 14px;
    width: 37px;
    height: 57px;
    background-image: url('@/assets/images/dice-store/token-img.png');
  }
  #launchToken {
    position: absolute;
    top: -10px;
    left: 14px;
    width: 37px;
    height: 57px;
    opacity: 0;
    background-image: url('@/assets/images/dice-store/token-img.png');
  }
  #count {
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 45px;
  }
}
.footer {
  width: 913px;
  height: 80px;
  position: absolute;
  left: 1022px;
  top: 1020px;
  text-align: center;
  font-size: 34px;
  color: #fff;
  backdrop-filter: blur(4px);
  border-radius: 20px;
  background-image: url('@/assets/images/dice-store/activity-tip.png');
}
.btn {
  width: 340px;
  height: 94px;
  font-size: 40px;
  &-cancel {
    background: #74d2ee;
  }
  &-confirm {
    background: #ffcb4d;
  }
}
.reward-box {
  text-align: center;
}
.reward-title {
  font-size: 40px;
  color: #454545;
  letter-spacing: 1px;
}
.reward-list {
  &_1 {
    width: 80%;
    .reward-item {
      height: 200px;
    }
    .reward-img {
      width: 200px;
    }
  }
}
.confirm-get-reward-modal-content {
  font-size: 36px;
  color: #696969;
  padding: 0 20px 0;
}
.reward-img {
  width: 100px;
}
.reward-img-wrap {
  width: 100%;
  height: 200px;
}
</style>
