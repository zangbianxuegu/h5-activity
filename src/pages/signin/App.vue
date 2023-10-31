<template>
  <div class="page bg-cover bg-center bg-no-repeat" ref="page">
    <div
      class="close overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
    >
      关闭
    </div>
    <nav class="nav z-10">
      <ul>
        <li
          class="nav-item nav-item-first overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{ active: isNavOneActive }"
          @click="handleChangeMainTab(1)"
        >
          假日打卡
        </li>
        <li
          class="nav-item nav-item-second overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{ active: isNavTwoActive }"
          @click="handleChangeMainTab(2)"
        >
          签到活动
        </li>
        <li
          class="nav-item nav-item-third bg-contain bg-center bg-no-repeat"
        ></li>
      </ul>
    </nav>
    <nav class="sub-nav z-10" :class="{ active: isSubNavActive }" ref="subNav">
      <img
        class="sub-nav-bg"
        src="@/assets/images/signin/sub-nav-bg.png"
        alt="sub-nav"
      />
      <ul class="sub-nav-list">
        <li
          class="sub-nav-item sub-nav-item-one overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{ active: isSubNavOneActive }"
          @click="handleChangeSubTab(1)"
        >
          冬季签到
        </li>
        <li
          class="sub-nav-item sub-nav-item-two overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{ active: isSubNavTwoActive }"
          @click="handleChangeSubTab(2)"
        >
          暑假签到
        </li>
        <li
          class="sub-nav-item sub-nav-item-three disabled overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
        >
          新年寄语
        </li>
      </ul>
    </nav>
    <!-- 假日打卡 -->
    <div
      class="page-common page-one active h-full w-full bg-cover bg-center bg-no-repeat"
      ref="pageOne"
    >
      <activity-signin />
    </div>
    <!-- 冬季签到 -->
    <div
      class="page-common page-two h-full w-full bg-cover bg-center bg-no-repeat"
      ref="pageTwo"
    >
      <activity-winter />
    </div>
    <!-- 夏季签到 -->
    <div
      class="page-common page-three h-full w-full bg-cover bg-center bg-no-repeat"
      ref="pageThree"
    >
      <activity-summer />
    </div>
  </div>
</template>

<script setup lang="ts">
import ActivitySignin from './components/activity-signin.vue'
import ActivityWinter from './components/activity-winter.vue'
import ActivitySummer from './components/activity-summer.vue'

const isNavOneActive = ref(true)
const isNavTwoActive = ref(false)
const isSubNavActive = ref(false)
const isSubNavOneActive = ref(true)
const isSubNavTwoActive = ref(false)

const pageOne = ref<HTMLDivElement | null>(null)
const pageTwo = ref<HTMLDivElement | null>(null)
const pageThree = ref<HTMLDivElement | null>(null)
const subNav = ref<HTMLDivElement | null>(null)

function handleChangeMainTab(index: number): void {
  switch (index) {
    case 1:
      isNavOneActive.value = true
      isNavTwoActive.value = false
      isSubNavActive.value = false
      pageOne.value?.classList.add('active')
      pageTwo.value?.classList.remove('active')
      pageThree.value?.classList.remove('active')
      break
    case 2:
      isNavOneActive.value = false
      isNavTwoActive.value = true
      isSubNavActive.value = true
      pageOne.value?.classList.remove('active')
      pageTwo.value?.classList.add('active')
      pageThree.value?.classList.remove('active')
      break
  }
}

function handleChangeSubTab(index: number): void {
  switch (index) {
    case 1:
      isSubNavOneActive.value = true
      isSubNavTwoActive.value = false
      pageOne.value?.classList.remove('active')
      pageTwo.value?.classList.add('active')
      pageThree.value?.classList.remove('active')
      break
    case 2:
      isSubNavOneActive.value = false
      isSubNavTwoActive.value = true
      pageOne.value?.classList.remove('active')
      pageTwo.value?.classList.remove('active')
      pageThree.value?.classList.add('active')
      break
  }
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background-image: url('@/assets/images/signin/bg.jpg');
}
.close {
  position: absolute;
  top: 57px;
  right: 82px;
  width: 62px;
  height: 62px;
  background-image: url('@/assets/images/signin/close.png');
}
.nav {
  position: absolute;
  width: 360px;
  height: 100%;
}
.nav-item {
  position: absolute;

  &.active {
    &::after {
      position: absolute;
      right: 0;
      display: block;
      content: '';
      width: 20px;
      height: 20px;
      border-radius: 20px;
      background-color: rgb(184, 25, 26);
    }
  }

  &-first {
    left: 81px;
    top: 122px;
    width: 159px;
    height: 165px;
    background-image: url('@/assets/images/signin/nav1.png');

    &.active {
      left: 67px;
      top: 98px;
      width: 216px;
      height: 232px;
      background-image: url('@/assets/images/signin/nav1-active.png');

      &::after {
        top: 20px;
      }
    }
  }

  &-second {
    left: 134px;
    top: 366px;
    width: 162px;
    height: 195px;
    background-image: url('@/assets/images/signin/nav2.png');

    &.active {
      left: 124px;
      top: 355px;
      width: 218px;
      height: 235px;
      background-image: url('@/assets/images/signin/nav2-active.png');

      &::after {
        top: 40px;
      }
    }
  }

  &-third {
    left: 80px;
    top: 653px;
    width: 158px;
    height: 220px;
    background-image: url('@/assets/images/signin/nav3.png');
    &.active {
      &::after {
        top: 40px;
      }
    }
  }
}
.sub-nav {
  display: none;
  position: absolute;
  left: 442px;
  top: 310px;

  &.active {
    display: block;
  }

  &-bg {
    position: absolute;
    top: 100px;
    width: 36px;
    height: 305px;
  }

  &-list {
    margin-left: -30px;
  }

  &-item {
    margin-bottom: 85px;

    &.active {
      position: relative;
      &::after {
        position: absolute;
        right: 0;
        top: 20px;
        display: block;
        content: '';
        width: 20px;
        height: 20px;
        border-radius: 20px;
        background-color: rgb(184, 25, 26);
      }
    }

    &-one {
      width: 298px;
      height: 116px;
      background-image: url('@/assets/images/signin/sub-nav1.png');
      &.active {
        background-image: url('@/assets/images/signin/sub-nav1-active.png');
      }
      &.disabled {
        background-image: url('@/assets/images/signin/sub-nav1-disabled.png');
      }
    }

    &-two {
      width: 278px;
      height: 104px;
      background-image: url('@/assets/images/signin/sub-nav2.png');
      &.active {
        background-image: url('@/assets/images/signin/sub-nav2-active.png');
      }
      &.disabled {
        background-image: url('@/assets/images/signin/sub-nav2-disabled.png');
      }
    }

    &-three {
      width: 299px;
      height: 109px;
      background-image: url('@/assets/images/signin/sub-nav3.png');
      &.active {
        background-image: url('@/assets/images/signin/sub-nav3-active.png');
      }
      &.disabled {
        background-image: url('@/assets/images/signin/sub-nav3-disabled.png');
      }
    }
  }
}
.page-common {
  display: none;

  &.active {
    display: block;
  }
}
.page-one {
  background-image: url('@/assets/images/signin/signin-bg.jpg');
}
.page-two {
  background-image: url('@/assets/images/signin/winter-bg.jpg');
}
.page-three {
  background-image: url('@/assets/images/signin/summer-bg.jpg');
}
</style>
