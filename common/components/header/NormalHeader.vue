<template>
  <div class="NormalHeader">
    <!-- <Logo></Logo> -->
    <!-- <CommanDropdown></CommanDropdown> -->
    <div class="drag" style="white-space: nowrap">{{ title }}</div>
    <!-- <HeaderActoinBar></HeaderActoinBar> -->
  </div>
</template>

<script>
// import HeaderActoinBar from "common/components/header/HeaderActionBar"
// import CommanDropdown from "common/components/header/CommanDropdown"
// import Logo from "common/components/header/Logo"
import { getIDETitle } from '~common/utils/ide'

export default {
  components: {
    // CommanDropdown,
    // HeaderActoinBar,
    // Logo
  },
  data() {
    return {
      title: ''
    }
  },
  mounted() {
    this.title = getIDETitle()
  }
}
</script>

<style lang="less" scoped>
.NormalHeader {
  height: var(--height-header);
  display: flex;
  align-items: center;
  border-bottom: 1px solid @--color-border-light;
  font-size: 12px;
  .el-dropdown {
    height: 100%;
  }
  .drag {
    -webkit-app-region: drag;
    display: flex;
    justify-content: center;
    font-size: 11px;
    flex-grow: 1;
  }
}
</style>
