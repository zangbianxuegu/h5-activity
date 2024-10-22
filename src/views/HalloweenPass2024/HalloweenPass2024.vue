<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="halloween flex h-screen">
      <div class="halloween-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <section>
            <h1
              class="title relative z-10 overflow-hidden bg-contain bg-no-repeat"
            >
              <div class="sr-only">
                魔法坩埚 惊喜无限
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
            <!-- 捣蛋币数 -->
            <div class="token">
              <div class="token-icon bg-cover"></div>
              <div class="token-count flex justify-center">
                {{ tokenCount }}
              </div>
            </div>
          </section>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="lottery absolute bottom-0 left-0 right-0 top-0">
            <div class="tips flex items-center justify-center bg-cover">
              <span v-if="isFirstLottery" class="text-[40px] text-[#fff29c]"
                >首次免费</span
              >
              <template v-else>
                <div class="tips-icon bg-cover"></div>
                <span class="tips-text text-[#fffae9]">100/次</span>
              </template>
            </div>
            <button
              type="button"
              class="btn bg-transparent bg-cover"
              @click="drawLottery"
            >
              <span class="sr-only">抽取礼物</span>
            </button>
          </section>
        </Transition>
        <!-- 活动规则弹框 -->
        <activity-modal ref="modalHelp">
          <template #content>
            <section
              class="h-[640px] overflow-auto px-4"
              aria-labelledby="activity-rules-title"
            >
              <h2 id="activity-rules-title" class="sr-only">活动规则</h2>
              <h3 class="modal-text mt-4">
                <span class="font-semibold">活动时间：</span>
                2024年10月26日~2024年11月15日
              </h3>
              <h3 class="modal-text">
                <span class="font-semibold">活动内容：</span>
              </h3>
              <p class="modal-text">
                活动期间，玩家可以使用免费抽奖次数进行一次抽奖
              </p>
              <p class="modal-text">
                活动期间，玩家可以使用100捣蛋币进行一次抽奖，将在如下奖励中随机抽取：
              </p>
              <p class="modal-text">
                蜡烛*3，爱心*1，体型重塑*2，彩虹尾迹*2，冥龙克星*2，螃蟹恶作剧*2，糖果恶作剧*2，蜡烛恶作剧*2，女巫长发试用魔法*1，枯叶斗篷试用魔法*1，枯木桌椅试用魔法*1，哥特长靴试用魔法*1，螃蟹南瓜头饰试用魔法*1，吸蟹伯爵面具礼包试用魔法*1，吸蟹伯爵斗篷礼包试用魔法*1，哥特螃蟹长袍试用魔法*1，蛛丝斗篷礼包试用魔法*1，皮皮猫装扮礼包试用魔法*1，冥龙南瓜礼包试用魔法*1，猫耳发型试用魔法*1，皮皮猫礼包试用魔法*1，恶作剧飞行扫帚礼包试用魔法*2，蛛网朋克礼包试用魔法*1，疯女巫长裙礼包试用魔法*1，巫树犄角礼包试用魔法*1，鬼蝠斗篷试用魔法*1，南瓜帽试用魔法*1，蛛网斗篷礼包试用魔法*1，女巫帽礼包试用魔法*1，漂浮魔法*2，璀璨之星魔法*2，元气满满魔法*2
              </p>
            </section>
          </template>
        </activity-modal>
        <!-- 领奖弹框 -->
        <activity-modal ref="modalReward">
          <template #content>
            <div class="h-[640px] overflow-auto px-4">
              <section
                class="flex h-full flex-col"
                aria-labelledby="modalRewardTitle"
              >
                <h2 id="modalRewardTitle" class="sr-only">领奖弹框</h2>
                <p class="modal-text mt-4">恭喜你获得：</p>
                <div class="flex flex-1 items-center justify-center">
                  <ul
                    :class="[
                      'reward-list flex w-full items-center justify-around',
                      `reward-list-${curRewards.length}`,
                    ]"
                  >
                    <li
                      class="reward-item flex flex-col items-center justify-between"
                      v-for="item in curRewards"
                      :key="item.name"
                    >
                      <img
                        class="reward-img"
                        :src="handleSrc(item.name)"
                        alt="reward"
                      />
                      <p class="reward-name">
                        {{ rewardsText[item.name as keyof RewardsName] }}
                        * {{ item.count }}
                      </p>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
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
import { getPlayerMissionData } from '@/utils/request'
import { halloweenLottery } from '@/apis/halloween'
import { useActivityStore } from '@/stores/halloweenPass2024'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'

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

// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modalReward = ref<InstanceType<typeof ActivityModal> | null>(null)

// 活动数据
const EVENT_NAME = 'activitycenter_Halloweenpass_2024'
const activityStore = useActivityStore()
const activityData = computed(() => activityStore.activityData)
// 捣蛋币数
const tokenCount = computed(() =>
  Number(activityData.value.token_info.halloween_token),
)
// 是否首次抽奖
const isFirstLottery = computed(() => activityData.value.draw_id <= 0)

interface RewardsName {
  repellant_krill: string
  candle_trick: string
  crab_rock_trick: string
  currency_trick: string
  outfit_hair_witchhair: string
  outfit_wing_witheredcape: string
  outfit_prop_mischieftable: string
  outfit_feet_goth: string
  outfit_horn_pumpkincrab: string
  outfit_mask_crabula: string
  outfit_wing_crabula: string
  outfit_body_goth: string
  outfit_wing_cobweb: string
  outfit_wing_catcape: string
  outfit_prop_mischiefpumpkin: string
  outfit_hair_cathair: string
  outfit_prop_mischiefcat: string
  outfit_prop_mischiefbroom: string
  outfit_hair_spiderhair: string
  outfit_body_witchbody: string
  outfit_horn_witheredhorn: string
  outfit_wing_bat: string
  outfit_hair_pumpkin: string
  outfit_wing_webcape: string
  outfit_hair_witchhat: string
  gravity: string
  glow: string
  energy: string
  resize_potion: string
  trail_rainbow: string
  candles: string
  heart: string
}

const rewardsText: RewardsName = {
  repellant_krill: '冥龙克星',
  candle_trick: '蜡烛恶作剧',
  crab_rock_trick: '螃蟹恶作剧',
  currency_trick: '糖果恶作剧',
  outfit_hair_witchhair: '女巫长发试用魔法',
  outfit_wing_witheredcape: '枯叶斗篷试用魔法',
  outfit_prop_mischieftable: '枯木桌椅试用魔法',
  outfit_feet_goth: '哥特长靴试用魔法',
  outfit_horn_pumpkincrab: '螃蟹南瓜头饰试用魔法',
  outfit_mask_crabula: '吸蟹伯爵面具礼包试用魔法',
  outfit_wing_crabula: '吸蟹伯爵斗篷礼包试用魔法',
  outfit_body_goth: '哥特螃蟹长袍试用魔法',
  outfit_wing_cobweb: '蛛丝斗篷礼包试用魔法',
  outfit_wing_catcape: '皮皮猫装扮礼包试用魔法',
  outfit_prop_mischiefpumpkin: '冥龙南瓜礼包试用魔法',
  outfit_hair_cathair: '猫耳发型试用魔法',
  outfit_prop_mischiefcat: '皮皮猫礼包试用魔法',
  outfit_prop_mischiefbroom: '恶作剧飞行扫帚礼包试用魔法',
  outfit_hair_spiderhair: '蛛网朋克礼包试用魔法',
  outfit_body_witchbody: '疯女巫长裙礼包试用魔法',
  outfit_horn_witheredhorn: '巫树犄角礼包试用魔法',
  outfit_wing_bat: '鬼蝠斗篷试用魔法',
  outfit_hair_pumpkin: '南瓜帽试用魔法',
  outfit_wing_webcape: '蛛网斗篷礼包试用魔法',
  outfit_hair_witchhat: '女巫帽礼包试用魔法',
  gravity: '漂浮魔法',
  glow: '璀璨之星魔法',
  energy: '元气满满魔法',
  resize_potion: '体型重塑',
  trail_rainbow: '彩虹尾迹',
  candles: '蜡烛',
  heart: '爱心',
}
const curRewards = ref([
  {
    name: 'outfit_hair_pumpkin',
    count: 1,
  },
])

