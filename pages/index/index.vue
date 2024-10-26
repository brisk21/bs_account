<template>

  <view class="container">

    <view class="top">
<!--      <u-navbar
          :is-back="false"
          title="明细"
          :background="bg"
          title-bold
          title-color="white"
          :border-bottom="false"
      >
        <view slot="right">
          <u-icon name="order" size="larger" style="margin-right: 20px" class="search-icon" @click="toSearch()" ></u-icon>
        </view>

      </u-navbar>-->
      <view class="line">
        <view class="item">
          <view class="header-text"> {{ year }} 年</view>
        </view>
        <view class="item">
          <view class="header-text">收入
            <u-icon :name="eye.in ? 'eye' : 'eye-off'" class="setDisplay" @click="setDisplay('in')"></u-icon>

          </view>
        </view>
        <view class="item">
          <view class="header-text">支出<u-icon class="setDisplay" @click="setDisplay('out')" :name="eye.out ? 'eye' : 'eye-off'"> </u-icon></view>
        </view>
        <view class="item">
          <view class="header-text"> <u-icon name="order"   class="search-icon" @click="toSearch()" ></u-icon></view>
        </view>
      </view>
      <view class="line data">
        <view class="item">
          <view class="month-content">
            <view class="month-area" @click="clickDate">
              <view class="month font-2x">{{ month }}</view>
              <view class="month_str">月</view>
              <u-icon class="icon-area" name="arrow-down-fill" color="#fff" size="30"></u-icon>
            </view>
            <view class="bar"></view>
          </view>
        </view>
        <view class="item">
          <view class="font-2x">￥{{ cashflow.in }}</view>
        </view>
        <view class="item">
          <view class="font-2x">￥{{ cashflow.out }}</view>
        </view>
        <view class="item">
          <view class="font-2x"></view>
        </view>
      </view>
    </view>
    <view v-if="!hasLogin" class="empty need_login">
      <u-empty text="未登录" mode="permission">
        <button size="mini" slot="bottom" class="go-to-login" @click="toLogin()">立即登录</button>
      </u-empty>
    </view>
    <template v-else>
      <view v-if="cashflow.list.length > 0" class="scroll data-list">
        <scroll-view :refresher-enabled="false"  :scroll-y="true" class="scroll-view"
       scroll-into-view="top"  >
          <view>
            <view v-for="(item, index) in cashflow.list" :key="index">
              <view class="u-flex list-box">
                <view class="u-m-r-10 u-flex-1">
                  <view class="header-text"> {{ item.time }} {{ item.week }}</view>
                </view>
                <view class="u-m-r-10 u-flex-1">
                  <view class="header-text">收入 ￥{{ item.in }}</view>
                </view>
                <view class="u-m-r-10 u-flex-1">
                  <view class="header-text">支出 ￥{{ item.out }}</view>
                </view>
              </view>

              <view class="list-box-children" v-for="(item1, index1) in item.list" :key="index1"
                    @click="toDetail(item1.id)">
                <view class="u-flex icon">
                  <u-icon :name="item1.category.icon" color="#42b479"></u-icon>
                </view>
                <view class="box-left">
                  {{ item1.category.name }}
                </view>
                <view class="box-remark">
                  {{ item1.remark || '无' }}
                </view>
                <view class="u-flex-1 box-right amount-green" v-if="item1.type==20">
                  -￥{{ item1.amount }}
                </view>
                <view class="u-flex-1 box-right amount-red" v-else>
                  +￥{{ item1.amount }}
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view v-else class="empty">
        <u-empty text="暂无明细" mode="list"></u-empty>
      </view>
    </template>
    <fab></fab>
    <u-picker mode="time" v-model="picker_show" :params="picker_params" :default-time="picker_time"
              @confirm="pickerConfirm"></u-picker>

  </view>

</template>

<script>
import fab from '@/my-components/fab/index.vue'

