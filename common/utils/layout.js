import path from 'path'
import fs from 'fs'

import { getCurrentProjectDir } from '~common/utils/project'

export const getLayoutFileName = () => {
  return 'LAYOUT.json'
}

export const getLayoutDirName = () => {
  return 'layout'
}

/** *
 * 获取布局
 */
export const getLayout = (layout) => {
  try {
    const layoutFileName = `${layout}.json`
    const dataPath = path.join(
      getCurrentProjectDir(),
      getLayoutDirName(),
      layoutFileName
    )
    if (!fs.existsSync(dataPath)) return {}
    const fileContents = fs.readFileSync(dataPath, 'utf8')
    const jsonTemp = JSON.parse(fileContents, null)
    return jsonTemp
  } catch (e) {
    console.log(e)
  }
}

/**
 * 保存布局
 */
export const saveLayout = (layout, layoutName) => {
  try {
    const dirPath = path.join(getCurrentProjectDir(), getLayoutDirName())
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
    const layoutFileName = `${layoutName}.json`
    const dataPath = path.join(
      getCurrentProjectDir(),
      getLayoutDirName(),
      layoutFileName
    )
    if (!fs.existsSync(dataPath)) {
      fs.closeSync(fs.openSync(dataPath, 'w'))
    }
    const fileContents = JSON.stringify(layout)
    fs.writeFileSync(dataPath, fileContents, 'utf8')
  } catch (e) {
    console.log(e)
  }
}

/**
 * 获取所有布局
 */
export const getAllLayout = () => {
  try {
    const dirPath = path.join(getCurrentProjectDir(), getLayoutDirName())
    if (!fs.existsSync(dirPath)) {
      return []
    }
    const allLayout = []
    const files = fs.readdirSync(dirPath)
    for (const index in files) {
      const layout = files[index].split('.')[0]
      if (layout) {
        allLayout.push(layout)
      }
    }
    return allLayout
  } catch (e) {
    console.log(e)
  }
}

/**
 * 获取所有布局
 */
export const deleteLayout = (layoutName) => {
  try {
    const layoutFileName = `${layoutName}.json`
    const layoutFilePath = path.join(
      getCurrentProjectDir(),
      getLayoutDirName(),
      layoutFileName
    )
    if (!fs.existsSync(layoutFilePath)) {
      return
    }
    fs.unlinkSync(layoutFilePath)
  } catch (e) {
    console.log(e)
  }
}

export const calculateCoorArm = (axisLeft, axisRight, rotation) => {
  // R0固定
  const R0 = { x: 45, y: -60 }
  const R1 = { x: 0, y: 0 }
  // R1
  R1.x = R0.x - (258.0 - axisRight) / 2
  R1.y = R0.y - Math.sqrt(168 ** 2 - (R0.x - R1.x) ** 2)
  // R2
  const R2 = { x: 0, y: 0 }
  R2.x = R0.x + axisRight - 258.0
  R2.y = R0.y
  // RWafer
  const RWafer = { x: 0, y: 0 }
  RWafer.x = R2.x + 315

  // L0固定
  const L0 = {
    x: 45,
    y: 60
  }
  const L1 = { x: 0, y: 0 }
  const L2 = { x: 0, y: 0 }
  // L1
  L1.x = L0.x - (258.0 - axisLeft) / 2
  L1.y = L0.y + Math.sqrt(168 ** 2 - (L0.x - L1.x) ** 2)
  // L2
  L2.x = L0.x + axisLeft - 258.0
  L2.y = L0.y
  // LWafer
  const LWafer = { x: 0, y: 0 }
  LWafer.x = L2.x + 315
  LWafer.y = 0

  // 根据旋转角度对每个点位进行旋转变换
  const theta = (rotation / 180) * Math.PI
  // R0
  let x = R0.x * Math.cos(theta) + R0.y * Math.sin(theta)
  let y = R0.y * Math.cos(theta) - R0.x * Math.sin(theta)
  R0.x = x
  R0.y = y
  // R1
  x = R1.x * Math.cos(theta) + R1.y * Math.sin(theta)
  y = R1.y * Math.cos(theta) - R1.x * Math.sin(theta)
  R1.x = x
  R1.y = y
  x = R2.x * Math.cos(theta) + R2.y * Math.sin(theta)
  y = R2.y * Math.cos(theta) - R2.x * Math.sin(theta)
  R2.x = x
  R2.y = y
  // RWafer
  x = RWafer.x * Math.cos(theta) + RWafer.y * Math.sin(theta)
  y = RWafer.y * Math.cos(theta) - RWafer.x * Math.sin(theta)
  // RWafer.x = (axisRight + 102) * Math.cos(theta)
  // RWafer.y = (axisRight + 102) * Math.sin(theta)
  RWafer.x = x
  RWafer.y = y

  // L0
  x = L0.x * Math.cos(theta) + L0.y * Math.sin(theta)
  y = L0.y * Math.cos(theta) - L0.x * Math.sin(theta)
  L0.x = x
  L0.y = y
  // L1
  x = L1.x * Math.cos(theta) + L1.y * Math.sin(theta)
  y = L1.y * Math.cos(theta) - L1.x * Math.sin(theta)
  L1.x = x
  L1.y = y
  // L2
  x = L2.x * Math.cos(theta) + L2.y * Math.sin(theta)
  y = L2.y * Math.cos(theta) - L2.x * Math.sin(theta)
  L2.x = x
  L2.y = y
  // LWafer
  x = LWafer.x * Math.cos(theta) + LWafer.y * Math.sin(theta)
  y = LWafer.y * Math.cos(theta) - LWafer.x * Math.sin(theta)
  LWafer.x = x
  LWafer.y = y
  const robotCoors = {
    L0,
    L1,
    L2,
    LWafer,
    R0,
    R1,
    R2,
    RWafer
  }
  return robotCoors
}

