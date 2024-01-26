import { autoUpdater } from 'electron-updater'
import path from 'path'
import { ipcMain } from 'electron'

const isMac = process.platform === 'darwin'
let mainWindow = null

/**
 * 初始化更新器
 */
function initAutoUpdater (win) {
  mainWindow = win
}

// 本地开发环境，改变app-update.yml地址
if (process.env.NODE_ENV === 'development' && !isMac) {
  autoUpdater.updateConfigPath = path.join(__dirname, 'win-unpacked/resources/app-update.yml')
}
autoUpdater.setFeedURL('http://static.highvenue.cn/')
// 检查更新错误
autoUpdater.on('error', function (error) {
  const message = '检查更新错误' + error.toString()
  mainWindow && mainWindow.webContents.send('udpateError', message)
})
// 开始检查更新
autoUpdater.on('checking-for-update', function () {
  mainWindow && mainWindow.webContents.send('updateCheckStart')
})
// 有可用更新
autoUpdater.on('update-available', function (info) {
  mainWindow && mainWindow.webContents.send('updateAvailable', info)
})
// 已经是最新版本
autoUpdater.on('update-not-available', function () {
  mainWindow && mainWindow.webContents.send('updateNotAvailable', '已经是最新版本')
})
// 更新下载进度事件
autoUpdater.on('download-progress', function (info) {
  mainWindow && mainWindow.webContents.send('updateProgess', info)
})
// 包下载成功时触发
autoUpdater.on('update-downloaded', function (info) {
  mainWindow && mainWindow.webContents.send('updateDownloaded', info)
})

/**
 * 检查更新
 */
ipcMain.on('checkUpdate', () => {
  autoUpdater.checkForUpdates()
})

ipcMain.on('update', () => {
  autoUpdater.quitAndInstall() // 包下载完成后，重启当前的应用并且安装更新
})

export default initAutoUpdater
