<template>
  <view class="container bs_form">
    <u-form-item label="账号">
      <u-input placeholder="请输入登录账号" disabled border :maxlength="50" type="text" clearable class="bs_form_input"
               v-model="form.account"/>
    </u-form-item>
    <u-form-item label="密码">
      <u-input placeholder="请输入登录密码" border :maxlength="32" type="password" clearable class="bs_form_input"
               v-model="form.password"/>
    </u-form-item>

    <view class="buttons">
      <u-button v-if="user && !user.cancel_expire" class="action-btn" type="warning" @click="submit">提交注销</u-button>
      <u-button v-else  class="action-btn" type="primary" @click="regret">取消注销</u-button>

    </view>
    <view class="tips">
      <view>
        <text class="title">温馨提示：</text>
      </view>
      <view class="item">注销账号后，将清空所有数据（账单、账号、分类、消息等），请谨慎操作！</view>
      <view class="item">注销账号后，无法恢复，请谨慎操作！</view>
      <view class="item">如需要导出账单，请先导出账单，再注销账号。 <text class="link" @click="goto('/pages/setting/safe/export_data')">去导出账单</text></view>
      <view class="item">注销后本账号将被系统彻底清除，可以用于新账号注册！</view>
      <view class="item">申请后有7天冷静期，可以随时进来取消注销申请！</view>
      <view class="item" v-if="user && user.cancel_expire" >您的账号将于{{user.cancel_expire}}进行彻底注销，届时您的账单数据将被彻底删除。如需要取消，请点击上面的按钮进行取消注销申请。</view>
    </view>
  </view>

</template>

<script>
export default {
  data() {
    return {
      user: null,
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
        this.user = user
        this.form.account = user.account
      })
    },
    goto(path, auth = true) {
      if (auth && !this.hasLogin) {
        this.$u.toast('请登录后查看');
        return
      }
      if (!path) {
        this.$u.toast('暂未开放')
        return
      }
      uni.navigateTo({
        url: path
      })
    },

    regret(){
      if (!this.form.password) {
        this.$u.toast('请输入账号密码');
        return;
      }
      uni.showModal({
        title: '',
        content: '确定取消注销账号吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.regretCancelAccount({
              password: this.form.password,
            }).then(res => {
              this.$u.toast(res.msg);
              if (res.code !== 0) {
                return
              }
              setTimeout(function () {
                uni.navigateBack({
                  delta: 1
                })
              })
            })
          }
        }
      })
    },
    submit() {
      if (!this.form.password) {
        this.$u.toast('请输入账号密码');
        return;
      }
      uni.showModal({
        title: '',
        content: '确定提交账号注销吗,注销后所有数据将清空？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.cancelAccount({
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
.bs_form {
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

  .tips {
    margin-top: 60rpx;
    color: red;
    .item{
      margin-top: 15rpx;
    }
    .link{
      color: #007AFF;
    }
  }
}

</style>
