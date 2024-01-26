import { createApp } from 'vue'
import "./style.css"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import store from './store'
import IconFont from '@rosc/common/components/IconFont.vue'

// 挂载this.$utils
import install from '@rosc/common/utils/index'
createApp(App).use(store).use(router).use(ElementPlus).use(install).component('iconfont', IconFont).mount('#app')
