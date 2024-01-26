<template>
  <div style="height: 100%">
    <el-table
      :data="showDataTable"
      style="width: 100%"
      height="71.5vh"
      :default-sort="{ prop: 'attrubute', order: 'descending' }"
      border
    >
      <el-table-column
        prop="attribute"
        label="属性"
        width="100%"
        :sortable="true"
        :sort-method="sortAttribute"
      />
      <el-table-column prop="name" label="名称" width="220%" />
      <el-table-column
        v-if="
          currentProjectConfig.armType.key === 'openEulerRobot' ||
          currentProjectConfig.armType.key === 'M122'
        "
        prop="arm"
        label="Arm"
        width="150%"
      />
      <el-table-column
        v-for="(item, index) in currentProjectConfig.armType.dof"
        :key="index"
        :prop="index.toString()"
        :label="axisName[index]"
        width="100%"
      ></el-table-column>
      <el-table-column label="操作" width="100%">
        <template #default="scope">
          <el-button
            v-if="
              isBuildInData(scope.row.name) &&
              scope.row.name.indexOf('HOME') !== -1
            "
            size="mini"
            type="danger"
            :disabled="isBuildInData(scope.row.name)"
            @click="deletePointbyName(scope.row.name, 0, scope.row.arm)"
          >
            删除
          </el-button>
          <el-button
            v-if="
              isBuildInData(scope.row.name) &&
              scope.row.name.indexOf('HOME') === -1
            "
            size="mini"
            type="danger"
            @click="deletePointbyName(scope.row.name, 1, scope.row.arm)"
          >
            清空
          </el-button>
          <el-button
            v-if="!isBuildInData(scope.row.name)"
            size="mini"
            type="danger"
            @click="deletePointbyName(scope.row.name, 0, scope.row.arm)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="点动" width="130%">
                  <template v-slot="scope">
                      <el-button
                      size="mini"
                      type="primary"
                      @mousedown="moveToCurrentJoint(scope.row)"
                      @mouseup="teachJogStop()">点动</el-button>
                  </template>
              </el-table-column> -->
      <el-table-column prop="describe" label="描述" />
    </el-table>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { getAllJointData, getBuildInData } from '~common/utils/my_data'
import {
  deletePoint,
  downloadPointFile,
  goTeachJoint
} from '~common/utils/my_rpc'
import { getPower, getEmergencyStop } from '~common/utils/arm_state'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  data() {
    return {
      jointData: [],
      showDataTable: [],
      buildInData: ['ZERO'],
      axisName: ['radial', 'theta', 'z']
    }
  },
  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    }
  },
  activated() {
    this.getBuildInData()
    this.syncPointData()
  },
  methods: {
    sortAttribute(row1, row2) {
      return row1.attribute.localeCompare(row2.attribute)
    },
    getBuildInData() {
      const data = getBuildInData(this.currentProjectConfig.armType.key)
      for (const index in data) {
        for (const childIndex in data[index].children) {
          this.buildInData.push(data[index].children[childIndex].value)
        }
      }
      this.buildInData.push('HOME_openEulerRobot')
      this.buildInData.push('HOME_M122')
    },
    async flushJointData(dataContent) {
      this.jointData = []
      const currentJointData = getAllJointData(
        dataContent,
        this.currentProjectConfig.armType.key
      )
      for (const index in currentJointData) {
        const data = currentJointData[index]
        if (this.isBuildInData(data.name)) {
          data.attribute = '内置数据'
        } else {
          data.attribute = '用户数据'
        }

        if (!data.describe) {
          data.describe = ''
        }
        this.jointData.push(data)
      }
      this.showDataTable = []
      for (const i in this.jointData) {
        this.showDataTable.push(JSON.parse(JSON.stringify(this.jointData[i])))
      }
    },
    isBuildInData(dataName) {
      const index = this.buildInData.indexOf(dataName)
      return index > -1
    },
    async deletePointbyName(name, type, arm) {
      let redifyType = '删除'
      if (type === 1) {
        redifyType = '清空'
      }
      const that = this
      await this.$confirm(`确认${redifyType}数据: ${name}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePoint(name, type, arm)
        let index = 0

        if (type === 0) {
          for (index in this.showDataTable) {
            if (this.showDataTable[index].name === name) {
              break
            }
          }
          this.showDataTable.splice(index, 2)
        } else if (type === 1) {
          for (index in this.showDataTable) {
            if (
              this.showDataTable[index].name === name &&
              this.showDataTable[index].arm === arm
            ) {
              break
            }
          }
          for (let i = 0; i < this.currentProjectConfig.armType.dof - 1; ++i) {
            that.showDataTable[index][i] = '0.000'
          }
        }

        if (type === 0) {
          for (index in this.jointData) {
            if (this.jointData[index].name === name) {
              break
            }
          }
          this.jointData.splice(index, 2)
        } else if (type === 1) {
          for (index in this.jointData) {
            if (
              this.jointData[index].name === name &&
              this.jointData[index].arm === arm
            ) {
              break
            }
          }
          for (let i = 0; i < this.currentProjectConfig.armType.dof - 1; ++i) {
            that.jointData[index][i] = '0.000'
          }
        }
      })
    },
    downloadJointData() {
      const vm = this
      downloadPointFile()
        .then((data) => {
          vm.flushJointData(data)
        })
        .catch((err) => {
          ElMessage.error('数据导入失败，请刷新数据', err)
        })
    },
    syncPointData() {
      this.downloadJointData()
    },
    async moveToCurrentJoint(row) {
      if (getEmergencyStop()) {
        ElMessage.error('机器人处于急停状态')
        return
      }
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      await goTeachJoint(row.name)
    },
    searchData(filter) {
      this.showDataTable = []
      if (filter) {
        const reg = new RegExp(filter)
        this.showDataTable = JSON.parse(
          JSON.stringify(this.jointData.filter((item) => reg.test(item.name)))
        )
      } else {
        for (const i in this.jointData) {
          this.showDataTable.push(JSON.parse(JSON.stringify(this.jointData[i])))
        }
      }
    }
  }
}
</script>
