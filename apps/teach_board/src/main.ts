import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import IconFont from '@rosc/common/components/IconFont.vue'
import MyProject from '@rosc/common/utils/my_project'
import MyRpc from '@rosc/common/utils/my_rpc'
import MyData from '~common/utils/my_data'
import App from './App.vue'
import router from './router'
import store from './store'
// 挂载this.$utils
// import install from '@rosc/common/utils/index'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .use(MyProject)
  .use(MyData)
  .use(MyRpc)
  // .use(install)
  .component('iconfont', IconFont)
  .mount('#app')
