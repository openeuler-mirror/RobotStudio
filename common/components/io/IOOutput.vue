<template>
  <div style="height: 100%; margin-left: 15%">
    <el-table
      :data="IOData"
      height="75vh"
      style="width: 80%"
      row-style="height: 60px"
      border
    >
      <el-table-column
        v-for="(item, i) in IOAttributes"
        :key="i"
        :prop="item.prop"
        :label="item.label"
      ></el-table-column>
      <el-table-column label="输出状态">
        <template #default="scope">
          <el-switch
            v-model="scope.row.state"
            active-text="打开"
            inactive-text="关闭"
            size="large"
            @change="changeIOState(scope.row.serial - 1, scope.row.state)"
          ></el-switch>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { ElMessage } from 'element-plus'
import {
  setIOOutputState,
  stopGetIOInputState,
  getRPCClient
} from '~common/utils/my_rpc'
import { GetIOOutputStateRequest } from '~common/utils/rpc/robot_grpc_service'
import { getEmergencyStop } from '~common/utils/arm_state'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  name: 'IOOutput',
  data() {
    return {
      IOData: [],

      IOAttributes: [
        { prop: 'serial', label: '序号' },
        { prop: 'describle', label: '信息' },
        { prop: 'enable', label: '启用' }
      ],
      ioNumber: 24
    }
  },

  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    }
  },
  mounted() {
    this.initIOData()
    this.initIOState()
  },
  unmounted() {
    stopGetIOInputState()
  },

  methods: {
    initIOData() {
      if (
        this.currentProjectConfig &&
        this.currentProjectConfig.armType.key === 'openEulerRobot'
      ) {
        this.ioNumber = 24
        for (let i = 0; i < this.ioNumber; ++i) {
          const data = {
            serial: i,
            describle: `IO端口${i}`,
            state: false,
            enable: '否'
          }
          this.IOData.push(data)
        }
      } else if (
        this.currentProjectConfig &&
        (this.currentProjectConfig.armType.key === 'KHVR1' ||
          this.currentProjectConfig.armType.key === 'KHVR2')
      ) {
        this.ioNumber = 32
        for (let i = 1; i <= this.ioNumber; ++i) {
          const data = {
            serial: i,
            describle: `IO端口${i}`,
            state: false,
            enable: '否'
          }
          this.IOData.push(data)
        }
      }
    },

    changeIOState(serial, state) {
      if (this.currentProjectConfig.armType.key === 'openEulerRobot') {
        serial += 1
      }
      const oldState = !state
      if (getEmergencyStop()) {
        this.IOData[serial].state = oldState
        ElMessage.error('机器人处于急停状态')
        return
      }

      const newState = state
      setIOOutputState(serial, newState)
      this.IOData[serial].state = newState
    },
    async initIOState() {
      // const IOState = await getIOOutputState()
      // if (IOState) {
      //   for (const index in this.IOData) {
      //     this.IOData[index + 1].state = IOState[index]
      //   }
      // }
      const client = getRPCClient()
      if (client == null) {
        return
      }
      const request = GetIOOutputStateRequest.create({
        message: 'get IO input state'
      })
      const projectName = process.env.PROJECT_NAME
      if (projectName === 'teach_board') {
        const call = client.getIOOutputState(request)
        call.responses.onMessage((resp) => {
          if (resp.states) {
            for (let index = 0; index < this.ioNumber; index++) {
              this.IOData[index].state = resp.states[index]
              this.IOData[index].describle = resp.describes[index]
              if (resp.enable[index]) {
                this.IOData[index].enable = '是'
              } else {
                this.IOData[index].enable = '否'
              }
            }
          }
          resp = null
        })
        call.responses.onError((err) => {
          console.log('流式IO输入状态获取错误：', err.toString())
        })
      } else {
        const call = client.GetIOOutputState(request)
        call.on('data', (resp) => {
          if (resp.states) {
            for (let index = 0; index < this.ioNumber; index++) {
              this.IOData[index].state = resp.states[index]
              this.IOData[index].describle = resp.describes[index]
              if (resp.enable[index]) {
                this.IOData[index].enable = '是'
              } else {
                this.IOData[index].enable = '否'
              }
            }
          }
        })
        call.on('error', (err) => {
          console.log('流式IO输入状态获取错误：', err.toString())
        })
      }
    }
  }
}
</script>
