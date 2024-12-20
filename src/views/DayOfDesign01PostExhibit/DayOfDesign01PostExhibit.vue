<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page flex h-screen">
      <div :class="['page-main', { 'keyboard-show': isKeyboardShow }]">
        <Transition appear :name="headTransitionName" mode="out-in">
          <header class="design-header relative">
            <h1 class="title overflow-hidden bg-contain bg-no-repeat">
              <p class="sr-only">执笔畅想 绘梦成真</p>
            </h1>
            <h2 class="sub-title bg-contain bg-no-repeat">
              <p class="sr-only">
                活动时间
                <time datetime="2025-01-01">1.1</time>-
                <time datetime="2025-01-31">1.31</time>
              </p>
              <p class="sr-only">本期主题-国风演绎</p>
              <div
                class="help cursor-pointer bg-contain"
                @click="handleHelp"
              ></div>
            </h2>
            <button
              class="my-work absolute right-0 top-[60px]"
              @click="handleItemClick()"
            >
              我的作品
            </button>
          </header>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="design-main m-auto">
            <!-- 操作区 -->
            <div class="mx-auto flex items-center">
              <!-- 搜索 -->
              <div class="search relative">
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="输入作者名或作品编号"
                  class="search-input absolute rounded-full"
                  @keyup.enter="handleSearch()"
                />
                <button
                  class="search-btn absolute rounded-full bg-center bg-no-repeat"
                  @click="handleSearch()"
                >
                  <span class="sr-only">搜索</span>
                </button>
              </div>
              <!-- 收藏 -->
              <button
                :class="[
                  'nav-btn nav-btn--favorite flex items-center justify-center rounded-full',
                  [type === PageType.Favorite ? 'bg-[#d9fff5]' : 'bg-white'],
                ]"
                @click="handleFavorite()"
              >
                <img
                  v-show="type === PageType.Favorite"
                  class="nav-icon transition-all"
                  src="@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/favorite-selected.png"
                  alt="favorite"
                />
                <img
                  v-show="type !== PageType.Favorite"
                  class="nav-icon transition-all"
                  src="@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/favorite-unselected.png"
                  alt="favorite"
                />
                <span>我的收藏</span>
              </button>
              <!-- 推荐 -->
              <button
                :class="[
                  'nav-btn nav-btn--recommend flex items-center justify-center rounded-full',
                  {
                    'cursor-not-allowed bg-[#d7e3f0]': isCoolDownActive,
                  },
                  !isCoolDownActive &&
                    (type === PageType.Recommend ? 'bg-[#d9fff5]' : 'bg-white'),
                ]"
                @click="handleRecommend"
              >
                <img
                  class="nav-icon"
                  src="@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/refresh.png"
                  alt="recommend"
                />
                推荐<span v-show="isCoolDownActive">({{ countdown }})</span>
              </button>
            </div>
            <!-- 主体内容 -->
            <DesignList
              :list="list"
              :is-prev-visible="isPrevVisible"
              :is-next-visible="isNextVisible"
              :is-pages-visible="isPagesVisible"
              :current-page="currentPage"
              :total-page="totalPage"
              @on-click="handleItemClick"
              @on-prev="handlePrev"
              @on-next="handleNext"
              @on-image-error="handleImageError"
            />
          </section>
        </Transition>

        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />

        <!-- 作品详情弹框 -->
        <works-detail-modal
          v-model:show="isDetailVisible"
          :event="EventDayOfDesign01.Exhibit"
          :type="detailType"
          :works-data="detailData"
          :file-picker-config="filePickerConfig"
          @update-favorite="handleUpdateFavorites"
          @after-report="handleAfterReport"
        ></works-detail-modal>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import qs from 'qs'
import { DesignDetailsType, EventDayOfDesign01, PageType } from '@/types'
import type {
  DesignConfig,
  ListRecommendParams,
  ListFavoriteParams,
  ListSearchParams,
  DesignItem,
  FavoriteData,
  DetailParams,
} from '@/types'
import { Session } from '@/utils/storage'
import { FILE_PICKER_POLICY_NAME } from '@/constants/dayofdesign01'

