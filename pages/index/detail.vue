<template>
  <view class="container">
    <view class="info_box">
      <view class="line">
        <view style="font-size: 50rpx;
				min-height: 100rpx;
				height: 100rpx;
				width: 50%;">
          ￥{{ info.amount }}
        </view>
      </view>

      <u-line></u-line>

      <view class="line">
        <text class="type">日期：</text>
        <view style="font-size: 28rpx;font-weight: 600;">
          {{ info.date }}
        </view>
      </view>
      <view class="line">
        <text class="type">分类：</text>
        <view style="font-size: 25rpx;font-weight: 600;">
          {{ info.category.name }}
        </view>
      </view>

      <view class="line">
        <text class="type">{{ info.type === 10 ? '收入' : '支出' }}方式：</text>
        <view style="font-size: 25rpx;font-weight: 600;">
          {{ info.amount_type || '无' }}
        </view>
      </view>
      <view class="line" v-if="info.budget_title">
        <text class="type">关联预算：</text>
        <view style="font-size: 25rpx;font-weight: 600;">
          {{ info.budget_title || '无' }}
        </view>
      </view>
      <view class="line" v-if="info.cashbook_title">
        <text class="type">所属账本：</text>
        <view style="font-size: 25rpx;font-weight: 600;">
          {{ info.cashbook_title || '无' }}
        </view>
      </view>
      <view class="line" v-if="info.cycle">
        <text class="type">周期执行：</text>
        <view style="font-size: 25rpx;font-weight: 600;">
          {{ info.cycle && info.cycle.cycle_type || '无' }}
        </view>
        <view v-if="info.cycle" style="font-size: 25rpx;color: red">
          (下次：{{ info.cycle.next_time || '--' }})
        </view>
      </view>
      <view class="line">
        <text class="type">备注：</text>
        <view style="font-size: 28rpx;width: 70%;text-align: left">
          {{ info.remark || '暂无备注' }}
        </view>
      </view>
      <view class="line">
        <text class="type">记录人：</text>
        <view style="font-size: 25rpx;font-weight: 600;color: red">
          {{ info.username || '--' }}
        </view>
      </view>
      <view class="line" v-if="info.image_list">
        <text class="type">附件：</text>
        <view class="images" style="font-size: 28rpx;width: 70%;">
          <u-image v-for="(src,index1) in  info.image_list" @click="previewImg(info.image_list)" height="150rpx"
                   width="150rpx" :src="src"></u-image>
        </view>
      </view>

      <view style="display: flex; padding: 20rpx;" v-if="info.is_owner===1">
        <view style="margin: auto;">
          <u-button type="success" size="medium" @click="toEdit()">编辑</u-button>
        </view>
        <view style="margin: auto;">
          <u-button type="" size="medium" @click="delCashflow()">删除</u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      info: {
        amount: "0.00",
        category: {
          name: "教育"
        },
        id: null,
        name: "教育",
        date: "2024-10-12",
        image: null,
        remark: null,
      },
      id: null
    }
  },
  methods: {
    previewImg(urls) {
      uni.previewImage({
        current: 0,
        urls: urls
      });
    },
    getCashflowInfo() {
      this.$u.api.getCashflowInfo(this.id).then(res => {
        if (res.code !== 0) {
          this.$u.toast(res.msg)
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
          return;
        }
        this.info = res.data
      })
    },
    toEdit() {
      let id = this.info.id
      uni.navigateTo({
        url: `/pages/bill/form?id=${id}` + '&type=' + this.info.type
      });
    },
    delCashflow() {
      uni.showModal({
        title: '',
        content: '确定删除吗？',
        success: (res) => {
          if (res.confirm) {
            this.$u.api.delCashflow(this.info.id).then(res => {
              this.$u.toast('删除成功');
              uni.navigateBack()
            })
          } else if (res.cancel) {
            //this.$u.toast('已取消');
          }
        }
      })
    }
  },
  onShow() {
    this.getCashflowInfo()
  },
  onLoad(options) {
    if (options.id) {
      this.id = options.id
    }
  }
}
</script>

<style lang="scss" scoped>
.info_box {
  padding: 30rpx;

  .del-btn {
    position: absolute;
    top: 5rpx;
    left: 645rpx;
    z-index: 10;

    border-radius: 100rpx;
    width: 44rpx;
    height: 44rpx;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;

  }
}

.line {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 26rpx 32rpx;
  font-size: 28rpx;
  line-height: 54rpx;
  color: #606266;
  background-color: #fff;
}

.type {
  font-size: 28rpx;
  padding-right: 10rpx;
}

.photo_icon {
  width: 100rpx;
  height: 100rpx;
  margin-left: auto;
}

.images {
  display: flex;
  flex-wrap: wrap;
}
</style>
