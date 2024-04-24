<template>
  <div class="page flex min-h-screen bg-cover bg-center bg-no-repeat">
    <nav
      class="nav flex h-screen w-[460px] shrink-0 flex-col justify-between py-4"
    >
      <div class="menu overflow-y-scroll">
        <Menu></Menu>
      </div>
      <div class="nav-sprite flex">
        <!-- <a
          class="nav-sprite-text"
          :href="`https://dev.gmsdk.gameyw.netease.com/sprite/index?token=${token}`"
          >前往精灵>></a
        > -->
        <div class="nav-sprite-text" @click="handleToSprite">前往精灵>></div>
      </div>
    </nav>
    <main class="flex items-center justify-center">
      <!-- <router-view v-slot="{ Component }">
        <Transition name="fade-in" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view> -->
      <router-view></router-view>
    </main>
    <div
      v-if="isLocal"
      class="fixed right-0 top-0 z-10 bg-blue-600 px-1 text-sm text-white"
    >
      本地地址
    </div>
    <div
      v-if="isGameDev"
      class="fixed right-0 top-0 z-10 bg-yellow-600 px-1 text-sm text-white"
    >
      game_dev
    </div>
    <div
      v-if="isGame"
      class="fixed right-0 top-0 z-10 bg-green-600 px-1 text-sm text-white"
    >
      game
    </div>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant'
import Menu from '@/components/Menu'
import { getUserInfo, getJinglingToken } from '@/utils/request'
import { useBaseStore } from '@/stores/base'

const localUrl = 'https://10.227.198.175:5173'
const gameUrl =
  'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game/index.html'
const gameDevUrl =
  'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game_dev/index.html'
const prodUrl = 'https://sky.h5.163.com/game/'
const isLocal = ref(window.location.href.includes(localUrl))
const isGame = ref(window.location.href.includes(gameUrl))
const isGameDev = ref(window.location.href.includes(gameDevUrl))
const isProd = ref(window.location.href.includes(prodUrl))
const jinglingUrl = isProd.value
  ? 'https://gmsdk.gameyw.netease.com/sprite/index'
  : 'https://dev.gmsdk.gameyw.netease.com/sprite/index'

// 基本信息
const baseStore = useBaseStore()
const { updateBaseInfoItems } = baseStore

onMounted(() => {
  try {
    getBaseInfo()
  } catch (error) {
    console.error(error)
  }
})

let tokenParams: {
  game_uid: string
  uid: string
  map: string
  return_buff: string
  os: string
} = {
  game_uid: '',
  uid: '',
  map: '',
  return_buff: '',
  os: '',
}
// 获取基本信息
function getBaseInfo(): void {
  getUserInfo()
    .then((res) => {
      const channel = res.channel
      const appChannel = res.appChannel
      updateBaseInfoItems({ channel })
      updateBaseInfoItems({ appChannel })
      tokenParams = {
        game_uid: res.game_uid,
        uid: res.uid,
        map: res.map,
        return_buff: res.return_buff,
        os: res.os,
      }
    })
    .catch((error) => {
      showToast(error.message)
    })
}

// 前往精灵
function handleToSprite(): void {
  getJinglingToken(tokenParams)
    .then((res) => {
      const val = res.data.token
      window.location.href = `${jinglingUrl}?token=${val}`
    })
    .catch((error) => {
      showToast(error.message)
    })
}
</script>

<style scoped>
.menu::-webkit-scrollbar {
  display: none;
}
.page {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/common/bg.jpg');
}
.nav-sprite {
  width: 443px;
  height: 107px;
  line-height: 107px;
  background-image: url('@/assets/images/common/nav-sprite.png');
  background-size: contain;
  background-position: center;
  font-size: 36px;
  color: rgba(255, 255, 255, 0.6);

  &-text {
    padding-left: 140px;
    width: 100%;
    height: 100%;
  }
}
</style>
