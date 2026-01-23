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
  background-color: #f5f5f5;
  height: 100%;
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
  border-radius: 10upx;
}

.user-section {
  padding: 100upx 30upx 0;
  position: relative;

  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $uni-theme-color;
  }

  .setting {
    position: absolute;
    right: 0;
    z-index: 10;
    // #ifdef MP-WEIXIN
    top: 80rpx;
    // #endif

    color: white;
  }

}

.user-info-box {
  height: 180upx;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;

  .portrait {
    width: 130upx;
    height: 130upx;
    border: 5upx solid #fff;
    border-radius: 50%;
  }

  .username {
    font-size: 30rpx;
    color: #fff;
    margin-left: 20rpx;

    &.qq_login_btn {
      background-color: $uni-theme-color;
    }
  }
}

.menu-container {
  background-color: #f5f5f5;
  position: relative;
  padding-bottom: 20rpx;

  .extend-list {
    padding: 8rpx;
    margin-top: 20rpx;
  }
}

.tj-sction {
  @extend %section;

  background-color: #fff;

  .tj-item {
    @extend %flex-center;
    flex-direction: column;
    height: 140upx;
    font-size: $font-sm;
    color: $uni-text-color-grey;
  }

  .num {
    font-size: 40rpx;
    color: dodgerblue;
    margin-bottom: 8upx;
  }
}

.menu-list {
  margin-top: 30upx;
  background: #fff;
  border-radius: 10upx;

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
</style>
