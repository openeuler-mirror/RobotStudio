<template>
  <div class="welcome">
    <div class="logo">
      <img src="/favicon.ico" alt="" style="width: 180px; height: 180px;">
      <div class="title">RobotStudio</div>
    </div>
    <div class="message">
      <div class="section">
        <div class="title">管理员</div>
        <div class="item uni-link" @click="openUserLogin=true" style="color: red">登录</div>
        <div class="item uni-link" @click="loginout" style="color: red">退出</div>
        <el-dialog v-model="openUserLogin" title="管理员登录">
        <el-form :model="user">
          <el-form-item label="管理员名">
            <el-input v-model="user.username">
            </el-input>
          </el-form-item>
          <el-form-item label="密 码">
            <el-input v-model="user.password" style="margin-left: 10px;" type="password" show-password />
          </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancelUserLogin()">取消</el-button>
              <el-button type="primary" @click="userLogin()">确定</el-button>
            </span>
          </template>
      </el-dialog>
      </div>
      <div class="section">
        <div class="title">开始</div>
        <div class="item uni-link" @click="newProject" style="color: red">新建项目</div>
        <div class="item uni-link" @click="goProjectList" style="color: red">所有项目</div>
      </div>
      <!-- <div class="section">
        <div class="title">链接</div>
        <div class="item uni-link" @click="$utils.open_external('http://ide.rosc.org.cn')">RobotStudio官网</div>
        <div class="item uni-link" @click="$utils.open_external('http://doc.ide.rosc.org.cn/overview/overview/')">RobotStudio用户手册</div>
        <div class="item uni-link" @click="$utils.open_external('http://discuss.rosc.org.cn')">机器人操作系统论坛</div>
        <div class="item uni-link" @click="$utils.open_external('http://www.rosc.org.cn/')">机器人操作系统项目官网</div>
        <div class="item uni-link" @click="$utils.open_external('https://acbot.net/#/')">机器人云平台官网</div>
      </div> -->
      <div class="section">
        <div class="title">帮助</div>
        <div class="item uni-link" @click="$utils.routeToNormalWindow('/version')">版本说明</div>
        <!-- <div class="item uni-link" @click="$utils.open_external('http://doc.ide.rosc.org.cn/overview/overview/')" style="color: red">用户手册</div>
        <div class="item uni-link" @click="$utils.open_external('http://ctl.rosc.org.cn/')">控制库文档</div>
        <div class="item uni-link" @click="$utils.open_external('http://ctldoc.rosc.org.cn/')">控制库API文档</div>
        <div class="item uni-link" @click="$utils.open_external('http://rpc.rosc.org.cn/')">RPC文档</div> -->
      </div>
      <!-- <div class="section">
        <div class="title">关于</div>
        <div class="item">机器人RobotStudio@ROSC
        </div>
      </div> -->
    </div>
    <div class="user">
      当前用户：{{ username }}
    </div>
  </div>
</template>

<script>
import { getCurrentInstance } from 'vue'
import {getAllUser, setUserState, setLoginUser} from '@rosc/common/utils/user'
import { ElMessage } from 'element-plus'

export default {
  data () {
    return {
      myProject: this.myProject,
      openUserLogin: false,
      user: {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    current_version () {
      return this.$store.state.update.current_version
    },
    check_success () {
      return this.$store.state.update.success
    },
    username() {
        return this.$store.state.user.loginUser.username
    }
  },
  methods: {
    // 检查更新
    update () {
      this.$utils.route_to('/update')
    },
    newProject() {
      // const user = getUser()
      // if (user.activateState === true) {
      //   this.myProject.newProjectSetting()
      // } else {
      //   ElMessage.error("请先登录！")
      // }
      this.myProject.newProjectSetting()
    },
    goProjectList() {
      // const user = getUser()
      // if (user.activateState === true) {
      //   this.$utils.routeToNormalWindow('/projectList')  
      // } else {
      //   ElMessage.error("请先登录！")
      // }
      this.$utils.routeToNormalWindow('/projectList')  
    },
    userLogin() {
      const user = getAllUser()
      for (const index in user) {
        if (user[index].username === this.user.username && user[index].password === this.user.password) {
          setUserState({id: user[index].id, userState: true})
          user[index].activateState = true
          setLoginUser(user[index])
          this.openUserLogin = false
          this.user.username = ''
          this.user.password = ''
          ElMessage.success("登陆成功！")
          return
        }
      }
      ElMessage.error("用户名或密码错误！")
    },
    cancelUserLogin() {
      const user = getAllUser()
      for (const index in user) {
        setUserState({id: user[index].id, userState: false})
      }
      this.openUserLogin = false
      this.user.username = ''
      this.user.password = ''
    },
    loginout() {
      const user = getAllUser()
      for (const index in user) {
        setUserState({id: user[index].id, userState: false})
      }
      const defaultUser = {
        id: -1,
        username: "",
        password: "",
        role: "",
        activateState: false
    }
      setLoginUser(defaultUser)
      this.openUserLogin = false
      this.user.username = ''
      this.user.password = ''
      ElMessage.success("用户退出！")
    }
  }
}
</script>

<style lang="less" scoped>
.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  font-size: 18px;

  .logo {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 50%;

    i {
      font-size: 100px;
      color: var(--color-primary);
    }

    .title {
      margin-top: 20px;
      font-size: 50px;
    }
  }

  .message {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin-top: 50px;
    flex-wrap: wrap;
    width: 100%;

    .section {
      width: 20%;
      .item {
        cursor: pointer;
      }
      .title {
        font-size: 30px;
        margin-bottom: 20px;
      }
    }
  }
  .user {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 15px;
  }
}
</style>
