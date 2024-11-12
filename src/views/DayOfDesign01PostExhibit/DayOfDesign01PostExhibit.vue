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
                  <time datetime="2025-01-01">1.1</time>-
                  <time datetime="2025-01-31">1.31</time>
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
            <div class="justify-space m-auto flex w-[1600px] items-center py-2">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="搜索作者名称或作品编号"
                class="grow p-2 shadow-md"
                @keyup.enter="handleSearch()"
              />
              <button
                class="bg-blue-500 px-4 py-2 text-white"
                @click="handleSearch()"
              >
                搜索
              </button>
              <button
                class="ml-4 rounded bg-green-500 px-4 py-2 text-white"
                @click="handleFavorite()"
              >
                我的收藏
              </button>
              <button
                :class="[
                  'ml-4 rounded bg-gray-500 px-4 py-2 text-white',
                  {
                    'cursor-not-allowed opacity-50': isCoolDownActive,
                  },
                ]"
                :disabled="isCoolDownActive"
                @click="handleRecommend"
              >
                <span v-show="isCoolDownActive">({{ countdown }})</span>推荐
              </button>
            </div>
            <!-- 主体内容 -->
            <div class="">
              <div class="relative mx-auto h-[700px] w-[1700px]">
                <!-- 左箭头 -->
                <Transition name="fade">
                  <div
                    v-show="isPrevVisible"
                    class="absolute left-0 top-1/2 flex -translate-y-1/2 items-center justify-center"
                  >
                    <button
                      class="h-[100px] w-[100px] rounded-full bg-blue-500 p-2 text-center text-white"
                      @click="handlePrev"
                    >
                      &#9664;
                    </button>
                  </div>
                </Transition>
                <!-- 作品列表 -->
                <ul
                  v-if="list"
                  class="absolute left-1/2 grid w-[1400px] -translate-x-1/2 grid-cols-3 gap-4"
                >
                  <li
                    v-for="item in list"
                    :key="item.design_id"
                    class="relative cursor-pointer rounded bg-white shadow-md"
                    @click="handleItemClick"
                  >
                    <img
                      :src="item.raw_url"
                      :alt="item.design_name"
                      class="w-full rounded"
                    />
                    <!-- ID -->
                    <div
                      class="absolute left-0 top-0 h-[40px] bg-blue-500 px-1 leading-[40px] text-white"
                    >
                      {{ item.design_id }}
                    </div>
                    <!-- 底部 -->
                    <div
                      class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-b from-transparent to-black/40 px-1"
                    >
                      <!-- 作者标题 -->
                      <div>
                        <h3 class="text-sm text-white">
                          {{ item.author_name }}
                        </h3>
                        <p class="text-white">{{ item.design_name }}</p>
                      </div>
                      <!-- 收藏图标 -->
                      <img
                        v-if="item.favorite"
                        class="h-[40px] w-[40px]"
                        src="http://iph.href.lu/20x20"
                        alt="已收藏"
                      />
                    </div>
                  </li>
                </ul>
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
                    @click="handleNext"
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
                  v-if="isPagesVisible"
                  class="mt-2 flex items-center justify-center"
                >
                  <p class="text-white">{{ currentPage }}/{{ totalPage }}</p>
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
import { showToast } from 'vant'
import type {
  DesignConfig,
  ListRecommendParams,
  ListRecommendRes,
  ListFavoriteParams,
  ListFavoriteRes,
  ListSearchParams,
  ListSearchRes,
  DesignItem,
} from '@/types'
import { Session } from '@/utils/storage'
import { FILE_PICKER_POLICY_NAME } from '@/constants/dayofdesign01'
import {
  getFavorites,
  getRecommendations,
  searchDesigns,
} from '@/apis/dayOfDesign01'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import Loading from '@/components/Loading'
import ActivityModal from '@/components/Modal'
import { useStore, initCachedData } from './store'

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

// 常量
const EVENT = 'activitycenter_dayofdesign01_post_exhibit'
const ITEMS_PER_PAGE = 6
// 弹框
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

// 缓存数据
const {
  cachedRecommend,
  cachedFavorite,
  cachedSearch,
  updateCachedRecommend,
  updateCachedFavorite,
  updateCachedSearch,
} = useStore()
// 页面数据类型
const type = ref<'recommend' | 'favorite' | 'search'>('favorite') // recommend、favorite、search
// 页面显示的作品列表数据
const list = ref<DesignItem[]>([])
// 总页数
const totalPage = ref(0)
// 当前页数
const currentPage = ref(1)
// 推荐页数
let recommendPage = 0
// 搜索文本
const searchTerm = ref('')
// 当前页最小收藏时间：获取收藏数据传参，第一次不传
// 根据已获取的收藏数据的最小收藏时间进行下一次的请求
let minFavoriteTime: null | number = null
// 当前页最小ID：获取收藏数据传参，第一次不传
// 根据已获取的搜索数据的最小作品ID进行下一次的请求
let minIdOffset: null | string = null
// 为我推荐倒计时
const countdown = ref(0)
let timer: NodeJS.Timeout | undefined
const isCoolDownActive = computed(() => countdown.value > 0)
// 详情显示
const isDetailVisible = ref(false)
// 左右箭头和页数的显示
const isPrevVisible = computed(
  () => type.value !== 'recommend' && currentPage.value > 1,
)
const isNextVisible = computed(
  () => type.value !== 'recommend' && currentPage.value < totalPage.value,
)
const isPagesVisible = computed(
  () =>
    (type.value === 'favorite' && cachedFavorite.value.totalPage > 1) ||
    (type.value === 'search' && cachedSearch.value.totalPage > 1),
)

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

