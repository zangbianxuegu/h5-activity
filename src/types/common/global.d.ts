export declare global {
  interface Window {
    UniSDKJSBridge: any
  }
}
export interface UseEnvironmentReturn {
  isLocal: Ref<boolean>
  isGame: Ref<boolean>
  isGameDev: Ref<boolean>
  isGameDev2: Ref<boolean>
  isProd: Ref<boolean>
}
