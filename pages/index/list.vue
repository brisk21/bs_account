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
          <u-dropdown-item v-model="form.type" title="类型" :options="type" @change="set_type"></u-dropdown-item>

          <u-dropdown-item v-model="form.time_type"
                           :title="time_type_title"
                           :options="time_type" @change="set_time_type"></u-dropdown-item>
          <u-dropdown-item v-model="form.sort" title="排序" :options="sort_list" @change="set_sort"></u-dropdown-item>
        </u-dropdown>

        <view class="search-box">
          <view class="search-more">
            <button size="mini" type="default" @click="show_search_box=true">高级搜索</button>
          </view>
          <view class="input">
            <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                      input-align="left" placeholder="分类、收支类型、备注查询"
                      v-model="form.keywords"
                      action-text="搜索"
                      @search="toSearch" @custom="toSearch"></u-search>
          </view>

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
            <u-td class="amount-red">{{ total_income }}</u-td>
            <u-td class="amount-green">{{ total_outcome }}</u-td>
            <u-td>{{ diff_amount }}</u-td>
          </u-tr>

        </u-table>
        <view class="list-box-children" v-for="(item, index) in list" :key="index"
              @click="toDetail(item.id)">

          <view class="u-flex  box-left box-left">
           <u-icon :name="item.category.icon" color="#42b479" size="32"></u-icon> {{ item.category.name }}
          </view>
          <view class="u-flex-1  box-left box-remark">
            {{ item.amount_type || '--' }}
          </view>
          <view class="u-flex-1  box-right amount-green" v-if="item.type===20">
            -￥{{ item.amount }}
          </view>
          <view class="u-flex-1  box-right amount-red" v-else>
            +￥{{ item.amount }}
          </view>
          <view class="u-flex-2 box-right item-date">
            {{ item.date }} <text v-if="item.is_cycle">（{{item.cycle_type}}）</text>
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

      <u-calendar toolTip="选择时间范围" v-model="show_calendar" :mode="calendar_mode"
                  @change="calendarChange"></u-calendar>

      <u-popup v-model="show_search_box" mode="center" width="90%" height="300px">
        <view class="search-popup">
<!--          <view class="line">
            <text class="popup_type">类型：</text>
            <u-tag
                v-show="form.type"
                :closeable="true"
                :text="form.type_name"
                @close="unsetType()"
                @click="openPopup('type')"
            ></u-tag>
            <u-button v-show="!form.type" @click="openPopup('type')" size="mini">选择类型</u-button>
          </view>-->
          <view class="line">
            <text class="popup_type">具体分类：</text>
            <u-tag
                v-show="form.category_id"
                :closeable="true"
                :text="form.category_name"
                @close="unsetCategory()"
                @click="openPopup('category')"
            ></u-tag>
            <u-button v-show="!form.category_id" @click="openPopup('category')" size="mini">选择分类</u-button>
          </view>
          <view class="line">
            <text class="popup_type">收支方式：</text>
            <u-tag
                v-show="form.amount_type"
                :closeable="true"
                :text="form.amount_type"
                @close="unsetAmountType()"
                @click="openPopup('amount_type')"
            ></u-tag>
            <u-button v-show="!form.amount_type" @click="openPopup('amount_type')" size="mini">选择方式</u-button>
          </view>
          <view class="line">
            <text class="popup_type">关联预算：</text>
            <u-tag :closeable="true"
                   v-show="!!form.budget_id"
                   :text="form.budget_title||'?'"
                   @click="openPopup('budget_list')"
                   @close="unsetBudget()"
            ></u-tag>

            <u-button v-show="!form.budget_id" @click="openPopup('budget_list')" size="mini">选择预算</u-button>
          </view>
          <view class="line">
            <text class="popup_type">关联账本：</text>
            <u-tag :closeable="true"
                   v-show="!!form.cashbook_id"
                   :text="form.cashbook_title||'未知?'"
                   @click="openPopup('cashbook')"
                   @close="unsetCashbook()"
            ></u-tag>

            <u-button v-show="!form.cashbook_id" @click="openPopup('cashbook')" size="mini">选择账本</u-button>
          </view>
          <view class="btn-list">
            <button size="mini" type="warn" class="action-btn u-border" @click="show_search_box = false">取消</button>
            <button size="mini" type="primary" class="action-btn  u-border" @click="toSearch">开始搜索</button>
          </view>
        </view>
      </u-popup>
      <type_popup
          ref="type_popup"
          @selected="handleTypeSelected"
          :filtered-list="popup_data_list"
          :path="popup_manager_path"
          :show_type="popup_show_type"

      ></type_popup>

    </template>
    <u-back-top :scroll-top="scrollTop"></u-back-top>

  </view>

</template>

<script>
import type_popup from "@/my-components/popup/type_popup.vue";

