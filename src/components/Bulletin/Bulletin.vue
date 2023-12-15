<template>
  <div class="bulletin flex h-screen flex-col items-center justify-center">
    <div class="bulletin-wrapper">
      <div class="flex justify-between">
        <van-swipe
          class="swipe"
          :style="generateDynamicStyles({ width: 1260, height: 712 })"
          :autoplay="3000"
          indicator-color="white"
        >
          <van-swipe-item>
            <img src="images/banner1.jpg" class="w-full" alt="" />
          </van-swipe-item>
          <van-swipe-item
            ><img src="images/banner2.jpg" class="w-full" alt=""
          /></van-swipe-item>
          <van-swipe-item
            ><img src="images/banner3.jpg" class="w-full" alt=""
          /></van-swipe-item>
        </van-swipe>
        <div
          class="flex flex-col-reverse"
          :style="generateDynamicStyles({ width: 330 })"
        >
          <p class="mt-4">
            <img src="/images/fixed1.jpg" alt="加入创作匠" />
          </p>
          <p>
            <img src="/images/fixed2.jpg" alt="光遇编年史" />
          </p>
        </div>
      </div>
      <div class="sidebar flex">
        <div
          class="sidebar-item"
          :style="
            generateDynamicStyles({ width: 520, height: 294, marginRight: 30 })
          "
        >
          <img src="images/sidebar1.jpg" alt="" />
        </div>
        <div
          class="sidebar-item"
          :style="
            generateDynamicStyles({ width: 520, height: 294, marginRight: 30 })
          "
        >
          <img src="images/sidebar2.jpg" alt="" />
        </div>
        <div
          class="sidebar-item"
          :style="generateDynamicStyles({ width: 520, height: 294 })"
        >
          <img src="images/sidebar3.jpg" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import { type DesignConfig } from '@/types'

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

fetch('/data.json')
  .then((res) => res.json())
  .then((data) => {
    console.log(data)
  })
  .catch((error) => {
    console.error('Error fetching JSON:', error)
  })
</script>

<style scoped>
.bulletin {
  width: 2100px;
  /* overflow: scroll; */
}
.swipe {
  overflow: hidden;
}
.van-swipe-item {
  color: #fff;
  font-size: 60px;
  text-align: center;
  background-color: #39a9ed;
}
.sidebar {
  margin-top: 30px;
}
</style>