/** *
 * 机器人坐标系下的坐标转换为图像的像素坐标系中的坐标
 */
export const coorTransfer = (
  L0,
  L1,
  L2,
  LWafer,
  R0,
  R1,
  R2,
  RWafer,
  zoomRadio,
  baseCoor
) => {
  // 坐标系原点变化
  const pixelL0 = {
    x: -L0.y / zoomRadio + baseCoor.x,
    y: -L0.x / zoomRadio + baseCoor.y
  }
  const pixelL1 = {
    x: -L1.y / zoomRadio + baseCoor.x,
    y: -L1.x / zoomRadio + baseCoor.y
  }
  const pixelL2 = {
    x: -L2.y / zoomRadio + baseCoor.x,
    y: -L2.x / zoomRadio + baseCoor.y
  }
  const pixelLWafer = {
    x: -LWafer.y / zoomRadio + baseCoor.x,
    y: -LWafer.x / zoomRadio + baseCoor.y
  }
  const pixelR0 = {
    x: -R0.y / zoomRadio + baseCoor.x,
    y: -R0.x / zoomRadio + baseCoor.y
  }
  const pixelR1 = {
    x: -R1.y / zoomRadio + baseCoor.x,
    y: -R1.x / zoomRadio + baseCoor.y
  }
  const pixelR2 = {
    x: -R2.y / zoomRadio + baseCoor.x,
    y: -R2.x / zoomRadio + baseCoor.y
  }
  const pixelRWafer = {
    x: -RWafer.y / zoomRadio + baseCoor.x,
    y: -RWafer.x / zoomRadio + baseCoor.y
  }
  const pixelCoors = {
    pixelL0,
    pixelL1,
    pixelL2,
    pixelLWafer,
    pixelR0,
    pixelR1,
    pixelR2,
    pixelRWafer
  }
  //   console.log("RWaferX: ", RWafer.x, " RWaferY: ", RWafer.y, " pixelRWaferX: ", pixelRWafer.x, " pixelRWaferY: ", pixelRWafer.y)
  return pixelCoors
}

/** *
 * 计算旋转轴和伸展轴的组成线段的平移变换
 */
