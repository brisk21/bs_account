<template>
  <view class="container bs_form">
    <u-form-item label="邮箱">
      <u-input placeholder="请输入邮箱" border :maxlength="60" type="email" clearable class="category_form_input"
               v-model="form.email"/>
    </u-form-item>
    <u-form-item label="验证码">
     <u-input class="input-code"  v-model="form.code" border :maxlength="6" type="number" placeholder="请输入验证码"   />
      <u-button  type="primary" slot="right"  :disabled="!get_code"   @click="getCode()"  >{{ code_text }}</u-button>
    </u-form-item>

    <view class="buttons">
      <u-button class="action-btn" type="success" @click="submit">保存</u-button>

    </view>
  </view>

</template>

<script>
export default {
  data() {
    return {
      form: {
        email:'',
        code:''
      },
      code_text:'获取验证码',
      get_code : true
    };
  },
  onLoad(options) {
    this.getUserInfo()
  },
  mounted() {

  },
  methods: {
    getUserInfo() {
      let user = this.$store.getters.user
      if (!user) {
        //跳到登录
        uni.navigateTo({
          url: '/pages/login/login'
        })
        return;
      }
      this.$nextTick(() => {
        this.form.email = user.email
      })
    },

    //获取验证码
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


      this.$u.api.send_code(this.form).then(res => {
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
        }
      }).finally(()=>{
        this.get_code = true
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

      uni.showModal({
        title: '提示',
        content: '确定提交保存吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.updateEmail(this.form).then(res => {
              this.$u.toast(res.msg);
              if (res.code !== 0) {
                return
              }
              setTimeout(function () {
                uni.navigateBack({
                  delta: 1
                })
              },500)
           })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bs_form {
  width: 100%;
  height: 100%;
  padding: 10px;

  .input-code{
    width: 80rpx;
  }

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 160rpx;

    .action-btn {
      width: 100%;
      border-radius: unset !important;
    }
  }
}

</style>
