// @ts-nocheck
/**
 * 对data和web_data进行封装，建立一个中间层，
 * 通过动态加载技术，屏蔽掉底层通信细节
 */
// TODO: 将web_data和data相同的函数进行合并维护
// 目前正在修复中，逐步将共用的函数提取到my_data.ts当中
// 主要是web版本不允许使用fs模块，所以需要将fs模块的函数进行替换
// 动态加载模块
import yaml from 'js-yaml'
import store from '@/store/index'

let dataUtil: any = null
async function loadDataUtil() {
  if (process.env.PROJECT_NAME === 'teach_board') {
    dataUtil = await import('./data/web_data')
    return dataUtil
  }
  dataUtil = await import('./data')
  return dataUtil
}

export const getProjectPointFileName = () => {
  return dataUtil.getProjectPointFileName()
}

/**
 * 获取所有的数据
 */
export const getAllJointData = (dataContent: string, robotType: string) => {
  try {
    const joints = yaml.load(dataContent)
    const jsonstr = JSON.stringify(joints)
    const jsonTemp = JSON.parse(jsonstr)
    const jointDatas: any = []
    for (const item in jsonTemp) {
      if (item.indexOf('HOME') !== -1 && item.indexOf(robotType) === -1) {
        // eslint-disable-next-line no-continue
        continue
      }
      if (item.indexOf('ZERO') !== -1 && item.indexOf(robotType) === -1) {
        // eslint-disable-next-line no-continue
        continue
      }
      if (robotType === 'openEulerRobot') {
        if (jsonTemp[item] != null) {
          const leftArmData = {
            name: item,
            arm: 'R2(lower)' // 'arm_pos_l'
          }
          for (let i = 0; i < jsonTemp[item].arm_pos_l.length; i += 1) {
            leftArmData[i] = parseFloat(jsonTemp[item].arm_pos_l[i]).toFixed(3)
          }
          jointDatas.push(leftArmData)
          const rightArmData = {
            name: item,
            arm: 'R1(upper)' // 'arm_pos_r'
          }
          for (let i = 0; i < jsonTemp[item].arm_pos_r.length; i += 1) {
            rightArmData[i] = parseFloat(jsonTemp[item].arm_pos_r[i]).toFixed(3)
          }
          jointDatas.push(rightArmData)
          const encoder = {
            name: item,
            arm: 'encoder'
          }
          for (let i = 0; i < jsonTemp[item].arm_pos_r.length; i += 1) {
            encoder[i] = parseInt(jsonTemp[item].encoder[i], 10)
          }
          jointDatas.push(encoder)
        }
      } else if (robotType === 'KHVR1') {
        if (jsonTemp[item] != null) {
          const data = {
            name: item
          }
          for (let i = 0; i < jsonTemp[item].pose.length; i += 1) {
            data[i] = parseFloat(jsonTemp[item].pose[i]).toFixed(3)
          }
          jointDatas.push(data)
        }
      } else if (robotType === 'KHVR2') {
        if (jsonTemp[item] != null) {
          const AArmData = {
            name: item,
            arm: 'A'
          }
          if (jsonTemp[item].A) {
            for (let i = 0; i < jsonTemp[item].A.length; ++i) {
              AArmData[i] = parseFloat(jsonTemp[item].A[i]).toFixed(3)
            }
          } else {
            for (let i = 0; i < 3; ++i) {
              AArmData[i] = '--'
            }
          }
          jointDatas.push(AArmData)
          const BArmData = {
            name: item,
            arm: 'B'
          }
          if (jsonTemp[item].B) {
            for (let i = 0; i < jsonTemp[item].B.length; ++i) {
              BArmData[i] = parseFloat(jsonTemp[item].B[i]).toFixed(3)
            }
          } else {
            for (let i = 0; i < 3; ++i) {
              BArmData[i] = '--'
            }
          }

          jointDatas.push(BArmData)
        }
      }
    }
    return jointDatas
  } catch (e) {
    console.log(e)
  }
}

/**
 * 获取所有的buildInData
 * @return {Object}
 */
export const getBuildInData = (robotType: any) => {
  return dataUtil.getBuildInData(robotType)
}

/**
 * 获取所有的dataType
 * @return {Object}
 */
export const getDataTypes = () => {
  return store.state.data.dataType
}

/**
 * 获取某一类型的数据
 * @return {Object}
 */
export const getData = (dataType: string) => {
  return dataUtil.getData(dataType)
}

/**
 * 获取所有关节
 * @return {Object}
 */
export const getJoints = () => {
  return dataUtil.getJoints()
}

/**
 * 获取所有位姿
 * @return {Object}
 */
export const getPoses = () => {
  return dataUtil.getPoses()
}

/**
 * 获取所有关节
 * @return {Object}
 */
export const getCurrentJoints = () => {
  return dataUtil.getCurrentJoints()
}

export const setCurrentJoints = (joints: any) => {
  return dataUtil.setCurrentJoints(joints)
}

export const getLeftArm = () => {
  return dataUtil.getLeftArm()
}

export const setLeftArm = (leftArm: any) => {
  return dataUtil.setLeftArm(leftArm)
}

export const getRightArm = () => {
  return dataUtil.getRightArm()
}

export const setRightArm = (rightArm: any) => {
  return dataUtil.setRightArm(rightArm)
}

export const setBlades = (blades: any) => {
  return dataUtil.setBlades(blades)
}

export const getBlades = () => {
  return dataUtil.getBlades()
}

export const getWaferSensors = () => {
  return dataUtil.getWaferSensors()
}

export const setWaferSensors = (waferSensors: Array) => {
  return dataUtil.setWaferSensors(waferSensors)
}

export const setPoseVelocity = (poseVelocity: any) => {
  return dataUtil.setPoseVelocity(poseVelocity)
}

export const getPoseVelocity = () => {
  return dataUtil.getPoseVelocity()
}

export const setAxisCoor = (axisCoor: any) => {
  return dataUtil.setAxisCoor(axisCoor)
}

export const getAxisCoor = () => {
  return dataUtil.getAxisCoor()
}

/**
 * 获取默认描述
 * @return {Object}
 */
export const getDescribe = (dataType: any) => {
  return dataUtil.getDescribe(dataType)
}

/**
 * 更新数据到vuex
 * @param dataType
 * @param data
 */
export const updateDataToVuex = (dataType: any, data: any) => {
  return dataUtil.updateDataToVuex(dataType, data)
}

/**
 * data默认是object，这里转成list的格式
 * @param dataType
 * @return {Array}
 */
export const getDataList = (dataType: any) => {
  return dataUtil.getDataList(dataType)
}

/**
 * 格式化数据。数组在RobotStudio中都是以JSON格式存储的，在Blockly和文本编辑的时候需要以
 * C语言的格式初始化，即{a: 66,b: {c:1, d: 1}} 需要初始化为{66, {1,2}}
 * @param {Object} dataType
 * @param {Object} data
 * @return {String}
 */
export const formatJsonDataToC = (dataType: any, data: any) => {
  return dataUtil.formatJsonDataToC(dataType, data)
}

export default {
  install: () => {
    loadDataUtil()
      .then(() => {
        console.log('dataUtil loaded')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
