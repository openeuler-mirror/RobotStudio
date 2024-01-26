<template>
  <div>
    RPC配置
    <div>RPC开启：是</div>
    <div>
      RPC端口：
      <el-input v-model="rpcPort"></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rpcPort: 50051
    }
  }
}
</script>
