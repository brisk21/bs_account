<template>
  <view class="container">
    <fab></fab>


    <view class="user-section">

      <view class="bg"></view>
      <view class="user-info-box">
        <view class="portrait-box" @click="gotoPath('/pages/setting/safe/avatar',true)">
          <image class="portrait" :src="userInfo.avatar || '/static/missing-face.png'">
          </image>
        </view>
        <view class="info-box">
          <view v-if="hasLogin" @click="gotoPath('/pages/setting/safe/avatar',true)">
            <text class="username">{{ userInfo.nick_name || '游客' }}</text>
            <text @click.native.stop="gotoPath('/pages/setting/safe/cancel_account',true)" v-if="userInfo.cancel_expire"
                  style="color: #e90808;">（即将注销）
            </text>
          </view>
          <view v-else>
            <text class="username" @click="goToLoginPage()">点击登录</text>

          </view>
        </view>
        <view class="setting">
          <view class="setting-item" @click="gotoPath('/pages/setting/index',false)">
            <u-icon name="setting" size="50"></u-icon>
          </view>
        </view>
      </view>
    </view>
    <view class="tj-sction">
      <view class="tj-item" @click="gotoPath('/pages/index/list',true)">
        <text class="num">{{ userInfo.sign_in_day || 0 }}</text>
        <text>使用天数</text>
      </view>
      <view class="tj-item" @click="gotoPath('/pages/index/list',true)">
        <text class="num">{{ userInfo.all_bill_day || 0 }}</text>
        <text>总记账天数</text>
      </view>
      <view class="tj-item" @click="gotoPath('/pages/index/list',true)">
        <text class="num">{{ userInfo.all_bill_count || 0 }}</text>
        <text>总记账笔数</text>
      </view>
    </view>
    <view class="alert-tip">
      <u-alert-tips type="error" :show=" show_tips && hasLogin && !userInfo.email" title="安全提示"
                    :description="'为了方便找回密码、导出数据等相关操作，建议您绑定邮箱！'"
                    :close-able="true" @click="gotoPath('/pages/setting/safe/email',true)"
                    @close="show_tips=false"
      ></u-alert-tips>
    </view>
    <view class="menu-container">
      <view class="menu-list">
        <u-cell-group>
          <u-cell-item @click="gotoPath('/pages/notification/index')" title="系统消息" icon="bell">
            <u-badge v-show="hasLogin && unreadCount > 0" :count="unreadCount" :absolute="false"
                     slot="right-icon">
            </u-badge>
          </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/category')" title="收支类型" icon="grid"></u-cell-item>

          <u-cell-item @click="gotoPath('/pages/budget/budget',false)" title="预算管理" icon="rmb-circle">
          </u-cell-item>
          <u-cell-item @click="gotoPath('/pages/setting/help',false)" title="帮助中心" icon="question-circle">
          </u-cell-item>

          <u-cell-item @click="gotoPath('/pages/extend/index',false)" title="扩展插件" icon="grid">
            <u-badge count="荐" :absolute="false" slot="right-icon"></u-badge>
          </u-cell-item>
        </u-cell-group>
      </view>
      <view class="extend-list" v-if="plugins_list.length>0">
        <u-grid :col="3">
          <u-grid-item v-for="(item, index) in plugins_list" :key="index" @click="gotoPath(item.path)">
            <u-icon :name="item.icon" :size="46"></u-icon>
            <view class="grid-text">{{ item.name }}</view>
          </u-grid-item>
        </u-grid>
      </view>
    </view>


    <!-- #ifdef MP-->
    <ad-custom v-if="userInfo && userInfo.position.user_center" unit-id="adunit-2ce0331ff2925c38" bindload="adLoad"
               binderror="adError" bindclose="adClose"></ad-custom>
    <!-- #endif -->



  </view>


</template>

<script>
import fab from '@/my-components/fab/index.vue'
import extend from "@/common/extend";

export default {
  components: {
    fab
  },
  data() {
    return {
      show_tips: true,
      ad_show: false,
      plugins_list: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.user
    },
    unreadCount() {
      return this.$store.getters.unread_count || 0
    }

  },
  methods: {
    my_plugins() {
      extend.my_list().then(res => {
        if (res.code == 0) {
          this.plugins_list = res.data.list
        }
      })
    }

  },
  onLoad(options) {
    // #ifdef MP-WEIXIN
    this.show_tips = false
    // #endif
  },
  onShow() {
    if (this.hasLogin) {
      this.$store.dispatch('getUserInfo')
      this.my_plugins()
    }
  }
}
</script>

<style lang="scss">
.container {
  background-color: #f5f7fa;
  min-height: 100vh;
}

%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 16rpx;
}

.user-section {
  padding: 100upx 30upx 0;
  position: relative;
  padding-bottom: 40rpx;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #42b479 0%, #38a169 100%);
    border-radius: 0 0 32rpx 32rpx;
  }

  .setting {
    position: absolute;
    right: 30rpx;
    z-index: 10;
    // #ifdef MP-WEIXIN
    top: 80rpx;
    // #endif
    color: white;
    background: rgba(255, 255, 255, 0.15);
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &:active {
      background: rgba(255, 255, 255, 0.25);
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.user-info-box {
  height: 180upx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .portrait-box {
    position: relative;
  }

  .portrait {
    width: 130upx;
    height: 130upx;
    border: 6upx solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }

  .info-box {
    flex: 1;
    margin-left: 24rpx;
  }

  .username {
    font-size: 36rpx;
    color: #fff;
    font-weight: 600;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

    &.qq_login_btn {
      background-color: $uni-theme-color;
    }
  }
}

.menu-container {
  background-color: transparent;
  position: relative;
  padding: 0 30rpx 20rpx;

  .extend-list {
    padding: 0;
    margin-top: 20rpx;
    background: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }
}

.tj-sction {
  @extend %section;
  background-color: #fff;
  margin: 0 30rpx 24rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  padding: 20rpx 0;

  .tj-item {
    @extend %flex-center;
    flex-direction: column;
    height: 140upx;
    font-size: $font-sm;
    color: #909399;
    position: relative;
    transition: all 0.3s;

    &:active {
      background: #f8f8f8;
    }

    
  }

  .num {
    font-size: 48rpx;
    font-weight: 600;
    background: linear-gradient(135deg, #42b479 0%, #38a169 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 12upx;
  }
}

.alert-tip {
  padding: 0 30rpx 20rpx;
}

.menu-list {
  margin-top: 0;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);

  switch {
    transform: scale(0.7, 0.7)
  }
}

.list-item {
  width: 100%;
  padding: 0rpx;
  background-color: #FFFFFF !important;
  border: initial;
  text-align: initial;
}

.list-item::after {
  border: initial;
}

.select_bill {
  flex: 1;
  margin-right: 10px;
  text-align: right;
  color: #FFFFFF;
}

.grid-text {
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #606266;
}
</style>
