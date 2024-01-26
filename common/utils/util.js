import { shell } from 'electron'

/**
 * 获取一个UUID
 * @type {function(*=): string} UUID长度，默认是8
 * @return {string}
 */
export const getUUID = (length = 8) => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0)
      .toString(16)
      .slice(1, length + 1)
  }
  return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
}

export default {
  install(app) {
    /**
     * 获取随机数
     * @param {Number} length: 随机数长度
     */
    app.config.globalProperties.$utils.get_uuid = function (length) {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0)
          .toString(16)
          .slice(1, length + 1)
      }
      length = length || 8
      return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`
    }

    app.config.globalProperties.$utils.open_external = function (url) {
      shell.openExternal(url)
    }
  }
}