import {
  getFavorites,
  getRecommendations,
  searchDesigns,
  getDesignDetails,
} from '@/apis/dayOfDesign01'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import Loading from '@/components/Loading'
import { useActivityStore } from '@/stores/dayOfDesign01'
import { useStore, initCachedData } from './store'
import throttle from 'lodash.throttle'
import DesignList from './components/DesignList.vue'
const ModalHelp = defineAsyncComponent(
  () => import('./components/ModalHelp.vue'),
)
const WorksDetailModal = defineAsyncComponent(
  () => import('../DayOfDesign01PostSubmit/components/WorksDetailModal.vue'),
)

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
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

// 缓存数据
const {
  cachedFavorite,
  cachedSearch,
  updateCachedFavorite,
  updateCachedSearch,
} = useStore()
// 全局缓存 - 推荐作品
// 刷新页面会获取推荐作品，为避免触发接口 CD，进行全局状态管理并持久化、而非简单缓存
const activityStore = useActivityStore()
const cachedRecommend = computed(() => activityStore.recommendData)

// 页面数据类型
const type = ref<PageType>(PageType.Favorite) // recommend、favorite、search
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
let minFavoriteTime: undefined | number
// 当前页最小ID：获取收藏数据传参，第一次不传
// 根据已获取的搜索数据的最小作品ID进行下一次的请求
let minIdOffset: null | string = null
// 为我推荐倒计时
const countdown = ref(0)
let countdownInterval: NodeJS.Timeout | undefined
const isCoolDownActive = computed(() => countdown.value > 0)
// 详情显示
const isDetailVisible = ref(false)
let curDetailId = ''
// 左右箭头和页数的显示
const isPrevVisible = computed(
  () => type.value !== PageType.Recommend && currentPage.value > 1,
)
const isNextVisible = computed(
  () =>
    type.value !== PageType.Recommend && currentPage.value < totalPage.value,
)
const isPagesVisible = computed(
  () =>
    (type.value === PageType.Favorite && cachedFavorite.value.totalPage > 1) ||
    (type.value === PageType.Search && cachedSearch.value.totalPage > 1),
)
interface Detail {
  author: string
  worksName: string
  worksIntroduce: string
  id: string
  worksImgSrc: string
  worksDecorateImgSrc: string
  isFavorite: boolean
  isReported: boolean
}
// 详情
const detailType = ref<DesignDetailsType>(DesignDetailsType.Other)
const detailData = ref<Detail>({
  id: '',
  author: '',
  worksName: '',
  worksIntroduce: '',
  isFavorite: false,
  isReported: false,
  worksImgSrc: '',
  worksDecorateImgSrc: '',
})
const filePickerConfig = ref({
  token: '',
  policyName: FILE_PICKER_POLICY_NAME,
  shareImgPolicyName: FILE_PICKER_POLICY_NAME,
  filePickerUrl: '',
  currentUoloadFileUrl: '',
})

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
  window.addEventListener('resize', handleResize)
  await handleRecommend()
  await openSharedDetail()
})

