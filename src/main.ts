import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { ElCollapseTransition } from 'element-plus'

import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import piniapluginpersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn
})
app.component(ElCollapseTransition.name, ElCollapseTransition)
app.use(createPinia().use(piniapluginpersistedstate))
app.use(router)

app.mount('#app')
