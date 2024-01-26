<template>
  <div class="IDESettingDialog">
    <el-dialog v-show="IDESettingDialogVisible" title="设置" center>
      <div class="dialog">
        <div class="left">
          <el-tree :data="treeData" @node-click="onClickTree"></el-tree>
        </div>
        <div class="right">
          <component
            :is="currentTreeData.component"
            v-if="currentTreeData.component"
          ></component>
          <iconfont v-else icon-class="#ide" :size="100"></iconfont>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import LocalTerminal from '~common/components/ide_setting/LocalTerminal'

export default {
  components: {
    LocalTerminal
  },
  data() {
    return {
      IDESettingDialogVisible: false, // 对话框可见性
      currentTreeData: {},
      treeData: [
        {
          label: '终端',
          component: 'LocalTerminal'
        },
        {
          label: '主题',
          component: 'Theme'
        }
      ]
    }
  },
  mounted() {
    this.initEventBus()
  },
  methods: {
    initEventBus() {
      this.$myIDESetting.eventBus.on(
        this.$myIDESetting.eventBus.SHOW_DIALOG,
        () => {
          this.IDESettingDialogVisible = true
        }
      )
    },
    onClickTree(data) {
      this.currentTreeData = data
    }
  }
}
</script>

<style lang="less">
.IDESettingDialog {
  .dialog {
    display: flex;
    min-height: 500px;
    border-top: 1px solid var(--color-border-light);
    .left {
      width: 100px;
      border-right: 1px solid var(--color-border-light);
    }
    .right {
      flex: 1;
      padding: 10px;
      // @include flex;
    }
  }
}
</style>
