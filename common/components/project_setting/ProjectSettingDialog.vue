<template>
  <div class="ProjectSettingDialog">
    <el-dialog v-show="visible" title="工程设置" @open="onDialogOpen()">
      <project-setting
        ref="projectSetting"
        @closeSetting="visible = false"
      ></project-setting>
    </el-dialog>
  </div>
</template>

<script>
import ProjectSetting from '~common/components/project_setting/ProjectSetting'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  components: {
    ProjectSetting
  },
  data() {
    return {
      visible: false // 可见性
    }
  },
  computed: {
    /**
     * 当前项目
     */
    currentProjectConfig() {
      return getCurrentProjectConfig()
    }
  },
  mounted() {
    this.initEventBus()
  },
  methods: {
    initEventBus() {
      this.$myIDESetting.eventBus.on(
        this.$myIDESetting.busEvent.EVENT.SHOW_CONFIG_DIALOG,
        () => {
          this.$store.commit(
            'PROJECT_SETTING_MODE',
            this.$store.state.project_setting.PROJECT_SETTING_MODE.UPDATE
          )
          this.visible = true
        }
      )
    },
    /**
     * 对话框打开回调，编辑项目设置
     */
    onDialogOpen() {
      this.$nextTick(() => {
        this.$refs.projectSetting.currentProjectType =
          this.currentProjectConfig.type
        this.$refs.projectSetting.projectSetting = JSON.parse(
          JSON.stringify(this.currentProjectConfig)
        )
      })
    }
  }
}
</script>

<style lang="less">
.ProjectSettingDialog {
  .el-dialog {
    width: 80%;
  }
}
</style>
