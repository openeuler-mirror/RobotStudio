const state = {
  setting: {} // 保存当前所有配置
}

const mutations = {

  IDE_SETTING_SETTING (state, setting) {
    state.setting = JSON.parse(JSON.stringify(setting))
  }
}

export default {
  state,
  mutations
}
