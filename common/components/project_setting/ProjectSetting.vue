<template>
  <div class="ProjectSetting">
    <el-tabs
      v-model="currentProjectType"
      tab-position="left"
      style="width: 100%"
      @tab-click="onTabClick"
    >
      <el-tab-pane
        v-for="projectType in showProjectTypes"
        :key="projectType.type"
        :name="projectType.type"
      >
        <template #label>
          <div style="display: flex">
            {{ projectType.name }}
            <iconfont icon-class="#beta" :size="28"></iconfont>
          </div>
        </template>
        <el-form
          v-if="projectSetting"
          :model="projectSetting"
          label-position="left"
          size="mini"
        >
          <el-divider>基本配置</el-divider>
          <el-form-item label="工程名称">
            <el-input v-model="projectSetting.name" class="input"></el-input>
          </el-form-item>
          <el-form-item v-if="projectSetting.ip !== undefined" label="工控机IP">
            <el-input v-model="projectSetting.ip" class="input"></el-input>
          </el-form-item>
          <template v-if="projectSetting.type === projectTypes.ARM.type">
            <el-divider>机械臂配置</el-divider>
            <el-form-item
              label="机械臂"
              style="display: flex; align-items: center"
            >
              <el-radio-group
                v-model="projectSetting.armType.key"
                :disabled="
                  projectSettingMode.key !== PROJECT_SETTING_MODE.NEW.key
                "
                @change="onArmTypeRadioChange"
              >
                <el-radio
                  v-for="armType in ARM_TYPES"
                  :key="armType.key"
                  :label="armType.key"
                >
                  {{ armType.name }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div style="display: flex; justify-content: center; margin-top: 20px">
      <el-button
        v-if="projectSettingMode.key === PROJECT_SETTING_MODE.NEW.key"
        class="uni-button-2"
        @click="save()"
      >
        创&nbsp;&nbsp;&nbsp;&nbsp;建
      </el-button>
      <el-button
        v-else-if="projectSettingMode.key === PROJECT_SETTING_MODE.UPDATE.key"
        type="primary"
        class="uni-button-2"
        @click="save()"
      >
        保&nbsp;&nbsp;&nbsp;&nbsp;存
      </el-button>
      <el-button
        v-if="projectSettingMode.key === PROJECT_SETTING_MODE.NEW.key"
        class="uni-button-2"
        @click="cancel()"
      >
        取&nbsp;&nbsp;&nbsp;&nbsp;消
      </el-button>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import {
  createProject,
  readAllProjectConfig,
  updateCurrentProjectConfig,
  getCurrentProjectConfig
} from '~common/utils/project'

export default {
  data() {
    return {
      projectSetting: {}, // 项目设置
      currentProjectType: '', // 默认新建的项目
      loadingInstance: null, // loading实例
      testSSHResult: null // 测试SSH结果
    }
  },
  computed: {
    PROJECT_SETTING_MODE() {
      const store = useStore()
      return store.state.project_setting.PROJECT_SETTING_MODE
    },
    projectSettingMode() {
      const store = useStore()
      return store.state.project_setting.projectSettingMode
    },
    /**
     * 显示的所有的项目类型
     */
    showProjectTypes() {
      if (this.projectSettingMode.key === this.PROJECT_SETTING_MODE.NEW.key) {
        return this.projectTypes
      }
      if (
        this.projectSettingMode.key === this.PROJECT_SETTING_MODE.UPDATE.key
      ) {
        for (const i in this.projectTypes) {
          if (this.projectTypes[i].type === this.projectSetting.type)
            return [this.projectTypes[i]]
        }
      }
      return {}
    },
    /**
     * 所有的项目类型
     */
    projectTypes() {
      const store = useStore()
      return store.state.project_type.projectTypes
    },
    /**
     * 所有编程类型
     */
    codeTypes() {
      const store = useStore()
      return store.state.project_type.codeTypes
    },
    ARM_TYPES() {
      const store = useStore()
      return store.state.project_type.ARM_TYPES
    }
  },
  mounted() {
    if (this.projectSettingMode.key === this.PROJECT_SETTING_MODE.NEW.key) {
      this.projectSetting = this.getDefaultprojectSetting()
      this.currentProjectType = this.projectSetting.type
    } else {
      this.projectSetting = getCurrentProjectConfig()
      console.log(this.projectSetting)
      this.currentProjectType = this.projectSetting.type
    }
  },
  methods: {
    /**
     * 选定编程类型radio发生变化
     */
    onRadioChange(newRadio) {
      for (const i in this.codeTypes) {
        if (this.codeTypes[i].key === newRadio) {
          this.projectSetting.codeType = JSON.parse(
            JSON.stringify(this.codeTypes[i])
          )
          break
        }
      }
    },
    /**
     * 选定机械臂类型radio发生变化
     * @param {Object} newRadio
     */
    onArmTypeRadioChange(newRadio) {
      for (const i in this.ARM_TYPES) {
        if (this.ARM_TYPES[i].key === newRadio) {
          this.projectSetting.armType = JSON.parse(
            JSON.stringify(this.ARM_TYPES[i])
          )
          break
        }
      }
    },
    /**
     * 点击tab事件,刷新配置
     */
    onTabClick(tab) {
      if (this.projectSettingMode.key === this.PROJECT_SETTING_MODE.NEW.key) {
        for (const i in this.projectTypes) {
          if (this.projectTypes[i].type === tab.name) {
            this.projectSetting = JSON.parse(
              JSON.stringify(this.projectTypes[i])
            )
            break
          }
        }
      }
    },
    /**
     * 获取默认项目的配置
     */
    getDefaultprojectSetting() {
      return JSON.parse(JSON.stringify(this.projectTypes.ARM))
    },
    /**
     * 取消设置
     */
    cancel() {
      this.emitCloseSetting()
      if (this.projectSettingMode.key === this.PROJECT_SETTING_MODE.NEW.key) {
        this.$router.back(-1)
      }
    },
    emitCloseSetting() {
      this.$emit('closeSetting')
    },
    /**
     * 保存或者更新
     */
    save() {
      if (this.projectSettingMode.key === this.PROJECT_SETTING_MODE.NEW.key) {
        this.projectSetting.id = this.$utils.get_uuid()
        createProject(this.projectSetting)
        readAllProjectConfig()
        this.$notify.success('创建项目成功')
        this.$utils.routeToNormalWindow('/projectList')
      } else if (
        this.projectSettingMode.key === this.PROJECT_SETTING_MODE.UPDATE.key
      ) {
        updateCurrentProjectConfig(this.projectSetting)
        this.$myIDESetting.eventBus.emit(
          this.$myIDESetting.busEvent.EVENT.CURRENT_PROJECT_CONFIG_CHANGED
        )
      }
    },
    /**
     * 测试SSH的连通性
     */
    testSSH() {
      this.testSSHResult = ''
      this.loadingInstance = this.$loading({
        lock: true,
        text: '测试中',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.$mySSH
        .testSSH(this.projectSetting)
        .then(() => {
          this.testSSHResult = '连接成功'
        })
        .catch((err) => {
          this.testSSHResult = `连接失败${err}`
        })
        .finally(() => {
          this.loadingInstance.close()
        })
    }
  }
}
</script>

<style lang="less" scoped>
.ProjectSetting {
  min-width: 500px;
  width: 100%;
  .el-form-item__label {
    width: 120px !important;
  }

  .el-form-item__content {
    // margin-left: 120px !important;
    display: flex;
  }
}
</style>
