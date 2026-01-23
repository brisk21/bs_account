<template>
  <view class="category-list">

    <u-cell-group>
       <u-cell-item  :arrow="false" title="右边可开启删除按钮" :title-style="{color: '#a3a390'}">
          <u-switch slot="right-icon" v-model="action"  ></u-switch>
       </u-cell-item>
    </u-cell-group>
    <u-grid :col="2"  >
      <u-grid-item class="item-list" v-for="(item, index) in  list" :key="index" @click="toEdit(item)">
      <!--“默认”标识-->
        <u-icon v-if="item.is_default" name="star-fill" class="grid-icon" size="30" color="#ff9900"></u-icon>
        <view class="grid-text">{{ item.name }}</view>
        <!-- 删除图标 -->
        <u-icon v-show="action" color="red" name="close-circle" class="delete-icon" @click.native.stop="delCategory(item.id,index,1)"></u-icon>
      </u-grid-item>
    </u-grid>
    <fab :bg="bg" :is-show="hasLogin" icon_name="plus" :url="'/pages/packageA/amount_platform/form'"></fab>
  </view>

</template>

<script>
import fab from "@/my-components/fab/index.vue";
import api from "@/common/amount_platform";
export default {
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
        url: '/pages/packageA/amount_platform/form?id=' + item.id + '&name=' + item.name,
      })
    },
    delCategory(id, index) {
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
      background-color: $uni-theme-color;
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
