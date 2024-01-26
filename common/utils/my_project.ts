// 动态加载模块
let projectUtil: any = null
async function loadProjectUtil() {
  if (process.env.PROJECT_NAME === 'teach_board') {
    projectUtil = await import('./project/web_project')
    return projectUtil
  }
  projectUtil = await import('./project')
  return projectUtil
}

export const getCurrentProjectConfig = () => {
  if (projectUtil) {
    return projectUtil.getCurrentProjectConfig()
  }
  return null
}

export const openProject = (projectPath: string) => {
  if (projectUtil) {
    return projectUtil.openProject(projectPath)
  }
  return null
}

export default {
  install: () => {
    loadProjectUtil()
      .then(() => {
        console.log('projectUtil loaded')
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
