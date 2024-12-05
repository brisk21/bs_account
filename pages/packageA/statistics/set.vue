<template>
  <view class="container bs_form">

    <u-form label-width="300">
      <template v-if="list.length>0">
        <u-form-item v-for="(item,index) in list" :key="index" :label="item.label"  label-position="left">
          <u-switch slot="right" v-model="list[index].value" @change="submit"></u-switch>
        </u-form-item>
      </template>
      <template v-else>
        <view class="u-text-center">无需配置</view>
      </template>

    </u-form>
  </view>

</template>

<script>

import api from "@/common/statistics";
export default {
  data() {
    return {
      list: [],
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
      api.statistic_get().then(res => {
        if (res.code == 0) {
          this.list = res.data.list
        }
      })
    },

    submit() {
      console.log(this.list)
      api.statistic_set({list:this.list}).then(res => {
        this.$u.toast(res.msg);
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
}

</style>

