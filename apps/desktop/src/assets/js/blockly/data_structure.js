import * as Blockly from 'blockly/core'

Blockly.Blocks.rob_joint = {
  init: function () {
    this.appendDummyInput()
      .appendField('关节')
      .appendField('dof')
      .appendField(new Blockly.FieldTextInput('6'), 'dof')
    this.appendDummyInput()
      .appendField('angle')
      .appendField(new Blockly.FieldTextInput('0'), 'angle1')
      .appendField(new Blockly.FieldTextInput('0'), 'angle2')
      .appendField(new Blockly.FieldTextInput('0'), 'angle3')
      .appendField(new Blockly.FieldTextInput('0'), 'angle4')
      .appendField(new Blockly.FieldTextInput('0'), 'angle5')
      .appendField(new Blockly.FieldTextInput('0'), 'angle6')
      .appendField(new Blockly.FieldTextInput('0'), 'angle7')
      .appendField(new Blockly.FieldTextInput('0'), 'angle8')
      .appendField(new Blockly.FieldTextInput('0'), 'angle9')
      .appendField(new Blockly.FieldTextInput('0'), 'angle10')
    this.setOutput(true, 'rob_joint')
    this.setColour(270)
    this.setTooltip('关节信息，暂时只用到前六个轴')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.rob_joint = function (block) {
  const text_dof = block.getFieldValue('dof')
  const text_angle1 = block.getFieldValue('angle1')
  const text_angle2 = block.getFieldValue('angle2')
  const text_angle3 = block.getFieldValue('angle3')
  const text_angle4 = block.getFieldValue('angle4')
  const text_angle5 = block.getFieldValue('angle5')
  const text_angle6 = block.getFieldValue('angle6')
  const text_angle7 = block.getFieldValue('angle7')
  const text_angle8 = block.getFieldValue('angle8')
  const text_angle9 = block.getFieldValue('angle9')
  const text_angle10 = block.getFieldValue('angle10')
  const angle = []
  for (let i = 1; i <= 10; i++) {
    angle.push(parseFloat(eval('text_angle' + i)))
  }
  const code = { dof: text_dof, angle: angle }
  return [
    JSON.stringify(code), Blockly.JavaScript.ORDER_NONE
  ]
}

Blockly.Blocks.speed = {
  init: function () {
    this.appendDummyInput()
      .appendField('Speed')
      .appendField('dof')
      .appendField(new Blockly.FieldTextInput('6'), 'dof')
      .appendField('per_flag')
      .appendField(new Blockly.FieldTextInput('0'), 'per_flag')
    this.appendDummyInput()
      .appendField('tcp_flag')
      .appendField(new Blockly.FieldTextInput('0'), 'tcp_flag')
      .appendField('orl_flag')
      .appendField(new Blockly.FieldTextInput('0'), 'orl_flag')
      .appendField('tcp')
      .appendField(new Blockly.FieldTextInput('0'), 'tcp')
      .appendField('orl')
      .appendField(new Blockly.FieldTextInput('0'), 'orl')
    this.appendDummyInput()
      .appendField('per')
      .appendField(new Blockly.FieldTextInput('0'), 'per1')
      .appendField(new Blockly.FieldTextInput('0'), 'per2')
      .appendField(new Blockly.FieldTextInput('0'), 'per3')
      .appendField(new Blockly.FieldTextInput('0'), 'per4')
      .appendField(new Blockly.FieldTextInput('0'), 'per5')
      .appendField(new Blockly.FieldTextInput('0'), 'per6')
      .appendField(new Blockly.FieldTextInput('0'), 'per7')
      .appendField(new Blockly.FieldTextInput('0'), 'per8')
      .appendField(new Blockly.FieldTextInput('0'), 'per9')
      .appendField(new Blockly.FieldTextInput('0'), 'per10')
    this.setOutput(true, 'speed')
    this.setColour(45)
    this.setTooltip('速度')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.speed = function (block) {
  const text_dof = block.getFieldValue('dof')
  const text_per1 = block.getFieldValue('per1')
  const text_per2 = block.getFieldValue('per2')
  const text_per3 = block.getFieldValue('per3')
  const text_per4 = block.getFieldValue('per4')
  const text_per5 = block.getFieldValue('per5')
  const text_per6 = block.getFieldValue('per6')
  const text_per7 = block.getFieldValue('per7')
  const text_per8 = block.getFieldValue('per8')
  const text_per9 = block.getFieldValue('per9')
  const text_per10 = block.getFieldValue('per10')
  const text_per_flag = block.getFieldValue('per_flag')
  const text_tcp_flag = block.getFieldValue('tcp_flag')
  const text_orl_flag = block.getFieldValue('orl_flag')
  const text_tcp = block.getFieldValue('tcp')
  const text_orl = block.getFieldValue('orl')
  const per = []
  for (let i = 1; i <= 10; i++) {
    per.push(parseFloat(eval('text_per' + i)))
  }
  const code = {
    per: per,
    per_flag: text_per_flag,
    tcp_flag: text_tcp_flag,
    orl_flag: text_orl_flag,
    tcp: text_tcp,
    orl: text_orl
  }
  return [JSON.stringify(code), Blockly.JavaScript.ORDER_NONE]
}

Blockly.Blocks.zone = {
  init: function () {
    this.appendDummyInput()
      .appendField('Zone')
      .appendField('zone_flag')
      .appendField(new Blockly.FieldTextInput('0'), 'zone_flag')
      .appendField('zone_size')
      .appendField(new Blockly.FieldTextInput('0'), 'zone_size')
    this.setOutput(true, 'zone')
    this.setColour(230)
    this.setTooltip('区域')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.zone = function (block) {
  const text_zone_flag = block.getFieldValue('zone_flag')
  const text_zone_size = block.getFieldValue('zone_size')
  const code = {
    zone_flag: text_zone_flag,
    zone_size: text_zone_flag
  }
  return [JSON.stringify(code), Blockly.JavaScript.ORDER_NONE]
}

Blockly.Blocks.tool = {
  init: function () {
    this.appendDummyInput()
      .appendField('Tool')
      .appendField('robhold')
      .appendField(new Blockly.FieldTextInput('0'), 'robhold')
    this.appendValueInput('rob_pose')
      .setCheck('rob_pose')
      .appendField('Robpose')
    this.appendValueInput('pay_load')
      .setCheck('pay_load')
      .appendField('payLoad')
    this.setInputsInline(true)
    this.setOutput(true, 'tool')
    this.setColour(315)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.tool = function (block) {
  const text_robhold = block.getFieldValue('robhold')
  const value_rob_pose = Blockly.JavaScript.valueToCode(block, 'rob_pose', Blockly.JavaScript.ORDER_NONE)
  const value_pay_load = Blockly.JavaScript.valueToCode(block, 'pay_load', Blockly.JavaScript.ORDER_NONE)

  const code = {
    robhold: text_robhold,
    rob_pose: value_rob_pose,
    pay_load: value_pay_load
  }
  return [JSON.stringify(code), Blockly.JavaScript.ORDER_NONE]
}

Blockly.Blocks.pay_load = {
  init: function () {
    this.appendDummyInput()
      .appendField('PayLoad')
      .appendField('m')
      .appendField(new Blockly.FieldTextInput('0'), 'm')
      .appendField('cm')
      .appendField(new Blockly.FieldTextInput('1'), 'cm1')
      .appendField(new Blockly.FieldTextInput('1'), 'cm2')
      .appendField(new Blockly.FieldTextInput('1'), 'cm3')
    this.appendDummyInput()
      .appendField('ii')
      .appendField(new Blockly.FieldTextInput('1'), 'ii1')
      .appendField(new Blockly.FieldTextInput('1'), 'ii2')
      .appendField(new Blockly.FieldTextInput('1'), 'ii3')
      .appendField(new Blockly.FieldTextInput('1'), 'ii4')
      .appendField(new Blockly.FieldTextInput('1'), 'ii5')
      .appendField(new Blockly.FieldTextInput('1'), 'ii6')
      .appendField(new Blockly.FieldTextInput('1'), 'ii7')
      .appendField(new Blockly.FieldTextInput('1'), 'ii8')
      .appendField(new Blockly.FieldTextInput('1'), 'ii9')
      .appendField(new Blockly.FieldTextInput('1'), 'ii10')
    this.appendDummyInput()
      .appendField('ii2')
      .appendField(new Blockly.FieldTextInput('1'), 'ii21')
      .appendField(new Blockly.FieldTextInput('1'), 'ii22')
      .appendField(new Blockly.FieldTextInput('1'), 'ii23')
      .appendField(new Blockly.FieldTextInput('1'), 'ii24')
      .appendField(new Blockly.FieldTextInput('1'), 'ii25')
      .appendField(new Blockly.FieldTextInput('1'), 'ii26')
      .appendField(new Blockly.FieldTextInput('1'), 'ii27')
      .appendField(new Blockly.FieldTextInput('1'), 'ii28')
      .appendField(new Blockly.FieldTextInput('1'), 'ii29')
      .appendField(new Blockly.FieldTextInput('1'), 'ii210')
    this.setOutput(true, 'pay_load')
    this.setColour(180)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.pay_load = function (block) {
  const text_m = block.getFieldValue('m')
  const text_cm1 = block.getFieldValue('cm1')
  const text_cm2 = block.getFieldValue('cm2')
  const text_cm3 = block.getFieldValue('cm3')
  const text_ii1 = block.getFieldValue('ii1')
  const text_ii2 = block.getFieldValue('ii2')
  const text_ii3 = block.getFieldValue('ii3')
  const text_ii4 = block.getFieldValue('ii4')
  const text_ii5 = block.getFieldValue('ii5')
  const text_ii6 = block.getFieldValue('ii6')
  const text_ii7 = block.getFieldValue('ii7')
  const text_ii8 = block.getFieldValue('ii8')
  const text_ii9 = block.getFieldValue('ii9')
  const text_ii10 = block.getFieldValue('ii10')
  const text_ii21 = block.getFieldValue('ii21')
  const text_ii22 = block.getFieldValue('ii22')
  const text_ii23 = block.getFieldValue('ii23')
  const text_ii24 = block.getFieldValue('ii24')
  const text_ii25 = block.getFieldValue('ii25')
  const text_ii26 = block.getFieldValue('ii26')
  const text_ii27 = block.getFieldValue('ii27')
  const text_ii28 = block.getFieldValue('ii28')
  const text_ii29 = block.getFieldValue('ii29')
  const text_ii210 = block.getFieldValue('ii210')

  const cm = []
  for (var i = 1; i <= 3; i++) {
    cm.push(parseFloat(eval('text_cm' + i)))
  }
  const ii = []
  for (var i = 1; i <= 10; i++) {
    ii.push(parseFloat(eval('text_ii' + i)))
  }
  const ii2 = []
  for (var i = 1; i <= 10; i++) {
    ii2.push(parseFloat(eval('text_ii2' + i)))
  }
  const code = {
    m: text_m,
    cm: cm,
    ii: ii,
    ii2: ii2
  }
  return [JSON.stringify(code), Blockly.JavaScript.ORDER_NONE]
}

Blockly.Blocks.wobj = {
  init: function () {
    this.appendDummyInput()
      .appendField('WObj')
      .appendField('robhold')
      .appendField(new Blockly.FieldTextInput('1'), 'robhold')
      .appendField('ufprog')
      .appendField(new Blockly.FieldTextInput('1'), 'ufprog')
      .appendField('ufmec')
      .appendField(new Blockly.FieldTextInput('1'), 'ufmec')
    this.appendValueInput('uframe')
      .setCheck('rob_pose')
      .appendField('uframe')
    this.appendValueInput('oframe')
      .setCheck('rob_pose')
      .appendField('oframe')
    this.setInputsInline(true)
    this.setOutput(true, 'wobj')
    this.setColour(230)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.wobj = function (block) {
  const text_robhold = block.getFieldValue('robhold')
  const value_uframe = Blockly.JavaScript.valueToCode(block, 'uframe', Blockly.JavaScript.ORDER_NONE)
  const value_oframe = Blockly.JavaScript.valueToCode(block, 'oframe', Blockly.JavaScript.ORDER_NONE)
  const text_ufprog = block.getFieldValue('ufprog')
  const text_ufmec = block.getFieldValue('ufmec')
  const code = {
    robhold: text_robhold,
    uframe: value_uframe,
    oframe: value_oframe,
    ufprog: text_ufprog,
    ufmec: text_ufmec
  }
  return [JSON.stringify(code), Blockly.JavaScript.ORDER_NONE]
}

Blockly.Blocks.rob_pose = {
  init: function () {
    this.appendDummyInput()
      .appendField('RobPose')
      .appendField('xyz')
      .appendField(new Blockly.FieldTextInput('0'), 'x')
      .appendField(new Blockly.FieldTextInput('0'), 'y')
      .appendField(new Blockly.FieldTextInput('0'), 'z')
      .appendField('kps')
      .appendField(new Blockly.FieldTextInput('0'), 'k')
      .appendField(new Blockly.FieldTextInput('0'), 'p')
      .appendField(new Blockly.FieldTextInput('0'), 's')
    this.setOutput(true, 'rob_pose')
    this.setColour(230)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.rob_pose = function (block) {
  const text_x = block.getFieldValue('x')
  const text_y = block.getFieldValue('y')
  const text_z = block.getFieldValue('z')
  const text_k = block.getFieldValue('k')
  const text_p = block.getFieldValue('p')
  const text_s = block.getFieldValue('s')

  const code = {
    xyx: [text_x, text_y, text_z],
    kps: [text_k, text_p, text_s]
  }

  return [JSON.stringify(code), Blockly.JavaScript.ORDER_NONE]
}
