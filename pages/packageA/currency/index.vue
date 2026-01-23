<template>
  <view class="currency-list" :style="themeStyles">
    <u-cell-group>
       <u-cell-item  :arrow="false" title="开启可删除币种" :title-style="{color: '#a3a390'}">
          <u-switch slot="right-icon" v-model="action"  ></u-switch>
       </u-cell-item>
    </u-cell-group>

    <u-grid :col="2">
      <u-grid-item class="item-list" v-for="(item, index) in list" :key="index" @click="toEdit(item)">
        <u-icon v-if="item.is_default" name="star-fill" class="grid-icon" size="30" color="#ff9900"></u-icon>
        <view class="grid-text">{{ item.name }}</view>
        <view class="grid-symbol">{{ item.symbol }}</view>
        <u-icon v-show="action" color="red" name="close-circle" class="delete-icon" @click.native.stop="delCurrency(item.id, index)"></u-icon>
      </u-grid-item>
    </u-grid>
    <fab :bg="bg" :is-show="hasLogin" icon_name="plus" :url="'/pages/packageA/currency/form'"></fab>
  </view>
</template>

<script>
import fab from "@/my-components/fab/index.vue";
import api from "@/common/currency";
import themeMixin from '@/common/theme-mixin.js'
export default {
  mixins: [themeMixin],
  components: {
    fab
  },
  data() {
    return {
      bg: {
        backgroundColor: '#20b4bc',
        color: "white"
      },
      action: false,
      categoryName: '',
      show: false,
      list: [],
    }
  },
  created() {
    //this.getCategory()
  },
  onShow() {
    this.get_list()
    // 应用主题颜色到fab按钮
    this.bg.backgroundColor = this.themePrimary
  },
  methods: {

    get_list() {
      this.list = []
      api.get_list({is_all:1}).then(res => {
        if (res.code == 0 && res.data.list.length > 0) {
          this.list = res.data.list
        }
      })
    },
    toEdit(item) {
      uni.navigateTo({
        url: '/pages/packageA/currency/form?id=' + item.id + '&name=' + item.name + '&symbol=' + item.symbol,
      })
    },
    delCurrency(id, index) {
      uni.showModal({
        title: '',
        content: '确定删除吗？',
        success: (res) => {
          if (res.confirm) {
            api.remove({id:id}).then(res => {
              if (res.code == 1) {
                this.$u.toast(res.msg);
                return
              }
              this.$nextTick(function (){
                this.get_list()
              })

              this.$u.toast('删除成功');
            })

          } else if (res.cancel) {
            this.$u.toast('已取消');
          }
        }
      })


    }
  },

}
</script>

<style lang="scss">

.category-list {
  .bottom_btn {
    width: 100%;
    position: relative;
    bottom: 0rpx;

    .add_btn {
      width: 80%;
      background-color: var(--theme-primary, #42b479);
      color: $uni-text-color-inverse;
    }

    .edit-btn {
      margin-right: 30px !important;
    }
  }

  .u-grid-item{
    height: 60px;
  }
  .grid-text {
    font-size: 28rpx;
    margin-top: 4rpx;
    color: #606266; /* 你可以根据需要调整颜色 */
  }

  .delete-icon {
    position: absolute;
    top: 8px;
    right: 20px;
    font-size: 36rpx;
    color: #f56c6c;
  }


}
</style>