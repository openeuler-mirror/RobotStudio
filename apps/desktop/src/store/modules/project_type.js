import path from 'path'
/* global __static */

/**
 * 获取SSH配置
 * @param {Number} port
 * @param {String} user
 * @param {String} password
 */
function getSSHConfig (port = 22, user = 'root', password = 'passwd') {
  return {
    ssh: {
      port: port,
      user: user,
      password: password
    }
  }
}

/**
 * 获取代码类型
 * @param {String} key 唯一key
 * @param {String} iconClass 图标
 * @param {String} language 语言，用于Monaco
 * @param {String} suffix 文件名后缀
 * @param {String} description 描述说明
 */
function getCodeType (key, iconClass, language, suffix, description) {
  return {
    key: key,
    iconClass: iconClass,
    language: language,
    suffix: suffix,
    description: description
  }
}

/**
 * 获取代码类型配置
 * @param {Object} codeType 代码类型，见getCodeType
 */
function getCodeTypeConfig (codeType) {
  return {
    codeType: codeType
  }
}

// ARM编程类型
const CodeTypes = {
  COrCpp: getCodeType('C/C++', '#c2', 'cpp', 'c', '文本式编程，使用C/C++在运动控制库的基础上直接进行开发'),
  Blockly: getCodeType('Blockly', '#icons8-blockly_blue', 'blockly', null, '图形化编程，通过拖拽组合模块进行开发'),
  Script: getCodeType('Script', '#TXT', 'script', 'txt', '机器人脚本语言')
}

// 机械臂类型
const ARM_TYPES = {
  openEulerRobot: {
    key: 'openEulerRobot',
    name: '欧拉臂',
    dof: 4,
    axisName: ['Elevation', 'Rotation', 'R2(lower)', 'R1(upper)'],
    axisIndex: [0, 1, 2, 3],
    axisUnit: ['mm', 'deg', 'mm', 'mm'],
    function: ['TEACH', 'DATAMANAGE', 'IOMANAGE', 'EXCEPTION', 'PROJECT_SETTING', 'INSTRUCTION', 'OPERATEWAFER', 'SLAVESTATE'],
  },
}

/**
 * 获取armType
 * @param {ARM_TYPES} armType
 */
function getArmTypeConfig (armType) {
  return {
    armType: armType
  }
}

/**
 * 获取IP配置
 * @param {String} ip
 */
function getIPConfig (ip = '192.168.5.3') {
  return {
    ip: ip
  }
}
/**
 * 获取项目基础配置
 * @param {String} projectTypeKey：项目类型唯一key
 * @param {String} projectTypeName ：项目类型名字
 * @param {String} projectTypeIcon ：项目类型的ICON
 * @param {Boolean} isBeta：是否还在测试中
 */
function getCommonConfig (projectTypeKey, projectTypeName, projectTypeIcon, isBeta) {
  return {
    type: projectTypeKey,
    name: projectTypeName,
    iconClass: projectTypeIcon,
    isBeta: isBeta,
    createTime: null, // 项目创建时间
    lastOpenTime: null // 上次打开时间
  }
}

/**
 * 获取项目的Blockly配置
 * @param {String} toolboxXmlPath：toolbox xml绝对路径
 * @param {String} codeJsRelativePath ：JS代码的项目路径
 * @param {String} language ：Blockly支持翻译的语言
 */
function getBlocklyConfig (toolboxXmlPath, codeJsRelativePath, language) {
  return {
    blockly: {
      toolboxXmlPath: toolboxXmlPath,
      codeJsRelativePath: codeJsRelativePath,
      language: language
    }
  }
}


const state = {
  /**
   * 所有的项目类型,目前包括机械臂、移动车
   */
  projectTypes: {
    ARM: Object.assign(getIPConfig(), getSSHConfig(), getCodeTypeConfig(CodeTypes.COrCpp),
      getArmTypeConfig(ARM_TYPES.openEulerRobot),
      getCommonConfig('ARM', '机械臂', '#jixiebi_1', false),
      getBlocklyConfig(path.join(path.resolve(__dirname, '../../assets/'), 'xml', 'blockly', 'arm', 'toolbox.xml'), 'arm/index.js', 'javascript')
    )
    // CAR: Object.assign(getIPConfig(), getSSHConfig(), getCommonConfig("CAR", "移动小车", "#che", true),
    //   getBlocklyConfig(path.join(global.__static, "xml", "blockly", "car", "toolbox.xml"), "car/index.js", "python")
    // ),
  },
  /**
   * 所有编程方式
   */
  codeTypes: CodeTypes,
  // 机械臂类型
  ARM_TYPES: ARM_TYPES}

const mutations = {
}

export default {
  state,
  mutations
}
