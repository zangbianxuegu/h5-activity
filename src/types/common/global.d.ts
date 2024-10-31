export declare global {
  interface Window {
    UniSDKJSBridge: any
  }
  interface wx {
    ready: (cb: () => void) => void
  }
}
export interface UseEnvironmentReturn {
  isLocal: Ref<boolean>
  isGame: Ref<boolean>
  isGameDev: Ref<boolean>
  isProd: Ref<boolean>
  isIos: boolean
  isAndroid: boolean
  isWb: boolean
}
