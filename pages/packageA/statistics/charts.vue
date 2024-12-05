<template>
  <view v-if="!hasLogin" class="no-login">
    <u-empty text="未登录" mode="permission">
      <button size="mini" slot="bottom" class="go-to-login" @click="goToLoginPage()">立即登录</button>
    </u-empty>
  </view>
  <view v-else class="container">
    <view class="header">
      <u-subsection :list="typeList" @change="typeChange" :animation="false" active-color="#ffffff"
                    :current="formData.type" mode="subsection" style="width: 200rpx;" height="60" font-size="25">
      </u-subsection>
      <view class="setting">
        <view class="setting-item" @click="gotoPath('/pages/packageA/statistics/set',true)">
          <u-icon name="setting" size="50"></u-icon>
        </view>
      </view>

    </view>
    <view class="charts">
      <view class="title">
        <text class="text" @click="datePicker.picker_show = true;show_box = false">
          按{{ formData.queryType === 0 ? '月' : '年' }}统计:
          <text>{{ datePicker.year }} 年</text>
          <text
              v-show="formData.queryType === 0">
            {{ datePicker.month }} 月
          </text>
        </text>
        <u-subsection class="query-type" :list="queryTypeList" @change="queryTypeListChange" :animation="false"
                      :active-color="scss.uniThemeColor" :current="formData.queryType" height="60" font-size="25">
        </u-subsection>
      </view>

      <view v-if="show_box && list.length > 0" class="chart-container">
        <qiun-data-charts class="chart-data"
                          v-for="(item,index) in list"
                          :key="index"
                          :type="item.type"
                          :opts="item.options"
                          :loading-type="loadingType"
                          :chart-data="item.chart_data"
                          :ontouch="true"
        />
      </view>
      <view class="no-data" v-else>
        <u-empty text="数据哪去了" mode="list"></u-empty>
      </view>

    </view>


    <u-picker mode="time" v-model="datePicker.picker_show" :default-time="datePicker.picker_time"
              :params="pickerParams" @confirm="pickerConfirm" z-index="99999" :mask-close-able="false"
              @cancel="show_box = true">
    </u-picker>
<!--    <view class="alert-tip">
      <u-alert-tips type="error" :show="show_tips" @close="closeStaticsTips" title="温馨提示"
                    :description="'右上角点击进去可以配置需要显示的统计哦'" close-able></u-alert-tips>
    </view>-->


  </view>
</template>

<script>
import scss from '@/uni.scss'
import dayjs from '@/dayjs.min.js'
import api from "@/common/statistics";
export default {
  components: {},
  data() {
    return {
      scss,
      list: [],
      show_box: true,
      show_tips: true,
      loadingType: 3,
      typeList: ['支出', '收入'],
      queryTypeList: ['月', '年'],
      datePicker: {
        picker_show: false,
        picker_time: "",
        year: "",
        month: "",
      },
      formData: {
        queryType: 0,
        type: 0,
      },
    }
  },
  onShow() {
    this.dateReset()
    this.getStatisticData()
  },
  onLoad(options) {
    let show_tips = uni.getStorageSync('statistics_tips');
    this.show_tips = !show_tips
  },
  computed: {
    pickerParams() {
      return {
        year: true,
        month: this.formData.queryType === 0,
        day: false,
        hour: false,
        minute: false,
        second: false
      }
    },
    userInfo() {
      return this.$store.getters.user
    },
  },
  methods: {
    closeStaticsTips() {
      console.log('close', this.show_tips)
      this.show_tips = false
      uni.setStorageSync('statistics_tips', 1);//避免重复弹窗
    },
    typeChange(index) {
      this.formData.type = index
      this.getStatisticData()
    },
    queryTypeListChange(index) {
      this.formData.queryType = index
      this.getStatisticData()
    },
    getStatisticData() {
      let that = this
      if (!this.hasLogin) {
        return
      }
      let params = {
        //cashbook_id: this.$store.getters.cur_cashbook.id,
        type: this.formData.type === 0 ? 20 : 10,
        query_type: this.formData.queryType === 0 ? 'month' : 'year',
        year: Number(this.datePicker.year),
      }

      if (this.formData.queryType === 0) {
        params.month = Number(this.datePicker.month)
      }
      uni.showLoading()
      this.show_box = false
      this.list = []
      this.loadingType = 3;
      api.charts_data(params).then(res => {
        uni.showLoading({
          title: '处理中...'
        })
        if (res.code == 0) {
          let that = this;
          this.list = res.data.list
        }
      }).finally(() => {

        setTimeout(function () {
          that.loadingType = 0
          uni.hideLoading()
          that.is_fresh = false;
          that.is_pulling = false
          that.show_box = true
        }, 1000)
      })
    },
    pickerConfirm(e) {
      this.show_box = true
      if (this.pickerParams.year) this.datePicker.year = e.year;
      if (this.pickerParams.month) {
        this.datePicker.month = e.month
        this.datePicker.picker_time = this.datePicker.year + "-" + this.datePicker.month + '-01';
      } else {
        this.datePicker.picker_time = this.datePicker.year + "-01-01";
      }
      this.getStatisticData()
    },
    dateReset() {
      let d = dayjs()
      this.datePicker = {
        picker_show: false,
        picker_time: d.format('YYYY-MM-01'),
        year: d.format('YYYY'),
        month: d.format('MM'),
      }
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

  .chart-container {
    .chart-data {
      margin-top: 50px;
      z-index: 100;
    }

  }

  .alert-tip {
    margin-top: 40rpx;
  }


  .no-data {
    margin-top: 30px;
  }

  .header {
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: space-between;

    background-color: $uni-theme-color;
    padding: 20px 20px 20px 20px;

    .setting {
      position: absolute;
      right: 20rpx;
      z-index: 10;
      color: white;
    }
  }

  .charts {
    width: 100%;

    .empty {
      margin-top: 200rpx;
    }

    .title {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-left: 15px;
      height: 40px;
      background-color: $uni-bg-color-grey;
      font-weight: normal;
      color: $uni-text-color;

      .text {
        font-size: $uni-font-size-base;
        color: $uni-text-color;
        flex: 1;
      }

      .query-type {
        margin-right: 10px;
        width: 200rpx;
      }
    }
  }

  canvas {
    z-index: 100 !important;
  }

  .u-datetime-picke {
    z-index: 99999;
  }

  .ad-container {
    margin-top: 60rpx;
  }
}
</style>
