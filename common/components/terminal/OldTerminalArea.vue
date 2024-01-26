<template>
  <div id="TerminalArea" class="OldTerminalArea">
    <el-tabs
      v-model="currentTerminalName"
      editable
      :before-leave="beforeLeave"
      @edit="handleTabsEdit"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :label="tab.label"
        :name="tab.name"
        @click.right="rightClick(tab)"
      >
        <!-- @click.native.right="rightClick(tab) -->
        <!-- 当终端没有默认显示的时候，终端会无法渲染，怀疑是xterm的问题，各种尝试暂时使用keep-alive + v if 来解决 -->
        <keep-alive>
          <LocalTerminal
            v-if="
              currentTerminalName === tab.name && tab.terminalType === 'local'
            "
            :ref="tab.name"
          ></LocalTerminal>
        </keep-alive>
        <keep-alive>
          <SSHTerminal
            v-if="
              currentTerminalName === tab.name && tab.terminalType === 'ssh'
            "
            :ref="tab.name"
          ></SSHTerminal>
        </keep-alive>
        <keep-alive>
          <ReadOnlyTerminal
            v-if="
              currentTerminalName === tab.name && tab.terminalType === 'log'
            "
            :ref="tab.name"
          ></ReadOnlyTerminal>
        </keep-alive>
      </el-tab-pane>
      <el-tab-pane key="tabAction" class="add-button" name="tabAction">
        <template #label>
          <el-dropdown trigger="click" size="mini" @command="handleNewTerminal">
            <div
              style="
                width: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              +
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="local">本地终端</el-dropdown-item>
                <el-dropdown-item command="ssh">远程终端</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import electron, { remote } from 'electron'

