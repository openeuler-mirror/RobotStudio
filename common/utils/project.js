import { ElMessageBox } from 'element-plus'
import * as remote from '@electron/remote'
import * as path from 'path'
import * as fs from 'fs'
import store from '@/store'
import { projectsDir } from './local_workspace'
import { getNowDatetimeStr } from '~common/utils/time'
import {teachStreamStopGetJoints} from '~common/utils/rpc/node_rpc'

const fse = require('fs-extra')
/**
 * 获取当前项目的配置
 * @return {Object}
 */
export const getCurrentProjectConfig = () => {
  return JSON.parse(
    JSON.stringify(store.getters['project/currentProjectConfig'])
  )
}

export const getAdvancedFunction = () => {
  return JSON.parse(JSON.stringify(store.getters['project/advancedFunction']))
}

/**
 * 获取所有的项目配置
 * @return {Array}
 */
export const getAllProjectConfig = () => {
  return JSON.parse(JSON.stringify(store.state.project.projectConfigs))
}

/**
 * 获取项目所在的文件夹
 */
export const getProjectDir = (projectConfig) => {
  return path.join(projectsDir, projectConfig.id)
}

/**
 * 获取当前项目所在的文件夹
 * @return {string}
 */
export const getCurrentProjectDir = () => {
  const currentProjectConfig = getCurrentProjectConfig()
  return getProjectDir(currentProjectConfig)
}

/**
 * 获取当前项目的临时文件夹，用于存放生成的中间文件
 * @return {string}
 */
export const getCurrentProjectTempDir = () => {
  const tempDir = path.join(getCurrentProjectDir(), '临时')
  fse.ensureDirSync(tempDir)
  return tempDir
}

/**
 * 获取项目配置文件的名称
 * @return {string}
 */
export const getProjectConfigFileName = () => {
  return 'config.json'
}

/**
 * 获取项目的配置文件
 * @param projectConfig
 * @return {string}
 */
export const getProjectConfigFile = (projectConfig) => {
  return path.join(getProjectDir(projectConfig), getProjectConfigFileName())
}

/**
 * 打开当前项目存放的文件夹
 */
export const openCurrentProjectDir = () => {
  ElMessageBox({
    title: '警告',
    message:
      '手动编辑项目可能会发生意料之外的错误，我们强烈不建议您手动编辑项目，除非您明白自己在做什么',
    type: 'warning',
    showCancelButton: true
  })
    .then(() => {
      const projectDir = getCurrentProjectDir()
      remote.shell.showItemInFolder(projectDir)
    })
    .catch(() => {})
}

/**
 * 给定项目ID，从文件中读取项目配置
 * @param projectID
 * @return {null|*}
 */
export const readProjectConfigFromFile = (projectID) => {
  const projectConfigFile = path.join(
    projectsDir,
    projectID,
    getProjectConfigFileName()
  )
  if (fs.existsSync(projectConfigFile)) {
    return fse.readJsonSync(projectConfigFile)
  }
  return {}
}

/**
 * 更新所有项目配置到vuex
 * @param projectConfigs
 */
const updateProjectConfigsToVuex = (projectConfigs) => {
  store.commit('project/setProjectConfigs', projectConfigs)
}

/**
 * 从文件中读取所有项目配置，提交到vuex
 */
export const readAllProjectConfig = () => {
  const projectConfigs = []
  fs.readdirSync(projectsDir).forEach(function (projectID) {
    projectConfigs.push(readProjectConfigFromFile(projectID))
  })
  updateProjectConfigsToVuex(projectConfigs)
}

/**
 * 新建项目, project.id作为项目的文件夹名称
 * @param {Object} config
 */
export const createProject = (config) => {
  const projectConfig = JSON.parse(JSON.stringify(config))
  projectConfig.createTime = getNowDatetimeStr()
  const projectDir = getProjectDir(config)
  fse.ensureDirSync(projectDir)
  fse.outputJSONSync(
    path.join(projectDir, getProjectConfigFileName()),
    projectConfig
  )
}

/**
 * 删除项目
 * 硬盘中和vuex中都需要删除
 * @param projectConfig
 */
export const deleteProject = (projectConfig) => {
  const projectDir = getProjectDir(projectConfig)
  fse.remove(projectDir)
  const newProjectConfigs = getAllProjectConfig()
  for (const i in newProjectConfigs) {
    if (newProjectConfigs[i].id === projectConfig.id) {
      newProjectConfigs.splice(i, 1)
      updateProjectConfigsToVuex(newProjectConfigs)
      break
    }
  }
}

/**
 * 更新ProjectID到vuex
 * @param ProjectID
 */
const updateCurrentProjectIDToVuex = (ProjectID) => {
  store.commit('project/setCurrentProjectID', ProjectID)
}

/**
 * 更新当前项目配置
 * 更新到文件和vuex中
 * @param projectConfig
 */
export const updateCurrentProjectConfig = (projectConfig) => {
  const newProjectConfig = JSON.parse(JSON.stringify(projectConfig))
  // 更新到文件和vuex
  newProjectConfig.lastOpenTime = getNowDatetimeStr()
  const configFile = getProjectConfigFile(newProjectConfig)
  fse.outputJSONSync(configFile, newProjectConfig)
  // 更新所有项目配置vuex
  const allProjectConfig = getAllProjectConfig()
  for (let i = 0; i < allProjectConfig.length; i += 1) {
    if (allProjectConfig[i].id === newProjectConfig.id) {
      allProjectConfig[i] = newProjectConfig
    }
  }
  updateProjectConfigsToVuex(allProjectConfig)
}

/**
 * 打开一个项目
 * @param projectID
 */
export const openProject = (projectID) => {
  updateCurrentProjectIDToVuex(projectID)
}

/**
 * 关闭项目
 */
export const closeProject = () => {
  updateCurrentProjectIDToVuex(null)
  teachStreamStopGetJoints()
}

export default {
  install(app) {
    app.config.globalProperties.myProject = {}
    app.config.globalProperties.myProject.newProjectSetting = () => {
      store.commit(
        'PROJECT_SETTING_MODE',
        store.state.project_setting.PROJECT_SETTING_MODE.NEW
      )
      app.config.globalProperties.$utils.routeToNormalWindow('/projectSetting')
    }
    /**
     * 新建项目, project.id作为项目的文件夹名称
     * @param {Object} config
     */
    app.config.globalProperties.myProject.newProject = (config) => {
      const projectConfig = JSON.parse(JSON.stringify(config))
      projectConfig.createTime = getNowDatetimeStr()
      const projectDir = path.join(projectsDir, projectConfig.id)
      fse.ensureDirSync(projectDir)
      fse.outputJSONSync(
        path.join(projectDir, getProjectConfigFileName()),
        projectConfig
      )
      updateCurrentProjectConfig(projectConfig)
      app.config.globalProperties.$myIDESetting.eventBus.emit(
        app.config.globalProperties.$myIDESetting.busEvent.EVENT
          .CURRENT_PROJECT_CONFIG_CHANGED
      )
    }
  }
}
