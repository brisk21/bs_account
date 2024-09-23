<template>
  <u-cell-group>
    <view v-if="tableData.length <= 0" class="empty">
        <u-empty text="暂无消息" mode="message"></u-empty>
      </view>
    <view>
      <u-cell-item :icon="icons[item.type]" v-for="(item,index) in tableData" :key="index" :title="item.title"
                 :label="item.content" :arrow="false" @click="viewInfo(item)">
      <u-badge v-show="item.read_time <= 0" :is-dot="true" :absolute="false" slot="right-icon"></u-badge>
    </u-cell-item>
    </view>


  </u-cell-group>
</template>

<script>
import {
  responseDataFormat,
  tableDefaultData
} from '@/common/tableDataHandle.js'

export default {
  data() {
    return {
      ...tableDefaultData(),
      hasMore: true,
      icons: {
        1: 'setting'
      }
    };
  },
  onPullDownRefresh() {
    this.queryParams.page = 1
    this.tableData = []
    this.getData()
  },
  onReachBottom() {
    if (!this.hasMore) {
      this.$u.toast('已经到底了')
      return
    }
    this.queryParams.page += 1
    this.getData()
  },
  created() {
    this.queryParams.page = 1
    this.getData()
  },
  methods: {
    getData() {
      this.$u.api.getNotificationList({
        ...this.queryParams,
      }).then(res => {
        uni.stopPullDownRefresh()
        if (res.code == 0) {
          this.pagination.total = res.data.total
          if (res.data.list.length) {
            this.tableData = this.tableData.concat(res.data.list);
          } else {
            this.hasMore = false;
          }
        }

      })
    },
    viewInfo(row) {
      row.read_at = true
      uni.navigateTo({
        url: `/pages/notification/info?id=${row.msg_id}`
      })
    }
  }
}
</script>

<style lang="scss">

</style>
