// @ts-nocheck
import { ElMessage } from 'element-plus'
import { toRaw } from 'vue'
import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import {
  setPower,
  getPower,
  getServoState,
  setServoState,
  setEmergencyStop,
  getEmergencyStop
} from '../arm_state'
import { getCurrentProjectConfig } from '../my_project'
import {
  setCurrentJoints,
  getCurrentJoints,
  getPoseVelocity,
  setPoseVelocity,
  getLeftArm,
  getRightArm,
  setLeftArm,
  setRightArm,
  getBlades,
  setBlades,
  getWaferSensors,
  setWaferSensors
} from '../my_data'
import store from '@/store'
import { RobotGrpcServiceClient } from './robot_grpc_service.client'
import {
  DownloadPointFileRequest,
  GoTeachJointRequest,
  TeachGetVelocityRequest,
  TeachSetVelocityRequest,
  TeachSavePositionRequest,
  GetIOOutputStateRequest,
  SetIOOutputStateRequest,
  RobotSettingRequest,
  SaveJointSettingRequest,
  SaveIOSettingRequest,
  MappingSettingRequest,
  SaveMappingSettingRequest,
  SaveEnableMappingRequest,
  MappingCalibrateRequest,
  SearchMappingRequest,
  OperateWaferRequest,
  DebugWaferRequest,
  StopGetIOInputStateRequest,
  GetExceptionRequest,
  DeleteExceptionRequest,
  TeachJogStartRequest,
  TeachJogStopRequest,
  SetRunningModeRequest,
  CalibrateRobotParamRequest,
  JogVelocityLevel,
  SetJogVelocityLevelRequest
} from './robot_grpc_service'

// rpc重连检查时间，如果发现断开连接，每5s检查一次.
// 初始连接的时候，浏览器会发送一个请求，经过观察，浏览器默认的初始连接超时时间在10s左右，
// 所以，这里设置为8s，8s之后才会重新发送一个请求。如果在8s内，则主要依靠浏览器自动的初始连接时间即可实现重连。
// 这个时间的设置合理，也能尽可能避免在重连成功后，大量积压的数据包分发
const rpcReconnectInterval = 8000
let rpcIntervalTimer = null
/**
 * 获取RPC client
 * @return {Object | null}
 */
export const getRPCClient = () => {
  return toRaw(store.getters['rpc/RPCClient'])
}

/**
 * 发生异常了，清除rpc的信息
 */
export const destoryRPCClient = () => {
  store.commit('rpc/setRPCClient', null)
  store.commit('rpc/setIsRPCConnected', false)
  // eslint-disable-next-line no-use-before-define
  webRpcListenerUtils.removeAllListeners()
  setPower(false)
}

export class webRpcListenerUtils {
  public static addExceptionListener(): void {
    // let streamExceptionInterval = null
    // let streamJointInterval = null
    // if (store.state.rpc.isRPCConnected) {
    //   const exceptionLevel = getExceptionLevel()
    //   const client = getRPCClient()
    //   const exceptionCall = client.GetStreamException({
    //     message: 'get exception'
    //   })
    //   exceptionCall.on('data', (resp) => {
    //     if (resp.level > 0) {
    //       const exception = {}
    //       exception.level = resp.level
    //       exception.exception_level = exceptionLevel[resp.level]
    //       exception.time = resp.time
    //       exception.statu_code = resp.status_code
    //       exception.message = resp.message
    //       appendException(exception)
    //     }
    //   })
    //   exceptionCall.on('error', (err) => {
    //     destoryRPCClient()
    //     console.log('流式获取异常错误：', err.toString())
    //   })
    //   streamExceptionInterval = setInterval(() => {
    //     if (store.state.rpc.isRPCConnected) {
    //       exceptionCall.write({ message: 'get exception' })
    //     } else {
    //       exceptionCall.cancel()
    //       destoryRPCClient()
    //       clearInterval(streamExceptionInterval)
    //       streamExceptionInterval = null
    //     }
    //   }, 1000)
    //   streamJointInterval = setInterval(() => {
    //     if (store.state.rpc.isRPCConnected) {
    //       jointCall.write({ message: 'get joint' })
    //     } else {
    //       jointCall.cancel()
    //       destoryRPCClient()
    //       clearInterval(streamJointInterval)
    //       streamJointInterval = null
    //     }
    //   }, 100)
    // } else {
    //   if (streamExceptionInterval) {
    //     clearInterval(streamExceptionInterval)
    //     streamExceptionInterval = null
    //   }
    //   if (streamJointInterval) {
    //     clearInterval(streamJointInterval)
    //     streamJointInterval = null
    //   }
    // }
    console.log('addExceptionListener', this)
    throw new Error('Method not implemented.')
  }

