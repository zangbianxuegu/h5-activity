<template>
  <div class="bulletin flex h-screen flex-col items-center justify-center">
    <div class="bulletin-wrapper">
      <div class="flex">
        <!-- 轮播图 -->
        <van-swipe
          class="swipe border-r-10"
          :autoplay="3000"
          indicator-color="white"
          :style="generateDynamicStyles({ width: 1260 + 4, height: 712 + 4 })"
        >
          <van-swipe-item v-for="banner in banners" :key="banner.id">
            <a
              class="bulletin-item"
              draggable="false"
              :href="banner.link_url || 'javascript:void(0)'"
              @click="handleItemClick(banner, $event)"
            >
              <img
                :src="`./images/${banner.img_name}`"
                class="img-border img-effect w-full"
                :alt="banner.name"
              />
              <div class="overlay"></div>
            </a>
          </van-swipe-item>
        </van-swipe>
        <!-- 固定位 -->
        <div
          class="flex flex-col-reverse pb-0.5"
          :style="generateDynamicStyles({ width: 330, marginLeft: 30 })"
        >
          <p v-for="fixed in fixeds" :key="fixed.id" class="mt-4">
            <a
              class="bulletin-item"
              draggable="false"
              :href="fixed.link_url || 'javascript:void(0)'"
              @click="handleItemClick(fixed, $event)"
            >
              <img
                :src="`./images/${fixed.img_name}`"
                class="img-effect w-full"
                :alt="fixed.name"
              />
              <div class="overlay"></div>
            </a>
          </p>
        </div>
      </div>
      <!-- 列表 -->
      <div
        class="sidebar flex"
        :style="generateDynamicStyles({ width: 1620 + 12 })"
      >
        <div
          v-for="(sidebar, index) in sidebars"
          :key="sidebar.id"
          class="sidebar-item"
          :style="
            index === (sidebars && sidebars.length - 1)
              ? generateDynamicStyles({
                  width: 520 + 4,
                  height: 294 + 4,
                })
              : generateDynamicStyles({
                  width: 520 + 4,
                  height: 294 + 4,
                  marginRight: 30,
                })
          "
        >
          <a
            class="bulletin-item"
            href="javascript:void(0)"
            draggable="false"
            @click="handleItemClick(sidebar, $event)"
          >
            <img
              :src="`./images/${sidebar.img_name}`"
              class="img-border w-full"
              :alt="sidebar.name"
            />
            <span
              v-if="sidebar.tag"
              class="sidebar-tag"
              :style="generateDynamicStyles({ fontSize: 34 })"
              >{{ sidebar.tag }}</span
            >
            <div class="overlay"></div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { type DesignConfig, type BulletinItem } from '@/types'
import { showToast } from 'vant'
import { webViewStatistics } from '@/apis/base'
import { useBaseStore } from '@/stores/base'

// 基本信息
const baseStore = useBaseStore()
let currentTime = baseStore.baseInfo.currentTime
const currentChannel = baseStore.baseInfo.channel

// 设计稿宽
const DESIGN_WIDTH = 2560
// 设计稿高
const DESIGN_HEIGHT = 1200
// 设计稿主体宽，减去边距：因为我们要保留主体部分的边距。
// 会影响最终计算出来的缩放系数，影响元素转换的实际大小，所以只能在这里减去，而不能在元素上写边距。
// 0509 update 图片增加 2px 边框，整体高度增加 8px，宽度增加 12px
const DESIGN_BULLETIN_WIDTH = 2100 - 60 + 12
// 设计稿主体高，同宽。
const DESIGN_BULLETIN_HEIGHT = 1200 - 60 + 8
// 设计稿主体内容宽
const DESIGN_BULLETIN_CONTENT_WIDTH = 1620 + 12
// 设计稿主体内容高
const DESIGN_BULLETIN_CONTENT_HEIGHT = 1036 + 8
// 设计稿主体内容宽高比
const DESIGN_BULLETIN_CONTENT_RATIO =
  DESIGN_BULLETIN_CONTENT_WIDTH / DESIGN_BULLETIN_CONTENT_HEIGHT

// 配置参数
const designConfig: DesignConfig = {
  designWidth: DESIGN_WIDTH,
  designHeight: DESIGN_HEIGHT,
  designMainWidth: DESIGN_BULLETIN_WIDTH,
  designMainHeight: DESIGN_BULLETIN_HEIGHT,
  designMainContentWidth: DESIGN_BULLETIN_CONTENT_WIDTH,
  designMainContentHeight: DESIGN_BULLETIN_CONTENT_HEIGHT,
  designMainContentRatio: DESIGN_BULLETIN_CONTENT_RATIO,
}

