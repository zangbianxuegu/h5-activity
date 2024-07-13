export declare global {
  interface Window {
    UniSDKJSBridge: any
  }
}
export interface UseEnvironmentReturn {
  isLocal: Ref<boolean>
  isGame: Ref<boolean>
  isGameDev: Ref<boolean>
  isProd: Ref<boolean>
  isCcLocal: Ref<boolean>
}
