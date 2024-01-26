<template>
  <div>
    <div>
      <span v-if="currentProjectConfig.armType.key === 'openEulerRobot'">
        速度类型：
      </span>
      <el-select
        v-if="currentProjectConfig.armType.key === 'openEulerRobot'"
        v-model="speedType"
        class="m-2"
        placeholder="速度类型"
      >
        <el-option
          v-for="item in speedTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span v-if="currentProjectConfig.armType.key === 'openEulerRobot'">
        速度等级：
      </span>
      <el-select
        v-if="currentProjectConfig.armType.key === 'openEulerRobot'"
        v-model="speedLevel"
        class="m-2"
        placeholder="速度等级"
        style="margin-left: 10px"
      >
        <el-option
          v-for="item in speedLevelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span v-if="currentProjectConfig.armType.key === 'openEulerRobot'">
        关节
      </span>
      <el-select
        v-if="currentProjectConfig.armType.key === 'openEulerRobot'"
        v-model="joint"
        class="m-2"
        placeholder="关节"
        style="margin-left: 10px"
      >
        <el-option
          v-for="item in openEulerRobotJointOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-if="currentProjectConfig.armType.key === 'M122'"
        v-model="joint"
        class="m-2"
        placeholder="关节"
        style="margin-left: 10px"
      >
        <el-option
          v-for="item in m122JointOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button type="primary" style="margin-left: 10px" @click="searchSpeed">
        查询
      </el-button>
    </div>
    <div>
      <div
        v-if="
          currentProjectConfig.armType.key === 'KHVR1' ||
          currentProjectConfig.armType.key === 'KHVR2'
        "
      >
        <span>取放片使用示教器设置速度：</span>
        <el-select v-model="specifySpeed" placeholder="是:使用示教器设置的速度">
          <el-option
            v-for="(item, index) in specifySpeedOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-table
        :data="newSpeedData"
        height="60vh"
        style="margin-top: 10px"
        stripe
        border
      >
        <el-table-column prop="attribute" label="速度项" width="300" />
        <el-table-column prop="value" label="值" width="100">
          <template #default="scope">
            <el-input
              v-if="!scope.row.redify"
              v-model="scope.row.value"
              @change="checkRedifyData(scope.row.attribute, scope.row.value)"
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
    </div>
    <el-button
      style="margin-top: 10px"
      type="primary"
      :disabled="!newSpeedData"
      @click="confirmRedify"
    >
      保存配置
    </el-button>
    <el-dialog
      v-model="confirmRedifyDialog"
      title="以下值将会被修改"
      width="40%"
    >
      <el-table :data="redifyData" height="300">
        <el-table-column
          prop="attribute"
          label="属性"
          width="250"
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
          <el-button type="primary" @click="saveSpeedSetting">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getSpeedConfig, saveSpeedConfig } from '~common/utils/rpc/node_rpc'
import { getCurrentProjectConfig } from '~common/utils/project'

export default {
  data() {
    return {
      speedTypeOptions: [
        {
          label: 'host',
          value: 'host'
        },
        {
          label: 'TP',
          value: 'TP'
        }
      ],
      speedLevelOptions: [
        {
          label: 'low',
          value: 'low'
        },
        {
          label: 'middle',
          value: 'middle'
        },
        {
          label: 'high',
          value: 'high'
        },
        {
          label: 'inching',
          value: 'inching'
        }
      ],
      openEulerRobotJointOptions: [
        {
          label: 'rotation',
          value: 'rotation'
        },
        {
          label: 'extension',
          value: 'extension'
        },
        {
          label: 'elevation',
          value: 'elevation'
        },
        {
          label: 'linear_motion',
          value: 'linear_motion'
        }
      ],
      m122JointOptions: [
        {
          label: 'rotation',
          value: 'rotation'
        },
        {
          label: 'extension',
          value: 'extension'
        },
        {
          label: 'elevation',
          value: 'elevation'
        },
        {
          label: 'linear_motion',
          value: 'linear_motion'
        },
        {
          label: 'wrist',
          value: 'wrist'
        }
      ],
      speedType: null,
      speedLevel: null,
      joint: null,
      oldSpeedData: null,
      newSpeedData: null,
      redifyData: [],
      specifySpeed: null,
      confirmRedifyDialog: false,
      specifySpeedOptions: [
        {
          label: '是',
          value: false
        },
        {
          label: '否',
          value: true
        }
      ]
    }
  },

  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    },
    ...mapState({
      rpcIsConnected: (state) => state.rpc.isRPCConnected
    })
  },

  watch: {
    rpcIsConnected() {
      this.oldSpeedData = []
      this.newSpeedData = []
      this.redifyData = []
    }
  },

  activated() {
    this.oldSpeedData = null
    this.newSpeedData = null
    this.redifyData = []
  },

  methods: {
    async searchSpeed() {
      this.newSpeedData = []
      let speedLevelKey = this.speedLevel
      if (this.speedType === 'host') {
        if (this.speedLevel === 'low') {
          speedLevelKey = '3'
        } else if (this.speedLevel === 'middle') {
          speedLevelKey = '2'
        } else if (this.speedLevel === 'high') {
          speedLevelKey = '1'
        }
      }
      const res = await getSpeedConfig(
        this.speedType,
        speedLevelKey,
        this.joint
      )
      this.specifySpeed = res.specify_speed
      const speedConfig = res.speed_config
      const speedConfigs = speedConfig.split(',')
      for (const index in speedConfigs) {
        const items = speedConfigs[index].split(':')
        const oneSpeed = {
          attribute: items[0],
          value: items[1] * 1
        }
        this.newSpeedData.push(oneSpeed)
      }
      this.oldSpeedData = JSON.parse(JSON.stringify(this.newSpeedData))
      this.oldSpeedData.pop()
      this.newSpeedData.pop()
    },

    checkRedifyData(attribute, value) {
      let redify = false
      for (const index in this.oldSpeedData) {
        if (this.oldSpeedData[index].attribute === attribute) {
          if (this.oldSpeedData[index].value !== value) {
            redify = true
            break
          }
        }
      }
      for (const index in this.newSpeedData) {
        if (this.newSpeedData[index].attribute === attribute) {
          this.newSpeedData[index].redify = redify
          break
        }
      }
    },

    confirmRedify() {
      this.redifyData = []
      for (const oldIndex in this.oldSpeedData) {
        for (const newIndex in this.newSpeedData) {
          if (
            this.oldSpeedData[oldIndex].attribute ===
              this.newSpeedData[newIndex].attribute &&
            this.oldSpeedData[oldIndex].value !==
              this.newSpeedData[newIndex].value
          ) {
            const item = {
              attribute: this.oldSpeedData[oldIndex].attribute,
              oldData: this.oldSpeedData[oldIndex].value,
              newData: this.newSpeedData[newIndex].value
            }
            this.redifyData.push(item)
          }
        }
      }
      this.confirmRedifyDialog = true
    },

    async saveSpeedSetting() {
      this.redifyData = []
      const saveData = []
      for (const index in this.newSpeedData) {
        this.newSpeedData[index].redify = false
        const item = {
          attribute: this.newSpeedData[index].attribute,
          value: this.newSpeedData[index].value
        }
        saveData.push(item)
      }
      await saveSpeedConfig(saveData, this.speedType, this.specifySpeed)
      this.oldSpeedData = JSON.parse(JSON.stringify(this.newSpeedData))
    }
  }
}
</script>
