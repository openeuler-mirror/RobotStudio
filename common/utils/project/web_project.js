// import store from "../store"

/**
 * 获取当前项目的配置
 * @return {Object}
 */
export const getCurrentProjectConfig = () => {
  return {
    ip: import.meta.env.VITE_ROBOT_IP,
    ssh: { port: 22, user: 'root', password: 'passwd' },
    codeType: {
      key: 'C/C++',
      iconClass: '#c2',
      language: 'cpp',
      suffix: 'c',
      description: '文本式编程，使用C/C++在运动控制库的基础上直接进行开发'
    },
    armType: {
      key: 'openEulerRobotF',
      name: '欧拉臂',
      dof: 6,
      model: {
        URDFFilePath:
          'D:\\Projects\\robot\\code\\RobotStudio\\public\\model\\XB4s\\XB4s.urdf',
        cameraPosition: [0.5, 0.7, 0.7]
      },
      // 201F
      axisNames: ['Z轴', 'T轴', 'R2(lower)', 'R1(upper)', 'F1', 'F2'],
      axisNumbers: [0, 1, 2, 3, 11, 12],
      axisUnits: ['mm', '°', 'mm', 'mm', '°', '°'],
      velocityUnits: ['mm/s', '°/s', 'mm/s', 'mm/s', '°/s', '°/s'],
      // axisNames: ['A轴', 'B轴', 'Theta轴', 'Z轴'],
      // axisNumbers: [3, 4, 1, 2],
      // axisUnits: ['mm', 'mm', '°', 'mm', 'deg', 'deg'],
      // velocityUnits: ['mm/s', 'mm/s', '°/s', 'mm/s', 'deg/s', 'deg/s'],
      axisInc: ['升', '顺', '伸', '伸', '顺', '顺'],
      axisDec: ['降', '逆', '缩', '缩', '逆', '逆'],
      bladeNum: 2
    },
    type: 'ARM',
    name: '机械臂',
    iconClass: '#jixiebi_1',
    isBeta: false,
    createTime: '2022-06-17 11:23:36',
    lastOpenTime: null,
    blockly: {
      toolboxXmlPath:
        'D:\\Projects\\robot\\code\\RobotStudio\\public\\xml\\blockly\\arm\\toolbox.xml',
      codeJsRelativePath: 'arm/index.js',
      language: 'javascript'
    },
    id: '62c7295d-ce94-4cdc-52a7-80dab1a8c797'
  }
  // JSON.parse(JSON.stringify(store.getters["project/currentProjectConfig"]))
}

export default {
  install(app) {
    app.config.globalProperties.$myProject = {}
  }
}
