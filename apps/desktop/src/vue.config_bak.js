const path = require('path')
const { defineConfig } = require('@vue/cli-service')
const config = require('./projects.js')

// const MonocoEditorPlugin = require("monaco-editor-webpack-plugin")

function resolve (dir) {
  return path.join(__dirname, dir)
}
// 项目名称
const projectName = (!process.env.PROJECT_NAME || process.env.PROJECT_NAME.length === 0) ? 'all' : process.env.PROJECT_NAME

module.exports = defineConfig({
  ...config[projectName],
  // outputDir: 'dist',
  lintOnSave: process.env.NODE_ENV !== 'production',
  devServer: {
    // can be overwritten by process.env.HOST
    host: 'localhost',
    port: 3000
  },
  transpileDependencies: true,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve(`src/apps/${projectName}`))
      .set('src', resolve(`src/apps/${projectName}`))
      .set('common', resolve('src/common'))
      // .set('components', resolve('src/components'))

    config.module
      .rule('node')
      .test(/\.node$/)
      .use('node-loader')
      .loader('node-loader')
      .end()
  },
  // configureWebpack: {
  //   node: {
  //     process: true,
  //   },
  //   plugins: [
  //     new MonocoEditorPlugin({})
  //   ]
  // },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['node-pty'],
      builderOptions: {
        // "files": ['dist_electron/**/*'],
        productName: 'RobotStudio',
        win: {
          icon: 'public/image/RobotStudio/logo.ico'
        },
        publish: [{
          provider: 'generic',
          url: 'http://static.highvenue.cn/'
        }],
        nsis: {
          oneClick: false, // 是否一键安装
          createDesktopShortcut: 'always', // 是否添加桌面快捷方式
          allowToChangeInstallationDirectory: true, // 允许修改安装目录
          installerIcon: 'public/image/RobotStudio/logo.ico', // 安装的图标
          installerHeader: 'public/image/RobotStudio/logo.ico', // 安装的头部,
          installerHeaderIcon: 'public/image/RobotStudio/logo.ico' // 不知道是啥
        }
      },
      npmRebuild: false
    },
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, `src/apps/${projectName}/assets/css/global.less`)
      ]
    }
  }
})
