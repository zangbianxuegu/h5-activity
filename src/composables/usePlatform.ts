import { type UsePlatformReturn } from '@/types'

export function usePlatform(): UsePlatformReturn {
  const ua = navigator.userAgent.toLowerCase()
  const isIos = /iphone os/i.test(ua) || /ipad|macintosh/i.test(ua)
  const isAndroid = /android/i.test(ua)
  const isWb = /weibo/i.test(ua)
  const isWindow = /windows/i.test(ua)
  const isMac = /macintosh/i.test(ua)
  const isPC = isWindow || isMac

  return {
    isIos,
    isAndroid,
    isWb,
    isWindow,
    isMac,
    isPC,
  }
}
