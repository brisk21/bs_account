<template>
  <view class="container category_form">
    <u-form-item label="账号">
      <u-input placeholder="请输入登录账号" border :maxlength="32" type="text" clearable class="category_form_input"
               v-model="form.account"/>
    </u-form-item>
    <u-form-item label="密码">
      <u-input placeholder="请输入登录密码" border :maxlength="32" type="password" clearable class="category_form_input"
               v-model="form.password"/>
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
        password: ''
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
      if (!this.form.account){
        this.$u.toast('请输入账号');
        return;
      }
      uni.showModal({
        title: '提示',
        content: '确定提交吗,每个月只能修改一次哦？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.updateAccount({
              account: this.form.account,
              password: this.form.password
            }).then(res => {
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
