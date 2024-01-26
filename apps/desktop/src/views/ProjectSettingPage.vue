<template>
  <el-tabs tab-position='left'>
    <!-- <el-tab-pane label="项目配置">
      <ProjectSetting></ProjectSetting>
    </el-tab-pane> -->
    <el-tab-pane v-if="(currentProjectConfig.armType.key==='M122') && currentUser && currentUser.activateState && currentUser.role === 'admin'" label="机器人配置"><RobotSetting></RobotSetting></el-tab-pane>
    <el-tab-pane v-if="(currentProjectConfig.armType.key==='M122') && currentUser && currentUser.activateState  && currentUser.role === 'admin'" label="关节配置"><JointSetting style="margin-top: 20px"></JointSetting></el-tab-pane>
    <el-tab-pane v-if = "currentUser && currentUser.activateState" label="速度配置"><SpeedSetting style="margin-top: 20px"></SpeedSetting></el-tab-pane>
    <el-tab-pane v-if="(currentProjectConfig.armType.key==='M122') && currentUser && currentUser.activateState" label="控制器配置"><ControllerSetting style="margin-top: 20px"></ControllerSetting></el-tab-pane>
  </el-tabs>
</template>
<script>
import RobotSetting from '@rosc/common/components/project_setting/RobotSetting'
import JointSetting from '@rosc/common/components/project_setting/JointSetting'
import SpeedSetting from '@rosc/common/components/project_setting/SpeedSetting'
import ControllerSetting from '@rosc/common/components/project_setting/ControllerSetting'
import { getCurrentProjectConfig } from '@rosc/common/utils/my_project'
import { getUser } from '@rosc/common/utils/user'

// import { useStore } from 'vuex'
export default {
  name: 'ProjectSettingPage',
  components: {
    // ProjectSetting,
    RobotSetting,
    JointSetting,
    SpeedSetting,
    ControllerSetting,
  },
  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    },
    currentUser () {
      return getUser()
    }
  }
}
</script>

<style lang="less" scoped>
.project-setting {
  width: 800px;
}
</style>
