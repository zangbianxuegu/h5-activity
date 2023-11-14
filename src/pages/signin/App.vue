<template>
  <div id="activity" class="page bg-cover bg-center bg-no-repeat" ref="page">
    <div
      class="close z-10 overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      @click="handleClose"
    >
      关闭
    </div>
    <nav class="nav z-10">
      <ul>
        <li
          v-if="isActivityActive.signin"
          class="nav-item nav-item-first overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{ active: isNavOneActive, new: isShowRedDot.signin }"
          @click="handleChangeMainTab(1)"
        >
          假日打卡
        </li>
        <li
          v-if="isActivityActive.winter || isActivityActive.summer"
          class="nav-item nav-item-second overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{
            active: isNavTwoActive,
            new: isShowRedDot.winter || isShowRedDot.summer,
          }"
          @click="handleChangeMainTab(2)"
        >
          签到活动
        </li>
        <li
          class="nav-item nav-item-third bg-contain bg-center bg-no-repeat"
        ></li>
      </ul>
    </nav>
    <nav
      v-if="isActivityActive.winter || isActivityActive.summer"
      class="sub-nav z-10"
      :class="{
        active: isSubNavActive,
        'pointer-events-none': !isSubNavActive,
      }"
      ref="subNav"
    >
      <img
        class="sub-nav-bg"
        src="@/assets/images/signin/sub-nav-bg.png"
        alt="sub-nav"
      />
      <ul class="sub-nav-list">
        <li
          v-if="isActivityActive.winter"
          class="sub-nav-item sub-nav-item-one overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{
            active: isSubNavOneActive,
            new: isShowRedDot.winter,
          }"
          @click="handleChangeSubTab(1)"
        >
          冬季签到
        </li>
        <li
          v-if="isActivityActive.summer"
          class="sub-nav-item sub-nav-item-two overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          :class="{
            active: isSubNavTwoActive,
            new: isShowRedDot.summer,
          }"
          @click="handleChangeSubTab(2)"
        >
          暑假签到
        </li>
        <li
          class="sub-nav-item sub-nav-item-three disabled pointer-events-none overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
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
      <activity-signin
        :time="formatDate(allActiveEvents.activity_sign_in_1!)"
        @on-reward="handleSetIsClaimedReward('signin', $event)"
      />
    </div>
    <!-- 冬季签到 -->
    <div
      class="page-common page-two h-full w-full bg-cover bg-center bg-no-repeat"
      ref="pageTwo"
    >
      <activity-winter
        :time="formatDate(allActiveEvents.activity_sign_in_2!)"
        @on-reward="handleSetIsClaimedReward('winter', $event)"
      />
    </div>
    <!-- 夏季签到 -->
    <div
      class="page-common page-three h-full w-full bg-cover bg-center bg-no-repeat"
      ref="pageThree"
    >
      <activity-summer
        :time="formatDate(allActiveEvents.activity_sign_in_3!)"
        @on-reward="handleSetIsClaimedReward('summer', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { getPlayerMissionData, setWebRedDot } from '@/utils/request'
import ActivitySignin from './components/activity-signin.vue'
import ActivityWinter from './components/activity-winter.vue'
import ActivitySummer from './components/activity-summer.vue'

interface IsActivity {
  signin: number
  winter: number
  summer: number
}

interface Activity {
  start_time: number
  end_time: number
  active: number
  is_claimed_reward: number
  is_new: number
}

interface AllActiveEvents {
  activity_sign_in_1: Activity
  activity_sign_in_2: Activity
  activity_sign_in_3: Activity
}

const isNavOneActive = ref(true)
const isNavTwoActive = ref(false)
const isSubNavActive = ref(false)
const isSubNavOneActive = ref(true)
const isSubNavTwoActive = ref(false)

const pageOne = ref<HTMLDivElement | null>(null)
const pageTwo = ref<HTMLDivElement | null>(null)
const pageThree = ref<HTMLDivElement | null>(null)
const subNav = ref<HTMLDivElement | null>(null)

const isActivityActive = ref({
  signin: true,
  winter: true,
  summer: true,
})

// const isTodaySignIn: Ref<IsTodaySignIn> = ref({
//   signin: false,
//   winter: false,
//   summer: false,
// })

