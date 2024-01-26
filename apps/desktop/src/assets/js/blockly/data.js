import * as Blockly from 'blockly/core'

Blockly.Blocks.data = {
  init: function () {
    this.appendDummyInput()
      .appendField('数据区数据')
      .appendField(new Blockly.FieldTextInput('j1'), 'data')
    this.setOutput(true, null)
    this.setColour(230)
    this.setTooltip('')
    this.setHelpUrl('')
  }
}

Blockly.JavaScript.data = function (block) {
  const text_data = block.getFieldValue('data')

  const code = '...'

  return [code, Blockly.JavaScript.ORDER_NONE]
}
