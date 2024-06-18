<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="anniversary flex h-screen">
      <div class="anniversary-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              嘉年华商店
            </h1>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 礼花总数 -->
            <div class="fireworks flex items-center">
              <img
                class="fireworks-icon"
                src="@/assets/images/anniversary-store-2024/star.png"
                alt="star"
              />
              <span>{{ activityData.token_info.fireworks_token }}</span>
            </div>
            <!-- 商品列表 -->
            <ul class="store-list flex flex-row flex-wrap">
              <li
                v-for="(item, index) in storeList"
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
          </section>
        </Transition>
        <footer class="footer">
          7月15日0:00未使用的礼花将被清零，请及时兑换奖励！
        </footer>
      </div>
      <!-- 活动规则说明 -->
      <activity-modal ref="modalHelp">
        <template #content>
          <p class="modal-text">
            <span class="font-semibold">活动时间：</span
            >2024年6月29日~2024年7月14日
          </p>
          <p class="modal-text">
            <span class="font-semibold">活动内容：</span>
          </p>
          <p class="modal-text">
            活动期间内，玩家可使用获得的礼花兑换物品，物品拥有兑换次数限制：
          </p>
          <p class="modal-text">1、使用100礼花可兑换1个爱心，最多可兑换3个；</p>
          <p class="modal-text">
            2、使用100礼花可兑换1个周年庆抱枕试用魔法，最多可兑换3个；
          </p>
          <p class="modal-text">
            3、使用60礼花可兑换1个共享空间，最多可兑换3个；
          </p>
          <p class="modal-text">
            4、使用60礼花可兑换1个留影蜡烛，最多可兑换3个；
          </p>
          <p class="modal-text">
            5、使用60礼花可兑换1个筑巢季蜡烛，最多可兑换5个；
          </p>
          <p class="modal-text">
            6、使用30礼花可兑换1个浪漫烟花魔法，最多可兑换20个。
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
import {
  type PurchaseSpriteTokenRes,
  purchaseSpriteToken,
} from '@/apis/purchase'

import { type StoreItem, type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useActivityStore } from '@/stores/anniversaryStore2024'
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
      name: '周年庆抱枕魔法',
      img: 'outfit_prop_birthdayoreo',
    },
  ],
  2: [
    {
      name: '共享空间',
      img: 'sharedspace_candle',
    },
  ],
  3: [
    {
      name: '留影蜡烛',
      img: 'recording_candle',
    },
  ],
  4: [
    {
      name: '筑巢季蜡烛',
      img: 'season_candle',
    },
  ],
  5: [
    {
      name: '浪漫烟花',
      img: 'fireworks',
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

const activityStore = useActivityStore()
// 活动数据
const activityData = computed(() => activityStore.activityData)

// 商店列表状态
const storeList = computed(() => {
  return activityData.value.sprite_exchange_store.store_list
})
const curItem = ref<StoreItem>({ remaining_amount: 3, price: 100, id: 0 })

const isVisited = Session.get('isVisitedAnniversaryStore2024')
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
  } catch (error) {
    console.error(error)
  }
  Session.set('isVisitedAnniversaryStore2024', true)
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

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: 'activitycenter_anniversary_store_2024' })
    .then((res) => {
      // 更新缓存活动数据
      activityStore.updateActivityData(res.data)
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
    storeCurrencyCount: activityData.value.token_info.fireworks_token,
    storeEvent: 'activitycenter_anniversary_store_2024',
  })
    .then((res: PurchaseSpriteTokenRes) => {
      // code = 200 的错误
      const errorMap = {
        fail: '兑换失败',
        'not enough store currency': '货币不足',
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
      activityData.value.token_info.fireworks_token = result.token_count
      const storeList = activityData.value.sprite_exchange_store.store_list.map(
        (item) => {
          return {
            ...item,
            remaining_amount:
              item.id === result.id
                ? result.remaining_amount
                : item.remaining_amount,
          }
        },
      )
      activityData.value.sprite_exchange_store.store_list = storeList
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
.anniversary {
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
    background-image: url('@/assets/images/anniversary-store-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 657px;
  top: 57px;
  width: 732px;
}
.title {
  width: 732px;
  height: 529px;
  background-image: url('@/assets/images/anniversary-store-2024/title.png');
}
.help {
  position: absolute;
  right: 27px;
  top: 92px;
  width: 45px;
  height: 45px;
  background-image: url('@/assets/images/anniversary-store-2024/help.png');
}
.store-list {
  position: absolute;
  left: 50%;
  top: 475px;
  transform: translate(-50%);
  width: 1740px;
  height: 464px;
}
.store-item {
  position: relative;
  margin-right: 30px;
  width: 265px;
  height: 464px;

  &:last-of-type {
    margin-right: 0;
  }
}
@for $i from 1 through 6 {
  .store-#{$i} {
    &.wait {
      background-image: url('@/assets/images/anniversary-store-2024/task#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/anniversary-store-2024/task#{$i}-can.png');
    }
  }
}
.exchange {
  position: absolute;
  bottom: 15px;
  width: 100%;
  text-align: center;
  font-size: 34px;
  color: #fff;
  &.active {
    color: #e4d492;
  }
}
.fireworks {
  position: absolute;
  right: 160px;
  top: 356px;
  width: 204px;
  height: 52px;
  border-radius: 52px;
  line-height: 52px;
  font-size: 40px;
  font-weight: 500;
  color: #fff;
  background: rgba(59, 143, 194, 0.77);
  &-icon {
    margin: 0 20px;
    width: 48px;
    height: 47px;
  }
}
.footer {
  position: absolute;
  left: 50%;
  bottom: 72px;
  text-align: center;
  font-size: 40px;
  color: #fff;
  transform: translateX(-50%);
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
