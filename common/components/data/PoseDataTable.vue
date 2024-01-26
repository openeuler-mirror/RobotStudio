<template>
  <div style="height: 100%; overflow: auto">
    <el-table :data="poseData" style="width: 100%" border>
      <el-table-column prop="attribute" label="属性" width="100%" />
      <el-table-column prop="name" label="名称" width="200%" />
      <el-table-column prop="Elevation" label="Extension_L+" width="200%" />
      <el-table-column prop="Rotation" label="Extension_L-" width="200%" />
      <el-table-column prop="Extension_L" label="Extension_R+" width="200%" />
      <el-table-column prop="Extension_R" label="Extension_R-" width="200%" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deletePointbyName(scope.row.name)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      poseData: [
        {
          attribute: '内置数据',
          name: 'ZERO',
          Elevation: 0,
          Rotation: 0,
          Extension_L: 0,
          Extension_R: 0
        },
        {
          attribute: '用户数据',
          name: 'test',
          Elevation: 0,
          Rotation: 0,
          Extension_L: 0,
          Extension_R: 0
        }
      ]
    }
  }
}
</script>
