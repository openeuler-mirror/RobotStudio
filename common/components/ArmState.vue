<template>
  <el-row class="ArmState">
    <el-col :span="5">
      <div>
        <i class="iconfont jixie" style="margin-right: 5px" />
        机器人{{ robotIndex }}
      </div>
    </el-col>
    <el-col :span="5">
      RPC: {{ isRPCConnected ? '已连接' : '未连接' }}
      <el-button
        v-if="!isRPCConnected"
        class="uni-button-2"
        @click="reconnectRPC"
      >
        重连RPC
      </el-button>
    </el-col>
    <el-col :span="5">
      <div v-if="servoState === 'ON'">
        已上电
        <el-button type="success" class="power-btn" :icon="Check" circle />
      </div>
      <div v-if="servoState === 'OFF'">
        未上电
        <el-button type="info" class="power-btn" :icon="Check" circle />
      </div>
      <div v-if="servoState === 'ERROR'">
        错误
        <el-button type="danger" class="power-btn" :icon="Check" circle />
      </div>
      <div v-if="servoState === 'Init'">
        初始
        <el-button type="info" class="power-btn" :icon="Check" circle />
      </div>
      <div v-if="servoState === 'Op'">
        运行
        <el-button type="warning" class="power-btn" :icon="Check" circle />
      </div>
      <div v-if="servoState === 'Idle'">
        空闲
        <el-button type="success" class="power-btn" :icon="Check" circle />
      </div>
      <div v-if="servoState === 'Enable'">
        使能
        <el-button type="primary" class="power-btn" circle />
      </div>
      <div v-if="servoState === 'EMC_STOP'">
        急停
        <el-button
          type="danger"
          class="flash animated infinite"
          style="height: 20px"
          :icon="Check"
          circle
        />
      </div>
    </el-col>
    <el-col :span="5">
      <el-button
        v-if="!enableEmergencyStop"
        type="danger"
        class="btn-emergecy"
        @click="emergencyStop()"
      >
        急停
      </el-button>
      <el-button
        v-else
        type="success"
        class="btn-emergecy"
        plain
        @click="emergency_recover()"
      >
        恢复
      </el-button>
    </el-col>
    <el-col :span="5">
      <el-tag class="ml-2" type="danger">异常: {{ getExceptionNumber }}</el-tag>
    </el-col>
  </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  isRPCConnected,
  reconnectRPC,
  emergencyStop,
  emergencyRecover
} from '~common/utils/rpc/node_rpc'
import { getExceptionNumber } from '~common/utils/exception'
import { setEmergencyStop } from '~common/utils/arm_state'

export default {
  name: 'ArmState',
  computed: {
    isRPCConnected: () => isRPCConnected(),
    getExceptionNumber: () => getExceptionNumber(),
    ...mapGetters('arm_state', ['servoState'])
  },
  data() {
    return {
      enableEmergencyStop: false, // 是否急停状态
      stream_exception_interval: null
    }
  },
  async mounted() {},
  async unmounted() {
    // this.stop_exception_stream()
  },
  methods: {
    reconnectRPC: () => reconnectRPC(),
    // 急停
    async emergencyStop() {
      await emergencyStop()
      this.enableEmergencyStop = true
      setEmergencyStop(true)
    },
    // 急停恢复
    async emergency_recover() {
      await emergencyRecover()
      this.enableEmergencyStop = false
      setEmergencyStop(false)
    }

    // start_exception_stream() {
    //   let client = getRPCClient()
    //   let call = client.GetStreamException({message: "get exception"})
    //   call.on("data", (resp) => {
    //     if (resp.level > 0) {
    //       let exception = {}
    //       exception.level = resp.level
    //       exception.time = resp.time
    //       exception.statu_code = resp.status_code
    //       exception.message = resp.message
    //       appendException(exception)
    //       ++this.exceptionNumber
    //     }
    //   })
    //   call.on("error", (err) => {
    //     console.log("流式获取异常错误：", err.toString())
    //   })
    //   this.stream_exception_interval = setInterval(() => {
    //     call.write({message: "get exception"})
    //   }, 1000)
    // },
    // stop_exception_stream() {
    //   let client = getRPCClient()
    //   let call = client.GetStreamException({message: "STOP"})
    //   call.write({message: "STOP"})
    //   clearInterval(this.stream_exception_interval)
    // }
  }
}
</script>

<style lang="less" scoped>
.ArmState {
  border-bottom: 1px solid @--color-border-light;
  padding: 0 10px;
  height: 30px;
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  .power-btn {
    margin-left: 10px;
    height: 15px;
  }
  .uni-button-2 {
    height: 26px;
  }
  .btn-emergecy {
    width: 150px;
    height: 26px;
  }
}

.red {
  background: red;
}

.green {
  background: #45cd45;
  color: white;

  .el-dropdown-selfdefine {
    background: #45cd45;
    color: white;
  }
}

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.flash {
  -webkit-animation-name: flash;
  animation-name: flash;
}

@-webkit-keyframes flash {
  /*只用修改这里就可以实现不同动画。例如大小闪烁transform: scale(.9);*/
  0%,
  0%,
  50% {
    opacity: 1;
    transform: scale(1);
  }
  25%,
  50% {
    opacity: 0.4;
    transform: scale(0.9);
  }
}

@keyframes flash {
  0%,
  0%,
  50% {
    opacity: 1;
    transform: scale(1);
  }

  25%,
  70% {
    opacity: 0.4;
    transform: scale(0.9);
  }
}
</style>
