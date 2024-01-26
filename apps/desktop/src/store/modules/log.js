const state = {
  logs: []
}

const getters = {
  /**
   * 获取最后一条日志
   * @param state
   * @return {Object}
   */
  lastLog: state => {
    return state.logs.length ? state.logs[state.logs.length - 1] : {}
  }
}

const mutations = {
  /**
   * 添加一条日志
   * @param state
   * @param {Object} log
   */
  appendLog (state, log) {
    state.logs.push(log)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
