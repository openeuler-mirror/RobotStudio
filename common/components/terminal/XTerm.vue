<template>
  <div class="WinTerminal">
    <div id="terminal" class="win-terminal"></div>
  </div>
</template>

<script>
import 'xterm/css/xterm.css'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'

import { getProjectSSHConfig } from '~common/utils/ssh'
const pty = require('node-pty')
export default {
  computed: {
    setting () {
      return this.$store.state.ide_setting.setting
    },
    theme () {
      return this.setting.theme
    }
  },
  props: {
    // 终端类型,local:本地终端 ssh:ssh终端,配置从vuex中拿
    terminalType: {
      type: String,
      default: ''
    }
  },
  mounted () {
    let foreground
    let background
    if (this.$myIDESetting.isDarkTheme()) {
      foreground = '#FFF'
      background = '#1e1e1e'
    } else {
      foreground = '#000'
      background = '#FFF'
    }

    const that = this
    this.terminal = new Terminal({
      cursorBlink: true, // 光标闪烁
      theme: {
        foreground: foreground, // 字体
        background: background, // 背景色
        selection: 'rgb(44, 80, 139, 0.5)'
      },
      letterSpace: 0,
      fontSize: 15,
      fontWeight: 900,
      fontFamily: this.setting.fontFamily === 'black' ? 'Lucida Console' : 'Courier', // xterm无法很好的支持web font，所以不完全适配，只是黑体字加粗，其余的都用默认的字体即可
      cursorStyle: 'underline'
    })
    this.fitAddon = new FitAddon()
    this.terminal.loadAddon(this.fitAddon)
    this.terminal.open(document.getElementById('terminal'))
    this.fit()
    this.terminal.onSelectionChange(() => {
      this.selectedData = this.terminal.getSelection()
    })
    if (this.terminalType === 'local') {
      const shell = this.$store.state.ide_settings.ideSettings.terminal.LocalTerminal.value
      this.ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: this.terminal.cols,
        rows: this.terminal.rows,
        cwd: process.cwd(),
        env: eval('process.env')
      })
      this.terminal.onData((data) => this.ptyProcess.write(data))
      this.ptyProcess.onData(function (data) {
        that.terminal.write(data)
      })
    } else if (this.terminalType === 'ssh') {
      const Client = require('ssh2').Client
      const client = new Client()
      getProjectSSHConfig(that.currentProjectConfig).then((config) => {
        client
          .on('ready', function () {
            client.shell({ cols: that.terminal.cols, rows: that.terminal.rows }, function (err, stream) {
              that.SSHStream = stream
              stream
                .on('close', function () {
                  that.SSHStream = null
                  client.end()
                })
                .on('data', function (data) {
                  that.terminal.write(data)
                })
              that.terminal.onData((data) => stream.write(data))
            })
          })
          .on('error', () => {})
          .connect(config)
      })
    }
  },
  data () {
    return {
      fitAddon: null, // 终端内容自适应插件
      terminal: null, // xtermjs终端实例
      selectedData: '' // 选中的内容
    }
  },
  methods: {
    /**
     * 适配size
     */
    fit () {
      this.fitAddon.fit()
    },
    /**
     * 向终端内写入内容
     */
    write (data) {
      if (this.terminal) {
        this.terminal.write(data)
        this.terminal.scrollToBottom()
      }
    },
    clear () {
      this.terminal.clear()
    }
  }
}
</script>

<style lang="less" scoped>
.WinTerminal {
  height: 100%;
  width: 100%;

  .win-terminal {
    width: 100%;
    height: 100%;
  }
  .terminal {
    width: 100%;
    height: 100%;
    padding: 3px;
  }

  .xterm-screen,
  .xterm-cursor-layer,
  .xterm-text-layer,
  .xterm-selection-layer,
  .xterm-link-layer {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
