<template>
  <view class="container bs_form">


    <u-form label-width="160">
      <u-form-item label="加入账簿">
        <u-switch v-model="is_join"></u-switch>
      </u-form-item>
      <u-form-item label="账簿编码" v-if="is_join">
        <u-search placeholder="账簿编码，如：10001" v-model="keyword" @search="fetch" @custom="fetch"></u-search>
      </u-form-item>
      <u-form-item label="创建人" v-if="is_join && form.cashbook_id">
        <text class="owner">{{ form.username || '' }}</text>
      </u-form-item>
      <u-form-item label="名称">
        <text v-if="is_join || !form.is_owner">{{ form.name }}</text>
        <u-input v-else placeholder="输入名称" :disabled="is_join" border :maxlength="128" type="text" clearable
                 class="bs_form_input"
                 v-model="form.name"/>
      </u-form-item>
      <u-form-item label="排序">
        <u-input placeholder="排序，越大越靠前" border :maxlength="10" type="number" class="bs_form_input"
                 v-model="form.sort"/>
      </u-form-item>
      <u-form-item label="是否默认">
        <u-switch v-model="form.is_default"></u-switch>
      </u-form-item>
      <u-form-item label="备注">
        <text v-if="is_join || !form.is_owner">{{ form.remark }}</text>
        <u-input v-else placeholder="账簿说明，比如：私房钱" :disabled="is_join" border :maxlength="500" type="textarea"
                 clearable class="bs_form_input"
                 v-model="form.remark" height="200"/>
      </u-form-item>

    </u-form>
    <view class="buttons">
      <u-button class="action-btn " v-if="is_join && has_joined" type="primary" disabled>您已加入</u-button>
      <u-button class="action-btn " v-if="!has_joined || !is_join" type="primary" @click="submit">
        {{ is_join ? '添加（保存）该账簿' : '保存账簿' }}
      </u-button>
    </view>

  </view>

</template>

<script>

import {get_detail, update, create, fetch, join} from "@/common/p_cashbook";

export default {
  data() {
    return {
      keyword: '',
      is_join: false,
      has_joined: false,
      form: {
        is_owner: true,
        is_default: false,
        cashbook_id: 0,
        name: '',
        remark: '',
        sort: '',
      },
    }
  },
  watch: {
    is_join(val) {
      if (val) {
        uni.setNavigationBarTitle({
          title: '加入账簿'
        })
      } else {
        uni.setNavigationBarTitle({
          title: '增改表单'
        })
      }
    }
  },
  onLoad(options) {
    if (options.cashbook_id) {
      this.form.cashbook_id = options.cashbook_id;
      get_detail({
        cashbook_id: options.cashbook_id
      }).then(res => {
        if (res.code == 0) {
          this.form = res.data.info;
          if (res.data.info.is_owner) {
            this.is_join = false;
            this.has_joined = false;
          }
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
    fetch() {
      fetch({
        cashbook_sn: this.keyword
      }).then(res => {
        if (res.code != 0) {
          this.$u.toast(res.msg);
          return;
        }
        if (res.code == 0) {
          console.log(res);
          this.form = res.data.info;
          this.has_joined = res.data.has_joined;
        }
      })
    },

    async submit() {
      if (!this.form.name) {
        this.$u.toast('请输入账簿名称');
        return;
      }
      let that = this;
      uni.showModal({
        title: '',
        content: '确定提交保存吗？',
        success: (res) => {
          if (res.confirm) {
            if (this.is_join || this.form.from_join === 1) {
              join(this.form)
                  .then(res => {
                    that.$u.toast(res.msg)
                    if (res.code == 0) {
                      uni.navigateBack()
                    }
                  }).finally(() => {
              })
              return;
            }


            if (this.form.cashbook_id > 0) {
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
