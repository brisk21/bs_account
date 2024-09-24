<template>
  <view class="category-list">

    <view class="type_selector">
      <u-subsection class="selector" :list="list" @change="typeChange" active-color="#fff" :current="type"
                    mode="subsection">
      </u-subsection>

    </view>
    <u-cell-group>
       <u-cell-item :arrow="false" title="管理分类" :title-style="{color: '#1953c3',fontWeight:'bold'}">
          <u-switch slot="right-icon" v-model="action" ></u-switch>
       </u-cell-item>
    </u-cell-group>

    <u-cell-group v-show="type === 0">
      <u-cell-item v-for="(item,index) in out_list" :title="item.name" :arrow="false">
        <u-icon slot="icon" size="40" :name="item.icon"></u-icon>

        <view slot="right-icon" v-if="action">
          <u-button plain   type="primary" size="mini" @click="toEdit(item)">
            <u-icon size="32" margin-right="20" class="edit-btn" name="edit-pen"></u-icon>
          </u-button>
          <u-button style="margin-left: 10px"  size="mini" @click="delCategory(item.id,index,1)">
            <u-icon size="32" name="close"></u-icon>
          </u-button>
        </view>
      </u-cell-item>
    </u-cell-group>

    <u-cell-group v-show="type === 1">
      <u-cell-item v-for="(item,index) in in_list" :title="item.name" :arrow="false">
        <u-icon slot="icon" size="40" :name="item.icon"></u-icon>

        <view slot="right-icon" v-if="action">
          <u-button plain   type="primary" size="mini" @click="toEdit(item)">
            <u-icon size="32" margin-right="20" class="edit-btn" name="edit-pen"></u-icon>
          </u-button>
          <u-button style="margin-left: 10px"  size="mini" @click="delCategory(item.id,index,1)">
            <u-icon size="32" name="close"></u-icon>
          </u-button>
        </view>
      </u-cell-item>
    </u-cell-group>
    <view class="bottom_btn">
      <u-button type="primary" plain @click="open">新增</u-button>
    </view>


  </view>
</template>

<script>

export default {
  components: {},
  data() {
    return {
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
    console.log('show')
    this.getCategory()
  },
  methods: {
    open() {
      uni.navigateTo({
        url: '/pages/setting/form',
        success: (res) => {
        },
        fail: (res) => {
        }
      })
    },

    typeChange(index) {
      this.type = index;
    },
    getCategory() {
      this.$u.api.getCategory(10).then(res => {
        // console.log(res)
        this.in_list = res.data
      })
      this.$u.api.getCategory(20).then(res => {
        // console.log(res)
        this.out_list = res.data
      })
    },
    toEdit(item) {
      uni.navigateTo({
        url: '/pages/setting/form?id=' + item.id + '&type=' + item.type + '&name=' + item.name,
        success: (res) => {
        },
        fail: (res) => {
          console.log('失败', res)
        }
      })
    },
    delCategory(id, index, type) {
      uni.showModal({
        title: '提示',
        content: '确定删除吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.delCategory(id).then(res => {
              if (res.code == 1) {
                this.$u.toast(res.msg);
                return
              }
              this.getCategory()
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

}
</style>