onBeforeUnmount(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 记录初始窗口高度
const originalHeight = window.innerHeight
// 键盘是否显示
const isKeyboardShow = ref(false)

/**
 * @function handleResize
 * @description 处理窗口大小变化
 */
const handleResize = throttle(() => {
  const currentHeight = window.visualViewport?.height || window.innerHeight
  isKeyboardShow.value = originalHeight > currentHeight
}, 200)

/**
 * @function openSharedDetail
 * @description 打开分享的作品详情
 * @returns {Promise<void>}
 */
async function openSharedDetail(): Promise<void> {
  const href = window.location.href
  const queryStr = href.split('?')[1]
  if (queryStr) {
    const detailParams: DetailParams = {
      policy_name: FILE_PICKER_POLICY_NAME,
      design_id: qs.parse(queryStr).d_id as string,
    }
    await getDetail(detailParams)
  }
}

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
    const data: DesignItem[] = await getRecommendations(params)
    // 更新全局缓存数据
    activityStore.updateRecommendData(data)
    const now = Date.now()
    Session.set('lastFetchTime-dayofdesign01-recommend', now.toString())
    console.log('cachedRecommend: ', cachedRecommend.value)
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
    const data: FavoriteData = await getFavorites(params)
    console.log('接口返回收藏数据: ', data)
    // 处理收藏数据，加入字段 favorite，是否收藏，用于取消收藏展示
    const designs = data.designs.map((design) => ({
      ...design,
      favorite: true,
    }))
    if (designs.length === 0) {
      showToast('暂无收藏作品~')
      return
    }
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
      if (currentPage.value - 1 + pageCount < cachedFavorite.value?.totalPage) {
        newDesignData.totalPage = currentPage.value - 1 + pageCount
      }
    }
    updateCachedFavorite(newDesignData)
    // 更新最小收藏时间
    const lastIdex = data.designs.length - 1
    minFavoriteTime = data.designs[lastIdex].favorite_time
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
    const data: FavoriteData = await searchDesigns(params)
    console.log('接口返回搜索数据: ', data)
    const designs = data.designs
    if (designs.length === 0) {
      showToast('没有找到相关结果')
      return
    }
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
    const lastIdex = designs.length - 1
    minIdOffset = designs[lastIdex].design_id
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
  // 当获取第 1 页数据时进行请求接口
  // 获取 2、3 页数据时为读取缓存数据
  if (recommendPage === 1) {
    const now = Date.now()
    const lastFetchTime =
      parseInt(Session.get('lastFetchTime-dayofdesign01-recommend')) || 0
    if (now - lastFetchTime > 3000) {
      // 请求接口获取新数据
      await handleCachedRecommend()
    }
    // else 刷新页面时距离上次请求小于3s，使用缓存数据
  } else {
    Loading.show()
    // 随机延迟 100 到 300 毫秒
    const delay = Math.floor(Math.random() * 200) + 100
    await new Promise((resolve) => setTimeout(resolve, delay))
    Loading.hide()
  }
  const res = cachedRecommend.value.slice(startIndex, endIndex)
  return res
}

/**
 * @function getFavoritesByPage
 * @description 根据页数获取收藏数据
 * @param {number} page 页数
 * @returns {DesignItem}
 */
async function getFavoritesByPage(page: number): Promise<DesignItem[]> {
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  if (startIndex >= cachedFavorite.value.designList.length) {
    // 请求接口获取新数据
    await handleCachedFavorite()
  }
  const res = cachedFavorite.value.designList.slice(startIndex, endIndex)
  return res
}

/**
 * @function getSearchByPage
 * @description 根据页数获取搜索数据
 * @param {number} page 页数
 * @returns {DesignItem}
 */
