import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from '@/router'
import vhCheck from 'vh-check'

// 引入函数组件样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
vhCheck()

const app = createApp(App)
app.use(router)
app.mount('#app')
