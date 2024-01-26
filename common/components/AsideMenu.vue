<template>
  <div class="aside">
    <el-tree
      ref="tree"
      :data="treeData"
      node-key="key"
      default-expand-all
      :expand-on-click-node="false"
      @node-click="click_item"
      @node-contextmenu="rightClick"
    >
      <template #="{ node, data }">
        <span class="tree-node">
          <iconfont
            :icon-class="node.data.icon"
            :size="iconSize"
            style="margin-right: 5px"
          ></iconfont>
          <span>{{ data.label }}</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
import path, { join } from 'path'
import fs from 'fs'
import * as remote from '@electron/remote'
import { ElMessage } from 'element-plus'
import { getCurrentProjectCodeDir } from '~common/utils/code'
import { getCurrentProjectConfig } from '~common/utils/my_project'
import { closeProject, getAdvancedFunction } from '~common/utils/project'
import { codeAreaEventBus, codeAreaBusEvent } from '~common/utils/codearea'
import { getUser } from '~common/utils/user'

const fse = require('fs-extra')

const { Menu, MenuItem } = remote

export const TreeItemTypes = {
  // 普通的节点，点击无特殊事件
  NORMAL: {
    key: 'NORMAL'
  },
  // 页面，点击后打开一个页面（组件），对应页面属性为component
  PAGE: {
    key: 'PAGE'
  },
  // 文件,点击后打开文件
  FILE: {
    key: 'FILE'
  },
  // 文件夹，点击后展开文件夹
  DIRECTORY: {
    key: 'DIRECTORY'
  }
}

/**
 * 获取一个page类型的tree item
 * @param {String} key: 唯一KEY
 * @param {String} label: 对应显示的label
 * @param {String} component: 打开的组件名称
 * @param {String} icon: icon id
 */
function getPageTreeItem(key, label, component, icon) {
  return {
    key,
    label,
    component,
    icon,
    type: TreeItemTypes.PAGE
  }
}

// function getDirectoryTreeItem(key, label, icon) {
//   return {
//     key: key,
//     label: label,
//     icon: icon,
//     type: TreeItemTypes.DIRECTORY,
//   }
// }

/**
 * 所有可能的tree item
 * key不能重复
 */
export const TreeItems = {
  /**
   * 页面
   */
  TEACH: getPageTreeItem('TEACH', '示教', 'TeachPage', '#jiao'),
  DATAMANAGE: getPageTreeItem('DATA', '数据', 'DataArea', '#shuju1'),
  EXCEPTION: getPageTreeItem(
    'EXCEPTION',
    '异常',
    'ExceptionPage',
    '#rizhiyichang'
  )
  // ,
  // // IOMANAGE: getPageTreeItem("IOMANAGE", "IO", "IOPage", "#jiaju"),
  // IOMANAGE: getPageTreeItem('IOMANAGE', 'IO', 'IOArea', '#jiaju'),
  // PROJECT_SETTING: getPageTreeItem(
  //   'PROJECT_SETTING',
  //   '配置',
  //   'ProjectSettingPage',
  //   '#shezhi2'
  // ),
  // // LAYOUT: getPageTreeItem('LAYOUT', 'LayOut', 'LayOutPage', '#gaojigongneng'),
  // SLAVESTATE: getPageTreeItem(
  //   'SLAVESTATE',
  //   'SlaveState',
  //   'SlaveStatePage',
  //   '#zhuangtai'
  // )
  // CODE: getDirectoryTreeItem("CODE", "代码", "#daima"),
  // DATA: getPageTreeItem("DATA", "数据", "DataArea", "#shuju1"),
  // MONITOR: getPageTreeItem("MONITOR", "监控", "SystemState", "#xitongzhuangtai"),
  // TELEOPERATION: getPageTreeItem("TELEOPERATION", "遥操作", "Teleoperation", "#118"),
  // IMPEDANCE: getPageTreeItem("IMPEDANCE", "阻抗控制", "Impedance", "#tui"),
  // Status: getPageTreeItem("Status", "下位机", "Status", "#xinxi"),
  // Calibration: getPageTreeItem("calibration", "标定", "Calibration", "#biaoding"),
  // Webots: getPageTreeItem("WEBOTS", "开放数据", "Webots", "#fangzhenmoni-hebing"),
  // IDENTIFY: getPageTreeItem("IDENTIFY", "辨识", "Identify", "#fuzaijunhengBLB"),
  // CRAFT: getPageTreeItem("CRAFT", "工艺", "Craft", "#gongyi"),
  // Device: getPageTreeItem("Device", "设备", "Device", "#jiaju"),
  // ADVANCED: getPageTreeItem("ADVANCED", "高级", "Advanced", "#gaojigongneng")
}

