<template>
  <div class="bulletin flex h-screen flex-col items-center justify-center">
    <div class="bulletin-wrapper">
      <div class="flex">
        <!-- 轮播图 -->
        <van-swipe
          class="swipe border-r-10"
          :autoplay="3000"
          indicator-color="white"
          :style="generateDynamicStyles({ width: 1260, height: 712 })"
        >
          <van-swipe-item v-for="banner in banners" :key="banner.id">
            <a
              :href="banner.link_url || 'javascript:void(0)'"
              @click="handleItemClick(banner)"
            >
              <img
                :src="`./images/${banner.img_name}`"
                class="border-r-10 w-full"
                :alt="banner.name"
              />
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
              :href="fixed.link_url || 'javascript:void(0)'"
              @click="handleItemClick(fixed)"
            >
              <img
                :src="`./images/${fixed.img_name}`"
                class="w-full"
                :alt="fixed.name"
              />
            </a>
          </p>
        </div>
      </div>
      <!-- 列表 -->
      <div class="sidebar flex" :style="generateDynamicStyles({ width: 1620 })">
        <div
          v-for="(sidebar, index) in sidebars"
          :key="sidebar.id"
          class="sidebar-item"
          :style="
            index === (sidebars && sidebars.length - 1)
              ? generateDynamicStyles({
                  width: 520,
                  height: 294,
                })
              : generateDynamicStyles({
                  width: 520,
                  height: 294,
                  marginRight: 30,
                })
          "
        >
          <a
            :href="sidebar.link_url || 'javascript:void(0)'"
            @click="handleItemClick(sidebar)"
          >
            <img
              :src="`./images/${sidebar.img_name}`"
              class="border-r-10 w-full"
              :alt="sidebar.name"
            />
            <span
              class="sidebar-tag"
              :style="generateDynamicStyles({ fontSize: 34 })"
              >{{ sidebar.tag }}</span
            >
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
import { webViewStatistics } from '@/utils/request'
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
const DESIGN_BULLETIN_WIDTH = 2100 - 60
// 设计稿主体高，同宽。
const DESIGN_BULLETIN_HEIGHT = 1200 - 60
// 设计稿主体内容宽
const DESIGN_BULLETIN_CONTENT_WIDTH = 1620
// 设计稿主体内容高
const DESIGN_BULLETIN_CONTENT_HEIGHT = 1036
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
const fixeds = filterAndSortItems('fixed')
// 侧边栏数据
const sidebars = filterAndSortItems('sidebar')

// 获取 JSON 数据
const fetchData = async (): Promise<void> => {
  try {
    const res = await fetch('./activity_center.json')
    const data = await res.json()
    bulletinData.value = data
    console.log('data: ', data)
  } catch (error) {
    console.error('Error fetching JSON:', error)
    // Implement user-friendly error handling here
  }
}
onMounted(() => {
  fetchData().catch((error) => {
    // Handle any errors that weren't caught in fetchData
    console.error('Unhandled error during fetchData:', error)
  })
})

// 日志数据上报
function handleWebViewStatistics(module: string): void {
  webViewStatistics({ module })
    .then(() => {
      showToast('日志数据上报成功')
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 点击事件
function handleItemClick(item: BulletinItem): void {
  if (item.link_url) {
    handleWebViewStatistics(item.name)
  } else {
    showToast('敬请期待')
  }
}
</script>

<style scoped>
.bulletin {
  width: 2100px;
  /* overflow: hidden; */
}
.test {
  border: 1px solid red;
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
  overflow-x: scroll;

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
</style>
