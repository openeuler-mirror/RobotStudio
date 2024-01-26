const state = {
  robotIndex: null, // 当前机器人index
  power: false, // 是否上电
  servoState: 'Init', // 状态机状态
  emergencyStop: false, // 是否急停
  tool: '', // 当前工具
  wobj: '', // 当前工件
  coordinate: 0, // 当前坐标系
  coordinates: ['轴坐标系', '基坐标系', '工具坐标系', '工件坐标系'], // 所有坐标系
  jogStep: 0.001 // 示教的步长
}

const getters = {
  /**
   * 可读的坐标系
   * @param state
   * @return {string}
   */
  formatCoordinate: state => state.coordinates[state.coordinate],
  power: state => state.power,
  jogStep: state => state.jogStep,
  emergencyStop: state => state.emergencyStop,
  servoState: state => state.servoState
}

const mutations = {
  setRobotIndex: (state, index) => {
    state.robotIndex = index
  },
  setTool: (state, tool) => {
    state.tool = tool
  },
  setWobj: (state, wobj) => {
    state.wobj = wobj
  },
  setCoordinate: (state, coordinate) => {
    state.coordinate = coordinate
  },
  setPower: (state, power) => { state.power = power },
  setEmergencyStop: (state, emergencyStop) => { state.emergencyStop = emergencyStop },
  setServoState: (state, servoState) => { state.servoState = servoState },
  setJogStep: (state, jogStep) => { state.jogStep = jogStep }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
