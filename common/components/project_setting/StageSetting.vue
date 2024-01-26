<template>
  <div>
    <div>
      <span>选择要配置的站点：</span>
      <el-select v-model="aimStation" placeholder="选择要配置的站点">
        <el-option
          v-for="(item, index) in stationOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        type="primary"
        style="margin-left: 10px"
        @click="getStageSetting"
      >
        查询当前配置
      </el-button>
    </div>
    <div>
      <el-table class="bottom" stripe :data="settingItems" height="350">
        <el-table-column prop="attribute" label="属性" width="200" />
        <el-table-column prop="value" label="值" width="100">
          <template #default="scope">
            <el-input v-model="scope.row.value"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 20px">
      <el-button type="primary" @click="saveStageSetting">保存配置</el-button>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

import { getStageSetting, saveStageSetting } from '~common/utils/rpc/node_rpc'

export default {
  data() {
    return {
      stationOptions: [
        {
          value: 1,
          label: '01'
        },
        {
          value: 2,
          label: '02'
        },
        {
          value: 3,
          label: '03'
        },
        {
          value: 4,
          label: '04'
        },
        {
          value: 5,
          label: '05'
        }
      ],
      aimStation: null,
      settingItems: []
    }
  },
  methods: {
    async getStageSetting() {
      if (!this.aimStation) {
        ElMessage.error('请选择要查询的站点')
      }
      this.settingItems = []
      const res = await getStageSetting(this.aimStation)
      for (const item in res.setting_items) {
        const { attribute } = res.setting_items[item]
        let { value } = res.setting_items[item]
        if (attribute !== 'nslots') {
          value = parseFloat(value).toFixed(3)
        } else {
          value = parseInt(value, 10)
        }
        this.settingItems.push({
          attribute,
          value
        })
      }
    },
    async saveStageSetting() {
      await saveStageSetting(this.aimStation, this.settingItems)
    }
  }
}
</script>
