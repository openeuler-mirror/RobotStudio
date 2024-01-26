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
      <el-table-column label="输入状态">
        <template #default="scope">
          <span v-if="scope.row.state">1</span>
          <span v-if="!scope.row.state">0</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRPCClient, stopGetIOInputState } from '~common/utils/my_rpc'
import { GetIOInputStateRequest } from '~common/utils/rpc/robot_grpc_service'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  name: 'IOInput',
  data() {
    return {
      IOData: [],

      IOAttributes: [
        { prop: 'serial', label: '序号' },
        { prop: 'describle', label: '信息' },
        { prop: 'enable', label: '启用' }
      ],
      stream_io_input_interval: null,
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
    this.getIOInputState()
    // this.stream_io_input_interval = setInterval(() => {
    //   this.getIOInputState()
    // }, 1000)
  },

  unmounted() {
    // clearInterval(this.stream_io_input_interval)
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
            enable: '否',
            state: false
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
            enable: '否',
            state: false
          }
          this.IOData.push(data)
        }
      }
    },
    getIOInputState() {
      const client = getRPCClient()
      if (client == null) {
        return
      }
      const request = GetIOInputStateRequest.create({
        message: 'get IO input state'
      })
      const projectName = process.env.PROJECT_NAME
      if (projectName === 'teach_board') {
        const call = client.getIOInputState(request)
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
        const call = client.GetIOInputState(request)
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
