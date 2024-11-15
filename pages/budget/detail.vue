<template>
  <view class="container bs_form">


    <u-form label-width="150">
      <u-form-item label="预算名称" required>
        <u-input placeholder="请输入预算名称" border :maxlength="128" type="text" clearable class="bs_form_input"
                 v-model="form.title"/>
      </u-form-item>
      <u-form-item label="预算类型" required>
        <u-radio-group v-model="form.type" shape="circle" style="display: flex;">
          <u-radio label="1" :name="20">支出</u-radio>
          <u-radio label="2" :name="10">收入</u-radio>
          <u-radio label="2" :name="0">综合</u-radio>
        </u-radio-group>
      </u-form-item>
      <u-form-item label="预算额度" required>
        <u-input placeholder="请输入预算额度" border :maxlength="10" type="number" clearable class="bs_form_input"
                 v-model="form.amount"/>
      </u-form-item>
      <u-form-item label="预算排序">
        <u-input placeholder="排序，越大越靠前" border :maxlength="10" type="number" clearable class="bs_form_input"
                 v-model="form.sort"/>
      </u-form-item>
      <u-form-item label="时间限制">
        <u-switch v-model="form.time_limit"></u-switch>
      </u-form-item>
      <u-form-item label="开始时间" v-if="form.time_limit">
        <view class="time_label" @click.stop="chooseTime(1)">
          {{form.start_time ||　"请选择开始时间"}} <u-icon name="arrow-right"></u-icon>
        </view>
      </u-form-item>
      <u-form-item label="结束时间" v-if="form.time_limit">
        <view class="time_label" @click.stop="chooseTime(2)">
          {{form.end_time ||　"请选择结束时间"}} <u-icon name="arrow-right"></u-icon>
        </view>

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
    <view class="tips">
      <view class="title">类型说明：</view>
      <u-table>
        <u-tr>
          <u-th>类型</u-th>
          <u-th>关联说明</u-th>
        </u-tr>
        <u-tr>
          <u-td>支出预算</u-td>
          <u-td>支出</u-td>
        </u-tr>
        <u-tr>
          <u-td>收入预算</u-td>
          <u-td>收入</u-td>
        </u-tr>
        <u-tr>
          <u-td>综合预算</u-td>
          <u-td>收入、支出</u-td>
        </u-tr>
      </u-table>
      <view class="title">预算额度说明：</view>
      <view class="tips_item">
        收入和支出类型的预算额度，就是关联对应的收入和支出。综合类型的预算额度只填写预算的支出部分，收入不用设置，预算列表会根据类型显示不同的统计内容。
      </view>
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
        remark: '',
        sort: null,
        type: 20
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
        content: '确定删除吗？删除后不再在列表显示',
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

.tips{
  .title{
    margin-top: 20rpx;
    font-weight: bold;
  }
}
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