  public static removeExceptionListener(): void {
    console.log('removeExceptionListener', this)
    throw new Error('Method not implemented.')
  }

  public static async addStatusListener() {
    const client = getRPCClient()
    // 参考https://github.com/timostamm/protobuf-ts/blob/main/MANUAL.md#rpc-options
    const jointCall = client.teachBoardStartStatusStream({}, {})
    jointCall.responses.onMessage((resp: any) => {
      if (getServoState() !== resp.servo_state) {
        setServoState(resp.servo_state)
      }
      if (
        resp.servo_state !== 'OFF' &&
        resp.servo_state !== 'Init' &&
        getPower() === false
      ) {
        setPower(true)
        setEmergencyStop(false)
      } else if (
        (resp.servo_state === 'OFF' || resp.servo_state === 'Init') &&
        getPower() === true
      ) {
        setPower(false)
        setEmergencyStop(false)
      } else if (
        resp.servo_state === 'EMC_STOP' &&
        getEmergencyStop() === false
      ) {
        setEmergencyStop(true)
      }
      const joints: string[] = []
      for (const index in resp.joints) {
        joints.push(parseFloat(resp.joints[index]).toFixed(3))
      }
      if (!(getCurrentJoints().toString() === joints.toString())) {
        const saveJoints = JSON.parse(JSON.stringify(joints))
        setCurrentJoints(saveJoints)
      }
      const poseVelocity: string[] = []
      for (const index in resp.velocitys) {
        poseVelocity.push(parseFloat(resp.velocitys[index]).toFixed(3))
      }
      if (!(getPoseVelocity().toString() === poseVelocity.toString())) {
        setPoseVelocity(poseVelocity)
      }

      const leftArm: string[] = []
      for (const index in resp.left_arm) {
        leftArm.push(parseFloat(resp.left_arm[index]).toFixed(3))
      }
      leftArm.push(parseFloat(resp.joints[0]).toFixed(3))
      if (!(getLeftArm().toString() === leftArm.toString())) {
        setLeftArm(leftArm)
      }
      const rightArm: string[] = []
      for (const index in resp.right_arm) {
        rightArm.push(parseFloat(resp.right_arm[index]).toFixed(3))
      }
      rightArm.push(parseFloat(resp.joints[0]).toFixed(3))
      if (!(getRightArm().toString() === rightArm.toString())) {
        setRightArm(rightArm)
      }
      // 设置blade对应的IO OUTPUT信息,对应是否吸气
      const blades: boolean[] = []
      blades.push(resp.digit_io_out_r1)
      blades.push(resp.digit_io_out_r2)
      if (getBlades().toString() !== blades.toString()) {
        setBlades(blades)
      }
      // 设置blade传感器信息,对应是否有wafer
      const waferSensors: boolean[] = []
      waferSensors.push(resp.digit_io_in_r1)
      waferSensors.push(resp.digit_io_in_r2)
      if (getWaferSensors().toString() !== waferSensors.toString()) {
        setWaferSensors(waferSensors)
      }
    })
    jointCall.responses.onError((err: any) => {
      destoryRPCClient()
      if (rpcIntervalTimer === null) {
        // 使用 setInterval 设置轮询
        rpcIntervalTimer = setInterval(() => {
          // eslint-disable-next-line no-use-before-define
          reconnectRPC()
        }, rpcReconnectInterval)
        // 立即执行一次
        // eslint-disable-next-line no-use-before-define
        reconnectRPC()
        ElMessage.error('连接已断开，尝试重连...')
      }
    })
    jointCall.responses.onComplete(() => {
      console.log('stream onComplete')
    })
  }

