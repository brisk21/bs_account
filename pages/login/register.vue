<template>
  <view class="container">
    <view class="wrapper">
      <view class="title">
        用户注册
      </view>
      <view class="input-content">
        <u-form :model="form" ref="uForm">
          <u-form-item>
            <u-input placeholder="请输入用户名" v-model="form.account"/>
          </u-form-item>
          <u-form-item>
            <u-input type="password" placeholder="请输入密码" v-model="form.password"/>
          </u-form-item>
          <u-form-item>
            <u-input type="password" placeholder="确认密码" v-model="form.password1"/>
          </u-form-item>
          <u-form-item class="captcha_box">
            <u-input v-model="form.captcha_code" placeholder="请输入验证码" class="input"/>
            <image slot="right" class="captcha" @click="getCaptcha()" :src="captcha.img" mode=""></image>
          </u-form-item>
        </u-form>
      </view>
      <button class="confirm-btn" :disabled="!form.agree" @click="register()">注册</button>
      <view class="xieyi">
        <u-checkbox class="xiey-checkbox" v-model="form.agree"></u-checkbox>
        <text>注册即代表同意</text>
          <text class="xiey-link" @click="gotoPath('/pages/packageA/h5/article?key=register',false)">《注册协议》
        </text>
        <text class="xiey-link" @click="gotoPath('/pages/packageA/h5/article?key=privacy',false)">《隐私政策》
        </text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        agree: false,
        account: '',
        password: '',
        password1: '',
        captcha_key: '',
        captcha_code: '',
      },
      disabled: false,
      captcha: {
        img: "",
        key: ""
      }
    }
  },
  onLoad() {
    this.getCaptcha()
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
        }
      })
    // #endif

    },
    getCaptcha() {
      this.$u.api.getCaptcha().then(res => {
        this.captcha = res.data.captcha
      })
    },
    register() {
      if (!this.form.agree){
        this.$u.toast('请先同意注册协议')
        return
      }
      if (!this.form.account) {
        this.$u.toast('请输入账号');
        return
      }
      if (this.form.password !== this.form.password1) {
        this.$u.toast('两次密码不一致');
        return
      }
      let data = {
        ...this.form
      }
      data.captcha_key = this.captcha.key
      this.$u.api.register(data).then(res => {
        if (res.code !== 0) {
          this.$u.toast(res.msg);
          this.getCaptcha()
        } else {
          this.$u.toast('注册成功');
          let that = this
          setTimeout(function () {
            uni.navigateTo({
              url: '/pages/login/index?account=' + that.form.account,
              fail: (err) => {
                console.log('失败',err)
              }
            })
          }, 1000)

        }
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
}

.wrapper {
  background: #fff;
  padding-bottom: 40upx;
}
.xiey-link{
  color: #2b85e4;
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
  background: $uni-theme-color;
  color: #fff;
  font-size: $font-lg;

  &:after {
    border-radius: 100px;
  }
}

.forget-section {
  font-size: $font-sm+2upx;
  color: $uni-theme-color;
  text-align: center;
  margin-top: 40upx;
}

.captcha_box {
  .input {
  }

  .captcha {
    width: 240rpx;
    height: 72rpx;
  }
}
</style>
