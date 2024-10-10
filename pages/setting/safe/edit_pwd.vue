<template>
  <view class="container category_form">
    <u-form-item label="账号：" label-position="top">
      <u-input disabled border :maxlength="50" type="text" clearable class="category_form_input"
               v-model="form.account"/>
    </u-form-item>
    <u-form-item label="原密码：" label-position="top">
      <u-input placeholder="请输入登录密码" border :maxlength="32" type="password" clearable class="category_form_input"
               v-model="form.password"/>
    </u-form-item>
    <u-form-item label="新密码：" label-position="top">
      <u-input placeholder="请输入新密码" border :maxlength="32" type="password" clearable class="category_form_input"
               v-model="form.new_password"/>
    </u-form-item>
    <u-form-item label="确认密码：" label-position="top">
      <u-input placeholder="请再次输入新密码" border :maxlength="32" type="password" clearable
               class="category_form_input"
               v-model="form.new_password_confirm"/>
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
        account: '',
        password: '',
        new_password: '',
        new_password_confirm: ''
      }
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
        this.form.account = user.account
      })
    },

    submit() {
      if (!this.form.new_password) {
        this.$u.toast('请输入登录密码');
        return;
      }
      if (!this.form.new_password_confirm) {
        this.$u.toast('请再次输入密码');
        return;
      }
      if (this.form.new_password !== this.form.new_password_confirm) {
        this.$u.toast('两次密码不一致');
        return;
      }
      //密码至少6位数
      if (this.form.new_password.length < 6) {
        this.$u.toast('密码至少6位数');
        return;
      }
      uni.showModal({
        title: '提示',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.updatePwd({
              password: this.form.password,
              new_password: this.form.new_password,
              new_password_confirm: this.form.new_password_confirm
            }).then(res => {
              this.$u.toast(res.msg);
              if (res.code !== 0) {
                return
              }
              setTimeout(function () {
                uni.navigateBack({
                  delta: 1
                })
              }, 500)
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.category_form {
  width: 100%;
  height: 100%;
  padding: 10px;


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
