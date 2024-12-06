<template>
  <view v-if="!hasLogin" class="no-login">
    <u-empty text="未登录" mode="permission">
      <button size="mini" slot="bottom" class="go-to-login" @click="goToLoginPage()">立即登录</button>
    </u-empty>
  </view>
  <view v-else class="container">
    <view class="search">
      <u-dropdown>
        <u-dropdown-item v-model="form.type" title="类型" :options="type" @change="set_type"></u-dropdown-item>
        <u-dropdown-item v-model="form.amount_type" title="收支方式" :options="amount_type"
                         @change="set_amount_type"></u-dropdown-item>
        <u-dropdown-item v-model="form.time_type"
                         :title="time_type_title"
                         :options="time_type" @change="set_time_type"></u-dropdown-item>
        <u-dropdown-item v-model="form.budget_id" title="预算" :options="budget_list"
                         @change="set_budget_type"></u-dropdown-item>
      </u-dropdown>


      <view class="search-box">
        <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                  input-align="left" placeholder="分类、收支类型、备注查询"
                  v-model="form.keywords"
                  action-text="搜索"
                  @search="toSearch" @custom="toSearch"></u-search>
      </view>
    </view>
    <view class="list">

      <view class="list-box" v-if="list.length > 0">
        <view class="data-item" v-for="(item,index) in list" :key="index">

          <view class="data-item-title">
            <text> {{ item.title }}</text>
            <text v-if="item.more_text" class="text-right view-chart"
                  @click="gotoPath('/pages/packageA/statistics/charts', true, form)">
              {{ item.more_text }}
            </text>
          </view>
          <u-table>
            <u-tr class="u-tr">
              <u-th class="u-th" v-for="(th,index1) in item.th" :key="index1">{{ th }}</u-th>
            </u-tr>
            <u-tr class="u-tr" v-for="(td,index2) in item.td" :key="index2">
              <u-td :class="'u-td' + ' '+(value.class||'') " v-for="(value,index3) in td" :key="index3">
                {{ value.label }}
              </u-td>
            </u-tr>
          </u-table>

        </view>
        <view class="tips">
          {{ readme }}
        </view>
      </view>
      <view class="no-data" v-else>
        <u-empty text="暂无数据" mode="list"></u-empty>
      </view>
    </view>
    <u-picker mode="time" v-model="show_date" :params="params"
              @confirm="confirmTime" @cancel="cancelTime" :mask-close-able="false"></u-picker>

    <u-calendar toolTip="选择时间范围" v-model="show_calendar" :mode="calendar_mode"
                @change="calendarChange"></u-calendar>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<script>
import api from "@/common/statistics";

