<template>
  <div class="main">
    <div class="title-box">
      <h1
        class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      >
        暑期签到
      </h1>
      <div class="date flex items-center align-middle">
        <div class="date-text">7.28-8.24</div>
        <div
          class="date-help bg-contain bg-center bg-no-repeat"
          @click="handleHelp"
        ></div>
      </div>
    </div>
    <div class="main-content flex">
      <div class="signin-list flex flex-wrap">
        <div
          v-for="(item, index) in Array.from(daysRewardMap.keys())"
          :key="item"
          :class="[
            'signin-item bg-contain bg-center bg-no-repeat',
            {
              'signin-item--left-top': index === 0,
              'signin-item--right-top': index === 3,
              'signin-item--left-bottom': index === 4,
              'signin-item--right-bottom': index === 7,
            },
          ]"
        >
          <div class="signin-title text-center">{{ item }}天</div>
          <div class="signin-content flex items-center justify-center">
            <div
              :class="[
                'signin-reward bg-contain bg-center bg-no-repeat',
                `signin-reward-${daysRewardMap.get(item)?.reward}`,
                `${daysRewardMap.get(item)?.status}`,
              ]"
            ></div>
          </div>
        </div>
      </div>
      <div class="signin-count bg-contain bg-center bg-no-repeat text-center">
        <div class="signin-title"></div>
        <div class="signin-count-num"><span>4</span>天</div>
        <div class="absolute bottom-0 w-full text-center">
          <p class="signin-forget-num">漏签<span>2</span>天</p>
          <div
            class="signin-btn signin-btn-replenishment overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            补签
          </div>
        </div>
      </div>
    </div>
    <div
      class="signin-btn signin-btn-today overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      @click="handleSignin"
    >
      今日签到
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
  </div>
</template>

<script setup lang="ts">
import { showDialog } from 'vant'
import ActivityModal from './activity-modal.vue'
const modalHelp = ref<InstanceType<typeof ActivityModal> | null>(null)

const daysRewardMap = new Map([
  [
    '1',
    {
      reward: 10,
      status: 'redeemed',
    },
  ],
  [
    '3',
    {
      reward: 10,
      status: 'redeemed',
    },
  ],
  [
    '5',
    {
      reward: 10,
      status: 'redeemed',
    },
  ],
  [
    '7',
    {
      reward: 10,
      status: 'redeemed',
    },
  ],
  [
    '10',
    {
      reward: 20,
      status: 'can',
    },
  ],
  [
    '15',
    {
      reward: 20,
      status: 'can',
    },
  ],
  [
    '20',
    {
      reward: 20,
      status: 'wait',
    },
  ],
  [
    '25',
    {
      reward: 20,
      status: 'wait',
    },
  ],
])

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
  position: relative;
  padding-left: 825px;
  padding-top: 120px;
}
.title-box {
  height: 188px;
}
.title {
  width: 902px;
  height: 188px;
  background-image: url('@/assets/images/signin/summer-title.png');
}
.date {
  margin-left: 485px;
  margin-top: -150px;

  &-text {
    font-size: 15px; /* px-to-viewport-ignore */
    color: rgba(255, 255, 255, 0.7);
  }

  &-help {
    margin-left: 12px;
    margin-top: -2px;
    width: 48px;
    height: 49px;
    background-image: url('@/assets/images/signin/help.png');
  }
}
.main-content {
  margin-top: 25px;
  margin-left: 30px;
}
.signin-list {
  width: 920px;
}
.signin-item {
  margin: 0 12px 12px 0;
  width: 218px;
  height: 284px;
  background-image: url('@/assets/images/signin/summer-day-bg.png');

  &--left-top {
    background-image: url('@/assets/images/signin/summer-day-bg-left-top.png');
  }

  &--right-top {
    background-image: url('@/assets/images/signin/summer-day-bg-right-top.png');
  }

  &--left-bottom {
    background-image: url('@/assets/images/signin/summer-day-bg-left-bottom.png');
  }

  &--right-bottom {
    background-image: url('@/assets/images/signin/summer-day-bg-right-bottom.png');
  }
}
.signin-title {
  height: 80px;
  line-height: 80px;
  font-size: 40px;
  color: #fff;
  letter-spacing: 1px;
}
.signin-content {
  width: 218px;
  height: 204px;
}
.signin-reward {
  &.wait {
    margin-top: 5px;
    width: 164px;
    height: 163px;
  }

  &.can {
    margin-top: 5px;
    margin-left: -5px;
    width: 184px;
    height: 184px;
  }

  &.redeemed {
    margin-top: 5px;
    margin-left: -1px;
    width: 181px;
    height: 181px;
  }

  &-10 {
    &.wait {
      background-image: url('@/assets/images/signin/summer-reward-10-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/summer-reward-10-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/summer-reward-10-redeemed.png');
    }
  }

  &-20 {
    &.wait {
      background-image: url('@/assets/images/signin/summer-reward-20-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/summer-reward-20-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/summer-reward-20-redeemed.png');
    }
  }
}
.signin-count {
  position: relative;
  margin-left: 15px;
  width: 235px;
  height: 575px;
  background-image: url('@/assets/images/signin/summer-signin-count.png');
}
.signin-btn {
  margin-bottom: 20px;

  &-replenishment {
    margin-left: 17px;
    width: 202px;
    height: 104px;
    background-image: url('@/assets/images/signin/summer-btn-replenishment.png');
  }

  &-today {
    margin: 76px 0 0 50px;
    width: 406px;
    height: 114px;
    background-image: url('@/assets/images/signin/summer-btn-today.png');
  }
}
.signin-count-num {
  margin-top: 120px;
  font-size: 100px;
  color: #fff;
}
.signin-forget-num {
  width: 100%;
  font-size: 30px;
  font-weight: 300;
  color: rgba(63, 106, 170, 0.9);
}
.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
</style>
