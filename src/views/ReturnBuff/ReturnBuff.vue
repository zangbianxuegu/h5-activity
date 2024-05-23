<template>
  <div class="return-buff">
    <div :class="['return-buff-main flex', `return-buff--${curPage}`]">
      <nav>
        <ul class="nav">
          <li
            v-for="item in subMenuData"
            :key="item.label"
            :class="[
              'nav-item cursor-pointer',
              isMenuItemActive(item) ? 'active' : '',
              item.isNew || !item.isClaimedReward ? 'nav-item--new' : '',
            ]"
            @click="handleNav(item)"
          >
            {{ item.label }}
          </li>
        </ul>
      </nav>
      <main class="return-main h-full w-full">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { type MenuItem, type DesignConfig } from '@/types'
import { useMenuStore } from '@/stores/menu'
import useResponsiveStyles from '@/composables/useResponsiveStyles'

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

const menuStore = useMenuStore()
const menuData = computed(() => menuStore.menuData)
const subMenuData = computed(
  () =>
    menuData.value.find((item) => item.value === 'activity_return_buff')
      ?.children || [],
)

const router = useRouter()
const route = useRoute()
console.log('route123: ', route)

// 判断当前菜单是否选中 isActive
function isMenuItemActive(item: MenuItem): boolean {
  const module = route?.meta?.module
  if (module && typeof module === 'string') {
    return item.value === module
  }
  return false
}

const curPage = ref(
  typeof route.name === 'string' ? route.name.toLowerCase() : 'reunion',
)

function handleNav(curItem: MenuItem): void {
  curPage.value = curItem.routeName.toLowerCase()
  void router.push({ name: curItem.routeName }).catch((err) => {
    console.error('Failed to navigate: ', err)
  })
}
</script>

<style scoped>
.test {
  border: 1px solid red;
  color: #fff;
}
.return-buff {
  position: relative;
  width: 2100px;
  height: 1200px;

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
  }

  &--reunion {
    background-image: url('@/assets/images/return-buff/reunion/bg.jpg');
  }

  &--setout {
    background-image: url('@/assets/images/return-buff/setout/bg.jpg');
  }

  &--together {
    background-image: url('@/assets/images/return-buff/together/bg.jpg');
  }
}
.nav {
  position: relative;
  left: 18px;
  top: 154px;
}
.nav-item {
  position: relative;
  margin-bottom: 46px;
  text-indent: -9999px;
  width: 220px;
  height: 130px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  &:nth-child(1) {
    background-image: url('@/assets/images/return-buff/menu-reunion.png');

    &.active {
      background-image: url('@/assets/images/return-buff/menu-reunion-active.png');
    }
  }

  &:nth-child(2) {
    background-image: url('@/assets/images/return-buff/menu-setout.png');

    &.active {
      background-image: url('@/assets/images/return-buff/menu-setout-active.png');
    }
  }

  &:nth-child(3) {
    background-image: url('@/assets/images/return-buff/menu-together.png');

    &.active {
      background-image: url('@/assets/images/return-buff/menu-together-active.png');
    }
  }

  &--new {
    &::after {
      position: absolute;
      right: -30px;
      top: 20px;
      display: block;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgb(184, 25, 26);
    }
  }
}
</style>
