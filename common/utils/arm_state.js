import store from '@/store/index'

/**
 * 获取当前index
 * @return {number}
 */
export const getRobotIndex = () => {
  return store.state.arm_state.robotIndex
}

/**
 * 设置当前机器人index
 * @param index
 */
export const setRobotIndex = (index) => {
  store.commit('arm_state/setRobotIndex', index)
}

/**
 * 获取当前工具
 * @return {string}
 */
export const getTool = () => {
  return store.state.arm_state.tool
}

/**
 * 设置当前工具
 * @param {string} tool
 */
export const setTool = (tool) => {
  store.commit('arm_state/setTool', tool)
}

/**
 * 获取当前工具
 * @return {string}
 */
export const getCurrentWobj = () => {
  return store.state.arm_state.wobj
}

/**
 * 设置当前工具
 * @param wobj
 */
export const setWobj = (wobj) => {
  store.commit('arm_state/setWobj', wobj)
}

/**
 * 获取当前坐标系
 * @return {number}
 */
export const getCoordinate = () => {
  return store.state.arm_state.coordinate
}

export const getFormatCoordinate = () => {
  return store.getters['arm_state/formatCoordinate']
}

/**
 * 获取所有坐标系
 * @return {Array<string>}
 */
export const getAllCoordinate = () => {
  return store.state.arm_state.coordinates
}

/**
 * 设置当前坐标系
 * @param coordinate
 */
export const setCoordinate = (coordinate) => {
  store.commit('arm_state/setCoordinate', coordinate)
}

/**
 * 上电状态
 * @return {boolean}
 */
export const getPower = () => store.state.arm_state.power

/**
 * 设置上电
 * @param {boolean} power
 */
export const setPower = (power) => store.commit('arm_state/setPower', power)

/**
 * 急停状态
 * @return {boolean}
 */
export const getEmergencyStop = () => store.state.arm_state.emergencyStop

/**
 * 设置急停
 * @param {boolean} emergencyStop
 */
export const setEmergencyStop = (emergencyStop) =>
  store.commit('arm_state/setEmergencyStop', emergencyStop)

/**
 * 状态机
 * @return {string}
 */
export const getServoState = () => store.state.arm_state.servoState

/**
 * 设置状态机
 * @param {string} servoState
 */
export const setServoState = (servoState) =>
  store.commit('arm_state/setServoState', servoState)
