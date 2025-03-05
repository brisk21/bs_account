<template>
  <view class="container">
    <fab :bg="bg" :is-show="hasLogin" icon_name="plus" :url="'/pages/budget/detail'"></fab>
    <view v-if="!hasLogin" class="empty need_login">
      <u-empty text="未登录" mode="permission">
        <button size="mini" slot="bottom" class="go-to-login" @click="toLogin()">立即登录</button>
      </u-empty>
    </view>
    <template v-else>
      <view class="search">
        <view class="search-box">
          <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                    input-align="left" placeholder="名称查询"
                    v-model="form.keywords"
                    action-text="搜索"
                    @search="toSearch" @custom="toSearch"></u-search>
        </view>
      </view>
      <view v-if="list.length > 0" class="scroll data-list">
      <view class="list" v-for="(item, index) in list" :key="index"
            @click="toDetail(item.budget_id)">
        <view class="item">
          <view class="title">
            {{ item.title }}
          </view>
          <view class="amount bs-item">
            预算额度：￥{{ item.amount }} 元
            <template v-if="item.in_amount>0 || item.out_amount>0">
              <text  class="view-list" @click.stop="to_detail(item.budget_id)">查看账单</text>
              <u-icon   name="arrow-right" size="30" color="#19a6de" @click.native.stop="to_detail(item.budget_id)"></u-icon>
            </template>
          </view>
          <view class="leave_amount bs-item">
            预算余额：￥ <text :class="item.leave_amount>=0?'bs_red':'bs_green'">{{ item.leave_amount }} 元</text>
            <text class="bs_red"> （{{ item.percent }}）</text>
          </view>
          <view class=" bs-item" v-if="item.type===20 || item.type===0">
            支出金额：￥ <text class="bs_green">{{ item.out_amount }} 元</text>
          </view>
          <view class=" bs-item" v-if="item.type===10 || item.type===0">
            收入金额：￥ <text class="bs_red">{{ item.in_amount }} 元</text>
          </view>
          <view class=" bs-item" v-if="item.ext_amount && item.type===10">
            额外收入：￥ <text class="bs_red">{{ item.ext_amount }} 元</text>
          </view>
          <view class=" bs-item" v-if="item.ext_amount && item.type===20">
            额外支出：￥ <text class="bs_green">{{ item.ext_amount }} 元</text>
          </view>

          <view class="profit  bs-item" v-if="item.type===0">
            收支差额：￥ <text :class="item.profit>=0?'bs_red':'bs_green'">{{ item.profit }} 元</text>
          </view>
          <view class="time  bs-item">
            时间：{{ item.time_set }}
          </view>
          <view class="remark  bs-item ">
           备注：{{ item.remark || '无'}}
          </view>
        </view>
      </view>
      <view class="no-more" v-if="no_more && form.page > 1">
        我也是有底线的！！！
      </view>
    </view>
    <view v-else class="empty">
      <u-empty text="暂无数据" mode="list"></u-empty>
    </view>

    </template>
    <u-back-top :scroll-top="scrollTop"></u-back-top>

  </view>

</template>

<script>
import api from "@/common/budget";
import fab from "@/my-components/fab/index.vue";
export default {
  components: {
    fab
  },
  data() {
    return {
      form: {
        keywords: '',
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
      total: 0,
      scrollTop: 0,
      no_more: false,
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
     this.getList(true)
  },
  onLoad(options) {
    console.log('onLoad')

  },
  created() {
    console.log('created')

  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    to_detail(id){
      uni.navigateTo({
        url: `/pages/index/list?budget_id=${id}`
      });
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
     await  api.budget_list(this.form).then(res => {
        if (res.code == 0) {
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
        url: `/pages/budget/detail?id=${id}`
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
  .bs_red{
    color: #ff0000;
  }
  .bs_green{
    color: green;
  }
  .no-more{
    text-align: center;
    margin: 20px auto;
  }


  // 自适应结束


  .header-icon {
    padding: 15rpx;
  }

  .search-box {
    margin: 10rpx;
  }

/* 整个列表的样式 */
.scroll.data-list {
  display: flex;
  flex-direction: column;
  padding: 10px;
}

/* 列表项的样式 */
.list {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
}

  .title,.bs-item{
    margin-bottom: 17rpx;
  }
/* 预算名称样式 */
.title {
  font-size: 18px;
  color: #333;
  font-weight: 400;

}

/* 预算金额样式 */
.amount {
  font-size: 14px;
  color: #20b4bc;
  .view-list{
    margin-left: 30rpx;
    color: #19a6de;
  }
}

/* 实际金额样式 */
.amount-real {
  font-size: 14px;

}

/* 时间样式 */
.time,.remark {
  font-size: 14px;
  color: #999;
}
}

</style>
