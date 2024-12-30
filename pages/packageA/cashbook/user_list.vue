<template>
  <view class="container">
    <view class="data-list" v-if="list.length>0">
      <view v-for="(item, index) in list" :key="index">
        <view class="item  u-border-top-bottom">
          <view class="avatar">
            <image mode="aspectFill" :src="item.avatar"/>
          </view>
          <view class="title-wrap">
            <text class="current">角色：{{ item.is_owner ? '创建者' : '参与者' }}</text>
            <text class="title u-line-2">昵称：{{ item.username }}</text>
            <text class="title u-line-2">账号：{{ item.account }}</text>
            <text class="title u-line-2">记账笔数：{{ item.count }} 笔</text>
          </view>
          <view class="action" v-if="item.unbind">
            <u-icon name="man-delete" color="#007aff" size="30" @click="unbind(item)"></u-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {user_list, unbind_user} from "@/common/p_cashbook";

export default {
  components: {},
  data() {
    return {
      list: [],
      disabled: false,
      btnWidth: 180,
      show: false,
      options: null,
    }
  },

  computed: {
    userInfo() {
      return this.$store.getters.user
    },
  },
  onLoad(option) {
    this.options = option
  },
  onShow() {
    this.get_list()
  },
  methods: {
    get_list() {
      user_list(this.options).then(res => {
        if (res.code == 0) {
          this.list = res.data.list
        }
      })
    },
    unbind(item) {
      let that = this;
      uni.showModal({
        title: '',
        content: '确定要解绑该用户吗？注意：解绑不会解除已关联账单数据！',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '解绑中...',
              mask: true
            })
            unbind_user({
              id: item.id,
              cashbook_id: item.cashbook_id
            }).then(res => {
              uni.hideLoading()
                this.$u.toast(res.msg)
              if (res.code === 0) {

                setTimeout(function () {
                  that.list.splice(that.list.indexOf(item), 1)
                }, 1000)
              }
            })
          }
        }
      })
    }
  },

}
</script>

<style lang="scss">
.container {
  background-color: #f5f5f5;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

.current {
  color: red;
  margin-top: 20rpx;
}


.data-list {
  .item {
    display: flex;
    padding: 20rpx;

    .avatar {
      line-height: 120rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 120rpx;
        flex: 0 0 120rpx;
        height: 120rpx;
        margin-right: 20rpx;
        border-radius: 12rpx;
      }
    }
  }
}


.title {
  text-align: left;
  font-size: 28rpx;
  color: $u-content-color;
  margin-top: 20rpx;
}


</style>
