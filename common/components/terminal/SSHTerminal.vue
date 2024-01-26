<template>
  <div class="SSHTerminal">
    <x-term ref="xterm"></x-term>
  </div>
</template>

<script>
import XTerm from '~common/components/terminal/XTerm'
import { getProjectSSHConfig } from '~common/utils/ssh'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  components: { XTerm },
  data() {
    return {
      SSHStream: null // ssh 的stream 用于resize
    }
  },
  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    }
  },
  mounted() {
    const that = this
    const { Client } = require('ssh2')
    const client = new Client()
    getProjectSSHConfig(that.currentProjectConfig).then((config) => {
      client
        .on('ready', function () {
          client.shell(
            {
              cols: that.$refs.xterm.terminal.cols,
              rows: that.$refs.xterm.terminal.rows
            },
            function (err, stream) {
              that.SSHStream = stream
              stream
                .on('close', function () {
                  that.SSHStream = null
                  client.end()
                })
                .on('data', function (data) {
                  that.$refs.xterm.write(data)
                })
              that.$refs.xterm.terminal.onData((data) => stream.write(data))
            }
          )
        })
        .on('error', () => {})
        .connect(config)
    })
    this.$refs.xterm.fit()
  },
  methods: {
    /**
     * 适应resize
     */
    fit() {
      this.$refs.xterm.fit()
      if (this.SSHStream) {
        this.SSHStream.setWindow(
          this.$refs.xterm.terminal.rows,
          this.$refs.xterm.terminal.cols
        )
      }
    },
    /**
     * 清空
     */
    clear() {
      this.$refs.xterm.clear()
    }
  }
}
</script>

<style lang="less" scoped>
.SSHTerminal {
  width: 100%;
  height: 100%;
}
</style>
