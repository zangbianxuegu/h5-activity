<template>
  <div class="page" :style="pageStyle" ref="page">
    <div class="back">返回</div>
    <nav class="nav">
      <ul>
        <li class="nav-item nav-item-first">假日打卡</li>
        <li class="nav-item nav-item-second">拾光的旅人们</li>
        <li class="nav-item nav-item-third">旅行好物</li>
        <li class="nav-item nav-item-fourth">留影拾光</li>
      </ul>
    </nav>
    <div class="main">
      <div class="title-box">
        <h1 class="title">假日打卡</h1>
        <div class="date">
          <div class="date-text">9.28-10.6</div>
          <div class="date-help" @click="handleHelp"></div>
        </div>
      </div>
      <div class="main-content">
        <div class="photo-wrapper">
          <div class="photo">
            <img
              class="photo-img"
              src="@/assets/images/signin/photo.png"
              alt="img"
            />
            <p class="photo-text">今日灵感@西上优雅</p>
          </div>
          <div class="share">分享我的穿搭</div>
        </div>
        <div class="signin">
          <ul class="signin-list" ref="daysList">
            <li
              v-for="(item, index) in state.daysList"
              :key="item"
              :class="['signin-day', `signin-day${index + 1}`]"
            >
              {{ item }}
            </li>
            <!-- <li class="signin-day signin-day1 active">第一天</li>
            <li class="signin-day signin-day2">第二天</li>
            <li class="signin-day signin-day3 active">第三天</li>
            <li class="signin-day signin-day4">第四天</li>
            <li class="signin-day signin-day5">第五天</li>
            <li class="signin-day signin-day6">第六天</li>
            <li class="signin-day signin-day7">第七天</li>
            <li class="signin-day signin-day8">第八天</li>
            <li class="signin-day signin-day9">第九天</li> -->
          </ul>
          <div class="signin-footer">
            <p class="signed-days">已累计签到2/9天</p>
            <div class="signin-actions">
              <div class="signin-btn signin-btn-replenishment">限时补签</div>
              <div class="signin-btn signin-btn-today" @click="handleSignin">
                今日签到
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="logo">社区活动</div>
  </div>
</template>

<script setup lang="ts">
import { showDialog } from 'vant'
const daysList = ref<HTMLInputElement | null>(null)

onMounted(() => {
  const first = daysList.value?.children[0]
  first && first.classList.add('active')
})

const pageStyle = ref({})
const state = reactive({
  daysList: [
    '第一天',
    '第二天',
    '第三天',
    '第四天',
    '第五天',
    '第六天',
    '第七天',
    '第八天',
    '第九天',
  ],
})

function handleHelp(): void {
  void showDialog({
    teleport: '#app',
    message: '生命远不止连轴转和忙到极限，人类的体验远比这辽阔、丰富得多。',
  })
}

function handleSignin(): void {
  window.UniSDKJSBridge.postMsgToNative({
    methodId: 'ngwebview_notify_native',
    reqData: {
      notification_name: 'NT_NOTIFICATION_EXTEND',
      data: {
        resource: '/internal/jingling/get_player_mission_data',
        content: JSON.stringify({
          source_token: '',
          source_id: '',
          event: 'sprite_season20_start',
          user: 'b0c6ae38-ea78-45a0-bf29-087a23b0400e',
        }),
      },
    },
    callback_id: 'notify_signin',
    callback: {
      nativeCallback: function (respJSONString: string) {
        void showDialog({
          teleport: '#app',
          message: JSON.parse(respJSONString).responseData,
        })
      },
    },
  })
}
// function onResize(): void {
//   let clientWidth = document.documentElement.clientWidth
//   let clientHeight = document.documentElement.clientHeight

//   if (clientWidth < clientHeight) {
//     ;[clientWidth, clientHeight] = [clientHeight, clientWidth]
//   }
//   pageStyle.value = {
//     width: `${clientWidth}px`,
//     height: `${clientHeight}px`,
//   }
// }
// window.addEventListener('resize', onResize, false)
</script>

