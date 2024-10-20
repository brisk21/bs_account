<template>
  <view class="container category_form">
    <u-form-item label="日账单：" label-position="left" label-width="120">
      <u-switch slot="right" v-model="form.day_set"></u-switch>
    </u-form-item>
    <u-form-item label="周账单：" label-position="left" label-width="120">
      <u-switch slot="right" v-model="form.week_set"></u-switch>
    </u-form-item>
    <u-form-item label="月账单：" label-position="left" label-width="120">
      <u-switch slot="right" v-model="form.month_set"></u-switch>
    </u-form-item>
    <u-form-item label="年账单：" label-position="left" label-width="120">
      <u-switch slot="right" v-model="form.year_set"></u-switch>
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
        day_set: true,
        week_set: true,
        month_set: true,
        year_set: true
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
      this.$u.api.getPush().then(res => {
        console.log(res)
        if (res.code == 0 && res.data){
          this.$nextTick(() => {
          this.form = res.data
        })
        }

      })
    },

    submit() {

      uni.showModal({
        title: '提示',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.setPush(this.form).then(res => {
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