export default {
  components: {
    fab
  },
  data() {
    return {
      bg: {
         backgroundColor: '#42b479',
         color:"white"
      },
      eye:{
        in:true,
        out:true
      },
      is_fresh: false,
      is_pulling: false,
      picker_params: {
        year: true,
        month: true,
        day: false,
        hour: false,
        minute: false,
        second: false
      },
      picker_show: false,
      picker_time: "",
      cashflow: {
        in: "0.00",
        list: [],
        out: "0.00"
      },
      year: "",
      month: ""
    }
  },
  onReady() {
    uni.pageScrollTo({
      scrollTop: 0, // 滚动到页面的目标位置（0表示顶部）
      duration: 0 // 滚动动画时长，设置为0则无动画直接跳转
    });
  },
  //下拉
  onPullDownRefresh() {
    console.log("下拉刷新")
    if (this.hasLogin && !this.is_fresh){
      this.is_fresh = true;
      let that = this;
      that.getList();
      setTimeout(function () {
        that.is_fresh = false;
        uni.stopPullDownRefresh()
      },1000)

    }else{
      setTimeout(()=>{
        uni.stopPullDownRefresh()
      },500)

    }

  },
  onShow() {
    console.log('onShow')
   this.init_data()
  },
  onLoad(options) {
    console.log('onLoad')
    this.init_data()
  },
  created() {
    console.log('created')
    this.init_data()

  },

  methods: {
    toSearch(){
      uni.navigateTo({
        url: '/pages/index/list'
      })
    },
    setDisplay(type){
      console.log(type)
      this.is_pulling = false;
      this.eye[type] = !this.eye[type]
      this.$u.api.setDisplay({type:type}).then((res)=>{
         //this.$u.toast(res.msg,500)
        if (res.code === 0){
          this.getList()
        }
      })
    },

    init_data() {
       // 获取当前日期
      let currentDate = new Date();

      // 手动设置时区为UTC+8（假设中国标准时间）
      let chinaTimezoneOffset = 8 * 60; // 8 hours offset
      let chinaCurrentDate = new Date(currentDate.getTime() + chinaTimezoneOffset * 60 * 1000);

      // 格式化日期为 YYYY-MM-DD
      let formattedDate = chinaCurrentDate.toISOString().substring(0, 10);

      // 分割日期字符串
      let dateParts = formattedDate.split("-");

      // 确保日期字符串格式正确
      if (dateParts.length === 3) {
          // 提取年份和月份
          this.year = dateParts[0];
          this.month = dateParts[1];
      } else {
          console.error("日期格式错误");
          this.year = "";
          this.month = "";
      }

      // 构造 picker_time 字段
       this.picker_time = `${this.year}-${this.month}`
       console.log(this.picker_time)
        this.getList()
    },

    clickDate() {
      this.picker_show = true;
    },
    cashflowReset() {
      this.cashflow = {
        in: "0.00",
        list: [],
        out: "0.00"
      }
    },
    pickerConfirm(e) {
      console.log(e)
      if (this.picker_params.year) this.year = e.year;
      if (this.picker_params.month) this.month = e.month;

      this.picker_time = this.year + "-" + this.month;
      this.getList()
    },


    getList() {
      this.cashflow = {
        in: "0.00",
        list: [],
        out: "0.00"
      }
      if (!this.hasLogin) {
        return
      }
      if (this.is_pulling){
        return;
      }
      let that = this;

      let cashbook_id = 1
      let year = Number(this.year)
      let month = Number(this.month)

      this.is_pulling = true
      uni.showLoading({
        title: '数据加载中...'
      })
      this.$u.api.getCashflowList(cashbook_id, year, month).then(res => {
        if (res.code ==0){
          this.cashflow = res.data
          this.eye = res.data.show_set
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

  .scroll-view {
    text-align: center;
    height: 100%;
  }

  // 自适应结束


  .header-icon {
    padding: 15rpx;
  }

  .list-box {
    padding: 18rpx 18rpx 18rpx 40rpx;
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
      width: 300rpx;
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
  }

  .data-list {
    position: relative;
    top: 176rpx;
    width: 100%;
    padding-bottom: 80px;
  }
  .empty {
    margin-top: 200px;
  }
}

.setDisplay{
  margin-left: 10rpx;
}
.go-to-login {
  border-radius: 10rpx;
  background: $uni-theme-color;
  color: #fff;
}

.top {
  position: fixed;
  top: var(NavigationBar, 44px); /* 使用计算属性，默认值为 44px */
  z-index: 99;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  height: 176rpx;

  .line {
    display: flex;
    color: #fff;
    background-color: $uni-theme-color;
    padding-left: 30rpx;
    padding-right: 30rpx;
    padding-bottom: 30rpx;


    &.data {
      padding-right: 20rpx;

      .item {
        flex: 1;
      }

      .font-2x {
        font-size: 40rpx;
      }

    }

    .item {
      flex: 1;
    }

    .header-text {
      font-size: 36rpx;
    }

    .bar {
      margin: 0;
      padding-left: 50rpx;
      border-right-width: 1px;
      border-right-style: solid;
      height: 50rpx;
      transform: scaleX(0.5);
      border-color: #fff;
    }

    .month-content {
      display: flex;

      .month-area {
        display: flex;
        // align-items: flex-end;
        align-items: center;
      }
    }
  }
}
</style>
