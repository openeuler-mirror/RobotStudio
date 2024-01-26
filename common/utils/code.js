import path from 'path'

import { getCurrentProjectDir } from '~common/utils/project'

const fse = require('fs-extra')

/**
 * 获取当前项目的代码文件夹
 * @return {string}
 */
export const getCurrentProjectCodeDir = () => {
  const codeDir = path.join(getCurrentProjectDir(), '代码')
  fse.ensureDirSync(codeDir)
  return codeDir
}
