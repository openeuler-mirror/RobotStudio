<template>
  <div class="CodeArea">
    <el-tabs
      v-model="currentTabName"
      type="card"
      closable
      :before-leave="beforeSwitchTab"
      @edit="handleTabsEdit"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.node.data.key"
        :label="tab.node.data.label"
        :name="tab.node.data.key"
      >
        <keep-alive>
          <component
            :is="tab.node.data.component"
            v-if="currentTabName == tab.node.data.key"
            :key="tab.node.data.key"
          ></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import IOArea from '~common/components/io/IOArea'
import ExceptionPage from '@/views/ExceptionPage'
import DataArea from '~common/components/data/DataArea'
import TeachPage from '@/views/TeachPage'
import LogoPage from '@/views/LogoPage'
import ProjectSettingPage from '@/views/ProjectSettingPage'
// import LayOutPage from '@/views/LayOutPage'
import SlaveStatePage from '@/views/SlaveStatePage'
import { TreeItemTypes } from '~common/components/AsideMenu'
import { codeAreaEventBus, codeAreaBusEvent } from '~common/utils/codearea'
import { getCurrentProjectConfig } from '~common/utils/my_project'

export default {
  components: {
    LogoPage,
    IOArea,
    ExceptionPage,
    DataArea,
    TeachPage,
    ProjectSettingPage,
    // LayOutPage,
    SlaveStatePage
  },
  emits: ['onCodeAreaTabChange'],
  data() {
    return {
      currentTabName: null, // 当前激活的tab name
      // 所有的tab，包含的属性有
      // node: 对应aside中tree的node
      // node.type是TreeItemTypes.FILE时存在以下属性:
      //   model:表示MonacoEdutor的model
      //   viewState:表示MonacoEditor的view state
      tabs: []
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    currentTab() {
      for (let i = 0; i < this.tabs.length; i += 1) {
        if (this.tabs[i].node.data.key === this.currentTabName) {
          return this.tabs[i]
        }
      }
    },
    TreeItemTypes() {
      return TreeItemTypes
    },
    currentProjectConfig() {
      return getCurrentProjectConfig()
    },
    /**
     * 所有的编程类型
     */
    codeTypes() {
      const store = useStore()
      return store.state.project_type.codeTypes
    }
  },
  mounted() {
    this.tabs.push({
      node: {
        data: {
          label: '欢迎使用',
          type: TreeItemTypes.PAGE,
          component: 'LogoPage',
          key: 'Logo'
        },
        parent: { data: { label: getCurrentProjectConfig().name } }
      }
    })
    this.currentTabName = 'Logo'
    this.initEventBus()
  },
  methods: {
    /**
     * 初始化总线事件
     */
    initEventBus() {
      codeAreaEventBus.on(codeAreaBusEvent.EVENT.OPEN_NODE, (node) => {
        this.openNode(node)
      })
      codeAreaEventBus.on(codeAreaBusEvent.EVENT.tryOpenTab, (tabName) => {
        this.switchTab(tabName)
      })
      codeAreaEventBus.on(
        codeAreaBusEvent.EVENT.UPDATE_TAB_LABEL,
        (targetName, newLabel) => {
          this.updateTabLabel(targetName, newLabel)
        }
      )
      codeAreaEventBus.on(codeAreaBusEvent.EVENT.REMOVE_TAB, (targetName) => {
        this.handleTabsEdit(targetName, 'remove')
      })
    },
    /**
     * 尝试切换到某个tab，如果tab没有打开的话就忽略
     * @return boolean 切换成功返回Ture，否则返回False
     */
    switchTab(tabName) {
      for (let i = 0; i < this.tabs.length; i += 1) {
        if (this.tabs[i].node.data.key === tabName) {
          this.currentTabName = this.tabs[i].node.data.key
          return true
        }
      }
      return false
    },
    // 处理tab事件
    handleTabsEdit(targetName, action) {
      if (action === 'remove') {
        this.currentTabName = null
        for (const i in this.tabs) {
          if (this.tabs[i].node.data.key === targetName) {
            this.tabs.splice(i, 1)
            break
          }
        }
        if (this.tabs.length > 0) {
          this.currentTabName = this.tabs[this.tabs.length - 1].node.data.key
        }
      }
    },
    /**
     * 根据tab的名字获取tab
     */
    getTabByName(tabName) {
      for (const i in this.tabs) {
        if (this.tabs[i].node.key === tabName) {
          return this.tabs[i]
        }
      }
    },
    openNode(node) {
      if (node.data && this.switchTab(node.data.key)) return
      if (node.data.type && node.data.type.key === TreeItemTypes.PAGE.key) {
        this.currentTabName = node.data.key
        this.tabs.push({
          node
        })
      }
      //  else if (node.data.type && node.data.type.key === this.TreeItemTypes.FILE.key) {
      //   let code = fs.readFileSync(node.data.filePath).toString()
      //   let language = ""
      //   switch (this.currentProjectConfig.codeType.key) {
      //   case this.codeTypes.COrCpp.key:
      //     language = "cpp"
      //     break
      //   case this.codeTypes.Script.key:
      //     language = ROBOT_SCRIPT.id
      //     break
      //   }
      //   let model = monaco.editor.createModel(code, language)
      //   let tab = {
      //     model: model,
      //     viewState: null,
      //     node: node,
      //   }
      //   this.currentTabName = node.data.key
      //   this.tabs.push(tab)
      // }
    },
    /**
     * 修改bar label
     */
    updateTabLabel(targetName, newLabel) {
      for (const i in this.tabs) {
        if (
          this.tabs[i].node &&
          this.tabs[i].node.data &&
          this.tabs[i].node.data.key === targetName
        ) {
          this.tabs[i].node.data.label = newLabel
          break
        }
      }
    },

    /**
     * 切换Tab前的钩子,切换model，载入viewState
     */
    beforeSwitchTab(newTabName, oldTabName) {
      const newTab = this.getTabByName(newTabName)
      const oldTab = this.getTabByName(oldTabName)
      if (oldTab && oldTab.node.data.type.key === TreeItemTypes.FILE.key) {
        oldTab.viewState = this.$refs.editor.editor.saveViewState()
      }
      if (newTab && newTab.node.data.type.key === TreeItemTypes.FILE.key) {
        this.$nextTick(() => {
          this.$refs.editor.editor.setModel(newTab.model)
          this.$refs.editor.editor.restoreViewState(newTab.viewState)
        })
      }
      this.$emit('onCodeAreaTabChange', newTab)
    }
  }
}
</script>
