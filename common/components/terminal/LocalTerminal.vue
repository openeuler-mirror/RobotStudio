<template>
  <div class="LocalTerminal">
    <x-term ref="xterm"></x-term>
  </div>
</template>

<script>
import fs from 'fs'
import XTerm from '~common/components/terminal/XTerm'
import { ElMessage } from 'element-plus'
const pty = require('node-pty')
export default {
  components: { XTerm },
  computed: {
    terminalPath () {
      return this.$store.state.ide_setting.setting.localTerminal
    }
  },
  mounted () {
    const that = this
    const terminalExist = fs.existsSync(this.terminalPath)
    if (!terminalExist) {
      ElMessage.warning(`终端${this.terminalPath}不存在，请到“设置-终端”中进行设置`)
      return
    }
    this.ptyProcess = pty.spawn(this.terminalPath, [], {
      name: 'xterm-color',
      cols: this.$refs.xterm.terminal.cols,
      rows: this.$refs.xterm.terminal.rows,
      cwd: process.cwd(),
      env: eval('process.env')
    })
    this.$refs.xterm.terminal.onData((data) => this.ptyProcess.write(data))
    this.ptyProcess.onData(function (data) {
      that.$refs.xterm.write(data)
    })
    this.$refs.xterm.fit()
  },
  data () {
    return {
      ptyProcess: null // 本地ptyProcess实例用于resize
    }
  },
  methods: {
    /**
     * 适应resize
     */
    fit () {
      this.$refs.xterm.fit()
      if (this.ptyProcess) {
        this.ptyProcess.resize(this.$refs.xterm.terminal.cols, this.$refs.xterm.terminal.rows)
      }
    },
    clear () {
      this.$refs.xterm.clear()
    }
  }
}
</script>

<style lang="less" scoped>
.LocalTerminal {
  width: 100%;
  height: 100%;
}
</style>