<style scoped lang="scss">
.text-hide {
  text-indent: -9999px;
  overflow: hidden;
}
.background-size-contain {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.page {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  background-image: url('@/assets/images/signin/bg.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
.back {
  @extend .text-hide;
  @extend .background-size-contain;
  position: absolute;
  top: 34px;
  left: 37px;
  width: 68px;
  height: 44px;
  background-image: url('@/assets/images/signin/back.png');
}
.nav {
  position: absolute;
  left: 37px;
  top: 91px;

  &-item {
    @extend .background-size-contain;
    margin-bottom: 30px;
    text-indent: -9999px;
    overflow: hidden;

    &-first {
      width: 228px;
      height: 93px;
      background-image: url('@/assets/images/signin/nav1.png');
    }

    &-second {
      margin-left: -3px;
      width: 285px;
      height: 76px;
      background-image: url('@/assets/images/signin/nav2.png');
    }

    &-third {
      margin-left: -9px;
      width: 227px;
      height: 83px;
      background-image: url('@/assets/images/signin/nav3.png');
    }

    &-fourth {
      margin-left: -15px;
      width: 245px;
      height: 94px;
      background-image: url('@/assets/images/signin/nav4.png');
    }
  }
}
.main {
  position: absolute;
  left: 400px;
  top: 80px;
}
.title-box {
  display: flex;
}
.title {
  @extend .text-hide;
  @extend .background-size-contain;
  width: 322px;
  height: 118px;
  background-image: url('@/assets/images/signin/title.png');
}
.date {
  margin-left: 20px;
  margin-top: 56px;
  display: flex;
  align-items: center;
  vertical-align: middle;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: #fff;
  }

  &-help {
    @extend .background-size-contain;
    margin-left: 10px;
    width: 30px;
    height: 30px;
    background-image: url('@/assets/images/signin/help.png');
  }
}
.main-content {
  display: flex;
}
.photo {
  @extend .background-size-contain;
  margin-top: 10px;
  padding: 23px;
  width: 325px;
  height: 438px;
  background-image: url('@/assets/images/signin/photo-bg.png');

  &-img {
    width: 277px;
    height: 359px;
  }

  &-text {
    margin-top: 2px;
    text-align: center;
    font-size: 11px; /* px-to-viewport-ignore */
    color: #fff;
  }
}
.share {
  @extend .text-hide;
  @extend .background-size-contain;
  margin-left: 120px;
  width: 191px;
  height: 47px;
  background-image: url('@/assets/images/signin/share.png');
}
.signin {
  position: relative;
  margin: 20px 0 0 50px;
}
.signin-footer {
  position: absolute;
  right: 0;
  bottom: 15px;
}
.signin-actions {
  display: flex;
  align-items: flex-end;
}
.signin-btn {
  @extend .text-hide;
  @extend .background-size-contain;
  margin-left: 40px;

  &-today {
    width: 231px;
    height: 72px;
    background-image: url('@/assets/images/signin/signin-btn-today.png');
  }

  &-replenishment {
    margin-bottom: 5px;
    width: 171px;
    height: 61px;
    background-image: url('@/assets/images/signin/signin-btn-replenishment.png');
  }
}
.signed-days {
  margin-right: 30px;
  margin-bottom: 8px;
  font-size: 11px; /* px-to-viewport-ignore */
  color: #e1e1e1;
  text-align: right;
}
.signin-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 640px;
}
.signin-day {
  @extend .text-hide;
  @extend .background-size-contain;
  margin: 0 15px 15px 0;
  width: 145px;
  height: 145px;
}
.signin-day1 {
  background-image: url('@/assets/images/signin/signin-day1.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day1-active.png');
  }
}
.signin-day2 {
  background-image: url('@/assets/images/signin/signin-day2.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day2-active.png');
  }
}
.signin-day3 {
  background-image: url('@/assets/images/signin/signin-day3.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day3-active.png');
  }
}
.signin-day4 {
  background-image: url('@/assets/images/signin/signin-day4.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day4-active.png');
  }
}
.signin-day5 {
  background-image: url('@/assets/images/signin/signin-day5.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day5-active.png');
  }
}
.signin-day6 {
  background-image: url('@/assets/images/signin/signin-day6.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day6-active.png');
  }
}
.signin-day7 {
  background-image: url('@/assets/images/signin/signin-day7.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day7-active.png');
  }
}
.signin-day8 {
  background-image: url('@/assets/images/signin/signin-day8.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day8-active.png');
  }
}
.signin-day9 {
  background-image: url('@/assets/images/signin/signin-day9.png');

  &.active {
    background-image: url('@/assets/images/signin/signin-day9-active.png');
  }
}
.logo {
  @extend .text-hide;
  @extend .background-size-contain;
  position: absolute;
  right: 47px;
  top: 30px;
  width: 149px;
  height: 51px;
  background-image: url('@/assets/images/signin/logo.png');
}
</style>
