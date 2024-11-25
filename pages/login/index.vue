<template>
  <view class="container">
    <view class="wrapper">
      <view class="title">
        用户登录
      </view>
      <view class="input-content">
        <u-form :model="form" ref="uForm">
          <u-form-item>
            <u-input placeholder="请输入用户名" v-model="form.account"/>
          </u-form-item>
          <u-form-item>
            <u-input type="password" placeholder="请输入密码" v-model="form.password"/>
          </u-form-item>
          <u-form-item class="captcha_box">
            <u-input v-model="form.captcha_code" placeholder="请输入验证码" class="input"/>
            <image slot="right" class="captcha" @click="getCaptcha()" :src="captcha.img" mode=""></image>
          </u-form-item>
        </u-form>
      </view>
      <button type="primary" :disabled="!form.agree" class="confirm-btn" @click="login()">账号登录</button>

      <view class="xieyi">
        <u-checkbox class="xiey-checkbox" v-model="form.agree"></u-checkbox>
        <text>注册即代表同意</text>
        <u-link @click="copy('https://jz.api.alipay168.cn/api/agreement/register')"
                :href="'https://jz.api.alipay168.cn/api/agreement/register'"
                :under-line="false">《注册协议》
        </u-link>
        <u-link @click="copy('https://jz.api.alipay168.cn/api/agreement/privacy')"
                :href="'https://jz.api.alipay168.cn/api/agreement/privacy'"
                :under-line="false">《隐私政策》
        </u-link>
      </view>

      <view class="wx" v-if="is_wx">
        <u-icon @click="wxlogin" class="icon" name="https://jz.api.alipay168.cn/static/image/wx-login.png" size="100"
                color="#09bb07"></u-icon>
        <br>
        <text @click="wxlogin">微信登录</text>
      </view>




    </view>
    <view class="register-section">
      <text @click="toRegist">注册账号</text>
       <text class="forget-section" @click="toForget">
        忘记密码?
      </text>
    </view>
  </view>
</template>

<script>
import {getCode} from "@/common/login";

export default {
  data() {
    return {
      is_wx: false,
      form: {
        agree: false,
        account: '',
        password: '',
        captcha_key: '',
        captcha_code: '',
      },
      captcha: {},
      mobile: '',
      password: '',
    }
  },
  onLoad(option) {
    this.getCaptcha()
    // #ifdef MP
    this.is_wx = true
    // #endif
    if (option.account) {
      this.form.account = option.account
    }
  },
  methods: {
    copy(e) {
      // #ifdef MP
      uni.setClipboardData({
        data: e,
        success: function () {
          uni.showToast({
            title: '链接已复制，请在浏览器打开'
          })
        },
        fail: function (err) {
          console.log('copy fail', err)
        }
      })
      // #endif

    },
    toRegist() {
      uni.navigateTo({
        url: '/pages/login/register'
      })
    },
    toForget() {
      uni.navigateTo({
        url: '/pages/login/forget_pwd'
      })
    },
    // #ifdef MP
    wxlogin() {
      if (!this.form.agree) {
        this.$u.toast('请先同意注册协议')
        return
      }
      uni.showModal({
        title: '是否使用微信登录',
        content: '若不存在账号则自动创建新账号，是否继续？',
        confirmText: '确定',
        cancelText: '取消',
        success: res => {
          if (res.confirm) {
            uni.showLoading({
              title: '正在登录....'
            })
            getCode()
            uni.hideLoading()
          }
        }
      })

    },
    // #endif
    login() {
      if (!this.form.agree) {
        this.$u.toast('请先同意注册协议')
        return
      }
      if (!this.form.account) {
        this.$u.toast('请输入账号');
        return;
      }
      if (!this.form.password) {
        this.$u.toast('请输入密码');
        return;
      }
      if (!this.form.captcha_code) {
        this.$u.toast('请输入验证码');
        return;
      }


      let data = {
        ...this.form
      }
      data.captcha_key = this.captcha.key
      this.$store.dispatch('login', data).then(res => {
        //console.log(res);return;
        if (res.code === 0) {
          this.$u.toast('登录成功');

          this.$store.dispatch('getUserInfo').then(res => {
            uni.switchTab({
              url: '/pages/index/index'
            })
          })
        } else {
          this.$u.toast(res.msg);
          this.getCaptcha()
        }
      })
    },
    getCaptcha() {
      this.$u.api.getCaptcha().then(res => {
        this.captcha = res.data.captcha
      })
    }
  },
}
</script>

<style lang='scss'>
.container {
  padding-top: 50px;
  width: 100vw;
  height: 100vh;
  background: #fff;

  .u-image {
    width: 150rpx;
    height: 150rpx;
  }
}

.wrapper {
  background: #fff;
  padding-bottom: 40upx;
}

.xieyi {
  margin-top: 30rpx;
  margin-left: 30rpx;
}

.title {
  text-align: center;
  margin-bottom: 100rpx;
  font-size: 46upx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
}

.input-content {
  padding: 0 60upx;
}

.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30upx;
  background: $page-color-light;
  height: 120upx;
  border-radius: 4px;
  margin-bottom: 50upx;

  &:last-child {
    margin-bottom: 0;
  }

  .tit {
    height: 50upx;
    line-height: 56upx;
    font-size: $font-sm+2upx;
    color: $font-color-base;
  }

  input {
    height: 60upx;
    font-size: $font-base + 2upx;
    color: $font-color-dark;
    width: 100%;
  }
}

.confirm-btn {
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 70upx;
  background: #177ade;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}

.confirm-btn-wx {
  width: 630upx;
  height: 76upx;
  line-height: 76upx;
  border-radius: 50px;
  margin-top: 70upx;
  color: #fff;
  font-size: $font-lg;
  background: $uni-theme-color;

  &:after {
    border-radius: 100px;
  }
}



.register-section {
  position: absolute;
  left: 0;
  bottom: 50upx;
  width: 100%;
  font-size: $font-sm+2upx;
  color: $font-color-base;
  text-align: center;

  text {
    color: $uni-theme-color;
    margin-left: 10upx;
  }
  .forget-section {
    font-size: $font-sm+2upx;
    color: blue;
    text-align: center;
    margin-left: 20rpx;
  }
}

.captcha_box {
  .input {
  }

  .captcha {
    width: 240rpx;
    height: 72rpx;
  }
}

.wx {
  text-align: center;
  margin: 40rpx auto auto;
}
</style>
