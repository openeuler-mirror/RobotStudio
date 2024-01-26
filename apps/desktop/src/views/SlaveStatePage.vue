<template>
    <div style="width:1000px; height:700px">
       <span style="margin-left: 20%;">伺服状态：</span>
        <el-table :data="slaveState" style="width: 60%; margin-left: 20%;" border>
            <el-table-column v-for="(item, i) in stateAttributes" :key="i" :prop="item.prop" :label="item.label">
            </el-table-column>
        </el-table>
        <span style="margin-left: 20%; margin-top: 20px;">零点每个轴编码器值：</span>
        <el-table :data="servoEncode" style="width: 60%; margin-left: 20%;" border>
            <el-table-column v-for="i in currentProjectConfig.armType.dof" :key="i" :prop="i" :label="i">
            </el-table-column>
        </el-table>
        <!-- <div id="torque_chart" style="width:100%; height:40%; margin-top: 20px;"></div>
        <div id="velocity_chart" style="width:100%; height:40%  ;"></div> -->
    </div>
</template>

<script>
import { getRPCClient, getServoEncode } from '@rosc/common/utils/rpc/node_rpc'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import {getCurrentProjectConfig} from '~common/utils/my_project'

export default {
  name: 'SlaveStatePage',
  computed: {
    currentProjectConfig () {
      return getCurrentProjectConfig()
    }
  },
  data () {
    return {
      axis: ['Elevation', 'Rotation', 'R1(upper)', 'R2(lower)'],
      torqueChart: null,
      velocityChart: null,
      slaveState: [],
      servoEncode: [],
      //   xAxisTime:[],
      torqueData: {
        Elevation: [],
        Rotation: [],
        Extension_L: [],
        Extension_R: []
      },
      velocityData: {
        Elevation: [],
        Rotation: [],
        Extension_L: [],
        Extension_R: []
      },
      stateAttributes: [
        { prop: 'attribute', label: '关节' },
        { prop: 'Elevation', label: 'Elevation' },
        { prop: 'Rotation', label: 'Rotation' },
        { prop: 'Extension_L', label: 'Extension_L' },
        { prop: 'Extension_R', label: 'Extension_R' }
      ],
      torqueOption: {
        title: {
          text: '关节电流折线图',
          x: 'center',
          y: 'top'
        },
        legend: {
          data: ['Elevation', 'Rotation', 'Extension_L', 'Extension_R'],
          y: 'bottom'
        },
        xAxis: { data: [] },
        yAxis: {},
        series: [
          {
            name: 'Elevation',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          },
          {
            name: 'Rotation',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          },
          {
            name: 'Extension_L',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          },
          {
            name: 'Extension_R',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          }
        ]
      },
      velocityOption: {
        title: {
          text: '关节速度折线图',
          x: 'center'
        },
        legend: {
          data: ['Elevation', 'Rotation', 'Extension_L', 'Extension_R'],
          y: 'bottom'
        },
        xAxis: { data: [] },
        yAxis: {},
        series: [
          {
            name: 'Elevation',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          },
          {
            name: 'Rotation',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          },
          {
            name: 'Extension_L',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          },
          {
            name: 'Extension_R',
            type: 'line',
            endLabel: {
              // show: true
            },
            data: []
          }
        ]
      },
      streamSlaveStateInterval: null,
      slaveStateCall: null
    }
  },
  mounted () {
    // this.getSlaveState()
    // this.torqueChart = echarts.init(document.getElementById('torque_chart'))
    // this.torqueChart.setOption(this.torqueOption)
    // this.velocityChart = echarts.init(document.getElementById('velocity_chart'))
    // this.velocityChart.setOption(this.velocityOption)
    // for (let i = 1; i <= 50; ++i) {
    //   this.velocityOption.xAxis.data.push(i)
    //   this.torqueOption.xAxis.data.push(i)
    // }
  },
  async activated () {
    await this.getServoEncode()
    this.getSlaveState()
    //   this.torqueChart = echarts.init(document.getElementById("torque_chart"))
    //   this.torqueChart.setOption(this.torqueOption)
    //   this.velocityChart = echarts.init(document.getElementById("velocity_chart"))
    //   this.velocityChart.setOption(this.velocityOption)
  },
  deactivated () {
    clearInterval(this.streamSlaveStateInterval)
    this.streamSlaveStateInterval = null
  },
  onBeforeUnmount () {
    if (this.torqueChart) {
      this.torqueChart.dispose()
      this.torqueChart = null
    }
    if (this.velocityChart) {
      this.velocityChart.dispose()
      this.velocityChart = null
    }
  },
  unmounted () {
    if (this.torqueChart) {
      this.torqueChart.dispose()
      this.torqueChart = null
    }
    if (this.velocityChart) {
      this.velocityChart.dispose()
      this.velocityChart = null
    }
  },
  methods: {
    async getServoEncode() {
      this.servoEncode = []
      const res = await getServoEncode()
      const encode = {}
      for (let i = 0; i < res.encode.length; i++) {
        encode[i+1] = res.encode[i]
      }
      this.servoEncode.push(encode)
    },

    getSlaveState () {
      const client = getRPCClient()
      if (!client) {
        ElMessage.error('RPC连接失败')
        return
      }
      const slaveStateCall = client.SlaveState({ message: 'get slave state' })
      slaveStateCall.on('data', (resp) => {
        this.slaveState = []
        const state = {}
        state.attribute = '状态'
        for (const index in this.axis) {
          state[this.axis[index]] = resp.error_code[index]
          this.torqueData[this.axis[index]].push(resp.torque[index])
          this.velocityData[this.axis[index]].push(resp.velocity[index] * 1000)
        }
        this.slaveState.push(state)
      })
      this.streamSlaveStateInterval = setInterval(() => {
        slaveStateCall.write({ message: 'get slave state' })
        // if (this.torqueData[this.axis[0]].length > 50) {
        //   for (const index in this.axis) {
        //     this.torqueOption.series[index].data.shift()
        //     this.velocityOption.series[index].data.shift()
        //     this.torqueOption.series[index].data.push(this.torqueData[this.axis[index]][this.torqueData[this.axis[index]].length - 1])
        //     this.velocityOption.series[index].data.push(this.velocityData[this.axis[index]][this.velocityData[this.axis[index]].length - 1])
        //     this.torqueData[this.axis[index]].shift()
        //     this.velocityData[this.axis[index]].shift()
        //   }
        // } else {
        //   for (const index in this.axis) {
        //     this.torqueOption.series[index].data = this.torqueData[this.axis[index]]
        //     this.velocityOption.series[index].data = this.velocityData[this.axis[index]]
        //   }
        // }
        // this.torqueChart.setOption(this.torqueOption)
        // this.velocityChart.setOption(this.velocityOption)
      }, 1)
    }
  }
}
</script>
