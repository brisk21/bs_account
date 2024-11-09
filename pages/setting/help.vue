<template>
  <view class="container">
    <view v-if="list.length <= 0" class="empty">
      <u-empty text="暂无数据" mode="message"></u-empty>
    </view>
    <view>
      <u-collapse>
        <u-collapse-item :title="item.title" v-for="(item, index) in list" :key="index">
          <rich-text :nodes="item.content"></rich-text>
        </u-collapse-item>
      </u-collapse>



      <view class="u-p-t-30 u-p-b-30">
         没有找到帮助，去提交反馈？<text class="u-m-l-10 feedback" @click="to_feedback">去反馈</text>
      </view>
    </view>
  </view>

</template>

<script>
import api from "@/common/help";

export default {
  data() {
    return {
      list: [],
    };
  },
  onLoad() {
    this.getData()
  },
  created() {
    // this.getData()
  },
  methods: {
    getData() {
      uni.showLoading()
      api.get_list().then(res => {
        if (res.code === 0) {
          this.list = res.data.list
        }
      }).finally(() => {
        uni.hideLoading()
      })
    },
    to_feedback() {
      uni.navigateTo({
        url: '/pages/setting/feedback'
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;

  .empty {
    padding: 100rpx 0;
  }

  .u-collapse {
    background-color: #fff;
    border-radius: 10rpx;
    margin-bottom: 30rpx;
    margin-top: 20rpx;
  }

  .u-collapse-item {
    background-color: #fff;
  }

  .u-collapse-item__title {
    padding: 30rpx 30rpx 30rpx 30rpx;
  }

  .u-collapse-item__body {
    padding: 30rpx;
  }

  .u-collapse-item__body-text {
    color: #999;
  }
  .feedback{
    color: dodgerblue;
  }
}
</style>