  public static removeStatusListener(): void {
    console.log('removeStatusListener', this)
    throw new Error('Method not implemented.')
  }

  public static removeAllListeners(): void {
    console.log('removeAllListeners', this)
    // throw new Error('Method not implemented.')
  }
}

/**
 * 测试RPC是否联通
 * @returns
 */
export const testRPCIsOk = (client: any) => {
  return new Promise((resolve, reject) => {
    client
      .ping({
        message: '',
        code: 0
      })
      .then((res: any) => {
        if (res.response.code === 0) {
          return resolve(res.response)
        }
        return reject(new Error('连接未连通，未知错误'))
      })
      .catch((err: any) => {
        return reject(err.toString() || '连接未连通，未知错误')
      })
  })
}

/**
 * 增加RPC连接状态监听
 */
export const addRPCConnectListener = () => {
  const client = getRPCClient()
  if (client) {
    // webRpcListenerUtils.addExceptionListener()
    webRpcListenerUtils.addStatusListener()
  }
}

/**
 * 新建RPC client
 * @param projectConfig
 */
export const initRobotRPCClient = (projectConfig: any) => {
  console.log('initRobotRPCClient')
  return new Promise((resolve, reject) => {
    const client = new RobotGrpcServiceClient(
      new GrpcWebFetchTransport({
        baseUrl: `http://${projectConfig.ip}:9090`
      })
    )
    testRPCIsOk(client)
      .then(() => {
        store.commit('rpc/setRPCClient', client)
        store.commit('rpc/setIsRPCConnected', true)
        if (rpcIntervalTimer !== null) {
          clearInterval(rpcIntervalTimer)
          rpcIntervalTimer = null
        }
        addRPCConnectListener()
        resolve(client)
      })
      .catch((err: any) => {
        // 监听并尝试重连
        if (rpcIntervalTimer === null) {
          // 只有第一次打印。否则的话，每次重连的时候可能都会打印
          ElMessage.error(`连接失败，${err.toString()}`)
          // 使用 setInterval 设置轮询
          rpcIntervalTimer = setInterval(() => {
            // eslint-disable-next-line no-use-before-define
            reconnectRPC()
            console.log('连接已断开，尝试重连...')
          }, rpcReconnectInterval)
        }
        reject(err)
      })
  })
}

/**
 * 重连RPC
 */
export const reconnectRPC = () => {
  console.log('reconnectRPC')
  destoryRPCClient()
  return initRobotRPCClient(getCurrentProjectConfig())
}

/**
 * 执行RPC方法
 * @param method RPC方法
 * @param arg 参数
 * @return {Promise.resolve || Promise.reject}
 */
export const execRPCMethod = (method: string, arg = {}) => {
  // 将method首字母小写，因为grpc的方法首字母是小写的
  method = method.charAt(0).toLowerCase() + method.slice(1)
  return new Promise((resolve, reject) => {
    const rpcClient = getRPCClient()
    if (!rpcClient) {
      ElMessage.error(`连接异常${method}`)
      reject(new Error('连接异常'))
    }
    if (!rpcClient[method]) {
      reject(new Error(`GRPC不存在该调用 RPCClient["${method}"]`))
    }
    rpcClient[method](arg)
      .then((res: any) => {
        // if (res.response.code === 0) {
        return resolve(res.response)
        // }
        // ElMessage.error('远程RPC调用失败')
        // return reject(new Error(res.response.reply))
      })
      .catch((err: any) => {
        ElMessage.error('远程RPC调用失败', err.toString())
        reject(err)
      })
  })
}

/**
 * 设置运行模式，示教模式或上位机模式
 */
