<template>
  <router-view style="height: 100%"></router-view>
</template>

<script>
import { ElMessage } from 'element-plus'
import { mapState } from 'vuex'
import { setPower } from '@rosc/common/utils/arm_state'
import {
  powerOn,
  powerOff,
  teachMoveStep,
  isConnected,
  setRunningMode,
  reconnect,
  destoryRPCClient,
  clearMoveError
} from '@rosc/common/utils/my_rpc'
import { writeInfo } from '@rosc/common/utils/log'
import QWebChannel from './assets/js/qwebchannel'

export default {
  data() {
    return {
      key_value: -1,
      triggerFlag: false,
      clickEnable: true, // 示教器按键可用性控制，避免点击过快
      arrKeyCode: [],
      valueToKeyCode: {
        Jog: '112', // 112是F1键
        Home: '113', // 113是F2键
        Operation: '114', // 114是F3键
        Status: '115', // 115是F4键
        Position: '116', // 116是F5键
        Setting: '117', // 117是F6键
        Speed: '118', // 118是F7键
        ClearErr: '119', // 119是F8键
        // 指令: '120', // 120是F9键, 改为axis+
        // 伺服: '121', // 121是F10键，改为axis-
        Cancel: '122', // 122是F11键
        EnterGo: '123' // 123是F12键
      },
      keyCodeToValue: {
        112: 'Jog',
        113: 'Home',
        114: 'Operation',
        115: 'Status',
        116: 'Position',
        117: 'Setting',
        118: 'Speed',
        119: 'ClearErr',
        // 120: '指令',
        // 121: '伺服',
        122: 'Cancel',
        123: 'EnterGo'
      },
      runningMode: 'on',
      listenRunningModeInterval: null,
      switchSelectorValue: null, // 机器人运行模式
      qtWebBridge: null // qt和web通信的桥梁
    }
  },
  computed: {
    isConnected: () => isConnected(),
    // ...mapGetters("arm_state", ["servoState"], ""),
    ...mapState({
      power: (state) => state.arm_state.power,
      jogStep: (state) => state.arm_state.jogStep
    })
  },
  watch: {
    /**
     * 当旋钮的状态发生变化时，调用switchSelectorValue函数
     * @param {string} newValue 旋钮的状态，on或者off
     */
    switchSelectorValue(newValue) {
      setRunningMode(newValue)
      if (newValue === 'off') {
        reconnect()
      } else if (newValue === 'on') {
        destoryRPCClient()
      }
      // TODO: 可以在这里根据newValue的值，来切换不同的机器人运行模式
      // 添加更多内容在这里
    }
  },
  mounted() {
    // if (import.meta.env.VITE_APP_IS_ELECTRON !== 'true') {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    if (window.qt) {
      // eslint-disable-next-line no-new
      new QWebChannel(window.qt.webChannelTransport, (channel) => {
        this.qtWebBridge = channel.objects.qtWebBridge
        // 获得初始的机器人运行模式
        this.switchSelectorValue = this.qtWebBridge.switchSelectorValue
        // 当机器人运行模式发生变化时，通过回调函数更新switchSelectorValue
        this.qtWebBridge.switchSelectorValueChanged.connect((value) => {
          this.switchSelectorValue = value
        })
      })
    }
    // }
  },
  unmounted() {
    // if (import.meta.env.VITE_APP_IS_ELECTRON !== 'true') {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    // }
  },
  methods: {
    /**
     * 设置蜂鸣器的状态
     * @param {string} status on或者off，表示开或者关
     */
    setBuzzerStatus(status) {
      this.qtWebBridge.setBuzzerStatus(status)
    },
    /**
     * 获取旋钮的状态
     */
    getSwitchSelectorValue() {
      return this.qtWebBridge.switchSelectorValue
    },
    handleKeyDown(e) {
      // ElMessage.info(`按键：${e.code} ${e.keyCode} ${e.key}`)
      if (!isConnected) {
        ElMessage.error('检查示教器连接状态')
        return
      }
      // console.log(e.code, e.keyCode, e.key)
      // this.key_value = `按键：${e.code} ${e.keyCode} ${e.key}`
      if (this.arrKeyCode.length > 0) {
        // a-z的按键 长按去重
        if (this.arrKeyCode.indexOf(e.keyCode) >= 0) {
          return
        }
      }
      // 将按键放到arrKeyCode中，方便处理多个同时按键同时按下的情况，例如shift+s
      this.arrKeyCode.push(e.keyCode)
      this.keydown = this.arrKeyCode.join('+')
      // 监听按键捕获
      switch (this.keydown) {
        case this.valueToKeyCode.Jog:
          this.keydown = ''
          e.preventDefault() // 取消浏览器原有的操作
          this.$router.push('/jog_view')
          break
        case this.valueToKeyCode.Home:
          this.keydown = ''
          e.preventDefault() // 取消浏览器原有的操作
          this.$router.push('/home_view')
          break
        case this.valueToKeyCode.ClearErr:
          this.keydown = ''
          e.preventDefault() // 取消浏览器原有的操作
          clearMoveError()
          break
        // case this.valueToKeyCode.Speed:
        //   this.keydown = ''
        //   e.preventDefault() // 取消浏览器原有的操作
        //   console.log('speed')
        //   break
        // eslint-disable-next-line dot-notation
        // case this.valueToKeyCode['指令']:
        //   this.keydown = ''
        //   e.preventDefault() // 取消浏览器原有的操作
        //   this.$router.push('/command_view')
        //   break
        // case this.valueToKeyCode['伺服']:
        //   this.keydown = ''
        //   e.preventDefault() // 取消浏览器原有的操作
        //   this.$router.push('/servo_view')
        //   break
        default:
          this.tempHandleEvent(this.keydown)
          this.keydown = ''
          e.preventDefault() // 取消浏览器原有的操作
          break
      }
    },
    tempHandleEvent(keydownCode) {
      if (this.keyCodeToValue[keydownCode]) {
        this.key_value = `示教器按键：${keydownCode} ${this.keyCodeToValue[keydownCode]}`
      } else {
        this.key_value = `普通按键：${keydownCode}`
      }
    },
    handleKeyUp(e) {
      this.arrKeyCode.splice(this.arrKeyCode.indexOf(e.keyCode), 1)
      this.keydown = this.arrKeyCode.join('+')
      e.preventDefault()
    },

    // 向日志底部栏中写入
    write_log(msg) {
      writeInfo('示教', msg)
    },
    // 上电
    async powerOnClicked() {
      await powerOn()
      this.hasPowerOn = true
      setPower(true)
      this.write_log('上电')
    },
    // 下电
    async powerOffClicked() {
      await powerOff()
      this.hasPowerOn = false
      setPower(false)
      this.write_log('下电')
    },
    async teachMoveStepClicked(axis, direction, jogStep) {
      if (!this.power) {
        ElMessage.error('未上电')
        return
      }
      // if (this.clickEnable) {
      await teachMoveStep(axis, direction, jogStep)
      // click
    }
    // readFile(filePath) {
    //   // 创建一个新的xhr对象
    //   let xhr = null
    //   if (window.XMLHttpRequest) {
    //     xhr = new XMLHttpRequest()
    //   } else {
    //     // eslint-disable-next-line
    //   xhr = new ActiveXObject('Microsoft.XMLHTTP')
    //   }
    //   const okStatus = document.location.protocol === 'file' ? 0 : 200
    //   xhr.open('GET', filePath, false)
    //   xhr.overrideMimeType('text/html;charset=utf-8')
    //   xhr.send(null)
    //   ElMessage.info(
    //     '---------------status',
    //     xhr.status,
    //     ', text：',
    //     xhr.responseText
    //   )
    //   return xhr.status === okStatus ? xhr.responseText : null
    // }
    // async readRunningMode() {
    //   // let previousContent = null
    //   const file = '/sys/devices/platform/switch-selector/switch_selector_state'
    //   const fileReader = new FileReader()
    //   const url = fileReader.readAsDataURL(file)
    //   fileReader.onload = () => {
    //     ElMessage.info('---', fileReader.result)
    //   }
    //   ElMessage.info('===', url)
    //   // fetch(file)
    //   //   .then((response) => {
    //   //     if (response.ok) {
    //   //       // return response.text()
    //   //       ElMessage.info('---', response.text())
    //   //     }
    //   //     throw new Error('Failed to fetch the file.')
    //   //   })
    //   //   .then((fileContent) => {
    //   //     if (previousContent !== null && fileContent !== previousContent) {
    //   //       ElMessage.info('File content has changed.')
    //   //     }
    //   //     previousContent = fileContent
    //   //   })
    //   //   .catch((error) => {
    //   //     ElMessage.info('errors')
    //   //     console.error(error)
    //   //   })
    //   // ElMessage.info('---------------', content)
    //   // const reader = new FileReader()
    //   // reader.onload = () => {
    //   //   const currentMode = reader.result
    //   //   ElMessage.info('-->>', currentMode)
    //   //   console.log('---------------------------currentMode: ', currentMode)
    //   // }
    //   // const response = await fetch(file)
    //   // const blob = await response.blob()
    //   // reader.readAsText(blob)
    // }
    // startListenRunningMode() {
    //   this.listenRunningModeInterval = setInterval(() => {
    //     this.readRunningMode()
    //   }, 100)
    // }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
