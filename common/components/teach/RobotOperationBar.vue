<template>
  <el-row type="flex" class="rbar" justify-content="start">
    <el-col :offset="12" :span="12">
      <el-button
        type="primary"
        style="height: 40px; width: 100px"
        @click="powerOnClicked()"
      >
        上电
      </el-button>
      <el-button
        type="primary"
        style="height: 40px; width: 100px"
        @click="powerOffClicked()"
      >
        下电
      </el-button>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { setPower } from '~common/utils/arm_state'
import { powerOn, powerOff } from '../../utils/my_rpc'
// import { writeInfo } from '../../utils/log'

function powerOnClicked() {
  powerOn()
    .then(() => {
      setPower(true)
      // writeInfo('示教', '上电')
    })
    .catch(() => {
      ElMessage.error('上电失败')
    })
}

function powerOffClicked() {
  powerOff()
    .then(() => {
      setPower(false)
      // writeInfo('示教', '下电')
    })
    .catch(() => {
      ElMessage.error('下电失败')
    })
}
</script>

<style scoped lang="less">
.rbar {
  margin-bottom: 5px;
  height: 35px;
}
</style>
