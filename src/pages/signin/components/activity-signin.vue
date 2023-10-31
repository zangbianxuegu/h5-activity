<template>
  <div class="main">
    <div class="flex">
      <h1
        class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      >
        假日打卡
      </h1>
      <div class="date flex items-center align-middle">
        <div class="date-text">9.28-10.6</div>
        <div
          class="date-help bg-contain bg-center bg-no-repeat"
          @click="handleHelp"
        ></div>
      </div>
    </div>
    <div class="flex">
      <img class="photo" src="@/assets/images/signin/photo.png" alt="img" />
      <div class="signin">
        <ul class="signin-list flex flex-row flex-wrap" ref="daysList">
          <li
            v-for="(item, index) in state.daysList"
            :key="item"
            :class="[
              'signin-day overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]',
              `signin-day${index + 1}`,
            ]"
          >
            {{ item }}
          </li>
        </ul>
        <div class="signin-footer">
          <p class="signed-days text-right">
            已累计签到<span class="signed-days-num">2</span>/9天
          </p>
          <div class="flex items-end">
            <div
              class="signin-btn signin-btn-replenishment disabled overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
            >
              限时补签
            </div>
            <div
              class="signin-btn signin-btn-today overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
              @click="handleSignin"
            >
              今日签到
            </div>
          </div>
        </div>
      </div>
    </div>
    <activity-modal ref="modalHelp">
      <template #content>
        <p class="modal-text">
          <span class="font-semibold">活动时间：</span
          >2023年11月16日~2023年11月29日
        </p>
        <p class="modal-text">
          <span class="font-semibold">活动内容：</span>
        </p>
        <p class="modal-text">
          1、在云峰的活动区域内点播一次歌曲，即可领取<span
            class="text-[#ffcb4d]"
            >畅谈长桌</span
          >×2；
        </p>
        <p class="modal-text">
          2、点赞一首别人点播的歌曲，即可领取<span class="text-[#ffcb4d]"
            >秋千</span
          >×2；
        </p>
        <p class="modal-text">
          3、使用一次古典音乐桌椅魔法，即可领取<span class="text-[#ffcb4d]"
            >篝火</span
          >×2；
        </p>
        <p class="modal-text">
          4、活动期间累计点播10次歌曲，即可领取<span class="text-[#ffcb4d]"
            >爱心</span
          >×2。
        </p>
      </template>
    </activity-modal>
    <activity-modal ref="modal">
      <template #content>
        <p class="modal-text">
          恭喜你获得<span class="modal-text-blue">雪人的馈赠</span>：
        </p>
        <div class="mt-10 flex items-center justify-center">
          <img
            class="modal-reward"
            src="@/assets/images/signin/signin-day1-reward.png"
            alt="reward"
          />
        </div>
      </template>
    </activity-modal>
  </div>
</template>

<script setup lang="ts">
import { showDialog } from 'vant'
import ActivityModal from './activity-modal.vue'
const daysList = ref<HTMLInputElement | null>(null)
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)
const modal = ref<InstanceType<typeof ActivityModal> | null>(null)

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

onMounted(() => {
  const first = daysList.value?.children[0]
  first && first.classList.add('active')
})

function handleHelp(): void {
  modalHelp.value?.openModal()
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
          message: respJSONString,
        })
      },
    },
  })
}
</script>

<style lang="scss" scoped>
.main {
  position: absolute;
  left: 759px;
  top: 117px;
}
.title {
  width: 506px;
  height: 184px;
  background-image: url('@/assets/images/signin/title.png');
}
.date {
  margin-left: 20px;
  margin-top: 90px;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: #fff;
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 48px;
    height: 49px;
    background-image: url('@/assets/images/signin/help.png');
  }
}
.photo {
  width: 511px;
  height: 690px;
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
.signin-btn {
  margin-left: 40px;

  &-today {
    width: 366px;
    height: 114px;
    background-image: url('@/assets/images/signin/signin-btn-today.png');

    &.disabled {
      background-image: url('@/assets/images/signin/signin-btn-today-disabled.png');
    }
  }

  &-replenishment {
    margin-bottom: 5px;
    width: 270px;
    height: 97px;
    background-image: url('@/assets/images/signin/signin-btn-replenishment.png');

    &.disabled {
      background-image: url('@/assets/images/signin/signin-btn-replenishment-disabled.png');
    }
  }
}
.signed-days {
  margin-right: 30px;
  margin-bottom: 8px;
  font-size: 12px; /* px-to-viewport-ignore */
  font-weight: 300;
  letter-spacing: 1px;
  color: rgb(225, 225, 225, 0.8);

  &-num {
    color: #ffcd71;
  }
}
.signin-list {
  width: 992px;
}
.signin-day {
  margin: 0 20px 20px 0;
  width: 228px;
  height: 228px;
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
.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
.modal-reward {
  width: 162px;
  height: 131px;
}
</style>
