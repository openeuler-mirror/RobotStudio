/**
 * 获取IDE版本号
 * @return {string}
 */
export const getIDEVersion = () => {
  const p = require('../../../package.json')
  return p.version
}

/**
 * 获取IDE名称
 * @return {string}
 */
export const getIDETitle = () => {
  return 'RobotStudio ' + getIDEVersion()
}