export const calculateTranslate = (
  L0,
  L1,
  L2,
  LWafer,
  R0,
  R1,
  R2,
  RWafer,
  robotPixelCoor
) => {
  const leftRotationAxisTranslate = {
    x: L0.x - robotPixelCoor.leftRotationAxis.x,
    y: L0.y - robotPixelCoor.leftRotationAxis.y
  }
  for (const item in robotPixelCoor.leftRotationArm) {
    robotPixelCoor.leftRotationArm[item].x =
      robotPixelCoor.leftRotationArm[item].x + leftRotationAxisTranslate.x
    robotPixelCoor.leftRotationArm[item].y =
      robotPixelCoor.leftRotationArm[item].y + leftRotationAxisTranslate.y
  }
  const leftExtensionAxisTranslate = {
    x: L1.x - robotPixelCoor.leftExtensionAxis.x,
    y: L1.y - robotPixelCoor.leftExtensionAxis.y
  }
  for (const item in robotPixelCoor.leftExtensionArm) {
    robotPixelCoor.leftExtensionArm[item].x =
      robotPixelCoor.leftExtensionArm[item].x + leftExtensionAxisTranslate.x
    robotPixelCoor.leftExtensionArm[item].y =
      robotPixelCoor.leftExtensionArm[item].y + leftExtensionAxisTranslate.y
  }
  robotPixelCoor.leftRotationAxis = JSON.parse(JSON.stringify(L0), null)
  robotPixelCoor.leftExtensionAxis = JSON.parse(JSON.stringify(L1), null)
  robotPixelCoor.leftExtensionEndAxis = JSON.parse(JSON.stringify(L2), null)
  robotPixelCoor.leftWaferAxis = JSON.parse(JSON.stringify(LWafer), null)

  const rightRotationAxisTranslate = {
    x: R0.x - robotPixelCoor.rightRotationAxis.x,
    y: R0.y - robotPixelCoor.rightRotationAxis.y
  }
  for (const item in robotPixelCoor.rightRotationArm) {
    robotPixelCoor.rightRotationArm[item].x =
      robotPixelCoor.rightRotationArm[item].x + rightRotationAxisTranslate.x
    robotPixelCoor.rightRotationArm[item].y =
      robotPixelCoor.rightRotationArm[item].y + rightRotationAxisTranslate.y
  }
  const rightExtensionAxisTranslate = {
    x: R1.x - robotPixelCoor.rightExtensionAxis.x,
    y: R1.y - robotPixelCoor.rightExtensionAxis.y
  }
  for (const item in robotPixelCoor.rightExtensionArm) {
    robotPixelCoor.rightExtensionArm[item].x =
      robotPixelCoor.rightExtensionArm[item].x + rightExtensionAxisTranslate.x
    robotPixelCoor.rightExtensionArm[item].y =
      robotPixelCoor.rightExtensionArm[item].y + rightExtensionAxisTranslate.y
  }
  robotPixelCoor.rightRotationAxis = JSON.parse(JSON.stringify(R0), null)
  robotPixelCoor.rightExtensionAxis = JSON.parse(JSON.stringify(R1), null)
  robotPixelCoor.rightExtensionEndAxis = JSON.parse(JSON.stringify(R2), null)
  robotPixelCoor.rightWaferAxis = JSON.parse(JSON.stringify(RWafer), null)
}

export const calculateLeftArmRotate = (robotPixelCoor, rotation) => {
  let rotateAngle =
    (Math.atan(
      (robotPixelCoor.leftExtensionAxis.y - robotPixelCoor.leftRotationAxis.y) /
        (robotPixelCoor.leftExtensionAxis.x - robotPixelCoor.leftRotationAxis.x)
    ) *
      180) /
    Math.PI
  if (rotation > 0) {
    if (
      rotateAngle < 0 &&
      robotPixelCoor.leftExtensionAxis.y < robotPixelCoor.leftRotationAxis.y
    ) {
      rotateAngle = 180 + rotateAngle
    }
  } else if (rotation < 0) {
    if (
      rotateAngle > 0 &&
      robotPixelCoor.leftRotationAxis.x <= robotPixelCoor.leftExtensionAxis.x
    ) {
      rotateAngle += 180
    }
  }

  const leftRotationArmRotate = `rotate(${rotateAngle} ${robotPixelCoor.leftRotationAxis.x} ${robotPixelCoor.leftRotationAxis.y})`

  let extensionAngle =
    (Math.atan(
      (robotPixelCoor.leftExtensionEndAxis.y -
        robotPixelCoor.leftExtensionAxis.y) /
        (robotPixelCoor.leftExtensionEndAxis.x -
          robotPixelCoor.leftExtensionAxis.x)
    ) *
      180) /
    Math.PI
  if (rotation > 0) {
    if (
      extensionAngle < 0 &&
      robotPixelCoor.leftExtensionEndAxis.x < robotPixelCoor.leftExtensionAxis.x
    ) {
      extensionAngle = 180 + extensionAngle
    }
  } else if (rotation < 0) {
    if (
      extensionAngle > 0 &&
      robotPixelCoor.leftExtensionEndAxis.y < robotPixelCoor.leftExtensionAxis.y
    ) {
      extensionAngle += 180
    }
  }
  const leftExtensionArmRotate = `rotate(${extensionAngle} ${robotPixelCoor.leftExtensionAxis.x} ${robotPixelCoor.leftExtensionAxis.y})`

  const leftWaferArmRotate1 = `rotate(${rotation} ${robotPixelCoor.leftExtensionEndAxis.x} ${robotPixelCoor.leftExtensionEndAxis.y})`
  const leftWaferArmRotate2 = `rotate(${rotation} ${robotPixelCoor.leftWaferAxis.x} ${robotPixelCoor.leftWaferAxis.y})`

  const leftRotate = {
    leftRotationArmRotate,
    leftExtensionArmRotate,
    leftWaferArmRotate1,
    leftWaferArmRotate2
  }
  return leftRotate
}

