<template>
  <div @click="click()">
    <svg
      class="iconfont"
      aria-hidden="true"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <use :xlink:href="iconClass"></use>
    </svg>
  </div>
</template>

<script>
/**
 * 阿里图标库封装组件 开发时使用在线地址，更新../../public/index.html里面的style标签即可
 * 打包时把对应的js下载到本地，放到../assets/js/iconfont.js即可
 */
import '../assets/js/iconfont.js'

export default {
  name: 'IconFont',
  props: {
    /**
     * iconfont的类名称
     */
    iconClass: {
      type: String,
      required: true,
      default: ''
    },
    /**
     * 图标大小 px
     */
    size: {
      type: Number,
      default: 16
    }
  },
  emits: ['click'],
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  fill: currentColor;
  overflow: hidden;
  color: var(--color-primary);
}
</style>
