const state = {
  needUpdate: false, // 需要更新
  ready: false, // 安装包已经下载完毕，准备好更新
  updateNotAvailable: false, // 已经是最新版本
  updateInfo: null // 更新日志
}

const mutations = {

  UPDATE_READY (state, ready) {
    state.ready = ready
  },
  UPDATE_NEED_UPDATE (state, needUpdate) {
    state.needUpdate = needUpdate
  },
  UPDATE_NOT_AVAILABLE (state, updateNotAvailable) {
    state.updateNotAvailable = updateNotAvailable
  },
  UPDATE_UPDATE_INFO (state, updateInfo) {
    state.updateInfo = updateInfo
  }
}

export default {
  state,
  mutations
}
