<template>
  <div class="log-table">
    <el-table
      :data="tableData"
      style="width: 100%"
      height="400"
      size="mini"
      @row-click="clickRow"
    >
      <el-table-column prop="time" label="时间" width="140"></el-table-column>
      <el-table-column
        prop="logType.label"
        label="类型"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="content"
        label="内容"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getLogs } from '~common/utils/log'
import { copyText } from '~common/utils/electron'

export default {
  data() {
    return {}
  },
  computed: {
    tableData: () => getLogs().reverse()
  },
  methods: {
    clickRow(row) {
      copyText(JSON.stringify(row))
    }
  }
}
</script>

<style lang="less" scoped>
.log-table {
  font-size: 12px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
