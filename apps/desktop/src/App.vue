<template>
  <router-view/>
  <IDESettingDialog></IDESettingDialog>
</template>

<script>
import IDESettingDialog from '@rosc/common/components/ide_setting/IDESettingDialog'
import { writeInfo } from '@rosc/common/utils/log'

export default {
  components: {
    IDESettingDialog
  },
  mounted () {
    writeInfo('RobotStudio启动', 'RobotStudio启动')
    this.loadIDESetting()
  },
  methods: {
    /**
     * 加载IDE设置
     */
    loadIDESetting () {
      const setting = this.$myIDESetting.getSetting()
      this.$store.commit('IDE_SETTING_SETTING', setting)
    }
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
