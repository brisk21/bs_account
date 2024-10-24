<template>
  <view v-if="!hasLogin" class="no-login">
    <u-empty text="未登录" mode="permission">
      <button size="mini" slot="bottom" class="go-to-login" @click="toLogin()">立即登录</button>
    </u-empty>
  </view>
  <view v-else class="container">
    <view class="header">
      <u-subsection :list="typeList" @change="typeChange" :animation="false" active-color="#ffffff"
                    :current="formData.type" mode="subsection" style="width: 200rpx;" height="60" font-size="25">
      </u-subsection>
    </view>
    <view class="charts">
      <view class="title">
        <text class="text" @click="datePicker.picker_show = true">
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

      <qiun-data-charts class="chart-data" v-if="chartPieData" type="pie" :opts="pieOpts" :loading-type="loadingType"
                        :chartData="chartPieData"/>

      <qiun-data-charts class="chart-data" v-if="chartBarData" type="column" :opts="chartBarOpts"
                        :loading-type="loadingType" :chartData="chartBarData"
                        :ontouch="true"
      />

    </view>


    <u-picker mode="time" v-model="datePicker.picker_show" :default-time="datePicker.picker_time"
              :params="pickerParams" @confirm="pickerConfirm">
    </u-picker>


    <!-- #ifdef MP-->
    <view class="ad-container" v-if="userInfo && userInfo.position.statistics_page">
      <ad-custom unit-id="adunit-8b8c1d986d8b9ff3" bindload="adLoad" binderror="adError"
                 bindclose="adClose"></ad-custom>
    </view>
    <!-- #endif -->


  </view>
</template>

<script>
import scss from '@/uni.scss'
import dayjs from '@/dayjs.min.js'

export default {
  components: {},
  data() {
    return {
      scss,
      pieOpts: {
        "title": {
          "text": ''
        },
        "legend": {
          "show": true,
          "position": "bottom",
          float: 'left'
        },
        "extra": {
          "pie": {
            "activeOpacity": 1,
            "border": false,
          },
        }
      },
      chartPieData: null,
      chartBarData: null,
      chartBarOpts: {
        update: true,
        enableScroll: true, // 启用横向滚动
        legend: {},
        xAxis: {
          disableGrid: true,
          type: 'grid',
          gridType: 'dash',
          itemCount: 7,//x轴单屏显示数据的数量，默认为5个
          scrollShow: true,//新增是否显示滚动条，默认false
          scrollAlign: 'left',//滚动条初始位置
          scrollBackgroundColor: '#F7F7FF',//默认为 #EFEBEF
          scrollColor: '#DEE7F7',//默认为 #A6A6A6
        },
        yAxis: {
          showTitle: true,
          padding: 10,
          data: [
            {
              title: '收支情况',
              min: 0
            }
          ]
        },
        extra: {
          column: {
            type: "stack",
            width: 30,
            activeBgColor: "#000000",
            activeBgOpacity: 0.08,
            labelPosition: "center"
          }
        }
      },
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
    typeChange(index) {
      this.formData.type = index
      this.getStatisticData()
    },
    queryTypeListChange(index) {
      this.formData.queryType = index
      this.getStatisticData()
    },
    getStatisticData() {
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
      uni.showLoading({
        title: '加载中...'
      })
      this.chartPieData = null
      this.chartBarData = null
      this.$u.api.getStatisticData(params).then(res => {
        this.loadingType = 3;
        if (res.code == 0) {
          let that = this;
          setTimeout(function () {
            if (res.data.category) {
              that.$nextTick(() => {
                that.chartPieData = res.data.category
              })
            }
            if (res.data.bar) {
              that.$nextTick(() => {
                that.chartBarData = res.data.bar
              })
            }
          },500)
        }
      }).finally(()=>{
        that.loadingType = 0
        uni.hideLoading()
      })
    },
    pickerConfirm(e) {
      if (this.pickerParams.year) this.datePicker.year = e.year;
      if (this.pickerParams.month) this.datePicker.month = e.month;
      this.datePicker.picker_time = this.datePicker.year + "-" + this.datePicker.month;
      this.getStatisticData()
    },
    dateReset() {
      let d = dayjs()
      this.datePicker = {
        picker_show: false,
        picker_time: d.format('YYYY-MM'),
        year: d.format('YYYY'),
        month: d.format('MM'),
      }
    },
    toLogin() {
      this.goToLoginPage()
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

  .chart-data {
    margin-top: 50px;
  }

  .header {
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: space-between;

    background-color: $uni-theme-color;
    padding: 20px 20px 20px 20px;
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

  .ad-container {
    margin-top: 60rpx;
  }
}
</style>