// 缩放系数
const { factor } = useResponsiveStyles(designConfig)
console.log('factor: ', factor.value)

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

// 当前日期
// 服务端是否返回了当前时间
if (currentTime) {
  currentTime = currentTime * 1000
} else {
  currentTime = new Date().getTime()
}
// 公告页面数据
const bulletinData = ref<BulletinItem[] | null>(null)

// 判断条目是否在有效时间范围内
const isEffective = (item: BulletinItem): boolean => {
  const effectiveTime = dayjs(item.effective_time).valueOf()
  const expiredTime = dayjs(item.expired_time).valueOf()
  return currentTime >= effectiveTime && currentTime <= expiredTime
}

// 判断条目是否适用于当前渠道
const isChannelApplicable = (item: BulletinItem): boolean => {
  const channelsArr = item.channel.split(',')
  const channelsObj: Record<string, number> = {}
  channelsArr.forEach((channel) => {
    const [name, value] = channel.split(':')
    channelsObj[name.trim()] = parseInt(value, 10)
  })
  const hasChannel = Object.prototype.hasOwnProperty.call(
    channelsObj,
    currentChannel,
  )
  const hasOther = Object.prototype.hasOwnProperty.call(channelsObj, 'other')
  return (
    (hasChannel && channelsObj[currentChannel] === 1) ||
    (!hasChannel && hasOther && channelsObj.other === 1)
  )
}

// 创建过滤和排序后的计算属性
const filterAndSortItems = (
  type: string,
): ComputedRef<BulletinItem[] | undefined> => {
  return computed(() => {
    return bulletinData.value
      ?.filter((item: BulletinItem) => item.type === type)
      .filter(isEffective)
      .filter(isChannelApplicable)
      .sort((a: BulletinItem, b: BulletinItem) => a.priority - b.priority)
  })
}

// 轮播图数据
const banners = computed(() => filterAndSortItems('banner').value?.slice(0, 6))
// 固定位数据
const fixeds = computed(() =>
  filterAndSortItems('fixed').value?.slice(0, 2).reverse(),
)
// 侧边栏数据
const sidebars = computed(() =>
  filterAndSortItems('sidebar').value?.slice(0, 3),
)

// 获取 JSON 数据
const fetchData = async (): Promise<void> => {
  try {
    const res = await fetch('./activity_center.json')
    const data = await res.json()
    if (!data || data.length === 0) {
      showToast('网络连接异常，请稍后重试')
      return
    }
    bulletinData.value = data
  } catch (error) {
    console.error('Error fetching JSON:', error)
    showToast('网络连接异常，请稍后重试')
  }
}
onMounted(() => {
  fetchData().catch((error) => {
    // Handle any errors that weren't caught in fetchData
    console.error('Unhandled error during fetchData:', error)
  })
})

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload()
  }
})

// 日志数据上报
function handleWebViewStatistics(module: string): void {
  void webViewStatistics({ module }).then(() => {
    // showToast('日志数据上报成功')
  })
}

// 点击事件
function handleItemClick(item: BulletinItem, event: MouseEvent): void {
  const overlay = (
    event.currentTarget as HTMLElement
  ).querySelector<HTMLElement>('.overlay')
  if (overlay) {
    overlay.style.opacity = '1'
    overlay.addEventListener(
      'transitionend',
      (e: TransitionEvent) => {
        if (e.propertyName === 'opacity' && item.link_url) {
          window.location.href = item.link_url
        } else {
          showToast('敬请期待')
        }
      },
      { once: true },
    )
  }
  if (item.link_url) {
    handleWebViewStatistics(item.name)
  }
}
</script>

<style scoped>
.bulletin {
  width: 2100px;
  /* overflow: hidden; */
}
.swipe {
  overflow: hidden;
  width: calc(1260px * var(--scale-factor));
  height: calc(712px * var(--scale-factor));
}
.van-swipe-item {
  color: #fff;
  font-size: 60px;
  text-align: center;
  /* background-color: #39a9ed; */
}
.border-r-10 {
  border-radius: 10px;
}
.sidebar {
  margin-top: 30px;
  /* width: 1620px;
  height: 294px; */

  &-item {
    position: relative;
    flex-shrink: 0;
  }

  &-tag {
    position: absolute;
    right: 0;
    top: 20px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    padding: 0 30px;
    height: 48px;
    line-height: 48px;
    color: #fff;
    font-size: 34px;
    background: #3ac2ee;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13);
  }
}
.bulletin-item {
  position: relative;
  display: block;
}
.overlay {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(2, 4, 52, 0.3);
  opacity: 0;
  transition: opacity 0.1s ease;
}
.img-border {
  border: 2px solid #62638f;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.75);
}
</style>
