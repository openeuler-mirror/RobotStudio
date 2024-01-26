const state = {
  projectConfigs: [], // 所有的project配置
  currentProjectID: '', // 当前项目的ID
  
  advancedFunction: {
    openEulerRobot: ['INSTRUCTION', 'SLAVESTATE', 'OPERATEWAFER']
  }
}

const getters = {
  /**
   * 当前的项目
   */
  currentProjectConfig: state => {
    for (const projectConfig of state.projectConfigs) {
      if (projectConfig.id === state.currentProjectID) { return projectConfig }
    }
    return {}
  },
  advancedFunction: state => {
    return state.advancedFunction
  }
}

const mutations = {
  setProjectConfigs (state, projectConfigs) {
    state.projectConfigs = projectConfigs
  },
  setCurrentProjectID (state, currentProjectID) {
    state.currentProjectID = currentProjectID
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
