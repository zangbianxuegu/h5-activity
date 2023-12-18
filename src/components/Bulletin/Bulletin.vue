<template>
  <div class="bulletin flex h-screen flex-col items-center justify-center">
    <div class="bulletin-wrapper">
      <div class="flex justify-between">
        <!-- 轮播图 -->
        <van-swipe
          class="swipe border-r-20"
          :style="generateDynamicStyles({ width: 1260, height: 712 })"
          :autoplay="3000"
          indicator-color="white"
        >
          <van-swipe-item v-for="banner in banners" :key="banner.id">
            <a :href="banner.link_url">
              <img
                :src="`/images/${banner.img_name}`"
                class="border-r-20 w-full"
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
            <a :href="fixed.link_url">
              <img
                :src="`/images/${fixed.img_name}`"
                class="w-full"
                :alt="fixed.name"
              />
            </a>
          </p>
        </div>
      </div>
      <!-- 列表 -->
      <div class="sidebar flex">
        <div
          v-for="(sidebar, index) in sidebars"
          :key="sidebar.id"
          class="sidebar-item"
          :style="
            index === 2
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
          <a :href="sidebar.link_url">
            <img
              :src="`/images/${sidebar.img_name}`"
              class="border-r-20 w-full"
              :alt="sidebar.name"
            />
            <span class="sidebar-tag">{{ sidebar.tag }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { type DesignConfig, type BulletinItem } from '@/types'

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

// px -> vw
const calculatePxToViewport = (px: number): string => {
  return ((px * factor.value) / DESIGN_WIDTH) * 100 + 'vw'
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
const currentDate = new Date()
// 当前应用的渠道
const currentChannel = 'netease'
// 公告页面数据
const bulletinData = ref<BulletinItem[] | null>(null)

// 判断条目是否在有效时间范围内
const isEffective = (item: BulletinItem): boolean => {
  const currentTime = currentDate.getTime()
  const effectiveTime = new Date(item.effective_time).getTime()
  const expiredTime = new Date(item.expired_time).getTime()
  return currentTime >= effectiveTime && currentTime <= expiredTime
}

// 判断条目是否适用于当前渠道
const isChannelApplicable = (item: BulletinItem): boolean => {
  const channels = item.channel.split(',')
  return channels.some((channel) => {
    const [name, value] = channel.split(':')
    return name === currentChannel && value === '1'
  })
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
const banners = filterAndSortItems('banner')
// 固定位数据
const fixeds = filterAndSortItems('fixed')
// 侧边栏数据
const sidebars = filterAndSortItems('sidebar')

// 获取 JSON 数据
const fetchData = async (): Promise<void> => {
  try {
    const res = await fetch('/activity_center.json')
    const data = await res.json()
    bulletinData.value = data
    console.log('data: ', data)
  } catch (error) {
    console.error('Error fetching JSON:', error)
    // Implement user-friendly error handling here
  }
}
fetchData().catch((error) => {
  // Handle any errors that weren't caught in fetchData
  console.error('Unhandled error during fetchData:', error)
})
</script>

<style scoped>
.bulletin {
  width: 2100px;
  /* overflow: scroll; */
}
.test {
  border: 1px solid red;
}
.swipe {
  overflow: hidden;
}
.van-swipe-item {
  color: #fff;
  font-size: 60px;
  text-align: center;
  /* background-color: #39a9ed; */
}
.border-r-20 {
  border-radius: 20px;
}
.sidebar {
  margin-top: 30px;
  /* width: 1620px;
  height: 294px; */
  /* overflow-x: scroll; */

  &-item {
    position: relative;
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