export const setRunningMode = (mode: string) => {
  const request: SetRunningModeRequest = SetRunningModeRequest.create({
    mode
  })
  return execRPCMethod('SetRunningMode', request)
}

/**
 * 上电
 * @returns
 */
export const powerOn = () => {
  // 调用对应的rpc方法
  return execRPCMethod('PowerOn')
}

/**
 * 下电
 * @returns
 */
export const powerOff = () => {
  return execRPCMethod('PowerOff')
}

export const ping = () => {
  return execRPCMethod(ping.name)
}

/**
 * RPC是否已经连接到后端了
 * @return {boolean}
 */
export const isRPCConnected = () => {
  return store.state.rpc.isRPCConnected
}

/**
 * 单轴示教运动
 * @param axis
 * @param direction
 * @return {Promise.resolve}
 */
export const teachMoveStep = (axis: any, direction: any, jogStep: any) => {
  return execRPCMethod('TeachMoveStep', {
    axis,
    direction,
    jog_step: jogStep
  })
}

export const teachJogStart = async (
  axis: any,
  direction: any,
  velocityLevel: JogVelocityLevel = JogVelocityLevel.LOW
) => {
  const request: TeachJogStartRequest = TeachJogStartRequest.create({
    axis,
    direction,
    velocity_level: velocityLevel
  })
  await execRPCMethod('TeachJogStart', request)
}

export const teachJogStop = async () => {
  const request: TeachJogStopRequest = TeachJogStopRequest.create({})
  await execRPCMethod('TeachJogStop', request)
}

/**
 * 机械臂急停
 * @return {Promise.resolve}
 */
export const emergencyStop = () => {
  return execRPCMethod('EmergencyStop')
}

/**
 * 机械臂急停恢复
 * @return {Promise.resolve}
 */
export const emergencyRecover = () => {
  return execRPCMethod('EmergencyRecover')
}

/**
 * 获取DOF
 * @return {Promise.resolve}
 */
export const getDof = async () => {
  const data: any = await execRPCMethod('TeachGetDof')
  return Promise.resolve(data.dof)
}

/**
 * 获取示教速度
 * @return {Promise.resolve}
 */
export const getVelocity = async () => {
  const request: TeachGetVelocityRequest = TeachGetVelocityRequest.create({})
  const data: any = await execRPCMethod('TeachGetVelocity', request)
  return Promise.resolve(data.velocity)
}

export const getJogVelocity = () => {
  return execRPCMethod('GetJogVelocity')
}

export const setJogVelocityLevel = (jogVelocityLevel: JogVelocityLevel) => {
  console.log('set jog velocity level', jogVelocityLevel)
  const request: SetJogVelocityLevelRequest = SetJogVelocityLevelRequest.create(
    {
      velocity_level: jogVelocityLevel
    }
  )
  return execRPCMethod('SetJogVelocityLevel', request)
}

/**
 * 获取下位机配置
 * @return {Promise.resolve}
 */
export const getRobotSetting = (type: any) => {
  const request: RobotSettingRequest = RobotSettingRequest.create({
    setting_type: type
  })
  return execRPCMethod('GetRobotSetting', request)
}

/**
 * 保存下位机配置
 * @return {Promise.resolve}
 */

/**
 * 获取IO配置
 * @returns {Promise.resolve}
 */
export const getIOSetting = () => {
  return execRPCMethod('GetIOSetting')
}

/**
 * 获得节点配置
 * @returns {Promise.resolve}
 */
export const getJointSetting = () => {
  return execRPCMethod('GetJointSetting')
}

/**
 * 获得设备配置
 * @returns {Promise.resolve}
 */
export const getDeviceSetting = () => {
  return execRPCMethod('GetDeviceSetting')
}

/**
 * 保存下位机配置
 * @return {Promise.resolve}
 */
export const saveJointSetting = (data: any) => {
  const request: SaveJointSettingRequest = SaveJointSettingRequest.create({
    data
  })
  return execRPCMethod('SaveJointSetting', request)
}

