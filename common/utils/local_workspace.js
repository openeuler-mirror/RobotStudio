import path from 'path'
import * as remote from '@electron/remote'

const fse = require('fs-extra')

const app = remote.app
const userDataPath = app.getPath('userData')
export const workspaceDir = path.join(userDataPath, 'Workspace') // 上位机工作空间
export const projectsDir = path.join(workspaceDir, 'projects') // 上位机工程项目存放的路径

// 项目路径如果不存在就创建
const exist = fse.pathExistsSync(projectsDir)
if (!exist) {
  fse.ensureDirSync(projectsDir)
}
