<template>
  <view v-if="hasLogin" ref="writeBtn" class="write_btn"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        :style="{ transform: `translate(${btnPosition.x}px, ${btnPosition.y}px)` }" @click="onClickIcon()">
    <u-icon class="icon" name="edit-pen"></u-icon>
  </view>
</template>

<script>
export default {
  data() {
    return {
      btnPosition: {x: 0, y: 0},
      touchStartX: 0,
      touchStartY: 0
    }
  },
  mounted() {

  },

  methods: {
    handleTouchStart(e) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    },
    handleTouchMove(e) {
      e.preventDefault(); // 阻止默认行为，如页面滚动等
      const diffX = e.touches[0].clientX - this.touchStartX;
      const diffY = e.touches[0].clientY - this.touchStartY;

      this.btnPosition.x += diffX;
      this.btnPosition.y += diffY;

      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    },
    onClickIcon() {
      uni.navigateTo({
        url: '/pages/bill/add'
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.write_btn {
  position: fixed;
  bottom: 120rpx;
  right: 50rpx;
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #18B566;
  z-index: 100;
  display: flex;
  transform: translate(0, 0); /* 添加这个属性以允许后续的位置更新 */
  .icon {
    justify-content: center;
    width: 100%;
    color: #FFFFFF;
    font-size: 50rpx;
    /* #ifdef MP-TOUTIAO */
    // 头条小程序 没居中
    text-align: center;
    padding: 15rpx 0;
    /* #endif */
  }
}
</style>
