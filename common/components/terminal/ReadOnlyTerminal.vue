<template>
  <div class="SSHReadOnlyTerminal">
    <x-term ref="xterm"></x-term>
  </div>
</template>

<script>
import XTerm from '~common/components/terminal/XTerm'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  components: { XTerm },
  data() {
    return {}
  },
  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    },
    terminalPath() {
      return this.$store.state.ide_settings.ideSettings.terminal.LocalTerminal
        .value
    }
  },

  mounted() {
    this.$refs.xterm.fit()
  },
  methods: {
    /**
     * 适应resize
     */
    fit() {
      this.$refs.xterm.fit()
      // if (this.SSHStream) {
      //   console.log("set", this.$refs.xterm.rows, this.$refs.xterm.terminal.cols)
      //   this.SSHStream.setWindow(this.$refs.xterm.terminal.rows, this.$refs.xterm.terminal.cols)
      // }
    },
    /**
     * 写日志
     */
    write(data) {
      this.$refs.xterm.write(data)
    },
    clear() {
      this.$refs.xterm.clear()
    }
  }
}
</script>

<style lang="less" scoped>
.SSHReadOnlyTerminal {
  width: 100%;
  height: 100%;
}
</style>
