/**
 * 对grpc和socket两种通信模式进行封装，建立一个中间层，
 * 通过动态加载技术，屏蔽掉底层通信细节
 */
import { getCurrentProjectConfig } from './my_project'
import { JogVelocityLevel } from './rpc/robot_grpc_service'

// 动态加载模块
let remoteUtil: any = null
async function loadRemoteUtil() {
  if (process.env.PROJECT_NAME === 'teach_board') {
    remoteUtil = await import('./rpc/web_rpc')
    return remoteUtil
  }
  remoteUtil = await import('./rpc/node_rpc')
  return remoteUtil
}

/**
 * 判断连接是否正常
 * @returns
 */
export const isConnected = () => {
  if (remoteUtil === null) {
    return false
  }
  return remoteUtil.isRPCConnected()
}

/**
 * 断开rpc连接
 */
export const destoryRPCClient = () => {
  if (remoteUtil !== null) {
    return remoteUtil.destoryRPCClient()
  }
  return null
}

/**
 * 重连
 * @returns
 */
export const reconnect = () => {
  return remoteUtil.reconnectRPC()
}

/**
 * 获得当前的远程客户端连接
 */
export const getRPCClient = () => {
  return remoteUtil.getRPCClient()
}

export const initRobotRPCClient = (projectConfig: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.initRobotRPCClient(projectConfig)
  }
  return null
}

/**
 * 获取当前的连接状态
 */
export const ping = () => {
  return remoteUtil.ping()
}

export const setRunningMode = (mode: string) => {
  return remoteUtil.setRunningMode(mode)
}

/**
 * 上电操作
 */
export const powerOn = () => {
  return remoteUtil.powerOn()
}

export const powerOff = () => {
  return remoteUtil.powerOff()
}

export const teachMoveStep = (
  axis: number,
  direction: number,
  jogStep: number
) => {
  return remoteUtil.teachMoveStep(axis, direction, jogStep)
}

export const teachJogStart = (
  axis: number,
  direction: number,
  velocityLevel: JogVelocityLevel = JogVelocityLevel.LOW
) => {
  return remoteUtil.teachJogStart(axis, direction, velocityLevel)
}

export const teachJogStop = () => {
  return remoteUtil.teachJogStop()
}

/**
 * 保存当前关节点位置
 */
export const teachSaveCurrentJoint = (
  dataName: string,
  describe: string,
  arm: string,
  slot: number,
  code: number
) => {
  if (remoteUtil !== null) {
    return remoteUtil.teachSaveCurrentJoint(dataName, describe, arm, slot, code)
  }
  return null
}

/**
 * 运动至指定关节点
 */
export const goTeachJoint = (pointName: string, message: string) => {
  if (remoteUtil !== null) {
    return remoteUtil.goTeachJoint(pointName, message)
  }
  return null
}
/**
 * 清除运动错误
 */
export const clearMoveError = () => {
  if (remoteUtil !== null) {
    return remoteUtil.clearMoveError()
  }
  return null
}
/**
 * 获取机械臂运行状态
 */
export const teachGetRunType = () => {
  return remoteUtil.teachGetRunType()
}

/**
 * 设置示教速度
 * @param speed 速度
 * @returns
 */
export const teachSetVelocity = (speed: number) => {
  return remoteUtil.teachSetVelocity(speed)
}

/**
 * 获取示教速度
 * @returns
 */
export const getVelocity = () => {
  return remoteUtil.getVelocity()
}

/**
 * 删除数据
 */
export const deletePoint = (name: string, type: any, arm: string) => {
  return remoteUtil.deletePoint(name, type, arm)
}

/**
 * 下载获得所有点位信息
 * @returns
 */
export const downloadPointFile = () => {
  if (remoteUtil !== null) {
    return remoteUtil.downloadPointFile()
  }
  return null
}

/**
 * 获取已有数据点名称
 */
export const getAllPointNames = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getAllPointNames()
  }
  return null
}

/**
 * 获取IO输出
 */
export const getIOOutputState = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getIOOutputState()
  }
  return null
}

