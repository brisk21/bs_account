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
        <u-input @click.native.prevent="chooseTime(1)" placeholder="请选择开始时间"  border :maxlength="10" type="text" clearable class="bs_form_input"
                 v-model="form.start_time" />

      </u-form-item>
      <u-form-item label="结束时间" v-if="form.time_limit">
        <u-input placeholder="请选择结束时间" border :maxlength="10" type="text" clearable class="bs_form_input"
                 v-model="form.end_time" @click.native.prevent="chooseTime(2)"/>
      </u-form-item>
      <u-form-item label="备注">
        <u-input placeholder="请输入备注" border :maxlength="250" type="textarea" clearable class="bs_form_input"
                 v-model="form.remark"/>
      </u-form-item>

    </u-form>
    <view class="buttons">
      <u-button v-if="form.budget_id>0" class="action-btn" type="warning" @click="del()">删除</u-button>
      <u-button class="action-btn" type="primary" @click="submit">保存</u-button>

    </view>
    <u-picker mode="time" v-model="show_time" :params="params"
                  @confirm="confirmTime" @cancel="cancelTime" :mask-close-able="false"></u-picker>
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
        end_time: null,
        remark: ''
      },
      show_time: false,
      time_index: 0,
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
      api.budget_detail({
        budget_id: options.id
      }).then(res => {
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
    chooseTime(index) {
      console.log(index)
      this.show_time=true;
      this.time_index=index
    },
    cancelTime() {
    },
    confirmTime(e) {
      console.log('选择的年月：', e);
      if (this.time_index==1){
        this.form.start_time = e.year + '-' + e.month + '-' + e.day
      }else{
        this.form.end_time = e.year + '-' + e.month + '-' + e.day
      }

    },
    del() {
      uni.showModal({
        title: '',
        content: '确定删除吗？数据不可恢复哦',
        success: (res) => {
          if (res.confirm) {
            api.budget_delete({
              budget_id: this.id
            }).then(res => {
              this.$u.toast(res.msg);
              if (res.code == 0) {
                setTimeout(function (){
                  uni.navigateBack()
                },1000)
              }
            })
          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })


    } ,
    async submit() {

      if (!this.form.title) {
        this.$u.toast('请输入预算名称');
        return;
      }else if (this.form.title.length>100){
        this.$u.toast('预算名称过长');
        return;
      }
      if (!this.form.amount) {
        this.$u.toast('请设置预算金额');
        return;
      }else if (isNaN(this.form.amount)){
        this.$u.toast('请输入正确的预算金额');
        return;
      }else if (this.form.amount<=0){
        this.$u.toast('预算金额必须大于0');
        return;
      }
      if (this.form.time_limit){
        if (!this.form.start_time){
          this.$u.toast('请选择开始时间');
          return;
        }else if (!this.form.end_time){
          this.$u.toast('请选择结束时间');
          return;
        }
      }
      uni.showModal({
        title: '',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            if (this.form.budget_id > 0) {
             api.budget_edit(this.form).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            } else {
              api.budget_add(this.form).then(res => {
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
    justify-content: space-evenly;
    margin-top: 50rpx;
    flex-direction: row;
    flex-wrap: nowrap;
    align-content: center;
    align-items: center;

    .action-btn {
      width: 100%;
      border-radius: unset !important;
    }
  }
}

</style>
