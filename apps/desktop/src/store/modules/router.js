const state = {
  current_path: '/' // 当前路径
}

const mutations = {
  // 设置当前路径
  ROUTER_CURRENT_PATH (state, path) {
    state.current_path = path
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
