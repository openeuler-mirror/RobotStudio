<template>
  <div>
    <el-dialog v-show="visible" title="日志" center>
      <LogTable />
    </el-dialog>
  </div>
</template>

<script>
import LogTable from '~common/components/log/LogTable'
import { eventBus, busEvent } from '~common/utils/log'

export default {
  name: 'LogDialog',
  components: { LogTable },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
    this.initEventBus()
  },
  methods: {
    initEventBus() {
      eventBus.on(busEvent.EVENT.openLogDialog, () => {
        this.visible = true
      })
    }
  }
}
</script>
