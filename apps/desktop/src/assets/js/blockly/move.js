import * as Blockly from 'blockly/core'

Blockly.Blocks.move_a = {
  init: function () {
    this.appendDummyInput()
      .appendField('MoveA')
    this.appendValueInput('rob_joint')
      .setCheck('rob_joint')
      .appendField('RobJoint')
    this.appendValueInput('speed')
      .setCheck('speed')
      .appendField('Speed')
    this.appendValueInput('zone')
      .setCheck('zone')
      .appendField('Zone')
    this.appendValueInput('tool')
      .setCheck('tool')
      .appendField('Tool')
    this.appendValueInput('wobj')
      .setCheck('wobj')
      .appendField('WObj')
    this.setInputsInline(true)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(165)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.move_a = function (block) {
  const value_rob_joint = Blockly.JavaScript.valueToCode(block, 'rob_joint', Blockly.JavaScript.ORDER_NONE)
  const value_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_NONE)
  const value_zone = Blockly.JavaScript.valueToCode(block, 'zone', Blockly.JavaScript.ORDER_NONE)
  const value_tool = Blockly.JavaScript.valueToCode(block, 'tool', Blockly.JavaScript.ORDER_NONE)
  const value_wobj = Blockly.JavaScript.valueToCode(block, 'wobj', Blockly.JavaScript.ORDER_NONE)

  const code =
    `rpc_client.MoveA({rjoint: ${value_rob_joint}, rspeed: ${value_speed}, rzone: ${value_zone},rtool:${value_tool},wobj:${value_wobj}}, cb)\n`
  return code
}
