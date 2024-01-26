<template>
  <div>
    <el-table :data="tableData" height="400">
      <el-table-column prop="time" label="时间" width="140"></el-table-column>

      <el-table-column
        prop="content"
        label="内容"
        width="500"
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <el-button
      type="primary"
      style="margin-left: 20px"
      @click="$utils.routeToNormalWindow('/welcome')"
    >
      退出
    </el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          time: '2024-1-26',
          content: '发布新版'
        }
      ]
    }
  }
}
</script>
