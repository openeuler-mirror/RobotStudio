<template>
  <div class="io-area">
    <el-tabs class="io-tabs" type="border-card" >
      <el-tab-pane ref="input" label="输入" name="input">
        <IOInput />
      </el-tab-pane>
      <el-tab-pane ref="output" label="输出" name="output">
        <IOOutput />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import IOInput from '~common/components/io/IOInput'
import IOOutput from '~common/components/io/IOOutput'

export default {
  name: 'IOArea',
  components: {
    IOInput,
    IOOutput
  }
}
</script>

<style lang="less" scoped>
.io-area {
  height: 100%;
  width: 95%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  .bottom {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  :deep(.el-tabs__item) {
    padding: 0, 0, 10px;
    color: #6b778c;
    font-size: 32px !important;
    height: 60px !important;
    font-weight: 600;
  }
}
</style>
