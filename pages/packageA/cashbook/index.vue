<template>
  <view class="container">
    <view v-if="!hasLogin" class="empty need_login">
      <u-empty text="未登录" mode="permission">
        <button size="mini" slot="bottom" class="go-to-login" @click="goToLoginPage()">请先登录</button>
      </u-empty>
    </view>
    <view v-else>
      <view class="data-list" v-if="list.length > 0">
        <view class="data-item" v-for="(item, index) in list" :key="index">
          <view class="data-item-title">
            <text>{{ item.name }}</text>
            <text class="sn">{{ item.cashbook_sn }}</text>
          </view>
          <view class="data-item-content">

            <view class="c-item">
              <text>创建时间：</text>
              {{ item.created_at }}
            </view >
            <view class="c-item">
              <text>用户数：</text> <text>{{ item.user_count }} 个</text>  <u-icon @click="toUserList(item)" size="28" color="blue" name="arrow-right"></u-icon>
            </view>
            <view class="c-item">
              <text>记账笔数：</text> <text>{{ item.bill_count }} 笔</text>  <u-icon @click="toBillList(item)" size="28" color="blue" name="arrow-right"></u-icon>
            </view>
            <view class="c-item">
              <text>备注：</text>
              {{ item.remark || '暂无备注' }}
            </view>
          </view>
          <view class="data-item-footer">
            <u-icon class="btn" v-if="item.is_owner" @tap="copy(item)" size="46" name="zhuanfa"></u-icon>
            <u-icon class="btn" @tap="toDetail(item)" size="46" name="edit-pen"></u-icon>
            <u-icon class="btn" v-if="item.is_owner" @tap="del(item)" size="46" name="trash"></u-icon>
          </view>
        </view>

      </view>
      <view class="empty" v-else>
        <u-empty text="暂无数据" mode="list"></u-empty>
      </view>
      <fab :is-show="hasLogin" icon_name="plus" :url="'/pages/packageA/cashbook/detail'"></fab>
    </view>

  </view>
</template>

<script>
import {get_list, remove} from "@/common/p_cashbook";
import fab from "@/my-components/fab/index.vue";

export default {
  components: {
    fab
  },
  data() {
    return {
      list: [],
      form: {
        page: 0,
        limit: 20,
        keyword: ''
      }
    };
  },
  onShow() {

  },
  onLoad() {
    this.list = []
    this.form.page = 0
    if (this.hasLogin) {
      this.get_list()
    }
  },
  onReachBottom() {
    this.get_list()
  },
  onPullDownRefresh() {
    this.list = []
    this.form.page = 0
    this.get_list()
    setTimeout(function () {
      uni.stopPullDownRefresh()
    }, 1000)
  },

  methods: {
    del(item) {
      if (!item.is_owner) {
        uni.showToast({
          title: '只能删除自己创建的账本',
          icon: 'none'
        })
        return
      }
      let that = this
      uni.showModal({
        title: '',
        content: '确定删除【' + item.name + '】吗？此操作不可恢复，请谨慎操作！',
        success: (res) => {
          if (res.confirm) {
            remove({
              cashbook_id: item.cashbook_id
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
    get_list() {
      if (!this.hasLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'none'
        })
        return
      }
      this.form.page += 1
      get_list(this.form).then((res) => {
        if (res.code === 0) {
          this.list = this.list.concat(res.data.list)
        }
      })
    },
    toUserList(item) {
      uni.navigateTo({
        url: '/pages/packageA/cashbook/user_list?cashbook_id=' + item.cashbook_id,
        fail: (re) => {
          console.log(' fail', re)
        }
      })
    },

    toBillList(item) {
      uni.navigateTo({
        url: '/pages/index/list?cashbook_id=' + item.cashbook_id,
        fail: (re) => {
          console.log(' fail', re)
        }
      })
    },

    toDetail(item) {
      uni.navigateTo({
        url: '/pages/packageA/cashbook/detail?cashbook_id=' + item.cashbook_id,
        fail: (re) => {
          console.log(' fail', re)

        }
      })
    },
    copy(item) {
      console.log('copy', item)
      uni.setClipboardData({
        data: item.cashbook_sn + '',
        success: function () {
          uni.showToast({
            title: '复制成功，在新增页面可以关联哦',
            icon: 'none'
          })
        },
        fail: function (e) {
          console.log('copy fail', e)
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    },

  }
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;

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
      .c-item{
        padding-top: 10px;
      }
    }
  }
}

</style>