let allActiveEvents: AllActiveEvents = {
  activity_sign_in_3: {
    start_time: 1698768000,
    end_time: 1699977600,
    active: 1,
    is_claimed_reward: 0,
    is_new: 0,
  },
  activity_sign_in_2: {
    start_time: 1698768000,
    end_time: 1699977600,
    active: 1,
    is_claimed_reward: 0,
    is_new: 0,
  },
  activity_sign_in_1: {
    start_time: 1698768000,
    end_time: 1699977600,
    active: 1,
    is_claimed_reward: 0,
    is_new: 0,
  },
}

// 是否已领奖
const isClaimedReward: Ref<IsActivity> = ref({
  signin: 1,
  winter: 1,
  summer: 1,
})

// 是否新活动
const isNew: Ref<IsActivity> = ref({
  signin: 0,
  winter: 0,
  summer: 0,
})

// 是否显示红点
const isShowRedDot = computed(() => {
  return {
    signin: isClaimedReward.value.signin === 0 || isNew.value.signin === 1,
    winter: isClaimedReward.value.winter === 0 || isNew.value.winter === 1,
    summer: isClaimedReward.value.summer === 0 || isNew.value.summer === 1,
  }
})

onMounted(() => {
  try {
    getAllEvents()
  } catch (error) {
    console.error(error)
  }
})

// 设置是否已领奖状态
function handleSetIsClaimedReward(type: keyof IsActivity, value: number): void {
  isClaimedReward.value[type] = value
}

// 获取所有活动信息
function getAllEvents(): void {
  getPlayerMissionData({}, function (res) {
    console.log('APP res: ', res)

    // 判断活动是否显示
    function isValidAllActiveEvents(obj: any): obj is AllActiveEvents {
      return (
        'activity_sign_in_1' in obj &&
        'activity_sign_in_2' in obj &&
        'activity_sign_in_3' in obj
      )
    }
    const activeEvents = Object.fromEntries(
      Object.entries(res).filter(
        ([_, value]) => (value as Activity).active === 1,
      ),
    )
    if (isValidAllActiveEvents(activeEvents)) {
      allActiveEvents = activeEvents
    } else {
      console.error('activeEvents is not a valid AllActiveEvents object')
    }
    // 测试
    // allActiveEvents.activity_sign_in_1.start_time =
    //   Math.floor(Date.now() / 1000) + 60
    // allActiveEvents.activity_sign_in_2.start_time =
    //   Math.floor(Date.now() / 1000) + 60
    // allActiveEvents.activity_sign_in_3.start_time =
    //   Math.floor(Date.now() / 1000) + 60

    // 设置活动状态
    isActivityActive.value = {
      signin: getActivityStatus(allActiveEvents.activity_sign_in_1),
      winter: getActivityStatus(allActiveEvents.activity_sign_in_2),
      summer: getActivityStatus(allActiveEvents.activity_sign_in_3),
    }

    // 设置红点信息：是否已领奖、是否新活动
    isClaimedReward.value.signin =
      allActiveEvents.activity_sign_in_1.is_claimed_reward
    isClaimedReward.value.winter =
      allActiveEvents.activity_sign_in_2.is_claimed_reward
    isClaimedReward.value.summer =
      allActiveEvents.activity_sign_in_3.is_claimed_reward
    isNew.value.signin = allActiveEvents.activity_sign_in_1.is_new
    isNew.value.winter = allActiveEvents.activity_sign_in_2.is_new
    isNew.value.summer = allActiveEvents.activity_sign_in_3.is_new

    // 设置初始状态
    if (isActivityActive.value.signin) {
      handleChangeMainTab(1)
    } else {
      handleChangeMainTab(2)
    }
  })
}

// 判断活动是否 active
function getActivityStatus(activity: Activity): boolean {
  const now = Date.now()
  return (
    now >= activity.start_time * 1000 &&
    now <= activity.end_time * 1000 &&
    activity.active === 1
  )
}

// 格式化日期
function formatDate(activity: Activity): string {
  const startTime = dayjs.unix(activity.start_time)
  const endTime = dayjs.unix(activity.end_time)
  return `${startTime.format('M.D')}-${endTime.format('M.D')}`
}

// function handleMainTransition(index: number): void {
//   if (!document.startViewTransition) {
//     handleChangeMainTab(index)
//   }
//   document.startViewTransition(() => {
//     handleChangeMainTab(index)
//   })
// }

// function handleSubTransition(index: number): void {
//   if (!document.startViewTransition) {
//     handleChangeSubTab(index)
//   }
//   document.startViewTransition(() => {
//     handleChangeSubTab(index)
//   })
// }

