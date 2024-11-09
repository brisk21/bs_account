<template>
  <view class="container">
    <view v-if="!hasLogin" class="empty need_login">
      <u-empty text="未登录" mode="permission">
        <button size="mini" slot="bottom" class="go-to-login" @click="toLogin()">立即登录</button>
      </u-empty>
    </view>
    <template v-else>
      <view class="search">
        <u-dropdown>
          <u-dropdown-item v-model="form.type" title="分类" :options="type" @change="set_type"></u-dropdown-item>
          <u-dropdown-item v-model="form.amount_type" title="收支方式" :options="amount_type"
                           @change="set_amount_type"></u-dropdown-item>
          <u-dropdown-item v-model="form.time_type"
                           :title="form.time_type==''?'时间':(form.time_type=='year'?form.year:form.year+form.month)"
                           :options="time_type" @change="set_time_type"></u-dropdown-item>
          <u-dropdown-item v-model="form.budget_id" title="预算" :options="budget_list"
                           @change="set_budget_type"></u-dropdown-item>
          <u-dropdown-item v-model="form.sort" title="排序" :options="sort_list" @change="set_sort"></u-dropdown-item>
        </u-dropdown>


        <view class="search-box">
          <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                    input-align="left" placeholder="分类、收支类型、备注查询"
                    v-model="form.keywords"
                    action-text="搜索"
                    @search="toSearch" @custom="toSearch"></u-search>
        </view>
      </view>
      <view v-if="list.length > 0" class="scroll data-list">
        <u-table>
          <u-tr>
            <u-th>笔数</u-th>
            <u-th>收入</u-th>
            <u-th>支出</u-th>
            <u-th>差额</u-th>
          </u-tr>
          <u-tr>
            <u-td>{{ total }}</u-td>
            <u-td>{{ total_income }}</u-td>
            <u-td>{{ total_outcome }}</u-td>
            <u-td>{{ diff_amount }}</u-td>
          </u-tr>

        </u-table>
        <view class="list-box-children" v-for="(item, index) in list" :key="index"
              @click="toDetail(item.id)">
          <view class="u-flex icon">
            <u-icon :name="item.category.icon" color="#42b479"></u-icon>
          </view>
          <view class="box-left">
            {{ item.category.name }}
          </view>
          <view class="box-remark">
            {{ item.amount_type || '' }}
          </view>
          <view class="u-flex-1 box-right amount-green" v-if="item.type==20">
            -￥{{ item.amount }}
          </view>
          <view class="u-flex-1 box-right amount-red" v-else>
            +￥{{ item.amount }}
          </view>
          <view class="u-flex-1 box-right item-date">
            {{ item.date }}
          </view>
        </view>
        <view class="no-more" v-if="no_more && list.length>10">
          我也是有底线的！！！
        </view>
      </view>
      <view v-else class="empty">
        <u-empty text="暂无明细" mode="list"></u-empty>
      </view>
      <u-picker mode="time" v-model="show_date" :params="params"
                @confirm="confirmTime" @cancel="cancelTime" :mask-close-able="false"></u-picker>
    </template>
    <u-back-top :scroll-top="scrollTop"></u-back-top>

  </view>

</template>

<script>
import budget from "@/common/budget";

