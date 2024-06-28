<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="friendship flex h-screen">
      <div class="friendship-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              养分补给
            </h1>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 阳光总数 -->
            <div
              class="sunlight flex items-center bg-contain bg-center bg-no-repeat"
            >
              <span>{{ activityDataStore.token_info.sunlight_token }}</span>
            </div>
            <!-- 商品列表-一般兑换 -->
            <ul class="store-list flex flex-row flex-wrap">
              <li
                v-for="(item, index) in storeList.slice(0, 6)"
                :key="item.id"
                :class="[
                  'store-item bg-contain bg-center bg-no-repeat',
                  `store-${index + 1}`,
                  item.remaining_amount > 0 ? 'can' : 'wait',
                ]"
                @click="handleExchange(item)"
              >
                <p class="exchange">
                  <span>可兑换：</span
                  ><span class="exchange-count">{{
                    item.remaining_amount
                  }}</span>
                </p>
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
                  item.remaining_amount > 0 ? 'can' : 'wait',
                ]"
                @click="handleExchange(item)"
              >
                <p class="exchange">
                  <span>可兑换：</span
                  ><span class="exchange-count">{{
                    item.remaining_amount
                  }}</span>
                </p>
                <div
                  v-if="hasLock(item, index)"
                  class="overlay flex items-center justify-center"
                >
                  <div
                    class="overlay-wrap mt-5 flex flex-col items-center justify-between text-center"
                  >
                    <img
                      class="overlay-icon"
                      src="@/assets/images/friendship-store-2024/lock.png"
                      alt="lock"
                    />
                    <p class="overlay-text" v-if="index === 0">
                      向友葵成长至第二阶段
                    </p>
                    <p class="overlay-text" v-else>向友葵成长至第四阶段</p>
                  </div>
                </div>
              </li>
            </ul>
          </section>
        </Transition>
        <footer class="footer bg-no-repeat">
          8月28日0:00未使用的阳光将被清零，请及时兑换奖励！
        </footer>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年7月17日~2024年8月27日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            1、活动期间，通过每日礼物、每日任务、每周惊喜可获得<span
              class="text-[#ffcb4d]"
              >阳光</span
            >；
          </p>
          <p class="modal-text">
            2、使用阳光可呵护向友葵（每次固定消耗100点），向友葵成长至四个阶段时可解锁对应的奖励；
          </p>
          <p class="modal-text">3、使用阳光可在养分补给页面兑换各种道具；</p>
          <p class="modal-text">
            4、当向友葵成长至第二阶段和第四阶段时，养分补给页面会解锁<span
              class="text-[#ffcb4d]"
              >有友节专属外观兑换</span
            >，可使用<span class="text-[#ffcb4d]">爱心</span>进行兑换。
          </p>
        </template>
      </activity-modal>
      <!-- 兑换弹框 -->
      <activity-modal ref="modalReward" class="reward-box">
        <template #content>
          <p class="reward-title mt-4">是否兑换“{{ curRewards[0].name }}”</p>
          <div class="flex items-center justify-around">
            <ul
              :class="[
                'reward-list mt-6 flex w-full items-center justify-around',
                `reward-list_${curRewards.length}`,
              ]"
            >
              <li
                class="reward-item flex flex-col items-center justify-between"
                v-for="item in curRewards"
                :key="item.img"
              >
                <div class="reward-img-wrap flex items-center justify-center">
                  <img
                    class="reward-img"
                    :src="handleSrc(item.img)"
                    alt="reward"
                  />
                </div>
              </li>
            </ul>
          </div>
        </template>
        <template #footer>
          <div class="relative z-10 -mt-10 flex justify-around">
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
import { type StoreItem, type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useActivityStore as useStoreFriendshipStore } from '@/stores/friendshipStore2024'
import { useActivityStore as useStoreFriendshipMain } from '@/stores/friendshipMain2024'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

