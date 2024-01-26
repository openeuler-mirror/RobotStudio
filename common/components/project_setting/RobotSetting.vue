<template>
  <div>
    <el-table :data="robotData">
      <el-table-column prop="attribute" label="属性" width="100" />
      <el-table-column prop="value" label="值" width="100" />
    </el-table>
  </div>
</template>

<script>
import { getRobotSetting } from '~common/utils/my_rpc'

export default {
  data() {
    return {
      robotData: [],
      attributeMap: {
        dof: '自由度',
        IO: '输入/输出',
        speed: '点动速度'
      }
    }
  },
  async mounted() {
    await this.getConfig()
  },
  methods: {
    async getConfig() {
      const setting = await getRobotSetting('device')
      const robotSetting = setting.device_setting
      for (const item in this.attributeMap) {
        if (item in robotSetting) {
          const data = {}
          data.attribute = this.attributeMap[item]
          data.value = robotSetting[item]
          this.robotData.push(data)
        }
      }
    }
  }
}
</script>
