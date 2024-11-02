<template>
  <view class="container bs_form">
    <u-form-item label="接收邮箱" label-width="150">
      <u-input placeholder="请输入邮箱" border :maxlength="60" type="email" clearable class="category_form_input"
               v-model="form.email"/>
    </u-form-item>
    <u-form-item label="登录密码" v-if="form.email" label-width="150">
      <u-input placeholder="请输入登录密码" border :maxlength="32" type="password" clearable class="category_form_input"
               v-model="form.password"/>
    </u-form-item>
    <u-form-item label="操作说明" label-width="150">
      <view class="u-text-left">
        请确保邮箱地址正确，否则无法接收到账单。为了数据安全，导出的账单已设置解压密码，对应的密码请在消息中心中查看。
      </view>

    </u-form-item>

    <view class="buttons">
      <u-button class="action-btn" type="success" @click="submit">提交导出账单</u-button>

    </view>
  </view>

</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
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



    submit() {
      if (!this.form.email) {
        this.$u.toast('请输入邮箱');
        return;
      } else if (!this.form.email.match(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/)) {
        this.$u.toast('请输入正确的邮箱');
        return;
      }
      if (!this.form.password) {
        this.$u.toast('请输入登录密码');
        return;
      }

      uni.showModal({
        title: '',
        content: '确定提交导出账单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '导出中...'
            })
            this.$u.api.export_data(this.form).then(res => {
              this.$u.toast(res.msg)
              if (res.code === 0) {
                 setTimeout(function () {
                  uni.navigateBack({
                    delta: 1
                  })
                }, 3000)
              }
            }).finally(()=>{
              setTimeout(function (){
                uni.hideLoading()
              },1000)
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

  .input-code {
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
