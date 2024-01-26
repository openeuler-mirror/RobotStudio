import fs from 'fs'
import mitt from 'mitt'
import * as path from 'path'
import store from '@/store'
import { workspaceDir } from '~common/utils/local_workspace'

const fse = require('fs-extra')

const defaultFontFamily =
  'Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei'

const defaultSetting = {
  localTerminal:
    'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', // 终端文件路径设置
  theme: 'base-theme', // 主题
  fontFamily: defaultFontFamily // 字体
}

export default {
  install(app) {
    app.config.globalProperties.$myIDESetting = {
      eventBus: mitt(), // 总线
      busEvent: {
        EVENT: {
          CURRENT_PROJECT_CONFIG_CHANGED: '当前项目的配置发生变化',
          SHOW_CONFIG_DIALOG: '显示编辑项目的对话框'
        }
      },
      defaultFontFamily,
      /**
       * 获取设置文件路径
       * @returns {String}
       */
      getSettingFile() {
        return path.join(workspaceDir, 'setting.json')
      },

      /**
       * 获取所有配置
       */
      getSetting() {
        const settingFile =
          app.config.globalProperties.$myIDESetting.getSettingFile()
        const setting = fs.existsSync(settingFile)
          ? fse.readJSONSync(settingFile)
          : defaultSetting
        return setting
      },
      /**
       * 更新设置，持久化同时更新vuex
       * @param {Object} setting
       */
      updateSetting(setting) {
        const settingFile =
          app.config.globalProperties.$myIDESetting.getSettingFile()
        fse.outputJSONSync(settingFile, setting)
        store.commit('IDE_SETTING_SETTING', setting)
      },

      /**
       * 更新IDE的主题，clas定义在style.scss中
       * @param {String} themeClass
       */
      updateTheme(themeClass) {
        document.body.className = themeClass
      },
      /**
       * 更新字体
       * @param {Object} fontFamily
       */
      updateFontFamily(fontFamily) {
        document.getElementsByTagName('body')[0].style.fontFamily = fontFamily
      },
      /**
       * 是否是暗黑模式
       * @returns {Boolean}
       */
      isDarkTheme() {
        return store.state.ide_setting.setting.theme === 'dark-theme'
      }
    }
  }
}
