<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="friendship flex h-screen">
      <div class="friendship-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <div class="header flex">
            <h1
              class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              向友葵的每日礼物 7.17-8.27
            </h1>
            <div
              class="help bg-contain bg-center bg-no-repeat"
              @click="handleHelp"
            ></div>
          </div>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section>
            <!-- 签到列表 -->
            <ul class="sign-list">
              <li
                :class="['sign-item', { signed: item.signed }]"
                v-for="item in taskList"
                :key="item.id"
                @click="handleReward(item.id, item.signed)"
              >
                <div
                  v-if="item.signed"
                  class="sign-item-wrap flex flex-col items-center justify-center"
                >
                  <div class="sunlight-icon bg-contain"></div>
                  <p class="sunlight-count">
                    <span class="sunlight-count-label">X</span
                    >{{ item.sunlightCount }}
                  </p>
                  <div class="checked bg-contain"></div>
                </div>
                <div v-else class="sign-item-star"></div>
              </li>
            </ul>
          </section>
        </Transition>
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
      <!-- 奖励弹框 -->
      <activity-modal ref="modalReward">
        <template #content>
          <p class="modal-text">
            恭喜你获得
            <span class="modal-text-blue"
              >{{ rewardsText[curRewards.name as keyof RewardsName] }} *
              {{ curRewards.count }}</span
            >：
          </p>
          <div class="mt-10 flex items-center justify-center">
            <img
              width="80"
              height="80"
              class="modal-reward"
              :src="rewardImageSrc"
              alt="reward"
            />
          </div>
        </template>
      </activity-modal>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import { getPlayerMissionData, claimMissionReward } from '@/utils/request'
import { type DesignConfig } from '@/types'
import { Session } from '@/utils/storage'
import ActivityModal from '@/components/Modal'
import { useMenuStore } from '@/stores/menu'
import { useActivityStore } from '@/stores/friendshipSign2024'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

interface Rewards {
  name: string
  count: number
}
interface RewardsName {
  sunlight_token: string
}
const rewardsText: RewardsName = {
  sunlight_token: '阳光',
}
const curRewards: Ref<Rewards> = ref({
  name: 'sunlight_token',
  count: 10,
})

const TASK_LIST = [
  {
    id: 1,
    sunlightCount: 10,
  },
  {
    id: 2,
    sunlightCount: 10,
  },
  {
    id: 3,
    sunlightCount: 20,
  },
  {
    id: 4,
    sunlightCount: 10,
  },
  {
    id: 5,
    sunlightCount: 10,
  },
  {
    id: 6,
    sunlightCount: 30,
  },
  {
    id: 7,
    sunlightCount: 10,
  },
  {
    id: 8,
    sunlightCount: 20,
  },
  {
    id: 9,
    sunlightCount: 10,
  },
  {
    id: 10,
    sunlightCount: 10,
  },
  {
    id: 11,
    sunlightCount: 10,
  },
  {
    id: 12,
    sunlightCount: 30,
  },
  {
    id: 13,
    sunlightCount: 10,
  },
  {
    id: 14,
    sunlightCount: 20,
  },
  {
    id: 15,
    sunlightCount: 10,
  },
  {
    id: 16,
    sunlightCount: 10,
  },
  {
    id: 17,
    sunlightCount: 10,
  },
  {
    id: 18,
    sunlightCount: 20,
  },
  {
    id: 19,
    sunlightCount: 10,
  },
  {
    id: 20,
    sunlightCount: 10,
  },
  {
    id: 21,
    sunlightCount: 10,
  },
  {
    id: 22,
    sunlightCount: 20,
  },
  {
    id: 23,

    sunlightCount: 10,
  },
  {
    id: 24,
    sunlightCount: 10,
  },
  {
    id: 25,
    sunlightCount: 10,
  },
  {
    id: 26,
    sunlightCount: 10,
  },
  {
    id: 27,
    sunlightCount: 20,
  },
  {
    id: 28,
    sunlightCount: 10,
  },
  {
    id: 29,
    sunlightCount: 20,
  },
  {
    id: 30,
    sunlightCount: 10,
  },
  {
    id: 31,
    sunlightCount: 20,
  },
  {
    id: 32,
    sunlightCount: 30,
  },
  {
    id: 33,
    sunlightCount: 10,
  },
  {
    id: 34,
    sunlightCount: 10,
  },
  {
    id: 35,
    sunlightCount: 10,
  },
  {
    id: 36,
    sunlightCount: 10,
  },
]

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

