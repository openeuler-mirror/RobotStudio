<template>
<div class="exception">
    <div>筛选：
        <el-checkbox v-for="(item, index) in filterState" :key="index" v-model="filterState[index]"
         :label="ExceptionLevel[index]" @change="filterException(index)"/>
    </div>
    <div class="bottom" style="height: 100%; overflow: auto">
        <el-table :data="ExceptionData" height="81vh" border>
            <el-table-column prop="time" label="时间" width="250%" align="center"/>
            <el-table-column prop="statu_code" label="异常编码" width="100%" align="center"/>
            <el-table-column prop="exception_level" label="异常等级" width="150%" align="center"/>
            <el-table-column prop="message" label="异常信息"/>
        </el-table>
    </div>
</div>
</template>
<script>
import { getException, getExceptionLevel } from '@rosc/common/utils/exception'

export default {
  name: 'ExceptionPage',
  data () {
    return {
      backupData: [],
      ExceptionData: [],
      ExceptionLevel: ['全部', 'Warning1', 'Warning2', 'SeriousError1', 'SeriousError2', 'Fatal'],
      filterState: [true, true, true, true, true, true]
    }
  },

  mounted () {
    this.ExceptionLevel = getExceptionLevel()
  },
  activated () {
    this.initException()
  },
  methods: {
    // getExceptionData() {
    //   let data = []
    //   for (let index in this.backupData) {
    //     data.push(JSON.parse(JSON.stringify(this.backupData[index])))
    //   }
    //   return data
    // },
    async initException () {
      this.ExceptionData = await getException()
      // this.ExceptionData = this.getExceptionData()
      for (const index in this.ExceptionData) {
        this.ExceptionData[index].exception_level = this.ExceptionLevel[this.ExceptionData[index].level]
      }
    },
    flushException () {
      this.initException()
      const selected = []
      for (const item in this.ExceptionData) {
        if (this.filterState[this.ExceptionData[item].level]) {
          selected.push(JSON.parse(JSON.stringify(this.ExceptionData[item])))
        }
      }
      this.ExceptionData = selected
    },
    filterException (index) {
      if (index === 0 && this.filterState[index]) {
        for (const i in this.filterState) {
          this.filterState[i] = true
        }
        this.initException()
      } else if (index === 0) {
        for (const i in this.filterState) {
          this.filterState[i] = false
        }
        this.ExceptionData = []
      } else if (!this.filterState[index]) {
        this.filterState[0] = false
        this.flushException()
      } else if (this.filterState[index]) {
        let all = true
        for (const i in this.filterState) {
          if (i > 0) {
            all = all & this.filterState[i]
          }
        }
        if (all) {
          this.filterState[0] = true
          this.initException()
        } else {
          this.flushException()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.exception {
  .top {
    .left {
      .el-input {
        width: 90% !important;
      }

      .el-button {
        margin-left: 0;
      }
    }
  }

  .bottom {
    .el-textarea__inner {
      height: 100%;
    }
  }
}
</style>