const sessionIsVisitedKey = 'isVisitedHalloweenpass2024'
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
    getActivityData()
  } catch (error) {
    console.error(error)
  }
  Session.set(sessionIsVisitedKey, true)
})

/**
 * @function handleHelp
 * @description 显示帮助
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
    `../../assets/images/halloween-pass-2024/reward/${name}.png`,
    import.meta.url,
  ).href

  return imgSrc
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
      // 更新缓存活动数据
      activityStore.updateActivityData(data)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function drawLottery
 * @description 抽奖
 * @returns void
 */
function drawLottery(): void {
  if (!isFirstLottery.value && tokenCount.value < 100) {
    showToast('捣蛋币不足！请去【出奇寻宝】获取！')
    return
  }
  halloweenLottery({
    event: EVENT_NAME,
    token_count: tokenCount.value,
  })
    .then((res) => {
      // code = 200 的错误
      const errorMap = {
        'not enough token': '捣蛋币不足！请去【出奇寻宝】获取！',
        'old data': '数据异常，请稍后重试',
        'exceeded draw limit': '奖励已全部抽完',
      }
      if (res.msg !== 'ok') {
        showToast(errorMap[res.msg as keyof typeof errorMap])
        return
      }
      const rewards = res.rewards
      modalReward.value?.openModal()
      curRewards.value = Object.entries(rewards).map(([name, count]) => ({
        name,
        count: Number(count),
      }))
      activityData.value.token_info.halloween_token = res.token_count
      activityData.value.draw_id = res.draw_id
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
    background-image: url('@/assets/images/halloween-pass-2024/bg.jpg');
  }
}
.title {
  position: absolute;
  left: 52px;
  top: 48px;
  width: 647px;
  height: 414px;
  background-image: url('@/assets/images/halloween-pass-2024/title.png');
}
.help {
  position: absolute;
  width: 109px;
  height: 109px;
  left: 544px;
  top: 304px;
  background-image: url('@/assets/images/halloween-pass-2024/help.png');
}
.token {
  position: absolute;
  right: 71px;
  top: 74px;
  width: 204px;
  height: 70px;

  &-icon {
    position: absolute;
    left: 11px;
    top: 0;
    width: 49px;
    height: 70px;
    background-image: url('@/assets/images/halloween-pass-2024/halloween-token.png');
  }

  &-count {
    margin-top: 16px;
    padding: 0 25px 0 60px;
    border-radius: 51px;
    width: 204px;
    height: 51px;
    line-height: 51px;
    font-size: 45px;
    color: #fff;
    background: rgba(#8b7ab2, $alpha: 0.85);
  }
}
.tips {
  position: absolute;
  left: 50%;
  bottom: 220px;
  transform: translate3d(-50%, 0, 0);
  width: 317px;
  height: 57px;
  background-image: url('@/assets/images/halloween-pass-2024/rect-bg.png');

  &-icon {
    margin-top: -2px;
    width: 49px;
    height: 70px;
    background-image: url('@/assets/images/halloween-pass-2024/halloween-token.png');
  }

  &-text {
    margin-left: 20px;
    font-size: 40px;
  }
}
.btn {
  position: absolute;
  left: 50%;
  bottom: 65px;
  transform: translate3d(-50%, 0, 0);
  width: 423px;
  height: 142px;
  background-image: url('@/assets/images/halloween-pass-2024/btn.png');
}
.reward-list {
  &-1 {
    width: 80%;
    .reward-img {
      width: 400px;
    }
  }
  &-2 {
    width: 100%;
    .reward-img {
      width: 300px;
    }
  }
}
.reward-name {
  font-size: 30px;
  color: #666;
}
</style>