export const calculateRightArmRotate = (robotPixelCoor, rotation) => {
  let rotateAngle =
    (Math.atan(
      (robotPixelCoor.rightExtensionAxis.y -
        robotPixelCoor.rightRotationAxis.y) /
        (robotPixelCoor.rightExtensionAxis.x -
          robotPixelCoor.rightRotationAxis.x)
    ) *
      180) /
    Math.PI
  if (rotation > 0) {
    if (
      rotateAngle < 0 &&
      robotPixelCoor.rightExtensionAxis.y > robotPixelCoor.rightRotationAxis.y
    ) {
      rotateAngle = 180 + rotateAngle
    }
  } else if (rotation < 0) {
    if (
      rotateAngle > 0 &&
      robotPixelCoor.rightRotationAxis.y > robotPixelCoor.rightExtensionAxis.y
    ) {
      rotateAngle += 180
    }
  }
  const rightRotationArmRotate = `rotate(${rotateAngle} ${robotPixelCoor.rightRotationAxis.x} ${robotPixelCoor.rightRotationAxis.y})`

  let extensionAngle =
    (Math.atan(
      (robotPixelCoor.rightExtensionEndAxis.y -
        robotPixelCoor.rightExtensionAxis.y) /
        (robotPixelCoor.rightExtensionEndAxis.x -
          robotPixelCoor.rightExtensionAxis.x)
    ) *
      180) /
    Math.PI
  if (rotation > 0) {
    if (
      extensionAngle < 0 &&
      robotPixelCoor.rightExtensionEndAxis.x >
        robotPixelCoor.rightExtensionAxis.x
    ) {
      extensionAngle = 180 + extensionAngle
    }
  } else if (rotation < 0) {
    if (
      extensionAngle > 0 &&
      robotPixelCoor.rightExtensionEndAxis.x >
        robotPixelCoor.rightExtensionAxis.x
    ) {
      extensionAngle += 180
    }
  }
  const rightExtensionArmRotate = `rotate(${extensionAngle} ${robotPixelCoor.rightExtensionAxis.x} ${robotPixelCoor.rightExtensionAxis.y})`

  const rightWaferArmRotate1 = `rotate(${rotation} ${robotPixelCoor.rightExtensionEndAxis.x} ${robotPixelCoor.rightExtensionEndAxis.y})`
  const rightWaferArmRotate2 = `rotate(${rotation} ${robotPixelCoor.rightWaferAxis.x} ${robotPixelCoor.rightWaferAxis.y})`

  const rightRotate = {
    rightRotationArmRotate,
    rightExtensionArmRotate,
    rightWaferArmRotate1,
    rightWaferArmRotate2
  }
  return rightRotate
}

