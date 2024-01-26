<template>
  <div id="TerminalArea" class="TerminalArea">
    <el-tabs type="card" v-model="currentTabIndex" @edit="handleTabsEdit" :before-leave="beforeLeave">
      <el-tab-pane v-for="(terminal, index) in terminals" :label="terminal.label" :key="index" :name="index.toString()" :closable="true">
        <keep-alive>
          <LocalTerminal v-if="currentTabIndex === index.toString() && terminal.key === TERMINAL_TYPES.LOCAL.key" ref="terminal"/>
        </keep-alive>
        <keep-alive>
          <SSHTerminal v-if="currentTabIndex === index.toString() && terminal.key === TERMINAL_TYPES.SSH.key" ref="terminal" />
        </keep-alive>
        <keep-alive>
        <ReadOnlyTerminal v-if="currentTabIndex === index.toString() && terminal.key === TERMINAL_TYPES.Teach.key" ref="terminal" />
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="tabAction" name="tabAction" :closable="false">
        <template #label>
        <el-dropdown trigger="click" size="mini" @command="handleNewTerminal">
          <div style="width: 50px; display: flex; justify-content: center; align-items: center">+</div>
          <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="TERMINAL_TYPES.LOCAL.key">{{ TERMINAL_TYPES.LOCAL.label }}</el-dropdown-item>
            <el-dropdown-item :command="TERMINAL_TYPES.SSH.key">{{ TERMINAL_TYPES.SSH.label }}</el-dropdown-item>
          </el-dropdown-menu>
          </template>
        </el-dropdown>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { TERMINAL_TYPES, eventBus, busEvent } from '~common/utils/terminal'
import LocalTerminal from '~common/components/terminal/LocalTerminal'
import SSHTerminal from '~common/components/terminal/SSHTerminal'
import ReadOnlyTerminal from '~common/components/terminal/ReadOnlyTerminal'

export default {
  name: 'IndexPage',
  components: { LocalTerminal, SSHTerminal, ReadOnlyTerminal },
  mounted () {
    this.initEventBus()
    const resizeObserver = new ResizeObserver(() => { this && this.fit() })
    resizeObserver.observe(document.getElementById('TerminalArea'))
  },
  data () {
    return {
      currentTabIndex: '0', // 当前tab的index，字符串类型
      terminals: [TERMINAL_TYPES.LOCAL],
      TERMINAL_TYPES: TERMINAL_TYPES
    }
  },
  methods: {
    initEventBus () {
      eventBus.on(busEvent.EVENT.WRITE_LOG, (terminal, log) => {
        let index = -1
        for (let i = 0; i < this.terminals.length; i++) {
          if (this.terminals[i].key === terminal.key) {
            index = i
            break
          }
        }
        if (index === -1) {
          this.terminals.push(terminal)
          index = this.terminals.length - 1
        }
        this.currentTabIndex = index.toString()
        this.$nextTick(() => {
          this.$refs.terminal[0] && this.$refs.terminal[0].write(log + '\n')
        })
      })
    },
    /**
     * tab点击事件
     */
    click () {
      this.$nextTick(() => {
        this.fit()
      })
    },
    fit () {
      this.$refs.terminal[0] && this.$refs.terminal[0].fit()
    },
    handleNewTerminal (command) {
      for (const terminalTypeKey in TERMINAL_TYPES) {
        if (TERMINAL_TYPES[terminalTypeKey].key === command) {
          this.terminals.push(TERMINAL_TYPES[terminalTypeKey])
          this.$nextTick(() => { this.currentTabIndex = (this.terminals.length - 1).toString() })
        }
      }
    },
    handleTabsEdit (targetName, action) {
      if (action === 'remove') {
        this.terminals.splice(parseInt(targetName), 1)
        if (targetName === this.currentTabIndex) { this.currentTabIndex = (this.terminals.length - 1).toString() } else { this.currentTabIndex = (this.currentTabIndex - 1).toString() }
      }
    },
    /**
     * 点击新增终端的时候拦截
     */
    beforeLeave (newTabName) {
      if (newTabName === 'tabAction') {
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.TerminalArea {
  height: 100%;
  .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-tabs__content {
      flex-grow: 1;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
