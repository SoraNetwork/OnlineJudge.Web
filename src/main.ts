import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { message } from './services/MessageService'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

// 将message服务挂载到全局
app.config.globalProperties.$message = message

// 也可以挂载到window对象，方便在非组件中使用
// 注意：生产环境中最好避免污染全局window对象
window.$message = message

export { message }

// TypeScript全局声明
declare module 'vue' {
  interface ComponentCustomProperties {
    $message: typeof message
  }
}

declare global {
  interface Window {
    $message: typeof message
  }
}

