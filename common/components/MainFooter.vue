<template>
  <div class="fotter">
    <div style="display: flex">
      <div class="log" @click="openDialog">
        {{ lastLog.title }}:{{ lastLog.content }}
      </div>
      <div style="white-space: nowrap; text-align: center; margin-left: auto">
        {{ show_datetime }}
      </div>
    </div>
  </div>
</template>

<script>
import { getNowDatetimeStr } from '~common/utils/time'
import { getLastLog, eventBus, busEvent } from '~common/utils/log'

export default {
  data() {
    return {
      datetime: new Date(), // 当前日期
      datetime_timer: null // 定时任务timer
    }
  },
  computed: {
    // 当前页面路径
    current_path() {
      return this.$store.state.router.current_path
    },
    lastLog: () => getLastLog(),
    // 格式化当前日期
    show_datetime() {
      const day = `星期${'日一二三四五六'.charAt(this.datetime.getDay())}`
      return `${getNowDatetimeStr()} ${day}`
    }
  },
  mounted() {
    const that = this
    that.datetime_timer =
      (function () {
        that.datetime = new Date()
      },
      1000)
  },
  beforeUnmount() {
    if (this.datetime_timer) {
      clearInterval(this.datetime_timer)
    }
  },
  methods: {
    openDialog: () => {
      eventBus.emit(busEvent.EVENT.openLogDialog)
    }
  }
}
</script>

<style lang="less" scoped>
.fotter {
  font-size: 12px;
  width: 100%;
  border-top: 1px solid @--color-border-light;
  height: 20px;
  z-index: 999;

  .log {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
