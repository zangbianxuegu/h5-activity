import LoadingComponent from './Loading.vue'

let loadingInstance: any
let requestCount = 0
const MIN_LOADING_TIME = 200
let timeoutId: NodeJS.Timeout | null = null

const Loading = {
  show() {
    requestCount += 1
    if (requestCount === 1) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      if (!loadingInstance) {
        const app = createApp(LoadingComponent)
        const container = document.createElement('div')
        document.body.appendChild(container)
        loadingInstance = app.mount(container)
      }
      loadingInstance.showVisible()
    }
  },
  hide() {
    requestCount -= 1
    if (requestCount === 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(() => {
        // 确保在延迟期间，没有新的请求开始
        if (loadingInstance && requestCount === 0) {
          loadingInstance.hideVisible()
        }
        timeoutId = null
      }, MIN_LOADING_TIME)
    }
  },
}

export default Loading
