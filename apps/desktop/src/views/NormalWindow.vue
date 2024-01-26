<template>
  <div class="NormalWindow">
    <div class="bottom">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  computed: {},
  mounted () {}
}
</script>

<style lang="less" scoped>
.NormalWindow {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .bottom {
    display: flex;
    flex: 1;
  }
}
</style>
