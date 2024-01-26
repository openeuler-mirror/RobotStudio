import * as Blockly from 'blockly/core'

Blockly.Blocks.move_start = {
  init: function () {
    this.appendDummyInput()
      .appendField('上电')
    this.setNextStatement(true, null)
    this.setColour(15)
    this.setTooltip('上电')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.move_start = function (block) {
  const code = 'rpc_client.MoveStart({}, cb)\n'
  return code
}

Blockly.Blocks.move_stop = {
  init: function () {
    this.appendDummyInput()
      .appendField('下电')
    this.setPreviousStatement(true, null)
    this.setColour(90)
    this.setTooltip('下电')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.move_stop = function (block) {
  const code = 'rpc_client.MoveStop({}, cb)\n'
  return code
}