const rewardMap = {
  0: [
    {
      name: '爱心',
      img: 'heart',
    },
  ],
  1: [
    {
      name: '体型重塑',
      img: 'resize_potion',
    },
  ],
  2: [
    {
      name: '向日葵花盘装扮魔法',
      img: 'outfit_horn_sunflower_headwear',
    },
  ],
  3: [
    {
      name: '秋千',
      img: 'swing',
    },
  ],
  4: [
    {
      name: '元气满满',
      img: 'energy',
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
      name: '向日葵发饰',
      img: 'CharSkyKid_Horn_SunflowerHeadband',
    },
  ],
  7: [
    {
      name: '有友向日葵',
      img: 'CharSkyKid_Prop_Sunflower',
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

const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

const storeFriendshipStore = useStoreFriendshipStore()
const storeFriendshipMain = useStoreFriendshipMain()
// 活动数据
const activityDataStore = computed(() => storeFriendshipStore.activityData)
const activityDataMain = computed(() => storeFriendshipMain.activityData)
// 商店列表状态
const storeList = computed(() => {
  return activityDataStore.value.sprite_exchange_store.store_list
})
// 当前兑换项
const curItem = ref<StoreItem>({ remaining_amount: 5, price: 100, id: 0 })
// 向日葵成长进度
const progress = computed(() => {
  const stages =
    activityDataMain.value.event_data.activitycenter_main_friendship_2024[1]
      .stages
  const value =
    activityDataMain.value.event_data.activitycenter_main_friendship_2024[1]
      .value
  return stages.filter((item: number) => item <= value).length
})
console.log('progress: ', progress.value)

const isVisited = Session.get('isVisitedFriendshipStore2024')
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
    getActivityData()
    getFriendshipMainData()
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedFriendshipStore2024', true)
})

// 显示帮助
function handleHelp(): void {
  modalHelp.value?.openModal()
}

// 处理 img src
function handleSrc(name: string): string {
  const imgSrc = new URL(
    `../../assets/images/common/reward/reward-${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
}

// 是否未解锁状态
function hasLock(item: StoreItem, index: number): boolean {
  if (item.remaining_amount === 0) {
    return false
  }
  if (index === 0) {
    return progress.value < 2
  } else {
    return progress.value < 4
  }
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activitycenter_store_friendship_2024' })
    .then((res) => {
      storeFriendshipStore.updateActivityData(res.data)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 获取向日葵的成长进度
function getFriendshipMainData(): void {
  getPlayerMissionData({ event: 'activitycenter_main_friendship_2024' })
    .then((res) => {
      storeFriendshipMain.updateActivityData(res.data)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 兑换奖励
function handleExchange(item: StoreItem): void {
  if (item.remaining_amount <= 0) {
    return
  }
  // 商品7
  if (item.id === 6 && progress.value < 2) {
    return
  }
  // 商品8
  if (item.id === 7 && progress.value < 4) {
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
        ? (activityDataStore.value.token_info.sunlight_token as number)
        : -1,
    storeEvent: 'activitycenter_store_friendship_2024',
  })
    .then((res) => {
      // code = 200 的错误
      const errorMap = {
        fail: '服务器错误',
        'not enough store currency': '货币不足',
        'existing unlock': '商品已存在，不可兑换',
        'old data': '当前货币数量或者库存数量参数和实际不同',
        'exceed limit': '剩余可兑换数量不足',
      }
      if (res.msg !== 'ok') {
        showToast(errorMap[res.msg as keyof typeof errorMap])
        return
      }
      modalReward.value?.closeModal()
      showToast('兑换奖励成功')
      // 更新活动数据
      const result = res.data
      if (curItem.value.id < 6) {
        activityDataStore.value.token_info.sunlight_token = result.token_count
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
.friendship {
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
    background-image: url('@/assets/images/friendship-store-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 33px;
  top: 199px;
  width: 667px;
}
.title {
  width: 667px;
  height: 358px;
  background-image: url('@/assets/images/friendship-store-2024/title.png');
}
.help {
  position: absolute;
  right: 106px;
  top: -31px;
  width: 63px;
  height: 91px;
  background-image: url('@/assets/images/friendship-store-2024/help.png');
}
.store-list {
  position: absolute;
  left: 716px;
  top: 208px;
  width: 874px;
  height: 774px;
}
.store-item {
  position: relative;
  margin: 0 36px 33px 0;
  width: 255px;
  height: 354px;
}
.store-list-special {
  position: absolute;
  left: 1589px;
  top: 170px;
  width: 837px;
  height: 774px;
}
.store-item-special {
  position: relative;
  width: 281px;
  height: 392px;
  margin-bottom: 33px;
}
@for $i from 1 through 8 {
  .store-#{$i} {
    &.wait {
      background-image: url('@/assets/images/friendship-store-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/friendship-store-2024/task#{$i}-can.png');
    }
  }
}
.exchange {
  position: absolute;
  bottom: 6px;
  width: 100%;
  text-align: center;
  font-size: 34px;
  line-height: 1;
  color: #fff;
  &.active {
    color: #e4d492;
  }
}
.overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);

  &-wrap {
    width: 180px;
    height: 136px;
  }

  &-icon {
    width: 40px;
    height: 55px;
  }

  &-text {
    color: #fff;
    font-size: 30px;
    line-height: 36px;
  }
}
.sunlight {
  position: absolute;
  left: 22px;
  top: 23px;
  padding: 0 20px 0 110px;
  width: 296px;
  height: 82px;
  line-height: 82px;
  font-size: 45px;
  font-weight: 500;
  color: #7b6d8d;
  background-image: url('@/assets/images/friendship-store-2024/sunlight-bg.png');
}
.footer {
  position: absolute;
  right: 120px;
  bottom: 44px;
  padding-right: 40px;
  height: 81px;
  line-height: 81px;
  text-align: center;
  font-size: 34px;
  color: #fff;
  background-size: 43px 81px;
  background-position: right center;
  background-image: url('@/assets/images/friendship-store-2024/star.png');
}
.btn {
  width: 340px;
  height: 94px;

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
.reward-img {
  width: 100px;
}
.reward-img-wrap {
  width: 100%;
  height: 200px;
}
</style>
