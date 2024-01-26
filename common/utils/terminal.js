import mitt from 'mitt'

export const eventBus = mitt()

export const busEvent = {
  EVENT: {
    WRITE_LOG: '向终端内打印信息'
  }
}

export const TERMINAL_TYPES = {
  SSH: { key: 'ssh', label: '远程终端' },
  LOCAL: { key: 'local', label: '本地终端' },
  Teach: { key: 'teach', label: '示教' }
}

/**
 * 写日志
 * @param terminal
 * @param log
 */
const writeLog = (terminal, log) => {
  eventBus.emit(eventBus.EVENT.WRITE_LOG, terminal, log)
}
/**
 * 写示教日志
 * @param log
 */
export const writeTeachLog = (log) => {
  writeLog(TERMINAL_TYPES.Teach, log)
}

export default {
  install (app) {
    app.config.globalProperties.$myTerminal = {
      eventBus: mitt(),
      busEvent: {
        EVENT: {
          ROBOT_SCRIPT: '机器人脚本语言',
          BLOCKLY: 'Blockly',
          LOG: '日志',
          TEACH: '示教',
          RUN: '运行'
        }
      }
    }
  }
}
