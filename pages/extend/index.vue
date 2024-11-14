<template>
  <view class="container">
    <u-empty v-if="list.length <=0" class="empty" text="敬请期待" mode="list" margin-top="100"></u-empty>

    <view v-else class="extend" >
      <view class="u-search-box">
        <u-search :shape="'round'" :clearable="false" :show-action="true" :placeholder="'搜索'" :border="false" :shape-radius="'30rpx'" :background-color="'#f5f5f5'" :action-text="'搜索'" @click="search" @clickAction="search"></u-search>
      </view>
      <u-grid :col="3" >
      <u-grid-item v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <u-icon :name="item.icon" :size="46"></u-icon>
        <view class="grid-text">{{ item.name }}</view>
        <!-- 删除图标 -->
        <u-icon v-show="action" color="red" name="close-circle" class="delete-icon" @click.native.stop="delCategory(item.id,index,1)"></u-icon>
      </u-grid-item>
    </u-grid>
    </view>

  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: '倒数日',
          icon: 'question-circle',
          id: 1
        },
        {
          name: '日程提醒',
          icon: 'question-circle',
          id: 2
        },
        {
          name: '执行者',
          icon: 'question-circle',
          id: 3
        },

      ],
      action: false



    };
  },
  methods: {
    toDetail(item) {
      this.$u.toast('暂未开放，敬请期待！')
    },
  }
}
</script>

<style lang="scss">
.container{

  height: 100%;
  overflow: hidden;
  .extend{
    padding: 8rpx;
    margin-top: 20rpx;
    .u-search-box{
      margin-bottom: 20rpx;
    }
  }
}
</style>
