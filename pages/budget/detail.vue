<template>
  <view class="container bs_form">
    <u-form label-width="150">
      <u-form-item label="名称">
        <u-input placeholder="请输入预算名称" border :maxlength="128" type="text" clearable class="bs_form_input"
                 v-model="form.title"/>
      </u-form-item>
      <u-form-item label="金额">
        <u-input placeholder="请输入预算金额" border :maxlength="10" type="number" clearable class="bs_form_input"
                 v-model="form.amount"/>
      </u-form-item>
      <u-form-item label="时间限制">
        <u-switch v-model="form.time_limit"></u-switch>
      </u-form-item>
      <u-form-item label="开始时间" v-if="form.time_limit">

        <u-input placeholder="请选择开始时间" border :maxlength="10" type="text" clearable class="bs_form_input"
                 v-model="form.start_time" @click="show_start_time=true"/>
        <u-picker mode="time" v-model="show_start_time" :params="params"
                  @confirm="confirmTime" @cancel="cancelTime" :mask-close-able="false"></u-picker>
      </u-form-item>
      <u-form-item label="结束时间" v-if="form.time_limit">
        <u-input placeholder="请选择结束时间" border :maxlength="10" type="text" clearable class="bs_form_input"
                 v-model="form.end_time" @click="show_end_time=true"/>
        <u-picker mode="time" v-model="show_end_time" :params="params"
                  @confirm="confirmTime" @cancel="cancelTime" :mask-close-able="false"></u-picker>
      </u-form-item>

    </u-form>
    <view class="buttons">
      <u-button class="action-btn" type="default" @click="close">取消</u-button>
      <u-button class="action-btn" type="primary" @click="submitCategory">保存</u-button>

    </view>
  </view>

</template>

<script>

import api from "@/common/budget";

export default {
  data() {
    return {
      form: {
        budget_id: 0,
        title: '',
        amount: '',
        time_limit: false,
        start_time: null,
        end_time: null
      },
      show_start_time: false,
      show_end_time: false,
      params: {
        year: true, // 是否显示年
        month: true, // 是否显示月
        day: true
      },
      startYear: 2000, // 起始年份
      endYear: new Date().getFullYear(), // 结束年份，设置为当前年份
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      api.budget_detail(this.id).then(res => {
        if (res.code == 0) {
          this.form = res.data.info;
        }
      })
    } else {
      uni.setNavigationBarTitle({
        title: '新增预算'
      })
    }
  }
  ,
  methods: {
    cancelTime() {
    },
    confirmTime(e) {
      console.log('选择的年月：', e);

    },
    close() {

    } ,
    async submitCategory() {
      let name = this.value;
      let type = this.type;
      if (!name) {
        this.$u.toast('请输入分类名称');
        return;
      }
      if (!type) {
        this.$u.toast('请选择分类类型');
        return;
      }
      uni.showModal({
        title: '',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            if (this.id > 0) {
              this.$u.api.updateCategory({id: this.id, name: name, type: type, sort: this.sort}).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            } else {
              this.$u.api.createCategory({name: name, type: type, sort: this.sort}).then(res => {
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
    ,
  }
};
</script>

<style lang="scss" scoped>
.bs_form {
  width: 100%;
  height: 100%;
  padding: 10px;


  .buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20rpx;

    .action-btn {
      width: 100%;
      border-radius: unset !important;
    }
  }
}

</style>