export default {
  components: {},
  data() {
    return {
      readme: '默认查询三个月内数据',
      type: [
        {label: '全部', value: 0,},
      ],
      amount_type: [
        {label: '全部', value: ''}
      ],
      time_type: [
        {label: '全部', value: '',},
        {label: '按日历范围', value: 'calendar',},
        {label: '按年份筛选', value: 'year',},
        {label: '按月份筛选', value: 'month',},
      ],
      budget_list: [
        {label: '全部', value: ''}
      ],
      time_type_title: '时间',
      show_calendar: false,
      calendar_mode: 'range',
      form: {
        keywords: '',
        type: 0,
        budget_id: 0,
        month: '',
        year: '',
        time_type: '',
        amount_type: '',
        force: 0,
      },
      bg: {
        backgroundColor: '#42b479',
        color: "white"
      },
      is_fresh: false,
      is_pulling: false,

      list: [],
      total_amount: 0,
      total_income: 0,
      total_outcome: 0,
      diff_amount: 0,
      total: 0,
      scrollTop: 0,
      no_more: false,
      show_date: false, // 控制picker的显示
      params: {
        year: true, // 是否显示年
        month: true, // 是否显示月
      },
      startYear: 2000, // 起始年份
      endYear: new Date().getFullYear(), // 结束年份，设置为当前年份
    }
  },
  onPullDownRefresh() {
    console.log("下拉刷新")
    if (this.hasLogin && !this.is_fresh) {
      this.is_fresh = true;
      let that = this;
      this.form.year = ''
      this.form.month = ''
      this.form.time_type = ''
      this.time_type_title = '时间'
      this.form.keywords = ''
      this.form.budget_id = 0
      this.form.amount_type = ''
      this.form.force = true
      that.getList(true);
      setTimeout(function () {
        that.is_fresh = false;
        uni.stopPullDownRefresh()
      }, 1000)

    } else {
      setTimeout(() => {
        uni.stopPullDownRefresh()
      }, 500)

    }

  },
  onShow() {
    this.getList(true)
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onLoad() {
    this.get_search_config()

  },
  computed: {},
  methods: {

    get_search_config() {
      let that = this
      this.$u.api.bill_list_search({from: 'statistics'}).then(res => {
        //console.log(res)
        let data = res.data
        if (res.code == 0) {
          if (data.budget_list.length > 0) {
            that.budget_list = that.budget_list.concat(data.budget_list)
          }
          if (data.amount_type.length > 0) {
            that.amount_type = that.amount_type.concat(data.amount_type)
          }
          if (data.type.length > 0) {
            that.type = data.type
          }
          if (data.time_type.length > 0) {
            that.time_type = data.time_type
          }
        }

      })
    },

    cancelTime() {
      this.form.year = ''
      this.form.month = ''
      this.form.time_type = ''
      this.time_type_title = '时间'
      this.getList(true)
    },
    confirmTime(e) {
      if (this.form.time_type == 'month') {
        this.form.year = e.year
        this.form.month = e.month
        this.time_type_title = e.year + e.month
      } else if (this.form.time_type == 'year') {
        this.form.year = e.year
        this.form.month = ''
        this.time_type_title = e.year
      } else {
        this.form.year = ''
        this.form.month = ''
        this.time_type_title = '时间'
      }
      this.getList(true)
    },
    calendarChange(e) {
      this.form.time_type = 'range'
      this.form.start_time = e.startDate
      this.form.end_time = e.endDate
      this.getList(false)
    },

    set_type(value) {
      this.form.type = value
      this.getList(true)
    },
    set_amount_type(value) {
      this.form.amount_type = value
      this.getList(true)
    },
    set_budget_type(value) {
      this.form.budget_id = value
      this.getList(true)
    },
    set_time_type(value) {
      if (!value) {
        this.form.year = ''
        this.form.month = ''
        this.form.time_type = ''
        this.time_type_title = '时间'
        this.getList(true);
        return
      }
      this.show_date = false
      this.show_calendar = false
      if (value === 'month') {
        this.params = {year: true, month: true}
        this.form.time_type = value
        this.show_date = true
      } else if (value === 'year') {
        this.params = {year: true, month: false}
        this.form.time_type = value
        this.show_date = true
      } else {
        this.show_calendar = true
        this.time_type_title = '日历'
      }

    },

    toSearch() {
      this.getList(true)
    },
    async getList(is_init) {
      if (!this.hasLogin) {
        return
      }
      if (this.is_pulling) {
        return;
      }
      let that = this;
      this.list = []
      this.no_more = false
      this.is_pulling = true
      uni.showLoading({
        title: '数据加载中...',
      })
      await api.table_list(this.form).then(res => {
        let data = res.data
        if (res.code == 0) {
          this.list = data.table_data
          this.readme = data.readme
        }

      }).catch(() => {
      }).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(function () {
          that.form.force = 0
          that.is_fresh = false;
          that.is_pulling = false
          uni.hideLoading()
        }, 1000)
      })
    },
  },

}
</script>

<style lang="scss">
.no-login {
  width: 100%;
  height: 100vh;
  background-color: #f7f7f7;

  .go-to-login {
    border-radius: 10rpx;
    background: $uni-theme-color;
    color: #fff;
  }
}

.container {
  background-color: #ffffff;
  margin-bottom: 80rpx;

  .tips {
    margin-top: 15px;
    text-align: center;
    color: rgb(111, 108, 108)

  }

  .list {
    margin-top: 10px;
    padding: 10px 20px;

    .data-item {
      .data-item-title {
        margin-top: 10px;
        font-size: 30rpx;
        color: #666666;
        margin-bottom: 5rpx;
        display: flex;
        justify-content: space-between;

        .view-chart {
          color: #0658ee;

        }
      }

      .bs-red {
        color: red !important;
      }

      .bs-green {
        color: #089c08 !important;
      }

      .bs-gray {
        color: #999 !important;
      }
    }
  }
}
</style>
