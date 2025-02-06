<template>
  <view class="container">
    <view v-if="!hasLogin" class="empty need_login">
      <u-empty text="未登录" mode="permission">
        <button size="mini" slot="bottom" class="go-to-login" @click="goToLoginPage()">立即登录</button>
      </u-empty>
    </view>
    <template v-else>
      <view class="type_selector">
        <u-subsection class="selector" :list="statusList" @change="typeChange" active-color="#fff"
                      :current="form.status"
                      mode="subsection">
        </u-subsection>

      </view>
      <view class="search">

        <view class="search-box">

          <view class="input">
            <u-search :clearable="true" :show-action="true" :show-action-icon="true"
                      input-align="left" placeholder="备注查询"
                      v-model="form.keywords"
                      action-text="搜索"
                      @search="toSearch" @custom="toSearch"></u-search>
          </view>

        </view>
      </view>
      <view v-if="list.length > 0" class="scroll data-list">

        <view class="data-list" v-if="list.length > 0">
          <view class="data-item" v-for="(item, index) in list" :key="index">
            <view class="data-item-title">
              <text>账本：{{ item.cashbook_name||'无' }}</text>
              <text class="sn">
                {{ item.status_desc }}
              </text>
            </view>
            <view class="data-item-content">

              <view class="c-item">
                <text>提交时间：</text>
                {{ item.created_at }}
              </view>
              <view class="c-item">
                <text>提交账号：</text>
                <text>{{ item.user_account || '已注销' }} </text>

              </view>
              <view class="c-item">
                <text>账单笔数：</text>
                <text @click="toBillList(item)">{{ item.bill_count }} 笔</text>
                <u-icon @click="toBillList(item)" size="28" color="blue" name="arrow-right"></u-icon>
              </view>
              <view class="c-item">
                <text>备注：</text>
                {{ item.remark || '暂无备注' }}
              </view>
            </view>
            <view class="data-item-footer">
              <u-icon class="btn" @tap="toDetail(item)" size="46" name="edit-pen"></u-icon>
              <u-icon class="btn" v-if="item.is_owner" @tap="del(item)" size="46" name="trash"></u-icon>
            </view>
          </view>

        </view>
        <view class="empty" v-else>
          <u-empty text="暂无数据" mode="list"></u-empty>
        </view>

      </view>
      <view v-else class="empty">
        <u-empty text="暂无数据" mode="list"></u-empty>
      </view>

      <fab :is-show="hasLogin" icon_name="plus" :url="'/pages/packageA/baoxiao/form'"></fab>
    </template>
    <u-back-top :scroll-top="scrollTop"></u-back-top>

  </view>

</template>

<script>

import {get_list, remove} from "@/common/p_reimbursement";
import fab from "@/my-components/fab/index.vue";

export default {
  components: {
    fab
  },
  data() {
    return {
      scrollTop: 0,
      statusList: [
        '全部', '待审核', '已通过', '已驳回'
      ],
      list: [],
      form: {
        page: 0,
        limit: 20,
        keyword: ''
      }

    }
  },
  watch: {},

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
      that.get_list(true);
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
    this.get_list()
  },
  created() {
    console.log('created')

  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  methods: {
    toSearch() {
      this.form.page = 0
      this.get_list(true)
    },
    typeChange(index) {
      this.form.status = index;
      console.log(index)
      this.get_list(true)
    },

    del(item) {
      if (!item.is_owner) {
        uni.showToast({
          title: '只能删除自己创建的数据',
          icon: 'none'
        })
        return
      }
      let that = this
      uni.showModal({
        title: '',
        content: '确定删除吗？此操作不可恢复，请谨慎操作！',
        success: (res) => {
          if (res.confirm) {
            remove({
              id: item.id
            }).then(res => {
              this.$u.toast(res.msg);
              if (res.code == 0) {
                setTimeout(function () {
                  that.list.splice(that.list.indexOf(item), 1)
                }, 1000)
              }
            })
          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })
    },
    get_list(is_init) {
      if (!this.hasLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      if (is_init){
        this.form.page = 0
        this.list = []
      }
      this.form.page += 1
      get_list(this.form).then((res) => {
        if (res.code === 0 && res.data.list.length > 0) {
          this.list = this.list.concat(res.data.list)
        }
      })
    },


    toBillList(item) {
      uni.navigateTo({
        url: '/pages/packageA/baoxiao/form?id=' + item.id,
        fail: (re) => {
          console.log(' fail', re)
        }
      })
    },

    toDetail(item) {
      uni.navigateTo({
      url: '/pages/packageA/baoxiao/form?id=' + item.id,
        fail: (re) => {
          console.log(' fail', re)

        }
      })
    },

  }

}
</script>

<style lang="scss">
.container {
  .type_selector {
    width: 100%;
    background-color: $uni-theme-color;
    display: flex;
    justify-content: center;
    padding-bottom: 30rpx;

    .selector {
      width: 80%;
    }
  }

  .search-box{
    margin-top: 15rpx;
    margin-bottom: 10rpx;
    margin-left: 10rpx;
  }

  .data-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20rpx;
    border: 1px solid #eee;
    border-radius: 10rpx;
    padding: 20rpx;

    .data-item-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30rpx;
      font-weight: 600;
    }

    .data-item-title > text:first-child {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      flex: 1; /* 让标题占据剩余空间 */
    }

    .data-item-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 10px;

      .btn {
        margin-left: 10px;
      }
    }

    .sn {
      font-weight: normal;
      margin-left: 10px;
      margin-right: 10px;
      color: blue;
    }

    .data-item-content {
      word-break: break-word;
      color: rgba(111, 108, 108, 1);

      .c-item {
        padding-top: 10px;
      }
    }
  }
}

</style>
