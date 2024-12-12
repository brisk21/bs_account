<template>
  <view class="container">
    <view v-if="list.length <= 0" class="empty">
      <u-empty text="暂无数据" mode="message"></u-empty>
    </view>
    <view>
      <u-cell-group>
        <u-cell-item icon="question-circle" :title="item.title"  v-for="(item, index) in list" :key="index" @click="open(index,item)"></u-cell-item>
      </u-cell-group>



      <u-popup v-model="show" mode="bottom" border-radius="15" length="60%" safe-area-inset-bottom closeable	>
        <view class="content">
          <u-parse :html="content" :selectable="true"></u-parse>
        </view>
      </u-popup>

      <view class="u-p-t-30 u-p-b-30">
         没有找到帮助，去提交反馈？<text class="u-m-l-10 feedback" @click="gotoPath('/pages/setting/feedback',true)">去反馈</text>
        <view class="u-p-t-30 u-p-b-30">
          版本问题？<text class="u-m-l-10 feedback" @click="gotoPath('/pages/packageA/h5/index',true)">去下载新版</text>
        </view>

      </view>
    </view>
  </view>

</template>

<script>
import api from "@/common/help";

export default {
  data() {
    return {
      content: '',
      show: false,
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
    open(index,item){

      console.log(item)
      this.content = item.content
      this.show = true
    },
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

  }
}
</script>

<style lang="scss">
.container {
  padding: 30rpx;

  .empty {
    padding: 100rpx 0;
  }
  .content{
    min-height: 600rpx;
    padding: 80rpx 10px 10px;
  }

  .feedback{
    color: dodgerblue;
  }
}
</style>
