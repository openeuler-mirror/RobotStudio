// import { shell, clipboard } from 'electron'
import * as remote from '@electron/remote'
import { ElMessage } from 'element-plus'
// import { writeInfo } from '~common/utils/log'
/**
 * 打开一个外部链接
 * @param url
 */
export const openExternalURL = async (url) => {
  // await shell.openExternal(url)
}

/**
 * 选择本地文件路径
 * @param defaultPath
 * @param suffixes 后缀, ["json", "text"]
 * @return {Promise.resolve}
 */
export const selectFilePath = (defaultPath = '', suffixes = ['yml']) => {
  // return new Promise((resolve) => {
  //   const filePaths = remote.dialog.showOpenDialogSync({
  //     defaultPath,
  //     filters: [
  //       {
  //         name: '支持的格式',
  //         extensions: suffixes
  //       }
  //     ]
  //   })
  //   if (filePaths) {
  //     resolve(filePaths[0])
  //   }
  // })
  const filePaths = remote.dialog.showOpenDialogSync({
    defaultPath,
    filters: [
      {
        name: '支持的格式',
        extensions: suffixes
      }
    ]
  })
  if (filePaths) {
    return filePaths[0]
  }
}

/**
 * 选择本地文件路径
 * @param defaultPath
 * @param suffixes 后缀, ["json", "text"]
 * @return {Promise.resolve}
 */
export const selectSavePath = (defaultPath = '', suffixes = ['yml']) => {
  return new Promise((resolve) => {
    const filePaths = remote.dialog.showSaveDialogSync({
      defaultPath,
      filters: [
        {
          name: '支持的格式',
          extensions: suffixes
        }
      ],
      properties: ['openDirectory', 'createDirectory']
    })
    if (filePaths) {
      resolve(filePaths)
    }
  })
  // const filePaths = remote.dialog.showSaveDialogSync({
  //   defaultPath,
  //   filters: [
  //     {
  //       name: '支持的格式',
  //       extensions: suffixes
  //     }
  //   ],
  //   properties: ['openDirectory', 'createDirectory']
  // })
  // if (filePaths) {
  //   return filePaths
  // }
}

/**
 * 复制内容到剪切板
 * @param {string} data
 */
export const copyText = (data) => {
  // clipboard.writeText(data)
  // writeInfo('复制内容', `复制内容到剪切板：${data}`)
  ElMessage.success('已复制到剪切板')
}