export const updateRobotModel = (robot, robotPixelCoor) => {
  const leftRotation = robot.select('#left_rotation')
  const leftRotationAxis = leftRotation.select('#left_rotation_axis')
  leftRotationAxis.attr({
    cx: robotPixelCoor.leftRotationAxis.x,
    cy: robotPixelCoor.leftRotationAxis.y
  })
  const leftRotationCenter = leftRotation.select('#left_rotation_center')
  leftRotationCenter.attr({
    cx: robotPixelCoor.leftRotationAxis.x,
    cy: robotPixelCoor.leftRotationAxis.y
  })
  const leftRotationLine = leftRotation.select('#left_rotation_line')
  leftRotationLine.attr({
    x1: robotPixelCoor.leftRotationAxis.x,
    y1: robotPixelCoor.leftRotationAxis.y,
    x2: robotPixelCoor.leftExtensionAxis.x,
    y2: robotPixelCoor.leftExtensionAxis.y
  })
  const leftWafer = robot.select('#left_wafer')
  const leftWaferArm1 = leftWafer.select('#left_wafer_arm1')
  leftWaferArm1.attr({
    x: robotPixelCoor.leftExtensionEndAxis.x,
    y: robotPixelCoor.leftExtensionEndAxis.y - 5
  })
  const leftWaferArm2 = leftWafer.select('#left_wafer_arm2')
  leftWaferArm2.attr({
    x: robotPixelCoor.leftWaferAxis.x - 10,
    y: robotPixelCoor.leftWaferAxis.y
  })
  const leftWaferCircle = leftWafer.select('#left_wafer_circle')
  leftWaferCircle.attr({
    cx: robotPixelCoor.leftWaferAxis.x,
    cy: robotPixelCoor.leftWaferAxis.y
  })
  const leftExtensionAxis = leftRotation.select('#left_extension_axis')
  leftExtensionAxis.attr({
    cx: robotPixelCoor.leftExtensionAxis.x,
    cy: robotPixelCoor.leftExtensionAxis.y
  })
  const leftRotationArmSet = leftRotation
    .select('#left_rotation_arm')
    .selectAll('line')
  leftRotationArmSet[0].attr({
    x1: robotPixelCoor.leftRotationArm.point1.x,
    y1: robotPixelCoor.leftRotationArm.point1.y,
    x2: robotPixelCoor.leftRotationArm.point2.x,
    y2: robotPixelCoor.leftRotationArm.point2.y
  })
  leftRotationArmSet[1].attr({
    x1: robotPixelCoor.leftRotationArm.point3.x,
    y1: robotPixelCoor.leftRotationArm.point3.y,
    x2: robotPixelCoor.leftRotationArm.point4.x,
    y2: robotPixelCoor.leftRotationArm.point4.y
  })
  leftRotationArmSet[2].attr({
    x1: robotPixelCoor.leftRotationArm.point2.x,
    y1: robotPixelCoor.leftRotationArm.point2.y,
    x2: robotPixelCoor.leftRotationArm.point5.x,
    y2: robotPixelCoor.leftRotationArm.point5.y
  })
  leftRotationArmSet[3].attr({
    x1: robotPixelCoor.leftRotationArm.point4.x,
    y1: robotPixelCoor.leftRotationArm.point4.y,
    x2: robotPixelCoor.leftRotationArm.point6.x,
    y2: robotPixelCoor.leftRotationArm.point6.y
  })
  const leftExtension = robot.select('#left_extension')
  const leftExtensionCenter = leftExtension.select('#left_extension_center')
  leftExtensionCenter.attr({
    cx: robotPixelCoor.leftExtensionAxis.x,
    cy: robotPixelCoor.leftExtensionAxis.y
  })
  const leftExtensionEndAxis = leftExtension.select('#left_extension_end_axis')
  leftExtensionEndAxis.attr({
    cx: robotPixelCoor.leftExtensionEndAxis.x,
    cy: robotPixelCoor.leftExtensionEndAxis.y
  })
  const leftExtensionEndCenter = leftExtension.select(
    '#left_extension_end_center'
  )
  leftExtensionEndCenter.attr({
    cx: robotPixelCoor.leftExtensionEndAxis.x,
    cy: robotPixelCoor.leftExtensionEndAxis.y
  })
  const leftExtensionLine = leftExtension.select('#left_extension_line')
  leftExtensionLine.attr({
    x1: robotPixelCoor.leftExtensionAxis.x,
    y1: robotPixelCoor.leftExtensionAxis.y,
    x2: robotPixelCoor.leftExtensionEndAxis.x,
    y2: robotPixelCoor.leftExtensionEndAxis.y
  })
  const leftExtensionArmSet = leftExtension
    .select('#left_extension_arm')
    .selectAll('line')
  leftExtensionArmSet[0].attr({
    x1: robotPixelCoor.leftExtensionArm.point5.x,
    y1: robotPixelCoor.leftExtensionArm.point5.y,
    x2: robotPixelCoor.leftExtensionArm.point1.x,
    y2: robotPixelCoor.leftExtensionArm.point1.y
  })
  leftExtensionArmSet[1].attr({
    x1: robotPixelCoor.leftExtensionArm.point6.x,
    y1: robotPixelCoor.leftExtensionArm.point6.y,
    x2: robotPixelCoor.leftExtensionArm.point2.x,
    y2: robotPixelCoor.leftExtensionArm.point2.y
  })
  leftExtensionArmSet[2].attr({
    x1: robotPixelCoor.leftExtensionArm.point1.x,
    y1: robotPixelCoor.leftExtensionArm.point1.y,
    x2: robotPixelCoor.leftExtensionArm.point3.x,
    y2: robotPixelCoor.leftExtensionArm.point3.y
  })
  leftExtensionArmSet[3].attr({
    x1: robotPixelCoor.leftExtensionArm.point2.x,
    y1: robotPixelCoor.leftExtensionArm.point2.y,
    x2: robotPixelCoor.leftExtensionArm.point4.x,
    y2: robotPixelCoor.leftExtensionArm.point4.y
  })
  // 右臂
  const rightRotation = robot.select('#right_rotation')
  const rightRotationAxis = rightRotation.select('#right_rotation_axis')
  rightRotationAxis.attr({
    cx: robotPixelCoor.rightRotationAxis.x,
    cy: robotPixelCoor.rightRotationAxis.y
  })
  const rightRotationCenter = rightRotation.select('#right_rotation_center')
  rightRotationCenter.attr({
    cx: robotPixelCoor.rightRotationAxis.x,
    cy: robotPixelCoor.rightRotationAxis.y
  })
  const rightRotationLine = rightRotation.select('#right_rotation_line')
  rightRotationLine.attr({
    x1: robotPixelCoor.rightRotationAxis.x,
    y1: robotPixelCoor.rightRotationAxis.y,
    x2: robotPixelCoor.rightExtensionAxis.x,
    y2: robotPixelCoor.rightExtensionAxis.y
  })
  const rightExtensionAxis = rightRotation.select('#right_extension_axis')
  rightExtensionAxis.attr({
    cx: robotPixelCoor.rightExtensionAxis.x,
    cy: robotPixelCoor.rightExtensionAxis.y
  })
  const rightRotationArmSet = rightRotation
    .select('#right_rotation_arm')
    .selectAll('line')
  rightRotationArmSet[0].attr({
    x1: robotPixelCoor.rightRotationArm.point1.x,
    y1: robotPixelCoor.rightRotationArm.point1.y,
    x2: robotPixelCoor.rightRotationArm.point2.x,
    y2: robotPixelCoor.rightRotationArm.point2.y
  })
  rightRotationArmSet[1].attr({
    x1: robotPixelCoor.rightRotationArm.point3.x,
    y1: robotPixelCoor.rightRotationArm.point3.y,
    x2: robotPixelCoor.rightRotationArm.point4.x,
    y2: robotPixelCoor.rightRotationArm.point4.y
  })
  rightRotationArmSet[2].attr({
    x1: robotPixelCoor.rightRotationArm.point2.x,
    y1: robotPixelCoor.rightRotationArm.point2.y,
    x2: robotPixelCoor.rightRotationArm.point5.x,
    y2: robotPixelCoor.rightRotationArm.point5.y
  })
  rightRotationArmSet[3].attr({
    x1: robotPixelCoor.rightRotationArm.point4.x,
    y1: robotPixelCoor.rightRotationArm.point4.y,
    x2: robotPixelCoor.rightRotationArm.point6.x,
    y2: robotPixelCoor.rightRotationArm.point6.y
  })
  const rightWafer = robot.select('#right_wafer')
  const rightWaferArm1 = rightWafer.select('#right_wafer_arm1')
  rightWaferArm1.attr({
    x: robotPixelCoor.rightExtensionEndAxis.x,
    y: robotPixelCoor.rightExtensionEndAxis.y - 5
  })
  const rightWaferArm2 = rightWafer.select('#right_wafer_arm2')
  rightWaferArm2.attr({
    x: robotPixelCoor.rightWaferAxis.x - 10,
    y: robotPixelCoor.rightWaferAxis.y
  })
  const rightWaferCircle = rightWafer.select('#right_wafer_circle')
  rightWaferCircle.attr({
    cx: robotPixelCoor.rightWaferAxis.x,
    cy: robotPixelCoor.rightWaferAxis.y
  })
  const rightExtension = robot.select('#right_extension')
  const rightExtensionCenter = rightExtension.select('#right_extension_center')
  rightExtensionCenter.attr({
    cx: robotPixelCoor.rightExtensionAxis.x,
    cy: robotPixelCoor.rightExtensionAxis.y
  })
  const rightExtensionEndAxis = rightExtension.select(
    '#right_extension_end_axis'
  )
  rightExtensionEndAxis.attr({
    cx: robotPixelCoor.rightExtensionEndAxis.x,
    cy: robotPixelCoor.rightExtensionEndAxis.y
  })
  const rightExtensionEndCenter = rightExtension.select(
    '#right_extension_end_center'
  )
  rightExtensionEndCenter.attr({
    cx: robotPixelCoor.rightExtensionEndAxis.x,
    cy: robotPixelCoor.rightExtensionEndAxis.y
  })
  const rightExtensionLine = rightExtension.select('#right_extension_line')
  rightExtensionLine.attr({
    x1: robotPixelCoor.rightExtensionAxis.x,
    y1: robotPixelCoor.rightExtensionAxis.y,
    x2: robotPixelCoor.rightExtensionEndAxis.x,
    y2: robotPixelCoor.rightExtensionEndAxis.y
  })
  const rightExtensionArmSet = rightExtension
    .select('#right_extension_arm')
    .selectAll('line')
  rightExtensionArmSet[0].attr({
    x1: robotPixelCoor.rightExtensionArm.point5.x,
    y1: robotPixelCoor.rightExtensionArm.point5.y,
    x2: robotPixelCoor.rightExtensionArm.point1.x,
    y2: robotPixelCoor.rightExtensionArm.point1.y
  })
  rightExtensionArmSet[1].attr({
    x1: robotPixelCoor.rightExtensionArm.point6.x,
    y1: robotPixelCoor.rightExtensionArm.point6.y,
    x2: robotPixelCoor.rightExtensionArm.point2.x,
    y2: robotPixelCoor.rightExtensionArm.point2.y
  })
  rightExtensionArmSet[2].attr({
    x1: robotPixelCoor.rightExtensionArm.point1.x,
    y1: robotPixelCoor.rightExtensionArm.point1.y,
    x2: robotPixelCoor.rightExtensionArm.point3.x,
    y2: robotPixelCoor.rightExtensionArm.point3.y
  })
  rightExtensionArmSet[3].attr({
    x1: robotPixelCoor.rightExtensionArm.point2.x,
    y1: robotPixelCoor.rightExtensionArm.point2.y,
    x2: robotPixelCoor.rightExtensionArm.point4.x,
    y2: robotPixelCoor.rightExtensionArm.point4.y
  })
  const leftRotate = robotPixelCoor.calculateLeftArmRotate()
  const rightRotate = robotPixelCoor.calculateRightArmRotate()
  const leftRotationArmGroup = leftRotation.select('#left_rotation_arm')
  leftRotationArmGroup.transform(leftRotate.leftRotationArmRotate)
  const leftExtensionArmGroup = leftExtension.select('#left_extension_arm')
  leftExtensionArmGroup.transform(leftRotate.leftExtensionArmRotate)
  const leftWaferArmGroup1 = leftWafer.select('#left_wafer_arm1')
  leftWaferArmGroup1.transform(leftRotate.leftWaferArmRotate1)
  const leftWaferArmGroup2 = leftWafer.select('#left_wafer_arm2')
  leftWaferArmGroup2.transform(leftRotate.leftWaferArmRotate2)
  const rightRotationArmGroup = rightRotation.select('#right_rotation_arm')
  rightRotationArmGroup.transform(rightRotate.rightRotationArmRotate)
  const rightExtensionArmGroup = rightExtension.select('#right_extension_arm')
  rightExtensionArmGroup.transform(rightRotate.rightExtensionArmRotate)
  const rightWaferArmGroup1 = rightWafer.select('#right_wafer_arm1')
  rightWaferArmGroup1.transform(rightRotate.rightWaferArmRotate1)
  const rightWaferArmGroup2 = rightWafer.select('#right_wafer_arm2')
  rightWaferArmGroup2.transform(rightRotate.rightWaferArmRotate2)
}