async function getSearchByPage(page: number): Promise<DesignItem[]> {
  const startIndex = (page - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  if (startIndex >= cachedSearch.value.designList.length) {
    // 请求接口获取新数据
    await handleCachedSearch()
  }
  const res = cachedSearch.value.designList.slice(startIndex, endIndex)
  return res
}

/**
 * @function handleRecommend
 * @description 获取推荐作品
 * @returns {Promise<void>}
 */
async function handleRecommend(): Promise<void> {
  type.value = PageType.Recommend
  // disable 可点、切换 Tab
  if (isCoolDownActive.value) {
    return
  }
  recommendPage++
  // 需要重新请求数据/重置页数和缓存数据：
  // - 缓存数据不足一页数量
  // - 推荐页数大于 3，（只缓存 3 页数据）
  if (cachedRecommend.value.length < ITEMS_PER_PAGE || recommendPage > 3) {
    recommendPage = 1
    // 距离上一次请求超过 3s 才清空数据，例如连续 2 次刷新页面
    const now = Date.now()
    const lastFetchTime =
      parseInt(Session.get('lastFetchTime-dayofdesign01-recommend')) || 0
    if (now - lastFetchTime > 3000) {
      activityStore.updateRecommendData([])
    }
  }
  countdown.value = 3
  countdownInterval = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
  list.value = await getRecommendByPage(recommendPage)
}

/**
 * @function handleFavorite
 * @description 获取收藏作品
 * @param {string} dir 方向
 * @returns {Promise<void>}
 */
async function handleFavorite(dir?: string): Promise<void> {
  if (!dir && type.value === PageType.Favorite) {
    return
  }
  type.value = PageType.Favorite
  if (dir === 'prev') {
    currentPage.value -= 1
  } else if (dir === 'next') {
    currentPage.value += 1
  } else {
    minFavoriteTime = undefined
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
    showToast('请输入作者名或作品编号~')
    return
  }
  const authorPattern = /^[0-9A-Za-z\u4e00-\u9fa5]{1,8}$/
  const workIdPattern = /^[XGYMxgym]\d{8,}$/
  if (
    !authorPattern.test(searchTerm.value) &&
    !workIdPattern.test(searchTerm.value)
  ) {
    showToast('请输入准确的作者名或作品编号~')
    return
  }
  type.value = PageType.Search
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
  if (currentPage.value <= 1) {
    return
  }
  if (type.value === PageType.Favorite) {
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
  if (currentPage.value >= totalPage.value) {
    return
  }
  if (type.value === PageType.Favorite) {
    await handleFavorite('next')
  } else {
    await handleSearch('next')
  }
}

/**
 * @function handleItemClick
 * @description 查看作品详情
 * @param {DesignItem} [item] 作品项（选填），作品列表传入
 * @returns {Promise<void>}
 */
async function handleItemClick(item?: DesignItem): Promise<void> {
  let params: DetailParams = {
    policy_name: FILE_PICKER_POLICY_NAME,
  }
  // 列表中作品
  if (item) {
    detailType.value = DesignDetailsType.Other
    if (!item.design_id) {
      return
    }
    const { design_id: designId, favorite_time: favoriteTime } = item
    curDetailId = designId
    params.design_id = designId
    if (type.value === PageType.Favorite) {
      params = {
        ...params,
        favorite_time: favoriteTime,
      }
    }
  } else {
    detailType.value = DesignDetailsType.Self
  }
  try {
    await getDetail(params)
  } catch (error) {
    const err = error as Error
    showToast(err.message || '查看作品详情失败')
  }
}

/**
 * @function getDetail
 * @description 获取详情数据、打开详情
 * @param {DetailParams} params 参数
 * @returns {Promise<void>}
 */
async function getDetail(params: DetailParams): Promise<void> {
  const detail = await getDesignDetails(params)
  if (detailType.value === DesignDetailsType.Self) {
    // 返回了空对象或者审核不通过
    if (
      !detail.design_name ||
      ('review_status' in detail && detail.review_status !== 'passed')
    ) {
      showToast('暂时没有已发布的作品')
      return
    }
    // 打开自己作品，当前作品 ID 为 detail.design_id
    if ('design_id' in detail) {
      curDetailId = detail.design_id
    }
  }
  const isFavorite = 'is_favorite' in detail ? detail.is_favorite : false
  const isReported = 'is_reported' in detail ? detail.is_reported : false
  detailData.value = {
    id: curDetailId,
    author: detail.author_name,
    worksName: detail.design_name,
    worksIntroduce: detail.description,
    worksImgSrc: detail.raw_url,
    worksDecorateImgSrc: detail.share_url,
    isFavorite,
    isReported,
  }
  isDetailVisible.value = true
}

/**
 * @function handleUpdateFavorites
 * @description 作品详情收藏回调
 * @param isFavorite 是否收藏
 * @returns {void}
 */
function handleUpdateFavorites(isFavorite: boolean): void {
  detailData.value.isFavorite = isFavorite
  list.value = list.value.map((item) => {
    return {
      ...item,
      favorite: item.design_id === curDetailId ? isFavorite : item.favorite,
    }
  })
  // fix: 当作品数据不足 18 条时，服务端会重复数据返回 18 个
  const newRecommendData = cachedRecommend.value.map((item) => {
    return {
      ...item,
      favorite: item.design_id === curDetailId ? isFavorite : item.favorite,
    }
  })
  activityStore.updateRecommendData(newRecommendData)
}

/**
 * @function handleAfterReport
 * @description 举报作品后的回调
 * @returns {void}
 */
function handleAfterReport(): void {
  detailData.value.isReported = true
}

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}

/**
 * @function handleImageError
 * @description 图片加载失败处理
 * @param {DesignItem} item 列表项
 * @returns {void}
 */
function handleImageError(item: DesignItem): void {
  item.error = true
}
</script>

<style lang="scss" scoped>
$bg-color: rgba(238, 251, 255, 0.8);
$font-color: #5a7191;
$font-family: 'Source Han Sans CN';
$font-family-bold: 'Source Han Sans CN Medium';

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
.page {
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
    background-image: url('@/assets/images/dayofdesign01/common/bg.jpg');

    &.keyboard-show {
      transform: translate(-50%, -50%);
    }
  }
}
.title {
  position: absolute;
  left: 236px;
  top: 3px;
  width: 1060px;
  height: 241px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/title.png');
}
.sub-title {
  position: absolute;
  left: 1210px;
  top: 50px;
  width: 505px;
  height: 145px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/sub-title.png');
}
.help {
  position: absolute;
  left: 240px;
  top: 24px;
  width: 47px;
  height: 49px;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/help.png');
}
.my-work {
  border-top-left-radius: 38px;
  border-bottom-left-radius: 38px;
  padding-left: 80px;
  width: 240px;
  height: 76px;
  line-height: 76px;
  font-size: 34px;
  color: $font-color;
  background-color: #eaf5f2;
  background-position: 32px 14px;
  background-size: 50px 50px;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/rules-icon.png');
  box-shadow: 0 6px 6px rgba(108, 108, 108, 0.12);

  &::before {
    position: absolute;
    content: '';
    left: 5px;
    top: 5px;
    border: 2px solid #fff;
    border-top-left-radius: 33px;
    border-bottom-left-radius: 33px;
    border-right: 0;
    width: 235px;
    height: 66px;
  }
}
.design {
  font-family: $font-family;

  &-header {
    height: 208px;
  }

  &-main {
    width: 1480px;
  }
}
.search {
  width: 900px;
  height: 80px;

  &-input {
    left: 0;
    top: 0;
    padding-left: 40px;
    width: 900px;
    height: 80px;
    font-size: 32px;
    color: #fff;
    background-color: #86b2b3;
    box-shadow: inset 0px 0px 2px 0px rgba(87, 103, 125, 0.5);

    &::placeholder {
      color: #fff;
      opacity: 0.6;
    }
  }

  &-btn {
    top: 2px;
    right: 2px;
    width: 140px;
    height: 76px;
    background-color: #fff;
    background-size: 50px 50px;
    background-image: url('@/assets/images/dayofdesign01/dayofdesign01-post-exhibit/search-btn.png');
    box-shadow: 0 2px 6px rgba(108, 108, 108, 0.3);

    &:hover {
      border: 3px solid #809bab;
    }

    &:active {
      border: 0;
      background-color: #d7e3f0;
    }
  }
}
.nav-btn {
  margin-left: 29px;
  width: 260px;
  height: 76px;
  font-size: 34px;
  color: $font-color;
  box-shadow: 0 6px 6px rgba(108, 108, 108, 0.12);
}
.nav-icon {
  width: 50px;
  height: 50px;
}
</style>
