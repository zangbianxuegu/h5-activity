import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import 'animate.css'
import '@vant/touch-emulator'
import App from './App.vue'
import router from '@/router'
import vhCheck from 'vh-check'
import eruda from 'eruda'

// 引入函数组件样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
vhCheck()

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.mount('#app')

if (process.env.NODE_ENV !== 'production') {
  eruda.init()
}
