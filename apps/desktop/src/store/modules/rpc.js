// 用vuex来传递rpc的值,同时保证只有一个client
const state = {
  RPCClient: null, // client
  isRPCConnected: false // RPC是否已经连接
}

const getters = {
  RPCClient: (state) => state.RPCClient
}

const mutations = {
  /**
   * 设置RPC client
   * @param state
   * @param client
   */
  setRPCClient (state, client) {
    state.RPCClient = client
  },
  setIsRPCConnected (state, isRPCConnected) {
    state.isRPCConnected = isRPCConnected
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
