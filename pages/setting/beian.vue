<template>
  <view class="container">
    <view class="menu-container">
      <view class="menu-list">
        <u-cell-group>
          <u-cell-item title="随手记备案号" :arrow="false">
            {{ beian_no }}
          </u-cell-item>
          <u-cell-item title="查询链接">
            <u-link :href="'https://beian.miit.gov.cn/'"
                    :under-line="false">https://beian.miit.gov.cn
            </u-link>
          </u-cell-item>
        </u-cell-group>
      </view>
    </view>


  </view>
</template>

<script>
import constConfig from "const"

export default {
  components: {},
  data() {
    return {
      beian_no: constConfig.beian_no
    }
  },

  methods: {},
  onLoad(options) {
    // #ifdef MP-WEIXIN
    this.beian_no = constConfig.beian_no_xcx;
    // #endif
  },
  onShow() {

  }
}
</script>

<style lang="scss">
.container {
  background-color: #f5f5f5;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
}

%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  border-radius: 10upx;
}


.menu-list {
  margin-top: 30upx;
  background: #fff;
  border-radius: 10upx;

  switch {
    transform: scale(0.7, 0.7)
  }
}

.list-item {
  width: 100%;
  padding: 0rpx;
  background-color: #FFFFFF !important;
  border: initial;
  text-align: initial;
}

.list-item::after {
  border: initial;
}
</style>
