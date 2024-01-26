<template>
  <div class="jointsetting">
    <el-table
      class="bottom"
      stripe
      :data="newJointsData"
      :span-method="spanMethod"
      height="550"
    >
      <el-table-column prop="joint" label="关节" width="150" />
      <el-table-column prop="attribute" label="属性" width="200" />
      <el-table-column prop="value" label="值" width="100">
        <template #default="scope">
          <el-input
            v-if="!scope.row.redify"
            v-model="scope.row.value"
            @change="
              checkRedifyData(
                scope.row.joint,
                scope.row.attribute,
                scope.row.value
              )
            "
          ></el-input>
          <el-input
            v-if="scope.row.redify"
            v-model="scope.row.value"
            style="
              background-color: red !important;
              border-color: red !important;
            "
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="margin-top: 10px" type="primary" @click="confirmRedify">
      保存配置
    </el-button>
    <el-dialog
      v-model="confirmRedifyDialog"
      title="以下值将会被修改"
      width="40%"
    >
      <el-table :data="redifyData" height="300">
        <el-table-column
          prop="joint"
          label="关节"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="attribute"
          label="属性"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="oldData"
          label="旧值"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="newData"
          label="新值"
          width="100"
        ></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="confirmRedifyDialog = false">取消</el-button>
          <el-button type="primary" @click="saveProjectSetting">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getRobotSetting, saveJointSetting } from '~common/utils/my_rpc'

export default {
  data() {
    return {
      oldJointsData: [],
      newJointsData: [],
      redifyData: [],
      confirmRedifyDialog: false,
      attributeMap: {
        vel_max: '最大速度',
        acc_max: '最大加速度',
        jerk: '最大加加速度',
        MotionRangeStart: '最小限位',
        MotionRangeEnd: '最大限位',
        dcc_max: '最大减速度',
        dcc_jerk: '最大减减速度'
      }
    }
  },
  computed: {
    ...mapState({
      rpcIsConnected: (state) => state.rpc.isRPCConnected
    })
  },

  watch: {
    rpcIsConnected() {
      this.oldJointsData = []
      this.newJointsData = []
      this.redifyData = []
    }
  },

  async mounted() {
    await this.getConfig()
  },

  methods: {
    spanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 7 === 0) {
          return {
            rowspan: 7,
            colspan: 1
          }
        }
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    async getConfig() {
      this.oldJointsData = []
      this.newJointsData = []
      this.redifyData = []
      const setting = await getRobotSetting('joints')
      const data = setting.joint_setting
      for (const index in data.joint_name) {
        for (const item in this.attributeMap) {
          const jointData = {}
          jointData.joint = data.joint_name[index]
          if (item in data) {
            jointData.label = item
            jointData.attribute = this.attributeMap[item]
            jointData.value = data[item][index]
            jointData.redify = false
          }
          if (
            !(
              jointData.joint === 'linear-motion' &&
              (jointData.label === 'MotionRangeStart' ||
                jointData.label === 'MotionRangeEnd' ||
                jointData.label === 'dcc_jerk' ||
                jointData.label === 'dcc_max')
            )
          ) {
            this.newJointsData.push(jointData)
          }
        }
      }
      this.oldJointsData = JSON.parse(JSON.stringify(this.newJointsData))
    },
    async saveProjectSetting() {
      const saveData = []
      for (const index in this.newJointsData) {
        const item = {}
        item.axis_name = this.newJointsData[index].joint
        item.attribute = this.newJointsData[index].label
        item.value = this.newJointsData[index].value
        saveData.push(item)
        this.newJointsData[index].redify = false
      }
      await saveJointSetting(saveData)
      this.oldJointsData = JSON.parse(JSON.stringify(this.newJointsData))
      this.confirmRedifyDialog = false
    },

    checkRedifyData(joint, attribute, value) {
      let redify = false
      for (const index in this.oldJointsData) {
        if (
          this.oldJointsData[index].joint === joint &&
          this.oldJointsData[index].attribute === attribute
        ) {
          if (this.oldJointsData[index].value !== value) {
            redify = true
            break
          }
        }
      }
      for (const index in this.newJointsData) {
        if (
          this.newJointsData[index].joint === joint &&
          this.newJointsData[index].attribute === attribute
        ) {
          this.newJointsData[index].redify = redify
          break
        }
      }
    },

    confirmRedify() {
      this.redifyData = []
      for (const oldIndex in this.oldJointsData) {
        for (const newIndex in this.newJointsData) {
          if (
            this.oldJointsData[oldIndex].joint ===
              this.newJointsData[newIndex].joint &&
            this.oldJointsData[oldIndex].attribute ===
              this.newJointsData[newIndex].attribute &&
            this.oldJointsData[oldIndex].value !==
              this.newJointsData[newIndex].value
          ) {
            const item = {
              joint: this.oldJointsData[oldIndex].joint,
              attribute: this.oldJointsData[oldIndex].attribute,
              oldData: this.oldJointsData[oldIndex].value,
              newData: this.newJointsData[newIndex].value
            }
            this.redifyData.push(item)
          }
        }
      }
      this.confirmRedifyDialog = true
    }
  }
}
</script>

<style lang="less" scoped>
.jointsetting {
  .top {
    height: 35px;
    text-align: right;
    padding-right: 30%;
    .right {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
  }

  .divider {
    margin: 10px auto 10px;
  }
  .bottom {
    display: flex;
    flex: 1;

    .left {
      display: flex;
      align-items: center;
      height: 450px;
      width: 450px;
      margin: 15px 15px;
      border: 0.1px solid @--color-border-light;
    }

    .right {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: flex-start;
      align-items: center;

      .move-button {
        width: 100px;
        height: 28px;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }

      .collapse {
        width: 100%;
        height: 100%;

        .collapse-item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          .configs {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }

          .speed {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0 15px 0 15px;
            .el-slider {
              margin-left: 20px;
              width: 90%;
            }
            .text {
              margin-top: 10px;
              text-align: center;
            }
          }
          .uni-button-2 {
            width: 200px;
            margin: 10px 10px;
          }
          .optionis {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