onMounted(async () => {
  Session.set(sessionIsVisitedKey, true)
  await handleRecommend()
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})

/**
 * @function handleCachedRecommend
 * @description 更新缓存的推荐数据
 * @returns {Promise<void>}
 */
async function handleCachedRecommend(): Promise<void> {
  const params: ListRecommendParams = {
    event: EVENT,
    policy_name: FILE_PICKER_POLICY_NAME,
  }
  try {
    const res: ListRecommendRes = await getRecommendations(params)
    console.log('接口返回推荐数据: ', res)
    if (res.code === 200) {
      const data = res.data
      // 测试代码
      const designs = data.map((design, index) => ({
        ...design,
        raw_url: `http://iph.href.lu/800x600?text=${index}`,
      }))
      console.log('designs: ', designs)
      updateCachedRecommend(designs)
      console.log('cachedRecommend: ', cachedRecommend.value)
    }
  } catch (error) {
    const err = error as Error
    showToast(err.message || '获取收藏作品失败')
  }
}

/**
 * @function handleCachedFavorite
 * @description 更新缓存的收藏数据
 * @returns {Promise<void>}
 */
async function handleCachedFavorite(): Promise<void> {
  // 参数，第一次请求不需要 favorite_time
  let params: ListFavoriteParams = {
    event: EVENT,
    policy_name: FILE_PICKER_POLICY_NAME,
  }
  if (minFavoriteTime) {
    params = {
      ...params,
      favorite_time: minFavoriteTime,
    }
  }
  try {
    const res: ListFavoriteRes = await getFavorites(params)
    console.log('接口返回收藏数据: ', res)
    if (res.code === 200) {
      const data = res.data
      // 处理收藏数据，加入字段 favorite，是否收藏，用于取消收藏展示
      const designs = data.designs.map((design, index) => ({
        ...design,
        favorite: true,
        // 测试代码
        raw_url: `http://iph.href.lu/800x600?text=${index}`,
      }))
      // 更新缓存的收藏数据
      const newDesignData = {
        designList: [...cachedFavorite.value.designList, ...designs],
        totalPage:
          cachedFavorite.value?.totalPage === 0
            ? Math.ceil(data.count / ITEMS_PER_PAGE)
            : cachedFavorite.value?.totalPage,
      }
      // 修正总页数。如果没有数据了，判断计算的总页数是否和第一次请求页数相符
      // 针对：在第一次请求之后，后面页数的数据已经被删除了
      // 如果是前面页数的数据被删除了，则前端数据正常显示，不做处理
      if (data.is_end) {
        const pageCount = Math.ceil(data.designs.length / ITEMS_PER_PAGE)
        if (
          currentPage.value - 1 + pageCount <
          cachedFavorite.value?.totalPage
        ) {
          newDesignData.totalPage = currentPage.value - 1 + pageCount
        }
      }
      updateCachedFavorite(newDesignData)
      // 更新最小收藏时间
      const lastIdex = data.designs.length - 1
      minFavoriteTime = data.designs[lastIdex].favorite_time
    }
  } catch (error) {
    const err = error as Error
    showToast(err.message || '获取收藏作品失败')
  }
}

/**
 * @function handleCachedSearch
 * @description 更新缓存的搜索数据
 * @returns {Promise<void>}
 */
async function handleCachedSearch(): Promise<void> {
  // 参数，第一次请求不需要 id_offset
  let params: ListSearchParams = {
    event: EVENT,
    policy_name: FILE_PICKER_POLICY_NAME,
    search_term: searchTerm.value,
  }
  if (minIdOffset) {
    params = {
      ...params,
      id_offset: minIdOffset,
    }
  }
  try {
    const res: ListSearchRes = await searchDesigns(params)
    console.log('接口返回搜索数据: ', res)
    if (res.code === 200) {
      const data = res.data
      if (data.designs.length === 0) {
        showToast('暂无搜索数据~')
        return
      }
      // 测试代码
      const designs = data.designs.map((design, index) => ({
        ...design,
        raw_url: `http://iph.href.lu/800x600?text=${index}`,
      }))
      // 更新缓存的搜索数据
      const newDesignData = {
        designList: [...cachedSearch.value.designList, ...designs],
        totalPage:
          cachedSearch.value.totalPage === 0
            ? Math.ceil(data.count / ITEMS_PER_PAGE)
            : cachedSearch.value.totalPage,
      }
      updateCachedSearch(newDesignData)
      // 更新最小作品ID
      const lastIdex = data.designs.length - 1
      minIdOffset = data.designs[lastIdex].design_id
    }
  } catch (error) {
    const err = error as Error
    showToast(err.message || '搜索作品失败')
  }
}

