import mitt from 'mitt'

export const codeAreaEventBus = mitt()

export const codeAreaBusEvent = {
  EVENT: {
    OPEN_NODE: 'Aside打开一个node节点',
    tryOpenTab: 'tryOpenTab', // "尝试打开一个tab, 通过tab name来打开一个tab，如果tab没有已经打开的话就忽略",
    REMOVE_TAB: '关闭并移除一个tab',
    UPDATE_TAB_LABEL: '更新TAB的标签'
  }
}
