<template>
  <view class="container category_form">
    <u-form-item label="名称">
      <u-input placeholder="请输入名称" border :maxlength="10" type="text" clearable class="category_form_input"
               v-model="form.name"/>
    </u-form-item>
    <u-form-item label="排序">
      <u-input placeholder="越大越靠前,可以是负数" border :maxlength="10" type="number"  clearable class="category_form_input"
               v-model="form.sort"/>
    </u-form-item>
    <u-form-item label="类型">
      <u-radio-group v-model="form.type">
        <u-radio
            @change="radioChange"
            v-for="(item, index) in bill_list" :key="index"
            :name="item.value"

        >
          {{ item.label }}
        </u-radio>
      </u-radio-group>
    </u-form-item>
    <view class="buttons">
      <u-button class="action-btn" type="default" @click="close">取消</u-button>
      <u-button class="action-btn" type="primary" @click="submit">保存</u-button>

    </view>
  </view>

</template>

<script>
import api from "@/common/amount_type";
export default {
  data() {
    return {

      form:{
        id: 0,
        name: '',
        sort: null,
        type: 20,
      },
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
      this.getInfo(options.id)
    }else{
      if (options.type) {
        this.form.type = options.type == 1 ? 10 : 20;
      }
    }
  },
  methods: {
    getInfo(id){
      api.get_detail({id:id}).then(res => {
        if (res.code == 0) {
          this.form = res.data.info;
        }
      })
    },
    radioChange(e) {
      console.log(e);
    },

    close() {
      uni.navigateBack()
    },

    async submit() {
      if (!this.form.name) {
        this.$u.toast('请输入名称');
        return;
      }
      if (!this.form.type) {
        this.$u.toast('请选择分类类型');
        return;
      }
      uni.showModal({
        title: '',
        content: '确定提交吗？',
        success: (res) => {
          if (res.confirm) {
            if (this.id > 0) {
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
    },
  }
};
</script>

<style lang="scss" scoped>
.category_form {
  width: 100%;
  height: 100%;
  padding: 10px;
  .grid-text {
    font-size: 14px;
    color: #606266; /* 你可以根据需要调整颜色 */
  }


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
