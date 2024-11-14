<template>
  <view class="container category_form">
    <u-form-item label="名称">
      <u-input placeholder="请输入分类名称" border :maxlength="10" type="text" clearable class="category_form_input"
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
    <u-form-item label="图标" v-if="iconList.length > 0">
      <u-icon v-if="form.icon" :name="form.icon" size="46"></u-icon>
      <u-button @click="showPopup" size="mini">选择图标</u-button>
      <u-popup mode="bottom" v-model:show="isShowPopup" border-radius="10" round>
        <u-grid :col="3" >
          <u-grid-item v-for="(item, index) in iconList" :key="index" @click="selectIcon(item.icon)">
            <u-icon :name="item.icon" :size="item.size" ></u-icon>
          </u-grid-item>
        </u-grid>
      </u-popup>
    </u-form-item>

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
      // 弹窗是否显示
      isShowPopup: false,
      // uView图标库中的图标名称数组
      iconList: [],
      form:{
        id: 0,
        name: '',
        sort: null,
        type: 20,
        icon: 'red-packet'
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
    this.get_icon_list();
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
      this.$u.api.getCategoryInfo(id).then(res => {
        if (res.code == 0) {
          this.form = res.data;
          this.icon = res.data.icon || 'red-packet';
        }
      })
    },

    showPopup() {
      this.isShowPopup = true;
    },
    selectIcon(iconName) {
      this.isShowPopup = false;
      this.form.icon = iconName;
    },
    radioChange(e) {
      console.log(e);
    },

    get_icon_list() {
      this.$u.api.icon_list().then(res => {
        if (res.code == 0) {
          this.iconList = res.data.list;
        }
      })
    },


    close() {
      uni.navigateBack()
    },
    async billConfirm(e) {
      console.log(e)
    },
    async submitCategory() {

      if (!this.form.name) {
        this.$u.toast('请输入分类名称');
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
              this.$u.api.updateCategory(this.form).then(res => {
                this.$u.toast(res.msg);
                if (res.code == 0) {
                  uni.navigateBack()
                }
              })
            } else {
              this.$u.api.createCategory(this.form).then(res => {
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
