<template>
  <view class="container">
    <view class="wrapper">
      <view class="title">
        找回密码
      </view>
      <view class="input-content">
        <u-form :model="form" ref="uForm" label-width="150">
          <u-form-item label="邮箱">
            <u-input placeholder="请输入您的邮箱账号" v-model="form.email"/>
          </u-form-item>
          <u-form-item label="新密码">
            <u-input type="password" placeholder="请输入新密码" v-model="form.password"/>
          </u-form-item>

          <u-form-item class="captcha_box" label="图形验证码">
            <u-input v-model="form.captcha_code" placeholder="请输入验证码" class="input"/>
            <image slot="right" class="captcha" @click="getCaptcha()" :src="captcha.img" ></image>
          </u-form-item>
          <u-form-item label="验证码" >
           <u-input class="input-code"  v-model="form.code" border :maxlength="6" type="number" placeholder="请输入验证码"   />
            <u-button  type="primary" slot="right"  :disabled="!get_code"   @click="getCode()"  >{{ code_text }}</u-button>
          </u-form-item>
        </u-form>
      </view>
      <button type="primary"  class="confirm-btn" @click="submit()">提交</button>

    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      is_wx: false,
      form: {
        email:'',
        code:'',
        password: '',
        captcha_key: '',
        captcha_code: '',
      },
      code_text:'获取验证码',
      get_code : true,
      captcha: {},
      mobile: '',
      password: '',
    };
  },
  onLoad() {
    this.getCaptcha()
  },
  methods: {
     getCaptcha() {
      this.$u.api.getCaptcha().then(res => {
        this.captcha = res.data.captcha
      })
    },
    submit() {
       if (!this.form.email){
        this.$u.toast('请输入邮箱');
        return;
      }
      if (!this.form.code){
        this.$u.toast('请输入验证码');
        return;
      }
      if (!this.form.password){
        this.$u.toast('请输入新密码');
        return;
      }

      uni.showModal({
        title: '',
        content: '确定提交保存吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.forget_pwd(this.form).then(res => {
              this.$u.toast(res.msg);
              if (res.code !== 0) {
                return
              }
              let that = this
              setTimeout(function () {
                uni.navigateTo({
                  url: '/pages/login/index?account='+that.form.email
                })
              },500)
           })
          }
        }
      })
    },
    getCode() {
      if (!this.form.email){
        this.$u.toast('请输入邮箱');
        return;
      }
      //验证邮箱
      if (!this.form.email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)){
        this.$u.toast('请输入正确的邮箱');
        return;
      }
      this.get_code = false
     this.form.captcha_key = this.captcha.key
      this.$u.api.send_forget_code(this.form).then(res => {
        if (res.code == 0) {
          this.$u.toast(res.msg);
          //倒计时
          let count = 60;
          let timer = setInterval(() => {
            this.code_text = count + 's';
            count--;
            if (count < 0) {
              clearInterval(timer);
              this.code_text = '重新获取';
              this.get_code = true
            }
          }, 1000);
        } else {
          this.$u.toast(res.msg);
          this.getCaptcha()
          this.get_code = true
        }
      }).finally(()=>{

      })
    },
  }
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
