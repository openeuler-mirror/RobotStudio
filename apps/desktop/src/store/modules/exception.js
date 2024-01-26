const state = {
  exception_data: [],
  exception_number: 0,
  exception_level: ['全部', 'Warning1', 'Warning2', 'SeriousError1', 'SeriousError2', 'Fatal']
}

const getters = {

}

const mutations = {
  /**
     * 设置异常信息
     * @param state
     * @param message 异常信息
     * @constructor
     */
  appendException (state, message) {
    state.exception_data.push(message)
    state.exception_number += 1
  },

  /**
     * 清除异常信息
     * @param state
     * @param message 异常信息
     * @constructor
     */
  clearException (state) {
    state.exception_data = []
    state.exception_number = 0
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
