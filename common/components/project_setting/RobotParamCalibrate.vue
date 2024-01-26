<template>
  <div>
    <div>
      <span>标定结果：</span>
      <el-input v-model="result" style="width: 300px"></el-input>
    </div>
    <div style="margin-top: 20px; margin-left: 120px">
      <el-button type="primary" @click="calibrateRobotParam">标定</el-button>
    </div>
  </div>
</template>

<script>
import { calibrateRobotParam } from '~common/utils/my_rpc'

export default {
  data() {
    return {
      result: null
    }
  },

  methods: {
    async calibrateRobotParam() {
      const res = await calibrateRobotParam()
      this.result = `${res.code}: ${res.message}`
    }
  }
}
</script>
