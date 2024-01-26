import * as Blockly from 'blockly/core'

Blockly.Blocks.set_variable = {
  init: function () {
    this.appendValueInput('variable')
      .setCheck(null)
      .appendField('设置变量')
      .appendField(new Blockly.FieldTextInput('variable1'), 'variable')
      .appendField('=')
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(60)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.set_variable = function (block) {
  const text_variable = block.getFieldValue('variable')
  const value_variable = Blockly.JavaScript.valueToCode(block, 'variable', Blockly.JavaScript.ORDER_NONE)

  const code = `var ${text_variable} = ${value_variable}\n`
  return code
}

Blockly.Blocks.variable = {
  init: function () {
    this.appendDummyInput()
      .appendField('变量')
      .appendField(new Blockly.FieldTextInput('variable1'), 'variable')
    this.setOutput(true, null)
    this.setColour(230)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.variable = function (block) {
  const text_variable = block.getFieldValue('variable')

  const code = `${text_variable}`

  return [code, Blockly.JavaScript.ORDER_NONE]
}