// 一级 TAB 切换
function handleChangeMainTab(index: number): void {
  switch (index) {
    case 1:
      isNavOneActive.value = true
      isNavTwoActive.value = false
      isSubNavActive.value = false
      pageOne.value?.classList.add('active')
      pageTwo.value?.classList.remove('active')
      pageThree.value?.classList.remove('active')
      // 设置新活动状态
      if (isNew.value.signin === 1) {
        setWebRedDot({ event: 'activity_sign_in_1' }, function (res) {
          console.log('设置新活动1状态回调 res: ', res)
          isNew.value.signin = 0
        })
      }
      break
    case 2:
      isNavOneActive.value = false
      isNavTwoActive.value = true
      isSubNavActive.value = true
      if (isActivityActive.value.winter && isActivityActive.value.summer) {
        isSubNavOneActive.value = true
        isSubNavTwoActive.value = false
        pageOne.value?.classList.remove('active')
        pageTwo.value?.classList.add('active')
        pageThree.value?.classList.remove('active')
        // 设置新活动状态
        if (isNew.value.winter === 1) {
          setWebRedDot({ event: 'activity_sign_in_2' }, function (res) {
            console.log('设置新活动2状态回调 res: ', res)
            isNew.value.winter = 0
          })
        }
      } else if (
        isActivityActive.value.winter &&
        !isActivityActive.value.summer
      ) {
        isSubNavOneActive.value = true
        pageOne.value?.classList.remove('active')
        pageTwo.value?.classList.add('active')
        // 设置新活动状态
        if (isNew.value.winter === 1) {
          setWebRedDot({ event: 'activity_sign_in_2' }, function (res) {
            console.log('设置新活动2状态回调 res: ', res)
            isNew.value.winter = 0
          })
        }
      } else if (
        !isActivityActive.value.winter &&
        isActivityActive.value.summer
      ) {
        isSubNavTwoActive.value = true
        pageOne.value?.classList.remove('active')
        pageThree.value?.classList.add('active')
        // 设置新活动状态
        if (isNew.value.summer === 1) {
          setWebRedDot({ event: 'activity_sign_in_3' }, function (res) {
            console.log('设置新活动3状态回调 res: ', res)
            isNew.value.summer = 0
          })
        }
      }
      break
  }
}

// 二级 TAB 切换
function handleChangeSubTab(index: number): void {
  switch (index) {
    case 1:
      isSubNavOneActive.value = true
      isSubNavTwoActive.value = false
      pageOne.value?.classList.remove('active')
      pageTwo.value?.classList.add('active')
      pageThree.value?.classList.remove('active')
      // 设置新活动状态
      if (isNew.value.winter === 1) {
        setWebRedDot({ event: 'activity_sign_in_2' }, function (res) {
          console.log('设置新活动2状态回调 res: ', res)
          isNew.value.winter = 0
        })
      }
      break
    case 2:
      isSubNavOneActive.value = false
      isSubNavTwoActive.value = true
      pageOne.value?.classList.remove('active')
      pageTwo.value?.classList.remove('active')
      pageThree.value?.classList.add('active')
      // 设置新活动状态
      if (isNew.value.summer === 1) {
        setWebRedDot({ event: 'activity_sign_in_3' }, function (res) {
          console.log('设置新活动3状态回调 res: ', res)
          isNew.value.summer = 0
        })
      }
      break
  }
}

// 关闭
function handleClose(): void {
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'closeWebView',
  })
}
</script>

<style scoped lang="scss">
#activity {
  width: 100vw;
  height: 100vh;
}

@media screen and (orientation: portrait) {
  #activity {
    position: absolute;
    width: 100vh;
    width: calc(100vh - var(--vh-offset, 0px));
    height: 100vw;
    height: calc(100vw - var(--vw-offset, 0px));
    top: 0;
    left: 100vw;
    -webkit-transform: rotate(90deg);
    -moz-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg);
    transform-origin: 0% 0%;
  }
}

@media screen and (orientation: landscape) {
  #activity {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    width: calc(100vw - var(--vw-offset, 0px));
    height: 100vh;
    height: calc(100vh - var(--vh-offset, 0px));
  }
}

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

  &.new {
    &::after {
      position: absolute;
      right: 0;
      top: 0;
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
  opacity: 0;
  transition: opacity 0.5s;
  position: absolute;
  left: 442px;
  top: 310px;

  &.active {
    opacity: 1;
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
    position: relative;

    &.new {
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
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.5s;

  &.active {
    opacity: 1;
    z-index: 3;
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