/**
 * @function getRecommendByPage
 * @description 根据页数获取推荐数据
 * @param {number} page 页数
 * @returns {DesignItem}
 */
async function getRecommendByPage(page: number): Promise<DesignItem[]> {
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  if (startIndex >= cachedRecommend.value.length) {
    // 请求接口获取新数据
    await handleCachedRecommend()
  } else {
    Loading.show()
    // 随机延迟 100 到 300 毫秒
    const delay = Math.floor(Math.random() * 200) + 100
    await new Promise((resolve) => setTimeout(resolve, delay))
    Loading.hide()
  }
  const res = cachedRecommend.value.slice(startIndex, endIndex)
  console.log(`推荐数据第${page}页：`, res)
  return res
}

/**
 * @function getFavoritesByPage
 * @description 根据页数获取收藏数据
 * @param {number} page 页数
 * @returns {DesignItem}
 */
async function getFavoritesByPage(page: number): Promise<DesignItem[]> {
  const startIndex = (page - 1) * 6
  const endIndex = startIndex + 6
  if (startIndex >= cachedFavorite.value.designList.length) {
    // 请求接口获取新数据
    await handleCachedFavorite()
  }
  const res = cachedFavorite.value.designList.slice(startIndex, endIndex)
  console.log(`收藏数据第${page}页：`, res)
  return res
}

/**
 * @function getSearchByPage
 * @description 根据页数获取搜索数据
 * @param {number} page 页数
 * @returns {DesignItem}
 */
async function getSearchByPage(page: number): Promise<DesignItem[]> {
  const startIndex = (page - 1) * 6
  const endIndex = startIndex + 6
  if (startIndex >= cachedSearch.value.designList.length) {
    // 请求接口获取新数据
    await handleCachedSearch()
  }
  const res = cachedSearch.value.designList.slice(startIndex, endIndex)
  console.log(`搜索数据第${page}页：`, res)
  return res
}

/**
 * @function handleRecommend
 * @description 获取推荐作品
 * @returns {Promise<void>}
 */
async function handleRecommend(): Promise<void> {
  type.value = 'recommend'
  recommendPage++
  if (cachedRecommend.value.length < 6 || recommendPage > 3) {
    recommendPage = 1
    updateCachedRecommend([])
  }
  countdown.value = 3
  timer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
  list.value = await getRecommendByPage(recommendPage)
}

/**
 * @function getCollectionData
 * @description 获取收藏作品
 * @param {string} dir 方向
 * @returns {Promise<void>}
 */
async function handleFavorite(dir?: string): Promise<void> {
  type.value = 'favorite'
  if (dir === 'prev') {
    currentPage.value -= 1
  } else if (dir === 'next') {
    currentPage.value += 1
  } else {
    minFavoriteTime = null
    currentPage.value = 1
    updateCachedFavorite(initCachedData)
  }
  list.value = await getFavoritesByPage(currentPage.value)
  totalPage.value = cachedFavorite.value.totalPage
}

/**
 * @function handleSearch
 * @description 搜索功能
 * @param {string} dir 方向
 * @returns {Promise<void>}
 */
async function handleSearch(dir?: string): Promise<void> {
  if (!searchTerm.value.trim()) {
    showToast('请输入作者名称或作品编号~')
    return
  }
  type.value = 'search'
  if (dir === 'prev') {
    currentPage.value -= 1
  } else if (dir === 'next') {
    currentPage.value += 1
  } else {
    minIdOffset = null
    currentPage.value = 1
    updateCachedSearch(initCachedData)
  }
  list.value = await getSearchByPage(currentPage.value)
  totalPage.value = cachedSearch.value.totalPage
}

/**
 * @function handlePrev
 * @description 获取上一页数据
 * @returns {Promise<void>}
 */
async function handlePrev(): Promise<void> {
  if (type.value === 'favorite') {
    await handleFavorite('prev')
  } else {
    await handleSearch('prev')
  }
}

/**
 * @function handleNext
 * @description 获取下一页数据
 * @returns {Promise<void>}
 */
async function handleNext(): Promise<void> {
  if (type.value === 'favorite') {
    await handleFavorite('next')
  } else {
    await handleSearch('next')
  }
}

/**
 * @function handleItemClick
 * @description 查看作品详情
 * @returns {void}
 */
function handleItemClick(): void {
  isDetailVisible.value = true
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
