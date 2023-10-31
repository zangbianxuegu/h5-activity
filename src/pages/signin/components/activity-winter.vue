<template>
  <div class="main">
    <div class="flex">
      <h1
        class="title overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
      >
        冬季签到
      </h1>
      <div class="date flex items-center align-middle">
        <div class="date-text">1.14-2.5</div>
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
        <div class="signin-title">已累计签到</div>
        <div class="signin-count-num"><span>4</span>天</div>
        <div class="signin-actions">
          <p class="signin-forget-num">（漏签<span>1</span>天）</p>
          <div
            class="signin-btn signin-btn-replenishment overflow-hidden bg-contain bg-center bg-no-repeat indent-[-9999px]"
          >
            补签
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
    '9',
    {
      reward: 20,
      status: 'can',
    },
  ],
  [
    '12',
    {
      reward: 20,
      status: 'can',
    },
  ],
  [
    '15',
    {
      reward: 30,
      status: 'wait',
    },
  ],
  [
    '20',
    {
      reward: 30,
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
  padding-left: 756px;
  padding-top: 106px;
}
.title {
  width: 471px;
  height: 152px;
  background-image: url('@/assets/images/signin/winter-title.png');
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
.main-content {
  margin-top: 27px;
  margin-left: 12px;
}
.signin-list {
  width: 1248px;
}
.signin-item {
  margin: 0 12px 12px 0;
  width: 300px;
  height: 340px;
  background-image: url('@/assets/images/signin/winter-day-bg.png');

  &--left-top {
    background-image: url('@/assets/images/signin/winter-day-bg-left-top.png');
  }

  &--right-top {
    background-image: url('@/assets/images/signin/winter-day-bg-right-top.png');
  }

  &--left-bottom {
    background-image: url('@/assets/images/signin/winter-day-bg-left-bottom.png');
  }

  &--right-bottom {
    background-image: url('@/assets/images/signin/winter-day-bg-right-bottom.png');
  }
}
.signin-title {
  height: 90px;
  line-height: 90px;
  font-size: 40px;
  color: #fff;
  letter-spacing: 1px;
}
.signin-content {
  width: 300px;
  height: 250px;
}
.signin-reward {
  &.wait {
    width: 190px;
    height: 181px;
  }

  &.can {
    margin-top: 40px;
    width: 291px;
    height: 248px;
  }

  &.redeemed {
    margin-top: 16px;
    width: 241px;
    height: 224px;
  }

  &-10 {
    &.wait {
      background-image: url('@/assets/images/signin/winter-reward-10-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/winter-reward-10-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/winter-reward-10-redeemed.png');
    }
  }

  &-20 {
    &.wait {
      background-image: url('@/assets/images/signin/winter-reward-20-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/winter-reward-20-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/winter-reward-20-redeemed.png');
    }
  }

  &-30 {
    &.wait {
      background-image: url('@/assets/images/signin/winter-reward-30-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/signin/winter-reward-30-can.png');
    }

    &.redeemed {
      background-image: url('@/assets/images/signin/winter-reward-30-redeemed.png');
    }
  }
}
.signin-count {
  position: relative;
  margin-left: 2px;
  width: 498px;
  height: 694px;
  background-image: url('@/assets/images/signin/winter-signin-count.png');
}
.signin-actions {
  position: absolute;
  bottom: 0;
  width: 100%;
}
.signin-btn {
  margin-bottom: 20px;

  &-replenishment {
    margin-left: 53px;
    width: 391px;
    height: 87px;
    background-image: url('@/assets/images/signin/winter-btn-replenishment.png');
  }

  &-today {
    margin-left: 46px;
    width: 406px;
    height: 114px;
    background-image: url('@/assets/images/signin/winter-btn-today.png');
  }
}
.signin-count-num {
  margin-top: 80px;
  font-size: 120px;
  color: #fff;
}
.signin-forget-num {
  width: 100%;
  font-size: 30px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.7);
}
.modal-text {
  font-size: 40px;
  color: #454545;

  &-blue {
    color: #4db6da;
  }
}
</style>
