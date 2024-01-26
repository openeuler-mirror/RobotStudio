<template>
  <div class="Project">
    <div class="projects">
      <div v-if="projectConfigs.length==0">
        <el-card shadow="hover" class="project-card">
          <div style="font-size: 20px; color:gray; margin-top: 20px; text-align:center;">暂无可用项目</div>
        </el-card>
      </div>
      <div v-else class="el-card" v-for="projectConfig in projectConfigs" :key="projectConfig.id" style="border: none">
        <el-card :key="projectConfig.id" class="project-card" shadow="hover">
          <template #header>
          <div class="header"  style="display: flex; align-items: center">
            <iconfont :iconClass="projectConfig.iconClass" :size="30"></iconfont>
            {{ projectConfig.name }}
            <div style="margin-left: auto">
              <el-link @click="open_project(projectConfig)">打开</el-link>
              <el-link style="color: red!important;margin-left: 15px;" @click="deletePoject(projectConfig)">删除</el-link>
            </div>
          </div>
          </template>
          <div class="card-content" @click="open_project(projectConfig)">
            <div v-if="projectConfig.type === projectTypes.ARM.type">机械臂类型：{{projectConfig.armType.name}}</div>
            <div v-if="projectConfig.ip">IP:{{ projectConfig.ip }}</div>
            <div v-if="projectConfig.codeType">编程方式：{{ projectConfig.codeType.key }}</div>
            <div v-if="projectConfig.rpc">RPC端口: {{ projectConfig.rpc.port }}</div>
            <div>创建时间：{{ projectConfig.createTime }}</div>
            <div>上次打开时间：{{ projectConfig.lastOpenTime }}</div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="buttons">
      <el-button type="primary" plain @click="myProject.newProjectSetting()">新建</el-button>
      <el-button @click="$utils.routeToStartPage()">关闭</el-button>
    </div>
  </div>
</template>

<script>

import { readAllDataFromFile } from '@rosc/common/utils/data'
import { initRobotRPCClient } from '@rosc/common/utils/rpc/node_rpc'
import { deleteProject, readAllProjectConfig, getAllProjectConfig, openProject } from '@rosc/common/utils/project'

export default {
  mounted () {
    readAllProjectConfig()
  },
  data () {
    return {
      myProject: this.myProject
    }
  },
  computed: {
    // 所有项目
    projectConfigs () {
      return getAllProjectConfig()
    },
    projectTypes () {
      return this.$store.state.project_type.projectTypes
    }
  },
  methods: {
    /**
     * 打开项目
     */
    open_project (projectConfig) {
      openProject(projectConfig.id)
      initRobotRPCClient(projectConfig)
      readAllDataFromFile()
      this.$utils.route_to('/project')
    },
    /**
     * 删除项目
     */
    deletePoject (projectConfig) {
      this.$confirm('删除项目', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteProject(projectConfig)
          // this.$message.success("删除成功")
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.Project {
  width: 100%;
  height: 100%;

  .el-card {
    display: flex;
    flex-direction: column;
    .el-card__body {
      display: flex;
      flex-grow: 1;
      padding: 0px;
    }
  }
  .buttons {
    position: fixed;
    bottom: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .projects {
    display: grid;
    grid-template-columns: repeat(auto-fill, 310px);
    justify-content: space-evenly;
    justify-items: center;

    .header {
      font-weight: 600;
      font-size: 18px;
    }
    .project-card {
      width: 300px;
      height: 190px;
      margin: 10px;
      .card-content {
        cursor: pointer;
        text-align: left;
        font-size: small;
        line-height: 18px;
      }
    }

  }
}
</style>
