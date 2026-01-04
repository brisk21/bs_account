<template>
  <view class="container currency_form">
    <u-form-item label="币种名称">
      <u-input placeholder="请输入币种名称，如：美元" border :maxlength="20" type="text" clearable class="currency_form_input"
               v-model="form.name"/>
    </u-form-item>
    <u-form-item label="币种符号">
      <u-input placeholder="请输入币种符号，如：$、€" border :maxlength="5" type="text" clearable class="currency_form_input"
               v-model="form.symbol"/>
    </u-form-item>
<!--    <u-form-item label="汇率">
      <u-input placeholder="相对于人民币的汇率，如：7.2" border :maxlength="10" type="digit" clearable class="currency_form_input"
               v-model="form.rate"/>
    </u-form-item>-->
    <u-form-item label="排序">
      <u-input placeholder="越大越靠前,可以是负数" border :maxlength="10" type="number" clearable class="currency_form_input"
               v-model="form.sort"/>
    </u-form-item>
    <u-form-item label="是否默认" label-width="130">
        <u-switch v-model="form.is_default" :active-value="1" :inactive-value="0"></u-switch>
    </u-form-item>

    <view class="buttons">
      <u-button class="action-btn" type="default" @click="close">取消</u-button>
      <u-button class="action-btn" type="primary" @click="submit">保存</u-button>
    </view>
  </view>
</template>

<script>
import api from "@/common/currency";

export default {
  data() {
    return {
      form: {
        id: 0,
        name: '',
        symbol: '',
        rate: '',
        sort: null,
        is_default: false
      }
    };
  },
  onLoad(options) {
    if (options.id) {
      this.getInfo(options.id)
    }
  },
  methods: {
    getInfo(id) {
      api.get_detail({id: id}).then(res => {
        if (res.code == 0) {
          this.form = res.data.info;
        }
      })
    },
    close() {
      uni.navigateBack()
    },
    async submit() {
      if (!this.form.name) {
        this.$u.toast('请输入币种名称');
        return;
      }
      if (!this.form.symbol) {
        this.$u.toast('请输入币种符号');
        return;
      }
      /*if (!this.form.rate) {
        this.$u.toast('请输入汇率');
        return;
      }
      if (isNaN(this.form.rate) || this.form.rate <= 0) {
        this.$u.toast('请输入正确的汇率');
        return;
      }*/
      uni.showModal({
        title: '',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            if (this.form.id > 0) {
              api.update(this.form).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            } else {
              api.create(this.form).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            }
          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.currency_form {
  width: 100%;
  height: 100%;
  padding: 10px;

  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 80rpx;

    .action-btn {
      width: 100%;
      border-radius: unset !important;
    }
  }
}
</style>