/**
 * 保存下位机配置
 * @return {Promise.resolve}
 */
export const saveIOSetting = (data: any) => {
  const request: SaveIOSettingRequest = SaveIOSettingRequest.create({
    data
  })
  return execRPCMethod('SaveIOSetting', request)
}

/**
 * 保存当前关节点位置
 * @param dataName
 * @param describe
 * @param arm
 * @param slot
 * @param code
 * @param hasMid
 * @returns
 */
export const teachSaveCurrentJoint = async (
  dataName: any,
  describe: any,
  arm: any,
  slot: any,
  code: any,
  hasMid: any
) => {
  const request: TeachSavePositionRequest = TeachSavePositionRequest.create({
    name: dataName,
    describe,
    arm,
    slot,
    code,
    has_mid: hasMid
  })
  return execRPCMethod('TeachSavePosition', request)
}

/**
 * 机械臂回零
 * @return {Promise.resolve}
 */
export const goHome = () => {
  return execRPCMethod('TeachMoveHome')
}

/**
 * 清除运动错误
 * @return {Promise.resolve}
 */
export const clearMoveError = () => {
  return execRPCMethod('ClearError')
}

/**
 * 获取机械臂运行状态
 * @return {Promise.resolve}
 */
export const teachGetRunType = async () => {
  const data: any = await execRPCMethod('TeachGetRunType')
  return Promise.resolve(data.type)
}

/**
 * 删除数据
 */
export const deletePoint = async (name: any, type: any, arm: any) => {
  await execRPCMethod('DeletePoint', { name, code: type, message: arm })
}

/**
 * 获取已有数据点名称
 */
export const getAllPointNames = async () => {
  const data = await execRPCMethod('getAllPointNames')
  return Promise.resolve(data)
}

/**
 * 运动至指定关节点点
 */
export const goTeachJoint = async (pointName: any, message: any) => {
  const request: GoTeachJointRequest = GoTeachJointRequest.create({
    point_name: pointName,
    message
  })
  return execRPCMethod('GoTeachJoint', request)
}

export const teachInstruction = async (
  type: any,
  speed: any,
  startPoint: any,
  midPoint: any,
  endPoint: any,
  sleepTime: any,
  arm: any,
  fixBlade: any
) => {
  await execRPCMethod('TeachInstruction', {
    op_type: type,
    speed,
    start_point: startPoint,
    mid_point: midPoint,
    end_point: endPoint,
    sleep_time: sleepTime,
    arm,
    fixBlade
  })
}

export const getPutWafer = async (
  startArm: any,
  endArm: any,
  startCassette: any,
  startSlot: any,
  endCassette: any,
  endSlot: any,
  startArmPosture: any,
  endArmPosture: any
) => {
  await execRPCMethod('GetPutWafer', {
    start_arm: startArm,
    end_arm: endArm,
    start_cassette: startCassette,
    start_slot: startSlot,
    end_cassette: endCassette,
    end_slot: endSlot,
    start_arm_posture: startArmPosture,
    end_arm_posture: endArmPosture
  })
}

export const getPutWaferStop = async () => {
  await execRPCMethod('GetPutWaferStop', {})
}

export const operateWafer = async (
  type: any,
  arm: any,
  aimPoint: any,
  aimSlot: any,
  armPosture: any
) => {
  const request: OperateWaferRequest = OperateWaferRequest.create({
    type,
    arm,
    aim_point: aimPoint,
    aim_slot: aimSlot,
    arm_posture: armPosture
  })
  await execRPCMethod('OperateWafer', request)
}

export const debugWafer = async (
  type: any,
  arm: any,
  aimPoint: any,
  aimSlot: any,
  step: any,
  armPosture: any
) => {
  const request: DebugWaferRequest = DebugWaferRequest.create({
    type,
    arm,
    aim_point: aimPoint,
    aim_slot: aimSlot,
    step,
    arm_posture: armPosture
  })
  const result = await execRPCMethod('DebugWafer', request)
  return Promise.resolve(result)
}

