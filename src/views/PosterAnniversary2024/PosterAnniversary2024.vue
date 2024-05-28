<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="poster-anniversary-2024 flex h-screen">
      <div class="poster-anniversary-2024-main">
        <div class="animate__animated animate__fadeIn bg-top">
          <img :class="titleImg.class" :src="titleImg.src" />
        </div>
        <Transition
          v-for="img in imgList"
          :key="img.key"
          appear
          :name="img.transitionName"
          mode="out-in"
        >
          <img
            v-show="img.show"
            :class="img.class"
            :src="img.src"
            :alt="img.alt"
          />
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { type DesignConfig } from '@/types'
import useResponsiveStyles from '@/composables/useResponsiveStyles'
import sxsb from '@/assets/images/poster-anniversary-2024/sxsb.png'
import sbxh from '@/assets/images/poster-anniversary-2024/sbxh.png'
import mrrwewjl6 from '@/assets/images/poster-anniversary-2024/mrrwewjl6.png'
import mrrwewjl7 from '@/assets/images/poster-anniversary-2024/mrrwewjl7.png'
import cwpdxxb from '@/assets/images/poster-anniversary-2024/cwpdxxb.png'
import xgjnh from '@/assets/images/poster-anniversary-2024/xgjnh.png'
import jnhhd from '@/assets/images/poster-anniversary-2024/jnhhd.png'
import mmjdzhfl from '@/assets/images/poster-anniversary-2024/mmjdzhfl.png'
import title from '@/assets/images/poster-anniversary-2024/title.png'

const titleImg = reactive({
  src: title,
  class: ['title-img', 'animate__animated'],
})

interface Img {
  key: string
  src: string
  alt: string
  class: string[]
  transitionName: string
  show: boolean
}

const imgList = reactive<Img[]>([
  {
    key: 'sxsb',
    src: sxsb,
    alt: '送心双倍',
    class: ['sxsb'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'sbxh',
    src: sbxh,
    alt: '双倍心火',
    class: ['sbxh'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'mrrwewjl6',
    src: mrrwewjl6,
    alt: '每日任务额外奖励6/21-6/27',
    class: ['mrrwewjl6'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'mrrwewjl7',
    src: mrrwewjl7,
    alt: '每日任务额外奖励7/09-7/15',
    class: ['mrrwewjl7'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'cwpdxxb',
    src: cwpdxxb,
    alt: '成为派对新星吧！',
    class: ['cwpdxxb'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'xgjnh',
    src: xgjnh,
    alt: '巡光嘉年华',
    class: ['xgjnh'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'jnhhd',
    src: jnhhd,
    alt: '嘉年华活动',
    class: ['jnhhd'],
    transitionName: 'img-in',
    show: false,
  },
  {
    key: 'mmjdzhfl',
    src: mmjdzhfl,
    alt: '秘密基地烛火福利',
    class: ['mmjdzhfl'],
    transitionName: 'img-in',
    show: false,
  },
])

let listener: (this: HTMLElement, ev: AnimationEvent) => any
const breatheAnimate = ['animate__animated', 'animate__pulse']
const startBreatheImg = (img: Img): void => {
  img.class = img.class.concat(breatheAnimate)
  const imgDom = document.getElementsByClassName(img.key)[0] as HTMLElement
  listener = () => {
    cancelBreatheImg(img, listener)
  }
  imgDom.addEventListener('animationend', listener)
}
const cancelBreatheImg = (
  img: Img,
  listener: (this: HTMLElement, ev: AnimationEvent) => any,
): void => {
  img.class = img.class.filter((e) => !breatheAnimate.includes(e))
  const imgDom = document.getElementsByClassName(img.key)[0] as HTMLElement
  imgDom.removeEventListener('animationend', listener, false)
}

onMounted(() => {
  const timeoutStart = 1500
  let endTimeout = 0
  imgList.forEach((img, index) => {
    endTimeout = timeoutStart + index * 500
    setTimeout(() => {
      img.show = true
    }, endTimeout)
  })
  setTimeout(() => {
    titleImg.class.push('animate__tada')
  }, endTimeout + 500)

  setTimeout(() => {
    const alreadyBreatheList: number[] = []
    setInterval(() => {
      let randomNumber = Math.floor(Math.random() * 8)
      // 一轮轮流不重复
      while (alreadyBreatheList.includes(randomNumber)) {
        randomNumber = Math.floor(Math.random() * 8)
      }
      alreadyBreatheList.push(randomNumber)
      const breatheImg = imgList.find(
        (_, index) => index === randomNumber,
      ) as unknown as Img
      startBreatheImg(breatheImg)
      if (alreadyBreatheList.length === imgList.length) {
        alreadyBreatheList.splice(0, alreadyBreatheList.length)
      }
    }, 2000)
  }, endTimeout + 500)
})

onBeforeUnmount(() => {
  imgList.forEach((img) => {
    const imgDom = document.getElementsByClassName(img.key)[0] as HTMLElement
    imgDom.removeEventListener('animationend', listener, false)
  })
})

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

const bodyTransitionName = ref('')
bodyTransitionName.value = 'fade-in-body'
</script>

<style lang="scss" scoped>
.fade-in-body-enter-active {
  transition: opacity 1s ease-out;
}
.fade-in-body-enter-from {
  opacity: 0.2;
}
.img-in-enter-active {
  transition: opacity 2s ease-out;
}
.img-in-enter-from {
  opacity: 0.2;
}
.poster-anniversary-2024 {
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
  }
}
.bg-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 2040px;
  height: 1140px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url('@/assets/images/poster-anniversary-2024/bg-empty.png');

  .title-img {
    position: absolute;
    top: 100px;
    left: 340px;
    width: 1088px;
    height: 395px;
  }
}
.sxsb {
  position: absolute;
  top: 95px;
  left: 20px;
  width: 289px;
  height: 268px;
}
.sbxh {
  position: absolute;
  top: 100px;
  right: 57px;
  width: 493px;
  height: 208px;
}
.mrrwewjl6 {
  position: absolute;
  top: 358px;
  left: 44px;
  width: 591px;
  height: 259px;
}
.mrrwewjl7 {
  position: absolute;
  top: 320px;
  right: 56px;
  width: 484px;
  height: 219px;
}
.cwpdxxb {
  position: absolute;
  top: 656px;
  left: 60px;
  width: 631px;
  height: 238px;
}
.xgjnh {
  position: absolute;
  top: 535px;
  right: 25px;
  width: 1298px;
  height: 205px;
}
.jnhhd {
  position: absolute;
  top: 745px;
  right: 63px;
  width: 1260px;
  height: 201px;
}
.mmjdzhfl {
  position: absolute;
  left: 50px;
  bottom: 10px;
  width: 1933px;
  height: 197px;
}
</style>
