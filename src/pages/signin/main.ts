import { createApp } from 'vue'
import '../../style.css'
import App from './App.vue'
import vhCheck from 'vh-check'
import VConsole from 'vconsole'

// 引入函数组件样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
vhCheck()

const app = createApp(App)
app.mount('#app')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-new
  new VConsole()
}
