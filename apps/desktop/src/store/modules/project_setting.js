const PROJECT_SETTING_MODE = {
  NEW: { key: 'NEW' }, // 新建项目的设置
  UPDATE: { key: 'UPDATE' } // 更新现有项目
}

const state = {
  projectSettingMode: {},
  PROJECT_SETTING_MODE: PROJECT_SETTING_MODE
}

const mutations = {
  PROJECT_SETTING_MODE (state, projectSettingMode) {
    state.projectSettingMode = projectSettingMode
  }
}

export default {
  state,
  mutations
}
