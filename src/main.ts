import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from '@/router'
import vhCheck from 'vh-check'
import VConsole from 'vconsole'

// 引入函数组件样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
vhCheck()

const app = createApp(App)
const pinia = createPinia()
// pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')

// eslint-disable-next-line no-new
// new VConsole()
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-new
  new VConsole()
}
