// @ts-nocheck
import { ElMessage } from 'element-plus'
import { toRaw } from 'vue'
import * as grpc from '@grpc/grpc-js'
import {
  setPower,
  getPower,
  getServoState,
  setServoState,
  setEmergencyStop,
  getEmergencyStop
} from '../arm_state'
import { appendException, getExceptionLevel } from '../exception'
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
  getAxisCoor,
  setAxisCoor
} from '../data'
import store from '@/store'
import { IServiceDetails, makeGrpcClient } from './proto'

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
  // rpcListenerUtils.removeAllListeners()
  setPower(false)
}

export class rpcListenerUtils {
  public static addExceptionListener(): void {
    console.log('addExceptionListener', this)
    throw new Error('Method not implemented.')
  }

  // public static removeExceptionListener(): void {
  //   console.log('removeExceptionListener', this)
  //   throw new Error('Method not implemented.')
  // }

  public static addStatusListener() {
    const client = getRPCClient()
    // 参考https://github.com/timostamm/protobuf-ts/blob/main/MANUAL.md#rpc-options
    const jointCall = client.teachStreamStartGetJoints({}, {})
    jointCall.on('data', (resp) => {
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

      if (
        getCurrentProjectConfig().armType &&
        (getCurrentProjectConfig().armType.key === 'M122' ||
          getCurrentProjectConfig().armType.key === 'M124' ||
          getCurrentProjectConfig().armType.key === 'KHVR1')
      ) {
        interface StrAxis {
          x: string
          y: string
        }
        const axisCoor: StrAxis[] = []
        const axis1: StrAxis = { x: '0', y: '0' }
        axis1.x = parseFloat(resp.a[0]).toFixed(3)
        axis1.y = parseFloat(resp.a[1]).toFixed(3)
        axisCoor.push(axis1)
        const axis2: StrAxis = { x: '0', y: '0' }
        axis2.x = parseFloat(resp.b[0]).toFixed(3)
        axis2.y = parseFloat(resp.b[1]).toFixed(3)
        axisCoor.push(axis2)
        const axis3: StrAxis = { x: '0', y: '0' }
        axis3.x = parseFloat(resp.c[0]).toFixed(3)
        axis3.y = parseFloat(resp.c[1]).toFixed(3)
        axisCoor.push(axis3)
        const axis4: StrAxis = { x: '0', y: '0' }
        axis4.x = parseFloat(resp.d[0]).toFixed(3)
        axis4.y = parseFloat(resp.d[1]).toFixed(3)
        axisCoor.push(axis4)
        for (const index in getAxisCoor()) {
          if (
            !(
              JSON.stringify(getAxisCoor()[index]) ===
              JSON.stringify(axisCoor[index])
            )
          ) {
            setAxisCoor(axisCoor)
            break
          }
        }
      }
    })
    jointCall.on('error', (err: any) => {
      destoryRPCClient()
      ElMessage.error(`流式获取关节错误：${err.toString()}`)
      console.error('流式获取关节错误：', err.toString())
    })
    jointCall.on('end', () => {
      destoryRPCClient()
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
    client.Ping({}, (err: any, resp: any) => {
      if (err) {
        return reject(err.toString() || '未知RPC调用错误')
      }
      if (resp.code === 0) {
        return resolve(resp)
      }
      return reject(new Error('连接未连通，未知错误'))
    })
  })
}

/**
 * 增加RPC连接状态监听
 */
export const addRPCConnectListener = () => {
  const client = getRPCClient()
  if (client) {
    // rpcListenerUtils.addExceptionListener()
    rpcListenerUtils.addStatusListener()
  }
}

/**
 * 新建RPC client
 * @param projectConfig
 */
export const initRobotRPCClient = (projectConfig: any) => {
  return new Promise((resolve, reject) => {
    const protoService: IServiceDetails = {
      path: '../../../public/grpc/proto/robot_grpc_service.proto',
      package: 'rosc',
      service: 'RobotGrpcService',
      ipAndport: `${projectConfig.ip}:50051`,
      channelCredentials: grpc.credentials.createInsecure()
    }
    const client = makeGrpcClient(protoService)
    testRPCIsOk(client)
      .then(() => {
        store.commit('rpc/setRPCClient', client)
        store.commit('rpc/setIsRPCConnected', true)
        addRPCConnectListener()
        resolve(client)
      })
      .catch((err) => {
        ElMessage.error('连接失败')
        reject(err)
      })
  })
}

/**
 * 重连RPC
 */
export const reconnectRPC = () => {
  destoryRPCClient()
  initRobotRPCClient(getCurrentProjectConfig())
}

/**
 * 执行RPC方法
 * @param method RPC方法
 * @param arg 参数
 * @return {Promise.resolve || Promise.reject}
 */
export const execRPCMethod = (method: any, arg = {}) => {
  return new Promise((resolve, reject) => {
    const RPCClient = getRPCClient()
    if (!RPCClient) {
      ElMessage.error('连接异常')
      reject(new Error('连接异常'))
    }
    if (!RPCClient[method]) {
      reject(new Error(`GRPC不存在该调用 RPCClient["${method}"]`))
    }
    RPCClient[method](arg, (err: any, resp: any) => {
      // writeInfo("调用RPC完成", `${method}返回值 err:${err} resp:${JSON.stringify(resp)}`)
      // console.log(
      //   `调用rpc ${method} 返回值 err:${err} resp:${JSON.stringify(resp)}`
      // )
      if (err) {
        destoryRPCClient()
        ElMessage.error(err.toString() || '远程调用错误')
        return reject(err.toString() || '未知RPC调用错误')
      }
      if (resp) {
        const rpcData = resp
        if (rpcData.code === 0) {
          console.log('success')
          if (rpcData.reply) {
            ElMessage.success(rpcData.reply.toString())
          }
          return resolve(rpcData)
        }
        if (rpcData.code === 2) {
          return resolve(rpcData)
        }
        console.log('error2')
        ElMessage.error(rpcData.reply.toString() || '未知错误')
        return reject(rpcData.reply.toString() || '未知错误')
      }
      return reject(new Error('位置错误'))
    })
  })
}

/**
 * RPC是否已经连接到后端了
 * @return {boolean}
 */
export const isRPCConnected = () => {
  let streamExceptionInterval: any = null
  if (store.state.rpc.isRPCConnected) {
    const exceptionLevel = getExceptionLevel()
    const client = getRPCClient()
    const exceptionCall = client.GetStreamException({
      message: 'get exception'
    })
    exceptionCall.on('data', (resp: any) => {
      if (resp.level > 0) {
        const exception: any = {}
        exception.level = resp.level
        exception.exception_level = exceptionLevel[resp.level]
        exception.time = resp.time
        exception.statu_code = resp.status_code
        exception.message = resp.message
        appendException(exception)
      }
    })
    // exceptionCall.on('error', (err: any) => {
    //   destoryRPCClient()
    //   console.log('流式获取异常错误：', err.toString())
    // })
    streamExceptionInterval = setInterval(() => {
      if (store.state.rpc.isRPCConnected) {
        exceptionCall.write({ message: 'get exception' })
      } else {
        // exceptionCall.cancel()
        destoryRPCClient()
        clearInterval(streamExceptionInterval)
        streamExceptionInterval = null
      }
    }, 1000)
  } else if (streamExceptionInterval) {
    clearInterval(streamExceptionInterval)
    streamExceptionInterval = null
  }
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
  let data: any = null
  data = await execRPCMethod('TeachGetDof')
  return Promise.resolve(data.dof)
}

/**
 * 上电
 * @return {Promise.resolve}
 */
export const powerOn = () => {
  return execRPCMethod(powerOn.name)
}

/**
 * 下电
 * @return {Promise.resolve}
 */
export const powerOff = () => {
  return execRPCMethod(powerOff.name)
}

/**
 * 获取示教速度
 * @return {Promise.resolve}
 */
export const getVelocity = async () => {
  let data: any = null
  data = await execRPCMethod('TeachGetVelocity')
  return Promise.resolve(data.velocity)
}

/**
 * 获取下位机配置
 * @return {Promise.resolve}
 */
export const getRobotSetting = (type: any) => {
  return execRPCMethod('GetRobotSetting', { setting_type: type })
}

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
  return execRPCMethod('SaveJointSetting', { data })
}

