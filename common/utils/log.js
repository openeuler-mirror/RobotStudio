import mitt from 'mitt'
import store from '@/store/index'
import { getNowDatetimeStr } from './time'

export const eventBus = mitt()

export const busEvent = {
  EVENT: {
    openLogDialog: '打开日志dialog'
  }
}

/**
 * 提交日志到vuex
 * @param log
 */
const writeLogToVuex = (log) => {
  store.commit('log/appendLog', log)
}

const LOG_TYPES = {
  debug: { key: 'debug', label: 'DEBUG' },
  info: { key: 'info', label: '通知' },
  warning: { key: 'warning', label: '警告' }
}

/**
 * 获取最后一条日志
 * @return {Object}
 */
export const getLastLog = () => {
  return store.getters['log/lastLog']
}

/**
 * 获取所有日志
 * @return {[Object]}
 */
export const getLogs = () => {
  return JSON.parse(JSON.stringify(store.state.log.logs))
}

/**
 * 写日志
 * @param {Object} logType
 * @param {string} title
 * @param {string} content
 */
const writeLog = (logType, title, content) => {
  writeLogToVuex({ logType, title, content, time: getNowDatetimeStr() })
}

/**
 * 写消息
 * @param {string} title
 * @param {string} content
 */
export const writeInfo = (title, content) => {
  writeLog(LOG_TYPES.info, title, content)
  console.log(LOG_TYPES.info, title, content)
}

/**
 * 写debug信息
 * @param title
 * @param content
 */
export const writeDebug = (title, content) => {
  writeLog(LOG_TYPES.debug, title, content)
}
