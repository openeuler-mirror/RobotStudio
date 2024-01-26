<template>
<div style="height: 100%; margin-left: 15%;">
  <el-table :data="IOData" height="85vh" style="width: 80%;" border>
    <el-table-column v-for="(item, i) in IOAttributes" :key="i" :prop="item.prop" :label="item.label">
    </el-table-column>
    <el-table-column label="状态">
        <template v-slot="scope">
            <el-switch v-model="scope.row.state" @change="changeIOState(scope.row.serial, scope.row.state)" active-text="打开" inactive-text="关闭"></el-switch>
        </template>
    </el-table-column>
  </el-table>
</div>
</template>
<script>
import { setIOState, getIOState } from '@rosc/common/utils/rpc/node_rpc'
import { getEmergencyStop } from '@rosc/common/utils/arm_state'
import { ElMessage } from 'element-plus'

export default {
  name: 'IOPage',
  data () {
    return {
      IOData: [
        { serial: 0, describle: 'IO端口0', state: false },
        { serial: 1, describle: 'IO端口1', state: false },
        { serial: 2, describle: 'IO端口2', state: false },
        { serial: 3, describle: 'IO端口3', state: false },
        { serial: 4, describle: 'IO端口4', state: false },
        { serial: 5, describle: 'IO端口5', state: false },
        { serial: 6, describle: 'IO端口6', state: false },
        { serial: 7, describle: 'IO端口7', state: false },
        { serial: 8, describle: 'IO端口8', state: false },
        { serial: 9, describle: 'IO端口9', state: false },
        { serial: 10, describle: 'IO端口10', state: false },
        { serial: 11, describle: 'IO端口11', state: false },
        { serial: 12, describle: 'IO端口12', state: false },
        { serial: 13, describle: 'IO端口13', state: false },
        { serial: 14, describle: 'IO端口14', state: false },
        { serial: 15, describle: 'IO端口15', state: false }
      ],

      IOAttributes: [
        { prop: 'serial', label: '序号' },
        { prop: 'describle', label: '信息' }
      ]
    }
  },

  activated () {
    this.initIOState()
  },
  methods: {
    changeIOState (serial, state) {
      const old_state = !state
      if (getEmergencyStop()) {
        this.IOData[serial].state = old_state
        ElMessage.error('机器人处于急停状态')
        return
      }
      // if (!getPower()) {
      //   this.IOData[serial].state = old_state
      //   ElMessage.error("未上电")
      //   return
      // }
      const new_state = state
      setIOState(serial, new_state)
      this.IOData[serial].state = new_state
    },
    async initIOState () {
      const IOState = await getIOState()
      for (const index in this.IOData) {
        this.IOData[index].state = IOState[index]
      }
    }
  }
}
</script>
