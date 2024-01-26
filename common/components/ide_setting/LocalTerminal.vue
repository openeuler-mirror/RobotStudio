<template>
  <div class="LocalTerminalSetting">
    <div style="display: flex">
      <el-input
        v-model="localTerminal"
        class="input-with-select"
        disabled
      ></el-input>
      <el-button class="uni-button-2" @click="selectTerminal">
        选择文件
      </el-button>
    </div>
  </div>
</template>
<script>
import * as remote from '@electron/remote'

export default {
  data() {
    return {}
  },
  computed: {
    setting() {
      return this.$store.state.ide_setting.setting
    },
    localTerminal() {
      return this.setting.localTerminal
    }
  },
  methods: {
    selectTerminal() {
      remote.dialog
        .showOpenDialog({
          title: '选择终端',
          defaultPath: '',
          filters: [{ name: 'All Files', extensions: ['exe'] }]
        })
        .then((result) => {
          if (!result.canceled) {
            const newSetting = JSON.parse(JSON.stringify(this.setting))
            newSetting.localTerminal = result.filePaths[0]
            this.$myIDESetting.updateSetting(newSetting)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.LocalTerminalSetting {
  width: 100%;
  height: 100%;
}
</style>
