<template>
  <div class="header"></div>
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid @--color-border-light;
  width: 100%;
  height: var(--height-header);
  white-space: nowrap;

  .Dropdown {
    margin-right: 5px;
  }

  .Dropdown:hover {
    cursor: pointer;
  }

  .middle {
    display: flex;
    flex-grow: 1;
    -webkit-app-region: drag;
    justify-content: center;
    font-size: 11px;
  }

  .right {
    display: flex;
    .iconfont {
      margin: 0px 5px;
    }
  }
}
</style>