/**
 * 保存下位机配置
 * @return {Promise.resolve}
 */
export const saveIOSetting = (data: any) => {
  return execRPCMethod('SaveIOSetting', { data })
}

/**
 * 保存当前关节点位置
 * @param {string} dataName
 * @return {Promise.resolve}
 */
export const teachSaveCurrentJoint = async (
  dataName: any,
  describe: any,
  arm: any,
  slot: any,
  code: any,
  hasMid: any
) => {
  const data = execRPCMethod('TeachSavePosition', {
    name: dataName,
    describe,
    arm,
    slot,
    code,
    hasMid
  })
  return data
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
  let data: any = null
  data = await execRPCMethod('TeachGetRunType')
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
  await execRPCMethod('GoTeachJoint', {
    point_name: pointName,
    message
  })
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
  await execRPCMethod('OperateWafer', {
    type,
    arm,
    aim_point: aimPoint,
    aim_slot: aimSlot,
    arm_posture: armPosture
  })
}

export const debugWafer = async (
  type: any,
  arm: any,
  aimPoint: any,
  aimSlot: any,
  step: any,
  armPosture: any
) => {
  const result = await execRPCMethod('DebugWafer', {
    type,
    arm,
    aim_point: aimPoint,
    aim_slot: aimSlot,
    step,
    arm_posture: armPosture
  })
  return Promise.resolve(result)
}

