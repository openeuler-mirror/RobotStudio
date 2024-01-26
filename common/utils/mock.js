export const mockProjectConfig = () => {
  return {
    ip: '192.168.5.3',
    ssh: { port: 22, user: 'root', password: 'passwd' },
    codeType: {
      key: 'Blockly',
      iconClass: '#icons8-blockly_blue',
      language: 'blockly',
      suffix: null,
      description: '图形化编程，通过拖拽组合模块进行开发'
    },
    armType: {
      key: 'ROKAE_XB4S',
      name: '珞石-XB4s',
      dof: 6,
      model: {
        URDFFilePath: 'C:\\Projects\\RobotStudio\\RobotStudio\\public\\model\\XB4s\\XB4s.urdf',
        cameraPosition: [0.5, 0.7, 0.7]
      }
    },
    type: 'ARM',
    name: 'Blockly',
    iconClass: '#jixiebi_1',
    isBeta: false,
    createTime: '2021-06-04 19:36:18',
    lastOpenTime: null,
    blockly: {
      toolboxXmlPath: 'C:\\Projects\\RobotStudio\\RobotStudio\\public\\xml\\blockly\\arm\\toolbox.xml',
      codeJsRelativePath: 'arm/index.js',
      language: 'javascript'
    },
    id: '7dd078ee-69b4-f639-7799-efa01fe3d13c'
  }
}
