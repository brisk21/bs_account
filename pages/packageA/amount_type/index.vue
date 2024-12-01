<template>
  <view class="category-list">

    <view class="type_selector">
      <u-subsection class="selector" :list="list" @change="typeChange" active-color="#fff" :current="type"
                    mode="subsection">
      </u-subsection>

    </view>
    <u-cell-group>
       <u-cell-item  :arrow="false" title="右边可开启删除按钮" :title-style="{color: '#a3a390'}">
          <u-switch slot="right-icon" v-model="action"  ></u-switch>
       </u-cell-item>
    </u-cell-group>

    <u-grid :col="2" v-show="type === 0" >
      <u-grid-item v-for="(item, index) in out_list" :key="index" @click="toEdit(item)">

        <view class="grid-text">{{ item.name }}</view>
        <!-- 删除图标 -->
        <u-icon v-show="action" color="red" name="close-circle" class="delete-icon" @click.native.stop="delCategory(item.id,index,1)"></u-icon>
      </u-grid-item>
    </u-grid>

    <u-grid :col="2" v-show="type === 1">
      <u-grid-item v-for="(item, index) in in_list" :key="index" @click="toEdit(item)">

        <view class="grid-text">{{ item.name }}</view>
        <!-- 删除图标 -->
        <u-icon v-show="action" color="red" name="close-circle" class="delete-icon" @click.native.stop="delCategory(item.id,index,1)"></u-icon>
      </u-grid-item>
    </u-grid>
    <fab :bg="bg" :is-show="hasLogin" icon_name="plus" :url="'/pages/packageA/amount_type/form?type='+type"></fab>
  </view>
</template>

<script>
import fab from "@/my-components/fab/index.vue";
import api from "@/common/amount_type";
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
      list: ['支出', '收入'],
      type: 0,
      in_list: [],
      out_list: []
    }
  },
  created() {
    //this.getCategory()
  },
  onShow() {
    this.get_list()
  },
  methods: {
    typeChange(index) {
      this.type = index;
    },
    get_list() {
      this.in_list = []
      this.out_list = []
      api.get_list({is_all:1}).then(res => {
        //type10=收入，type20=支出
        if (res.code == 0 && res.data.list.length > 0) {
          for (let i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].type === 10) {
              this.in_list.push(res.data.list[i])
            } else {
              this.out_list.push(res.data.list[i])
            }
          }
        }
      })
    },
    toEdit(item) {
      uni.navigateTo({
        url: '/pages/packageA/amount_type/form?id=' + item.id + '&type=' + item.type + '&name=' + item.name,
      })
    },
    delCategory(id, index, type) {
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
.type_selector {
  width: 100%;
  background-color: $uni-theme-color;
  display: flex;
  justify-content: center;
  padding-bottom: 30rpx;

  .selector {
    width: 80%;
  }
}

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
