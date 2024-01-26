<template>
  <div class="bar">
    <div class="value">{{ value.angle }}</div>
    <el-button
      type="primary"
      class="reduce"
      @mousedown="moveStep(value.axis, -1, step)"
    >
      -
    </el-button>
    <el-button
      type="primary"
      class="increase"
      @mousedown="moveStep(value.axis, 1, step)"
    >
      +
    </el-button>
    <div class="joint">
      {{ value.joint }}
    </div>
    <div class="unit">{{ value.unit }}</div>
    <!-- <div class="joint">{{ value.velocity }}</div>
    <div class="velocity_unit">{{ value.velocity_unit }}</div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { ElMessage } from 'element-plus'
import { teachMoveStep } from '~common/utils/rpc/node_rpc'

export default {
  props: {
    value: Object,
    step: {
      type: Number,
      required: true,
      default: 0.001
    }
  },
  computed: {
    ...mapState({
      power: (state) => state.arm_state.power,
      servoState: (state) => state.arm_state.servoState
    })
  },

  methods: {
    async moveStep(axis, direction, jogStep) {
      if (!this.power) {
        ElMessage.error('未上电')
        return
      }
      if (this.servoState === 'Op') {
        ElMessage.error('机器人正在运动')
      } else {
        await teachMoveStep(axis, direction, jogStep)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bar {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  .value {
    text-align: right;
    font-size: 15px;
    width: 120px;
    margin-top: 10px;
    margin-right: 20px;
  }

  .reduce,
  .increase {
    font-size: 24px;
    height: 35px;
    width: 100px;
    margin-top: 10px;
  }

  .dikaer,
  .joint {
    width: 50px;
    text-align: left;
    margin-left: 20px;
  }

  .unit {
    text-align: left;
    width: 50px;
    font-size: 15px;
    margin-left: 5px;
  }

  // .velocity_unit {
  //   text-align: left;
  //   width: 100px;
  //   font-size: 15px;
  //   margin-left: 5px;
  // }
}
</style>
