<template>
  <div id="ProjectWindow">
    <project-header @command="handleHeaderCommand"></project-header>
    <arm-state></arm-state>
    <splitpanes style="min-height: 400px;"  class="default-theme" horizontal>
      <pane size="80">
        <splitpanes>
          <pane size="15">
            <aside-menu ref="Aside"></aside-menu>
          </pane>
          <pane>
            <div id="codearea">
              <code-area ref="CodeArea" @onCodeAreaTabChange="onCodeAreaTabChange"></code-area>
            </div>
          </pane>
        </splitpanes>
      </pane>
    </splitpanes>
    <main-footer></main-footer>
    <project-setting-dialog></project-setting-dialog>
    <import-export-dialog></import-export-dialog>
    <log-dialog></log-dialog>
  </div>
</template>

<script>
import AsideMenu from '@rosc/common/components/AsideMenu'
import CodeArea from '@rosc/common/components/CodeArea'
import MainFooter from '@rosc/common/components/MainFooter'
import ProjectHeader from '@rosc/common/components/header/ProjectHeader'
import ProjectSettingDialog from '@rosc/common/components/project_setting/ProjectSettingDialog'
import ArmState from '@rosc/common/components/ArmState'
import LogDialog from '@rosc/common/components/log/LogDialog'
import { destoryRPCClient } from '@rosc/common/utils/rpc/node_rpc'
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

export default {
  name: 'ProjectWindow',
  components: { ProjectHeader, ArmState, AsideMenu, MainFooter, LogDialog, ProjectSettingDialog, CodeArea, Splitpanes, Pane },
  unmounted () {
    destoryRPCClient()
  },
  data () {
    return {
      currentCodeAreaTab: null, // 当前codearea区域的tab
      resizeObserver: null
    }
  },
  methods: {
    /**
     * 处理header事件
     */
    handleHeaderCommand (command) {
      switch (command) {
        case 'showTerminal':
          if (this.bottomDom.style.display === 'none') {
            this.bottomDom.style.display = 'inline'
          } else this.bottomDom.style.display = 'none'
          break
        case 'showAside':
          if (this.asideDom.style.display === 'none') {
            this.asideDom.style.display = 'inline'
          } else this.asideDom.style.display = 'none'
          break
      }
    },
    onCodeAreaTabChange (currentTab) {
      this.currentCodeAreaTab = currentTab
    }
  }
}
</script>

<style lang="less" scoped>
#ProjectWindow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.splitpanes__pane {
  background-color: white!important;
}
.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
}
.splitpanes--vertical > .splitpanes__splitter {
  min-width: 1px;
  width: 2px!important;
}

.splitpanes--horizontal > .splitpanes__splitter {
  min-height: 1px;
  height: 2px!important;
}
</style>