export default {
  components: {
    type_popup,
  },
  data() {
    return {
      show_search_box: false,
      popup_manager_path: '',
      popup_data_list: [],
      popup_show_type: 'grid',
      popup_current: '',
      sort_list: [
        {label: '默认', value: ''},
        {label: '金额降序', value: 'amount_desc'},
        {label: '金额升序', value: 'amount_asc'},
        {label: '日期降序', value: 'date_desc'},
        {label: '日期升序', value: 'date_asc'}
      ],
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
      cashbook_list: [
        {label: '全部', value: ''}
      ],
      category_list : [
        {label: '全部', value: 0,},
      ],
      time_type_title: '时间',
      show_calendar: false,
      calendar_mode: 'range',
      form: {
        keywords: '',
        category_id: 0,
        type: 0,
        type_name: '',
        budget_id: 0,
        budget_title: '',
        cashbook_id: 0,
        cashbook_title: '',
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
  watch: {
    'form.time_type'(val) {
      console.log(val, 'time_type')

    },
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
    if (options.budget_id) {
      this.form.budget_id = options.budget_id
    }
    if (options.cashbook_id) {
      this.form.cashbook_id = options.cashbook_id
    }
    this.get_search_config()
    this.getList()
  },
  created() {
    console.log('created')

  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    openPopup(type) {
      this.popup_current = type
      if (type === 'amount_type') {
        this.popup_manager_path = '/pages/packageA/amount_type/index'
        this.popup_data_list = this.amount_type
        this.popup_show_type = 'list'
      } else if (type === 'budget_list') {
        this.popup_manager_path = '/pages/budget/budget'
        this.popup_data_list = this.budget_list
        this.popup_show_type = 'list'
      } else if (type === 'cashbook') {
        this.popup_manager_path = '/pages/packageA/cashbook/index'
        this.popup_data_list = this.cashbook_list
        this.popup_show_type = 'list'
      } else if (type === 'category') {
        this.popup_manager_path = '/pages/setting/category'
        this.popup_data_list = this.category_list
        this.popup_show_type = 'grid'
      } else if (type === 'type') {
        this.popup_data_list = this.type
        this.popup_show_type = 'list'
      }
      this.$refs.type_popup.togglePopup();
    },
    handleTypeSelected(item) {
      //console.log(this.popup_current + '父组件接收到了:', item);
      try {
        if (this.popup_current === 'amount_type') {
          this.form.amount_type = item.value
        } else if (this.popup_current === 'budget_list') {
          this.form.budget_id = item.value
          this.form.budget_title = item.label || 'xxx'
          console.log(this.form.budget_title)
        } else if (this.popup_current === 'cashbook') {
          this.form.cashbook_id = item.value
          this.form.cashbook_title = item.label || 'xxx'
        } else if (this.popup_current === 'type') {
          this.form.type = item.value
          this.form.type_name = item.label || 'xxx'
        }else if (this.popup_current === 'category') {
          this.form.category_id = item.value
          this.form.category_name = item.label || 'xxx'
        }
      } catch (e) {
        console.log('err', e)
      }


    },
    unsetBudget() {
      this.form.budget_id = 0
      this.form.budget_title = ''
    },
    unsetCashbook() {
      this.form.cashbook_id = 0
      this.form.cashbook_title = ''
    },
    unsetCategory() {
      this.form.category_id = 0
      this.form.category_name = ''
    },
    unsetType() {
      this.form.type = ''
    },
    unsetAmountType() {
      this.form.amount_type = ''
    },
    setAmountType(item) {
      this.form.amount_type = item
    },


    get_search_config() {
      let that = this
      this.$u.api.bill_list_search().then(res => {
        console.log(res)
        let data = res.data
        if (res.code == 0) {
          if (data.budget_list.length > 0) {
            that.budget_list = that.budget_list.concat(data.budget_list)
          }
          if (data.cashbook_list.length > 0) {
            that.cashbook_list = that.cashbook_list.concat(data.cashbook_list)
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
          if (data.sort_list.length > 0) {
            that.sort_list = data.sort_list
          }
          if (data.category_list.length > 0){
            that.category_list = data.category_list
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
      console.log('选择的年月：', e);
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
    set_cashbook_id(value) {
      this.form.cashbook_id = value
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
      this.show_search_box = false
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

  .search-popup {
    padding-top: 20px;
    padding-left: 10px;
    height: 100%;

    .line {
      display: flex;
      flex-direction: row;
      margin-top: 10px;

    }

    .btn-list {
      display: flex;
      justify-content: space-evenly;
      margin-top: 50rpx;
      padding-right: 10px;
      flex-direction: row;
      flex-wrap: nowrap;
      align-content: center;
      align-items: center;
      .action-btn {
        width: 100%;
        border-radius: unset !important;
      }
    }
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
