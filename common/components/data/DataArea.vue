<template>
  <div class="data-area">
    <el-tabs
      v-model="currentDataTypeKey"
      style="margin-bottom: 10px"
      @tab-click="tab_click"
    >
      <el-tab-pane
        v-for="dataType in dataTypes"
        :key="dataType.label"
        :label="dataType.label"
        :name="dataType.key"
      ></el-tab-pane>
    </el-tabs>
    <div id="bottom" class="bottom">
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: flex-end;
          margin-bottom: 10px;
        "
      >
        <el-button
          v-if="projectName !== 'teach_board'"
          class="uni-button-1"
          size="mini"
          @click="importFromRemote"
        >
          查看控制器当前数据
        </el-button>
        <el-button
          v-if="projectName === 'teach_board'"
          class="uni-button-1"
          style="height: 50px"
          @click="importFromRemote"
        >
          查看控制器当前数据
        </el-button>
        <el-button
          v-if="projectName !== 'teach_board'"
          class="uni-button-1"
          size="mini"
          @click="loadLocaldata"
        >
          查看上位机备份数据
        </el-button>
        <el-button
          v-if="
            currentUser &&
            currentUser.activateState &&
            projectName !== 'teach_board'
          "
          class="uni-button-1"
          size="mini"
          @click="backUpDialog = true"
        >
          备份数据到上位机
        </el-button>
        <el-dialog v-model="backUpDialog" title="警告" width="30%">
          <span>点击确认会导致上次备份数据被覆盖</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="backUpDialog = false">取消</el-button>
              <el-button type="primary" @click="backUpFromRemote">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
        <el-button
          v-if="
            currentUser &&
            currentUser.activateState &&
            projectName !== 'teach_board'
          "
          class="uni-button-1"
          size="mini"
          style="margin-left: 5px"
          @click="updateDialog = true"
        >
          更新数据到下位机
        </el-button>
        <el-dialog v-model="updateDialog" title="警告" width="30%">
          <span>点击确认会导致下位机数据被覆盖</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="updateDialog = false">取消</el-button>
              <el-button type="primary" @click="updateToRemote">确认</el-button>
            </span>
          </template>
        </el-dialog>
        <el-button
          v-if="
            currentUser &&
            currentUser.activateState &&
            projectName !== 'teach_board'
          "
          class="uni-button-1"
          size="mini"
          style="margin-left: 5px"
          @click="clearDialog = true"
        >
          清空所有数据
        </el-button>
        <el-dialog v-model="clearDialog" title="警告" width="30%">
          <span>点击确认清空下位机所有数据</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="clearDialog = false">取消</el-button>
              <el-button type="primary" @click="clearAllData">确认</el-button>
            </span>
          </template>
        </el-dialog>
        <el-input
          v-model="filter"
          style="width: 200px; margin-left: auto"
          size="mini"
          placeholder="点位名称"
          clearable
          @clear="searchData"
        ></el-input>
        <el-button
          class="uni-button-1"
          style="margin-left: 5px; height: 50px; width: 100px"
          size="large"
          @click="searchData"
        >
          查找
        </el-button>
      </div>
      <div
        v-if="
          currentProjectConfig &&
          currentProjectConfig.armType.key === 'openEulerRobot'
        "
        style="width: 100%; height: 100%"
      >
        <keep-alive>
          <JointDataTable
            v-if="currentDataTypeKey == 'joint'"
            ref="joint"
          ></JointDataTable>
        </keep-alive>
        <!-- <keep-alive>
        <PoseDataTable v-if="currentDataTypeKey == 'pose'" ref = "pose"></PoseDataTable>
        </keep-alive> -->
      </div>
      <div
        v-if="
          currentProjectConfig && currentProjectConfig.armType.key === 'KHVR1'
        "
        style="width: 100%; height: 100%"
      >
        <keep-alive>
          <JointDataTableSingle
            v-if="currentDataTypeKey === 'joint'"
            ref="joint"
          ></JointDataTableSingle>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import JointDataTable from '~common/components/data/JointDataTable'
import JointDataTableSingle from '~common/components/data/JointDataTableSingle'
import { getDataTypes } from '~common/utils/my_data'
import { getCurrentProjectConfig } from '~common/utils/my_project'
import { getUser } from '~common/utils/user'

export default {
  name: 'DataArea',
  components: {
    JointDataTable,
    JointDataTableSingle
  },
  data() {
    return {
      filter: '', // 表格筛选条件
      row_data: null, // 当前正在操作的row_data
      row_data_show: false, // 当前正在操作的row_data的dialog显示
      currentDataTypeKey: 'joint', // 当前正在显示的数据类型
      backUpDialog: false,
      updateDialog: false,
      clearDialog: false,
      projectName: null
    }
  },
  computed: {
    dataTypes() {
      return getDataTypes()
    },
    currentProjectConfig() {
      return getCurrentProjectConfig()
    },
    currentUser() {
      return getUser()
    }
  },
  mounted() {
    this.projectName = process.env.PROJECT_NAME
  },
  activated() {
    this.projectName = process.env.PROJECT_NAME
  },
  unmounted() {
    delete this.resizeObserver
  },
  methods: {
    tab_click() {},
    importFromRemote() {
      if (this.currentDataTypeKey === 'joint') {
        this.$refs.joint.syncPointData()
      } else if (this.currentDataTypeKey === 'pose') {
        this.$refs.pose.syncPointData()
      }
    },
    loadLocaldata() {
      if (this.currentDataTypeKey === 'joint') {
        this.$refs.joint.loadLocaldata()
      }
    },
    searchData() {
      if (this.currentDataTypeKey === 'joint') {
        this.$refs.joint.searchData(this.filter)
      } else if (this.currentDataTypeKey === 'pose') {
        this.$refs.pose.searchData(this.filter)
      }
    },
    backUpFromRemote() {
      this.backUpDialog = false
      if (this.currentDataTypeKey === 'joint') {
        this.$refs.joint.backUpData()
      }
    },
    updateToRemote() {
      this.updateDialog = false
      if (this.currentDataTypeKey === 'joint') {
        this.$refs.joint.updateData()
      }
    },
    clearAllData() {
      this.clearDialog = false
      if (this.currentDataTypeKey === 'joint') {
        this.$refs.joint.clearAllData()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.data-area {
  height: 100%;
  width: 95%;
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  .bottom {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .el-tabs {
    height: auto !important;

    .el-tabs__content {
      // @include flex;
      flex: none !important;
      height: auto !important;

      .el-tab-pane {
        width: 100%;
      }
    }
  }
}
</style>
