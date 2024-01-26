<template>
  <div>
    <div>
      <span>IP地址：</span>
      <el-input
        v-model="addresses"
        style="width: 200px"
        placeholder="10.0.0.2/24"
      ></el-input>
    </div>
    <div style="margin-top: 20px">
      <span>网关：</span>
      <el-input
        v-model="gateway"
        style="width: 200px; margin-left: 15px"
        placeholder="10.0.0.1"
      ></el-input>
    </div>
    <div style="margin-top: 20px; margin-left: 120px">
      <el-button type="primary" @click="saveIPAddress">保存</el-button>
      <el-button type="danger" style="margin-left: 20px">取消</el-button>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { redifyControllerIP } from '~common/utils/rpc/node_rpc'
import {
  getCurrentProjectConfig,
  updateCurrentProjectConfig
} from '~common/utils/project'

export default {
  data() {
    return {
      addresses: null,
      gateway: null
    }
  },
  async mounted() {
    await this.getConfig()
  },

  activated() {
    // const config = getCurrentProjectConfig()
    // this.addresses = config.ip
  },
  methods: {
    async getConfig() {},

    isValidIPAddress(ipAddress) {
      // 定义 IP 地址的正则表达式
      const ipRegex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/

      // 使用正则表达式匹配检查
      return ipRegex.test(ipAddress)
    },
    saveIPAddress() {
      const index = this.addresses.indexOf('/')
      const ip = this.addresses.substr(0, index)
      const mask = this.addresses.substr(
        index + 1,
        this.addresses.length - index - 1
      )
      const maskNum = parseInt(mask, 10)
      if (maskNum === NaN || maskNum < 0 || maskNum > 32) {
        ElMessage.error('IP地址格式错误')
        return
      }
      if (
        this.getGatewayIPAddress(this.gateway, maskNum) !==
        this.getGatewayIPAddress(ip, maskNum)
      ) {
        ElMessage.error('IP地址格式错误')
        return
      }
      if (!this.isValidIPAddress(this.gateway) || !this.isValidIPAddress(ip)) {
        ElMessage.error('IP地址格式错误')
      }
      redifyControllerIP(this.addresses, this.gateway)
      const config = getCurrentProjectConfig()
      config.ip = ip
      updateCurrentProjectConfig(config)
    },
    getGatewayIPAddress(ipAddress, subnetMaskBits) {
      // 将 IP 地址和子网掩码转换为二进制表示
      const ipBinary = ipAddress
        .split('.')
        .map((part) => parseInt(part, 10).toString(2).padStart(8, '0'))
        .join('')
      const subnetMaskBinary = '1'.repeat(subnetMaskBits).padEnd(32, '0')

      // 计算网关 IP 地址的二进制表示
      const gatewayBinary =
        ipBinary.slice(0, subnetMaskBits) +
        subnetMaskBinary.slice(subnetMaskBits)

      // 将二进制转换为十进制，并格式化为 IP 地址字符串
      const gatewayIPAddress = gatewayBinary
        .match(/.{8}/g)
        .map((binary) => parseInt(binary, 2))
        .join('.')

      return gatewayIPAddress
    }
  }
}
</script>
