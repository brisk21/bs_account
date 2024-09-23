<template>
  <view class="container category_form">
    <u-form-item label="名称">
      <u-input placeholder="请输入分类名称" border :maxlength="10" type="text" clearable class="category_form_input"
               v-model="value"/>
    </u-form-item>
    <u-form-item label="类型">
      <u-radio-group v-model="type">
        <u-radio
            @change="radioChange"
            v-for="(item, index) in bill_list" :key="index"
            :name="item.value"

        >
          {{ item.label }}
        </u-radio>
      </u-radio-group>
    </u-form-item>

    <!--    <u-select v-model="select_bill_show" :list="bill_list" @confirm="billConfirm"></u-select>-->
    <view class="buttons">
      <u-button class="action-btn" type="default" @click="close">取消</u-button>
      <u-button class="action-btn" type="primary" @click="submitCategory">保存</u-button>

    </view>
  </view>

</template>

<script>

export default {
  data() {
    return {
      id: 0,
      value: '',
      type: 20,
      bill_list: [
        {
          label: '支出',
          value: 20
        },
        {
          label: '收入',
          value: 10
        }
      ]

    };
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id;
      this.$u.api.getCategoryInfo(this.id).then(res => {
        if (res.code == 0) {
          this.value = res.data.name;
          this.type = res.data.type;
        }
      })
    }
  },
  methods: {


    radioChange(e) {
      console.log(e);
    },


    close() {
      uni.navigateBack()
    },
    async billConfirm(e) {
      console.log(e)
    },
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
        title: '提示',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            if (this.id > 0) {
              this.$u.api.updateCategory({id: this.id, name: name, type: type}).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            } else {
              this.$u.api.createCategory({name: name, type: type}).then(res => {
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
    },
  }
};
</script>

<style lang="scss" scoped>
.category_form {
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
