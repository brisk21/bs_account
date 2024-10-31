<template>
  <view class="container category_form">
    <u-form label-width="150">
    <u-form-item label="日账单：" label-position="left" >
      <u-switch slot="right" v-model="form.day_set" @change="submit"></u-switch>
    </u-form-item>
    <u-form-item label="周账单：" label-position="left" >
      <u-switch slot="right" v-model="form.week_set" @change="submit"></u-switch>
    </u-form-item>
    <u-form-item label="月账单：" label-position="left" >
      <u-switch slot="right" v-model="form.month_set" @change="submit"></u-switch>
    </u-form-item>
    <u-form-item label="年账单：" label-position="left" >
      <u-switch slot="right" v-model="form.year_set" @change="submit"></u-switch>
    </u-form-item>
    </u-form>
  </view>

</template>

<script>
export default {
  data() {
    return {
      form: {
        day_set: false,
        week_set: false,
        month_set: false,
        year_set: false
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
        if (res.code == 0 && res.data){
          this.$nextTick(() => {
          this.form = res.data
        })
        }

      })
    },

    submit() {
      this.$u.api.setPush(this.form).then(res => {
        this.$u.toast(res.msg);
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
