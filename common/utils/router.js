import router from '@/router'
import store from '@/store'

export default {
  install (app) {
    // 路由跳转，封装函数是因为要更新vuex，所以这里统一跳转
    app.config.globalProperties.$utils.route_to = function (path, params) {
      if (store.state.router.current_path !== path || path === '/window/projectSetting') {
        store.commit('router/ROUTER_CURRENT_PATH', path)
        router.push({
          path: path,
          query: params
        })
      }
    }

    /**
     * 路由到程序启动页面
     */
    app.config.globalProperties.$utils.routeToStartPage = function () {
      app.config.globalProperties.$utils.routeToNormalWindow('/welcome')
    }

    /**
     * 路由到普通窗口
     * @param {String} path 跳转路径
     * @param {Object} params 参数
     */
    app.config.globalProperties.$utils.routeToNormalWindow = function (path, params) {
      app.config.globalProperties.$utils.route_to('/window' + path, params)
    }
  }
}