/**
 * 设置IO
 * @param serial
 * @param state
 */
export const getIOOutputState = () => {
  const request: GetIOOutputStateRequest = GetIOOutputStateRequest.create({})
  execRPCMethod('GetIOOutputState', request)
}

/**
 * 设置IO
 * @param serial
 * @param state
 */
export const setIOOutputState = (serial: number, state: number) => {
  const request: SetIOOutputStateRequest = SetIOOutputStateRequest.create({
    serial,
    state
  })
  execRPCMethod('SetIOOutputState', request)
}

/**
 * 设置示教速度
 * @param speed
 * @return {Promise.resolve}
 */
export const teachSetVelocity = (speed: any) => {
  const request: TeachSetVelocityRequest = TeachSetVelocityRequest.create({
    velocity: speed
  })
  execRPCMethod('TeachSetVelocity', request)
}

export const startLayoutSimulation = async (poseList: any) => {
  const res: any = await execRPCMethod('StartLayoutSimulation', {
    pos_list: poseList
  })
  return Promise.resolve(res.access)
}

export const stopGetLayoutRobotPositionStream = async () => {
  await execRPCMethod('StopGetLayoutRobotPositionStream')
}

export const getSpeedConfig = async (
  speedType: any,
  speedLevel: any,
  joint: any
) => {
  const result: any = await execRPCMethod('GetSpeedConfig', {
    speed_type: speedType,
    speed_level: speedLevel,
    joint
  })
  return Promise.resolve(result.speed_config)
}

export const saveSpeedConfig = async (speedConfig: any, speedType: any) => {
  await execRPCMethod('SaveSpeedConfig', {
    speed_type: speedType,
    data: speedConfig
  })
}

export const getSorterConfig = async (offset: any, number: any) => {
  const result: any = await execRPCMethod('GetSorterConfig', {
    offset_type: offset,
    number
  })
  return Promise.resolve(result.sorter_config)
}

export const saveSorterConfig = async (offset: any, number: any, data: any) => {
  await execRPCMethod('SaveSorterConfig', {
    offset_type: offset,
    number,
    sorter_config: data
  })
}

export const mappingCalibrate = async (cassette: any) => {
  const request: MappingCalibrateRequest = MappingCalibrateRequest.create({
    cassette
  })
  await execRPCMethod('MappingCalibrate', request)
}

export const searchMapping = async (cassette: any) => {
  const request: SearchMappingRequest = SearchMappingRequest.create({
    cassette
  })
  const result = await execRPCMethod('SearchMapping', request)
  return result
}

export const getMappingSetting = async (station: any) => {
  const request: MappingSettingRequest = MappingSettingRequest.create({
    station
  })
  const result = await execRPCMethod('MappingSetting', request)
  return result
}

export const saveMappingSetting = async (station: any, mappingSetting: any) => {
  const request: SaveMappingSettingRequest = SaveMappingSettingRequest.create({
    station,
    mapping_setting: mappingSetting
  })
  await execRPCMethod('SaveMappingSetting', request)
}

export const getEnableMapping = async () => {
  const result: any = await execRPCMethod('GetEnableMapping', {})
  return Promise.resolve(result.enable)
}

export const saveEnableMapping = async (enable: any) => {
  const request: SaveEnableMappingRequest = SaveEnableMappingRequest.create({
    enable
  })
  await execRPCMethod('SaveEnableMapping', request)
}

export const setSolenoid = async (index: any, value: any) => {
  await execRPCMethod('SetSolenoid', {
    arm: index,
    value
  })
}

export const getSolenoid = async () => {
  const res = await execRPCMethod('GetSolenoid', {})
  return Promise.resolve(res)
}

export const redifyControllerIP = async (addresses: any, gateway4: any) => {
  await execRPCMethod('RedifyControllerIP', { addresses, gateway4 })
}

export const getServoEncode = async () => {
  const res = await execRPCMethod('GetServoEncode', {})
  return Promise.resolve(res)
}