import LocalTerminal from '~common/components/terminal/LocalTerminal'
import SSHTerminal from '~common/components/terminal/SSHTerminal'
import ReadOnlyTerminal from '~common/components/terminal/ReadOnlyTerminal'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  components: { LocalTerminal, SSHTerminal, ReadOnlyTerminal },
  data() {
    return {
      currentTerminalName: '', // 当前terminal，
      // 所有的tab
      tabs: [],
      resizeObserver: null //
    }
  },
  computed: {
    currentProjectConfig() {
      return getCurrentProjectConfig()
    }
  },
  mounted() {
    // 要加个延时，不然显示有问题，应该是el-tabs的问题
    setTimeout(() => {
      this.addTerminalTab(this.$utils.get_uuid(), '本地终端', 'local')
    }, 50)
    Object.values(this.$myTerminal.busEvent.EVENT).forEach(
      (terminalTypeKey) => {
        this.$myTerminal.eventBus.on(terminalTypeKey.toString(), (data) => {
          data = data ? data.toString() : ''
          if (!data) return
          this.ensureTerminalTabExist({
            name: terminalTypeKey,
            label: terminalTypeKey
          }).then(() => {
            this.currentTerminalName = terminalTypeKey
            this.$nextTick(() => {
              if (
                this.$refs[terminalTypeKey] &&
                this.$refs[terminalTypeKey][0]
              ) {
                // Blockly预览和编译结果每次生成内容之前都清空一下，保证看到的是最新的
                if (
                  terminalTypeKey === this.$myTerminal.busEvent.EVENT.BLOCKLY ||
                  terminalTypeKey === this.$myTerminal.busEvent.EVENT.RUN ||
                  terminalTypeKey ===
                    this.$myTerminal.busEvent.EVENT.ROBOT_SCRIPT
                ) {
                  this.$refs[terminalTypeKey][0].write('\r')
                  this.$refs[terminalTypeKey][0].clear()
                }
                this.$refs[terminalTypeKey][0].write(
                  data.replace(/\n/g, '\n\r')
                )
                this.$refs[terminalTypeKey][0].fit()
              }
            })
          })
        })
      }
    )
    this.resizeObserver = new ResizeObserver(() => {
      this.fit()
    })
    this.resizeObserver.observe(document.getElementById('TerminalArea'))
  },
  unmounted() {
    delete this.resizeObserver
  },
  methods: {
    /**
     * 终端右键事件
     */
    rightClick() {
      const menu = new remote.Menu()
      menu.append(
        new remote.MenuItem({
          label: '清空',
          click: () => {
            if (
              this.$refs[this.currentTerminalName] &&
              this.$refs[this.currentTerminalName][0]
            ) {
              this.$refs[this.currentTerminalName][0].clear()
            }
          }
        })
      )
      menu.append(
        new remote.MenuItem({
          label: '复制',
          click: () => {
            if (
              this.$refs[this.currentTerminalName] &&
              this.$refs[this.currentTerminalName][0]
            ) {
              electron.clipboard.writeText(
                this.$refs[this.currentTerminalName][0].$refs.xterm.selectedData
              )
            }
          }
        })
      )
      menu.append(
        new remote.MenuItem({
          label: '粘贴',
          click: () => {
            if (
              this.$refs[this.currentTerminalName] &&
              this.$refs[this.currentTerminalName][0]
            ) {
              this.$refs[this.currentTerminalName][0].$refs.xterm.write(
                electron.clipboard.readText()
              )
            }
          }
        })
      )
      menu.popup({
        window: remote.getCurrentWindow()
      })
    },
    /**
     * tabs编辑事件
     */
    handleTabsEdit(targetName, action) {
      if (action === 'remove') {
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].name === targetName) {
            this.tabs.splice(i, 1)
            break
          }
        }
        if (targetName === this.currentTerminalName) {
          this.currentTerminalName = null
          if (this.tabs.length > 0) {
            this.currentTerminalName = this.tabs[this.tabs.length - 1].name
          }
        }
      }
    },
    /**
     * 新增终端事件
     */
    handleNewTerminal(command) {
      switch (command) {
        case 'local':
          this.addTerminalTab(this.$utils.get_uuid(), '本地终端', 'local')
          break
        case 'ssh':
          this.addTerminalTab(this.$utils.get_uuid(), '远程终端', 'ssh')
          break
      }
    },
    /**
     * 确保log terminal tab已经存在并且已经渲染完成
     */
    ensureTerminalTabExist(terminalTab) {
      return new Promise((resolve) => {
        let exists = false
        for (const i in this.tabs) {
          if (this.tabs[i].name === terminalTab.name) {
            exists = true
          }
        }
        if (exists) resolve()
        else {
          this.addTerminalTab(terminalTab.name, terminalTab.label, 'log').then(
            () => {
              resolve()
            }
          )
        }
      })
    },
    /**
     * 所有终端适应布局
     */
    fit() {
      for (const i in this.tabs) {
        if (this.$refs[this.tabs[i].name] && this.$refs[this.tabs[i].name][0])
          this.$refs[this.tabs[i].name][0].fit()
      }
    },
    /**
     * 通过点击事件实现tab的动态按需渲染，不然ssh terminal会渲染失败，原因未知
     */
    tabClick() {
      this.$nextTick(() => {
        this.fit()
      })
    },
    /**
     * 点击新增终端的时候拦截
     */
    beforeLeave(newTabName) {
      if (newTabName === 'tabAction') {
        return false
      }
    },
    /**
     * 新增一个terminal
     * 为了保证ref的正常，用promise实现
     */
    addTerminalTab(tabName, terminalLabel, terminalType) {
      return new Promise((resolve) => {
        this.tabs.push({
          name: tabName,
          label: terminalLabel,
          terminalType
        })
        this.$nextTick(() => {
          this.currentTerminalName = tabName
          resolve()
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.OldTerminalArea {
  .el-tabs {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-tabs__header {
      margin: 0px;
      height: 30px;
      .el-tabs__new-tab {
        display: none;
      }
      .el-tabs__item {
        height: 30px;
        line-height: 30px;
        padding: 0px 20px !important;
      }
      .el-tabs__item:nth-last-child(1) {
        padding: 0px !important;
        .el-icon-close {
          display: none;
        }
      }
      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        line-height: 30px;
      }
    }
    .el-tabs__content {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      .el-tab-pane {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