/**
 * 设置IO
 * @param serial
 * @param state
 */
export const setIOOutputState = (serial: any, state: any) =>
  execRPCMethod('SetIOOutputState', { serial, state })

/**
 * 获取IO状态
 */
export const getIOInputState = async () => {
  return new Promise((resolve, reject) => {
    const client = getRPCClient()
    // 参考
    const ioInputCall = client.GetIOInputState({}, {})
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
 * 设置IO
 * @param serial
 * @param state
 */
export const getIOOutputState = () => {
  execRPCMethod('GetIOOutputState')
}

/**
 * 获取IO状态
 */
export const stopGetIOInputState = async () => {
  await execRPCMethod('StopGetIOInputState')
}

/**
 * 设置示教速度
 * @param speed
 * @return {Promise.resolve}
 */
export const teachSetVelocity = (speed: any) =>
  execRPCMethod('TeachSetVelocity', { velocity: speed })

export const startLayoutSimulation = async (poseList: any) => {
  let res: any = null
  res = await execRPCMethod('StartLayoutSimulation', {
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
  let result: any = null
  result = await execRPCMethod('GetSpeedConfig', {
    speed_type: speedType,
    speed_level: speedLevel,
    joint
  })
  return Promise.resolve(result)
}

export const saveSpeedConfig = async (
  speedConfig: any,
  speedType: any,
  specifySpeed: any
) => {
  await execRPCMethod('SaveSpeedConfig', {
    speed_type: speedType,
    data: speedConfig,
    specify_speed: specifySpeed
  })
}

export const getSorterConfig = async (offset: any, number: any) => {
  let result: any = null
  result = await execRPCMethod('GetSorterConfig', {
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
  await execRPCMethod('MappingCalibrate', { cassette })
}

export const searchMapping = async (cassette: any) => {
  const result = await execRPCMethod('SearchMapping', { cassette })
  return result
}

function uint8ArrayToString(fileData: any) {
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
    const call = client.DownloadPointFile({})
    call.on('data', (resp: any) => {
      dataContent += uint8ArrayToString(resp.data)
    })
    call.on('end', () => {
      resolve(dataContent)
    })
    call.on('error', (error: any) => {
      reject(error)
    })
  })
}

export const getMappingSetting = async (selectStation: any) => {
  const result = await execRPCMethod('MappingSetting', {
    station: selectStation
  })
  return result
}

export const saveMappingSetting = async (
  selectStation: any,
  mappingSetting: any
) => {
  await execRPCMethod('SaveMappingSetting', {
    station: selectStation,
    mapping_setting: mappingSetting
  })
}

export const getEnableMapping = async () => {
  let result: any = null
  result = await execRPCMethod('GetEnableMapping', {})
  return Promise.resolve(result.enable)
}

export const saveEnableMapping = async (enable: any) => {
  await execRPCMethod('SaveEnableMapping', { enable })
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

export const calibrateAWCSensor = async (stage: any, arm: any) => {
  await execRPCMethod('CalibrateAWCSensor', { stage, arm })
}

export const getIOInterlockSetting = async (stage: any) => {
  const res = await execRPCMethod('GetIOInterlockSetting', { stage })
  return Promise.resolve(res)
}

export const saveIOInterlockSetting = async (
  stage: any,
  enableExtendSensor: any,
  waferSensor: any,
  armAtHomeSensor: any,
  enableExtendState: any,
  waferSensorState: any,
  armAtHomeState: any,
  tzState: any
) => {
  await execRPCMethod('SaveIOInterlockSetting', {
    stage,
    enable_extend_sensor: enableExtendSensor,
    wafer_sensor: waferSensor,
    arm_at_home_sensor: armAtHomeSensor,
    enable_extend_state: enableExtendState,
    arm_at_home_state: armAtHomeState,
    wafer_sensor_state: waferSensorState,
    tz_state: tzState
  })
}
export const calibrateWaferSensor = async (stage: any) => {
  await execRPCMethod('CalibrateWaferSensor', { stage })
}

export const findZero = async () => {
  await execRPCMethod('FindZero', {})
}

export const updatePointFile = async (dataString: any) => {
  const client = getRPCClient()
  const chunkSize = 1024 * 1024 // 分块大小
  const updateStream = client.updatePointFile()

  for (let offset = 0; offset < dataString.length; offset += chunkSize) {
    const chunk = dataString.slice(offset, offset + chunkSize)
    // const bytes = []
    // for (let i = 0; i < chunk.length; i++) {
    //   bytes.push(chunk.charCodeAt(i))
    // }
    // const buffer = Buffer.from(chunk, 'utf8')
    // const bytes = new grpcBytes(buffer)
    updateStream.write({ data: chunk })
  }
  updateStream.end()
  updateStream.on('data', () => {
    // if (response.code !== 0) {
    //   ElMessage.error('数据更新失败')
    // }
  })
  updateStream.on('error', (error: any) => {
    ElMessage.error('数据更新失败:', error)
  })
  updateStream.on('end', () => {})
}

export const getStageSetting = async (stage: any) => {
  const res = await execRPCMethod('GetStageSetting', { stage })
  return Promise.resolve(res)
}

export const saveStageSetting = async (stage: any, settingItems: any) => {
  await execRPCMethod('SaveStageSetting', {
    stage,
    setting_items: settingItems
  })
}

export const teachStreamStopGetJoints = async () => {
  await execRPCMethod('TeachStreamStopGetJoints', {})
}

export const calibrateRobotParam = async () => {
  const res = await execRPCMethod('CalibrateRobotParam', {})
  return Promise.resolve(res)
}

export const teachJogStart = async (
  axis: number,
  direction: number,
  velocityLevel: number
) => {
  await execRPCMethod('TeachJogStart', {
    axis,
    direction,
    velocity_level: velocityLevel
  })
}

export const teachJogStop = async () => {
  await execRPCMethod('TeachJogStop', {})
}