/**
 * 设置IO输出
 */
export const setIOOutputState = (io: number, state: number) => {
  if (remoteUtil !== null) {
    return remoteUtil.setIOOutputState(io, state)
  }
  return null
}

/**
 * 获取机器人关节配置
 */
export const getRobotSetting = (type: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.getRobotSetting(type)
  }
  return null
}

/**
 * 获取IO配置
 * @returns {Promise.resolve}
 */
export const getIOSetting = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getIOSetting()
  }
  return null
}

/**
 * 获得节点配置
 * @returns {Promise.resolve}
 */
export const getJointSetting = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getJointSetting()
  }
  return null
}

/**
 * 获得设备配置
 * @returns {Promise.resolve}
 */
export const getDeviceSetting = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getDeviceSetting()
  }
  return null
}

/**
 * 保存机器人关节配置
 */
export const saveJointSetting = (data: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.saveJointSetting(data)
  }
  return null
}

/**
 * 保存IO配置
 */
export const saveIOSetting = (data: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.saveIOSetting(data)
  }
  return null
}

/**
 * 读取Mapping设置
 */
export const getMappingSetting = (station: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.getMappingSetting(station)
  }
  return null
}

/**
 * 保存Mapping设置
 */
export const saveMappingSetting = (station: number, mappingSetting: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.saveMappingSetting(station, mappingSetting)
  }
  return null
}

/**
 * 读取使能Mapping设置
 */
export const getEnableMapping = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getEnableMapping()
  }
  return null
}

/**
 * 保存使能Mapping设置
 */
export const saveEnableMapping = (data: any) => {
  if (remoteUtil !== null) {
    return remoteUtil.saveEnableMapping(data)
  }
  return null
}

/**
 * 读取异常日志
 */
export const getException = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getException()
  }
  return null
}

/**
 * 删除异常日志
 */
export const deleteException = () => {
  if (remoteUtil !== null) {
    return remoteUtil.deleteException()
  }
  return null
}

/**
 * 读取IO输入
 */
export const getIOInputState = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getIOInputState()
  }
  return null
}

/**
 * 停止IO输入
 */
export const stopGetIOInputState = () => {
  if (remoteUtil !== null) {
    return remoteUtil.stopGetIOInputState()
  }
  return null
}

/**
 * 查询mapping
 */
export const searchMapping = (cassette: string) => {
  if (remoteUtil !== null) {
    return remoteUtil.searchMapping(cassette)
  }
  return null
}

/**
 * mapping校准
 */
export const mappingCalibrate = (station: string) => {
  if (remoteUtil !== null) {
    return remoteUtil.mappingCalibrate(station)
  }
  return null
}

export const setSolenoid = (index: number, value: number) => {
  if (remoteUtil !== null) {
    return remoteUtil.setSolenoid(index, value)
  }
  return null
}

/**
 * 取放片
 */
export const operateWafer = (
  type: any,
  arm: any,
  aimPoint: any,
  aimSlot: any,
  armPosture: any
) => {
  if (remoteUtil !== null) {
    return remoteUtil.operateWafer(type, arm, aimPoint, aimSlot, armPosture)
  }
  return null
}

export const calibrateRobotParam = () => {
  if (remoteUtil !== null) {
    return remoteUtil.calibrateRobotParam()
  }
  return null
}

export const setJogVelocity = (speed: Array<Number>) => {
  if (remoteUtil !== null) {
    return remoteUtil.setJogVelocity(speed)
  }
  return null
}

export const getJogVelocity = () => {
  if (remoteUtil !== null) {
    return remoteUtil.getJogVelocity()
  }
  return null
}

export const setJogVelocityLevel = (jogvelocityLevel: JogVelocityLevel) => {
  if (remoteUtil !== null) {
    return remoteUtil.setJogVelocityLevel(jogvelocityLevel)
  }
  return null
}

export default {
  install: () => {
    loadRemoteUtil()
      .then(() => {
        initRobotRPCClient(getCurrentProjectConfig())
        console.log('remoteUtil loaded')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
