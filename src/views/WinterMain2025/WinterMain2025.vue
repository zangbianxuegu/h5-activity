<template>
  <Transition appear :name="bodyTransitionName" mode="out-in">
    <div class="page relative h-screen w-screen bg-cover bg-center">
      <div class="h-full w-full">
        <Transition appear :name="headTransitionName" mode="out-in">
          <h1 class="title overflow-hidden bg-contain bg-no-repeat">
            <div class="sr-only">
              <p class="sr-only">灵蛇献瑞 喜迎春来</p>
              <p class="sr-only">
                <time datetime="2025-01-21">1.21</time>-
                <time datetime="2025-02-17">2.17</time>
              </p>
            </div>
            <div
              class="help cursor-pointer bg-contain"
              @click="handleHelp"
            ></div>
          </h1>
        </Transition>
        <Transition appear :name="mainTransitionName" mode="out-in">
          <section class="animate__animated animate__fadeIn">
            <div class="lantern-box absolute">
              <button
                v-for="(item, index) in menuItems"
                :key="item.path"
                type="button"
                :class="[
                  'lantern animate__animated absolute bg-transparent bg-center bg-no-repeat',
                  `lantern${index + 1}`,
                  item.status,
                ]"
                @click="handleClick(item, $event)"
              >
                <RouterLink
                  v-if="item.status === 'can'"
                  :to="item.path"
                  class="block h-full w-full"
                >
                  <span class="sr-only">{{ item.label }}</span>
                </RouterLink>
                <span v-else class="sr-only">{{ item.label }}</span>
              </button>
            </div>
          </section>
        </Transition>

        <!-- 活动规则弹框 -->
        <ModalHelp ref="modalHelp" />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { showToast } from 'vant'
import { Session } from '@/utils/storage'
import { useBaseStore } from '@/stores/base'
import { useTokenStore } from '@/stores/winter2025'
import { getPlayerMissionData } from '@/utils/request'
import ModalHelp from '../DayOfDesign01PostExhibit/components/ModalHelp.vue'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

// 弹框
const modalHelp = ref<InstanceType<typeof ModalHelp> | null>(null)

const baseStore = useBaseStore()
const tokenStore = useTokenStore()
const currentTime = computed(() => baseStore.baseInfo.currentTime)

const sessionIsVisitedKey = 'isVisitedWinterMain2025'
const isVisited = Session.get(sessionIsVisitedKey)
const bodyTransitionName = ref('')
const headTransitionName = ref('')
const mainTransitionName = ref('')
if (!isVisited) {
  bodyTransitionName.value = 'fade-in-body'
  headTransitionName.value = 'fade-in-head'
  mainTransitionName.value = 'fade-in-main'
}
interface MenuItem {
  path: string
  label: string
  status: 'can' | 'wait' | 'expired'
  startDate: string
  endDate: string
}

const MENU_ITEMS = [
  {
    path: '/winter-2025-1',
    label: '瑞蛇呈祥',
    status: 'wait',
    startDate: '2025-01-21',
    endDate: '2025-02-17',
  },
  {
    path: '/winter-2025-2',
    label: '蛇舞贺岁',
    status: 'wait',
    startDate: '2025-01-23',
    endDate: '2025-02-10',
  },
  {
    path: '/winter-2025-3',
    label: '相遇寄福',
    status: 'wait',
    startDate: '2025-01-23',
    endDate: '2025-02-10',
  },
  {
    path: '/winter-2025-4',
    label: '花灯雅集',
    status: 'wait',
    startDate: '2025-02-11',
    endDate: '2025-02-17',
  },
  {
    path: '/winter-2025-5',
    label: '新春百货',
    status: 'wait',
    startDate: '2025-01-21',
    endDate: '2025-02-17',
  },
]

// 菜单数据
const menuItems = computed(() => {
  return MENU_ITEMS.map((item) => {
    return {
      ...item,
      status: getStatus(item.startDate, item.endDate),
    }
  })
})

onMounted(async () => {
  Session.set(sessionIsVisitedKey, true)
  getLanternToken()
})

/**
 * @function 获取花灯代币数量
 * @returns {void}
 */
function getLanternToken(): void {
  getPlayerMissionData({
    event: 'activitycenter_winter_2025_5',
    token: 'lantern_token',
  })
    .then((res) => {
      const tokenInfo = res.data.token_info
      tokenStore.updateTokenInfo(tokenInfo)
    })
    .catch((error) => {
      showToast(error.message)
    })
}

