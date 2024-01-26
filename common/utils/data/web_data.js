import mitt from 'mitt'
import yaml from 'js-yaml'
import store from '@/store/index'

export const getProjectPointFileName = () => {
  return 'POINT.yml'
}

/**
 * 获取所有的buildInData
 * @return {Object}
 */
export const getBuildInData = () => {
  return store.state.data.buildInData
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
export const getData = (dataType) => {
  for (const key in store.state.data.dataType) {
    if (store.state.data.dataType[key].key === dataType.key) {
      return JSON.parse(JSON.stringify(store.state.data.dataType[key].data))
    }
  }
  return {}
}

/**
 * 获取所有关节
 * @return {Object}
 */
export const getJoints = () => {
  return getData(getDataTypes().joint)
}

/**
 * 获取所有位姿
 * @return {Object}
 */
export const getPoses = () => {
  return getData(getDataTypes().pose)
}

/**
 * 获取所有关节
 * @return {Object}
 */
export const getCurrentJoints = () => {
  return store.state.data.currentJoints
}

export const setCurrentJoints = (joints) => {
  store.commit('data/setCurrentJoints', joints)
}

export const getLeftArm = () => {
  return store.state.data.currentLeftArm
}

export const setLeftArm = (leftArm) => {
  store.commit('data/setCurrentLeftArm', leftArm)
}

export const getRightArm = () => {
  return store.state.data.currentRightArm
}

export const setRightArm = (rightArm) => {
  store.commit('data/setCurrentRightArm', rightArm)
}

export const setBlades = (blades) => {
  store.commit('data/setBlades', blades)
}

export const getBlades = () => {
  return store.state.data.blades
}

export const setWaferSensors = (waferSensors) => {
  store.commit('data/setWaferSensors', waferSensors)
}

export const getWaferSensors = () => {
  return store.state.data.waferSensors
}

export const setPoseVelocity = (poseVelocity) => {
  store.commit('data/setPoseVelocity', poseVelocity)
}

export const getPoseVelocity = () => {
  return store.state.data.poseVelocity
}

export const setAxisCoor = (axisCoor) => {
  store.commit('data/setAxisCoor', axisCoor)
}

export const getAxisCoor = () => {
  return store.state.data.axisCoor
}

/**
 * 获取默认描述
 * @return {Object}
 */
export const getDescribe = (dataType) => {
  return store.state.data.describe[dataType]
}

// /**
//  * 获取所有速度
//  * @return {Object}
//  */
// export const getSpeeds = () => {
//   return getData(getDataTypes().speed)
// }

// /**
//  * 获取所有转弯区
//  * @return {Object}
//  */
// export const getZones = () => {
//   return getData(getDataTypes().zone)
// }

// /**
//  * 获取所有工具
//  * @return {Object}
//  */
// export const getTools = () => {
//   return getData(getDataTypes().tool)
// }

// /**
//  * 获取所有工件
//  * @return {Object}
//  */
// export const getWobjs = () => {
//   return getData(getDataTypes().wobj)
// }

// /**
//  * 获取所有负载
//  * @return {Object}
//  */
// export const getPayloads = () => {
//   return getData(getDataTypes().payload)
// }

// /**
//  * 获取所有用户坐标系
//  * @return {Object}
//  */
// export const getUsers = () => {
//   return getData(getDataTypes().user)
// }

/**
 * 更新数据到vuex
 * @param dataType
 * @param data
 */
export const updateDataToVuex = (dataType, data) => {
  store.commit('data/setData', [dataType, data])
}

// /**
//  * 获取当前项目的数据文件夹
//  * @return {string}
//  */
// export const getCurrentProjectDataDir = () => {
//   let dataDir = path.join(getCurrentProjectDir(), "数据")
//   fse.ensureDirSync(dataDir)
//   return dataDir
// }
// /**
//  * 获取数据的本地持久化文件
//  * @param dataType
//  * @return {string}
//  */
// export const getDataFilePath = (dataType) => {
//   return path.join(getCurrentProjectDataDir(), `${dataType.key}.json`)
// }

// /**
//  * 从文件中读取数据
//  * @param dataType
//  * @return {Object}
//  */
// export const readDataFromFile = (dataType) => {
//   let dataFilePath = getDataFilePath(dataType)
//   if (!fs.existsSync(dataFilePath)) return {}
//   return fse.readJsonSync(dataFilePath)
// }

// /**
//  * 从文件中读取所有数据保存到Vuex中
//  */
// export const readAllDataFromFile = () => {
//   Object.keys(store.state.data.dataType).forEach(key => {
//     let dataType = store.state.data.dataType[key]
//     let data = readDataFromFile(dataType)
//     updateDataToVuex(dataType, data)
//   })
// }

// /**
//  * 更新dataType
//  * 更新到文件和vuex中
//  * @param dataType
//  * @param newData
//  */
// export const updateDataType = (dataType, newData) => {
//   let dataFilePath = getDataFilePath(dataType)
//   fse.writeJsonSync(dataFilePath, newData)
//   updateDataToVuex(dataType, newData)
// }

// /**
//  * 更新dataType的数据
//  * @param dataType
//  * @param key
//  * @param value
//  */
// export const updateDataTypeData = (dataType, key, value) => {
//   let newData = getData(dataType)
//   newData[key] = value
//   updateDataType(dataType, newData)
// }

/**
 * data默认是object，这里转成list的格式
 * @param dataType
 * @return {Array}
 */
export const getDataList = (dataType) => {
  const allData = getData(dataType)
  const data = []
  for (const key in allData) {
    data.push({
      name: key,
      value: allData[key]
    })
  }
  return data
}

// /**
//  * 删除一个数据
//  * 从vuex和文件中都删除
//  * @param dataType
//  * @param key
//  */
// export const deleteDataTypeData = (dataType, key) => {
//   let newData = getData(dataType)
//   delete newData[key]
//   updateDataType(dataType, newData)
// }

/**
 * 把一个json的字符串转成c语言结构体初始化的格式
 * @param s
 * @return {*}
 */
const json2c = (s) => {
  return s
    .replace(/\(/g, '{')
    .replace(/\)/g, '}')
    .replace(/\[/g, '{')
    .replace(/]/g, '}')
}

/**
 * 格式化数据。数组在RobotStudio中都是以JSON格式存储的，在Blockly和文本编辑的时候需要以
 * C语言的格式初始化，即{a: 66,b: {c:1, d: 1}} 需要初始化为{66, {1,2}}
 * @param {Object} dataType
 * @param {Object} data
 * @return {String}
 */
export const formatJsonDataToC = (dataType, data) => {
  const dataTypes = getDataTypes()
  try {
    switch (dataType.key) {
      case dataTypes.joint.key:
        return json2c(`((${data.angle}),${data.dof})`)
      case dataTypes.pose.key:
        return json2c(`((${data.xyz}),(${data.kps}))`)
      case dataTypes.speed.key:
        return json2c(
          `((${data.per}),${data.per_flag},${data.tcp},${data.orl},${data.tcp_flag},${data.dof})`
        )
      case dataTypes.zone.key:
        return json2c(`(${data.zone_flag},${data.zone_size})`)
      case dataTypes.tool.key: {
        const payload = data.payload || data.payLoad // RPC接口返回payload写成了payLoad，懒得改了，先兼容一下吧
        payload.i = payload.i || payload.I
        payload.i2 = payload.i2 || payload.I2
        return json2c(
          `(${data.robhold},((${data.tframe.xyz}),(${data.tframe.kps})),(${payload.m}, (${payload.cm}),(${payload.i}),(${payload.i2})))`
        )
      }
      case dataTypes.wobj.key:
        return json2c(
          `(${data.robhold},${data.ufprog},${data.ufmec},((${data.uframe.xyz}),(${data.uframe.kps})),((${data.oframe.xyz}),(${data.oframe.kps})))`
        )
      case dataTypes.payload.key:
        return json2c(`(${data.m},(${data.cm}),(${data.i}),(${data.i2}))`)
      case dataTypes.user.key:
        return json2c(`((${data.xyz}),(${data.kps}))`)
      default:
        return {}
    }
  } catch (e) {
    console.log(
      `格式化数据错误${e}:${JSON.stringify(dataType)}:${JSON.stringify(data)}`
    )
    return ''
  }
}

export default {
  install(app) {
    app.config.globalProperties.$myData = {
      eventBus: mitt(), // 总线
      busEvent: {
        EDIT_DATA: '编辑/新建数据',
        DATA_CHANGE: '数据发生变化',
        IMPORT_DATA_FROM_FILE: '从文件导入数据',
        EXPORT_DATA_TO_FILE: '导出数据至文件',
        IMPORT_DATA_FROM_REMOTE: '从下位机导入数据'
      }
    }
  }
}