export default {
  components: {},
  data() {
    return {
      sort_list: [
        {label: '默认', value: ''},
        {label: '金额降序', value: 'amount_desc'},
        {label: '金额升序', value: 'amount_asc'},
        {label: '日期降序', value: 'date_desc'},
        {label: '日期升序', value: 'date_asc'}
      ],
      type: [
        {label: '全部', value: 0,},
        {label: '收入', value: 10,},
        {label: '支出', value: 20,}
      ],
      amount_type: [
        {label: '全部', value: '',},
        {label: '支付宝', value: '支付宝',},
        {label: '微信', value: '微信',},
        {label: '银行卡', value: '银行卡',},
        {label: '信用卡', value: '信用卡',},
        {label: '现金', value: '现金',},
        {label: '其他', value: '其他',}
      ],
      time_type: [
        {label: '全部', value: '',},
        {label: '年份', value: 'year',},
        {label: '月份', value: 'month',},
      ],
      budget_list: [
        {label: '全部', value: ''}
      ],
      form: {
        keywords: '',
        type: 0,
        budget_id: 0,
        month: '',
        year: '',
        time_type: '',
        amount_type: '',
        sort: '',
        page: 0,
        limit: 20
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
  onReady() {
    uni.pageScrollTo({
      scrollTop: 0, // 滚动到页面的目标位置（0表示顶部）
      duration: 0 // 滚动动画时长，设置为0则无动画直接跳转
    });
  },
  //触底
  onReachBottom() {
    console.log("触底")
    if (this.hasLogin && !this.is_fresh) {
      this.is_fresh = true;
      let that = this;
      that.getList();
      setTimeout(function () {
        that.is_fresh = false;
      }, 300)

    }

  },

  //下拉
  onPullDownRefresh() {
    console.log("下拉刷新")
    if (this.hasLogin && !this.is_fresh) {
      this.is_fresh = true;
      let that = this;
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
    console.log('onShow')
  },
  onLoad(options) {
    console.log('onLoad')
    if (options.budget_id) {
      this.form.budget_id = options.budget_id
    }
    this.get_budget()
    this.getList()
  },
  created() {
    console.log('created')

  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {

    cancelTime() {
      this.form.year = ''
      this.form.month = ''
      this.form.time_type = ''
      this.getList(true)
    },
    confirmTime(e) {
      console.log('选择的年月：', e);
      if (this.form.time_type == 'month') {
        this.form.year = e.year
        this.form.month = e.month
      } else if (this.form.time_type == 'year') {
        this.form.year = e.year
        this.form.month = ''
      } else {
        return ''
      }
      this.getList(true)
    },
    set_type(value) {
      this.form.type = value
      this.getList(true)

    },
    set_amount_type(value) {
      this.form.amount_type = value
      this.getList(true)
    },
    set_sort(value) {
      this.form.sort = value
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
        this.getList(true);
        return
      }
      if (value === 'month') {
        this.params = {year: true, month: true}
      } else {
        this.params = {year: true, month: false}
      }
      this.form.time_type = value
      this.show_date = true
    },
    get_budget() {
      budget.budget_list({
        data_type: 'option'
      }).then(res => {
        if (res.code == 0 && res.data.list.length > 0) {
          this.budget_list = this.budget_list.concat(res.data.list)

        }
      })
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
      if (is_init) {
        this.form.page = 0
        this.list = []
        this.no_more = false
      }
      this.is_pulling = true
      this.form.page += 1
      uni.showLoading({
        title: '数据加载中...',
      })
      await this.$u.api.bill_list(this.form).then(res => {
        if (res.code == 0) {
          this.total_income = res.data.total_income
          this.total_outcome = res.data.total_outcome
          this.total = res.data.total
          this.diff_amount = res.data.diff_amount
          if (res.data.list.length > 0) {
            this.list = this.list.concat(res.data.list)
          } else {
            this.no_more = true
          }

        }

      }).catch(() => {
      }).finally(() => {
        uni.stopPullDownRefresh()
        setTimeout(function () {
          that.is_fresh = false;
          that.is_pulling = false
          uni.hideLoading()
        }, 1000)
      })
    },
    toDetail(id) {
      uni.navigateTo({
        url: `/pages/index/detail?id=${id}`
      });
    },
    toLogin() {
      this.goToLoginPage()
    }
  },

}
</script>

<style lang="scss">
.container {
  background-color: white;

  // scroll-view 通过flex 布局 自适应
  /* height: 100vh;*/
  display: flex;
  flex-direction: column;

  .scroll {
    flex: 1;
    overflow: scroll;
  }

  .need_login {
    margin-top: 45%;
    background: white;
  }


  // 自适应结束


  .header-icon {
    padding: 15rpx;
  }

  .search-box {
    margin: 10rpx;
  }

  .list-box {
    padding: 18rpx 18rpx 18rpx 40rpx;
  }

  .no-more {
    text-align: center;
    color: rgb(200, 196, 196);
    margin-top: 10rpx;
    margin-bottom: 10rpx;
  }

  .list-box-children {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: horizontal;
    -webkit-box-direction: normal;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    padding: 26rpx 32rpx;
    font-size: 28rpx;
    line-height: 50rpx;
    color: #606266;
    background-color: #fff;
    text-align: left;

    .icon {
      font-size: 50rpx;
      padding-right: 10rpx;
    }

    .box-icon {
      width: 50rpx;
      height: 50rpx;
      margin-right: 35rpx;
    }

    .box-left {
      width: auto;
      font-weight: 500;
      font-size: 28rpx;
    }

    .box-right {
      overflow: hidden;
      text-align: right;
      vertical-align: middle;
      color: #909399;
      font-size: 26rpx;

    }

    .amount-green {
      color: #42b479;
    }

    .amount-red {
      color: #ff0000;
    }

    .box-remark {
      font-weight: 500;
      width: 100rpx;
      margin-left: 50rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      -ms-text-overflow: ellipsis;
      display: -webkit-box;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      color: #c8c4c4;
    }

    .item-date {
      width: 100px;
    }
  }

  .data-list {
    position: relative;
    top: 0px;
    width: 100%;
  }

  .empty {
    margin-top: 200px;
  }
}

.go-to-login {
  border-radius: 10rpx;
  background: $uni-theme-color;
  color: #fff;
}

</style>
