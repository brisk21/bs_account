<template>
  <view class="container bs_form">


    <u-form label-width="150">
      <u-form-item label="名称" >
        <u-input placeholder="输入名称" border :maxlength="128" type="text" clearable class="bs_form_input"
                 v-model="form.title"/>
      </u-form-item>
      <u-form-item label="内容" required>
        <u-input  placeholder="请输入您的奇思妙想、灵感等信息" border :maxlength="500" type="textarea" clearable class="bs_form_input"
                 v-model="form.content" height="200"/>
      </u-form-item>

    </u-form>
    <view class="buttons">
      <u-button v-if="form.id>0" class="action-btn" type="warning" @click="del()">删除</u-button>
      <u-button class="action-btn" type="primary" @click="submit">保存</u-button>

    </view>

  </view>

</template>

<script>

import api from "@/common/p_idea";

export default {
  data() {
    return {
      form: {
        id: 0,
        title: '',
        content: ''
      },
    }
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      api.get_detail({
        id: options.id
      }).then(res => {
        if (res.code == 0) {
          this.form = res.data.info;
        }
      })
    } else {
      uni.setNavigationBarTitle({
        title: '新增'
      })
    }
  }
  ,
  methods: {
    del() {
      uni.showModal({
        title: '',
        content: '确定删除吗？删除后不可恢复',
        success: (res) => {
          if (res.confirm) {
            api.remove({
              id: this.id
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

      if (!this.form.content) {
        this.$u.toast('请输入内容');
        return;
      }
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
