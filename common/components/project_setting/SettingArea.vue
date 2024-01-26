<template>
  <el-tabs tab-position="left">
    <el-tab-pane
      v-if="
        currentProjectConfig.armType.key === 'M122' ||
        currentProjectConfig.armType.key === 'openEulerRobot' ||
        currentProjectConfig.armType.key === 'M124'
      "
      label="IO配置"
    >
      <IOSetting style="margin-top: 20px"></IOSetting>
    </el-tab-pane>
    <el-tab-pane
      v-if="currentProjectConfig.armType.key === 'KHVR1'"
      label="速度配置"
    >
      <SpeedSetting style="margin-top: 20px"></SpeedSetting>
    </el-tab-pane>
    <el-tab-pane
      v-if="
        currentProjectConfig.armType.key === 'M122' ||
        currentProjectConfig.armType.key === 'openEulerRobot' ||
        currentProjectConfig.armType.key === 'M124'
      "
      label="Mapping配置"
    >
      <MappingSetting style="margin-top: 20px"></MappingSetting>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import IOSetting from '~common/components/project_setting/IOSetting'
import MappingSetting from '~common/components/project_setting/MappingSetting'
import { getCurrentProjectConfig } from '~common/utils/my_project'

// import { useStore } from 'vuex'
export default {
  name: 'SettingArea',
  components: {
    IOSetting,
    MappingSetting
  },
  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    }
  }
}
</script>

<style lang="less" scoped>
.project-setting {
  width: 800px;
}
</style>