export const getAWCConfig = async (stage: any) => {
  const res = await execRPCMethod('GetAWCConfig', { stage })
  return Promise.resolve(res)
}

export const saveAWCConfig = async (
  aimStage: any,
  enableAWC: any,
  AWCSensorNum: any,
  sensorIOSerial1: any,
  sensorIOSerial2: any,
  sensorPosition1: any,
  sensorPosition2: any
) => {
  const res = await execRPCMethod('SaveAWCConfig', {
    stage: aimStage,
    enable_awc: enableAWC,
    sensor_num: AWCSensorNum,
    sensor_io_serial1: sensorIOSerial1,
    sensor_io_serial2: sensorIOSerial2,
    sensor_pos1: sensorPosition1,
    sensor_pos2: sensorPosition2
  })
  return Promise.resolve(res)
}

export const calibrateAWCSensor = async (stage: any) => {
  await execRPCMethod('CalibrateAWCSensor', { stage })
}

export const getIOInterlockSetting = async (stage: any) => {
  const res = await execRPCMethod('GetIOInterlockSetting', { stage })
  return Promise.resolve(res)
}

export const saveIOInterlockSetting = async (
  stage: any,
  enableInterlock: any,
  enableExtend: any,
  waferSensor: any,
  armAtHome: any
) => {
  await execRPCMethod('SaveIOInterlockSetting', {
    stage,
    enable_interlock: enableInterlock,
    enable_extend: enableExtend,
    wafer_sensor: waferSensor,
    arm_at_home: armAtHome
  })
}
export const calibrateWaferSensor = async (stage: any) => {
  await execRPCMethod('CalibrateWaferSensor', { stage })
}

function uint8ArrayToString(fileData: Uint8Array) {
  let dataString = ''
  for (let i = 0; i < fileData.length; i += 1) {
    dataString += String.fromCharCode(fileData[i])
  }
  return dataString
}

/**
 * 下载获得所有点位信息
 * @returns
 */
export const downloadPointFile = () => {
  return new Promise((resolve, reject) => {
    let dataContent = ''
    const client = getRPCClient()
    // 参考https://github.com/timostamm/protobuf-ts/blob/main/MANUAL.md#rpc-options
    if (client) {
      const jointCall = client.downloadPointFile(
        DownloadPointFileRequest.create({}),
        {}
      )
      jointCall.responses.onMessage((resp: any) => {
        if (resp) {
          dataContent += uint8ArrayToString(resp.data)
        }
      })
      jointCall.responses.onError((err: any) => {
        reject(err)
      })
      jointCall.responses.onComplete(() => {
        resolve(dataContent)
      })
    }
  })
}

export const getException = async () => {
  const request: GetExceptionRequest = GetExceptionRequest.create({})
  const res = await execRPCMethod('GetException', request)
  return Promise.resolve(res)
}

export const deleteException = async () => {
  const request: DeleteExceptionRequest = DeleteExceptionRequest.create({})
  await execRPCMethod('DeleteException', request)
}

export const getIOInputState = async () => {
  return new Promise((resolve, reject) => {
    const client = getRPCClient()
    // 参考
    const ioInputCall = client.getIOInputState({}, {})
    ioInputCall.responses.onMessage((resp: any) => {
      resolve(resp)
    })
    ioInputCall.responses.onError((err: any) => {
      reject(err)
    })
    ioInputCall.responses.onComplete(() => {
      console.log('stream onComplete')
    })
  })
}

/**
 * 获取IO状态
 */
export const stopGetIOInputState = () => {
  const request: StopGetIOInputStateRequest = StopGetIOInputStateRequest.create(
    {}
  )
  execRPCMethod('StopGetIOInputState', request)
}

export const calibrateRobotParam = async () => {
  const request: CalibrateRobotParamRequest = CalibrateRobotParamRequest.create(
    {}
  )
  const res = await execRPCMethod('CalibrateRobotParam', request)
  return Promise.resolve(res)
}
