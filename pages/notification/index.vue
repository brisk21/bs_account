<template>
  <view class="container">
    <view class="search-box">
      <view class="u-flex u-row-between" v-if="unread_count > 0">
        <view class="u-flex-sub" @click="toSearch('unread_count')">
          <text class="u-line-1">未读消息</text>
          <text class="u-text-red u-line-1 unread_count ">（{{ unread_count }}）</text>条
        </view>
      </view>
      <u-search v-model="queryParams.keyword" :placeholder="'请输入关键字'" :clearable="false" :show-action="true"
                :show-cancel-button="false" action-text="搜索" @search="toSearch" @custom="toSearch"></u-search>
    </view>
    <u-cell-group>
      <view v-if="tableData.length <= 0" class="empty">
        <u-empty text="暂无消息" mode="message"></u-empty>
      </view>
      <view class="data-list" v-else>
        <u-cell-item :title="'全部标记已读'+'('+unread_count+')'" @click="read_all()" v-if="unread_count > 0"></u-cell-item>
        <u-cell-item :icon="icons[item.type]" v-for="(item,index) in tableData" :key="index" :title="item.title"
                     :label="item.content" :arrow="false" @click="viewInfo(item)">
          <u-badge v-show="item.read_time <= 0" :is-dot="true" :absolute="false" slot="right-icon"></u-badge>
        </u-cell-item>
      </view>


    </u-cell-group>
  </view>

</template>

<script>
import api from "@/common/msg";

export default {
  data() {
    return {
      unread_count: 0,
      queryParams: {
        page: 1,
        unread: 0,
        keyword: '',
        page_size: 20
      },
      tableData: [],
      hasMore: true,
      icons: {
        1: 'setting'
      }
    };
  },
  onPullDownRefresh() {
    this.queryParams.page = 1
    this.hasMore = true
    this.queryParams.unread = 0
    this.queryParams.keyword = ''
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
    toSearch(type) {
      this.queryParams.page = 1
      if (type === 'unread_count') {
        this.queryParams.unread = 1
      }
      this.tableData = []
      this.getData()
    },
    read_all() {
      uni.showModal({
        title: '',
        content: '您确定要全部标记已读吗？',
        success: (res) => {
          if (!res.confirm) {
            return
          }
          api.read_all().then(res => {
            if (res.code == 0) {
              this.unread_count = 0
              this.queryParams.page = 1
              this.queryParams.unread = 0
              this.tableData = []
              this.getData()
            }
          })
        }
      })

    },
    getData() {
      api.get_list({
        ...this.queryParams,
      }).then(res => {
        uni.stopPullDownRefresh()
        if (res.code == 0) {
          this.unread_count = res.data.unread_count || 0
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
.container {
  padding-top: 5px;
  padding-bottom: 50upx;

  .search-box {
    padding: 10px;
  }
  .unread_count{
    color: red;
  }
}
</style>