/**
 * @function getStatus
 * @description 获取菜单项状态
 * @param {string} startDate 开始日期
 * @param {string} endDate 结束日期
 * @returns {string} 菜单项状态
 */
function getStatus(startDate: string, endDate: string): string {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  if (dayjs.unix(currentTime.value).isBefore(start)) {
    return 'wait'
  } else if (dayjs.unix(currentTime.value).isAfter(end)) {
    return 'expired'
  }
  return 'can'
}

/**
 * @function handleClick
 * @description 点击菜单项
 * @param {MenuItem} item 菜单项
 * @param {TouchEvent | MouseEvent} event 事件
 * @returns {void}
 */
function handleClick(item: MenuItem, event: TouchEvent | MouseEvent): void {
  if (['wait', 'expired'].includes(item.status)) {
    const target = event.currentTarget as HTMLElement
    if (item.status === 'wait') {
      const start = dayjs(item.startDate)
      const formattedDate = start.format('M.DD')
      showToast('活动开启时间：' + formattedDate)
    } else {
      showToast('活动已结束')
    }
    target.classList.add('animate__headShake')
    target.addEventListener(
      'animationend',
      () => {
        target.classList.remove('animate__headShake')
      },
      { once: true },
    )
  }
}

/**
 * @function handleHelp
 * @description 显示帮助
 * @returns {void}
 */
function handleHelp(): void {
  modalHelp.value?.open()
}
</script>

<style lang="scss" scoped>
.fade-in-body-enter-active {
  transition: opacity 1s ease-out;
}
.fade-in-body-enter-from {
  opacity: 0.2;
}
.fade-in-head-enter-active {
  transition: opacity 1s ease-out 0.2s;
}
.fade-in-head-enter-from {
  opacity: 0.2;
}
.fade-in-main-enter-active {
  transition: opacity 1s ease-out 0.5s;
}
.fade-in-main-enter-from {
  opacity: 0.2;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.list-move,
.list-enter-active,
.list-leave-active {
  transition: 0.5s ease-in-out;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}
.list-leave-active {
  position: absolute;
}
.page {
  border: 1px solid red;
  padding-left: 460px;
  background-image: url('@/assets/images/winter-main-2025/bg.jpg');
}
.title {
  position: absolute;
  left: 460px;
  bottom: 30px;
  width: 941px;
  height: 224px;
  background-image: url('@/assets/images/winter-main-2025/title.png');
}
.help {
  position: absolute;
  right: -67px;
  top: 32px;
  width: 47px;
  height: 49px;
  background-image: url('@/assets/images/winter-main-2025/help.png');
}
.lantern-box {
  left: 750px;
  top: 0;
  width: 1600px;
  height: 1060px;
}
.lantern {
  width: 272px;
  height: 530px;
}
.lantern1 {
  left: 470px;
  top: 80px;

  &.wait {
    background-size: 184px 428px;
  }

  &.can {
    background-size: 267px 529px;
  }

  &.expired {
    background-size: 251px 436px;
  }
}
.lantern2 {
  left: 1320px;
  top: 270px;

  &.wait {
    background-size: 184px 428px;
  }

  &.can {
    background-size: 266px 529px;
  }

  &.expired {
    background-size: 251px 432px;
  }
}
.lantern3 {
  left: 15px;
  top: 170px;

  &.wait {
    background-size: 184px 428px;
  }

  &.can {
    background-size: 267px 530px;
  }

  &.expired {
    background-size: 251px 437px;
  }
}
.lantern4 {
  left: 925px;
  top: 550px;

  &.wait {
    background-size: 184px 428px;
  }

  &.can {
    background-size: 272px 530px;
  }

  &.expired {
    background-size: 272px 506px;
  }
}
.lantern5 {
  left: 300px;
  top: 490px;

  &.wait {
    background-size: 184px 428px;
  }

  &.can {
    background-size: 264px 529px;
  }

  &.expired {
    background-size: 251px 435px;
  }
}
@for $i from 1 through 5 {
  .lantern#{$i} {
    &.wait {
      background-image: url('@/assets/images/winter-main-2025/lantern#{$i}-wait.png');
    }
    &.can {
      background-image: url('@/assets/images/winter-main-2025/lantern#{$i}-can.png');
    }
    &.expired {
      background-image: url('@/assets/images/winter-main-2025/lantern#{$i}-expired.png');
    }
  }
}
</style>
