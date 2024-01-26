import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { join } from 'node:path'
import * as remoteMain from '@electron/remote/main'
import installExtension from 'electron-devtools-installer'
remoteMain.initialize();
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
console.log('============================')
console.log('VITE_DEV_SERVER_URL', process.env.VITE_DEV_SERVER_URL)
console.log('============================')

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

console.log('process.env.DIST_ELECTRON', process.env.DIST_ELECTRON)
console.log('process.env.DIST', process.env.DIST)
console.log('process.env.PUBLIC', process.env.PUBLIC)

// Disable GPU Acceleration
app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
// const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      // preload, // 设置加载效果
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true
    },
  })
  
  win.setMenu(null)
  const menuTemp = [
    // {
    //   label: '关闭项目',
    //   submenu: [
    //     {
    //       label: '关闭项目',
    //       click () {
    //         console.log('-=-=-=-=-关闭项目', app)
    //         // app.config.globalProperties.$utils.routeToNormalWindow("/welcome")
    //         // win.reload()
    //         // let data = {
    //         //   route: "/"
    //         // }
    //         // win.loadURL(`${process.env.WEBPACK_DEV_SERVER_URL}/#${data.route}`)
    //         win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    //       }
    //     }
    //   ]
    // }
  ]

  const menu = Menu.buildFromTemplate(menuTemp)
  Menu.setApplicationMenu(menu)

  remoteMain.enable(win.webContents)

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    // console.log('indexHtml', indexHtml)
    // win.webContents.openDevTools()
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
}

app
  .whenReady()
  .then(createWindow)
  .then(() => {
  // Install Vue Devtools，当前插件有比较多的bug，谨慎使用
  //   installExtension({
  //     // 安装 VUEJS3_DEVTOOLS插件，参考https://github.com/MarshallOfSound/electron-devtools-installer
  //     // 这个奇怪的值，是因为该插件的一个bug，参考https://github.com/MarshallOfSound/electron-devtools-installer/pull/239
  //     // 和https://stackoverflow.com/questions/67358885/vue-devtools-not-loading-with-vue-electron-builder
  //     // 临时进行修复，避免出现TypeError: api.now is not a function的问题
  //     id: 'nhdogjmejiglipccpnnnanhbledajbpd',
  //     electron: '>=1.2.1'
  // })
  //   .then((name) => {
  //     console.log(`Added Extension:  ${name}`)
  //   })
  //   .catch((err) => console.log('An error occurred: ', err))
})

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  remoteMain.enable(childWindow.webContents);

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
