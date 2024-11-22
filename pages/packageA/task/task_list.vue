<template>
  <view class="container">
    <view class="data-list">
      <view class="data-item" v-for="(item, index) in list" :key="index" @click="toDetail(item)">
        <view class="data-item-title">
          <text>任务编号:</text> {{item.id}}
        </view>
        <view class="data-item-title">
          <text>任务名称:</text> {{item.name}}
        </view>
        <view class="data-item-content">
          <text>备注：</text> {{item.remark}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list:[
        {
          id:1,
          name:'任务A',
          remark:'ewfwfwf',
          status:1,
          create_time:'2020-01-01'
        },
        {
          id:2,
          name:'任务B',
          remark:'ewfwfwf',
          status:2,
          create_time:'2020-01-01'
        }
      ]
    };
  },
  methods: {
    toDetail(item){
      uni.navigateTo({
        url: '/pages/packageA/task/task_list?id='+item.id,
        fail: (re)=>{
          console.log(' fail', re)

        }
      })
    }
  }
}
</script>

<style lang="scss">
.container{
  padding: 30rpx;
  .data-item{
    display: flex;
    flex-direction: column;
    margin-bottom: 20rpx;
    border: 1px solid #eee;
    border-radius: 10rpx;
    padding: 20rpx;
    .data-item-title{
      display: flex;
      align-items: center;
      margin-bottom: 10rpx;
      .data-item-title-text{
        font-size: 28rpx;
        color: #999;
        margin-right: 10rpx;
      }
    }
  }
}

</style>
