<template>
  <view class="container bs_form">
    <u-form label-width="160">
      <u-form-item label="选择账单">
        <u-button @click="openSelectCashflow">选择账单</u-button>
      </u-form-item>

      <u-form-item label="备注">
        <text v-if="is_join || !form.is_owner">{{ form.remark }}</text>
        <u-input v-else placeholder="账本说明，比如：私房钱" :disabled="is_join" border :maxlength="500" type="textarea"
                 clearable class="bs_form_input"
                 v-model="form.remark" height="200"/>
      </u-form-item>
    </u-form>
    <view class="buttons">
      <u-button class="action-btn "  type="primary" @click="submit">
       保存
      </u-button>
    </view>
  </view>
</template>

<script>
import { get_detail, update, create } from "@/common/p_reimbursement";

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
      selectedCashbooks: [],
      cashbookList: [
          {
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
      ],
    }
  },
  watch: {
    keyword(newVal) {
      this.searchCashbooks(newVal);
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
  },
  methods: {
    openSelectCashflow() {
      uni.navigateTo({
        url: '/pages/packageA/baoxiao/selectCashflow?selectedCashbooks=' + JSON.stringify(this.selectedCashbooks)
      });
    },
    searchCashbooks(keyword) {
      // 这里可以添加筛选账单的逻辑
      // 例如，根据 keyword 过滤 cashbookList
      this.cashbookList = this.cashbookList.filter(item => item.label.includes(keyword));
    },
    async submit() {
      if (!this.form.name) {
        this.$u.toast('请输入账本名称');
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
