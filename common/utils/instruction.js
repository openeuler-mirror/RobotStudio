import path from 'path'
import fs from 'fs'

import { getCurrentProjectDir } from '~common/utils/project'

export const getProjectInstructionFileName = () => {
  return 'Instruction.json'
}

/**
 * 获取所有的数据
 */
export const getAllInstruction = () => {
  try {
    const dataPath = path.join(
      getCurrentProjectDir(),
      getProjectInstructionFileName()
    )
    if (!fs.existsSync(dataPath)) return []
    const fileContents = fs.readFileSync(dataPath, 'utf8')
    const jsonObj = JSON.parse(fileContents, null)
    const allInstruction = []
    for (const item in jsonObj) {
      allInstruction.push(jsonObj[item])
    }
    return allInstruction
  } catch (e) {
    console.log(e)
  }
}

/**
 * 写入指令
 */
export const writeInstruction = (instruction) => {
  try {
    const dataPath = path.join(
      getCurrentProjectDir(),
      getProjectInstructionFileName()
    )
    if (!fs.existsSync(dataPath)) {
      fs.closeSync(fs.openSync(dataPath, 'w'))
    }
    const fileContents = fs.readFileSync(dataPath, 'utf8')
    let allInstruction = {}
    if (fileContents) {
      allInstruction = JSON.parse(fileContents, null)
    }
    allInstruction[instruction.key] = instruction
    fs.writeFileSync(dataPath, JSON.stringify(allInstruction), 'utf8')
  } catch (e) {
    console.log(e)
  }
}

/**
 * 删除指令
 */
export const deleteInstruction = (key) => {
  try {
    const dataPath = path.join(
      getCurrentProjectDir(),
      getProjectInstructionFileName()
    )
    if (!fs.existsSync(dataPath)) return []
    const fileContents = fs.readFileSync(dataPath, 'utf8')
    const jsonObj = JSON.parse(fileContents, null)
    delete jsonObj[key]
    fs.writeFileSync(dataPath, JSON.stringify(jsonObj), 'utf8')
  } catch (e) {
    console.log(e)
  }
}
