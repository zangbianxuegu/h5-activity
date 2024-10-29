<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="design flex h-screen">
      <div class="design-main">
        <Transition appear :name="headTransitionName" mode="out-in">
          <section class="relative">
            <h1 class="title relative overflow-hidden bg-contain bg-no-repeat">
              <div class="sr-only">
                绘梦节活动会场
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
            <button
              class="absolute right-4 top-4 rounded bg-teal-600 px-4 py-2 text-white"
            >
              我的作品
            </button>
          </section>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="main">
            <!-- 操作区 -->
            <div class="justify-space m-auto flex w-[1600px] items-center py-4">
              <input
                v-model="keywords"
                type="text"
                placeholder="搜索作者名称或作品编号"
                class="grow p-2 shadow-md"
              />
              <button
                class="bg-blue-500 px-4 py-2 text-white"
                @click="searchItems"
              >
                搜索
              </button>
              <button
                class="ml-4 rounded bg-green-500 px-4 py-2 text-white"
                @click="getCollectedData()"
              >
                我的收藏
              </button>
              <button
                :class="[
                  'ml-4 rounded bg-gray-500 px-4 py-2 text-white',
                  {
                    'cursor-not-allowed opacity-50': countdown > 0,
                  },
                ]"
                :disabled="countdown > 0"
                @click="getRecommendData"
              >
                <span v-show="countdown > 0">({{ countdown }})</span>推荐
              </button>
            </div>
            <!-- 主体内容 -->
            <div class="mt-2">
              <div class="relative mx-auto h-[700px] w-[1700px]">
                <!-- 左箭头 -->
                <Transition name="fade">
                  <div
                    v-show="isPrevVisible"
                    class="absolute left-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
                  >
                    <button
                      class="h-[100px] w-[100px] rounded-full bg-blue-500 p-2 text-center text-white"
                      @click="getCollectedData('prev')"
                    >
                      &#9664;
                    </button>
                  </div>
                </Transition>
                <!-- 作品列表 -->
                <TransitionGroup
                  name="list"
                  tag="ul"
                  v-if="workData && workData.list"
                  class="absolute left-1/2 grid w-[1400px] -translate-x-1/2 grid-cols-3 gap-4"
                >
                  <li
                    v-for="item in workData!.list"
                    :key="item.id"
                    class="relative cursor-pointer rounded bg-white shadow-md"
                  >
                    <img
                      :src="item.image_url"
                      :alt="item.title"
                      class="w-full rounded"
                    />
                    <!-- ID -->
                    <div
                      class="absolute left-0 top-0 h-[40px] bg-blue-500 px-1 leading-[40px] text-white"
                    >
                      {{ item.id }}
                    </div>
                    <!-- 底部 -->
                    <div
                      class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-b from-transparent to-black/40 px-1"
                    >
                      <!-- 作者标题 -->
                      <div>
                        <h3 class="text-sm text-white">{{ item.author }}</h3>
                        <p class="text-white">{{ item.title }}</p>
                      </div>
                      <!-- 收藏图标 -->
                      <img
                        v-if="item.collected"
                        class="h-[40px] w-[40px]"
                        src="http://iph.href.lu/20x20"
                        alt="已收藏"
                      />
                    </div>
                  </li>
                </TransitionGroup>
                <div
                  v-else
                  class="flex h-[800px] w-[1400px] items-center justify-center"
                >
                  暂无作品
                </div>
                <!-- 右箭头 -->
                <Transition name="fade">
                  <div
                    v-show="isNextVisible"
                    class="absolute right-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
                    @click="getCollectedData('next')"
                  >
                    <button
                      class="h-[100px] w-[100px] rounded-full bg-blue-500 p-2 text-center text-white"
                    >
                      &#9654;
                    </button>
                  </div>
                </Transition>
              </div>
              <!-- 分页 -->
              <Transition name="fade">
                <div
                  v-if="type === searchTypeConst.collect"
                  class="mt-2 flex items-center justify-center"
                >
                  <p class="text-white">
                    {{ workData?.page }}/{{ workData?.total_pages }}
                  </p>
                </div>
              </Transition>
            </div>
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
                活动期间，玩家可以使用捣蛋挖宝次数进行挖宝：
              </p>
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
import type { DesignConfig, WorkData, SearchType } from '@/types'
import { Session } from '@/utils/storage'
import { getWorkList } from '@/apis/dayOfDesign01'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import ActivityModal from '@/components/Modal'
import Loading from '@/components/Loading'

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

const sessionIsVisitedKey = 'isVisitedDayOfDesign01PostExhibit'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}

const searchTypeConst: Record<SearchType, SearchType> = {
  recommend: 'recommend',
  collect: 'collect',
}

// 类型
const type = ref<SearchType>('recommend')
const keywords = ref('')
// 作品列表信息
const workData = ref<WorkData>({
  list: [],
  total_pages: 0,
  page: 0,
})
let page = 1
const isPrevVisible = computed(
  () => type.value === searchTypeConst.collect && page > 1,
)
const isNextVisible = computed(
  () =>
    type.value === searchTypeConst.collect && page < workData.value.total_pages,
)
// 为我推荐倒计时
const countdown = ref(0)
let timer: NodeJS.Timeout | undefined

onMounted(() => {
  Session.set(sessionIsVisitedKey, true)
  getWorkData()
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

/**
 * @function getWorkData
 * @description 获取作品列表
 * @returns {void}
 */
function getWorkData(): void {
  Loading.show()
  getWorkList({
    type: type.value,
    keywords: keywords.value,
    page,
    per_page: 6,
  })
    .then((res) => {
      Loading.hide()
      if (res.code === 200) {
        workData.value = res.data
        page = res.data.page
      }
    })
    .catch((error) => {
      console.log('error: ', error)
    })
}

/**
 * @function getRecommendData
 * @description 获取推荐作品
 * @returns {void}
 */
function getRecommendData(): void {
  countdown.value = 3
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  type.value = searchTypeConst.recommend
  getWorkData()
}

/**
 * @function getCollectionData
 * @description 获取收藏作品
 * @param {string} dir 方向
 * @returns {void}
 */
function getCollectedData(dir?: string): void {
  type.value = searchTypeConst.collect
  if (dir === 'prev') {
    page -= 1
  } else if (dir === 'next') {
    page += 1
  }
  getWorkData()
}

/**
 * @function searchItems
 * @description 搜索功能
 * @returns {void}
 */
function searchItems(): void {
  getWorkData()
}

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
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
.fade-in-main-enter-active {
  transition: opacity 1s ease-out 0.5s;
}
.fade-in-main-enter-from {
  opacity: 0.2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
}
.design {
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
    background: linear-gradient(0deg, #8bd6d3, #8bd6d3),
      linear-gradient(
        180deg,
        rgba(133, 207, 198, 0.2) 69.22%,
        rgba(31, 79, 71, 0.2) 92.53%
      );
  }
}
.title {
  width: 1200px;
  height: 200px;
  background-image: url('http://iph.href.lu/1200x200');
}
</style>
