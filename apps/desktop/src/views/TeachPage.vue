<template>
  <div class="teach">
    <div class="top">
      <robot-operation-bar></robot-operation-bar>
    </div>
    <el-divider class="divider"/>
    <div class="bottom">
      <div style="height: 100%; width: 100%; display: flex">
        <div class="left">
          <RobotModelopenEulerRobot :joint="streamJoint" v-if="currentProjectConfig.armType.key === 'openEulerRobot'"></RobotModelopenEulerRobot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  teachSaveCurrentJoint, goTeachJoint, clearMoveError, teachGetRunType,
  teachMoveStep, teachSetVelocity, getVelocity, setSolenoid, calibrateWaferSensor,
  findZero
} from '@rosc/common/utils/rpc/node_rpc'
import { getPower } from '@rosc/common/utils/arm_state'
import AxisBar from '@rosc/common/components/teach/AxisBar'
import RobotModelopenEulerRobot from '@rosc/common/components/teach/RobotModelopenEulerRobot'
import { getDescribe } from '@rosc/common/utils/data'
import { getBuildInData } from '@rosc/common/utils/my_data'
import { writeInfo } from '@rosc/common/utils/log'
import { getCurrentProjectConfig } from '@rosc/common/utils/my_project'
import RobotOperationBar from '@rosc/common/components/teach/RobotOperationBar.vue'
import { ElMessage } from 'element-plus'
import { mapState } from 'vuex'
import { getUser } from '@rosc/common/utils/user'

