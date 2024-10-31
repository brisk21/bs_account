<template>
  <view class="container">
    <u-time-line v-if="list.length > 0">
      <u-time-line-item nodeTop="2" v-for="(item, index) in list" :key="index">
        <template  v-slot:node>
          <view :class="'u-node '+(index==0?'item-active':'item-unactive')" >
            <u-icon :name="index===0?'clock':'map'" color="#fff" :size="24"></u-icon>
          </view>
        </template>
        <template v-slot:content>
          <view>
            <view class="u-order-title">{{item.up_time}}</view>
            <view class="u-order-desc">
              <rich-text :nodes="item.content"></rich-text>
            </view>
            <view class="u-order-time"></view>
          </view>
        </template>
      </u-time-line-item>

    </u-time-line>
  </view>
</template>

<script>

export default {
  components: {

  },
  data() {
    return {
      list:[],
      form: {
        page:0,
        size:10
      }
    }
  },
  onLoad() {
    this.getList()
  },
  onShow() {

  },
  //触底
  onReachBottom() {
    console.log("触底")
    this.is_fresh = true;
    let that = this;
    that.getList();
    setTimeout(function () {
      that.is_fresh = false;
    }, 300)

  },
  methods: {
    getList() {
      this.form.page += 1
      this.$u.api.updateLog(this.form).then(res => {
        if (res.code == 0) {
          if (res.data.list.length >0){
            this.list = this.list.concat(res.data.list)
          }

        }
      })
    },
  },

}
</script>

<style lang="scss">
.container {
  padding-left: 20px;
  padding-right: 10px;
  margin-top: 10px;
  .u-node {
    width: 44rpx;
    height: 44rpx;
    border-radius: 100rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #d0d0d0;
  }
  .item-active{
    background: #19be6b;
  }
  .item-unactive{
    background: #d0d0d0;
  }

  .u-order-title {
    color: #333333;
    font-weight: bold;
    font-size: 32rpx;
  }

  .u-order-desc {
    color: rgb(150, 150, 150);
    font-size: 28rpx;
    margin-bottom: 6rpx;
  }

  .u-order-time {
    color: rgb(200, 200, 200);
    font-size: 26rpx;
  }
}

</style>
