import * as path from 'path'

export default {
  install(app) {
    app.config.globalProperties.$myRemote = {
      /**
       * 获取远程下位机工作目录
       */
      getWorkspaceDir() {
        return path.posix.join('/root', 'RobotStudioServer')
      }

      // /**
      //  * 获取远程下位机临时目录
      //  */
      // getWorkspaceTempDir: function () {
      //   return path.posix.join(Vue.prototype.$myRomote.getWorkspaceDir(), "temp")
      // },

      /**
       * 获取Python的依赖库文件
       */
      // getRequirementFilePath: function () {
      //   return
      // }
    }
  }
}