export default {
  name: 'TeachPage',
  components: {
    AxisBar,
    RobotOperationBar,
    RobotModelopenEulerRobot
  },
  computed: {
    ...mapState({
      streamJoint: state => state.data.currentJoints,
      poseVelocity: state => state.data.poseVelocity,
      hasPowerOn: state => state.arm_state.power,
      servoState: state => state.arm_state.servoState,
      leftArm: state => state.data.currentLeftArm,
      rightArm: state => state.data.currentRightArm,
      axisCoor: state => state.data.axisCoor
    }),
    jogStep: {
      get () {
        return this.$store.state.arm_state.jogStep
      },
      set (value) {
        this.$store.commit('arm_state/setJogStep', value)
      }
    },
    ideSetting () {
      return this.$store.state.ide_setting.ideSettings
    },
    currentProjectConfig () {
      return getCurrentProjectConfig()
    },
    currentUser() {
      return getUser()
    }
  },
  async activated () {
    this.buildInData = getBuildInData(this.currentProjectConfig.armType.key)
    this.get_velocity()
    // const res = await getSolenoid()
    // this.solenoidValveStateR1 = res.solenoid_r1
    // this.solenoidValveStateR2 = res.solenoid_r2
    // this.startStream()
  },
  async deactivated () {
    // this.activeChange[0] = true
    // this.activeChange[1] = true
    // this.stopStream()
  },
  data () {
    return {
      activeName: '1', // 控制区域的激活面板name
      simulation: false, // 是否开启模拟
      moveJointName: '', // 点动的关节数据名称
      joint: [0, 0, 0, 0], // 当前机械臂关节角度,
      velocity_unit: ['mm/s', 'deg/s', 'mm/s', 'mm/s', 'mm/s'],
      stream_joint_interval: null, // RPC
      savePointVisible: false,
      zeroClibrateVisible: false,
      zeroClibrateAxis: 'F',
      pointInfo: {
        name: '',
        describe: '',
        arm: '',
        slot: 1,
        has_mid: 0
      },
      selectRightArm: false,
      selectArm: null,
      buildInData: null,
      selectName: '',
      speedLevel: null,
      speedLevelLabel: ['高速', '中速', '低速'],
      vacuumSpeedLevelLabel: ['高速', '中速', '低速', '示教速度'],
      cartesianDof: 3,
      cartesianName: ['X', 'Y', 'Z'],
      cartesianUnit: ['mm', 'mm', 'mm'],
      cartesianAxis: [7, 8, 9],
      solenoidValveIndexR1: 1,
      solenoidValveIndexR2: 0,
      waferSensorStage: null,
      calibrateWaferSensorFlag: false,
      waferSensorStageOptions: [
        {
          value: 1,
          label: 'C01'
        },
        {
          value: 2,
          label: 'C02'
        },
        {
          value: 3,
          label: 'C03'
        },
        {
          value: 4,
          label: 'C04'
        },
        {
          value: 5,
          label: 'C05'
        }
      ]
      // solenoidValveStateR1: null,
      // solenoidValveStateR2: null,
      // activeChange: [true, true]
    }
  },
  methods: {
    async findZero() {
      await findZero()
    },

    clearSelectArm() {
      this.selectArm = null
    },
    selectSuccess () {
      if (this.selectName) {
        this.pointInfo.name = this.selectName[this.selectName.length - 1]
        const dataType = this.selectName[0]
        this.pointInfo.describe = getDescribe(dataType)
      } else {
        this.pointInfo.name = ''
      }
    },

    changeSpeedLevel() {
      this.change_speed()
    },
    handleInputCount(number) {
      if (!number) {
        this.jogStep = 0.001
      } else {
        this.jogStep = number.toFixed(3)
      }
    },

    setSolenoid(index, value) {
      // if (!this.activeChange[index]) {
        setSolenoid(index, value)
      // } else {
      //   this.activeChange[index] = false
      // }
    },

    // 零点标定
    async zeroCalibration () {
      this.zeroClibrateVisible = false
      const axisNameMap = {
        L: 'R2(lower)',
        R: 'R1(upper)',
        S: 'Rotation',
        Z: 'Elevation',
        P: 'Flip',
        F: '全部'
      }
      await this.$confirm('确认重新标定' + axisNameMap[this.zeroClibrateAxis] + '轴示教零点？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const value = 'ZERO'
        // if(this.currentProjectConfig.armType.key === 'M122' || this.currentProjectConfig.armType.key === 'M124') {
        //   value = value + "_" + this.currentProjectConfig.armType.key
        // }
        
        await teachSaveCurrentJoint(value, '', this.zeroClibrateAxis, 1, 2, 0)
      })
    },
    // 保存点位
    async saveJoint () {
      if (!this.pointInfo.name) {
        ElMessage.error('名称不能为空')
      } else {
        this.savePointVisible = false
        const saveResult = await teachSaveCurrentJoint(this.pointInfo.name, this.pointInfo.describe, this.pointInfo.arm, this.pointInfo.slot, 0, this.pointInfo.has_mid)
        if (saveResult.code === 2) {
          this.$confirm('点位' + this.pointInfo.name + '已存在，是否更新数据？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            await teachSaveCurrentJoint(this.pointInfo.name, this.pointInfo.describe, this.pointInfo.arm, this.pointInfo.slot, 2, this.pointInfo.has_mid)
            // const saveJoint = saveResult.joints
            // writeJointData(this.pointInfo.name, saveJoint)
            this.pointInfo.name = ''
            this.pointInfo.describe = ''
            this.selectName = ''
            this.pointInfo.has_mid = 0
            this.pointInfo.arm = ''
          })
        } else {
          this.pointInfo.name = ''
          this.pointInfo.describe = ''
          this.selectName = ''
          this.pointInfo.has_mid = 0
          this.pointInfo.arm = ''
        }
      }
    },
    cancelSaveJoint () {
      this.pointInfo.name = ''
      this.pointInfo.describe = ''
      this.selectName = ''
      this.savePointVisible = false
    },
    // 获得当前示教速度
    async get_velocity () {
      const data = await getVelocity()
      this.speedLevel = parseInt(data)
    },
    // 机械臂 回零运动
    async goHome () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      await goTeachJoint('HOME', 'F')
    },
    async clearError () {
      await clearMoveError()
      this.write_log('清除运动错误')
    },
    async get_simulation_mode () {
      const data = await teachGetRunType()
      this.write_log('机器人运行方式-' + data)
      this.simulation = data
    },
    // 改变示教速度
    async change_speed () {
      await teachSetVelocity(this.speedLevel)
      // await this.get_velocity()
    },

    async xAxisPositive () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      if (this.currentProjectConfig.armType.key === 'openEulerRobot' || this.currentProjectConfig.armType.key === 'M124') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
          ElMessage.error('请选择手臂')
          return
        }
        let axis = -1
        const direction = 1
        if (this.selectArm === 'right') {
          axis = 7
        } else {
          axis = 8
        }
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运动")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      } else if (this.currentProjectConfig.armType.key === 'KHVR1') {
        let axis = -1
        const direction = 1
        axis = 3
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运动")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      }
    },
    async xAxisNegative () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      if (this.currentProjectConfig.armType.key === 'openEulerRobot' || this.currentProjectConfig.armType.key === 'M124') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
          ElMessage.error('请选择手臂')
          return
        }
        let axis = -1
        const direction = -1
        if (this.selectArm === 'right') {
          axis = 7
        } else {
          axis = 8
        }
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      } else if (this.currentProjectConfig.armType.key === 'KHVR1') {
        let axis = -1
        const direction = -1
        axis = 3
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      }
    },
    async yAxisPositive () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      if (this.currentProjectConfig.armType.key === 'openEulerRobot' || this.currentProjectConfig.armType.key === 'M124') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
          ElMessage.error('请选择手臂')
          return
        }
        let axis = -1
        const direction = 1
        if (this.selectArm === 'right') {
          axis = 9
        } else {
          axis = 10
        }
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      } else if (this.currentProjectConfig.armType.key === 'KHVR1') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
          ElMessage.error('请选择手臂')
          return
        }
        let axis = -1
        const direction = 1
        axis = 4
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      }
    },
    async yAxisNegative () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      if (this.currentProjectConfig.armType.key === 'openEulerRobot' || this.currentProjectConfig.armType.key === 'M124') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
          ElMessage.error('请选择手臂')
          return
        }
        let axis = -1
        const direction = -1
        if (this.selectArm === 'right') {
          axis = 9
        } else {
          axis = 10
        }
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      } else if (this.currentProjectConfig.armType.key === 'KHVR1') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
          ElMessage.error('请选择手臂')
          return
        }
        let axis = -1
        const direction = -1
        axis = 4
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      }
    },
    async zAxisPositive () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      if (this.currentProjectConfig.armType.key === 'openEulerRobot' || this.currentProjectConfig.armType.key === 'M124') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
        ElMessage.error('请选择手臂')
        return
        } 
        let axis = -1
        const direction = 1
        axis = 0
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      } else if (this.currentProjectConfig.armType.key === 'KHVR1') {
        let axis = -1
        const direction = 1
        axis = 2
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      }
    },
    async zAxisNegative () {
      if (!getPower()) {
        ElMessage.error('未上电')
        return
      }
      if (this.currentProjectConfig.armType.key === 'openEulerRobot' || this.currentProjectConfig.armType.key === 'M124') {
        if (this.selectArm !== 'left' && this.selectArm !== 'right') {
        ElMessage.error('请选择手臂')
        return
        } 
        let axis = -1
        const direction = -1
        axis = 0
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      } else if (this.currentProjectConfig.armType.key === 'KHVR1') {
        let axis = -1
        const direction = -1
        axis = 2
        if (this.servoState === 'Op') {
          ElMessage.error("机器人正在运行")
          return
        } else {
          await teachMoveStep(axis, direction, this.jogStep)
        }
      }
    },
    cancleCalibrateWaferSensor() {
      this.calibrateWaferSensorFlag = false
      this.waferSensorStage = null
    },
    async calibrateWaferSensor() {
      if (!this.waferSensorStage) {
        ElMessage.error("请选择站点！")
        return
      }
      this.calibrateWaferSensorFlag = false
      await calibrateWaferSensor(this.waferSensorStage)
    },


    // 向日志底部栏中写入
    write_log (msg) {
      writeInfo('示教', msg)
    },
    /**
     * 启动流式传输获取关节
     */
    // startStream () {
    //   this.get_real_time_joint()
    // },
    // /***
    //  * 停止流式获取关节和笛卡尔
    //  */
    // stopStream () {
    //   clearInterval(this.stream_joint_interval)
    // },
    // // 获取实时机械臂关节角度
    // get_real_time_joint () {
    //   const client = getRPCClient()
    //   const call = client.TeachStreamGetJoint({ message: 'get joint' })
    //   call.on('data', (resp) => {
    //     if (resp.joints) {
    //       this.joint = []
    //       for (const index in resp.joints) {
    //         this.joint.push(parseFloat(resp.joints[index]).toFixed(3))
    //       }
    //     }
    //     resp = null
    //   })
    //   call.on('error', (err) => {
    //     console.log('流式关节获取错误：', err.toString())
    //   })
    //   this.stream_joint_interval = setInterval(() => {
    //     call.write({ message: 'get joint' })
    //   }, 100)
    // }
  }
}
</script>

<style lang="less" scoped>
.teach {
  .top {
    .left {
      .el-input {
        width: 90% !important;
      }

      .el-button {
        margin-left: 0;
      }
    }
    .right {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
  }

  .divider {
    margin: 10px auto 10px;
  }
  .bottom {
    display: flex;
    flex: 1;
    .el-textarea__inner {
      height: 100%;
    }

    .left {
      display: flex;
      align-items: center;
      height: 600px;
      width: 450px;
      margin: 15px 15px;
      border: 0.1px solid @--color-border-light;
    }

    .right {
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: flex-start;
      align-items: center;

      .move-button {
        width: 100px;
        height: 28px;
        border-radius: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }

      .collapse {
        width: 100%;
        height: 60%;

        .collapse-item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;

          .configs {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }

          .speed {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            padding: 0 15px 0 15px;
            .el-slider {
              margin-left: 20px;
              width: 90%;
            }
            .text {
              margin-top: 10px;
              text-align: center;
            }
          }
          .uni-button-2 {
            width: 200px;
            margin: 10px 10px;
          }
          .optionis {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
          }
        }
      }
    }
  }
}
</style>
