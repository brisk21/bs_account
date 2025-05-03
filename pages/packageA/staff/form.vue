<template>
  <view class="container bs_form">

    <u-form label-width="160">

      <u-form-item label="登录账号" required>
        <u-input  placeholder="输入登录账号"  border :maxlength="128" type="text" clearable
                 class="bs_form_input"
                 v-model="form.account"/>
      </u-form-item>
      <u-form-item label="姓名-昵称">
        <u-input  placeholder="输入姓名-昵称"  border :maxlength="128" type="text" clearable
                 class="bs_form_input"
                 v-model="form.username"/>
      </u-form-item>
      <u-form-item label="登录密码" >
        <u-input  placeholder="输入登录密码"  border :maxlength="128" type="text" clearable
                 class="bs_form_input"
                 v-model="form.password"/>
      </u-form-item>

      <u-form-item label="是否禁用">
        <u-switch v-model="form.status"></u-switch>
      </u-form-item>
      <u-form-item label="备注">
        <u-input  border :maxlength="200" type="textarea"
                 clearable class="bs_form_input"
                 v-model="form.remark" height="200"/>
      </u-form-item>

    </u-form>
    <view class="buttons">
      <u-button class="action-btn " type="warning" @click="submit">
      保存
      </u-button>
    </view>

    <view class="readme">
      <view class="title">说明</view>
      <view class="tips">
        <view class="title">
          1. 创建的账号是用户登录账号，不能重复使用。创建的账号只是关联了您的用户编号作为父级编号。
        </view>
        <view class="title">
          2.账号一旦创建成功不支持删除，只能禁用，禁用后无法登录和进行相关操作。
        </view>
        <view class="title">
          3.只有您自己能查看自己创建的账号，被创建的账号不能看到你创建的其它账号，账号隔离。
        </view>
        <view class="title">
          4.目前仅支持此项功能仅供快速创建账号，用于报销管理的记录相关操作，如果管理员（老板）不想要这个账号了就可以禁用（不再需要总后台修改数据），主要是方便管理内部账号。
        </view>
      </view>
    </view>

  </view>

</template>

<script>

import {get_detail, update, create} from "@/common/p_staff";

export default {
  data() {
    return {
      keyword: '',
      is_join: false,
      has_joined: false,
      form: {
        username: '',
        remark: '',
        account: '',
        password:'',
        status: false
      },
    }
  },
  watch: {

  },
  onLoad(options) {
    if (options.id) {
      get_detail({
        id: options.id
      }).then(res => {
        if (res.code == 0) {
          this.form = res.data.info;
        }
      }).finally(() => {
       this.form.id = options.id;
      })

    } else {
      uni.setNavigationBarTitle({
        title: '新增'
      })
    }
  }
  ,
  methods: {
    async submit() {
      if (!this.form.account) {
        this.$u.toast('请输入登录账号');
        return;
      }
      if (!this.form.id && !this.form.password){
        this.$u.toast('请输入登录密码');
        return;
      }
      let that = this;
      uni.showModal({
        title: '',
        content: '确定提交保存吗？',
        success: (res) => {
          if (res.confirm) {

            if (this.form.id > 0) {
              update(this.form).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            } else {
              create(this.form).then(res => {
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

  .tips {
    .title {
      margin-top: 20rpx;
      font-weight: bold;
    }
  }

  .owner {
    color: red;
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

      .delete {
        background-color: rgba(200, 196, 196, 0.9);
        color: white;

      }
    }
  }
}

</style>