const EVENT = 'activitycenter_sign_friendship_2024'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)
const menuStore = useMenuStore()
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
const task = computed(() => activityData.value.event_data[EVENT][0])
const isTodaySigned = computed(() => task.value.award[0] === 1)
const isRewardImageLoaded = ref(false)
const rewardImageSrc = ref(handleSrc(String(curRewards.value.name)))
const taskList = computed(() => {
  return TASK_LIST.map((item) => {
    return {
      ...item,
      signed: task.value.awarded_types.includes(item.id),
    }
  })
})

const isVisited = Session.get('isVisitedFriendshipSign2024')
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
  Session.set('isVisitedFriendshipSign2024', true)
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

// 预加载图片
function preLoadImage(src: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      resolve()
    }
  })
}

// 获取任务进度
function getActivityData(): void {
  getPlayerMissionData({ event: EVENT })
    .then((res) => {
      activityStore.updateActivityData(res.data)
      menuStore.updateMenuDataByIsClaimedReward(EVENT, isTodaySigned.value)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 签到
function handleReward(id: number, signed: boolean): void {
  if (signed) {
    return
  }
  if (isTodaySigned.value) {
    showToast('今日已完成，请明天再来')
    return
  }
  claimMissionReward({
    event: EVENT,
    task: `${EVENT}_m1`,
    rewardId: 1,
    expect: `friendship_2024_${id}`,
  })
    .then(async (res) => {
      const rewards = res.data.rewards
      curRewards.value = {
        name: Object.keys(rewards)[0],
        count: Number(Object.values(rewards)[0]),
      }
      // 让图片先加载再展示
      isRewardImageLoaded.value = false
      rewardImageSrc.value = handleSrc(String(curRewards.value.name))
      await preLoadImage(rewardImageSrc.value)
      isRewardImageLoaded.value = true
      modalReward.value?.openModal()

      // 更新页面数据
      activityData.value.event_data[EVENT][0].award[0] = 1
      activityData.value.event_data[EVENT][0].awarded_types.push(id)
      activityStore.updateActivityData(activityData.value)
      menuStore.updateMenuDataByIsClaimedReward(EVENT, isTodaySigned.value)
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
    background-image: url('@/assets/images/friendship-sign-2024/bg.jpg');
  }
}
.header {
  position: relative;
  left: 412px;
  top: 17px;
  width: 1327px;
}
.title {
  width: 1268px;
  height: 203px;
  background-image: url('@/assets/images/friendship-sign-2024/title.png');
}
.help {
  position: absolute;
  right: 0;
  top: 89px;
  width: 51px;
  height: 74px;
  background-image: url('@/assets/images/friendship-sign-2024/help.png');
}
.sign-list {
  position: absolute;
  top: 230px;
  left: 50%;
  transform: translateX(-50%);
  width: 1858px;
}
.sign-item {
  position: relative;
  float: left;
  width: 206px;
  height: 220px;
  border-left: 4px solid rgba(255, 255, 255, 0.45);
  border-top: 4px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.4);

  &:nth-of-type(9n) {
    border-right: 4px solid rgba(255, 255, 255, 0.45);
  }

  &:nth-of-type(n + 28):nth-of-type(-n + 36) {
    border-bottom: 4px solid rgba(255, 255, 255, 0.45);
  }

  &:nth-of-type(1) {
    border-top-left-radius: 20px;
  }

  &:nth-of-type(9) {
    border-top-right-radius: 20px;
  }

  &:nth-of-type(28) {
    border-bottom-left-radius: 20px;
  }

  &:nth-of-type(36) {
    border-bottom-right-radius: 20px;
  }

  &-star {
    width: 100%;
    height: 100%;
    background: url('@/assets/images/friendship-sign-2024/star.png') no-repeat
      center/104px 106px rgba(148, 148, 148, 0.3);
  }

  &-wrap {
    width: 100%;
    height: 100%;
  }

  &.signed {
    background: none;
  }
}
.sunlight-icon {
  width: 74px;
  height: 74px;
  background-image: url('@/assets/images/friendship-sign-2024/sunlight.png');
}
.sunlight-count {
  margin-top: 10px;
  color: #fff;
  font-size: 40px;
  font-weight: 500;

  &-label {
    font-size: 30px;
  }
}
.checked {
  position: absolute;
  right: 12px;
  bottom: 12px;
  width: 45px;
  height: 45px;
  background-image: url('@/assets/images/friendship-sign-2024/checked.png');
}
</style>