export default {
  name: 'AsideMenu',
  data() {
    return {
      iconSize: 18,
      treeData: []
    }
  },
  computed: {
    // 当前连接
    currentProjectConfig() {
      return getCurrentProjectConfig()
    },
    projectTypes() {
      return this.$store.state.project_type.projectTypes
    },
    // 所有编程类型
    codeTypes() {
      return this.$store.state.project_type.codeTypes
    },
    ideSetting() {
      return this.$store.state.ide_setting.setting
    }
  },
  mounted() {
    this.updateJsTree()
    // this.loadCode()
    this.initEventBus()
  },
  methods: {
    initEventBus() {
      this.$myIDESetting.eventBus.on(
        this.$myIDESetting.busEvent.EVENT.CURRENT_PROJECT_CONFIG_CHANGED,
        () => {
          this.updateJsTree()
          console.log('update tree')
        }
      )
    },
    getNodeChain(node) {
      let chain = []
      let currentNode = node
      while (currentNode && currentNode.data.label) {
        chain.push(currentNode.data.label)
        currentNode = currentNode.parent
      }
      chain = chain.reverse()
      return chain
    },
    /**
     * 给定一个code的el tree的节点，获取这个路径的实际绝对路径
     * 首先通过node的parent不断向上寻找得到完整的el tree链，然后path join起来
     */
    getCodeAbsolutePath(node) {
      const nodeChain = this.getNodeChain(node)
      let codeAbsolutePath = getCurrentProjectCodeDir()
      // [项目名字,代码, ***, ***],从第二项开始拼接
      for (let i = 2; i < nodeChain.length; i++)
        codeAbsolutePath = path.join(codeAbsolutePath, nodeChain[i])
      return codeAbsolutePath
    },
    /**
     * 删除一个文件节点
     */
    deleteFileNode(node) {
      fse.removeSync(node.data.filePath)
      this.$refs.tree.remove(node)
      codeAreaEventBus.emit(codeAreaBusEvent.EVENT.REMOVE_TAB, node.data.key)
    },
    /**
     * 删除一个文件夹节点
     */
    deleteDirectoryNode(node) {
      // 如果正序删除，删除了第一个后第二个就变成了第一个，导致只能删除一半的数据，所以要从后往前删除
      for (let i = node.childNodes.length - 1; i > -1; i--) {
        if (node.childNodes[i].data.type.key === TreeItemTypes.DIRECTORY.key) {
          this.deleteDirectoryNode(node.childNodes[i])
        } else if (
          node.childNodes[i].data.type.key === TreeItemTypes.FILE.key
        ) {
          this.deleteFileNode(node.childNodes[i])
        }
      }
      fse.removeSync(node.data.path)
      this.$refs.tree.remove(node)
    },
    /**
     * 删除一个node
     */
    deleteNode(node) {
      this.$confirm(`删除${node.label}`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (node.data.type.key === TreeItemTypes.FILE.key)
            this.deleteFileNode(node)
          else if (node.data.type.key === TreeItemTypes.DIRECTORY.key)
            this.deleteDirectoryNode(node)
        })
        .catch(() => {})
    },
    /**
     * 重命名node
     */
    renameNode(node) {
      this.$prompt('', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          value = `${value}.${this.currentProjectConfig.codeType.suffix}`
          const oldAbsolutePath = node.data.filePath
          const newAbsolutePath = join(node.data.dir, value)
          if (fs.existsSync(newAbsolutePath)) {
            this.$message({
              type: 'error',
              message: '文件名重复'
            })
            return
          }
          node.data.label = value
          fs.renameSync(oldAbsolutePath, newAbsolutePath)
          codeAreaEventBus.emit(
            codeAreaBusEvent.EVENT.UPDATE_TAB_LABEL,
            node.data.key,
            value
          )
        })
        .catch(() => {})
    },
    /**
     * 获取一个文件的node节点
     * @param {String} dir: 所在文件夹
     * @param {String} fileName: 文件名
     */
    getFileNode(dir, fileName) {
      return {
        icon: this.currentProjectConfig.codeType.iconClass,
        label: fileName,
        key: this.$utils.get_uuid(),
        type: TreeItemTypes.FILE,
        dir,
        get filePath() {
          return path.join(this.dir, this.label)
        }
      }
    },
    /**
     * 获取一个文件夹的node节点
     */
    getDirectoryNode(directoryFullPath) {
      return {
        icon: '#wenjianjia',
        label: path.basename(directoryFullPath),
        path: directoryFullPath,
        key: this.$utils.get_uuid(),
        type: TreeItemTypes.DIRECTORY,
        children: this.recursiveListDir(directoryFullPath)
      }
    },
    /**
     * 打开项目，载入项目代码文件夹
     */
    loadCode() {
      // 兼容以后的多个项目的情况
      for (let i = 0; i < this.treeData.length; i++) {
        if (this.treeData[i].children) {
          for (let j = 0; j < this.treeData[i].children.length; j++) {
            if (this.treeData[i].children[j].key === TreeItems.CODE.key) {
              this.treeData[i].children[j].children = this.recursiveListDir(
                getCurrentProjectCodeDir()
              )
            }
          }
        }
      }
    },
    /**
     * 递归遍历文件夹，判断是文件夹还是文件，包装成el tree的格式返回
     */
    recursiveListDir(dir) {
      const list = []
      const items = fs.readdirSync(dir)
      items.forEach((item) => {
        const fullPath = path.join(dir, item)
        const stats = fs.statSync(fullPath)
        if (stats.isDirectory()) {
          list.push(this.getDirectoryNode(fullPath))
        } else {
          list.push(this.getFileNode(dir, item))
        }
      })
      return list
    },
    /**
     * 更新jsTree
     */
    updateJsTree() {
      this.treeData = this.getJsTreeData()
    },
    /**
     * 获取节点
     */
    getJsTreeData() {
      const treeData = {}
      const children = []
      for (const index in this.currentProjectConfig.armType.function) {
        children.push(
          TreeItems[this.currentProjectConfig.armType.function[index]]
        )
      }
      // children.push(TreeItems.TEACH)
      // children.push(TreeItems.DATAMANAGE)
      // children.push(TreeItems.IOMANAGE)
      // children.push(TreeItems.EXCEPTION)
      // children.push(TreeItems.PROJECT_SETTING)
      // children.push(TreeItems.INSTRUCTION)
      // children.push(TreeItems.OPERATEWAFER)
      // children.push(TreeItems.LAYOUT)
      // children.push(TreeItems.SLAVESTATE)
      // 添加公共属性
      Object.assign(treeData, {
        label: this.currentProjectConfig.name,
        icon: this.currentProjectConfig.iconClass,
        opened: true,
        children
      })
      return [treeData]
    },
    /**
     * tree node中新增文件夹节点
     */
    newDirectory(node) {
      this.$prompt('输入文件夹名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          const currentCodeDir = node.data.path || getCurrentProjectCodeDir()
          const directoryFullPath = path.join(currentCodeDir, value)
          if (fs.existsSync(directoryFullPath)) {
            this.$message({
              type: 'error',
              message: '文件夹名重复'
            })
            return
          }
          fse.ensureDirSync(directoryFullPath)
          // 添加子节点
          this.$refs.tree.append(this.getDirectoryNode(directoryFullPath), node)
        })
        .catch(() => {})
    },
    /**
     * tree node中新增文件节点
     */
    newFile(node) {
      this.$prompt('输入文件名(无后缀)', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          const fileName = `${value}.${this.currentProjectConfig.codeType.suffix}`
          const currentCodeDir = this.getCodeAbsolutePath(node)
          const fileFullPath = path.join(currentCodeDir, fileName)
          if (fs.existsSync(fileFullPath)) {
            this.$message({
              type: 'error',
              message: '文件名重复'
            })
            return
          }
          fse.ensureFileSync(fileFullPath)
          // 添加子节点
          this.$refs.tree.append(
            this.getFileNode(currentCodeDir, fileName),
            node
          )
        })
        .catch(() => {})
    },
    rightClick(event, data, node) {
      // 右键菜单
      const menu = new Menu()
      if (node.level === 1) {
        menu.append(
          new MenuItem({
            label: '关闭项目',
            click: () => {
              this.$utils.routeToNormalWindow('/projectList')
              // this.newFile(node)
              closeProject()
            }
          })
        )
        // menu.append(
        //   new MenuItem({
        //     label: '新建文件夹',
        //     click: () => {
        //       this.newDirectory(node)
        //     }
        //   })
        // )
      }
      // if (node.data.type && (node.data.type.key === TreeItemTypes.DIRECTORY.key || node.data.type.key === TreeItemTypes.FILE.key) && node.data.key !== TreeItems.CODE.key) {
      //   menu.append(
      //     new MenuItem({
      //       label: '删除',
      //       click: () => {
      //         this.deleteNode(node)
      //       }
      //     })
      //   )
      //   menu.append(
      //     new MenuItem({
      //       label: '重命名',
      //       click: () => {
      //         this.renameNode(node)
      //       }
      //     })
      //   )
      // }
      if (menu.items.length > 0) {
        menu.popup({
          window: remote.getCurrentWindow()
        })
      }
    },
    // 点击文件树
    click_item(data, node) {
      if (
        getAdvancedFunction()[getCurrentProjectConfig().armType.key] &&
        getAdvancedFunction()[getCurrentProjectConfig().armType.key].includes(
          data.key
        )
      ) {
        if (
          getUser() &&
          getUser().activateState &&
          getUser().role === 'admin'
        ) {
          node.expanded = !node.expanded
          codeAreaEventBus.emit(codeAreaBusEvent.EVENT.OPEN_NODE, node)
        } else {
          ElMessage.error('该功能需要登陆后才能使用')
        }
      } else {
        node.expanded = !node.expanded
        codeAreaEventBus.emit(codeAreaBusEvent.EVENT.OPEN_NODE, node)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.aside {
  overflow: hidden;

  .tree-node {
    flex: 0.3;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
  }

  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
