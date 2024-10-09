import { type UseEnvironmentReturn } from '@/types'

export function useEnvironment(): UseEnvironmentReturn {
  const localUrl = '10.227.198.175:5173'
  const localUrlCc = '10.227.199.103:5173'
  const gameUrl =
    'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game/index.html'
  const gameDevUrl =
    'https://listsvr.x.netease.com:6678/h5_pl/ma75/sky.h5.163.com/game_dev/index.html'
  const prodUrl = 'https://sky.h5.163.com/game/'
  const isLocal = ref(
    window.location.href.includes(localUrl) ||
      window.location.href.includes(localUrlCc),
  )
  const isGame = ref(window.location.href.includes(gameUrl))
  const isGameDev = ref(window.location.href.includes(gameDevUrl))
  const isProd = ref(window.location.href.includes(prodUrl))

  const isIos =
    /iphone os/i.test(navigator.userAgent.toLowerCase()) ||
    /ipad|macintosh/i.test(navigator.userAgent.toLowerCase())
  const isAndroid = /android/i.test(navigator.userAgent.toLowerCase())
  const isWb = /weibo/i.test(navigator.userAgent.toLowerCase())

  return {
    isLocal,
    isGame,
    isGameDev,
    isProd,
    isIos,
    isAndroid,
    isWb,
  }
}
